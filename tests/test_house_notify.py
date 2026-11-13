# ruff: noqa: E501
"""House Mode notifications: Simple (sent by the integration) and Advanced (the blueprint)."""

import json
import shutil
from typing import Any
from pathlib import Path

import pytest
from homeassistant.core import Context
from homeassistant.setup import async_setup_component
from homeassistant.util.yaml import load_yaml
from homeassistant.components.blueprint.models import Blueprint, BlueprintInputs
from homeassistant.components.automation.config import AUTOMATION_BLUEPRINT_SCHEMA
from pytest_homeassistant_custom_component.common import async_mock_service

from tests.helpers import advance_time
from tests.test_ext_house_modes import _setup, _settle
from custom_components.house_modes import house_notify
from custom_components.house_modes.house_config import normalize, normalize_notifications

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

ROOT = Path(__file__).resolve().parents[1]
SHIPPED = ROOT / "custom_components" / "house_modes" / "blueprints" / "house-mode-notifications-ltek.yaml"
REPO_COPY = ROOT / "blueprints" / "automation" / "LTek" / "house-mode-notifications-ltek.yaml"


async def _ws(client, i, **msg):
    await client.send_json({"id": i, **msg})
    return await client.receive_json()


def _notif(**kw) -> dict:
    return normalize_notifications({"services": ["notify.phone"], **kw})


# ------------------------------------------------------------------ settings, rendering


def test_migration_keeps_the_old_wording_and_choices() -> None:
    """The settings of earlier builds become the new ones; nothing changes until edited."""
    s = normalize({"notify_services": ["notify.a"], "notify_changes": True, "notify_skip_sources": ["schedule"]})
    n = s["notifications"]
    assert n["services"] == ["notify.a"] and n["skip_sources"] == ["schedule"]
    assert n["changed"]["enabled"] is True and n["blocked"]["enabled"] and n["failed"]["enabled"] and n["timer"]["enabled"]
    assert n["changed"]["title"] == "House Mode: {mode}" and n["changed"]["message"] == "{change}"
    assert "notify_services" not in s and "notify_changes" not in s
    assert normalize({})["notifications"]["changed"]["enabled"] is False


def test_render_and_payload() -> None:
    """Placeholders are filled; empty ones leave no stray separators; priority, tag and buttons become data."""
    assert house_notify.render("{mode} · {previous} · {source}", {"mode": "Stay", "previous": "", "source": "timer"}) == "Stay · timer"
    assert house_notify.render("{mode} {nope}", {"mode": "Away"}) == "Away {nope}"
    s = _notif(replace=True, changed={"enabled": True, "priority": "critical", "buttons": ["undo", "disarm"], "message": "{change} ({duration})"})
    p = house_notify.payload(s, "changed", {"mode": "Stay", "change": "from Disarmed · by hand", "duration": "2 h", "mode_id": "stay"}, {"undo": "disarmed"})
    assert p["title"] == "House Mode: Stay" and p["message"] == "from Disarmed · by hand (2 h)"
    assert p["data"]["tag"] == "house_modes_changed" and p["data"]["push"]["interruption-level"] == "critical"
    assert [a["action"] for a in p["data"]["actions"]] == ["HOUSE_MODES_HM_UNDO__disarmed", "HOUSE_MODES_HM_DISARM__"]
    # Undo without a previous mode is left out; filters
    p = house_notify.payload(s, "changed", {"mode": "Stay", "mode_id": "stay"}, {"undo": ""})
    assert [a["title"] for a in p["data"]["actions"]] == ["Disarm"]
    assert house_notify.payload({**s, "skip_sources": ["timer"]}, "changed", {"source_id": "timer"}, {}) is None
    assert house_notify.payload({**s, "only_modes": ["away"]}, "changed", {"mode_id": "stay"}, {}) is None
    assert house_notify.duration_text(40) == "40 s" and house_notify.duration_text(3900) == "1 h 5 min"


# ------------------------------------------------------------------ Simple: sending


async def test_change_sends_with_priority_tag_and_buttons(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A change sends the customized message with phone-app data."""
    calls = async_mock_service(hass, "notify", "phone")
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=_notif(
        replace=True, changed={"enabled": True, "title": "HM {mode}", "message": "was {previous}", "priority": "high", "buttons": ["undo"]}))
    await mgr.async_set_mode("Stay", "manual")
    await mgr.async_set_mode("Disarmed", "manual")
    await _settle(hass)
    last = calls[-1].data
    assert (last["title"], last["message"]) == ("HM Disarmed", "was Stay")
    assert last["data"]["priority"] == "high" and last["data"]["tag"] == "house_modes_changed"
    assert last["data"]["actions"] == [{"action": "HOUSE_MODES_HM_UNDO__stay", "title": "Undo"}]


async def test_service_without_data_gets_the_text(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A notify service that refuses `data` is called again with the text only."""
    got = []

    async def _svc(call):
        if "data" in call.data:
            raise ValueError("no data here")
        got.append(dict(call.data))

    hass.services.async_register("notify", "email", _svc)
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=normalize_notifications(
        {"services": ["notify.email"], "changed": {"enabled": True, "priority": "high"}}))
    await mgr.async_set_mode("Stay", "manual")
    await _settle(hass)
    assert got == [{"title": "House Mode: Stay", "message": "by hand"}]


async def test_blocked_by_allowed_sources_now_notifies(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A change refused by Allowed Sources sends a Blocked message (with Change anyway)."""
    calls = async_mock_service(hass, "notify", "phone")
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=_notif(blocked={"buttons": ["force", "dismiss"]}))
    res = await mgr.async_set_mode("Local", "presence_away")
    await _settle(hass)
    assert res["result"] == "blocked"
    assert calls[-1].data["title"] == "Local not set"
    assert calls[-1].data["data"]["actions"][0]["action"] == "HOUSE_MODES_HM_FORCE__local"


async def test_house_tab_save_keeps_the_notifications(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Saving the House Modes tab (no `notifications` in it) leaves the Notifications tab's settings alone."""
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=_notif(changed={"enabled": True, "title": "X"}))
    settings = {k: v for k, v in mgr.settings.items() if k != "notifications"}
    await mgr.async_save_settings(settings)
    assert mgr.settings["notifications"]["changed"]["title"] == "X"


# ------------------------------------------------------------------ Simple: buttons


async def test_buttons_respect_the_user(hass: Any, hass_storage: Any, tmp_path: Any, hass_admin_user: Any, hass_read_only_user: Any) -> None:
    """Undo works for an admin; another user's press is refused unless chosen."""
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=_notif())
    await mgr.async_set_mode("Stay", "manual")
    await _settle(hass)
    hass.bus.async_fire("mobile_app_notification_action", {"action": "HOUSE_MODES_HM_UNDO__disarmed"},
                        context=Context(user_id=hass_read_only_user.id))
    await _settle(hass)
    assert mgr.settings["current"] == "stay"
    hass.bus.async_fire("mobile_app_notification_action", {"action": "HOUSE_MODES_HM_UNDO__disarmed"},
                        context=Context(user_id=hass_admin_user.id))
    await _settle(hass)
    assert mgr.settings["current"] == "disarmed"
    ext = hass.data["house_modes_ext"]
    await mgr.async_save_settings({**mgr.settings, "notifications": _notif(button_users=[hass_read_only_user.id])})
    hass.bus.async_fire("mobile_app_notification_action", {"action": "HOUSE_MODES_HM_RETRY__stay"},
                        context=Context(user_id=hass_read_only_user.id))
    await _settle(hass)
    assert mgr.settings["current"] == "stay" and ext.notifier.settings["button_users"] == [hass_read_only_user.id]


async def test_timer_buttons_cancel_and_now(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Spa sets a timer (event + message with Cancel timer / Do it now); both buttons work."""
    calls = async_mock_service(hass, "notify", "phone")
    timers = []
    hass.bus.async_listen("house_modes_house_mode_timer", lambda e: timers.append(e.data))
    mgr = await _setup(hass, hass_storage, tmp_path, notifications=_notif(timer={"buttons": ["cancel", "now"]}))
    await mgr.async_set_mode("Stay", "manual")  # Spa's timer goes back to the previous mode
    await mgr.async_set_mode("Spa", "manual")
    await _settle(hass)
    assert timers and timers[-1]["when"].startswith("in ") and mgr.settings["pending"]
    assert calls[-1].data["message"].startswith("Changes to ")
    entry = mgr.settings["pending"][0]["id"]
    await hass.data["house_modes_ext"].notifier.async_press("cancel", entry)
    assert mgr.settings["pending"] == []
    await mgr.async_set_mode("Stay", "manual")
    await mgr.async_set_mode("Spa", "manual")
    await _settle(hass)
    entry = mgr.settings["pending"][0]
    await hass.data["house_modes_ext"].notifier.async_press("now", entry["id"])
    await _settle(hass)
    assert mgr.settings["current"] == entry["target"]


# ------------------------------------------------------------------ websocket


async def test_ws_get_save_test(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Get / save / test from the Notifications tab."""
    calls = async_mock_service(hass, "notify", "phone")
    await _setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="house_modes/ext/house_notify/get"))["result"]
    assert set(res["settings"]) >= {"services", "changed", "blocked", "failed", "timer"} and res["advanced"] == []
    new = {**res["settings"], "services": ["notify.phone"], "changed": {**res["settings"]["changed"], "enabled": True}}
    res = await _ws(client, 2, type="house_modes/ext/house_notify/save", settings=new)
    assert res["success"] and res["result"]["settings"]["changed"]["enabled"]
    bad = await _ws(client, 3, type="house_modes/ext/house_notify/save", settings={"changed": {"priority": "loud"}})
    assert not bad["success"]
    res = await _ws(client, 4, type="house_modes/ext/house_notify/test", event="failed")
    assert res["result"] == {"sent": 1} and calls[-1].data["title"] == "[Test] House Mode Stay failed"


# ------------------------------------------------------------------ Advanced: the blueprint


def test_blueprint_shipped_and_repo_copy_match() -> None:
    """The file the integration installs and the one in blueprints/ are the same; its name follows the rule."""
    assert SHIPPED.read_bytes() == REPO_COPY.read_bytes()
    bp = load_yaml(str(SHIPPED))["blueprint"]
    assert bp["name"].endswith(" (Ltek)") and house_notify.MARKER in bp["description"]


async def test_blueprint_sends_and_is_listed(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """An automation from the blueprint sends on the chosen events, and the tab sees which events it covers."""
    await _setup(hass, hass_storage, tmp_path)
    target = Path(hass.config.path("blueprints", "automation", "LTek"))
    target.mkdir(parents=True, exist_ok=True)
    shutil.copy(SHIPPED, target / "house-mode-notifications-ltek.yaml")
    calls = async_mock_service(hass, "notify", "family")
    assert await async_setup_component(hass, "automation", {"automation": [{
        "id": "hmn1", "alias": "HM notify",
        "use_blueprint": {"path": house_notify.BLUEPRINT_PATH, "input": {
            "events": ["changed", "failed"], "notify_services": ["notify.family"], "skip_sources": ["schedule"],
            "body": "{{ mode }} after {{ previous }} ({{ source }})", "priority": "high"}},
    }]})
    await _settle(hass)
    mgr = hass.data["house_modes_ext"].house
    await mgr.async_set_mode("Disarmed", "schedule")  # skipped source
    await mgr.async_set_mode("Stay", "manual")
    await _settle(hass)
    assert len(calls) == 1
    assert calls[0].data["title"] == "House Mode: Stay" and calls[0].data["message"] == "Stay after Disarmed (manual)"
    assert calls[0].data["data"]["priority"] == "high"
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="house_modes/ext/house_notify/get"))["result"]
    assert [i["events"] for i in res["advanced"]] == [["changed", "failed"]]
    assert res["covered"]["changed"] == ["HM notify"] and res["covered"]["timer"] == []


def test_blueprint_inputs_validate() -> None:
    """Defaults alone make a valid automation."""
    bp = Blueprint(load_yaml(str(SHIPPED)), expected_domain="automation", schema=AUTOMATION_BLUEPRINT_SCHEMA)
    filled = BlueprintInputs(bp, {"use_blueprint": {"path": "x.yaml", "input": {}}})
    filled.validate()
    cfg = filled.async_substitute()
    assert len(cfg["triggers"]) == 4 and json.dumps(cfg).count("house_modes_house_mode_") == 4


async def test_sync_installs_once_and_never_replaces_a_foreign_file(hass: Any, tmp_path: Any) -> None:
    """Installed when missing; someone else's file of the same name is left."""
    hass.config.config_dir = str(tmp_path)
    assert house_notify.sync_blueprint(hass) == "installed"
    assert house_notify.sync_blueprint(hass) is None
    p = tmp_path / "blueprints" / "automation" / "LTek" / "house-mode-notifications-ltek.yaml"
    p.write_text("blueprint: {name: mine}\n")
    assert house_notify.sync_blueprint(hass) is None and p.read_text().startswith("blueprint: {name: mine}")
    await advance_time(hass, 1)
