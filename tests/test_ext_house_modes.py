# ruff: noqa: E501
"""Phases 5 and 6: House Modes and timers, with real Alarmo partitions."""

from typing import Any

import pytest
from homeassistant.setup import async_setup_component
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from custom_components.alarmo.house_config import normalize

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF, UP, GAR = "1700000001", "1700000002", "1700000003"
E_GF, E_GAR = (
    "alarm_control_panel.ground_floor",
    "alarm_control_panel.garage_outbuildings",
)
SELECT = "select.alarmo_house_mode"


def _modes() -> list[dict]:
    everyone = [
        "manual",
        "automation",
        "schedule",
        "presence_away",
        "presence_home",
        "lock",
        "panel_keypad",
        "timer",
    ]
    return [
        {
            "id": "disarmed",
            "name": "Disarmed",
            "targets": {GF: "disarmed", GAR: "disarmed"},
        },
        {
            "id": "stay",
            "name": "Stay",
            "targets": {GF: "armed_home", GAR: "armed_home"},
        },
        {
            "id": "local",
            "name": "Local",
            "targets": {GF: "disarmed", GAR: "disarmed"},
            "enter_sources": ["manual"],
            "leave_sources": [s for s in everyone if s != "presence_away"],
        },
        {
            "id": "spa",
            "name": "Spa",
            "targets": {GF: "armed_custom_bypass"},
            "delay_sources": {"schedule": 30},
            "timers": [{"after_minutes": 45, "then": "previous"}],
        },
        {
            "id": "away",
            "name": "Away",
            "targets": {GF: "armed_away"},
            "on_failure": "undo",
        },
        {
            "id": "night",
            "name": "Night",
            "targets": {GF: "armed_night"},
            "readiness": {"entities": ["binary_sensor.gf_window_1"], "action": "block"},
        },
        {"id": "guest", "name": "Guest", "targets": {}},
    ]


async def _setup(hass, hass_storage, tmp_path, **extra) -> Any:
    env = load_fixture_envelope()
    # enable custom bypass on the ground floor so Spa can arm it
    env["data"]["areas"][0]["modes"]["armed_custom_bypass"]["enabled"] = True
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    mgr = hass.data["alarmo_ext"].house
    await mgr.async_save_settings({"enabled": True, "modes": _modes(), **extra})
    await _settle(hass)
    await advance_time(hass, 5)  # let the delayed start-up (re)start run first
    return mgr


async def _settle(hass) -> None:
    for _ in range(3):
        await hass.async_block_till_done()


def _state(hass, eid) -> str:
    return hass.states.get(eid).state


async def test_set_mode_arms_partitions_and_select(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Stay arms two partitions; the select entity and history follow."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    events = []
    hass.bus.async_listen("alarmo_house_mode_changed", lambda e: events.append(e.data))
    res = await mgr.async_set_mode("Stay", "manual")
    await _settle(hass)
    assert res == {"result": "changed", "mode": "stay"}
    assert _state(hass, E_GF) == "armed_home" and _state(hass, E_GAR) == "armed_home"
    st = hass.states.get(SELECT)
    assert st.state == "Stay" and "Away" in st.attributes["options"]
    assert events[-1]["mode"] == "stay" and events[-1]["source"] == "manual"
    assert (await mgr.async_set_mode("stay"))["result"] == "same"
    await mgr.async_set_mode("Disarmed")
    await _settle(hass)
    assert _state(hass, E_GF) == "disarmed"
    s = mgr.settings
    assert s["previous"] == "stay" and [h["to"] for h in s["history"]] == [
        "stay",
        "disarmed",
    ]


async def test_select_entity_sets_mode(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """select.select_option changes the mode (source automation without a user)."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": SELECT, "option": "Guest"},
        blocking=True,
    )
    await _settle(hass)
    assert mgr.settings["current"] == "guest" and mgr.settings["source"] == "automation"


async def test_permission_table_blocks_presence(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Local: only manual may enter; presence_away may not leave it."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    blocked = []
    hass.bus.async_listen("alarmo_house_mode_blocked", lambda e: blocked.append(e.data))
    assert (await mgr.async_set_mode("Local", "automation"))["result"] == "blocked"
    assert (await mgr.async_set_mode("Local", "manual"))["result"] == "changed"
    res = await mgr.async_set_mode("Away", "presence_away")
    assert res["result"] == "blocked" and "Local" in res["reason"]
    assert (await mgr.async_set_mode("Away", "presence_away", force=True))[
        "result"
    ] == "changed"
    await _settle(hass)
    assert len(blocked) == 2


async def test_readiness_blocks(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Night is blocked while the readiness window is open."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    hass.states.async_set("binary_sensor.gf_window_1", "on")
    res = await mgr.async_set_mode("Night", "schedule")
    assert res == {"result": "not_ready", "open": ["binary_sensor.gf_window_1"]}
    assert _state(hass, E_GF) == "disarmed"


async def test_failure_undo(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Arming fails (open door) → undo and report; mode unchanged."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await mgr.async_set_mode("Guest")
    failed = []
    hass.bus.async_listen("alarmo_house_mode_failed", lambda e: failed.append(e.data))
    hass.states.async_set("binary_sensor.gf_window_2", "on")  # windows may not be open while arming
    await _settle(hass)
    res = await mgr.async_set_mode("Away")
    await _settle(hass)
    assert res["result"] == "failed" and res["policy"] == "undo"
    assert _state(hass, E_GF) == "disarmed"
    assert mgr.settings["current"] == "guest"
    assert failed and failed[0]["mode"] == "away"


async def test_external_change_is_tracked(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Arming partitions directly updates the House Mode when they match a mode."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await mgr.async_set_mode("Disarmed")
    await _settle(hass)
    for ent in (E_GF, E_GAR):
        await hass.services.async_call(
            "alarmo",
            "arm",
            {"entity_id": ent, "code": "1234", "mode": "home"},
            blocking=True,
        )
        await _settle(hass)
    assert mgr.settings["current"] == "stay" and mgr.settings["source"] == "external"
    await hass.services.async_call(
        "alarmo", "disarm", {"entity_id": E_GAR, "code": "1234"}, blocking=True
    )
    await _settle(hass)
    assert mgr.settings["current"] is None
    assert hass.states.get(SELECT).state == "unknown"


async def test_timer_returns_to_previous_and_survives_restart(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Spa goes back to the previous mode after 45 min, even after a restart."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await mgr.async_set_mode("Stay")
    await mgr.async_set_mode("Spa")
    await _settle(hass)
    assert _state(hass, E_GF) == "armed_custom_bypass"
    pending = mgr.settings["pending"]
    assert len(pending) == 1 and pending[0]["target"] == "stay"
    mgr.async_restart()  # timers are re-armed from storage
    await advance_time(hass, 46 * 60)
    await _settle(hass)
    assert mgr.settings["current"] == "stay" and mgr.settings["source"] == "timer"
    assert mgr.settings["pending"] == []


async def test_delayed_source(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """While in Spa, a schedule change waits 30 min."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await mgr.async_set_mode("Guest")
    await mgr.async_set_mode("Spa")
    res = await mgr.async_set_mode("Stay", "schedule")
    assert res == {"result": "delayed", "minutes": 30}
    assert mgr.settings["current"] == "spa"
    await advance_time(hass, 31 * 60)
    await _settle(hass)
    assert mgr.settings["current"] == "stay" and mgr.settings["source"] == "schedule"


async def test_changing_mode_cancels_timers(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """A manual change drops Spa's revert timer."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await mgr.async_set_mode("Stay")
    await mgr.async_set_mode("Spa")
    await mgr.async_set_mode("Guest")
    await advance_time(hass, 50 * 60)
    await _settle(hass)
    assert mgr.settings["current"] == "guest"


async def test_input_select_mirror(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Both ways with an input_select (migration from the user's helper)."""
    assert await async_setup_component(
        hass,
        "input_select",
        {
            "input_select": {
                "hms": {"options": ["Disarmed", "Stay", "Guest", "unknown"]}
            }
        },
    )
    mgr = await _setup(hass, hass_storage, tmp_path, input_select="input_select.hms")
    await hass.services.async_call(
        "input_select",
        "select_option",
        {"entity_id": "input_select.hms", "option": "Stay"},
        blocking=True,
    )
    await _settle(hass)
    assert mgr.settings["current"] == "stay"
    await mgr.async_set_mode("Guest")
    await _settle(hass)
    assert _state(hass, "input_select.hms") == "Guest"


async def test_lock_keypad(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A guest lock code sets Guest (source lock)."""
    mgr = await _setup(
        hass,
        hass_storage,
        tmp_path,
        lock_keypads=[{"node_id": 138, "slots": {"2": "guest"}}],
    )
    hass.bus.async_fire(
        "zwave_js_notification",
        {
            "node_id": 138,
            "event_label": "Keypad unlock operation",
            "parameters": {"userId": 2},
        },
    )
    await _settle(hass)
    assert mgr.settings["current"] == "guest" and mgr.settings["source"] == "lock"


async def test_service_and_ws(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """alarmo.set_house_mode returns the result; websocket get/set work."""
    await _setup(hass, hass_storage, tmp_path)
    res = await hass.services.async_call(
        "alarmo",
        "set_house_mode",
        {"mode": "Guest", "source": "schedule"},
        blocking=True,
        return_response=True,
    )
    assert res == {"result": "changed", "mode": "guest"}
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/house/get"})
    msg = await client.receive_json()
    assert msg["result"]["settings"]["current"] == "guest"
    await client.send_json({"id": 2, "type": "alarmo/ext/house/set", "mode": "nope"})
    assert not (await client.receive_json())["success"]
    await client.send_json(
        {
            "id": 3,
            "type": "alarmo/ext/house/save",
            "settings": {
                "modes": [
                    {
                        "id": "a",
                        "name": "A",
                        "timers": [{"after_minutes": 5, "then": "zz"}],
                    }
                ]
            },
        }
    )
    assert not (await client.receive_json())["success"]


async def test_disabled_and_admin(
    hass: Any,
    hass_storage: Any,
    hass_ws_client: Any,
    hass_read_only_access_token: str,
    tmp_path: Any,
) -> None:
    """Off by default; non-admins cannot use the commands."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    assert hass.states.get(SELECT).state == "unavailable"
    client = await hass_ws_client(hass, hass_read_only_access_token)
    for i, cmd in enumerate(
        [
            {"type": "alarmo/ext/house/get"},
            {"type": "alarmo/ext/house/save", "settings": {}},
            {"type": "alarmo/ext/house/set", "mode": "x"},
        ],
        start=1,
    ):
        await client.send_json({"id": i, **cmd})
        assert (await client.receive_json())["error"]["code"] == "unauthorized"


async def test_lock_detection_and_disabled_keypad(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Z-Wave locks are found with their node id; a disabled keypad is ignored."""
    mgr = await _setup(hass, hass_storage, tmp_path, lock_keypads=[{"node_id": 138, "enabled": False, "slots": {"2": "guest"}}])
    zentry = MockConfigEntry(domain="zwave_js")
    zentry.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(config_entry_id=zentry.entry_id, identifiers={("zwave_js", "3967-138")})
    er.async_get(hass).async_get_or_create("lock", "zwave_js", "3967.138-98-0-x", device_id=dev.id, config_entry=zentry, suggested_object_id="front_door_deadbolt")
    hass.states.async_set("lock.front_door_deadbolt", "locked", {"friendly_name": "Front Door"})
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/house/locks"})
    (lock,) = (await client.receive_json())["result"]["locks"]
    assert lock == {"entity_id": "lock.front_door_deadbolt", "name": "Front Door", "node_id": 138, "slots": None, "configured": True}
    hass.bus.async_fire("zwave_js_notification", {"node_id": 138, "event_label": "Keypad unlock operation", "parameters": {"userId": 2}})
    await _settle(hass)
    assert mgr.settings["current"] is None


async def test_notify_several_services_and_old_setting(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """House Mode messages go to every chosen notify service; ext.6's single value still loads."""
    a = async_mock_service(hass, "notify", "phone_a")
    b = async_mock_service(hass, "notify", "phone_b")
    mgr = await _setup(hass, hass_storage, tmp_path, notify_services=["notify.phone_a", "notify.phone_b"])
    hass.states.async_set("binary_sensor.gf_window_1", "on")
    await mgr.async_set_mode("Night", "manual")
    await _settle(hass)
    assert len(a) == 1 and len(b) == 1

    assert normalize({"notify_service": "notify.x"})["notify_services"] == ["notify.x"]


async def test_house_mode_steps(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Scenes/scripts run in order: leave-before, enter-before, (arming), leave-after, enter-after; filters apply."""
    calls: list[tuple[str, str, dict]] = []

    async def _rec(call):
        calls.append((call.domain, call.service, dict(call.data)))

    for dom, svc in (("scene", "turn_on"), ("script", "turn_on")):
        hass.services.async_register(dom, svc, _rec)
    modes = _modes()
    stay = next(m for m in modes if m["id"] == "stay")
    stay["steps"] = [
        {"entity_id": "scene.lock_up", "when": "enter", "phase": "before"},
        {"entity_id": "script.lights_evening", "when": "enter", "phase": "after", "modes": ["disarmed"]},
        {"entity_id": "scene.never", "when": "enter", "phase": "after", "modes": ["away"]},
        {"entity_id": "scene.stay_ends", "when": "leave", "phase": "after"},
    ]
    env = load_fixture_envelope()
    env["data"]["areas"][0]["modes"]["armed_custom_bypass"]["enabled"] = True
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    mgr = hass.data["alarmo_ext"].house
    await mgr.async_save_settings({"enabled": True, "modes": modes})
    await _settle(hass)
    await advance_time(hass, 5)
    await mgr.async_set_mode("disarmed", "manual", force=True)
    await _settle(hass)
    calls.clear()
    await mgr.async_set_mode("stay", "manual")
    await _settle(hass)
    assert calls[0] == ("scene", "turn_on", {"entity_id": "scene.lock_up"})
    assert ("script", "turn_on", {"entity_id": "script.lights_evening", "variables": {"from_mode": "Disarmed", "to_mode": "Stay", "source": "manual"}}) in calls
    assert all(c[2]["entity_id"] != "scene.never" for c in calls)
    calls.clear()
    await mgr.async_set_mode("disarmed", "manual")
    await _settle(hass)
    assert calls == [("scene", "turn_on", {"entity_id": "scene.stay_ends"})]
