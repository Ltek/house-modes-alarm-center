# ruff: noqa: E501
"""House Modes shadow mode: evaluate next to the user's automations, change nothing, compare."""

from typing import Any

import pytest
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import async_mock_service

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from tests.test_ext_house_modes import GF, E_GF, E_GAR, SELECT, _modes, _state, _settle

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

REQ = "input_select.selector"
CONFIRMED = "input_select.confirmed"
OPTIONS = ["Disarmed", "Stay", "Local", "Spa", "Away", "Night", "Guest", "unknown"]


async def _setup(hass, hass_storage, tmp_path, modes=None) -> Any:
    assert await async_setup_component(
        hass, "input_select", {"input_select": {"selector": {"options": OPTIONS}, "confirmed": {"options": OPTIONS}}}
    )
    env = load_fixture_envelope()
    env["data"]["areas"][0]["modes"]["armed_custom_bypass"]["enabled"] = True
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    mgr = hass.data["alarmo_ext"].house
    await mgr.async_save_settings(
        {"enabled": True, "run_mode": "shadow", "modes": modes or _modes(), "input_select": REQ, "current_entity": CONFIRMED}
    )
    await _settle(hass)
    await advance_time(hass, 5)
    return mgr


async def _select(hass, ent, option) -> None:
    await hass.services.async_call("input_select", "select_option", {"entity_id": ent, "option": option}, blocking=True)
    await _settle(hass)


async def _user_arms(hass, mode, *ents, confirmed: str | None = None) -> None:
    """The user's own automations arm the partitions (and set their own mode entity)."""
    for ent in ents:
        await hass.services.async_call("alarmo", "arm", {"entity_id": ent, "code": "1234", "mode": mode, "force": True}, blocking=True)
        await _settle(hass)
    if confirmed:
        await _select(hass, CONFIRMED, confirmed)
    await advance_time(hass, 120)  # exit delays


def _log(mgr) -> list[tuple[str, bool | None]]:
    return [(e["msg"], e["ok"]) for e in mgr.shadow_log.log]


async def test_shadow_changes_nothing_and_matches(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A selector request is evaluated; nothing is armed; the user's automations doing it is a match."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    events = []
    hass.bus.async_listen("alarmo_house_mode_changed", lambda e: events.append(e))
    assert mgr.settings["current"] == "disarmed"  # picked up from the partitions
    await _select(hass, REQ, "Stay")
    await advance_time(hass, 2)
    assert _state(hass, E_GF) == "disarmed"  # shadow arms nothing
    assert any("Disarmed → Stay: would set" in m for m, _ in _log(mgr))
    await _user_arms(hass, "home", E_GF, E_GAR, confirmed="Stay")
    await advance_time(hass, 6)
    assert any(m.startswith("Stay: your automations got there after") and ok for m, ok in _log(mgr))
    assert any(m.startswith(f"{CONFIRMED} is Stay") and ok for m, ok in _log(mgr))
    s = mgr.settings
    assert s["current"] == "stay" and s["history"][-1]["result"] == "shadow"
    assert hass.states.get(SELECT).state == "Stay"
    assert not events  # no House Mode events in shadow
    assert mgr.shadow_log.summary()["matched"] >= 2


async def test_shadow_reports_a_failed_change(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Nobody arms: after the watch time the request counts as differing."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await _select(hass, REQ, "Away")
    await advance_time(hass, 181)
    assert any("after 180 s the partitions are" in m and ok is False for m, ok in _log(mgr))
    assert mgr.settings["current"] == "disarmed"


async def test_shadow_block_but_your_automations_changed(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Night is not ready (window open): House Modes would not change, the user's automations did."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    hass.states.async_set("binary_sensor.gf_window_1", "on")
    res = await mgr.async_set_mode("Night", "automation")
    assert res["result"] == "shadow" and res["would"] == "not_ready"
    hass.states.async_set("binary_sensor.gf_window_1", "off")
    await _user_arms(hass, "night", E_GF)
    assert any("would not change, not ready" in m for m, _ in _log(mgr))
    assert any(m.startswith("Night: but your automations changed to it") and ok is False for m, ok in _log(mgr))


async def test_shadow_external_change_and_compare(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Partitions armed without a request: House Mode would follow; compared with the user's entity."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await _user_arms(hass, "home", E_GF, E_GAR)
    assert any("outside House Modes → House Mode would become Stay" in m for m, _ in _log(mgr))
    await advance_time(hass, 31)
    assert any(m.startswith(f"{CONFIRMED} is Disarmed, House Modes: Stay") and ok is False for m, ok in _log(mgr))


async def test_shadow_timer_and_no_steps(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Spa's 45 min timer is logged and evaluated in memory; scenes are never run; the selector is never written."""
    modes = _modes()
    spa = next(m for m in modes if m["id"] == "spa")
    spa["steps"] = [{"entity_id": "scene.spa"}]
    mgr = await _setup(hass, hass_storage, tmp_path, modes)
    scenes = async_mock_service(hass, "scene", "turn_on")
    await mgr.async_set_mode("Stay", "manual")
    await _user_arms(hass, "home", E_GF, E_GAR)
    await mgr.async_set_mode("Spa", "manual")
    await hass.services.async_call("alarmo", "disarm", {"entity_id": E_GF, "code": "1234"}, blocking=True)
    await _user_arms(hass, "custom", E_GF)
    assert mgr.settings["current"] == "spa"
    assert any("would run scene.spa" in m for m, _ in _log(mgr))
    assert any("Spa: would change to Stay in 45 min" in m for m, _ in _log(mgr))
    await advance_time(hass, 46 * 60)
    await _settle(hass)
    assert any("timer due: Stay now" in m for m, _ in _log(mgr))
    assert not scenes
    assert _state(hass, REQ) == "unknown" or _state(hass, REQ) == OPTIONS[0]
    assert mgr.settings["pending"] == []


async def test_shadow_to_live_keeps_the_mode(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Switching to live keeps the shadow's current mode, and live House Modes act again."""
    mgr = await _setup(hass, hass_storage, tmp_path)
    await _user_arms(hass, "home", E_GF, E_GAR)
    assert mgr.settings["current"] == "stay"
    s = mgr.settings
    s["run_mode"] = "live"
    await mgr.async_save_settings(s)
    await _settle(hass)
    assert mgr.settings["current"] == "stay"
    res = await mgr.async_set_mode("Disarmed", "manual")
    await _settle(hass)
    assert res["result"] == "changed" and _state(hass, E_GF) == "disarmed"
    assert GF in mgr.settings["modes"][0]["targets"]
