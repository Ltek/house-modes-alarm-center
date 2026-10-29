# ruff: noqa: E501, RUF001
"""House Modes auto-detect from the user's input_selects and the activity log."""

import os
import json
from typing import Any

import pytest
from homeassistant.setup import async_setup_component

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from custom_components.alarmo import house_detect as hd
from tests.test_ext_house_modes import GF, E_GF, _modes, _settle
from custom_components.alarmo.house_config import normalize

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

SELECTS = [
    {"entity_id": "input_select.house_mode", "name": "House Mode"},
    {"entity_id": "input_select.house_mode_last", "name": "House Mode - Last"},
    {"entity_id": "input_select.house_mode_selector", "name": "House Mode Selector"},
    {"entity_id": "input_select.tv_source", "name": "TV source"},
]


def _seq(t, *entries):
    return {"start": t, "entries": [{"t": t + dt, "kind": k, "text": txt, "entity": ent} for dt, k, txt, ent in entries]}


def _arm(t, cur, new_mode, alarm_from, alarm_to, prev="Disarmed"):
    """The user's flow: selector → Alarmo arms → current-mode entity set after Alarmo is armed."""
    return _seq(
        t,
        (0, "house", f"House Mode Selector: {prev} → {new_mode}", "input_select.house_mode_selector"),
        (0, "alarmo", f"Alarmo Master: {alarm_from} → arming", cur),
        (25, "alarmo", f"Alarmo Master: arming → {alarm_to}", cur),
        (25, "house", f"House Mode: {prev} → {new_mode}", "input_select.house_mode"),
    )


def test_pick_entities_and_names() -> None:
    """The three input_selects are recognised; placeholders are dropped."""
    assert hd.pick_entities(SELECTS) == {
        "selector": "input_select.house_mode_selector",
        "current": "input_select.house_mode",
        "previous": "input_select.house_mode_last",
    }
    assert hd.mode_names(["Disarmed", "Stay", "unknown", "", "stay", "Away"]) == ["Disarmed", "Stay", "Away"]
    assert hd.rule_for("Holiday")[0] == "armed_vacation" and hd.rule_for("Spa")[0] == "armed_custom_bypass"


def test_evidence_majority_and_name_fallback() -> None:
    """The partition states after each change vote; quick changes back do not count; names fill the gaps."""
    m = "alarm_control_panel.master"
    seqs = [_arm(1000 * i, m, "Stay", "disarmed", "armed_home") for i in range(4)]
    seqs.append(_arm(9000, m, "Stay", "disarmed", "armed_custom_bypass"))
    seqs.append(_arm(20000, m, "Sleep", "disarmed", "armed_home"))
    # Away at 30000, but disarmed again 40 s later together with a change back: Away still counts as armed_away
    seqs.append(_arm(30000, m, "Away", "disarmed", "armed_away"))
    seqs.append(_seq(30065, (0, "house", "House Mode: Away → Disarmed", "input_select.house_mode"), (1, "alarmo", "Alarmo Master: armed_away → disarmed", m)))
    ev = hd.evidence(seqs, "input_select.house_mode", {m: "master"})
    assert ev["changes"] == 8
    out = {s["name"]: s for s in hd.suggest(["Disarmed", "Stay", "Sleep", "Away", "Vacation", "Party", "Zebra"], ev, ["a1", "a2"])}
    assert out["Stay"]["targets"] == {"master": "armed_home"} and out["Stay"]["seen"] == 5
    assert "also seen: Custom 1×" in out["Stay"]["note"]
    assert out["Sleep"]["targets"] == {"master": "armed_home"} and "disagrees" in out["Sleep"]["note"]
    assert out["Away"]["targets"] == {"master": "armed_away"}
    assert out["Disarmed"]["targets"] == {"master": "disarmed"} and out["Disarmed"]["basis"] == "activity"
    assert out["Vacation"]["basis"] == "name" and out["Vacation"]["targets"] == {"a1": "armed_vacation", "a2": "armed_vacation"}
    assert out["Party"]["targets"] == {} and out["Party"]["basis"] == "name"
    assert out["Zebra"]["basis"] == "none"


def test_compare_entity_becomes_current_entity() -> None:
    """Settings saved by v2026.10.29.34 keep working."""
    s = normalize({"enabled": True, "compare_entity": "input_select.house_mode"})
    assert s["current_entity"] == "input_select.house_mode" and "compare_entity" not in s


async def _selects(hass) -> None:
    opts = ["Disarmed", "Stay", "Sleep", "Away", "Guest", "unknown"]
    assert await async_setup_component(
        hass,
        "input_select",
        {"input_select": {k: {"options": opts} for k in ("house_mode", "house_mode_last", "house_mode_selector")}},
    )


async def test_detect_ws(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """The websocket reads the activity days and suggests modes for the real partitions."""
    await _selects(hass)
    await setup_real_alarmo(hass, hass_storage, tmp_path, load_fixture_envelope())
    rec = hass.data["alarmo_ext"].recorder
    os.makedirs(rec.directory, exist_ok=True)
    with open(os.path.join(rec.directory, "2026-10-20.jsonl"), "w", encoding="utf-8") as fh:
        for i in range(3):
            fh.write(json.dumps(_arm(1000 * i, E_GF, "Stay", "disarmed", "armed_home")) + "\n")
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/house/detect"})
    res = (await client.receive_json())["result"]
    assert res["entities"]["selector"] == "input_select.house_mode_selector"
    assert res["changes"] == 3
    names = [s["name"] for s in res["suggestions"]]
    assert names == ["Disarmed", "Stay", "Sleep", "Away", "Guest"]
    stay = next(s for s in res["suggestions"] if s["name"] == "Stay")
    assert stay["targets"] == {GF: "armed_home"} and stay["basis"] == "activity"
    away = next(s for s in res["suggestions"] if s["name"] == "Away")
    assert away["basis"] == "name" and set(away["targets"].values()) == {"armed_away"}


async def test_live_writes_current_and_previous(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Live House Modes keep the user's own current / previous entities up to date."""
    await _selects(hass)
    env = load_fixture_envelope()
    env["data"]["areas"][0]["modes"]["armed_custom_bypass"]["enabled"] = True
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    mgr = hass.data["alarmo_ext"].house
    await mgr.async_save_settings({
        "enabled": True, "modes": _modes(),
        "current_entity": "input_select.house_mode", "previous_entity": "input_select.house_mode_last",
    })
    await _settle(hass)
    await advance_time(hass, 5)
    await mgr.async_set_mode("Disarmed")
    await mgr.async_set_mode("Stay")
    await _settle(hass)
    assert hass.states.get(E_GF).state in ("arming", "armed_home")
    assert hass.states.get("input_select.house_mode").state == "Stay"
    assert hass.states.get("input_select.house_mode_last").state == "Disarmed"
