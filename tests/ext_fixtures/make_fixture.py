"""Generate the complex Alarmo storage fixture used by the ext tests.

Run from the repo root:  uv run python -m tests.ext_fixtures.make_fixture

The fixture is built with the *upstream* attrs classes (tests/ext_upstream), so it
has exactly the shape a real upstream v1.10.19 install writes to
``.storage/alarmo.storage``. It is committed; regenerate only if upstream changes.
"""

import json
import base64
from pathlib import Path

import attr
import bcrypt

from tests.ext_upstream import store_upstream as up

OUT = Path(__file__).parent / "complex_alarmo.storage.json"

# PINs used by the fixture users (tests check these still authenticate).
USER_CODES = {"Alice": "1234", "Bob": "9876", "Guest": "guest01"}


def _hash(code: str) -> str:
    # Low cost keeps the fixture quick to verify; the format is identical.
    return base64.b64encode(
        bcrypt.hashpw(code.encode(), bcrypt.gensalt(rounds=4))
    ).decode()


def _mode(enabled, exit_time=0, entry_time=0, trigger_time=600):
    return attr.asdict(
        up.ModeEntry(
            enabled=enabled,
            exit_time=exit_time,
            entry_time=entry_time,
            trigger_time=trigger_time,
        )
    )


def build() -> dict:
    """Build the storage envelope."""
    areas = [
        {
            "area_id": "1700000001",
            "name": "Ground Floor",
            "modes": {
                "armed_away": _mode(True, 60, 30, 1800),
                "armed_home": _mode(True, 0, 0, 900),
                "armed_night": _mode(True, 0, 15, 900),
                "armed_vacation": _mode(True, 90, 30, 1800),
                "armed_custom_bypass": _mode(False),
            },
        },
        {
            "area_id": "1700000002",
            "name": "Upstairs",
            "modes": {
                "armed_away": _mode(True, 60, 30, 1800),
                "armed_home": _mode(False),
                "armed_night": _mode(True, 0, 0, 900),
                "armed_vacation": _mode(True, 90, 30, 1800),
                "armed_custom_bypass": _mode(False),
            },
        },
        {
            "area_id": "1700000003",
            "name": "Garage & Outbuildings",
            "modes": {
                "armed_away": _mode(True, 120, 45, 600),
                "armed_home": _mode(True, 0, 30, 600),
                "armed_night": _mode(True, 0, 30, 600),
                "armed_vacation": _mode(True, 120, 45, 600),
                "armed_custom_bypass": _mode(True, 30, 30, 600),
            },
        },
    ]
    areas = [attr.asdict(up.AreaEntry(**a)) for a in areas]

    sensors = []
    all_modes = [
        "armed_away",
        "armed_home",
        "armed_night",
        "armed_vacation",
    ]

    def add(entity_id, area, type_, modes, **kw):
        sensors.append(
            attr.asdict(
                up.SensorEntry(
                    entity_id=entity_id, area=area, type=type_, modes=modes, **kw
                )
            )
        )

    gf, up_, gar = "1700000001", "1700000002", "1700000003"
    for name in ["front", "back", "patio", "side"]:
        add(f"binary_sensor.{name}_door", gf, "door", all_modes)
    for i in range(1, 7):
        add(
            f"binary_sensor.gf_window_{i}",
            gf,
            "window",
            all_modes,
            use_entry_delay=False,
            use_exit_delay=False,
        )
    for room in ["hall", "living", "kitchen", "dining"]:
        add(
            f"binary_sensor.{room}_motion",
            gf,
            "motion",
            ["armed_away", "armed_vacation"],
            allow_open=True,
            auto_bypass=room == "kitchen",
            auto_bypass_modes=["armed_away"] if room == "kitchen" else [],
        )
    for i in range(1, 6):
        add(
            f"binary_sensor.up_window_{i}",
            up_,
            "window",
            ["armed_away", "armed_night", "armed_vacation"],
            use_entry_delay=False,
            use_exit_delay=False,
        )
    for room in ["landing", "bed_1", "bed_2", "bed_3", "office"]:
        add(
            f"binary_sensor.{room}_motion",
            up_,
            "motion",
            ["armed_away", "armed_vacation"],
            allow_open=True,
            enabled=room != "office",
        )
    add(
        "binary_sensor.garage_door",
        gar,
        "door",
        [*all_modes, "armed_custom_bypass"],
        arm_on_close=True,
        entry_delay=60,
    )
    add("binary_sensor.shed_door", gar, "door", all_modes, delay_on=5)
    add(
        "binary_sensor.garage_motion",
        gar,
        "motion",
        ["armed_away", "armed_vacation", "armed_custom_bypass"],
        allow_open=True,
        trigger_unavailable=True,
    )
    add(
        "binary_sensor.driveway_motion",
        gar,
        "motion",
        ["armed_away", "armed_night"],
        allow_open=True,
        delay_on=3,
    )
    for name in ["kitchen_smoke", "hall_smoke", "landing_smoke", "boiler_co"]:
        area = up_ if name.startswith("landing") else gf
        add(
            f"binary_sensor.{name}",
            area,
            "environmental",
            [*all_modes, "armed_custom_bypass"],
            always_on=True,
            use_entry_delay=False,
            use_exit_delay=False,
        )
    add(
        "binary_sensor.utility_leak",
        gf,
        "environmental",
        [],
        always_on=True,
        use_entry_delay=False,
        use_exit_delay=False,
    )
    add(
        "binary_sensor.keypad_tamper",
        gf,
        "tamper",
        all_modes,
        always_on=True,
        use_entry_delay=False,
        use_exit_delay=False,
    )
    add("lock.front_door", gf, "door", ["armed_away", "armed_vacation"])

    users = [
        attr.asdict(
            up.UserEntry(
                user_id="1700000101",
                name="Alice",
                code=_hash(USER_CODES["Alice"]),
                can_arm=True,
                can_disarm=True,
                code_format="number",
                code_length=4,
            )
        ),
        attr.asdict(
            up.UserEntry(
                user_id="1700000102",
                name="Bob",
                code=_hash(USER_CODES["Bob"]),
                can_arm=True,
                can_disarm=True,
                is_override_code=True,
                code_format="number",
                code_length=4,
            )
        ),
        attr.asdict(
            up.UserEntry(
                user_id="1700000103",
                name="Guest",
                code=_hash(USER_CODES["Guest"]),
                can_arm=True,
                can_disarm=False,
                area_limit=[gf],
                code_format="text",
                code_length=7,
            )
        ),
    ]

    automations = [
        {
            "automation_id": "1700000201",
            "type": "notification",
            "name": "Notify on trigger",
            "triggers": [
                {"event": "triggered", "area": None, "modes": []},
            ],
            "actions": [
                {
                    "service": "notify.mobile_app_phone",
                    "entity_id": None,
                    "data": {"title": "Alarm!", "message": "{{open_sensors}}"},
                }
            ],
            "enabled": True,
        },
        {
            "automation_id": "1700000202",
            "type": "action",
            "name": "Siren on trigger (ground floor)",
            "triggers": [
                {"event": "triggered", "area": gf, "modes": ["armed_away"]},
            ],
            "actions": [
                {"service": "switch.turn_on", "entity_id": "switch.siren", "data": {}}
            ],
            "enabled": True,
        },
        {
            "automation_id": "1700000203",
            "type": "action",
            "name": "Lights off when armed away",
            "triggers": [
                {"event": "armed", "area": up_, "modes": ["armed_away"]},
            ],
            "actions": [
                {"service": "light.turn_off", "entity_id": "light.upstairs", "data": {}}
            ],
            "enabled": False,
        },
    ]
    automations = [
        attr.asdict(up.AutomationEntry(**up.parse_automation_entry(a)))
        for a in automations
    ]

    groups = [
        attr.asdict(
            up.SensorGroupEntry(
                group_id="1700000301",
                name="Ground floor motion",
                entities=[
                    "binary_sensor.hall_motion",
                    "binary_sensor.living_motion",
                ],
                timeout=120,
                event_count=2,
            )
        ),
        attr.asdict(
            up.SensorGroupEntry(
                group_id="1700000302",
                name="Bedrooms",
                entities=[
                    "binary_sensor.bed_1_motion",
                    "binary_sensor.bed_2_motion",
                    "binary_sensor.bed_3_motion",
                ],
                timeout=60,
                event_count=2,
            )
        ),
    ]

    config = attr.asdict(
        up.Config(
            code_arm_required=True,
            code_mode_change_required=True,
            code_disarm_required=True,
            code_format="number",
            master=up.MasterConfig(enabled=True, name="House"),
            mqtt=up.MqttConfig(enabled=False),
        )
    )

    data = {
        "config": config,
        "areas": areas,
        "sensors": sensors,
        "users": users,
        "automations": automations,
        "sensor_groups": groups,
    }
    data = json.loads(json.dumps(data))  # plain types (CodeFormat is a StrEnum)
    return {
        "version": up.STORAGE_VERSION_MAJOR,
        "minor_version": up.STORAGE_VERSION_MINOR,
        "key": up.STORAGE_KEY,
        "data": data,
    }


if __name__ == "__main__":
    OUT.write_text(json.dumps(build(), indent=4) + "\n", encoding="utf-8")
    env = json.loads(OUT.read_text())
    print(OUT, "sensors:", len(env["data"]["sensors"]))
