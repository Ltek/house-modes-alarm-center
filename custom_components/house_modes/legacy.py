"""Names from Alarmo (and the Alarmo-based build of this integration) and what they are called now.

Used by the one-time import (alarmo_import.py) on the imported data, and by the reference scan (references.py) on
automations, scripts and dashboards. Only exact, known names are rewritten: a user's own entity whose id happens to
contain "alarmo" (e.g. ``input_boolean.alarmo_change_away``) is left alone.
"""

from __future__ import annotations

import re
from typing import Any

from .const import DOMAIN

OLD_DOMAIN = "alarmo"

SERVICES = ("arm", "disarm", "skip_delay", "enable_user", "disable_user", "create_backup", "set_house_mode",
            "panel_keypress")
EVENTS = ("command_success", "failed_to_arm", "ready_to_arm_modes_updated", "house_mode_changed", "house_mode_failed",
          "house_mode_blocked", "keypad_used", "ext_panel", "ext_rules_pending")
PUSH_ACTIONS = ("FORCE_ARM", "RETRY_ARM", "DISARM", "ARM_AWAY", "ARM_HOME", "ARM_NIGHT", "ARM_VACATION",
                "ARM_CUSTOM_BYPASS")
OLD_SELECT = "select.alarmo_house_mode"
NEW_SELECT = "select.house_mode"
OLD_CARD = "custom:alarmo-card"

_B = r"(?<![A-Za-z0-9_])"  # not inside a longer name
_E = r"(?![A-Za-z0-9_])"

# (pattern, replacement, what it is) - applied in this order
RULES: list[tuple[re.Pattern, str, str]] = [
    (re.compile(_B + re.escape(OLD_SELECT) + _E), NEW_SELECT, "House Mode select"),
    (re.compile(_B + OLD_DOMAIN + r"\.(" + "|".join(SERVICES) + ")" + _E), DOMAIN + r".\1", "service"),
    (re.compile(_B + OLD_DOMAIN + r"_(" + "|".join(EVENTS) + ")" + _E), DOMAIN + r"_\1", "event"),
    (re.compile(_B + r"ALARMO_(" + "|".join(PUSH_ACTIONS) + ")" + _E), r"HOUSE_MODES_\1", "notification action"),
    # a service split into domain + service (e.g. "domain: alarmo" next to "service: arm") is handled by
    # rewrite_data(), which sees the whole mapping
]
# stored setting values that were renamed
VALUES = {"after_alarmo": "after_alarm"}


def rewrite_text(text: str) -> tuple[str, list[tuple[str, str, str]]]:
    """Rewrite known old names in a string. Returns (new text, [(old, new, kind)])."""
    found: list[tuple[str, str, str]] = []
    for pattern, repl, kind in RULES:

        def _sub(m: re.Match, repl=repl, kind=kind) -> str:
            new = m.expand(repl)
            found.append((m.group(0), new, kind))
            return new

        text = pattern.sub(_sub, text)
    return text, found


def rewrite_data(obj: Any, found: list | None = None) -> Any:
    """A deep copy of JSON-like data with known old names rewritten (strings only, keys kept)."""
    if found is None:
        found = []
    if isinstance(obj, str):
        if obj in VALUES:
            found.append((obj, VALUES[obj], "setting"))
            return VALUES[obj]
        new, hits = rewrite_text(obj)
        found.extend(hits)
        return new
    if isinstance(obj, list):
        return [rewrite_data(v, found) for v in obj]
    if isinstance(obj, dict):
        out = {k: rewrite_data(v, found) for k, v in obj.items()}
        # {"domain": "alarmo", "service": "arm"} (Alarm Event actions, script steps)
        if out.get("domain") == OLD_DOMAIN and out.get("service") in SERVICES:
            out["domain"] = DOMAIN
            found.append((f"{OLD_DOMAIN} (domain)", DOMAIN, "service"))
        return out
    return obj


def old_entries(hass) -> list:
    """Config entries of the old ``alarmo`` integration (upstream Alarmo or the Alarmo-based build)."""
    return list(hass.config_entries.async_entries(OLD_DOMAIN))


def old_alarmo_active(hass) -> bool:
    """True while an ``alarmo`` entry is enabled (loaded, or about to load at start-up).

    The two must never run together (double arming, double keypresses to the panel): while this is true the panel
    link stays in Shadow and entity ids are not taken over. A disabled entry, or one that failed to set up, does not
    count.
    """
    from homeassistant.config_entries import ConfigEntryState  # noqa: PLC0415

    failed = {ConfigEntryState.SETUP_ERROR, ConfigEntryState.MIGRATION_ERROR, ConfigEntryState.FAILED_UNLOAD}
    return any(e.disabled_by is None and e.state not in failed for e in old_entries(hass))


def old_entry_info(hass) -> list[dict[str, Any]]:
    """What the panel shows about the old entries."""
    return [
        {
            "entry_id": e.entry_id,
            "title": e.title,
            "state": str(e.state.value) if hasattr(e.state, "value") else str(e.state),
            "disabled": e.disabled_by is not None,
        }
        for e in old_entries(hass)
    ]
