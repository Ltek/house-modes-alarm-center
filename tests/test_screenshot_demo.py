# ruff: noqa: E501, D102, D107, PLR0912
"""Screenshot demo data: run a demo Alarmo (made-up house) and record every read-only websocket answer.

Skipped in the normal test run. Run with:
    ALARMO_SCREENSHOT_DEMO=1 uv run pytest -q tests/test_screenshot_demo.py
It writes tools/screenshots/demo.json, which tools/screenshots/capture.mjs replays in a browser.
"""

import os
import json
import time
from typing import Any
from pathlib import Path

import pytest
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from tests.helpers import advance_time
from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope

pytestmark = [
    pytest.mark.usefixtures("enable_custom_integrations"),
    pytest.mark.skipif(not os.environ.get("ALARMO_SCREENSHOT_DEMO"), reason="screenshot demo data (tools/screenshots)"),
]

OUT = Path(__file__).resolve().parents[1] / "tools" / "screenshots" / "demo.json"
GF, UP, GAR = "1700000001", "1700000002", "1700000003"
PANEL = "alarm_control_panel.vista_partition_1"
FRONT = "lock.front_door_lock"
BACK = "lock.back_door_lock"
NAMES = {
    "binary_sensor.front_door": ("Front Door", "door"),
    "binary_sensor.back_door": ("Back Door", "door"),
    "binary_sensor.patio_door": ("Patio Door", "door"),
    "binary_sensor.side_door": ("Side Door", "door"),
    "binary_sensor.gf_window_1": ("Kitchen Window", "window"),
    "binary_sensor.gf_window_2": ("Dining Window", "window"),
    "binary_sensor.gf_window_3": ("Living Room Window 1", "window"),
    "binary_sensor.gf_window_4": ("Living Room Window 2", "window"),
    "binary_sensor.gf_window_5": ("Family Room Window", "window"),
    "binary_sensor.gf_window_6": ("Laundry Window", "window"),
    "binary_sensor.hall_motion": ("Hall Motion", "motion"),
    "binary_sensor.living_motion": ("Living Room Motion", "motion"),
    "binary_sensor.kitchen_motion": ("Kitchen Motion", "motion"),
    "binary_sensor.dining_motion": ("Dining Motion", "motion"),
    "binary_sensor.up_window_1": ("Bedroom 1 Window", "window"),
    "binary_sensor.up_window_2": ("Bedroom 2 Window", "window"),
    "binary_sensor.up_window_3": ("Bedroom 3 Window", "window"),
    "binary_sensor.up_window_4": ("Bathroom Window", "window"),
    "binary_sensor.up_window_5": ("Landing Window", "window"),
    "binary_sensor.landing_motion": ("Landing Motion", "motion"),
    "binary_sensor.bed_1_motion": ("Bedroom 1 Motion", "motion"),
    "binary_sensor.bed_2_motion": ("Bedroom 2 Motion", "motion"),
    "binary_sensor.bed_3_motion": ("Bedroom 3 Motion", "motion"),
    "binary_sensor.office_motion": ("Office Motion", "motion"),
    "binary_sensor.garage_door": ("Garage Side Door", "door"),
    "binary_sensor.shed_door": ("Shed Door", "door"),
    "binary_sensor.garage_motion": ("Garage Motion", "motion"),
    "binary_sensor.driveway_motion": ("Driveway Motion", "motion"),
    "binary_sensor.kitchen_smoke": ("Kitchen Smoke", "smoke"),
    "binary_sensor.hall_smoke": ("Hall Smoke", "smoke"),
    "binary_sensor.boiler_co": ("Boiler CO", "carbon_monoxide"),
    "binary_sensor.utility_leak": ("Utility Leak", "moisture"),
    "binary_sensor.keypad_tamper": ("Keypad Tamper", "tamper"),
    "binary_sensor.landing_smoke": ("Landing Smoke", "smoke"),
    "lock.front_door": ("Front Door Lock", None),
}
PANEL_ZONES = [  # zone number, entity, name, device class
    (1, "binary_sensor.vista_zone_1", "Front Door", "door"),
    (2, "binary_sensor.vista_zone_2", "Hall Motion", "motion"),
    (3, "binary_sensor.vista_zone_3", "Back Door", "door"),
    (4, "binary_sensor.vista_zone_4", "Patio Door", "door"),
    (9, "binary_sensor.vista_zone_9", "Kitchen Window", "window"),
    (10, "binary_sensor.vista_zone_10", "Dining Window", "window"),
    (11, "binary_sensor.vista_zone_11", "Living Room Window 1", "window"),
    (12, "binary_sensor.vista_zone_12", "Living Room Window 2", "window"),
    (13, "binary_sensor.vista_zone_13", "Bedroom 1 Window", "window"),
    (14, "binary_sensor.vista_zone_14", "Bedroom 2 Window", "window"),
    (19, "binary_sensor.vista_zone_19", "Smoke Detector", "smoke"),
]


async def _ws(client, i: int, **msg) -> Any:
    await client.send_json({"id": i, **msg})
    res = await client.receive_json()
    assert res["success"], (msg, res)
    return res["result"]


class FakeLock:
    """Lock slots for the demo (made-up codes)."""

    def __init__(self) -> None:
        self.slots = {FRONT: {1: "1234", 2: "9876", 3: "3390", 5: "6420"}, BACK: {1: "1234", 2: "9876"}}

    async def read(self, entity_id):
        s = self.slots.get(entity_id, {})
        return [{"slot": n, "in_use": bool(c), "code": c, "name": ""} for n, c in sorted(s.items())], "code_slots"

    async def write(self, entity_id, slot, code):
        self.slots.setdefault(entity_id, {})[slot] = code or ""


async def test_capture_demo(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:  # noqa: PLR0915
    """Build the demo and dump every read-only answer the panel asks for."""
    env = load_fixture_envelope()
    data = env["data"]
    for a in data["areas"]:
        for m in a["modes"].values():
            m["enabled"] = True
    for u, name in zip(data["users"], ["Alex", "Sam", "Guest"]):
        u["name"] = name
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    for eid, (name, dc) in NAMES.items():
        st = hass.states.get(eid)
        hass.states.async_set(eid, st.state if st else "off", {"friendly_name": name, **({"device_class": dc} if dc else {})})
    hass.states.async_set("binary_sensor.gf_window_3", "on", {"friendly_name": "Living Room Window 1", "device_class": "window"})
    hass.states.async_set("binary_sensor.kitchen_motion", "on", {"friendly_name": "Kitchen Motion", "device_class": "motion"})

    # a physical panel (envisalink_new, Vista) with zones and a keypad sensor
    pentry = MockConfigEntry(domain="envisalink_new", data={"panel_type": "HONEYWELL"}, title="Vista")
    pentry.add_to_hass(hass)
    reg = er.async_get(hass)
    reg.async_get_or_create("alarm_control_panel", "envisalink_new", "p1", suggested_object_id="vista_partition_1", config_entry=pentry)
    reg.async_options = None
    hass.states.async_set(PANEL, "disarmed", {"friendly_name": "Vista Partition 1"})
    reg.async_update_entity_options(PANEL, "alarm_control_panel", {"default_code": "0000"})
    for num, eid, name, dc in PANEL_ZONES:
        reg.async_get_or_create("binary_sensor", "envisalink_new", f"z{num}", suggested_object_id=eid.split(".")[1], config_entry=pentry)
        hass.states.async_set(eid, "on" if num == 11 else "off", {"zone": num, "partition": 1, "device_class": dc, "friendly_name": name})
    reg.async_get_or_create("binary_sensor", "envisalink_new", "ready", suggested_object_id="vista_partition_1_ready", config_entry=pentry)
    hass.states.async_set("binary_sensor.vista_partition_1_ready", "off", {"friendly_name": "Vista Ready"})
    reg.async_get_or_create("sensor", "envisalink_new", "kp1", suggested_object_id="vista_partition_1_keypad", config_entry=pentry)
    hass.states.async_set("sensor.vista_partition_1_keypad", "FAULT 11 LIVING ROOM WINDOW", {"alpha": "FAULT 11 LIVING ROOM WINDOW", "armed_bypass": False, "ready": False})
    for svc in ("alarm_arm_home", "alarm_arm_away", "alarm_arm_night", "alarm_disarm"):
        async_mock_service(hass, "alarm_control_panel", svc)
    async_mock_service(hass, "envisalink_new", "alarm_keypress")

    # Z-Wave locks
    zentry = MockConfigEntry(domain="zwave_js")
    zentry.add_to_hass(hass)
    for node, eid, name in ((12, FRONT, "Front Door Lock"), (14, BACK, "Back Door Lock")):
        dev = dr.async_get(hass).async_get_or_create(config_entry_id=zentry.entry_id, identifiers={("zwave_js", f"9999-{node}")})
        reg.async_get_or_create("lock", "zwave_js", f"9999.{node}-98-0", device_id=dev.id, config_entry=zentry, suggested_object_id=eid.split(".")[1])
        hass.states.async_set(eid, "locked", {"friendly_name": name})

    ext = hass.data["alarmo_ext"]
    await ext.panel.async_save_settings(
        {
            "links": {GF: {"panel_entity": PANEL, "panel_type": "envisalink", "mode": "shadow",
                           "learned_exit_delay": {"armed_home": 29, "armed_away": 30}}},
            "mirrors": {e: {"hold": "last"} for n, e, _nm, dc in PANEL_ZONES if dc == "window"},
            "monitored": False,
            "trip": {"method": "none"},
        }
    )
    await hass.async_block_till_done()
    await ext.house.async_save_settings(
        {
            "enabled": True,
            "modes": [
                {"id": "disarmed", "name": "Disarmed", "icon": "mdi:shield-off-outline", "targets": {GF: "disarmed", UP: "disarmed", GAR: "disarmed"}},
                {"id": "stay", "name": "Stay", "icon": "mdi:home", "targets": {GF: "armed_home", UP: "disarmed", GAR: "armed_away"}},
                {"id": "sleep", "name": "Sleep", "icon": "mdi:weather-night", "targets": {GF: "armed_night", UP: "armed_night", GAR: "armed_away"},
                 "readiness": {"entities": ["binary_sensor.front_door", "binary_sensor.back_door"], "action": "block"}},
                {"id": "away", "name": "Away", "icon": "mdi:car", "targets": {GF: "armed_away", UP: "armed_away", GAR: "armed_away"},
                 "enter_sources": ["manual", "automation", "presence_away", "lock", "timer", "schedule"]},
                {"id": "guest", "name": "Guest", "icon": "mdi:account-group", "targets": {GF: "disarmed", UP: "disarmed", GAR: "armed_away"},
                 "timers": [{"after_minutes": 240, "then": "previous", "notify": True}]},
            ],
            "current": "disarmed",
            "history": [
                {"at": "2026-10-25T21:30:00-05:00", "from": "disarmed", "to": "stay", "source": "schedule", "result": "changed"},
                {"at": "2026-10-26T06:50:00-05:00", "from": "stay", "to": "disarmed", "source": "schedule", "result": "changed"},
            ],
        }
    )
    await ext.house.async_set_mode("disarmed", "manual", force=True)
    await hass.async_block_till_done()
    locks = ext.locks
    fake = FakeLock()
    locks.reader, locks.writer = fake.read, fake.write
    users = ext.coordinator.store.async_get_users()
    by_name = {u["name"]: uid for uid, u in users.items()}
    await locks.async_import(FRONT, [{"slot": 1}, {"slot": 2}, {"slot": 3, "name": "Dog Walker"}, {"slot": 5, "name": "Cleaner"}])
    await locks.async_import(BACK, [{"slot": 1}, {"slot": 2}])
    s = locks.settings
    s["actions"].update(
        {
            by_name["Alex"]: {"unlock": {"house_mode": "disarmed", "targets": {}}},
            by_name["Sam"]: {"unlock": {"house_mode": "disarmed", "targets": {}}},
        }
    )
    await locks.async_save(s)
    await ext.backups.async_create("before-migration")
    await ext.backups.async_create("pre-save")

    # some recorded activity
    rec = ext.recorder
    await rec.async_save_settings({"window_s": 15})
    t0 = time.time()
    rec.add("house", "House Mode Selector: Disarmed → Stay", starter=True, cause="automation: House Modes - Time")
    rec.add("alarmo", "Alarmo Ground Floor: disarmed → arming", cause="automation: House Modes 1")
    rec.add("link", "[shadow] Alarmo armed_home → physical panel: service alarm_arm_home (try 1/1)")
    rec.add("bypass", "bypassed on the panel: binary_sensor.vista_zone_11 · mirrors holding open: binary_sensor.vista_zone_11")
    rec.add("panel", "Vista Partition 1: disarmed → arming")
    rec.add("link", "[shadow] physical panel started arming after 1 s")
    rec.add("keypad", "Keypad: ARMED ***STAY*** ZONE BYPASSED")
    rec.add("panel", "Vista Partition 1: arming → armed_home")
    rec.add("link", "[shadow] physical panel is armed_home after 30 s")
    rec.current["start"] = t0 - 3600
    for e in rec.current["entries"]:
        e["dt"] = round(e["dt"] + {"alarmo": 0.4, "link": 0.4, "bypass": 2.5, "panel": 2.6, "keypad": 3.0}.get(e["kind"], 0), 1)
    rec.current["entries"][-2]["dt"] = 31.8
    rec.current["entries"][-1]["dt"] = 31.8
    rec._last_event = 0
    await advance_time(hass, 30)
    await hass.async_block_till_done()
    rec.add("lock", "Keypad unlock operation · Front Door Lock · slot 1 (Alex)", starter=True)
    rec.add("lock", "keypad action for Alex: House Mode disarmed")
    rec.add("house", "House Mode Selector: Stay → Disarmed", cause="automation: Door Lock Activity")
    rec.add("alarmo", "Alarmo Ground Floor: armed_home → disarmed")
    rec.add("panel", "Vista Partition 1: armed_home → disarmed")
    rec.add("bypass", "panel bypasses cleared (BYPASS indicator off)")
    for e, d in zip(rec.current["entries"], [0, 0.1, 0.4, 0.4, 1.6, 2.4, 2.5]):
        e["dt"] = d
    rec._last_event = 0
    await advance_time(hass, 30)
    await hass.async_block_till_done()
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    store = ext.coordinator.store
    ws: dict[str, Any] = {
        "alarmo/config": store.async_get_config(),
        "alarmo/areas": store.async_get_areas(),
        "alarmo/sensors": store.async_get_sensors(),
        "alarmo/users": {k: {**v, "code": "x"} for k, v in store.async_get_users().items()},
        "alarmo/automations": store.async_get_automations(),
        "alarmo/sensor_groups": store.async_get_sensor_groups(),
        "alarmo/entities": [{"entity_id": e.entity_id, "area_id": a} for a, e in hass.data["alarmo"]["areas"].items()],
    }
    i = 1
    for t in [
        "alarmo/ext/info", "alarmo/ext/status", "alarmo/ext/why", "alarmo/ext/house/get", "alarmo/ext/house/locks",
        "alarmo/ext/panel/get", "alarmo/ext/panel/log", "alarmo/ext/rules/list", "alarmo/ext/rules/preview",
        "alarmo/ext/backup/list", "alarmo/ext/locks/get", "alarmo/ext/locks/legacy", "alarmo/ext/activity/get",
        "config/area_registry/list", "config/floor_registry/list", "config/label_registry/list",
    ]:
        i += 1
        try:
            ws[t] = await _ws(client, i, type=t)
        except AssertionError:
            ws[t] = []
    for lock in (FRONT, BACK):
        i += 1
        ws[f"alarmo/ext/locks/read|{lock}"] = await _ws(client, i, type="alarmo/ext/locks/read", entity_id=lock)
    for uid in store.async_get_users():
        i += 1
        ws[f"alarmo/ext/locks/user|{uid}"] = await _ws(client, i, type="alarmo/ext/locks/user", user_id=uid)
    for day in ws["alarmo/ext/activity/get"]["days"]:
        i += 1
        ws[f"alarmo/ext/activity/day|{day}"] = await _ws(client, i, type="alarmo/ext/activity/day", day=day)
    states = {
        s.entity_id: {"entity_id": s.entity_id, "state": s.state, "attributes": dict(s.attributes),
                      "last_changed": s.last_changed.isoformat(), "last_updated": s.last_updated.isoformat(), "context": {"id": "x"}}
        for s in hass.states.async_all()
    }
    for k, st in states.items():
        if k.startswith("alarm_control_panel.") and "friendly_name" not in st["attributes"]:
            st["attributes"]["friendly_name"] = k
    text = json.dumps({"ws": ws, "states": states}, default=str, indent=1).replace(str(tmp_path), "/config")
    OUT.write_text(text)
    assert ws["alarmo/ext/locks/get"]["locks"] and ws["alarmo/ext/activity/get"]["days"]
