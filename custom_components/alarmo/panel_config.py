"""Panel link: pure configuration + command building (no Home Assistant objects).

A "link" connects one Alarmo alarm entity (a partition, or "All partitions") to a
physical alarm panel entity (e.g. an Envisalink partition). See panel_link.py for the
runtime side.
"""

from __future__ import annotations

import re
import copy
from typing import Any

import voluptuous as vol

LINK_MODES = ("off", "shadow", "live")
METHODS = ("service", "keypress", "none")
TRIP_POLICIES = ("panel", "notify", "none")
TRIP_METHODS = ("siren", "relay", "panic", "none")
HOLD_MODES = ("last", "unknown")
FAILURE_POLICIES = ("disarm", "keep")
PANEL_TYPES = ("generic", "envisalink")
MASTER_KEY = "master"

ALARM_STATES = (
    "armed_away",
    "armed_home",
    "armed_night",
    "armed_vacation",
    "armed_custom_bypass",
    "disarmed",
)
SERVICE_FOR = {
    "armed_away": "alarm_arm_away",
    "armed_home": "alarm_arm_home",
    "armed_night": "alarm_arm_night",
    "armed_vacation": "alarm_arm_vacation",
    "armed_custom_bypass": "alarm_arm_custom_bypass",
    "disarmed": "alarm_disarm",
}

_command = vol.Schema(
    {
        vol.Required("method"): vol.In(METHODS),
        vol.Optional("keys", default=""): vol.All(str, vol.Length(max=40)),
        vol.Required("accept"): [vol.In((*ALARM_STATES, "triggered"))],
        vol.Required("timeout"): vol.All(vol.Coerce(int), vol.Range(min=5, max=300)),
    }
)
_delays = vol.Schema(
    {
        vol.Optional("entry"): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=0, max=600))
        ),
        vol.Optional("exit"): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=0, max=600))
        ),
    }
)

ARM_ORDERS = ("panel_leads", "after_alarmo")
ARMED_STATES = ("armed_away", "armed_home", "armed_night", "armed_vacation", "armed_custom_bypass")


def exit_time_plan(link: dict, area_modes: dict, extra: int = 3) -> dict[str, int]:
    """Alarmo exit time per Arm Mode so it ends with the panel's learned exit delay (+ ``extra`` s).

    Only modes that are enabled, sent to the panel, and whose panel state has a learned delay.
    """
    out: dict[str, int] = {}
    learned = link.get("learned_exit_delay") or {}
    for mode, mcfg in area_modes.items():
        cmd = (link.get("commands") or {}).get(mode)
        if not mcfg.get("enabled") or not cmd or cmd.get("method") == "none":
            continue
        secs = max([learned.get(a, 0) for a in cmd.get("accept") or []] or [0])
        if secs:
            out[mode] = secs + extra
    return out


def follow_mode(cfg: dict, panel_state: str) -> str:
    """Alarmo Arm Mode that follows the panel arming in ``panel_state``."""
    return (cfg.get("follow_map") or {}).get(panel_state, panel_state)


def mode_from_keypad(text: str | None) -> str | None:
    """Panel arm mode from a Vista keypad display while it counts down ("ARMED ***AWAY*** You may exit now")."""
    t = (text or "").upper()
    if "AWAY" in t or "MAX" in t:
        return "armed_away"
    if "NIGHT" in t:
        return "armed_night"
    if "INSTANT" in t or "STAY" in t:
        return "armed_home"
    return None


LINK_SCHEMA = vol.Schema(
    {
        vol.Required("panel_entity"): vol.Match(r"^alarm_control_panel\.[a-z0-9_]+$"),
        vol.Optional("mode", default="shadow"): vol.In(LINK_MODES),
        vol.Optional("panel_type", default="generic"): vol.In(PANEL_TYPES),
        vol.Optional("follow_panel", default=True): bool,
        vol.Optional("retries", default=3): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=10)
        ),
        vol.Optional("retry_delay", default=5): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=120)
        ),
        vol.Optional("failure_policy", default="disarm"): vol.In(FAILURE_POLICIES),
        vol.Optional("bypass_keys", default="{code}6{zone}"): vol.All(
            str, vol.Length(max=40)
        ),
        vol.Optional("commands", default={}): {vol.In(ALARM_STATES): _command},
        vol.Optional("delays", default={}): {vol.In(ALARM_STATES): _delays},
        vol.Optional("learned_exit_delay", default={}): {
            vol.In(ALARM_STATES): vol.Coerce(int)
        },
        # "panel_leads": send to the panel the moment Alarmo starts arming; Alarmo counts as armed once the panel is.
        # "after_alarmo": send when Alarmo is armed (before ext.27).
        vol.Optional("arm_order", default="panel_leads"): vol.In(ARM_ORDERS),
        # seconds after the expected end of the exit delay before arming counts as failed
        vol.Optional("confirm_margin", default=10): vol.All(vol.Coerce(int), vol.Range(min=0, max=120)),
        # arming at the panel (keypad, app): which Alarmo Arm Mode follows each panel state
        vol.Optional("follow_map", default={}): {vol.In(ARMED_STATES): vol.In(ARMED_STATES)},
    }
)

TRIP_SCHEMA = vol.Schema(
    {
        vol.Optional("method", default="siren"): vol.In(TRIP_METHODS),
        vol.Optional("entity"): vol.Any(
            None, vol.Match(r"^(siren|switch)\.[a-z0-9_]+$")
        ),
        vol.Optional("panic_method", default="service"): vol.In(
            ("service", "keypress")
        ),
        vol.Optional("panic_keys", default=""): vol.All(str, vol.Length(max=20)),
    }
)

SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("links", default={}): {
            vol.All(str, vol.Length(min=1)): LINK_SCHEMA
        },
        vol.Optional("monitored", default=False): bool,
        vol.Optional("notify_service"): vol.Any(
            None, vol.Match(r"^notify\.[a-z0-9_]+$")
        ),
        vol.Optional("trip", default={}): TRIP_SCHEMA,
        vol.Optional("zone_trip", default={}): {str: vol.In(TRIP_POLICIES)},
        vol.Optional("mirrors", default={}): {
            vol.Match(r"^binary_sensor\.[a-z0-9_]+$"): vol.Schema(
                {vol.Optional("hold", default="last"): vol.In(HOLD_MODES)}
            )
        },
        # helper that means "zones are bypassed" while on (e.g. input_boolean.bypass_alarm_zones): mirrors hold
        vol.Optional("bypass_entity", default=None): vol.Any(
            None, vol.Match(r"^(input_boolean|switch|binary_sensor)\.[a-z0-9_]+$")
        ),
        # panel zones the user does not want in Alarmo (not offered by "Add all")
        vol.Optional("ignored_zones", default=[]): [vol.Match(r"^binary_sensor\.[a-z0-9_]+$")],
    }
)


def default_commands(panel_type: str) -> dict[str, dict]:
    """Commands to send for each Alarmo state (Envisalink: Vista key sequences)."""
    svc = lambda accept, timeout: {  # noqa: E731
        "method": "service",
        "keys": "",
        "accept": accept,
        "timeout": timeout,
    }
    out = {
        "armed_away": svc(["armed_away"], 20),
        "armed_home": svc(["armed_home", "armed_night", "armed_custom_bypass"], 35),
        "armed_night": svc(["armed_night", "armed_custom_bypass"], 35),
        "armed_vacation": svc(["armed_vacation", "armed_away"], 20),
        "armed_custom_bypass": svc(["armed_custom_bypass", "armed_home"], 35),
        "disarmed": svc(["disarmed"], 20),
    }
    if panel_type == "envisalink":
        # Vista: 4 = Max (away, no entry delay); 7 = Instant (stay, no entry delay)
        out["armed_vacation"] = {
            **out["armed_vacation"],
            "method": "keypress",
            "keys": "{code}4",
        }
        out["armed_custom_bypass"] = {
            **out["armed_custom_bypass"],
            "method": "keypress",
            "keys": "{code}7",
        }
    return out


def normalize_settings(raw: dict | None) -> dict[str, Any]:
    """Validate stored settings and fill per-link command defaults."""
    data = SETTINGS_SCHEMA(copy.deepcopy(raw or {}))
    for link in data["links"].values():
        cmds = default_commands(link["panel_type"])
        cmds.update(link["commands"])
        link["commands"] = cmds
    return data


def render_keys(template: str, code: str | None, zone: int | None = None) -> str:
    """Fill {code} and {zone} (two digits) in a key template."""
    if "{code}" in template and not code:
        raise ValueError("this key sequence needs the panel code ({code})")
    out = template.replace("{code}", code or "")
    if "{zone}" in out:
        if zone is None:
            raise ValueError("this key sequence needs a zone number ({zone})")
        out = out.replace("{zone}", f"{int(zone):02d}")
    return out


def mask_code(text: str, code: str | None) -> str:
    """Hide the code in log text."""
    return text.replace(code, "*" * len(code)) if code else text


def zone_number(attributes: dict) -> int | None:
    """Panel zone number from a zone entity's attributes (Envisalink: 'zone')."""
    z = attributes.get("zone")
    try:
        return int(z) if z is not None else None
    except (TypeError, ValueError):
        return None


def trip_policy(entity_id: str, settings: dict) -> str:
    """What an HA-only zone trip does: per-zone exception, else the default."""
    exc = settings.get("zone_trip", {}).get(entity_id)
    if exc:
        return exc
    return "notify" if settings.get("monitored") else "panel"


def mirror_object_id(source_entity: str) -> str:
    """binary_sensor.alarm_zone_9 -> alarm_zone_9_mirror."""
    return re.sub(r"^binary_sensor\.", "", source_entity) + "_mirror"
