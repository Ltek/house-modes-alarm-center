# ruff: noqa: E501
"""House Mode Actions: labels on native automations/scripts/scenes, and auto-detect."""

from typing import Any

import pytest
from homeassistant.setup import async_setup_component
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import entity_registry as er

from tests.ext_helpers import setup_real_alarmo
from custom_components.alarmo.ext_house_actions import detect

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
