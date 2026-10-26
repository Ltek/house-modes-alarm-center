"""Phase 4: panel link configuration (pure)."""

import pytest
import voluptuous as vol

from custom_components.alarmo.panel_config import (
    mask_code,
    render_keys,
    trip_policy,
    zone_number,
    default_commands,
    mirror_object_id,
    normalize_settings,
)

LINK = {
    "panel_entity": "alarm_control_panel.alarm_partition_1",
    "panel_type": "envisalink",
}


def test_defaults_filled_and_overridable() -> None:
    """Envisalink defaults use keypresses for Vacation and Custom only."""
    s = normalize_settings({"links": {"master": LINK}})
    link = s["links"]["master"]
    assert (
        link["mode"] == "shadow" and link["retries"] == 3 and link["retry_delay"] == 5
    )
    assert link["failure_policy"] == "disarm"
    c = link["commands"]
    assert c["armed_home"]["method"] == "service" and c["armed_home"]["timeout"] == 35
    assert c["armed_away"]["timeout"] == 20
    assert c["armed_vacation"] == {
        "method": "keypress",
        "keys": "{code}4",
        "accept": ["armed_vacation", "armed_away"],
        "timeout": 20,
    }
    assert c["armed_custom_bypass"]["keys"] == "{code}7"
    custom = {
        **LINK,
        "commands": {
            "armed_home": {
                "method": "keypress",
                "keys": "{code}7",
                "accept": ["armed_home"],
                "timeout": 30,
            }
        },
    }
    s = normalize_settings({"links": {"master": custom}})
    assert s["links"]["master"]["commands"]["armed_home"]["keys"] == "{code}7"
    assert s["links"]["master"]["commands"]["armed_away"]["method"] == "service"
    assert default_commands("generic")["armed_vacation"]["method"] == "service"


@pytest.mark.parametrize(
    "bad",
    [
        {"links": {"m": {"panel_entity": "light.x"}}},
        {"links": {"m": {**LINK, "mode": "auto"}}},
        {"links": {"m": {**LINK, "retries": 99}}},
        {"zone_trip": {"binary_sensor.x": "explode"}},
        {"notify_service": "light.x"},
        {"trip": {"method": "siren", "entity": "light.x"}},
        {
            "links": {
                "m": {
                    **LINK,
                    "commands": {
                        "armed_home": {"method": "x", "accept": [], "timeout": 10}
                    },
                }
            }
        },
    ],
)
def test_invalid_settings_rejected(bad) -> None:
    """Schema guards every setting."""
    with pytest.raises(vol.Invalid):
        normalize_settings(bad)


def test_render_and_mask() -> None:
    """Keys get the code and a two-digit zone; logs hide the code."""
    assert render_keys("{code}6{zone}", "1234", 9) == "1234609"
    assert render_keys("{code}4", "1234") == "12344"
    assert render_keys("*71", None) == "*71"
    with pytest.raises(ValueError):
        render_keys("{code}3", None)
    with pytest.raises(ValueError):
        render_keys("{code}6{zone}", "1234")
    assert mask_code("1234609", "1234") == "****609"
    assert mask_code("abc", None) == "abc"


def test_zone_number_and_mirror_id() -> None:
    """Helpers for Envisalink zone entities."""
    assert zone_number({"zone": 9}) == 9
    assert zone_number({"zone": "12"}) == 12
    assert zone_number({}) is None
    assert zone_number({"zone": "x"}) is None
    assert mirror_object_id("binary_sensor.alarm_zone_9") == "alarm_zone_9_mirror"


def test_trip_policy_defaults() -> None:
    """HA-only zones set off the panel unless monitored; exceptions win."""
    s = normalize_settings({})
    assert trip_policy("binary_sensor.garage", s) == "panel"
    s = normalize_settings({"monitored": True})
    assert trip_policy("binary_sensor.garage", s) == "notify"
    s = normalize_settings(
        {"monitored": True, "zone_trip": {"binary_sensor.garage": "panel"}}
    )
    assert trip_policy("binary_sensor.garage", s) == "panel"
