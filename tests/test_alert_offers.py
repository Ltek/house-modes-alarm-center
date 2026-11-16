# ruff: noqa: E501
"""Alarm & panel alerts: ready-made Smart Repeating Alerts, built from this system and run through the real blueprint."""

import shutil
import asyncio
from typing import Any
from pathlib import Path

import pytest
from homeassistant.setup import async_setup_component
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from tests.test_ext_panel_link import PANEL, _link, _save, _setup
from custom_components.house_modes import alert_offers

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")
SRA = Path(__file__).resolve().parents[1] / "custom_components" / "house_modes" / "blueprints" / "smart-repeating-alerts-ltek.yaml"
KEYPAD = "sensor.alarm_partition_1_keypad"


async def _ws(client, i, **msg):
    await client.send_json({"id": i, **msg})
    res = await client.receive_json()
    assert res["success"], res
    return res["result"]


async def _spin(hass) -> None:
    # never async_block_till_done once an alert runs: it waits between repeats, so it would never be "done"
    for _ in range(200):
        await asyncio.sleep(0)


def _phone(hass, name: str) -> str:
    entry = MockConfigEntry(domain="mobile_app", data={"device_name": name, "device_id": name.lower()}, title=name)
    entry.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, identifiers={("mobile_app", name.lower())}, name=name)
    return dev.id


async def _system(hass, hass_storage, tmp_path):
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("live"))
    s23 = _phone(hass, "S23")
    _phone(hass, "Tablet")
    ext = hass.data["house_modes_ext"]
    await ext.house.async_save_settings({**ext.house.settings, "enabled": True, "modes": ext.house.settings["modes"] or [{"id": "a", "name": "A", "targets": {}}],
                                         "notifications": {"services": ["notify.mobile_app_s23"]}})
    return s23


async def test_offers_listed_with_phones(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Offers for this system; the House Mode notification phone is the default; keypad offers need the keypad."""
    s23 = await _system(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    p = await _ws(client, 1, type="house_modes/ext/alert_offers/get")
    ids = {o["id"] for o in p["offers"]}
    assert {"alarm_triggered", "failed_to_arm", "panel_not_responding"} <= ids
    assert not ids & {"fire", "panic", "panel_trouble"}  # no keypad sensor in this test system
    assert p["default_phones"] == [s23] and len(p["phones"]) == 2
    assert all(o["status"] == "available" for o in p["offers"])


async def test_created_alert_runs_and_clears(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Failed to arm: the built automation sends a repeating alert through the blueprint and clears on success."""
    s23 = await _system(hass, hass_storage, tmp_path)
    target = Path(hass.config.path("blueprints", "automation", "LTek"))
    target.mkdir(parents=True, exist_ok=True)
    shutil.copy(SRA, target / "smart-repeating-alerts-ltek.yaml")
    client = await hass_ws_client(hass)
    res = await _ws(client, 1, type="house_modes/ext/alert_offers/build", offers=["failed_to_arm", "alarm_triggered"], devices=[s23])
    cfgs = {c["offer"]: c["config"] for c in res["configs"]}
    assert set(cfgs) == {"failed_to_arm", "alarm_triggered"}
    a = cfgs["alarm_triggered"]["use_blueprint"]["input"]
    assert a["notification_interruption_level"] == "critical" and a["android_alarm_stream"]
    assert a["action_button_1_label"] == "Disarm / Silence" and a["action_button_1_action"][0]["target"]["entity_id"] == PANEL
    sent = async_mock_service(hass, "notify", "mobile_app_s23")
    assert await async_setup_component(hass, "automation", {"automation": [{"id": "fta", **cfgs["failed_to_arm"]}]})
    await hass.async_block_till_done()
    assert hass.states.get("automation.repeating_alert_failed_to_arm").state == "on"
    hass.bus.async_fire("house_modes_failed_to_arm", {"reason": "open_sensors", "sensors": ["binary_sensor.front_door"]})
    await _spin(hass)
    msgs = [c.data.get("message") for c in sent]
    assert msgs and "Open:" in msgs[0], msgs
    hass.bus.async_fire("house_modes_command_success", {"action": "arm"})
    await _spin(hass)
    assert any(c.data.get("message") == "clear_notification" for c in sent), [c.data for c in sent]
    # it now shows as created
    p = await _ws(client, 2, type="house_modes/ext/alert_offers/get")
    assert next(o for o in p["offers"] if o["id"] == "failed_to_arm")["status"] == "created"


async def test_keypad_offers_and_covered_by_own_automation(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """With an Envisalink keypad sensor: fire / panic / trouble offered; an own automation on the keypad's fire covers it."""
    from homeassistant.helpers import entity_registry as er  # noqa: PLC0415

    await _system(hass, hass_storage, tmp_path)
    entry = hass.config_entries.async_entries("envisalink_new")[0]
    er.async_get(hass).async_get_or_create("sensor", "envisalink_new", "kp1", suggested_object_id="alarm_partition_1_keypad", config_entry=entry)
    hass.states.async_set(KEYPAD, "ok", {"alpha": "DISARMED", "fire": False, "panic": False, "trouble": False, "bat_trouble": False})
    assert await async_setup_component(hass, "automation", {"automation": [{
        "id": "mine", "alias": "Notifications - Alarm State",
        "triggers": [{"trigger": "template", "value_template": "{{ state_attr('sensor.alarm_partition_1_keypad', 'fire') == true }}"}],
        "actions": [],
    }]})
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    p = await _ws(client, 1, type="house_modes/ext/alert_offers/get")
    by = {o["id"]: o for o in p["offers"]}
    assert {"fire", "panic", "panel_trouble"} <= set(by)
    assert by["fire"]["status"] == "covered" and by["fire"]["covered_by"] == ["Notifications - Alarm State"]
    assert by["panic"]["status"] == "available"
    cfg = alert_offers.build(hass, "panel_trouble", ["d"], True)
    t = cfg["use_blueprint"]["input"]["alert_trigger"][0]["value_template"]
    assert "bat_trouble" in t and KEYPAD in t
