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


async def test_helpers_found_and_picked(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """House Modes set up without helpers, your input_selects exist: the helpers step offers them; Apply uses them."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    ext = hass.data["house_modes_ext"]
    await ext.house.async_save_settings({"enabled": True, "modes": [{"id": "away", "name": "Away", "targets": {}}]})
    assert await async_setup_component(hass, "input_select", {"input_select": {
        "house_mode": {"options": ["Away", "Home"]},
        "house_mode_selector": {"options": ["Away", "Home"]},
    }})
    client = await hass_ws_client(hass)
    plan = (await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="house"))["plans"]["house"]
    steps = {s["id"]: s for s in plan["steps"]}
    assert steps["helpers"]["status"] == "todo"
    assert steps["helpers"]["picks"] == {"input_select": "input_select.house_mode_selector",
                                         "current_entity": "input_select.house_mode"}
    assert steps["notify"]["status"] == "optional" and steps["automations"]["status"] == "manual"
    assert steps["recording"]["status"] == "done"
    res = await _ws(client, 2, type="house_modes/ext/quickstart/apply", setup="house")
    assert res["done"] == ["helpers"]
    assert ext.house.settings["input_select"] == "input_select.house_mode_selector"
    assert next(s for s in res["plan"]["steps"] if s["id"] == "helpers")["status"] == "done"


async def test_no_helpers_is_optional(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """No input_selects at all: the helpers step is optional and links to where they can be created."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    client = await hass_ws_client(hass)
    plan = (await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="panel"))["plans"]["panel"]
    steps = {s["id"]: s for s in plan["steps"]}
    assert steps["helpers"]["status"] == "optional" and steps["helpers"]["link"].endswith("/open/helpers")
    assert {"user", "alarm_notify", "automations", "notify", "recording", "card", "live"} <= set(steps)


async def test_alarmo_setup_only_with_alarmo(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """The "Moving from Alarmo" steps exist only when Alarmo's files or entry are there."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    client = await hass_ws_client(hass)
    plans = (await _ws(client, 1, type="house_modes/ext/quickstart/plan"))["plans"]
    assert "alarmo" not in plans and {"house", "virtual", "panel"} <= set(plans)
    hass_storage["alarmo.storage"] = {"version": 6, "minor_version": 3, "key": "alarmo.storage",
                                      "data": load_fixture_envelope()["data"]}
    plans = (await _ws(client, 2, type="house_modes/ext/quickstart/plan"))["plans"]
    steps = {s["id"]: s["status"] for s in plans["alarmo"]["steps"]}
    assert steps == {"alarmo_off": "done", "import": "manual"}
    await _ws(client, 3, type="house_modes/ext/alarmo_import/run")
    await hass.async_block_till_done()
    plans = (await _ws(client, 4, type="house_modes/ext/quickstart/plan", setup="alarmo"))["plans"]
    steps = {s["id"]: s["status"] for s in plans["alarmo"]["steps"]}
    assert steps["import"] == "done" and steps["references"] == "done"
    assert {"entity_ids", "check_mode", "check_cycle", "retire"} <= set(steps)


async def test_warnings_and_named_automations(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """The status strip's warnings: an automation that writes the selector is named (a turned-off one is not)."""
    assert await async_setup_component(hass, "input_select", {"input_select": {
        "house_mode_selector": {"options": ["Away"]},
    }})
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    ext = hass.data["house_modes_ext"]
    await ext.house.async_save_settings({"enabled": True, "input_select": "input_select.house_mode_selector",
                                         "modes": [{"id": "away", "name": "Away", "targets": {}},
                                                   {"id": "home", "name": "Home", "targets": {}}]})
    sel = {"action": "input_select.select_option", "target": {"entity_id": "input_select.house_mode_selector"},
           "data": {"option": "Away"}}
    assert await async_setup_component(hass, "automation", {"automation": [
        {"id": "a1", "alias": "Writes the selector", "triggers": [{"trigger": "time", "at": "06:00:00"}], "actions": [sel]},
        {"id": "a2", "alias": "Old one", "initial_state": False, "triggers": [{"trigger": "time", "at": "07:00:00"}],
         "actions": [sel]},
    ]})
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    st = await _ws(client, 1, type="house_modes/ext/status")
    by = {w["id"]: w for w in st["warnings"]}
    assert [i["name"] for i in by["automations"]["items"]] == ["Writes the selector"]
    assert "writes the selector" in by["automations"]["items"][0]["reasons"][0]
    assert "selector" in by and "Home" in by["selector"]["detail"]
    plan = (await _ws(client, 2, type="house_modes/ext/quickstart/plan", setup="house"))["plans"]["house"]
    step = next(s for s in plan["steps"] if s["id"] == "automations")
    assert step["status"] == "manual" and [a["name"] for a in step["automations"]] == ["Writes the selector"]


async def test_go_live_done_when_both_live(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Go live turns done once House Modes and every panel link are Live."""
    await _panel_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    ext = hass.data["house_modes_ext"]
    await ext.house.async_save_settings({"enabled": True, "run_mode": "live", "modes": [{"id": "a", "name": "A", "targets": {}}]})
    await ext.panel.async_save_settings({"links": {"1700000001": {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "shadow"}}})
    plan = (await _ws(client, 1, type="house_modes/ext/quickstart/plan", setup="panel"))["plans"]["panel"]
    live = next(s for s in plan["steps"] if s["id"] == "live")
    assert live["status"] == "manual" and "the panel link" in live["detail"]
    await ext.panel.async_save_settings({"links": {"1700000001": {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "live"}}})
    plan = (await _ws(client, 2, type="house_modes/ext/quickstart/plan", setup="panel"))["plans"]["panel"]
    assert next(s for s in plan["steps"] if s["id"] == "live")["status"] == "done"


async def test_mark_as_done(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """A step that can't be measured is marked done and stays done."""
    await setup_real_house_modes(hass, hass_storage, tmp_path, _empty_env())
    hass_storage["alarmo.storage"] = {"version": 6, "minor_version": 3, "key": "alarmo.storage",
                                      "data": load_fixture_envelope()["data"]}
    client = await hass_ws_client(hass)
    await _ws(client, 1, type="house_modes/ext/alarmo_import/run")
    await hass.async_block_till_done()
    steps = {s["id"]: s for s in (await _ws(client, 2, type="house_modes/ext/quickstart/plan", setup="alarmo"))["plans"]["alarmo"]["steps"]}
    assert steps["check_cycle"]["status"] == "manual" and steps["check_cycle"]["can_mark"]
    await _ws(client, 3, type="house_modes/ext/quickstart/mark", step="check_cycle")
    steps = {s["id"]: s for s in (await _ws(client, 4, type="house_modes/ext/quickstart/plan", setup="alarmo"))["plans"]["alarmo"]["steps"]}
    assert steps["check_cycle"]["status"] == "done" and "checked" in steps["check_cycle"]["detail"]
