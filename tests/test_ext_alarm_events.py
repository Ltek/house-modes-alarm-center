"""ext: Alarm Events that run native scenes and scripts."""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any

from homeassistant.const import ATTR_SERVICE, ATTR_ENTITY_ID, CONF_SERVICE_DATA
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.alarmo import const
from custom_components.alarmo.automations import AutomationHandler


class _Store:
    def __init__(self, automations: dict[str, Any]) -> None:
        self._automations = automations

    def async_get_automations(self) -> dict[str, Any]:
        return self._automations


def _handler(hass: Any, actions: list[dict]) -> AutomationHandler:
    automations = {
        "e1": {
            "automation_id": "e1",
            "type": "action",
            "name": "Alarm armed",
            "triggers": [{"event": "armed", "area": 0}],
            "actions": actions,
            "enabled": True,
        }
    }
    hass.data[const.DOMAIN] = {
        "coordinator": SimpleNamespace(store=_Store(automations)),
        "areas": {},
        "master": None,
    }
    return AutomationHandler(hass)


async def test_script_gets_event_variables(hass: Any) -> None:
    """script.turn_on from an Alarm Event gets event, area and arm_mode."""
    handler = _handler(
        hass,
        [
            {ATTR_SERVICE: "scene.turn_on", ATTR_ENTITY_ID: "scene.armed", CONF_SERVICE_DATA: {}},
            {ATTR_SERVICE: "script.turn_on", ATTR_ENTITY_ID: "script.siren", CONF_SERVICE_DATA: {}},
        ],
    )
    scenes = async_mock_service(hass, "scene", "turn_on")
    scripts = async_mock_service(hass, "script", "turn_on")
    entity = SimpleNamespace(name="House", _arm_mode="armed_away")

    handler._event = "armed"
    await handler.async_execute_automation("e1", entity)
    await hass.async_block_till_done()

    assert scenes[0].data == {"entity_id": "scene.armed"}
    assert scripts[0].data["entity_id"] == "script.siren"
    assert scripts[0].data["variables"] == {"event": "armed", "area": "House", "arm_mode": "armed_away"}


async def test_own_variables_are_kept(hass: Any) -> None:
    """Variables written in the event are not replaced."""
    handler = _handler(
        hass,
        [{ATTR_SERVICE: "script.turn_on", ATTR_ENTITY_ID: "script.s", CONF_SERVICE_DATA: {"variables": {"x": 1}}}],
    )
    scripts = async_mock_service(hass, "script", "turn_on")
    await handler.async_execute_automation("e1", SimpleNamespace(name="H", _arm_mode=None))
    await hass.async_block_till_done()
    assert scripts[0].data["variables"] == {"x": 1}
