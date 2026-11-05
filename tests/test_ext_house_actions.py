# ruff: noqa: E501
"""House Mode Actions: labels on native automations/scripts/scenes, and auto-detect."""

from typing import Any

import pytest
from homeassistant.setup import async_setup_component
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import entity_registry as er
from homeassistant.util.yaml import dump, load_yaml

from tests.ext_helpers import setup_real_alarmo
from custom_components.alarmo.ext_house_actions import detect
from custom_components.alarmo.house_action_sync import (
    action_line,
    actions_by_entity,
    merge_description,
    async_sync_actions,
)

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")
MODES = ["Disarmed", "Stay", "Sleep", "Away", "Late Night"]


def test_detect() -> None:
    """Uses the House Mode → which modes are named; 'any' when none is."""
    cfg = {"triggers": [{"trigger": "state", "entity_id": "input_select.house_mode", "to": "Sleep"},
                        {"trigger": "state", "entity_id": "input_select.house_mode", "to": ["late night", "Away"]}],
           "actions": [{"action": "light.turn_off", "target": {"floor_id": "main"}}]}
    assert detect(cfg, MODES) == {"modes": ["Sleep", "Away", "Late Night"], "any": False}
    assert detect({"triggers": [{"trigger": "state", "entity_id": "input_select.house_mode", "to": None}]}, MODES) == {"modes": [], "any": True}
    assert detect({"triggers": [{"trigger": "event", "event_type": "alarmo_house_mode_changed"}]}, MODES)["any"]
    assert detect({"triggers": [{"trigger": "state", "entity_id": "light.x", "to": "on"}], "alias": "Stay lights"}, MODES) is None


async def test_items_and_labels(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Automations/scripts/scenes listed with suggestions; labels applied keep other labels; modes from the input_select."""
    hass.states.async_set("input_select.house_mode", "Disarmed", {"options": MODES})
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    assert await async_setup_component(hass, "automation", {"automation": [
        {"id": "a1", "alias": "Sleep lights", "triggers": [{"trigger": "state", "entity_id": "input_select.house_mode", "to": "Sleep"}],
         "actions": [{"action": "light.turn_off", "target": {"entity_id": "light.x"}}]},
        {"id": "a2", "alias": "Porch", "triggers": [{"trigger": "sun", "event": "sunset"}], "actions": []},
    ]})
    assert await async_setup_component(hass, "script", {"script": {"spa_on": {"alias": "Spa on", "sequence": [
        {"if": [{"condition": "state", "entity_id": "input_select.house_mode", "state": "Stay"}], "then": []}]}}})
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    other = lr.async_get(hass).async_create("Lighting")
    reg.async_update_entity("automation.sleep_lights", labels={other.label_id})
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/house_actions/get"})
    res = (await client.receive_json())["result"]
    assert res["modes"] == MODES and res["modes_source"] == "input_select.house_mode"
    by = {i["entity_id"]: i for i in res["items"]}
    assert by["automation.sleep_lights"]["detected"] == {"modes": ["Sleep"], "any": False} and by["automation.sleep_lights"]["edit_id"] == "a1"
    assert by["automation.porch"]["detected"] is None
    assert by["script.spa_on"]["detected"]["modes"] == ["Stay"] and by["script.spa_on"]["edit_id"] == "spa_on"
    await client.send_json({"id": 2, "type": "alarmo/ext/house_actions/set", "changes": [
        {"entity_id": "automation.sleep_lights", "modes": ["Sleep", "Late Night"]}]})
    res = (await client.receive_json())["result"]
    assert res["done"] == ["automation.sleep_lights"]
    item = next(i for i in res["items"] if i["entity_id"] == "automation.sleep_lights")
    assert item["labels"] == ["Late Night", "Sleep"]
    assert other.label_id in reg.async_get("automation.sleep_lights").labels  # other labels kept
    assert lr.async_get(hass).async_get_label_by_name("House Mode: Sleep") is not None
    await client.send_json({"id": 3, "type": "alarmo/ext/house_actions/set", "changes": [{"entity_id": "automation.sleep_lights", "modes": []}]})
    res = (await client.receive_json())["result"]
    assert next(i for i in res["items"] if i["entity_id"] == "automation.sleep_lights")["labels"] == []
    assert reg.async_get("automation.sleep_lights").labels == {other.label_id}


def test_reactions_from_triggers() -> None:
    """Entering / leaving modes from state triggers on the House Mode entities; any change; not from conditions."""
    from custom_components.alarmo.ext_house_actions import reactions  # noqa: PLC0415

    ents = {"input_select.house_mode", "select.alarmo_house_mode"}
    cfg = {"triggers": [{"trigger": "state", "entity_id": ["input_select.house_mode"], "to": ["sleep", "Away"]},
                        {"platform": "state", "entity_id": "input_select.house_mode", "from": "Late Night", "to": None}]}
    assert reactions(cfg, ents, MODES) == {"to": ["Sleep", "Away"], "from": ["Late Night"], "any": False}
    assert reactions({"trigger": {"platform": "state", "entity_id": "select.alarmo_house_mode"}}, ents, MODES)["any"]
    assert reactions({"triggers": [{"trigger": "event", "event_type": "alarmo_house_mode_changed", "event_data": {"name": "Stay"}}]},
                     ents, MODES) == {"to": ["Stay"], "from": [], "any": False}
    # a condition on the House Mode is not a reaction; disabled triggers and attribute triggers neither
    assert reactions({"triggers": [{"trigger": "time", "at": "06:00"}],
                      "conditions": [{"condition": "state", "entity_id": "input_select.house_mode", "state": "Sleep"}]}, ents, MODES) is None
    assert reactions({"triggers": [{"trigger": "state", "entity_id": "input_select.house_mode", "to": "Sleep", "enabled": False}]}, ents, MODES) is None


def test_action_line_and_description() -> None:
    """One line per script, grouped by timing; the user's own description is kept below it."""
    s = {"modes": [
        {"id": "stay", "name": "Stay", "steps": []},
        {"id": "sleep", "name": "Sleep", "steps": [{"entity_id": "script.hm_lock_up", "when": "enter", "phase": "before", "modes": []}]},
        {"id": "away", "name": "Away", "steps": [{"entity_id": "script.hm_lock_up", "when": "enter", "phase": "before", "modes": []},
                                                 {"entity_id": "scene.spa", "when": "leave", "phase": "after", "modes": ["stay"]}]},
    ]}
    acts = actions_by_entity(s)
    assert action_line(acts["script.hm_lock_up"], s) == "House Mode action: Sleep, Away · entering, before arming"
    assert action_line(acts["scene.spa"], s) == "House Mode action: Away · leaving to Stay, after the change"
    assert action_line([], s) is None
    line = "House Mode action: Sleep · entering, after the change"
    assert merge_description(None, line) == line
    assert merge_description("Locks the doors.", line) == line + "\n\nLocks the doors."
    assert merge_description("House Mode action: old\n\nLocks the doors.", line) == line + "\n\nLocks the doors."
    assert merge_description("House Mode action: old\n\nLocks the doors.", None) == "Locks the doors."
    assert merge_description("House Mode action: old", None) is None


async def test_sync_labels_and_descriptions(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Labels follow the actions (other labels kept); descriptions written to scripts.yaml only when they change."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    scripts = {"hm_lock_up": {"alias": "Lock up", "description": "Locks the doors.", "sequence": []},
               "old_one": {"alias": "Old", "description": "House Mode action: Away · entering, after the change", "sequence": []},
               "plain": {"alias": "Plain", "sequence": []}}
    assert await async_setup_component(hass, "script", {"script": scripts})
    await hass.async_block_till_done()
    cfg_dir = tmp_path / "cfg"
    cfg_dir.mkdir()
    hass.config.config_dir = str(cfg_dir)
    (cfg_dir / "scripts.yaml").write_text(dump(scripts))
    (cfg_dir / "configuration.yaml").write_text("script: !include scripts.yaml\n")
    reg = er.async_get(hass)
    other = lr.async_get(hass).async_create("Kitchen")
    reg.async_update_entity("script.hm_lock_up", labels={other.label_id})
    reg.async_update_entity("script.old_one", labels={lr.async_get(hass).async_create("House Mode: Away").label_id})

    s = {"modes": [{"id": "sleep", "name": "Sleep", "steps": [{"entity_id": "script.hm_lock_up", "when": "enter", "phase": "before", "modes": []}]}]}
    res = await async_sync_actions(hass, s)
    assert res["errors"] == []
    assert sorted(res["labels"]) == ["script.hm_lock_up", "script.old_one"]
    names = {x.label_id: x.name for x in lr.async_get(hass).async_list_labels()}
    assert {names[x] for x in reg.async_get("script.hm_lock_up").labels} == {"Kitchen", "House Mode: Sleep"}
    assert reg.async_get("script.old_one").labels == set()
    data = load_yaml(str(cfg_dir / "scripts.yaml"))
    assert data["hm_lock_up"]["description"] == "House Mode action: Sleep · entering, before arming\n\nLocks the doors."
    assert "description" not in data["old_one"]
    assert "description" not in data["plain"]
    assert sorted(res["descriptions"]) == ["script.hm_lock_up", "script.old_one"]
    # a second run changes nothing
    res = await async_sync_actions(hass, s)
    assert res == {"labels": [], "descriptions": [], "errors": []}
