# ruff: noqa: E501
"""ext.13: status strip and "Why won't it arm?"."""

from typing import Any

import pytest
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from custom_components.alarmo.ext_status import panel_ready_entity

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def _ws(client, i, **msg):
    await client.send_json({"id": i, **msg})
    return (await client.receive_json())["result"]


async def test_why_lists_open_zones(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """An open door blocks the modes it is in; closing it makes them ready."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    sensors = env["data"]["sensors"]
    door = next(s for s in sensors if s["type"] == "door" and s["enabled"] and not s.get("allow_open") and not s.get("auto_bypass"))
    hass.states.async_set(door["entity_id"], "on")
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    why = await _ws(client, 1, type="alarmo/ext/why")
    area = next(a for a in why["areas"] if a["area_id"] == door["area"])
    mode = next(m for m in area["modes"] if m["mode"] in door["modes"])
    assert not mode["ready"] and door["entity_id"] in [b["entity_id"] for b in mode["blocking"]]
    hass.states.async_set(door["entity_id"], "off")
    await hass.async_block_till_done()
    why = await _ws(client, 2, type="alarmo/ext/why")
    area = next(a for a in why["areas"] if a["area_id"] == door["area"])
    assert door["entity_id"] not in [b["entity_id"] for m in area["modes"] for b in m["blocking"]]


async def test_status_payload(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Status lists the Alarmo alarms, House Mode and rule count."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    st = await _ws(client, 1, type="alarmo/ext/status")
    assert st["alarms"] and all(a["entity_id"].startswith("alarm_control_panel.") for a in st["alarms"])
    assert st["house"]["enabled"] is False and st["links"] == [] and isinstance(st["rules_pending"], int)


async def test_panel_ready_entity(hass: Any) -> None:
    """The Ready binary_sensor of the same integration entry is found."""
    entry = MockConfigEntry(domain="envisalink_new")
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    reg.async_get_or_create("alarm_control_panel", "envisalink_new", "p1", config_entry=entry, suggested_object_id="alarm_partition_1")
    reg.async_get_or_create("binary_sensor", "envisalink_new", "p1_ready", config_entry=entry, suggested_object_id="alarm_partition_1_ready")
    reg.async_get_or_create("binary_sensor", "envisalink_new", "z1", config_entry=entry, suggested_object_id="front_door")
    assert panel_ready_entity(hass, "alarm_control_panel.alarm_partition_1") == "binary_sensor.alarm_partition_1_ready"


async def test_ignored_panel_zones_saved(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Ignored panel zones are kept in the panel settings (and validated)."""
    import voluptuous as vol  # noqa: PLC0415

    await setup_real_alarmo(hass, hass_storage, tmp_path)
    panel = hass.data["alarmo_ext"].panel
    await panel.async_save_settings({"ignored_zones": ["binary_sensor.keyfob_zone_49"]})
    assert panel.settings["ignored_zones"] == ["binary_sensor.keyfob_zone_49"]
    with pytest.raises(vol.Invalid):
        await panel.async_save_settings({"ignored_zones": ["light.x"]})
