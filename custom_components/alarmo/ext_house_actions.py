"""House Mode Actions (step 1+2 of PLAN-house-mode-actions.md).

Native HA automations, scripts and scenes are related to House Modes with native HA labels named
"House Mode: <mode>". Alarmo reads them, suggests labels for automations and scripts that use the House Mode
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
HOUSE_EVENT = "alarmo_house_mode_changed"


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


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/house_actions/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_actions_get(hass, connection, msg):
    """Modes, automations/scripts/scenes, labels, suggestions."""
    connection.send_result(msg["id"], items_payload(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/house_actions/set",
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
