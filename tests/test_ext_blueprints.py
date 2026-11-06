"""The shipped blueprints load as Home Assistant blueprints and fill in to valid automations."""

from typing import Any
from pathlib import Path

import pytest
from homeassistant.util.yaml import load_yaml
from homeassistant.components.blueprint.models import Blueprint, BlueprintInputs
from homeassistant.components.automation.config import AUTOMATION_BLUEPRINT_SCHEMA, async_validate_config_item

BP = Path(__file__).parent.parent / "blueprints" / "automation" / "alarmo"


@pytest.mark.parametrize(
    ("name", "inputs"),
    [
        ("house_mode_schedule.yaml", {"at_time": "20:30:00", "mode": "Stay", "from_modes": ["Disarmed"]}),
        ("house_mode_presence.yaml", {"people": ["person.a", "person.b"], "home_zones": ["Neighborhood"],
                                      "away_mode": "Away", "home_mode": "Disarmed"}),
    ],
)
async def test_blueprint_valid(hass: Any, name: str, inputs: dict) -> None:
    """Each blueprint parses, and its automation passes Home Assistant's automation validation."""
    bp = Blueprint(load_yaml(str(BP / name)), expected_domain="automation", schema=AUTOMATION_BLUEPRINT_SCHEMA)
    filled = BlueprintInputs(bp, {"use_blueprint": {"path": name, "input": inputs}})
    filled.validate()
    cfg = filled.async_substitute()
    assert "source" in str(cfg["actions"])
    assert await async_validate_config_item(hass, "test", {"id": "t", **cfg}) is not None
