"""Smart Repeating Alerts on the Notifications tab: automations made from the blueprint, and the blueprint.

The alerts stay native Home Assistant automations (``use_blueprint``); this module only lists them with a short
summary read from their inputs, and installs or updates the blueprint file that ships with the integration. Creating,
editing and deleting go through Home Assistant's own automation config API and editor.
"""

from __future__ import annotations

import os
import re
import shutil
import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.components import websocket_api

_LOGGER = logging.getLogger(__name__)

BLUEPRINT_PATH = "LTek/smart-repeating-alerts-ltek.yaml"
OLD_BLUEPRINTS = {
    "LTek/repeating-alerts-ltek.yaml": "Repeating Alerts",
    "LTek/smart-camera-notifications-ltek.yaml": "Smart Camera Notifications",
}
SHIPPED = os.path.join(os.path.dirname(__file__), "blueprints", "smart-repeating-alerts-ltek.yaml")
MARKER = "github.com/Ltek/smart-repeating-alerts"
VERSION_RE = re.compile(r"Version (\d{4}\.\d{2}\.\d{2}\.\d+)")


def _version(path: str) -> str | None:
    try:
        with open(path, encoding="utf-8") as fh:
            m = VERSION_RE.search(fh.read(4000))
    except OSError:
        return None
    return m.group(1) if m else None


def _vkey(v: str | None) -> tuple:
    return tuple(int(x) for x in v.split(".")) if v else ()


def blueprint_status(hass: HomeAssistant) -> dict[str, Any]:
    """Installed and shipped versions, and whether the installed file is ours (so it may be updated)."""
    target = hass.config.path("blueprints", "automation", *BLUEPRINT_PATH.split("/"))
    installed = os.path.exists(target)
    ours = False
    if installed:
        try:
            with open(target, encoding="utf-8") as fh:
                ours = MARKER in fh.read()
        except OSError:
            ours = False
    have, ship = _version(target) if installed else None, _version(SHIPPED)
    return {
        "path": BLUEPRINT_PATH,
        "installed": installed,
        "installed_version": have,
        "shipped_version": ship,
        "ours": ours,
        "update": bool(installed and ours and ship and _vkey(ship) > _vkey(have)),
    }


def install_blueprint(hass: HomeAssistant, force: bool = False) -> dict[str, Any]:
    """Copy the shipped blueprint into blueprints/automation/LTek/. Never overwrites a file that isn't ours."""
    st = blueprint_status(hass)
    if st["installed"] and not st["ours"] and not force:
        raise ValueError(f"blueprints/automation/{BLUEPRINT_PATH} is not Smart Repeating Alerts; not replaced")
    target = hass.config.path("blueprints", "automation", *BLUEPRINT_PATH.split("/"))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copyfile(SHIPPED, target)
    _LOGGER.info("Installed Smart Repeating Alerts blueprint %s", st["shipped_version"])
    return blueprint_status(hass)


def sync_blueprint(hass: HomeAssistant) -> str | None:
    """On startup: install the blueprint when missing, update it when the file is ours and older. Else leave it.

    Returns "installed" / "updated" when the file changed, None otherwise. Never raises.
    """
    try:
        st = blueprint_status(hass)
        if not st["installed"]:
            install_blueprint(hass)
            return "installed"
        if st["update"]:
            install_blueprint(hass)
            return "updated"
    except (OSError, ValueError) as err:
        _LOGGER.warning("Smart Repeating Alerts blueprint not installed: %s", err)
    return None


async def async_sync_blueprint(hass: HomeAssistant) -> None:
    """Install or update the blueprint, then reload automations so ones using it load (only when it changed)."""
    changed = await hass.async_add_executor_job(sync_blueprint, hass)
    if changed and hass.services.has_service("automation", "reload"):
        _LOGGER.info("Smart Repeating Alerts blueprint %s; reloading automations", changed)
        await hass.services.async_call("automation", "reload", blocking=False)


def _as_list(v: Any) -> list:
    if v is None:
        return []
    return list(v) if isinstance(v, list | tuple) else [v]


def _trigger_entities(triggers: Any) -> list[str]:
    out: list[str] = []
    for t in _as_list(triggers):
        if not isinstance(t, dict) or t.get("enabled") is False:
            continue
        ents = _as_list(t.get("entity_id")) + _as_list((t.get("target") or {}).get("entity_id"))
        labels = _as_list((t.get("target") or {}).get("label_id"))
        out += [str(e) for e in ents] + [f"label {lab}" for lab in labels]
        if not ents and not labels:
            out.append(str(t.get("trigger", t.get("platform", "trigger"))))
    return list(dict.fromkeys(out))


def summary(inputs: dict) -> dict[str, Any]:
    """The few facts the list shows, from an automation's blueprint inputs."""
    g = inputs.get
    return {
        "triggers": _trigger_entities(g("alert_trigger")),
        "devices": len(_as_list(g("notify_device"))),
        "services": len(_as_list(g("notify_services"))),
        "repeat": bool(g("repeat_notification")),
        "repeat_every": g("time_between_repeat_notification"),
        "max_repeats": g("max_repeat_count"),
        "camera": g("camera") or None,
        "test_mode": bool(g("test_mode")),
        "tag": g("notification_id") or "",
        "buttons": len(_as_list(g("include_action_buttons"))),
        "critical": g("notification_interruption_level") == "critical" or bool(g("android_alarm_stream")),
    }


def alert_items(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every automation made from Smart Repeating Alerts (or its two predecessors), with a summary. Event loop only."""
    from homeassistant.components.automation import DATA_COMPONENT  # noqa: PLC0415

    items = []
    comp = hass.data.get(DATA_COMPONENT)
    for ent in getattr(comp, "entities", None) or []:
        bi = getattr(ent, "_blueprint_inputs", None) or {}
        ub = bi.get("use_blueprint") or {}
        path = ub.get("path")
        if path != BLUEPRINT_PATH and path not in OLD_BLUEPRINTS:
            continue
        st = hass.states.get(ent.entity_id)
        attrs = st.attributes if st else {}
        items.append(
            {
                "entity_id": ent.entity_id,
                "name": attrs.get("friendly_name") or ent.entity_id,
                "state": st.state if st else "unavailable",
                "last_triggered": attrs.get("last_triggered"),
                "edit_id": attrs.get("id"),
                "blueprint": path,
                "old": OLD_BLUEPRINTS.get(path),
                "summary": summary(ub.get("input") or {}),
            }
        )
    items.sort(key=lambda i: (i["old"] is not None, i["name"].lower()))
    return items


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/alerts/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_alerts_get(hass, connection, msg):
    """Smart Repeating Alerts automations and the blueprint's status."""
    status = await hass.async_add_executor_job(blueprint_status, hass)
    connection.send_result(msg["id"], {"blueprint": status, "items": alert_items(hass)})


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/alerts/install", vol.Optional("force", default=False): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_alerts_install(hass, connection, msg):
    """Install or update the Smart Repeating Alerts blueprint."""
    try:
        st = await hass.async_add_executor_job(install_blueprint, hass, msg["force"])
    except (ValueError, OSError) as err:
        connection.send_error(msg["id"], "install_failed", str(err))
        return
    connection.send_result(msg["id"], st)


ALERT_COMMANDS = (ws_alerts_get, ws_alerts_install)
