# ruff: noqa: E501
"""ext.24: activity recorder — sequences, causes, masking, files."""

import os
import json
from typing import Any

import pytest

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo
from custom_components.alarmo.recorder import mask, summarize

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


def test_mask_and_summary() -> None:
    """Digits are masked; latency is the panel's time after Alarmo reached the same state."""
    assert mask("12343") == "••••3" and mask(1234) == "•••" and mask("12346#", ["1234"]) == "••••6#"
    assert mask("1234") == "••••" and mask("98761", ["9876"]) == "••••1"
    seqs = [{"entries": [
        {"kind": "house", "dt": 0, "text": "House Mode: Disarmed → Away"},
        {"kind": "alarmo", "dt": 1.0, "text": "Master: arming → armed_away"},
        {"kind": "panel", "dt": 3.5, "text": "Alarm Partition 1: arming → armed_away"},
    ]}]
    s = summarize(seqs)
    assert s["starters"] == {"house": 1} and s["panel_latency"]["armed_away"] == {"n": 1, "avg": 2.5, "max": 2.5}


async def test_sequence_recorded_and_written(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """A House Mode selector change opens a sequence; a later helper change joins it; quiet → written to the day file."""
    hass.states.async_set("input_select.house_mode_selector", "Disarmed", {"options": ["Disarmed", "Away"]})
    hass.states.async_set("input_boolean.bypass_alarm_zones", "off")
    hass.states.async_set("input_boolean.unrelated", "off")
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    rec = hass.data["alarmo_ext"].recorder
    await rec.async_save_settings({"window_s": 15})
    assert rec._watch["input_select.house_mode_selector"] == "house"
    hass.states.async_set("input_boolean.unrelated", "on")  # not watched: no sequence
    await hass.async_block_till_done()
    assert rec.current is None
    hass.states.async_set("input_select.house_mode_selector", "Away", {"options": ["Disarmed", "Away"]})
    hass.states.async_set("input_boolean.bypass_alarm_zones", "on")
    await hass.async_block_till_done()
    await hass.services.async_call("alarmo", "arm", {"entity_id": "alarm_control_panel.ground_floor", "code": "1234", "mode": "away"}, blocking=False)
    await hass.async_block_till_done()
    seq = rec.current
    assert seq and seq["entries"][0]["kind"] == "house" and any(e["kind"] == "helper" for e in seq["entries"])
    assert not any("1234" in e["text"] for e in seq["entries"])
    await advance_time(hass, 40)
    await hass.async_block_till_done()
    assert rec.current is None or rec.current["id"] != seq["id"]
    days = await hass.async_add_executor_job(rec.days)
    assert days
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/activity/day", "day": days[0]})
    res = (await client.receive_json())["result"]
    first = next(s for s in res["sequences"] if s["id"] == seq["id"])
    assert first["title"].startswith("House Mode Selector") or "house_mode_selector" in first["title"].lower()
    path = os.path.join(rec.directory, f"{days[0]}.jsonl")
    assert json.loads(open(path).readline())["id"]
