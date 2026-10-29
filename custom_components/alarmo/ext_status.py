"""Status strip and "Why won't it arm?" (ext.13). Read-only."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.components import websocket_api

from . import const
from .house_config import find_mode, open_entities

READY_WORDS = ("ready",)


def _ext(hass):
    from .ext_websockets import DATA_EXT  # noqa: PLC0415

    return hass.data[DATA_EXT]


def panel_ready_entity(hass: HomeAssistant, panel_entity: str) -> str | None:
    """The physical panel's "Ready" binary_sensor (same device first, then same integration entry)."""
    reg = er.async_get(hass)
    panel = reg.async_get(panel_entity)
    if not panel or not panel.config_entry_id:
        return None
    cands = []
    for entry in er.async_entries_for_config_entry(reg, panel.config_entry_id):
        if entry.domain != "binary_sensor":
            continue
        text = f"{entry.entity_id} {entry.original_name or ''} {entry.name or ''}".lower()
        if any(w in text for w in READY_WORDS):
            cands.append((entry.device_id != panel.device_id, entry.entity_id))
    return sorted(cands)[0][1] if cands else None


def _areas(hass) -> dict[str, Any]:
    return (hass.data.get(const.DOMAIN) or {}).get("areas") or {}


def status_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Everything the status strip shows (states themselves come from hass.states in the browser)."""
    ext = _ext(hass)
    data = hass.data.get(const.DOMAIN) or {}
    alarms = [
        {"key": aid, "entity_id": ent.entity_id, "name": ent.name}
        for aid, ent in _areas(hass).items()
        if ent is not None and ent.entity_id
    ]
    master = data.get("master")
    if master is not None and master.entity_id:
        alarms.append({"key": "master", "entity_id": master.entity_id, "name": master.name})
    house = ext.house.settings
    cur = find_mode(house, house["current"])
    links = []
    for key, link in (ext.panel.settings.get("links") or {}).items():
        links.append(
            {
                "key": key,
                "panel_entity": link["panel_entity"],
                "mode": link["mode"],
                "running": key in ext.panel.links,
                "ready_entity": panel_ready_entity(hass, link["panel_entity"]),
            }
        )
    return {
        "house": {
            "enabled": house["enabled"],
            "shadow": house["enabled"] and house.get("run_mode") == "shadow",
            "current": cur["id"] if cur else None,
            "name": cur["name"] if cur else None,
            "icon": cur["icon"] if cur else None,
            "source": house["source"],
        },
        "alarms": alarms,
        "links": links,
        "rules_pending": ext.rules.pending_count,
    }


def _reason(hass, entity_id: str, state: str, cfg: dict) -> str:
    if hass.states.get(entity_id) is None:
        return "not found in Home Assistant"
    if state == "unavailable":
        return "unavailable (Trigger when unavailable is on)"
    return "open"


def why_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Per partition and Arm Mode: what blocks arming right now (Alarmo's own check)."""
    handler = (hass.data.get(const.DOMAIN) or {}).get("sensor_handler")
    ext = _ext(hass)
    areas = []
    for area_id, ent in _areas(hass).items():
        if ent is None or not ent.entity_id or handler is None:
            continue
        cfg = handler._config
        modes = []
        for mode, mcfg in ent._config[const.ATTR_MODES].items():
            if not mcfg.get(const.ATTR_ENABLED):
                continue
            # same check as Alarmo's "ready to arm" (zones must be closed when the arming completes)
            blocking, bypassed = handler.validate_arming_event(area_id, mode)
            exit_time = int(mcfg.get(const.ATTR_EXIT_TIME) or 0)
            items = []
            for eid, st in sorted(blocking.items()):
                c = cfg.get(eid, {})
                motion = c.get("type") == "motion"
                items.append(
                    {
                        "entity_id": eid,
                        "state": st,
                        "reason": _reason(hass, eid, st, c),
                        # Alarmo ignores open motion zones for "ready" while disarmed
                        "motion": motion,
                        "exit_delay": bool(c.get("use_exit_delay")),
                    }
                )
            modes.append(
                {
                    "mode": mode,
                    "ready": not [i for i in items if not i["motion"]],
                    "blocking": items,
                    "exit_time": exit_time,
                    "bypassed": sorted(bypassed),
                }
            )
        st = hass.states.get(ent.entity_id)
        areas.append(
            {
                "area_id": area_id,
                "entity_id": ent.entity_id,
                "name": ent.name,
                "state": st.state if st else None,
                "modes": modes,
            }
        )
    # physical panels
    panels = []
    for key, link in (ext.panel.settings.get("links") or {}).items():
        ready = panel_ready_entity(hass, link["panel_entity"])
        rst = hass.states.get(ready) if ready else None
        panels.append(
            {
                "key": key,
                "panel_entity": link["panel_entity"],
                "mode": link["mode"],
                "ready_entity": ready,
                "ready": None if rst is None else rst.state == "on",
            }
        )
    # House Modes with a readiness check
    house = ext.house.settings
    reg = er.async_get(hass)
    labels = {lab for m in house["modes"] for lab in m["readiness"].get("labels", [])}
    members = {lab: [e.entity_id for e in er.async_entries_for_label(reg, lab)] for lab in labels}
    states = {e: s.state for e, s in ((s.entity_id, s) for s in hass.states.async_all())}
    house_modes = []
    if house["enabled"]:
        for m in house["modes"]:
            r = m["readiness"]
            if not (r.get("entities") or r.get("labels")):
                continue
            house_modes.append(
                {
                    "id": m["id"],
                    "name": m["name"],
                    "action": r.get("action", "warn"),
                    "open": open_entities(states, r, members),
                }
            )
    return {"areas": areas, "panels": panels, "house_modes": house_modes}


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_status(hass, connection, msg):
    """Status strip data."""
    connection.send_result(msg["id"], status_payload(hass))


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/why"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_why(hass, connection, msg):
    """What blocks arming, per partition and Arm Mode."""
    connection.send_result(msg["id"], why_payload(hass))


STATUS_COMMANDS = (ws_status, ws_why)
