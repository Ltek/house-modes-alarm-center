"""Phase 4: panel link with a simulated Envisalink panel."""

from typing import Any

import pytest
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF = "1700000001"
ALARMO_GF = "alarm_control_panel.ground_floor"
PANEL = "alarm_control_panel.alarm_partition_1"
WIN = "binary_sensor.gf_window_1"  # configured Alarmo zone, also a panel zone (zone 9)
DOOR = "binary_sensor.front_door"  # configured Alarmo zone, HA-only
PANEL_ONLY = "binary_sensor.alarm_zone_9b"  # panel zone not in Alarmo


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


async def _settle(hass) -> None:
    for _ in range(3):
        await hass.async_block_till_done()


async def _setup(hass, hass_storage, tmp_path, code: str | None = "1234") -> dict:
    """Alarmo + a fake Envisalink panel with two zones; services mocked."""
    await setup_real_alarmo(hass, hass_storage, tmp_path, load_fixture_envelope())
    entry = MockConfigEntry(domain="envisalink_new")
    entry.add_to_hass(hass)
    reg = er.async_get(hass)
    hass.states.async_remove(WIN)
    for eid, uid in ((PANEL, "p1"), (WIN, "z9"), (PANEL_ONLY, "z10")):
        domain, obj = eid.split(".")
        made = reg.async_get_or_create(
            domain, "envisalink_new", uid, suggested_object_id=obj, config_entry=entry
        )
        assert made.entity_id == eid
    if code:
        reg.async_update_entity_options(
            PANEL, "alarm_control_panel", {"default_code": code}
        )
    hass.states.async_set(PANEL, "disarmed")
    hass.states.async_set(
        WIN, "off", {"zone": 9, "partition": 1, "device_class": "window"}
    )
    hass.states.async_set(
        PANEL_ONLY, "off", {"zone": 10, "partition": 1, "device_class": "door"}
    )
    calls = {
        name: async_mock_service(hass, "alarm_control_panel", name)
        for name in (
            "alarm_arm_home",
            "alarm_arm_away",
            "alarm_arm_night",
            "alarm_disarm",
            "alarm_trigger",
        )
    }
    calls["keypress"] = async_mock_service(hass, "envisalink_new", "alarm_keypress")
    calls["notify"] = async_mock_service(hass, "persistent_notification", "create")
    calls["siren"] = async_mock_service(hass, "siren", "turn_on")
    await _settle(hass)
    return calls


async def _save(hass, **settings) -> None:
    await hass.data["alarmo_ext"].panel.async_save_settings(settings)
    await _settle(hass)


def _link(mode="live", **kw) -> dict:
    return {
        "links": {
            GF: {"panel_entity": PANEL, "panel_type": "envisalink", "mode": mode, **kw}
        }
    }


async def _arm(hass, mode="home", force=False) -> None:
    await hass.services.async_call(
        "alarmo",
        "arm",
        {"entity_id": ALARMO_GF, "code": "1234", "mode": mode, "force": force},
        blocking=True,
    )
    await _settle(hass)


def _log(hass) -> list[str]:
    return [e["msg"] for e in hass.data["alarmo_ext"].panel.log]


def _sent(calls) -> int:
    return sum(len(v) for k, v in calls.items() if k not in ("notify", "siren"))


async def test_shadow_sends_nothing_and_logs(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Shadow: Alarmo arms, nothing is sent, the log says what would have happened."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"))
    await _arm(hass)
    assert hass.states.get(ALARMO_GF).state == "armed_home"
    await advance_time(hass, 120)  # shadow observes longer (the user's automations may send later)
    assert _sent(calls) == 0
    log = _log(hass)
    assert any(
        "[shadow] Alarmo armed_home → physical panel: service alarm_arm_home" in m for m in log
    )
    assert any("did not reach" in m for m in log)
    assert (
        hass.states.get(ALARMO_GF).state == "armed_home"
    )  # shadow never changes Alarmo


async def test_live_arm_confirmed(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Live: one service call, panel confirms, no retry."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await _arm(hass)
    assert len(calls["alarm_arm_home"]) == 1
    assert calls["alarm_arm_home"][0].data["entity_id"] == PANEL
    hass.states.async_set(PANEL, "arming")
    await _settle(hass)
    hass.states.async_set(PANEL, "armed_home")
    await _settle(hass)
    await advance_time(hass, 40)
    assert len(calls["alarm_arm_home"]) == 1
    assert any("physical panel is armed_home" in m for m in _log(hass))


async def test_retry_then_failure_disarms_alarmo(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """No confirmation: retry, then disarm Alarmo and notify."""
    calls = await _setup(hass, hass_storage, tmp_path)
    events = []
    hass.bus.async_listen("alarmo_ext_panel", lambda e: events.append(e.data))
    await _save(hass, **_link(retries=1, retry_delay=2))
    await _arm(hass)
    for _ in range(4):
        await advance_time(hass, 40)
    assert len(calls["alarm_arm_home"]) == 2
    assert hass.states.get(ALARMO_GF).state == "disarmed"
    assert any(e["type"] == "command_failed" for e in events)
    assert calls["notify"]
    assert not calls["alarm_disarm"]  # the panel was never armed; no disarm echo


async def test_keypress_mode_bypass_first_and_code_masked(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Force-arm with an open panel zone: bypass keys, then the arm; code hidden in the log."""
    calls = await _setup(hass, hass_storage, tmp_path)
    cmds = {
        "armed_home": {
            "method": "keypress",
            "keys": "{code}7",
            "accept": ["armed_home"],
            "timeout": 10,
        }
    }
    await _save(hass, **_link(commands=cmds))
    hass.states.async_set(
        WIN, "on", {"zone": 9, "partition": 1, "device_class": "window"}
    )
    await _settle(hass)
    await _arm(hass, force=True)
    assert hass.states.get(ALARMO_GF).state == "armed_home"
    keys = [c.data["keypress"] for c in calls["keypress"]]
    assert keys == ["1234609", "12347"]
    assert hass.data["alarmo_ext"].panel.is_bypassed(WIN)
    assert not any("1234" in m for m in _log(hass))
    hass.states.async_set(PANEL, "armed_home")
    await advance_time(hass, 20)


async def test_missing_code_is_reported(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Keypress needs the HA default code on the panel entity."""
    calls = await _setup(hass, hass_storage, tmp_path, code=None)
    cmds = {
        "armed_home": {
            "method": "keypress",
            "keys": "{code}7",
            "accept": ["armed_home"],
            "timeout": 10,
        }
    }
    await _save(hass, **_link(commands=cmds, failure_policy="keep"))
    await _arm(hass)
    assert not calls["keypress"]
    assert any("Set a default code" in m for m in _log(hass))
    assert hass.states.get(ALARMO_GF).state == "armed_home"  # policy keep


async def test_keypad_follow_without_echo(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Keypad arm/disarm at the panel is followed by Alarmo, and nothing is sent back."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    hass.states.async_set(PANEL, "armed_away")
    await _settle(hass)
    await advance_time(hass, 1)
    assert hass.states.get(ALARMO_GF).state == "armed_away"
    hass.states.async_set(PANEL, "disarmed")
    await _settle(hass)
    assert hass.states.get(ALARMO_GF).state == "disarmed"
    await advance_time(hass, 40)
    assert _sent(calls) == 0


async def test_alarmo_disarm_disarms_panel(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Disarming Alarmo disarms the panel and clears tracked bypasses."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await _arm(hass)
    hass.states.async_set(PANEL, "armed_home")
    await _settle(hass)
    await hass.services.async_call(
        "alarmo", "disarm", {"entity_id": ALARMO_GF, "code": "1234"}, blocking=True
    )
    await _settle(hass)
    assert len(calls["alarm_disarm"]) == 1
    hass.states.async_set(PANEL, "disarmed")
    await advance_time(hass, 25)
    assert len(calls["alarm_disarm"]) == 1


async def test_ha_only_zone_trip_sounds_siren(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """An HA-only zone triggering Alarmo sets off the configured siren."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link(), trip={"method": "siren", "entity": "siren.house"})
    await _arm(hass)
    hass.states.async_set(PANEL, "armed_home")
    hass.states.async_set(DOOR, "on")
    await _settle(hass)
    await advance_time(hass, 1)
    assert hass.states.get(ALARMO_GF).state in ("triggered", "pending")
    await advance_time(hass, 60)
    assert hass.states.get(ALARMO_GF).state == "triggered"
    await _settle(hass)
    assert calls["siren"] and calls["siren"][0].data["entity_id"] == "siren.house"


async def test_monitored_panel_only_notifies(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Monitored: HA-only zones notify instead of setting off the panel."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(
        hass,
        **_link(),
        monitored=True,
        trip={"method": "siren", "entity": "siren.house"},
    )
    await _arm(hass)
    hass.states.async_set(PANEL, "armed_home")
    hass.states.async_set(DOOR, "on")
    await advance_time(hass, 60)
    await _settle(hass)
    assert hass.states.get(ALARMO_GF).state == "triggered"
    assert not calls["siren"]
    assert any("Alarmo alarm by" in c.data["message"] for c in calls["notify"])


async def test_mirror_holds_while_bypassed(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """Mirror follows the zone, holds 'open' while bypassed, clears on panel disarm."""
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"), mirrors={WIN: {"hold": "last"}})
    mirror = "binary_sensor.gf_window_1_mirror"
    st = hass.states.get(mirror)
    assert st is not None and st.state == "off" and st.attributes["source"] == WIN
    hass.states.async_set(WIN, "on", {"zone": 9, "device_class": "window"})
    await _settle(hass)
    assert hass.states.get(mirror).state == "on"
    hass.states.async_set(
        WIN, "on", {"zone": 9, "device_class": "window", "bypassed": True}
    )
    await _settle(hass)
    hass.states.async_set(
        WIN, "off", {"zone": 9, "device_class": "window", "bypassed": True}
    )
    await _settle(hass)
    st = hass.states.get(mirror)
    assert st.state == "on" and st.attributes["bypass_held"] is True
    hass.states.async_set(PANEL, "armed_home")
    await _settle(hass)
    hass.states.async_set(PANEL, "disarmed")
    await _settle(hass)
    assert hass.states.get(mirror).state == "off"
    await _save(hass, **_link("shadow"), mirrors={})
    assert hass.states.get(mirror) is None


async def test_import_and_repoint(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Discover the panel, import a zone, point an existing zone at its mirror."""
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"), mirrors={WIN: {"hold": "last"}})
    client = await hass_ws_client(hass)
    got = (await _ws(client, 1, type="alarmo/ext/panel/get"))["result"]
    (panel,) = [p for p in got["panels"] if p["entity_id"] == PANEL]
    assert panel["code_set"] and [z["zone"] for z in panel["zones"]] == [9, 10]
    assert {t["key"] for t in got["targets"]} >= {GF, "master"}

    dry = (
        await _ws(
            client,
            2,
            type="alarmo/ext/panel/import",
            partition=GF,
            entities=[PANEL_ONLY],
            dry_run=True,
        )
    )["result"]
    assert dry["applied"] is False and dry["create"][0]["type"] == "door"
    res = (
        await _ws(
            client,
            3,
            type="alarmo/ext/panel/import",
            partition=GF,
            entities=[PANEL_ONLY],
        )
    )["result"]
    assert res["applied"] and res["backup"]["name"].endswith("_panel-import")
    sensors = {
        s["entity_id"]: s for s in hass_storage["alarmo.storage"]["data"]["sensors"]
    }
    assert sensors[PANEL_ONLY]["area"] == GF

    before = dict(sensors[WIN])
    mirror = "binary_sensor.gf_window_1_mirror"
    res = await _ws(
        client, 4, type="alarmo/ext/panel/repoint", pairs=[{"from": WIN, "to": mirror}]
    )
    assert res["success"], res
    sensors = {
        s["entity_id"]: s for s in hass_storage["alarmo.storage"]["data"]["sensors"]
    }
    assert WIN not in sensors
    assert {k: v for k, v in sensors[mirror].items() if k != "entity_id"} == {
        k: v for k, v in before.items() if k != "entity_id"
    }


async def test_panel_commands_admin_only(
    hass: Any,
    hass_storage: Any,
    hass_ws_client: Any,
    hass_read_only_access_token: str,
    tmp_path: Any,
) -> None:
    """All panel commands require an admin."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass, hass_read_only_access_token)
    for i, cmd in enumerate(
        [
            {"type": "alarmo/ext/panel/get"},
            {"type": "alarmo/ext/panel/save", "settings": {}},
            {"type": "alarmo/ext/panel/log"},
            {"type": "alarmo/ext/panel/import", "partition": GF, "entities": []},
            {"type": "alarmo/ext/panel/repoint", "pairs": []},
        ],
        start=1,
    ):
        msg = await _ws(client, i, **cmd)
        assert msg["error"]["code"] == "unauthorized"


async def test_mirror_bypass_helper_without_link(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A bypass helper makes mirrors hold while it is on; no panel link needed."""
    await _setup(hass, hass_storage, tmp_path)
    hass.states.async_set("input_boolean.bypass_alarm_zones", "off")
    await _save(hass, mirrors={WIN: {"hold": "last"}}, bypass_entity="input_boolean.bypass_alarm_zones")
    mirror = "binary_sensor.gf_window_1_mirror"
    hass.states.async_set(WIN, "on", {"zone": 9, "device_class": "window"})
    await _settle(hass)
    hass.states.async_set("input_boolean.bypass_alarm_zones", "on")
    await _settle(hass)
    hass.states.async_set(WIN, "off", {"zone": 9, "device_class": "window"})
    await _settle(hass)
    st = hass.states.get(mirror)
    assert st.state == "on" and st.attributes["bypass_held"] is True and st.attributes["bypassed"] is True
    hass.states.async_set("input_boolean.bypass_alarm_zones", "off")
    await _settle(hass)
    assert hass.states.get(mirror).state == "off"


async def test_stale_honeywell_bypassed_attribute(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """After a disarm, a `bypassed` attribute that stays true does not re-bypass the zone; bypasses are stored."""
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"), mirrors={WIN: {"hold": "last"}})
    panel = hass.data["alarmo_ext"].panel
    hass.states.async_set(WIN, "off", {"zone": 9, "device_class": "window", "bypassed": True})
    await _settle(hass)
    assert panel.is_bypassed(WIN)
    assert hass_storage["alarmo_extras"]["data"]["panel_bypassed"] == [WIN]
    hass.states.async_set(PANEL, "armed_home")
    await _settle(hass)
    hass.states.async_set(PANEL, "disarmed")
    await _settle(hass)
    assert not panel.is_bypassed(WIN)
    hass.states.async_set(WIN, "on", {"zone": 9, "device_class": "window", "bypassed": True})
    await _settle(hass)
    hass.states.async_set(WIN, "off", {"zone": 9, "device_class": "window", "bypassed": True})
    await _settle(hass)
    assert not panel.is_bypassed(WIN) and hass.states.get("binary_sensor.gf_window_1_mirror").state == "off"


async def test_honeywell_bypassed_attribute_ignored(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """envisalink_new on a Vista never clears `bypassed` and reports it late: it is ignored; the helper is needed."""
    await _setup(hass, hass_storage, tmp_path)
    entry = hass.config_entries.async_entries("envisalink_new")[0]
    hass.config_entries.async_update_entry(entry, data={**entry.data, "panel_type": "HONEYWELL"})
    await _save(hass, **_link("shadow"), mirrors={WIN: {"hold": "last"}})
    panel = hass.data["alarmo_ext"].panel
    assert panel.honeywell_zones() == [WIN]
    hass.states.async_set(WIN, "on", {"zone": 9, "device_class": "window", "bypassed": True})
    await _settle(hass)
    hass.states.async_set(WIN, "off", {"zone": 9, "device_class": "window", "bypassed": True})
    await _settle(hass)
    assert not panel.is_bypassed(WIN) and hass.states.get("binary_sensor.gf_window_1_mirror").state == "off"


async def _honeywell_with_keypad(hass, hass_storage, tmp_path):
    await _setup(hass, hass_storage, tmp_path)
    entry = hass.config_entries.async_entries("envisalink_new")[0]
    hass.config_entries.async_update_entry(entry, data={**entry.data, "panel_type": "HONEYWELL"})
    er.async_get(hass).async_get_or_create(
        "sensor", "envisalink_new", "kp1", suggested_object_id="alarm_partition_1_keypad", config_entry=entry
    )
    kp = "sensor.alarm_partition_1_keypad"
    hass.states.async_set(kp, "Ready to arm", {"alpha": "Ready to arm", "armed_bypass": False})
    await _save(hass, **_link("shadow"), mirrors={WIN: {"hold": "last"}})
    return kp


async def test_vista_quick_bypass_from_keypad(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Vista: a window open at arming is Quick-Bypassed (BYPASS indicator on) → the mirror holds open; disarm clears."""
    kp = await _honeywell_with_keypad(hass, hass_storage, tmp_path)
    panel = hass.data["alarmo_ext"].panel
    mirror = "binary_sensor.gf_window_1_mirror"
    assert panel.honeywell_zones() == []  # covered by the keypad sensor
    hass.states.async_set(WIN, "on", {"zone": 9, "partition": 1, "device_class": "window"})
    await _settle(hass)
    # the panel stops reporting the bypassed zone before the indicator update arrives
    hass.states.async_set(WIN, "off", {"zone": 9, "partition": 1, "device_class": "window"})
    await _settle(hass)
    hass.states.async_set(kp, "ARMED ***STAY***", {"alpha": "ARMED ***STAY*** ZONE BYPASSED", "armed_bypass": True})
    await _settle(hass)
    st = hass.states.get(mirror)
    assert panel.is_bypassed(WIN) and st.state == "on" and st.attributes["bypass_held"] is True
    hass.states.async_set(kp, "Ready to arm", {"alpha": "Ready to arm", "armed_bypass": False})
    await _settle(hass)
    assert not panel.is_bypassed(WIN) and hass.states.get(mirror).state == "off"


async def test_vista_bypas_text_marks_zone(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A closed zone bypassed by hand shows up as "BYPAS 09" on the keypad → bypassed (mirror stays closed)."""
    kp = await _honeywell_with_keypad(hass, hass_storage, tmp_path)
    panel = hass.data["alarmo_ext"].panel
    hass.states.async_set(kp, "BYPAS 09 GF WINDOW", {"alpha": "BYPAS 09 GF WINDOW", "armed_bypass": True})
    await _settle(hass)
    assert panel.is_bypassed(WIN) and hass.states.get("binary_sensor.gf_window_1_mirror").state == "off"


async def test_vista_keypad_unavailable_keeps_bypasses(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """The keypad sensor going unavailable (Envisalink reconnect) does not clear the bypasses."""
    kp = await _honeywell_with_keypad(hass, hass_storage, tmp_path)
    panel = hass.data["alarmo_ext"].panel
    hass.states.async_set(WIN, "on", {"zone": 9, "partition": 1, "device_class": "window"})
    await _settle(hass)
    hass.states.async_set(kp, "ARMED STAY", {"alpha": "ARMED STAY", "armed_bypass": True})
    await _settle(hass)
    assert panel.is_bypassed(WIN)
    hass.states.async_set(kp, "unavailable", {})
    await _settle(hass)
    hass.states.async_set(kp, "ARMED STAY", {"alpha": "ARMED STAY", "armed_bypass": True})
    await _settle(hass)
    assert panel.is_bypassed(WIN) and hass.states.get("binary_sensor.gf_window_1_mirror").state == "on"


async def test_panel_leads_sends_when_alarmo_starts_arming(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Panel leads: the panel gets the command at the start of Alarmo's exit delay; Alarmo armed later is not resent."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await _arm(hass, "away")  # GF away has a 60 s exit time
    assert hass.states.get(ALARMO_GF).state == "arming"
    assert len(calls["alarm_arm_away"]) == 1
    hass.states.async_set(PANEL, "arming")
    await _settle(hass)
    hass.states.async_set(PANEL, "armed_away")
    await _settle(hass)
    await advance_time(hass, 65)  # Alarmo's 60 s exit delay ends
    assert hass.states.get(ALARMO_GF).state == "armed_away"
    assert len(calls["alarm_arm_away"]) == 1
    log = _log(hass)
    assert any("started arming" in m for m in log) and any("physical panel is armed_away after" in m for m in log)


async def test_panel_leads_unfinished_arming_fails(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """The panel accepts (arming) but never finishes: after the deadline Alarmo is disarmed and you are told."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link(retries=0))
    await _arm(hass, "away")
    hass.states.async_set(PANEL, "arming")
    await _settle(hass)
    await advance_time(hass, 120)
    await _settle(hass)
    assert hass.states.get(ALARMO_GF).state == "disarmed"
    assert any("did not finish arming" in m for m in _log(hass)) and calls["notify"]


async def test_keypad_arming_followed_from_the_start_with_mapping(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Keypad arming: Alarmo arms along in the mapped mode; an open HA-only zone is bypassed + notified."""
    calls = await _setup(hass, hass_storage, tmp_path)
    entry = hass.config_entries.async_entries("envisalink_new")[0]
    er.async_get(hass).async_get_or_create(
        "sensor", "envisalink_new", "kp1", suggested_object_id="alarm_partition_1_keypad", config_entry=entry
    )
    kp = "sensor.alarm_partition_1_keypad"
    hass.states.async_set(kp, "Ready", {"alpha": "Ready to arm", "armed_bypass": False, "ready": True})
    await _save(hass, **_link(follow_map={"armed_home": "armed_night"}))
    hass.states.async_set(DOOR, "on")  # HA-only zone open
    await _settle(hass)
    hass.states.async_set(kp, "ARMED ***STAY***", {"alpha": "ARMED ***STAY*** You may exit now", "armed_bypass": False})
    hass.states.async_set(PANEL, "arming")
    await _settle(hass)
    await advance_time(hass, 1)
    st = hass.states.get(ALARMO_GF)
    assert st.state in ("arming", "armed_night") and st.attributes.get("arm_mode") == "armed_night"
    assert DOOR in (st.attributes.get("bypassed_sensors") or [])
    assert calls["notify"] and _sent(calls) == 0  # nothing echoed to the panel
    hass.states.async_set(PANEL, "armed_home")
    await _settle(hass)
    await advance_time(hass, 30)
    assert hass.states.get(ALARMO_GF).state == "armed_night" and _sent(calls) == 0


async def test_match_exit_times(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Alarmo's exit times are set to the panel's learned exit delay + 3 s (backup first)."""
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link(learned_exit_delay={"armed_home": 26, "armed_away": 29}))
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="alarmo/ext/panel/match_exit", link=GF, dry_run=True))["result"]
    assert res["plan"][GF]["changes"]["armed_home"] == 29 and res["plan"][GF]["changes"]["armed_away"] == 32
    res = (await _ws(client, 2, type="alarmo/ext/panel/match_exit", link=GF))["result"]
    assert res["applied"] and res["backup"]
    area = hass.data["alarmo"]["coordinator"].store.async_get_area(GF)
    assert area["modes"]["armed_home"]["exit_time"] == 29 and area["modes"]["armed_away"]["exit_time"] == 32


async def test_vista_bypas_list_corrects_the_guess(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A zone closed just before Quick Bypass is guessed, but dropped when the panel's BYPAS list doesn't name it."""
    kp = await _honeywell_with_keypad(hass, hass_storage, tmp_path)
    panel = hass.data["alarmo_ext"].panel
    hass.states.async_set(PANEL_ONLY, "on", {"zone": 10, "partition": 1, "device_class": "door"})
    hass.states.async_set(WIN, "on", {"zone": 9, "partition": 1, "device_class": "window"})
    await _settle(hass)
    hass.states.async_set(PANEL_ONLY, "off", {"zone": 10, "partition": 1, "device_class": "door"})  # door closed
    await _settle(hass)
    panel._keypads[kp] = sorted({*panel._keypads[kp], PANEL_ONLY})
    hass.states.async_set(kp, "BYPAS", {"alpha": "BYPAS", "armed_bypass": True})
    await _settle(hass)
    assert panel.is_bypassed(PANEL_ONLY)  # guessed
    hass.states.async_set(kp, "BYPAS 09", {"alpha": "BYPAS 09", "armed_bypass": True})
    await _settle(hass)
    await advance_time(hass, 30)
    assert panel.is_bypassed(WIN) and not panel.is_bypassed(PANEL_ONLY)


# ---------------------------------------------------------------- start-up check


async def _armed_without_link(hass, hass_storage, tmp_path, mode="home"):
    """Alarmo armed while no link runs (as restored after a restart)."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("off"))
    await _arm(hass, mode, force=True)
    await advance_time(hass, 300)
    assert hass.states.get(ALARMO_GF).state == f"armed_{mode}"
    return calls


async def test_start_check_disarms_stale_alarmo(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Alarmo restored armed, the panel is disarmed: Alarmo follows the panel, nothing is sent."""
    calls = await _armed_without_link(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await advance_time(hass, 10)
    assert hass.states.get(ALARMO_GF).state == "armed_home"  # waits for both sides to settle
    await advance_time(hass, 31)
    await _settle(hass)
    assert hass.states.get(ALARMO_GF).state == "disarmed"
    assert _sent(calls) == 0
    assert any("Alarmo restored armed_home → disarm Alarmo" in m for m in _log(hass))
    assert any("disarmed to match" in c.data["title"] for c in calls["notify"])


async def test_start_check_arms_alarmo_to_match(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """The panel is armed, Alarmo disarmed: Alarmo arms (no exit delay), nothing is sent back."""
    calls = await _setup(hass, hass_storage, tmp_path)
    hass.states.async_set(PANEL, "armed_away")
    await _settle(hass)
    await _save(hass, **_link())
    await advance_time(hass, 31)
    await _settle(hass)
    assert hass.states.get(ALARMO_GF).state == "armed_away"
    await advance_time(hass, 40)
    assert _sent(calls) == 0


async def test_start_check_in_step_and_shadow(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """In step: logged only. Shadow: a difference is logged, Alarmo is not changed."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await advance_time(hass, 31)
    assert any("check: in step (Alarmo disarmed, physical panel disarmed)" in m for m in _log(hass))
    await _save(hass, **_link("off"))
    await _arm(hass, "home", force=True)
    await advance_time(hass, 300)
    await _save(hass, **_link("shadow"))
    await advance_time(hass, 31)
    assert hass.states.get(ALARMO_GF).state == "armed_home"
    assert any("[shadow] start check: physical panel is disarmed" in m for m in _log(hass))
    assert _sent(calls) == 0
    assert not calls["notify"]


async def test_start_check_waits_for_the_panel(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Panel unavailable: no comparison; its first report is not a keypad action; never reporting → notify."""
    calls = await _armed_without_link(hass, hass_storage, tmp_path)
    hass.states.async_set(PANEL, "unavailable")
    await _settle(hass)
    await _save(hass, **_link())
    await advance_time(hass, 60)
    assert hass.states.get(ALARMO_GF).state == "armed_home"
    hass.states.async_set(PANEL, "armed_home")  # reconnects: in step with Alarmo
    await _settle(hass)
    await advance_time(hass, 31)
    assert hass.states.get(ALARMO_GF).state == "armed_home"
    assert any("in step (Alarmo armed_home, physical panel armed_home)" in m for m in _log(hass))
    # a later outage that never ends
    hass.states.async_set(PANEL, "unavailable")
    await _settle(hass)
    await advance_time(hass, 301)
    assert any("did not report" in m for m in _log(hass))
    assert any("not reporting" in c.data["title"] for c in calls["notify"])
    assert _sent(calls) == 0


async def test_start_check_leaves_alarms_alone(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Panel in alarm after a restart: nothing is changed, the user is told."""
    calls = await _setup(hass, hass_storage, tmp_path)
    hass.states.async_set(PANEL, "triggered")
    await _settle(hass)
    await _save(hass, **_link())
    await advance_time(hass, 31)
    assert hass.states.get(ALARMO_GF).state == "disarmed"
    assert any("differ" in c.data["title"] for c in calls["notify"])


async def test_normal_use_cancels_the_check(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Arming right after the link starts is normal operation: the check stands down."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link())
    await _arm(hass)
    await advance_time(hass, 31)
    assert not any(" check:" in m for m in _log(hass))
    assert len(calls["alarm_arm_home"]) == 1
