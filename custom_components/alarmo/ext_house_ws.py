"""Websocket commands + service for House Modes (admin only)."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.core import ServiceCall, HomeAssistant, SupportsResponse
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.service import async_register_admin_service

from . import const, house_detect
from .house_modes import HouseModeError
from .ext_panel_ws import _link_targets
from .house_config import SOURCES
from .panel_config import MASTER_KEY

DATA_EXT = "alarmo_ext"
SERVICE_SET_HOUSE_MODE = "set_house_mode"


def _mgr(hass):
    return hass.data[DATA_EXT].house


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/house/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_get(hass, connection, msg):
    """Settings, runtime state and the partitions a mode can target."""
    connection.send_result(
        msg["id"],
        {
            "settings": _mgr(hass).settings,
            "targets": _link_targets(hass),
            "sources": list(SOURCES),
            "shadow": _mgr(hass).shadow_log.summary(),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/house/detect",
        vol.Optional("selector"): vol.Any(None, cv.entity_id),
        vol.Optional("current"): vol.Any(None, cv.entity_id),
        vol.Optional("previous"): vol.Any(None, cv.entity_id),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_detect(hass, connection, msg):
    """Suggest House Modes from the user's input_selects and the activity log (nothing is saved)."""
    selects = [
        {
            "entity_id": st.entity_id,
            "name": st.attributes.get("friendly_name"),
            "options": st.attributes.get("options") or [],
        }
        for st in hass.states.async_all("input_select")
    ]
    picked = house_detect.pick_entities(selects)
    for key in ("selector", "current", "previous"):
        if key in msg:
            picked[key] = msg[key]
    by_id = {s["entity_id"]: s for s in selects}
    options: list[str] = []
    for key in ("selector", "current"):
        options += (by_id.get(picked[key] or "") or {}).get("options", [])
    names = house_detect.mode_names(options)
    targets = _link_targets(hass)
    alarm_entities = {t["entity_id"]: t["key"] for t in targets if t["entity_id"]}
    areas = [t["key"] for t in targets if t["key"] != MASTER_KEY] or [t["key"] for t in targets]
    ev = {"modes": {}, "changes": 0, "span": []}
    if picked["current"]:
        rec = hass.data[DATA_EXT].recorder

        def _read() -> list[dict]:
            seqs: list[dict] = []
            for day in rec.days():
                seqs += rec.read_day(day)
            return seqs

        seqs = await hass.async_add_executor_job(_read)
        ev = house_detect.evidence(seqs, picked["current"], alarm_entities)
    connection.send_result(
        msg["id"],
        {
            "entities": picked,
            "selects": [{"entity_id": s["entity_id"], "name": s["name"]} for s in selects],
            "suggestions": house_detect.suggest(names, ev, areas),
            "changes": ev["changes"],
            "span": ev["span"],
            "targets": targets,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/house/shadow"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_shadow(hass, connection, msg):
    """Shadow log (newest last) and summary."""
    sh = _mgr(hass).shadow_log
    connection.send_result(msg["id"], {"log": list(sh.log), "summary": sh.summary()})


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/house/save", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_save(hass, connection, msg):
    """Validate and store House Mode settings."""
    try:
        clean = await _mgr(hass).async_save_settings(msg["settings"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], clean)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/house/set",
        vol.Required("mode"): str,
        vol.Optional("force", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_set(hass, connection, msg):
    """Set the House Mode from the panel (source manual)."""
    try:
        res = await _mgr(hass).async_set_mode(msg["mode"], "manual", force=msg["force"])
    except HouseModeError as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], res)


USER_CODE_CC = 99
SLOT_STATUS = {0: "available", 1: "in use", 2: "disabled"}


def _zwave_node_id(hass, entry) -> int | None:
    """Node id from the Z-Wave JS device identifier ("<home id>-<node id>[-...]")."""
    if not entry.device_id:
        return None
    dev = dr.async_get(hass).async_get(entry.device_id)
    for domain, ident in dev.identifiers if dev else ():
        if domain == "zwave_js":
            parts = str(ident).split("-")
            if len(parts) >= 2 and parts[1].isdigit():
                return int(parts[1])
    return None


def _zwave_slots(hass, entity_id: str) -> list[dict] | None:
    """Used user-code slots from the Z-Wave JS node, if the library is available."""
    try:
        from homeassistant.components.zwave_js.helpers import (  # noqa: PLC0415
            async_get_node_from_entity_id,
        )

        node = async_get_node_from_entity_id(hass, entity_id)
    except Exception:
        return None
    slots = []
    for value in getattr(node, "values", {}).values():
        if getattr(value, "command_class", None) != USER_CODE_CC:
            continue
        if getattr(value, "property_", None) != "userIdStatus":
            continue
        try:
            slot = int(value.property_key)
        except (TypeError, ValueError):
            continue
        status = SLOT_STATUS.get(value.value, str(value.value))
        if status != "available":
            slots.append({"slot": slot, "status": status})
    return sorted(slots, key=lambda x: x["slot"])


def discover_locks(hass) -> list[dict]:
    """Z-Wave JS locks with node id and used code slots (codes are never read out)."""
    configured = {k["node_id"] for k in _mgr(hass).settings["lock_keypads"]}
    out = []
    for entry in er.async_get(hass).entities.values():
        if entry.domain != "lock" or entry.platform != "zwave_js":
            continue
        node_id = _zwave_node_id(hass, entry)
        st = hass.states.get(entry.entity_id)
        out.append(
            {
                "entity_id": entry.entity_id,
                "name": (st.attributes.get("friendly_name") if st else None)
                or entry.entity_id,
                "node_id": node_id,
                "slots": _zwave_slots(hass, entry.entity_id),
                "configured": node_id in configured,
            }
        )
    return sorted(out, key=lambda x: x["name"])


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/house/locks"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_house_locks(hass, connection, msg):
    """Detected Z-Wave locks for the keypad settings."""
    connection.send_result(msg["id"], {"locks": discover_locks(hass)})


HOUSE_COMMANDS = (ws_house_get, ws_house_save, ws_house_set, ws_house_locks, ws_house_shadow, ws_house_detect)


def register_house_service(hass: HomeAssistant) -> None:
    """alarmo.set_house_mode {mode, source?, force?}."""

    async def _handle(call: ServiceCall):
        source = call.data.get("source") or (
            "manual" if call.context.user_id else "automation"
        )
        try:
            res = await _mgr(hass).async_set_mode(
                call.data["mode"], source, force=call.data["force"]
            )
        except HouseModeError as err:
            raise HomeAssistantError(str(err)) from err
        return res if call.return_response else None

    async_register_admin_service(
        hass,
        const.DOMAIN,
        SERVICE_SET_HOUSE_MODE,
        _handle,
        schema=vol.Schema(
            {
                vol.Required("mode"): cv.string,
                vol.Optional("source"): vol.In(SOURCES),
                vol.Optional("force", default=False): cv.boolean,
            }
        ),
        supports_response=SupportsResponse.OPTIONAL,
    )
