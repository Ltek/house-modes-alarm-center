"""Alarm & panel alerts: ready-made Smart Repeating Alerts, created in one click (Notifications tab, Quick Start).

Each offer is an automation from the Smart Repeating Alerts blueprint with its inputs filled in from this system: the
alarm entities, the linked panel and its keypad sensor, and the phones. The alert repeats until its clear trigger fires
(the problem ends) or someone presses Cancel.

Nothing is created without the user pressing Create. This module only builds the automation configs; the browser saves
them through Home Assistant's own automation config API, like any automation made in the editor.

Offers already set up are recognised by their Notification ID (``house_modes_<offer>``). Offers the user already
covers with their own automation (e.g. one that triggers on the keypad's ``fire`` attribute, or on
``house_modes_failed_to_arm``) are named, so Quick Start can leave them unticked.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.util import slugify
from homeassistant.helpers import device_registry as dr
from homeassistant.components import websocket_api

from .ext_alerts import BLUEPRINT_PATH, alert_items, blueprint_status, install_blueprint

_LOGGER = logging.getLogger(__name__)

DATA_EXT = "house_modes_ext"
ID_PREFIX = "house_modes_"
ARMED = ["armed_away", "armed_home", "armed_night", "armed_vacation", "armed_custom_bypass"]
PANEL_TROUBLE_ATTRS = ("trouble", "bat_trouble", "bell_trouble", "zone_low_battery")

# id: (title, what it is for, needs, critical, repeat minutes, max repeats, Disarm / Silence button offered)
OFFERS: dict[str, dict[str, Any]] = {
    "alarm_triggered": {
        "title": "🚨 Alarm triggered",
        "text": "The alarm (or the physical panel) is in alarm. Repeats every minute until it is disarmed.",
        "needs": "alarm", "critical": True, "every": 1, "max": 30, "disarm": True,
    },
    "failed_to_arm": {
        "title": "⚠️ Failed to arm",
        "text": "Arming was refused (open zones, a code problem) or a House Mode could not arm. Repeats every 10 "
                "minutes until the alarm is armed or disarmed.",
        "needs": "alarm", "critical": False, "every": 10, "max": 6, "disarm": False,
    },
    "panel_not_responding": {
        "title": "📟 Panel didn't respond",
        "text": "The physical panel did not follow the alarm after every retry. Repeats every 10 minutes until the "
                "panel is armed or disarmed.",
        "needs": "panel", "critical": False, "every": 10, "max": 6, "disarm": False,
    },
    "fire": {
        "title": "🔥 Fire",
        "text": "The physical panel reports a fire alarm. Repeats every minute until the panel stops reporting it.",
        "needs": "keypad:fire", "critical": True, "every": 1, "max": 0, "disarm": True,
    },
    "panic": {
        "title": "🆘 Panic",
        "text": "The physical panel reports a panic alarm. Repeats every minute until the panel stops reporting it.",
        "needs": "keypad:panic", "critical": True, "every": 1, "max": 0, "disarm": True,
    },
    "panel_trouble": {
        "title": "🔧 Panel trouble",
        "text": "Trouble, low battery or bell trouble on the physical panel. Repeats every 6 hours until it clears.",
        "needs": "keypad:trouble", "critical": False, "every": 360, "max": 4, "disarm": False,
    },
}


def _ext(hass):
    return hass.data[DATA_EXT]


# ------------------------------------------------------------------ what this system has


def alarm_entities(hass: HomeAssistant) -> list[str]:
    """The integration's alarm entities (the master first)."""
    data = hass.data.get("house_modes") or {}
    out = []
    if data.get("master") is not None and data["master"].entity_id:
        out.append(data["master"].entity_id)
    out += [e.entity_id for e in (data.get("areas") or {}).values() if e is not None and e.entity_id]
    return out


def panel_parts(hass: HomeAssistant) -> tuple[str | None, str | None]:
    """(the first linked panel, its keypad sensor)."""
    ext = _ext(hass)
    links = ext.panel.settings.get("links") or {}
    if not links:
        return None, None
    panel = next(iter(links.values()))["panel_entity"]
    return panel, ext.panel.keypad_for_panel(panel)


def phones(hass: HomeAssistant) -> list[dict[str, str]]:
    """Mobile app phones: device id, name, and the notify service the app registered for it."""
    reg = dr.async_get(hass)
    out = []
    for entry in hass.config_entries.async_entries("mobile_app"):
        name = entry.data.get("device_name") or entry.title
        for dev in dr.async_entries_for_config_entry(reg, entry.entry_id):
            out.append(
                {
                    "device_id": dev.id,
                    "name": dev.name_by_user or dev.name or name,
                    "service": f"notify.mobile_app_{slugify(name)}",
                }
            )
    return sorted(out, key=lambda p: p["name"].lower())


def default_phones(hass: HomeAssistant, devices: list[dict[str, str]]) -> list[str]:
    """The phones behind the House Mode notification services (the same people get these)."""
    services = set(((_ext(hass).house.settings.get("notifications") or {}).get("services")) or [])
    return [p["device_id"] for p in devices if p["service"] in services]


def available(hass: HomeAssistant, offer: dict) -> bool:
    """Can this system use the offer (an alarm, a linked panel, a keypad sensor with that attribute)?"""
    need = offer["needs"]
    if need == "alarm":
        return bool(alarm_entities(hass))
    panel, keypad = panel_parts(hass)
    if need == "panel":
        return panel is not None
    if keypad is None:
        return False
    st = hass.states.get(keypad)
    attr = need.split(":", 1)[1]
    keys = PANEL_TROUBLE_ATTRS if attr == "trouble" else (attr,)
    return st is not None and any(k in st.attributes for k in keys)


# ------------------------------------------------------------------ the automation configs


def _triggers(hass: HomeAssistant, oid: str) -> tuple[list[dict], list[dict], str]:
    """(alert triggers, clear triggers, message) for one offer."""
    alarms = alarm_entities(hass)
    panel, keypad = panel_parts(hass)
    if oid == "alarm_triggered":
        ents = alarms + ([panel] if panel else [])
        return (
            [{"trigger": "state", "entity_id": ents, "to": "triggered"}],
            [{"trigger": "state", "entity_id": ents, "to": "disarmed"}],
            "{{ state_attr(trigger.entity_id, 'friendly_name') or 'The alarm' }} is in ALARM"
            "{% if trigger.to_state and trigger.to_state.attributes.open_sensors %}: "
            "{{ trigger.to_state.attributes.open_sensors | list | map('state_attr', 'friendly_name') | join(', ') }}"
            "{% endif %}.",
        )
    if oid == "failed_to_arm":
        return (
            [{"trigger": "event", "event_type": "house_modes_failed_to_arm"},
             {"trigger": "event", "event_type": "house_modes_house_mode_failed"}],
            [{"trigger": "event", "event_type": "house_modes_command_success"}],
            "{% set d = trigger.event.data %}"
            "{% if d.sensors is defined %}Open: {{ d.sensors | map('state_attr', 'friendly_name') | join(', ') }}"
            "{% elif d.reason is defined and d.name is defined %}House Mode {{ d.name }}: {{ d.reason }}"
            "{% else %}{{ (d.reason | default('refused')) | replace('_', ' ') }}{% endif %}",
        )
    if oid == "panel_not_responding":
        return (
            [{"trigger": "event", "event_type": "house_modes_ext_panel", "event_data": {"type": "command_failed"}}],
            [{"trigger": "state", "entity_id": [panel], "to": [*ARMED, "disarmed"]}],
            "{{ trigger.event.data.reason }}",
        )
    attr = {"fire": ["fire"], "panic": ["panic"], "panel_trouble": list(PANEL_TROUBLE_ATTRS)}[oid]
    on = " or ".join(f"state_attr('{keypad}', '{a}') == true" for a in attr)
    text = (f"{{% set a = state_attr('{keypad}', 'alpha') or '' %}}"
            "{{ a[:16] | trim }}{% if a[16:] | trim %} / {{ a[16:32] | trim }}{% endif %}")
    return (
        [{"trigger": "template", "value_template": "{{ " + on + " }}"}],
        [{"trigger": "template", "value_template": "{{ not (" + on + ") }}"}],
        text,
    )


def build(hass: HomeAssistant, oid: str, devices: list[str], disarm_button: bool) -> dict[str, Any]:
    """The automation config for one offer (``use_blueprint``)."""
    offer = OFFERS[oid]
    alert, clear, message = _triggers(hass, oid)
    panel, _keypad = panel_parts(hass)
    inputs: dict[str, Any] = {
        "alert_trigger": alert,
        "clear_trigger": clear,
        "notify_device": devices,
        "notification_id": ID_PREFIX + oid,
        "notification_title": offer["title"].split(" ", 1)[1] + " {{ now().strftime('%-I:%M %p') }}",
        "notification_message": message,
        "repeat_notification": True,
        "time_between_repeat_notification": {"minutes": offer["every"]},
        "max_repeat_count": offer["max"],
        "include_cancel_button": True,
        "action_button_stop_label": "Stop alerts",
        "enable_auto_clear": True,
        "android_priority": "high",
        "notification_interruption_level": "critical" if offer["critical"] else "time-sensitive",
    }
    if offer["critical"]:
        inputs.update({"android_alarm_stream": True, "wake_screen_notification": True, "notification_persistent": True})
    if offer["disarm"] and disarm_button:
        target = panel or (alarm_entities(hass) or [None])[0]
        if target:
            inputs.update(
                {
                    "include_action_buttons": ["enable_action_button_1"],
                    "action_button_1_label": "Disarm / Silence",
                    "action_button_1_action": [
                        {"action": "alarm_control_panel.alarm_disarm", "target": {"entity_id": target}}
                    ],
                }
            )
    return {
        "alias": f"Repeating Alert - {offer['title'].split(' ', 1)[1]}",
        "description": f"{offer['text']} Made by House Modes & Alarm Center (Notifications → Alarm & panel alerts).",
        "use_blueprint": {"path": BLUEPRINT_PATH, "input": inputs},
    }


# ------------------------------------------------------------------ what exists already


def _raw_automations(hass: HomeAssistant) -> list[tuple[str, str, dict]]:
    from homeassistant.components.automation import DATA_COMPONENT  # noqa: PLC0415

    out = []
    for ent in getattr(hass.data.get(DATA_COMPONENT), "entities", None) or []:
        st = hass.states.get(ent.entity_id)
        if st is None or st.state != "on":
            continue
        raw = getattr(ent, "raw_config", None) or {}
        name = st.attributes.get("friendly_name") or ent.entity_id
        out.append((ent.entity_id, name, raw))
    return out


def covered_by(hass: HomeAssistant) -> dict[str, list[str]]:
    """Offers the user's own (enabled) automations already cover: {offer: [automation names]}."""
    _panel, keypad = panel_parts(hass)
    out: dict[str, list[str]] = {oid: [] for oid in OFFERS}
    for _eid, name, raw in _raw_automations(hass):
        if "use_blueprint" in raw and (raw["use_blueprint"].get("input") or {}).get("notification_id", "").startswith(
            ID_PREFIX
        ):
            continue  # one of ours
        trig = json.dumps(raw.get("triggers", raw.get("trigger")) or [])
        if keypad and keypad in trig:
            for oid, attrs in (("fire", ("'fire'",)), ("panic", ("'panic'",)),
                               ("panel_trouble", tuple(f"'{a}'" for a in PANEL_TROUBLE_ATTRS)),
                               ("alarm_triggered", ("'alarm'",))):
                if any(a in trig for a in attrs):
                    out[oid].append(name)
        if "house_modes_failed_to_arm" in trig or "house_modes_house_mode_failed" in trig:
            out["failed_to_arm"].append(name)
        if '"triggered"' in trig and "alarm_control_panel." in trig:
            out["alarm_triggered"].append(name)
    return {k: sorted(set(v)) for k, v in out.items() if v}


def created(hass: HomeAssistant) -> dict[str, dict]:
    """Offers already set up: {offer: the alert automation (entity_id, edit_id, name, state)}."""
    out = {}
    for item in alert_items(hass):
        tag = item.get("summary", {}).get("tag") or ""
        if tag.startswith(ID_PREFIX) and tag[len(ID_PREFIX):] in OFFERS:
            out[tag[len(ID_PREFIX):]] = {k: item[k] for k in ("entity_id", "edit_id", "name", "state")}
    return out


def imported_once(hass: HomeAssistant) -> dict[str, list[str]]:
    """Alarm notifications (sent once) that cover the same event: {offer: [names]}."""
    out: dict[str, list[str]] = {}
    try:
        autos = _ext(hass).store.async_get_automations().values()
    except Exception:  # no store yet
        return out
    for a in autos:
        if a.get("type") != "notification" or not a.get("enabled", True):
            continue
        events = {t.get("event") for t in a.get("triggers") or []}
        if "triggered" in events:
            out.setdefault("alarm_triggered", []).append(a.get("name") or "")
        if "failed" in events:
            out.setdefault("failed_to_arm", []).append(a.get("name") or "")
    return out


def offers_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Everything the Notifications tab and Quick Start show."""
    have = created(hass)
    cover = covered_by(hass)
    once = imported_once(hass)
    devices = phones(hass)
    rows = []
    for oid, offer in OFFERS.items():
        if not available(hass, offer):
            continue
        status = "created" if oid in have else ("covered" if oid in cover else "available")
        rows.append(
            {
                "id": oid,
                "title": offer["title"],
                "text": offer["text"],
                "critical": offer["critical"],
                "disarm": offer["disarm"],
                "status": status,
                "automation": have.get(oid),
                "covered_by": cover.get(oid, []),
                "notified_once_by": once.get(oid, []),
            }
        )
    return {
        "offers": rows,
        "phones": devices,
        "default_phones": default_phones(hass, devices),
        "blueprint": blueprint_status(hass),
    }


def step_status(hass: HomeAssistant) -> tuple[str, str]:
    """Quick Start: (status, detail)."""
    p = offers_payload(hass)
    rows = p["offers"]
    if not rows:
        return "skip", "nothing to alert on yet"
    left = [r for r in rows if r["status"] == "available"]
    if not left:
        made = sum(1 for r in rows if r["status"] == "created")
        cov = sum(1 for r in rows if r["status"] == "covered")
        return "done", f"{made} set up" + (f", {cov} covered by your automations" if cov else "")
    return "optional", (f"{len(left)} recommended: " + ", ".join(r["title"].split(" ", 1)[1] for r in left)
                        + ". They repeat until the problem ends or you stop them")


# ------------------------------------------------------------------ websocket (admin)


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alert_offers/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get(hass, connection, msg):
    """The offers, what exists, the phones."""
    connection.send_result(msg["id"], offers_payload(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_modes/ext/alert_offers/build",
        vol.Required("offers"): [vol.In(list(OFFERS))],
        vol.Required("devices"): [str],
        vol.Optional("disarm_button", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_build(hass, connection, msg):
    """The automation configs to save (the blueprint is installed first if needed)."""
    if not msg["devices"]:
        connection.send_error(msg["id"], "invalid", "Choose at least one phone.")
        return
    st = blueprint_status(hass)
    if not st["installed"] or st["update"]:
        try:
            await hass.async_add_executor_job(install_blueprint, hass)
            if hass.services.has_service("automation", "reload"):
                await hass.services.async_call("automation", "reload", blocking=True)
        except (OSError, ValueError) as err:
            connection.send_error(msg["id"], "blueprint", str(err))
            return
    have = created(hass)
    configs = [
        {"offer": oid, "config": build(hass, oid, msg["devices"], msg["disarm_button"])}
        for oid in msg["offers"]
        if oid not in have and available(hass, OFFERS[oid])
    ]
    connection.send_result(msg["id"], {"configs": configs})


OFFER_COMMANDS = (ws_get, ws_build)
