"""House Mode Actions (step 1+2 of PLAN-house-mode-actions.md).

Native HA automations, scripts and scenes are related to House Modes with native HA labels named
"House Mode: <mode>". The alarm reads them, suggests labels for automations and scripts that use the House Mode
(auto-detect), and applies or removes the labels. It never runs or changes the automations themselves, apart from
the enable/disable/run buttons in the panel, which call HA's normal services.
"""

from __future__ import annotations

import re
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import entity_registry as er
from homeassistant.components import websocket_api

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

LABEL_PREFIX = "House Mode: "
LABEL_ICON = "mdi:home-switch"
DOMAINS = ("automation", "script", "scene")
# entities / events that mean "this uses the House Mode"
HOUSE_ENTITY_HINT = re.compile(r"house_mode", re.I)
HOUSE_EVENT = "house_modes_house_mode_changed"


def _ext(hass) -> ExtManager:
    from .ext_websockets import DATA_EXT  # noqa: PLC0415

    return hass.data[DATA_EXT]


def label_name(mode: str) -> str:
    """Label for a House Mode."""
    return f"{LABEL_PREFIX}{mode}"


def mode_names(hass: HomeAssistant, ext: ExtManager) -> tuple[list[str], str]:
    """House Mode names and where they come from.

    The integration's House Modes if any are defined; otherwise the options of the House Mode input_select
    (the setting, else input_select.house_mode / input_select.house_mode_selector).
    """
    house = ext.house.settings
    if house["modes"]:
        return [m["name"] for m in house["modes"]], "house_modes"
    for ent in (house.get("input_select"), "input_select.house_mode", "input_select.house_mode_selector"):
        st = hass.states.get(ent) if ent else None
        if st is not None and st.attributes.get("options"):
            opts = [o for o in st.attributes["options"] if o and o.lower() not in ("unknown", "none", "-")]
            return opts, ent
    return [], "none"


def _strings(obj: Any) -> list[str]:
    """Every string in a config (keys and values)."""
    out: list[str] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            out.append(str(k))
            out += _strings(v)
    elif isinstance(obj, list | tuple | set):
        for v in obj:
            out += _strings(v)
    elif isinstance(obj, str):
        out.append(obj)
    return out


def detect(config: dict | None, modes: list[str]) -> dict[str, Any] | None:
    """Does a config use the House Mode, and which modes does it name?

    Returns None when it does not use the House Mode, else {"modes": [...], "any": bool}. "any" means it uses the
    House Mode without naming a specific one (e.g. "on every House Mode change").
    """
    if not config:
        return None
    strings = _strings(config)
    uses = any(HOUSE_ENTITY_HINT.search(s) for s in strings) or any(HOUSE_EVENT in s for s in strings)
    if not uses:
        return None
    exact = {s.strip().lower() for s in strings if isinstance(s, str)}
    named = [m for m in modes if m.lower() in exact]
    return {"modes": named, "any": not named}


def house_entities(hass: HomeAssistant, ext: ExtManager) -> set[str]:
    """Entities whose state is the House Mode: the House Mode select and the user's helpers."""
    s = ext.house.settings
    ents = {"select.house_mode", "input_select.house_mode", "input_select.house_mode_selector"}
    ents |= {e for e in (s.get("input_select"), s.get("current_entity")) if e}
    return ents


def _as_list(v: Any) -> list:
    if v is None:
        return []
    return list(v) if isinstance(v, list | tuple) else [v]


def reactions(config: dict | None, entities: set[str], modes: list[str]) -> dict[str, Any] | None:
    """Which House Mode changes trigger an automation, read from its triggers (not its text).

    Returns None when no trigger is a House Mode change, else {"to": [...], "from": [...], "any": bool}: entering
    the modes in "to", leaving the modes in "from", or any change ("any", e.g. a trigger with no to/from, the
    house_modes_house_mode_changed event without a mode, or a template trigger).
    """
    if not config:
        return None
    by_lower = {m.lower(): m for m in modes}
    to: set[str] = set()
    frm: set[str] = set()
    any_change = False
    found = False
    for t in _as_list(config.get("triggers", config.get("trigger"))):
        if not isinstance(t, dict) or t.get("enabled") is False:
            continue
        kind = t.get("trigger", t.get("platform"))
        if kind == "state" and entities & set(_as_list(t.get("entity_id"))) and not t.get("attribute"):
            found = True
            t_to = [by_lower[str(x).lower()] for x in _as_list(t.get("to")) if str(x).lower() in by_lower]
            t_from = [by_lower[str(x).lower()] for x in _as_list(t.get("from")) if str(x).lower() in by_lower]
            to.update(t_to)
            frm.update(t_from)
            if not t_to and not t_from:
                any_change = True
        elif kind == "event" and t.get("event_type") == HOUSE_EVENT:
            found = True
            data = t.get("event_data") or {}
            named = [by_lower[str(x).lower()] for x in _as_list(data.get("name")) if str(x).lower() in by_lower]
            if named:
                to.update(named)
            else:
                any_change = True
        elif kind == "template" and HOUSE_ENTITY_HINT.search(str(t.get("value_template", ""))):
            found = True
            any_change = True
    if not found:
        return None
    return {"to": sorted(to, key=modes.index), "from": sorted(frm, key=modes.index), "any": any_change}


SELECT_ACTIONS = ("input_select.select_option", "select.select_option")
SET_HOUSE_MODE = "house_modes.set_house_mode"


def house_roles(hass: HomeAssistant, ext: ExtManager) -> dict[str, set[str]]:
    """Which entity is which: the House Mode select, the user's selector, and the current-mode helper."""
    s = ext.house.settings
    selector = s.get("input_select") or "input_select.house_mode_selector"
    current = {e for e in (s.get("current_entity"), "input_select.house_mode") if e and e != selector}
    return {"select": {"select.house_mode"}, "selector": {selector}, "current": current}


def _walk_actions(obj: Any):
    """Every action dict in a sequence, including those inside choose / if / parallel / repeat / sequence."""
    if isinstance(obj, list):
        for x in obj:
            yield from _walk_actions(x)
    elif isinstance(obj, dict):
        if obj.get("enabled") is False:
            return
        if "action" in obj or "service" in obj:
            yield obj
        for v in obj.values():
            if isinstance(v, list | dict):
                yield from _walk_actions(v)


def _targets(a: dict) -> list[str]:
    out: list[str] = []
    for src in (a.get("target"), a.get("data"), a):
        if isinstance(src, dict):
            out += [str(x) for x in _as_list(src.get("entity_id"))]
    return out


def setters(config: dict | None, roles: dict[str, set[str]], modes: list[str]) -> list[dict[str, Any]] | None:
    """How an automation changes the House Mode, read from its actions.

    Returns None when it never does, else one entry per action: {"mode": name or None, "template": bool,
    "via": "service" | "select" | "selector" | "current", "source": the source it passes, or None}.
    """
    if not config:
        return None
    by_lower = {m.lower(): m for m in modes}
    out: list[dict[str, Any]] = []
    for a in _walk_actions(config.get("actions", config.get("action"))):
        name = a.get("action", a.get("service"))
        data = a.get("data") if isinstance(a.get("data"), dict) else {}
        if name == SET_HOUSE_MODE:
            via, raw, source = "service", data.get("mode"), data.get("source")
        elif name in SELECT_ACTIONS:
            ents = set(_targets(a))
            via = next((r for r in ("select", "selector", "current") if ents & roles[r]), None)
            if via is None:
                continue
            raw, source = data.get("option"), None
        else:
            continue
        raw = "" if raw is None else str(raw)
        template = "{{" in raw or "{%" in raw
        mode = None if template else by_lower.get(raw.strip().lower())
        if not template and mode is None and raw:
            mode = raw.strip()
        out.append({"mode": mode, "template": template, "via": via,
                    "source": source if isinstance(source, str) and "{{" not in source else None})
    return out or None


def trigger_kinds(config: dict | None) -> list[str]:
    """Short names of an automation's triggers: time, presence, house_mode, alarm, event, sun, template, other."""
    kinds: list[str] = []
    for t in _as_list((config or {}).get("triggers", (config or {}).get("trigger"))):
        if not isinstance(t, dict) or t.get("enabled") is False:
            continue
        k = t.get("trigger", t.get("platform"))
        ents = [str(x) for x in _as_list(t.get("entity_id"))]
        if k in ("time", "time_pattern"):
            kind = "time"
        elif k == "zone" or (k == "state" and any(e.startswith(("person.", "device_tracker.")) for e in ents)):
            kind = "presence"
        elif k == "state" and any(HOUSE_ENTITY_HINT.search(e) for e in ents):
            kind = "house_mode"
        elif k == "state" and any(e.startswith("alarm_control_panel.") for e in ents):
            kind = "alarm"
        elif k in ("event", "sun", "template", "state", "numeric_state"):
            kind = k
        else:
            kind = "other"
        if kind not in kinds:
            kinds.append(kind)
    return kinds


def _raw_configs(hass: HomeAssistant) -> dict[str, dict]:
    """entity_id -> raw config of loaded automations and scripts."""
    out: dict[str, dict] = {}
    for domain in ("automation", "script"):
        comp = hass.data.get(domain)
        for ent in getattr(comp, "entities", None) or []:
            raw = getattr(ent, "raw_config", None)
            if ent.entity_id and isinstance(raw, dict):
                out[ent.entity_id] = raw
    return out


def items_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Every automation, script and scene with its House Mode labels and suggestions."""
    ext = _ext(hass)
    modes, source = mode_names(hass, ext)
    reg = er.async_get(hass)
    labels = lr.async_get(hass)
    mode_by_label: dict[str, str] = {}
    for lab in labels.async_list_labels():
        if lab.name.startswith(LABEL_PREFIX):
            mode_by_label[lab.label_id] = lab.name[len(LABEL_PREFIX) :]
    raw = _raw_configs(hass)
    ents = house_entities(hass, ext)
    roles = house_roles(hass, ext)
    items = []
    for st in hass.states.async_all(DOMAINS):
        eid = st.entity_id
        domain = eid.split(".", 1)[0]
        entry = reg.async_get(eid)
        labelled = sorted({mode_by_label[x] for x in (entry.labels if entry else set()) if x in mode_by_label})
        found = detect(raw.get(eid), modes) if domain in ("automation", "script") else None
        if domain == "automation":
            edit_id = st.attributes.get("id")
        elif domain == "script":
            edit_id = eid.split(".", 1)[1]
        else:
            edit_id = st.attributes.get("id")
        items.append(
            {
                "entity_id": eid,
                "kind": domain,
                "name": st.attributes.get("friendly_name") or eid,
                "state": st.state,
                "last_triggered": st.attributes.get("last_triggered"),
                "edit_id": edit_id,
                "editable": entry is not None,
                "labels": labelled,
                "detected": found,
                "reacts": reactions(raw.get(eid), ents, modes) if domain == "automation" else None,
                "sets": setters(raw.get(eid), roles, modes) if domain == "automation" else None,
                "trigger_kinds": trigger_kinds(raw.get(eid)) if domain == "automation" else [],
                "asks_user": domain == "automation" and "mobile_app_notification_action" in str(raw.get(eid) or ""),
            }
        )
    return {
        "modes": modes,
        "modes_source": source,
        "label_prefix": LABEL_PREFIX,
        "items": sorted(items, key=lambda i: (DOMAINS.index(i["kind"]), i["name"].lower())),
    }


def _label_id(hass: HomeAssistant, mode: str) -> str:
    """The label for a mode, created if missing."""
    labels = lr.async_get(hass)
    name = label_name(mode)
    lab = labels.async_get_label_by_name(name) or labels.async_create(name, icon=LABEL_ICON)
    return lab.label_id


def set_modes(hass: HomeAssistant, entity_id: str, modes: list[str]) -> list[str]:
    """Set an entity's House Mode labels to exactly ``modes``; its other labels are kept."""
    reg = er.async_get(hass)
    entry = reg.async_get(entity_id)
    if entry is None:
        raise ValueError(f"{entity_id} has no unique ID, so Home Assistant cannot label it (give it an id first)")
    labels = lr.async_get(hass)
    ours = {lab.label_id for lab in labels.async_list_labels() if lab.name.startswith(LABEL_PREFIX)}
    keep = {x for x in entry.labels if x not in ours}
    new = keep | {_label_id(hass, m) for m in modes}
    reg.async_update_entity(entity_id, labels=new)
    return sorted(modes)


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/house_actions/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_actions_get(hass, connection, msg):
    """Modes, automations/scripts/scenes, labels, suggestions."""
    connection.send_result(msg["id"], items_payload(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_modes/ext/house_actions/set",
        vol.Required("changes"): [{vol.Required("entity_id"): str, vol.Required("modes"): [str]}],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_actions_set(hass, connection, msg):
    """Set House Mode labels for one or more entities."""
    done, errors = [], []
    for ch in msg["changes"]:
        try:
            set_modes(hass, ch["entity_id"], ch["modes"])
            done.append(ch["entity_id"])
        except ValueError as err:
            errors.append(str(err))
    connection.send_result(msg["id"], {"done": done, "errors": errors, **items_payload(hass)})


HOUSE_ACTION_COMMANDS = (ws_house_actions_get, ws_house_actions_set)
