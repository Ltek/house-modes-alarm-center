# ruff: noqa: E501
"""ext.25: the recorder closes sequences although the Vista keypad keeps scrolling."""
from typing import Any
from unittest.mock import patch

import pytest

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo
from custom_components.alarmo import recorder as recmod

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

async def test_closes_despite_keypad_scroll(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Repeated keypad text does not keep the sequence open; repeats are dropped."""
    clock = [1000.0]
    hass.states.async_set("input_select.house_mode_selector", "Disarmed")
    with patch.object(recmod.time, "monotonic", lambda: clock[0]):
        await setup_real_alarmo(hass, hass_storage, tmp_path)
        await advance_time(hass, 5)
        rec = hass.data["alarmo_ext"].recorder
        rec._watch["sensor.alarm_partition_1_keypad"] = "keypad"
        hass.states.async_set("sensor.alarm_partition_1_keypad", "Ready", {"armed_bypass": False, "alpha": "Ready"})
        hass.states.async_set("input_select.house_mode_selector", "Away")
        await hass.async_block_till_done()
        assert rec.current
        for i in range(30):  # the keypad scrolls fault messages every 5 s for 150 s
            clock[0] += 5
            hass.states.async_set("sensor.alarm_partition_1_keypad", f"FAULT 0{i % 2 + 2} X", {"armed_bypass": False, "alpha": "x"})
            await advance_time(hass, 5)
        await hass.async_block_till_done()
        assert rec.current is None
        days = await hass.async_add_executor_job(rec.days)
        assert days and rec.last_write and not rec.last_error
        seq = (await hass.async_add_executor_job(rec.read_day, days[0]))[0]
        assert sum(1 for e in seq["entries"] if e["kind"] == "keypad") == 2  # repeats dropped
