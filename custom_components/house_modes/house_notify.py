"""House Mode notifications: the Simple ones (sent here) and the Advanced ones (automations from the blueprint).

Simple: one entry per event (changed / blocked / failed / timer) in the House Mode settings, key ``notifications``
(house_config.py). Title and message take placeholders like ``{mode}``; priority, "replace the previous message" and
the buttons are phone-app data (``notify.mobile_app_*`` or a group of them). A service that refuses ``data`` gets the
text only.

Buttons: the action id is ``HOUSE_MODES_HM_<BUTTON>__<arg>``; the mobile app fires ``mobile_app_notification_action``
with the phone's Home Assistant user in the event context. Only admins, or the users chosen, may use them.

Advanced: automations made from ``LTek/house-mode-notifications-ltek.yaml`` (shipped in ``blueprints/``, installed on
start like Smart Repeating Alerts). They are listed on the Notifications tab; a Simple event that an enabled one also
covers is flagged so nothing is sent twice by accident.
"""

from __future__ import annotations

import os
import re
import shutil
import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.components import websocket_api

from .house_config import BUTTONS, PLACEHOLDERS, NOTIFY_EVENTS, NOTIFY_DEFAULTS, normalize_notifications

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

DATA_EXT = "house_modes_ext"
ACTION_PREFIX = "HOUSE_MODES_HM_"
PUSH_EVENT = "mobile_app_notification_action"
EVENT_TIMER = "house_modes_house_mode_timer"

BLUEPRINT_PATH = "LTek/house-mode-notifications-ltek.yaml"
SHIPPED = os.path.join(os.path.dirname(__file__), "blueprints", "house-mode-notifications-ltek.yaml")
MARKER = "github.com/Ltek/house-modes-alarm-center"
VERSION_RE = re.compile(r"Version (\d{4}\.\d{2}\.\d{2}\.\d+)")

BUTTON_TITLES = {
    "undo": "Undo",
    "disarm": "Disarm",
    "force": "Change anyway",
    "dismiss": "Dismiss",
    "retry": "Retry",
    "force_arm": "Force arm",
    "cancel": "Cancel timer",
    "now": "Do it now",
}
PRIORITY_DATA: dict[str, dict[str, Any]] = {
    "normal": {},
    "high": {"priority": "high", "ttl": 0, "push": {"interruption-level": "time-sensitive"}},
    "critical": {
        "priority": "high",
        "ttl": 0,
        "channel": "alarm_stream",
        "push": {"interruption-level": "critical", "sound": {"name": "default", "critical": 1, "volume": 1.0}},
    },
}

_PLACEHOLDER_RE = re.compile(r"\{(\w+)\}")


def render(template: str, values: dict[str, Any]) -> str:
    """Fill ``{name}`` placeholders; unknown ones are left as they are, empty ones become ''."""

    def _sub(m: re.Match) -> str:
        key = m.group(1)
        if key not in PLACEHOLDERS:
            return m.group(0)
        v = values.get(key)
        return "" if v is None else str(v)

    out = _PLACEHOLDER_RE.sub(_sub, template or "")
    # an empty placeholder between separators ("Stay ·  · timer") leaves one separator
    out = re.sub(r"(\s*·\s*){2,}", " · ", out)
    return re.sub(r"[ \t]{2,}", " ", out).strip(" ·")


def duration_text(seconds: float | None) -> str:
    """'2 h 5 min', '12 min', '40 s'."""
    if seconds is None:
        return ""
    s = int(seconds)
    if s < 60:
        return f"{s} s"
    m = s // 60
    if m < 60:
        return f"{m} min"
    h, m = divmod(m, 60)
    if h < 48:
        return f"{h} h {m} min" if m else f"{h} h"
    d, h = divmod(h, 24)
    return f"{d} d {h} h" if h else f"{d} d"


def payload(settings: dict, event: str, values: dict[str, Any], args: dict[str, str]) -> dict[str, Any] | None:
    """The notify call for one event, or None when it is not sent (off, filtered)."""
    cfg = settings[event]
    if not cfg["enabled"] or not settings["services"]:
        return None
    if values.get("source_id") in settings["skip_sources"]:
        return None
    only = settings["only_modes"]
    if only and values.get("mode_id") not in only:
        return None
    data: dict[str, Any] = dict(PRIORITY_DATA[cfg["priority"]])
    if settings["replace"]:
        data["tag"] = f"house_modes_{event}"
    actions = []
    for b in cfg["buttons"]:
        arg = args.get(b, "")
        if b in ("undo", "retry", "force", "force_arm", "cancel", "now") and not arg:
            continue  # nothing to act on (e.g. Undo without a previous mode)
        actions.append({"action": f"{ACTION_PREFIX}{b.upper()}__{arg}", "title": BUTTON_TITLES[b]})
    if actions:
        data["actions"] = actions
    return {"title": render(cfg["title"], values), "message": render(cfg["message"], values), "data": data}


# ------------------------------------------------------------------ the blueprint (Advanced)


def _version(path: str) -> str | None:
    try:
        with open(path, encoding="utf-8") as fh:
            m = VERSION_RE.search(fh.read(4000))
    except OSError:
        return None
    return m.group(1) if m else None


def _vkey(v: str | None) -> tuple:
    return tuple(int(x) for x in v.split(".")) if v else ()


def sync_blueprint(hass: HomeAssistant) -> str | None:
    """Install the blueprint when missing, update it when it is ours and older. Never raises."""
    target = hass.config.path("blueprints", "automation", *BLUEPRINT_PATH.split("/"))
    try:
        if os.path.exists(target):
            with open(target, encoding="utf-8") as fh:
                if MARKER not in fh.read():
                    return None  # someone else's file: leave it
            if _vkey(_version(SHIPPED)) <= _vkey(_version(target)):
                return None
            changed = "updated"
        else:
            changed = "installed"
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copyfile(SHIPPED, target)
        return changed
    except OSError as err:
        _LOGGER.warning("House Mode Notifications blueprint not installed: %s", err)
        return None


async def async_sync_blueprint(hass: HomeAssistant) -> None:
    """Install / update the blueprint; reload automations when it changed."""
    changed = await hass.async_add_executor_job(sync_blueprint, hass)
    if changed and hass.services.has_service("automation", "reload"):
        _LOGGER.info("House Mode Notifications blueprint %s; reloading automations", changed)
        await hass.services.async_call("automation", "reload", blocking=False)


def advanced_items(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Automations made from the blueprint, with the events they cover. Event loop only."""
    from homeassistant.components.automation import DATA_COMPONENT  # noqa: PLC0415

    items = []
    comp = hass.data.get(DATA_COMPONENT)
    for ent in getattr(comp, "entities", None) or []:
        ub = (getattr(ent, "_blueprint_inputs", None) or {}).get("use_blueprint") or {}
        if ub.get("path") != BLUEPRINT_PATH:
            continue
        inputs = ub.get("input") or {}
        st = hass.states.get(ent.entity_id)
        attrs = st.attributes if st else {}
        events = inputs.get("events") or list(NOTIFY_EVENTS)
        items.append(
            {
                "entity_id": ent.entity_id,
                "name": attrs.get("friendly_name") or ent.entity_id,
                "state": st.state if st else "unavailable",
                "last_triggered": attrs.get("last_triggered"),
                "edit_id": attrs.get("id"),
                "events": [e for e in events if e in NOTIFY_EVENTS],
                "devices": len(inputs.get("notify_devices") or []),
                "services": len(inputs.get("notify_services") or []),
            }
        )
    items.sort(key=lambda i: i["name"].lower())
    return items


# ------------------------------------------------------------------ the manager


class HouseNotifier:
    """Sends the Simple House Mode notifications and handles their buttons."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize."""
        self.hass = hass
        self.ext = ext
        self._unsub = None

    @property
    def settings(self) -> dict[str, Any]:
        """The notification settings (always normalized)."""
        return normalize_notifications(self.ext.house.settings.get("notifications"))

    @callback
    def async_start(self) -> None:
        """Listen for button presses."""
        if self._unsub is None:
            self._unsub = self.hass.bus.async_listen(PUSH_EVENT, self._on_action)

    @callback
    def async_stop(self) -> None:
        """Stop listening."""
        if self._unsub is not None:
            self._unsub()
            self._unsub = None

    async def async_send(self, event: str, values: dict[str, Any], args: dict[str, str] | None = None) -> int:
        """Send one event to every service. Returns how many services got it. Never raises."""
        s = self.settings
        call = payload(s, event, values, args or {})
        if call is None:
            return 0
        sent = 0
        for svc in s["services"]:
            domain, name = svc.split(".", 1)
            body = {"title": call["title"], "message": call["message"]}
            try:
                if call["data"]:
                    try:
                        await self.hass.services.async_call(
                            domain, name, {**body, "data": call["data"]}, blocking=True
                        )
                    except (vol.Invalid, TypeError, ValueError):
                        # a service without phone-app data (e.g. email): the text only
                        await self.hass.services.async_call(domain, name, body, blocking=True)
                else:
                    await self.hass.services.async_call(domain, name, body, blocking=True)
                sent += 1
            except Exception as err:
                _LOGGER.warning("House Mode notification via %s failed: %s", svc, err)
        return sent

    # -------------------------------------------------------------- buttons

    async def _allowed(self, event: Event) -> bool:
        who = self.settings["button_users"]
        user_id = event.context.user_id if event.context else None
        if user_id is None:
            return False
        user = await self.hass.auth.async_get_user(user_id)
        if user is None or not user.is_active:
            return False
        if who == "admins":
            return user.is_admin
        return user_id in who

    async def _on_action(self, event: Event) -> None:
        action = str((event.data or {}).get("action") or "")
        if not action.startswith(ACTION_PREFIX):
            return
        button, _, arg = action[len(ACTION_PREFIX):].partition("__")
        button = button.lower()
        rec = getattr(self.ext, "recorder", None)
        if not await self._allowed(event):
            _LOGGER.warning("House Mode notification button %s: this user may not use the buttons", button)
            if rec is not None:
                rec.add("house", f"Notification button {BUTTON_TITLES.get(button, button)} refused (user not allowed)")
            return
        if rec is not None:
            rec.add("house", f"Notification button: {BUTTON_TITLES.get(button, button)}", starter=True)
        await self.async_press(button, arg)

    async def async_press(self, button: str, arg: str) -> None:
        """Do what a button says. Never raises."""
        house = self.ext.house
        try:
            if button in ("undo", "retry"):
                await house.async_set_mode(arg, "manual")
            elif button == "force":
                await house.async_set_mode(arg, "manual", force=True)
            elif button == "force_arm":
                await house.async_set_mode(arg, "manual", force=True, bypass=True)
            elif button == "disarm":
                await self._disarm_all()
            elif button == "cancel":
                await house.async_cancel_pending(arg)
            elif button == "now":
                await house.async_run_pending_now(arg)
            # dismiss: nothing to do (the phone closes the message)
        except Exception as err:
            _LOGGER.warning("House Mode notification button %s failed: %s", button, err)

    async def _disarm_all(self) -> None:
        data = self.hass.data.get("house_modes") or {}
        master = data.get("master")
        ents = [master] if master else list((data.get("areas") or {}).values())
        for ent in ents:
            await ent.async_alarm_disarm(code=None, skip_code=True)


# ------------------------------------------------------------------ websocket (admin)


def _get_payload(hass: HomeAssistant) -> dict[str, Any]:
    ext = hass.data[DATA_EXT]
    items = advanced_items(hass)
    covered = {ev: [i["name"] for i in items if i["state"] == "on" and ev in i["events"]] for ev in NOTIFY_EVENTS}
    return {
        "settings": ext.notifier.settings,
        "defaults": NOTIFY_DEFAULTS,
        "buttons": {ev: list(b) for ev, b in BUTTONS.items()},
        "button_titles": BUTTON_TITLES,
        "placeholders": list(PLACEHOLDERS),
        "advanced": items,
        "covered": covered,
        "blueprint": BLUEPRINT_PATH,
    }


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/house_notify/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get(hass, connection, msg):
    """Settings, defaults, the Advanced automations and which events they cover."""
    connection.send_result(msg["id"], _get_payload(hass))


@websocket_api.websocket_command(
    {vol.Required("type"): "house_modes/ext/house_notify/save", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(hass, connection, msg):
    """Save the Simple settings (only this part of the House Mode settings)."""
    ext = hass.data[DATA_EXT]
    try:
        clean = normalize_notifications(msg["settings"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    await ext.house.async_save_settings({**ext.house.settings, "notifications": clean})
    connection.send_result(msg["id"], _get_payload(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_modes/ext/house_notify/test",
        vol.Required("event"): vol.In(NOTIFY_EVENTS),
        vol.Optional("settings"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_test(hass, connection, msg):
    """Send one event with sample values (the unsaved settings, when given), so the wording can be checked."""
    ext = hass.data[DATA_EXT]
    s = normalize_notifications(msg.get("settings") or ext.notifier.settings)
    s = {**s, msg["event"]: {**s[msg["event"]], "enabled": True}, "skip_sources": [], "only_modes": []}
    sample = {
        "mode": "Stay", "previous": "Disarmed", "current": "Disarmed", "source": "by hand",
        "reason": "Open: Patio Door", "what": "not set", "when": "in 10 min", "minutes": 10,
        "duration": "2 h 5 min", "change": "from Disarmed · by hand",
    }
    call = payload(s, msg["event"], sample, {})
    sent = 0
    for svc in s["services"]:
        domain, name = svc.split(".", 1)
        try:
            await hass.services.async_call(
                domain, name, {"title": "[Test] " + call["title"], "message": call["message"]}, blocking=True
            )
            sent += 1
        except Exception as err:
            connection.send_error(msg["id"], "failed", f"{svc}: {err}")
            return
    connection.send_result(msg["id"], {"sent": sent})


NOTIFY_COMMANDS = (ws_get, ws_save, ws_test)
