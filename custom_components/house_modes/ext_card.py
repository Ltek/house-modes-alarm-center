"""Dashboard card support: read-only card data for every user, and the panel keypad service.

The House Modes & Alarm Center Card runs for ordinary (non-admin) users, so it cannot use the admin
websocket commands. ``house_modes/ext/card/get`` returns only what the card shows (modes, icons, colors,
the panel link's entities and whether this user may use the panel keypad). ``house_modes.panel_keypress``
sends keys to a linked panel after checking the Physical Panel tab's keypad setting.
"""

from __future__ import annotations

import voluptuous as vol
from homeassistant.core import ServiceCall, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from . import const
from .ext_status import panel_ready_entity
from .ext_panel_ws import _link_targets
from .house_config import find_mode, mode_color
from .panel_config import KEYPAD_KEYS, keypad_allowed

DATA_EXT = "house_modes_ext"
SERVICE_PANEL_KEYPRESS = "panel_keypress"


def _ext(hass):
    return hass.data[DATA_EXT]


def _links(hass) -> list[dict]:
    """Panel links as the card needs them (alarm entity, panel, keypad text sensor, ready sensor)."""
    ext = _ext(hass)
    targets = {t["key"]: t["entity_id"] for t in _link_targets(hass)}
    out = []
    for key, link in (ext.panel.settings.get("links") or {}).items():
        if link["mode"] == "off":
            continue
        out.append(
            {
                "key": key,
                "alarm_entity": targets.get(key),
                "panel_entity": link["panel_entity"],
                "panel_type": link["panel_type"],
                "keypad_entity": ext.panel.keypad_for_panel(link["panel_entity"]),
                "ready_entity": panel_ready_entity(hass, link["panel_entity"]),
                "mode": link["mode"],
            }
        )
    return out


def card_data(hass, user_id: str | None, is_admin: bool) -> dict:
    """Everything the card shows; nothing secret (no codes, no user lists)."""
    ext = _ext(hass)
    s = ext.house.settings
    cur = find_mode(s, s["current"])
    prev = find_mode(s, s["previous"])
    allowed, reason = keypad_allowed(ext.panel.settings, user_id, is_admin)
    shadow = s["enabled"] and s.get("run_mode") == "shadow"
    return {
        "house": {
            "enabled": s["enabled"],
            "shadow": shadow,
            # in Shadow the user's own automations still own the House Mode: buttons go to their input_select
            "select_entity": (s.get("input_select") if shadow else None) or "select.house_mode",
            # in Shadow your own automations own the House Mode: the card shows your helper's mode, not Shadow's
            "display_entity": (s.get("input_select") or s.get("current_entity")) if shadow else None,
            "current": cur["id"] if cur else None,
            "previous": prev["id"] if prev else None,
            "changed_at": s["changed_at"],
            "source": s["source"],
            "last_result": ext.house.last_result,
            "changing_to": ext.house.changing_to,
            "modes": [
                {"id": m["id"], "name": m["name"], "icon": m["icon"], "color": mode_color(m), "targets": m["targets"]}
                for m in s["modes"]
            ],
            # why each recent change happened, for the card's History section (names, not ids)
            "history": [
                {"at": h.get("at"), "to": (find_mode(s, h.get("to")) or {}).get("name") or h.get("to"),
                 "source": h.get("source")}
                for h in (s.get("history") or [])[-50:]
                if h.get("result") in (None, "changed", "external")
            ],
        },
        "alarms": [{"key": t["key"], "entity_id": t["entity_id"], "name": t["name"]} for t in _link_targets(hass)],
        "links": _links(hass),
        "keypad": {
            "allowed": allowed,
            "reason": reason,
            "blocked_keys": (ext.panel.settings.get("keypad_input") or {}).get("blocked_keys", ""),
        },
    }


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/card/get"})
@callback
def ws_card_get(hass, connection, msg):
    """Card data for the logged-in user (not admin-only)."""
    user = connection.user
    connection.send_result(msg["id"], card_data(hass, user.id if user else None, bool(user and user.is_admin)))


async def card_permissions(hass, area: str | None = None) -> dict:
    """Who may use the card's sections, for the card editor: names only (no codes, no ids).

    keypad: the Physical Panel tab's "Panel keypad on dashboards" setting, with the allowed users' names.
    alarm: whether arming / disarming needs a code, and the Alarm users whose code may (limited to ``area``).
    """
    ext = _ext(hass)
    kcfg = ext.panel.settings.get("keypad_input") or {}
    ha_users = {u.id: u.name for u in await hass.auth.async_get_users()}
    cfg = ext.store.async_get_config()
    def in_area(u: dict) -> bool:
        return not area or area == "master" or not u.get("area_limit") or area in u["area_limit"]

    users = [u for u in ext.store.async_get_users().values() if u.get("enabled", True) and in_area(u)]
    return {
        "keypad": {
            "mode": kcfg.get("mode", "admins"),
            "users": sorted(ha_users.get(i) or "unknown user" for i in (kcfg.get("users") or [])),
        },
        "alarm": {
            "arm_code": bool(cfg.get("code_arm_required")),
            "disarm_code": bool(cfg.get("code_disarm_required")),
            "arm_users": sorted(u.get("name") or "unnamed" for u in users if u.get("can_arm")),
            "disarm_users": sorted(u.get("name") or "unnamed" for u in users if u.get("can_disarm")),
        },
    }


@websocket_api.websocket_command(
    {vol.Required("type"): "house_modes/ext/card/permissions", vol.Optional("entity_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_card_permissions(hass, connection, msg):
    """Who may use each card section (admins only: it lists user names), for the card editor."""
    area = next((t["key"] for t in _link_targets(hass) if t["entity_id"] == msg.get("entity_id")), None)
    connection.send_result(msg["id"], await card_permissions(hass, area))


CARD_COMMANDS = (ws_card_get, ws_card_permissions)


def _mask(keys: str) -> str:
    """Log text for keys: digits hidden (they may be a code), the last key shown (the function)."""
    if len(keys) <= 1:
        return keys
    return "•" * (len(keys) - 1) + keys[-1]


def register_card_services(hass: HomeAssistant) -> None:
    """house_modes.panel_keypress {keys, entity_id?} — for every user, checked against the keypad setting."""

    async def _handle(call: ServiceCall) -> None:
        ext = _ext(hass)
        keys = call.data["keys"]
        user = await hass.auth.async_get_user(call.context.user_id) if call.context.user_id else None
        # automations (no user) are trusted like before; dashboards are checked
        if user is not None:
            ok, reason = keypad_allowed(ext.panel.settings, user.id, user.is_admin, keys)
            who = user.name or "a user"
            if not ok:
                ext.recorder.add("keypad", f"Panel keypad refused for {who}: {reason}", starter=True)
                raise ServiceValidationError(f"Keypad input refused: {reason}")
        else:
            who = "an automation"
        links = _links(hass)
        want = call.data.get("entity_id")
        link = next((li for li in links if want in (None, li["alarm_entity"], li["panel_entity"])), None)
        if link is None:
            raise ServiceValidationError("no linked physical panel" + (f" for {want}" if want else ""))
        if link["panel_type"] != "envisalink":
            raise ServiceValidationError("keypresses are only supported for Envisalink panels")
        ext.recorder.add("keypad", f"Panel keypad from {who}: {_mask(keys)}", starter=True)
        try:
            await hass.services.async_call(
                "envisalink_new",
                "alarm_keypress",
                {"entity_id": link["panel_entity"], "keypress": keys},
                blocking=True,
            )
        except HomeAssistantError as err:
            raise HomeAssistantError(f"the panel did not accept the keys: {err}") from err

    hass.services.async_register(
        const.DOMAIN,
        SERVICE_PANEL_KEYPRESS,
        _handle,
        schema=vol.Schema(
            {
                vol.Required("keys"): vol.All(cv.string, vol.Match(KEYPAD_KEYS)),
                vol.Optional("entity_id"): cv.entity_id,
            }
        ),
    )
