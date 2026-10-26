"""Task 2: covers (garage doors, gates) and locks as zones."""

import copy
from typing import Any

import pytest
from homeassistant.core import State
from homeassistant.const import STATE_OPEN, STATE_CLOSED, STATE_UNKNOWN

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from custom_components.alarmo.sensors import parse_sensor_state

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF = "1700000001"
COVER = "cover.gdo1_garage_door"
PANEL = "alarm_control_panel.ground_floor"


@pytest.mark.parametrize(
    ("state", "expected"),
    [
        ("open", STATE_OPEN),
        ("opening", STATE_OPEN),
        ("closing", STATE_OPEN),
        ("closed", STATE_CLOSED),
        ("unlocked", STATE_OPEN),
        ("locked", STATE_CLOSED),
        ("jammed", STATE_UNKNOWN),
    ],
)
def test_cover_and_lock_states(state: str, expected: str) -> None:
    """A cover that is moving is not shut."""
    assert parse_sensor_state(State("cover.x", state)) == expected


def _with_cover(env: dict) -> dict:
    env = copy.deepcopy(env)
    door = next(
        s
        for s in env["data"]["sensors"]
        if s["entity_id"] == "binary_sensor.front_door"
    )
    env["data"]["sensors"].append(
        {**door, "entity_id": COVER, "modes": ["armed_night"], "area": GF}
    )
    return env


@pytest.mark.parametrize("moving", ["opening", "closing", "open"])
async def test_armed_cover_zone_starts_entry_delay(
    hass: Any, hass_storage: Any, tmp_path: Any, moving: str
) -> None:
    """Garage door starting to move while armed night -> entry delay (pending)."""
    env = _with_cover(load_fixture_envelope())
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    hass.states.async_set(COVER, "closed")
    await hass.async_block_till_done()

    await hass.services.async_call(
        "alarm_control_panel",
        "alarm_arm_night",
        {"entity_id": PANEL, "code": "1234"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get(PANEL).state == "armed_night"

    hass.states.async_set(COVER, moving)
    for _ in range(3):  # sensor events are dispatched "soon", not immediately
        await hass.async_block_till_done()
    assert hass.states.get(PANEL).state == "pending"
    await advance_time(hass, 300)  # let the entry/trigger timers finish


async def test_closed_cover_allows_arming(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """A closed garage door does not block arming; an opening one does."""
    env = _with_cover(load_fixture_envelope())
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    hass.states.async_set(COVER, "opening")
    await hass.async_block_till_done()
    await hass.services.async_call(
        "alarm_control_panel",
        "alarm_arm_night",
        {"entity_id": PANEL, "code": "1234"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get(PANEL).state == "disarmed"  # blocked by the moving door

    hass.states.async_set(COVER, "closed")
    await hass.async_block_till_done()
    await hass.services.async_call(
        "alarm_control_panel",
        "alarm_arm_night",
        {"entity_id": PANEL, "code": "1234"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get(PANEL).state == "armed_night"
