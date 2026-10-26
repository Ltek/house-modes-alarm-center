"""Websocket commands for the panel link (admin only)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import const
from .sensors import ATTR_GROUP
from .zone_rules import EntityCtx, _default_type
from .panel_config import MASTER_KEY, zone_number, exit_time_plan, mirror_object_id

DATA_EXT = "alarmo_ext"
LABEL_IMPORT = "panel-import"
LABEL_REPOINT = "mirror-zones"

# Default zone options per zone type (mirrors the frontend's sensorConfigByType).
_ALL = ["armed_away", "armed_home", "armed_night", "armed_vacation"]
TYPE_DEFAULTS: dict[str, dict[str, Any]] = {
    "door": {"modes": _ALL},
    "window": {"modes": _ALL, "use_entry_delay": False, "use_exit_delay": False},
    "motion": {"modes": ["armed_away", "armed_vacation"], "allow_open": True},
    "environmental": {
        "modes": [*_ALL, "armed_custom_bypass"],
        "always_on": True,
        "use_entry_delay": False,
        "use_exit_delay": False,
    },
    "tamper": {
        "modes": [*_ALL, "armed_custom_bypass"],
        "use_entry_delay": False,
        "use_exit_delay": False,
    },
    "other": {"modes": ["armed_away"]},
}


def _ext(hass):
    return hass.data[DATA_EXT]


def _discover(hass) -> list[dict[str, Any]]:
    """Alarm panels (not Alarmo's own) and their zones."""
    ext = _ext(hass)
    reg = er.async_get(hass)
    configured = ext.store.async_get_sensors()
    out = []
    for entry in reg.entities.values():
        if entry.domain != "alarm_control_panel" or entry.platform == const.DOMAIN:
            continue
        st = hass.states.get(entry.entity_id)
        zones = []
        for zid in ext.panel.panel_zones(entry.entity_id):
            zst = hass.states.get(zid)
            attrs = zst.attributes if zst else {}
            mirror = f"binary_sensor.{mirror_object_id(zid)}"
            zones.append(
                {
                    "entity_id": zid,
                    "zone": zone_number(attrs),
                    "partition": attrs.get("partition"),
                    "name": attrs.get("friendly_name") or zid,
                    "device_class": attrs.get("device_class"),
                    "state": zst.state if zst else None,
                    "configured": zid in configured,
                    "mirror": mirror if hass.states.get(mirror) else None,
                    "mirror_configured": mirror in configured,
                }
            )
        out.append(
            {
                "entity_id": entry.entity_id,
                "platform": entry.platform,
                "name": (st.attributes.get("friendly_name") if st else None)
                or entry.entity_id,
                "state": st.state if st else None,
                "code_set": bool(ext.panel.panel_code(entry.entity_id)),
                "zones": sorted(
                    zones, key=lambda z: (z["zone"] is None, z["zone"] or 0)
                ),
            }
        )
    return out


def _link_targets(hass) -> list[dict[str, str]]:
    """Alarmo entities a link can attach to."""
    data = hass.data.get(const.DOMAIN) or {}
    out = []
    if data.get("master"):
        out.append(
            {
                "key": MASTER_KEY,
                "entity_id": data["master"].entity_id,
                "name": "All partitions",
            }
        )
    for area_id, ent in (data.get("areas") or {}).items():
        out.append(
            {"key": area_id, "entity_id": ent.entity_id, "name": ent.name or area_id}
        )
    return out


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/panel/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_get(hass, connection, msg):
    """Settings, discovered panels/zones, link targets, status, recent log."""
    mgr = _ext(hass).panel
    connection.send_result(
        msg["id"],
        {
            "settings": mgr.settings,
            "panels": _discover(hass),
            "targets": _link_targets(hass),
            "running": sorted(mgr.links),
            # mirrored zones on a panel that cannot report bypasses (Vista via envisalink_new)
            "bypass_unreported": mgr.honeywell_zones(),
            "bypassed": sorted(mgr.bypassed),
            "log": list(mgr.log)[-100:],
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/panel/save", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_save(hass, connection, msg):
    """Validate and store panel settings; links restart."""
    try:
        clean = await _ext(hass).panel.async_save_settings(msg["settings"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], clean)


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/panel/log"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_log(hass, connection, msg):
    """Full activity log (newest last)."""
    connection.send_result(msg["id"], {"log": list(_ext(hass).panel.log)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/panel/import",
        vol.Required("partition"): cv.string,
        vol.Required("entities"): [cv.entity_id],
        vol.Optional("dry_run", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_import(hass, connection, msg):
    """Add panel zones (or their mirrors) as zones in a partition (backup first)."""
    ext = _ext(hass)
    area = ext.store.async_get_area(msg["partition"])
    if not area:
        connection.send_error(
            msg["id"], "invalid", f"unknown partition '{msg['partition']}'"
        )
        return
    enabled = [m for m, c in (area.get("modes") or {}).items() if c.get("enabled")]
    configured = ext.store.async_get_sensors()
    create = []
    for eid in msg["entities"]:
        if eid in configured:
            continue
        st = hass.states.get(eid)
        dc = st.attributes.get("device_class") if st else None
        ztype = _default_type(EntityCtx(entity_id=eid, device_class=dc))
        cfg = dict(TYPE_DEFAULTS[ztype])
        cfg["modes"] = [m for m in cfg["modes"] if m in enabled]
        create.append(
            {"entity_id": eid, "area": msg["partition"], "type": ztype, **cfg}
        )
    if msg["dry_run"] or not create:
        connection.send_result(msg["id"], {"create": create, "applied": False})
        return
    try:
        res = await ext.async_apply_sensor_changes(
            {"create": create, "update": [], "delete": []},
            label=LABEL_IMPORT,
            record_overrides=False,
        )
    except Exception as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(
        msg["id"], {"create": create, "applied": True, "backup": res["backup"]}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/panel/repoint",
        vol.Required("pairs"): [
            vol.Schema(
                {vol.Required("from"): cv.entity_id, vol.Required("to"): cv.entity_id}
            )
        ],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_repoint(hass, connection, msg):
    """Point existing zones at other entities (e.g. a mirror), keeping all settings."""
    ext = _ext(hass)
    sensors = ext.store.async_get_sensors()
    errors = []
    for p in msg["pairs"]:
        if p["from"] not in sensors:
            errors.append(f"{p['from']} is not a zone")
        if p["to"] in sensors:
            errors.append(f"{p['to']} is already a zone")
        if hass.states.get(p["to"]) is None:
            errors.append(f"{p['to']} does not exist")
    if errors or not msg["pairs"]:
        connection.send_error(
            msg["id"], "invalid", "\n".join(errors) or "nothing to change"
        )
        return
    backup = await ext.backups.async_create(LABEL_REPOINT)
    coordinator = hass.data[const.DOMAIN]["coordinator"]
    for p in msg["pairs"]:
        cfg = {k: v for k, v in sensors[p["from"]].items() if k != "entity_id"}
        cfg[ATTR_GROUP] = coordinator.async_get_group_for_sensor(p["from"])
        cfg["new_entity_id"] = p["to"]
        coordinator.async_update_sensor_config(p["from"], cfg)
    await ext.store.async_save()
    async_dispatcher_send(hass, "alarmo_update_frontend")
    connection.send_result(msg["id"], {"backup": backup, "changed": len(msg["pairs"])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/panel/match_exit",
        vol.Required("link"): str,
        vol.Optional("dry_run", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_panel_match_exit(hass, connection, msg):
    """Set Alarmo's exit time per Arm Mode to the panel's learned exit delay + 3 s (backup first)."""
    ext = _ext(hass)
    link = (ext.panel.settings.get("links") or {}).get(msg["link"])
    if not link:
        connection.send_error(msg["id"], "invalid", "unknown link")
        return
    areas = ext.store.async_get_areas()
    keys = list(areas) if msg["link"] == MASTER_KEY else [msg["link"]]
    plan = {}
    for aid in keys:
        area = areas.get(aid)
        if not area:
            continue
        changes = {
            m: t for m, t in exit_time_plan(link, area["modes"]).items() if area["modes"][m].get("exit_time") != t
        }
        if changes:
            before = {m: area["modes"][m].get("exit_time") for m in changes}
            plan[aid] = {"name": area["name"], "changes": changes, "before": before}
    if msg["dry_run"] or not plan:
        connection.send_result(msg["id"], {"plan": plan, "applied": False})
        return
    backup = await ext.backups.async_create("exit-times")
    coord = hass.data[const.DOMAIN]["coordinator"]
    for aid, item in plan.items():
        modes = {m: dict(c) for m, c in areas[aid]["modes"].items()}
        for m, t in item["changes"].items():
            modes[m]["exit_time"] = t
        await coord.async_update_area_config(aid, {"modes": modes})
    connection.send_result(msg["id"], {"plan": plan, "applied": True, "backup": backup})


PANEL_COMMANDS = (
    ws_panel_match_exit,
    ws_panel_get,
    ws_panel_save,
    ws_panel_log,
    ws_panel_import,
    ws_panel_repoint,
)
