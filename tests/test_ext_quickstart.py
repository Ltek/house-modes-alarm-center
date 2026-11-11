# ruff: noqa: E501
"""Quick Start setups: plan, apply (backup first), idempotent."""

from typing import Any

import pytest
from homeassistant.setup import async_setup_component

from tests.helpers import advance_time
from tests.ext_helpers import load_fixture_envelope, setup_real_house_modes
from tests.test_ext_panel_link import PANEL
from tests.test_ext_panel_link import _setup as _panel_setup

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def _ws(client, i, **msg):
    await client.send_json({"id": i, **msg})
    res = await client.receive_json()
    assert res["success"], res
    return res["result"]


def _empty_env():
    env = load_fixture_envelope()
    env["data"]["areas"] = []
    env["data"]["sensors"] = []
    env["data"]["sensor_groups"] = []
    env["data"]["automations"] = []
    return env


async def test_house_only_setup(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """No House Modes: Apply adds starter modes that arm nothing (The alarm always has its first partition)."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    client = await hass_ws_client(hass)
    res = await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="house")
    steps = {s["id"]: s["status"] for s in res["plans"]["house"]["steps"]}
    assert steps["partition"] == "done" and steps["house_modes"] == "todo" and steps["card"] == "manual"
    res = await _ws(client, 2, type="house_modes/ext/quickstart/apply", setup="house")
    await hass.async_block_till_done()
    assert res["backup"] and res["done"] == ["house_modes"]
    house = hass.data["house_modes_ext"].house.settings
    assert house["enabled"] and house["run_mode"] == "live"
    assert [m["name"] for m in house["modes"]] == ["Home", "Away", "Sleep", "Guest", "Vacation"]
    assert all(m["targets"] == {} for m in house["modes"])
    assert res["status"]["partitions"] == 1
    # nothing left to do: applying again changes nothing and makes no backup
    again = await _ws(client, 3, type="house_modes/ext/quickstart/apply", setup="house")
    assert again["done"] == [] and again["backup"] is None


async def test_house_only_uses_your_input_selects_in_shadow(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Your own House Mode helpers: their options become the modes, in Shadow."""
    assert await async_setup_component(hass, "input_select", {"input_select": {
        "house_mode": {"options": ["Disarmed", "Stay", "Away"]},
        "house_mode_selector": {"options": ["Disarmed", "Stay", "Away"]},
    }})
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    client = await hass_ws_client(hass)
    await _ws(client, 1, type="house_modes/ext/quickstart/apply", setup="house")
    house = hass.data["house_modes_ext"].house.settings
    assert house["run_mode"] == "shadow" and house["input_select"] == "input_select.house_mode_selector"
    assert house["current_entity"] == "input_select.house_mode"
    assert [m["name"] for m in house["modes"]] == ["Disarmed", "Stay", "Away"]


async def test_virtual_panel_setup(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """A partition with Away / Home / Night, zones from door / window / motion sensors, a user step."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    hass.states.async_set("binary_sensor.front", "off", {"device_class": "door", "friendly_name": "Front"})
    hass.states.async_set("binary_sensor.hall", "off", {"device_class": "motion", "friendly_name": "Hall"})
    hass.states.async_set("binary_sensor.leak", "off", {"device_class": "moisture"})
    client = await hass_ws_client(hass)
    plan = (await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="virtual"))["plans"]["virtual"]
    zones = next(s for s in plan["steps"] if s["id"] == "zones")
    assert [c["entity_id"] for c in zones["candidates"]] == ["binary_sensor.front", "binary_sensor.hall"]
    res = await _ws(client, 2, type="house_modes/ext/quickstart/apply", setup="virtual", entities=["binary_sensor.front"])
    await hass.async_block_till_done()
    store = hass.data["house_modes_ext"].store
    area = next(iter(store.async_get_areas().values()))
    assert all(area["modes"][m]["enabled"] for m in ("armed_away", "armed_home", "armed_night"))
    assert list(store.async_get_sensors()) == ["binary_sensor.front"]
    assert next(s for s in res["plan"]["steps"] if s["id"] == "user")["status"] in ("manual", "done")


async def test_panel_setup(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """The panel link is made in Shadow; the panel's zones and House Modes follow."""
    await _panel_setup(hass, hass_storage, tmp_path)
    await advance_time(hass, 5)
    client = await hass_ws_client(hass)
    plan = (await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="panel"))["plans"]["panel"]
    steps = {s["id"]: s for s in plan["steps"]}
    assert steps["panel_link"]["status"] == "todo" and steps["panel_code"]["status"] == "done"
    res = await _ws(client, 2, type="house_modes/ext/quickstart/apply", setup="panel")
    await hass.async_block_till_done()
    assert "panel_link" in res["done"]
    links = hass.data["house_modes_ext"].panel.settings["links"]
    link = next(iter(links.values()))
    assert link["panel_entity"] == PANEL and link["mode"] == "shadow"
    assert res["status"]["panel_links"] == [{"panel": PANEL, "mode": "shadow"}]
