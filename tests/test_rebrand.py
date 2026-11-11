"""Rebrand: one storage file, the one-time import from Alarmo, coexistence with an installed Alarmo, entity ids.

The rules these tests hold the integration to (user, 2026-11-11):
* the old files (``.storage/alarmo.storage``, ``.storage/alarmo_extras``, ``/config/alarmo/``) are only ever read;
* nothing is imported until the user picks Import or Start fresh;
* the two integrations never act together: while the ``alarmo`` entry is enabled the panel link stays in Shadow and
  the import refuses;
* rollback = disable the new entry, enable the old one: the old mirror entities get their ids back.
"""

import copy
import json
import hashlib
from typing import Any

import pytest
from homeassistant.helpers import entity_registry as er
from homeassistant.config_entries import ConfigEntryDisabler
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from tests.helpers import advance_time
from tests.ext_helpers import (
    FIXTURE_CODES,
    seed,
    stored_alarm,
    stored_extras,
    stored_section,
    load_fixture_envelope,
    setup_real_house_modes,
)
from custom_components.house_modes import legacy

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF = "1700000001"
GF_ENTITY = "alarm_control_panel.ground_floor"
PANEL = "alarm_control_panel.alarm_partition_1"
WIN = "binary_sensor.gf_window_1"

OLD_EXTRAS = {
    "retention_days": 14,
    "rules": [],
    "overrides": {},
    "ui": {},
    "locks": {},
    "house": {
        "enabled": True,
        "modes": [
            {"id": "stay", "name": "Stay", "targets": {GF: "armed_home"}},
            {"id": "away", "name": "Away", "targets": {GF: "armed_away"}},
        ],
        "current": "stay",
        "previous": "away",
        "history": [{"mode": "stay", "source": "manual", "at": "2026-11-10T10:00:00+00:00"}],
    },
    "panel": {
        "links": {GF: {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "live", "arm_order": "after_alarmo"}},
        "mirrors": {WIN: {"hold": "last"}},
    },
}


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


def _write_old_files(hass_storage: dict, alarm: dict | None, extras: dict | None) -> None:
    """The old files, as the mocked storage sees them (hass_storage replaces .storage/)."""
    if alarm is not None:
        hass_storage["alarmo.storage"] = {"version": 6, "minor_version": 3, "key": "alarmo.storage", "data": alarm}
    if extras is not None:
        hass_storage["alarmo_extras"] = {"version": 1, "key": "alarmo_extras", "data": extras}


def _fingerprint(hass_storage: dict) -> str:
    old = {k: hass_storage.get(k) for k in ("alarmo.storage", "alarmo_extras")}
    return hashlib.sha256(json.dumps(old, sort_keys=True, default=str).encode()).hexdigest()


def _old_entry(hass, disabled: bool) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain="alarmo", data={}, entry_id="old_alarmo", disabled_by=ConfigEntryDisabler.USER if disabled else None
    )
    entry.add_to_hass(hass)
    return entry


async def _fresh_setup(hass, hass_storage, tmp_path):
    """Our integration on a fresh install: empty alarm section (factory default)."""
    env = load_fixture_envelope()
    env["data"] = {
        "config": env["data"]["config"],
        "areas": [env["data"]["areas"][0]],
        "sensors": [],
        "users": [],
        "automations": [],
        "sensor_groups": [],
    }
    return await setup_real_house_modes(hass, hass_storage, tmp_path, env, create_states=False)


# ------------------------------------------------------------------ combined store


async def test_one_storage_file_with_sections(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Alarm data and extras live in .storage/house_modes; no other file is written."""
    env = load_fixture_envelope()
    await setup_real_house_modes(hass, hass_storage, tmp_path, env)
    ext = hass.data["house_modes_ext"]
    await ext.extras.async_update(retention_days=7)
    await ext.store.async_save()
    assert stored_alarm(hass_storage) == env["data"]
    assert stored_extras(hass_storage)["retention_days"] == 7
    assert hass_storage["house_modes"]["key"] == "house_modes"
    assert not {"alarmo.storage", "alarmo_extras", "house_modes.storage", "house_modes_extras"} & set(hass_storage)


async def test_delayed_alarm_save_keeps_extras(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A delayed alarm save and an immediate extras save never overwrite each other."""
    await setup_real_house_modes(hass, hass_storage, tmp_path)
    ext = hass.data["house_modes_ext"]
    ext.store.async_update_config({"code_arm_required": True})  # delayed save (10 s)
    await ext.extras.async_update(retention_days=3)  # writes now, with the pending alarm data
    await advance_time(hass, 15)
    await hass.async_block_till_done()
    assert stored_alarm(hass_storage)["config"]["code_arm_required"] is True
    assert stored_extras(hass_storage)["retention_days"] == 3


# ------------------------------------------------------------------ legacy names


def test_rewrite_known_names_only() -> None:
    """Services, events, the select and push actions are rewritten; a user's own 'alarmo_*' helper is not."""
    data = {
        "actions": [
            {"service": "alarmo.arm", "entity_id": "alarm_control_panel.master"},
            {"domain": "alarmo", "service": "disarm"},
            {"service": "input_boolean.turn_on", "entity_id": "input_boolean.alarmo_change_away"},
        ],
        "trigger": {"platform": "event", "event_type": "alarmo_house_mode_changed"},
        "entity": "select.alarmo_house_mode",
        "push": "ALARMO_DISARM",
        "arm_order": "after_alarmo",
        "text": "{{ is_state('select.alarmo_house_mode', 'Away') }}",
    }
    found: list = []
    out = legacy.rewrite_data(data, found)
    assert out["actions"][0]["service"] == "house_modes.arm"
    assert out["actions"][1]["domain"] == "house_modes"
    assert out["actions"][2]["entity_id"] == "input_boolean.alarmo_change_away"
    assert out["trigger"]["event_type"] == "house_modes_house_mode_changed"
    assert out["entity"] == "select.house_mode"
    assert out["push"] == "HOUSE_MODES_DISARM"
    assert out["arm_order"] == "after_alarm"
    assert "select.house_mode" in out["text"]
    assert len(found) == 7


# ------------------------------------------------------------------ the first-run choice


async def test_status_asks_when_old_files_exist(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Old files found: Quick Start asks; counts are shown; nothing is changed by asking."""
    env = load_fixture_envelope()
    _write_old_files(hass_storage, env["data"], OLD_EXTRAS)
    before = _fingerprint(hass_storage)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="house_modes/ext/alarmo_import/status"))["result"]
    assert res["ask"] is True and res["kind"] == "fork" and res["choice"] is None
    assert res["counts"]["partitions"] == 3 and res["counts"]["users"] == 3
    assert res["counts"]["house_modes"] == 2 and res["counts"]["mirrors"] == 1
    assert _fingerprint(hass_storage) == before


async def test_status_upstream_alarmo_only(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Only alarmo.storage: upstream Alarmo."""
    _write_old_files(hass_storage, load_fixture_envelope()["data"], None)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="house_modes/ext/alarmo_import/status"))["result"]
    assert res["ask"] is True and res["kind"] == "alarmo" and res["counts"]["house_modes"] == 0


async def test_no_old_files_no_question(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """No old files: normal Quick Start."""
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="house_modes/ext/alarmo_import/status"))["result"]
    assert res["found"] is False and res["ask"] is False


async def test_start_fresh_then_import_later(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Start fresh stops the question; Import still works afterwards (Backup tab)."""
    _write_old_files(hass_storage, load_fixture_envelope()["data"], OLD_EXTRAS)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    assert (await _ws(client, 1, type="house_modes/ext/alarmo_import/fresh"))["success"]
    res = (await _ws(client, 2, type="house_modes/ext/alarmo_import/status"))["result"]
    assert res["ask"] is False and res["choice"] == "fresh"
    assert len(stored_alarm(hass_storage)["users"]) == 0
    msg = await _ws(client, 3, type="house_modes/ext/alarmo_import/run")
    assert msg["success"], msg
    assert msg["result"]["choice"] == "imported"


# ------------------------------------------------------------------ the import


async def test_import_copies_everything_and_never_writes_old_files(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Import: alarm data with code hashes as they are, extras with names rewritten; old files unchanged."""
    env = load_fixture_envelope()
    _write_old_files(hass_storage, copy.deepcopy(env["data"]), copy.deepcopy(OLD_EXTRAS))
    before = _fingerprint(hass_storage)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="house_modes/ext/alarmo_import/run")
    assert msg["success"], msg
    await hass.async_block_till_done()

    assert _fingerprint(hass_storage) == before  # the old files are only read
    alarm = stored_alarm(hass_storage)
    assert alarm["users"] == env["data"]["users"]  # bcrypt hashes copied as is
    assert len(alarm["sensors"]) == len(env["data"]["sensors"])
    extras = stored_extras(hass_storage)
    assert extras["retention_days"] == 14
    assert extras["house"]["current"] == "stay" and len(extras["house"]["modes"]) == 2
    assert extras["panel"]["links"][GF]["arm_order"] == "after_alarm"
    rec = stored_section(hass_storage, "import")
    assert rec["choice"] == "imported" and rec["imported"]["kind"] == "fork"
    assert rec["imported"]["counts"]["users"] == 3

    coordinator = hass.data["house_modes"]["coordinator"]
    for code in FIXTURE_CODES.values():
        assert await coordinator.async_authenticate_user(code)
    assert hass.states.get(GF_ENTITY) is not None


async def test_import_refused_while_alarmo_enabled(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """The import refuses while the alarmo entry is enabled (never both running)."""
    _write_old_files(hass_storage, load_fixture_envelope()["data"], OLD_EXTRAS)
    _old_entry(hass, disabled=False)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="house_modes/ext/alarmo_import/run")
    assert not msg["success"] and msg["error"]["code"] == "blocked"
    assert "Disable it first" in msg["error"]["message"]
    assert stored_section(hass_storage, "import") is None


async def test_import_works_with_alarmo_disabled(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """A disabled alarmo entry does not block."""
    _write_old_files(hass_storage, load_fixture_envelope()["data"], None)
    _old_entry(hass, disabled=True)
    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="house_modes/ext/alarmo_import/run")
    assert msg["success"], msg
    assert msg["result"]["imported"]["kind"] == "alarmo"


async def test_import_copies_folders(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Activity and backups are copied to /config/house_modes/; the originals stay; kind alarmo -> alarm."""
    _write_old_files(hass_storage, load_fixture_envelope()["data"], None)
    old_act = tmp_path / "alarmo" / "activity"
    old_bak = tmp_path / "alarmo" / "backups"
    old_act.mkdir(parents=True)
    old_bak.mkdir(parents=True)
    seq = {"id": "a", "start": 1.0, "kinds": ["house", "alarmo"], "entries": [{"t": 1, "dt": 0, "kind": "alarmo",
                                                                                 "text": "Master: disarmed → armed"}]}
    (old_act / "2026-11-10.jsonl").write_text(json.dumps(seq) + "\n", encoding="utf-8")
    (old_bak / "alarmo_2026-11-10_101240_manual.yaml").write_text("x: 1\n", encoding="utf-8")
    old_bytes = (old_act / "2026-11-10.jsonl").read_bytes()

    await _fresh_setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="house_modes/ext/alarmo_import/run")
    assert msg["success"], msg
    copied = json.loads((tmp_path / "house_modes" / "activity" / "2026-11-10.jsonl").read_text().splitlines()[0])
    assert copied["kinds"] == ["house", "alarm"] and copied["entries"][0]["kind"] == "alarm"
    assert (tmp_path / "house_modes" / "backups" / "alarmo_2026-11-10_101240_manual.yaml").is_file()
    assert (old_act / "2026-11-10.jsonl").read_bytes() == old_bytes
    assert (old_bak / "alarmo_2026-11-10_101240_manual.yaml").is_file()
    # the copied Alarmo backup is listed with ours
    names = [b["name"] for b in (await _ws(client, 2, type="house_modes/ext/backup/list"))["result"]["backups"]]
    assert "alarmo_2026-11-10_101240_manual" in names


# ------------------------------------------------------------------ coexistence


async def _panel_setup(hass, hass_storage, tmp_path):
    await setup_real_house_modes(hass, hass_storage, tmp_path, load_fixture_envelope())
    entry = MockConfigEntry(domain="envisalink_new")
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    reg.async_get_or_create("alarm_control_panel", "envisalink_new", "p1", suggested_object_id="alarm_partition_1",
                            config_entry=entry)
    reg.async_update_entity_options(PANEL, "alarm_control_panel", {"default_code": "1234"})
    hass.states.async_set(PANEL, "disarmed")
    calls = async_mock_service(hass, "alarm_control_panel", "alarm_arm_home")
    keys = async_mock_service(hass, "envisalink_new", "alarm_keypress")
    await hass.async_block_till_done()
    return calls, keys


async def _arm_home(hass) -> None:
    await hass.services.async_call(
        "house_modes", "arm", {"entity_id": GF_ENTITY, "code": "1234", "mode": "home"}, blocking=True
    )
    for _ in range(3):
        await hass.async_block_till_done()


async def test_live_link_stays_shadow_while_alarmo_enabled(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Both installed, Alarmo enabled: a Live link sends nothing (no double keypresses to the panel)."""
    old = _old_entry(hass, disabled=False)
    calls, keys = await _panel_setup(hass, hass_storage, tmp_path)
    ext = hass.data["house_modes_ext"]
    await ext.panel.async_save_settings(
        {"links": {GF: {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "live"}}}
    )
    await hass.async_block_till_done()
    await _arm_home(hass)
    assert len(calls) == 0 and len(keys) == 0
    assert any("[shadow]" in e["msg"] for e in ext.panel.log)
    assert old.state is not None


async def test_live_link_sends_once_alarmo_disabled(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Alarmo disabled: the Live link sends."""
    _old_entry(hass, disabled=True)
    calls, _keys = await _panel_setup(hass, hass_storage, tmp_path)
    ext = hass.data["house_modes_ext"]
    await ext.panel.async_save_settings(
        {"links": {GF: {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "live"}}}
    )
    await hass.async_block_till_done()
    await _arm_home(hass)
    assert len(calls) == 1


# ------------------------------------------------------------------ entity ids


async def test_mirror_ids_taken_over_and_given_back(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Alarmo disabled: our mirror gets the old id; unloading gives it back to Alarmo's entity."""
    old_entry = _old_entry(hass, disabled=True)
    reg = er.async_get(hass)
    old = reg.async_get_or_create(
        "binary_sensor", "alarmo", f"alarmo_mirror_{WIN}", suggested_object_id="gf_window_1_mirror",
        config_entry=old_entry,
    )
    mirror = "binary_sensor.gf_window_1_mirror"
    assert old.entity_id == mirror
    seed(hass_storage, extras={"panel": {"mirrors": {WIN: {"hold": "last"}}}})
    entry = await setup_real_house_modes(hass, hass_storage, tmp_path)
    await hass.async_block_till_done()

    ours = reg.async_get_entity_id("binary_sensor", "house_modes", f"house_modes_mirror_{WIN}")
    assert ours == mirror
    assert reg.async_get(old.id).entity_id == mirror + "_alarmo"

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert reg.async_get(old.id).entity_id == mirror
    ours = reg.async_get_entity_id("binary_sensor", "house_modes", f"house_modes_mirror_{WIN}")
    assert ours == mirror + "_house_modes"


async def test_no_takeover_while_alarmo_enabled(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Alarmo enabled: its entities keep their ids; ours get other ids."""
    old_entry = _old_entry(hass, disabled=False)
    reg = er.async_get(hass)
    old = reg.async_get_or_create(
        "binary_sensor", "alarmo", f"alarmo_mirror_{WIN}", suggested_object_id="gf_window_1_mirror",
        config_entry=old_entry,
    )
    seed(hass_storage, extras={"panel": {"mirrors": {WIN: {"hold": "last"}}}})
    await setup_real_house_modes(hass, hass_storage, tmp_path)
    await hass.async_block_till_done()
    assert reg.async_get(old.id).entity_id == "binary_sensor.gf_window_1_mirror"


def test_old_files_named_correctly() -> None:
    """The names the import reads are Alarmo's real file names."""
    from custom_components.house_modes.store import LEGACY_STORAGE_KEY  # noqa: PLC0415
    from custom_components.house_modes.extras_store import LEGACY_EXTRAS_KEY  # noqa: PLC0415

    assert LEGACY_STORAGE_KEY == "alarmo.storage" and LEGACY_EXTRAS_KEY == "alarmo_extras"


# ------------------------------------------------------------------ references in the user's configuration

AUTOMATIONS = """- id: '1'
  alias: Away at night
  triggers:
    - trigger: event
      event_type: alarmo_house_mode_changed
  conditions:
    - condition: state
      entity_id: select.alarmo_house_mode
      state: Away
    - condition: state
      entity_id: input_boolean.alarmo_change_away
      state: 'on'
  actions:
    - action: alarmo.set_house_mode
      data:
        mode: Night
        source: schedule
"""


async def test_references_scan_apply_undo(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Scan lists the lines; apply rewrites only those (copy first) and reloads; undo restores the file."""
    await _fresh_setup(hass, hass_storage, tmp_path)
    (tmp_path / "automations.yaml").write_text(AUTOMATIONS, encoding="utf-8")
    (tmp_path / "secrets.yaml").write_text("x: alarmo.arm\n", encoding="utf-8")
    reloads = async_mock_service(hass, "automation", "reload")
    client = await hass_ws_client(hass)
    scan = (await _ws(client, 1, type="house_modes/ext/references/scan"))["result"]
    assert [f["file"] for f in scan["files"]] == ["automations.yaml"]
    f = scan["files"][0]
    assert {h["kind"] for h in f["hits"]} == {"event", "House Mode select", "service"}
    assert scan["total"] == 3
    assert any("input_boolean.alarmo_change_away" in o["text"] for o in f["other"])
    assert (tmp_path / "automations.yaml").read_text() == AUTOMATIONS  # scanning changes nothing

    res = await _ws(client, 2, type="house_modes/ext/references/apply", token=scan["token"])
    assert res["success"], res
    text = (tmp_path / "automations.yaml").read_text()
    assert "house_modes.set_house_mode" in text and "house_modes_house_mode_changed" in text
    assert "select.house_mode" in text and "input_boolean.alarmo_change_away" in text
    assert "alarmo.set_house_mode" not in text
    assert len(reloads) == 1
    assert (tmp_path / "secrets.yaml").read_text() == "x: alarmo.arm\n"

    stale = await _ws(client, 3, type="house_modes/ext/references/apply", token=scan["token"])
    assert not stale["success"]

    undo = await _ws(client, 4, type="house_modes/ext/references/undo")
    assert undo["success"], undo
    assert (tmp_path / "automations.yaml").read_text() == AUTOMATIONS
