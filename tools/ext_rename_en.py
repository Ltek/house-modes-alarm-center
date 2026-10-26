# ruff: noqa: E501
"""Phase 2.5: rename display terms in the English frontend translation (values only).

Run from the repo root:  python3 tools/ext_rename_en.py
Idempotent: running it twice gives the same result.

Area -> Partition, Sensor -> Zone, Sensor group -> Cross-zone group,
Master -> All partitions, Modes -> Arm Modes; Alarmo vs physical panel.
Keys never change; other languages are not touched.
"""

import re
import json
from pathlib import Path

EN = Path("custom_components/alarmo/frontend/localize/languages/en.json")

# Keys describing physical devices keep the word "sensor".
SKIP_PREFIXES = ("panels.sensors.cards.editor.fields.device_type.choose.",)

# Exact values for keys where a word swap reads badly.
EXACT = {
    "panels.general.cards.general.fields.enable_master.heading": "Enable 'All partitions' panel",
    "panels.general.cards.general.fields.enable_master.description": (
        "Creates an alarm entity for controlling all partitions simultaneously."
    ),
    "panels.general.cards.general.actions.setup_master": "'All partitions' configuration",
    "panels.general.dialogs.edit_master.title": "'All partitions' configuration",
    "panels.general.dialogs.disable_master.title": "Disable 'All partitions'?",
    "panels.general.dialogs.disable_master.description": (
        "Are you sure you want to remove the 'All partitions' alarm entity? It has "
        "{automations} automations, which will be removed with this action."
    ),
    "panels.general.cards.modes.title": "Alarmo Arm Modes",
    "panels.general.cards.modes.description": (
        "Alarmo's arm modes (Away, Home/Stay, Night, Vacation, Custom): which ones each Alarmo partition offers, and Alarmo's exit and entry delays for each. With a physical panel, its own delays still apply to its own zones."
    ),
    "panels.general.cards.areas.description": (
        "Partitions divide the alarm system into parts that are armed separately "
        "(for example a detached garage). Each has its own alarm entity, "
        "alarm_control_panel.<partition name>; most homes need one."
    ),
    "panels.sensors.cards.sensors.table.arm_modes": "Arm Modes",
    "panels.sensors.cards.editor.fields.modes.heading": "Arm Modes",
    "panels.sensors.cards.editor.fields.modes.description": (
        "Arm modes in which this zone is active."
    ),
    "panels.sensors.cards.editor.fields.auto_bypass.modes": "Modes in which the zone may be bypassed",
    "panels.sensors.cards.editor.fields.group.heading": "Cross-zone group",
    "panels.sensors.cards.editor.fields.group.description": (
        "Cross-zone with other zones: several must trigger before the alarm does."
    ),
    "panels.sensors.cards.editor.fields.device_type.heading": "Zone type",
    "panels.sensors.cards.editor.fields.device_type.description": (
        "Choose a zone type to automatically apply appropriate settings."
    ),
    "panels.sensors.cards.editor.actions.setup_groups": "Set up cross-zone groups",
    "panels.sensors.cards.editor.errors.no_modes": (
        "No arm modes are selected in which the zone should be active"
    ),
    "panels.sensors.dialogs.manage_groups.title": "Manage cross-zone groups",
    "panels.sensors.dialogs.manage_groups.description": (
        "In a cross-zone group several zones must trigger within a time period "
        "before the alarm is triggered."
    ),
    "panels.sensors.dialogs.manage_groups.no_items": "No cross-zone groups yet",
    "panels.sensors.dialogs.manage_groups.actions.new_group": "New cross-zone group",
    "panels.sensors.dialogs.create_group.title": "New cross-zone group",
    "panels.sensors.dialogs.create_group.fields.name.description": "Name for the cross-zone group",
    "panels.sensors.dialogs.create_group.fields.sensors.description": (
        "Select the zones which are contained by this group."
    ),
    "panels.sensors.dialogs.edit_group.title": "Edit cross-zone group ''{name}''",
    "panels.actions.cards.new_notification.fields.mode.heading": "Arm Mode",
    "panels.actions.cards.new_action.fields.mode.heading": "Arm Mode",
    "panels.sensors.cards.editor.fields.area.description": (
        "Select the partition which contains this zone."
    ),
    "panels.sensors.cards.editor.errors.no_auto_bypass_modes": (
        "No modes are selected in which the zone may be automatically bypassed"
    ),
    "panels.sensor_table.title": "Zone Assignments",
    "panels.general.cards.areas.table.summary": "This partition contains {summary_sensors}, {summary_automations}.",
}

# Keys added by the ext build (tabs); created if missing.
EXT_KEYS = {
    ("panels", "sensor_table", "title"): "Zone Assignments",
    ("panels", "backup", "title"): "Backup",
    # ext.4 tabs
    ("panels", "partitions", "title"): "Partitions & Arm Modes",
    ("panels", "modes", "title"): "Alarmo Arm Modes",
    ("panels", "notifications", "title"): "Notifications",
    ("panels", "zones", "title"): "Zone Assignments",
    ("panels", "zones_legacy", "title"): "Zones (legacy)",
    # phase 4
    ("panels", "panel", "title"): "Physical Panel",
    # phase 5
    ("panels", "house", "title"): "House Modes",
    ("panels", "why", "title"): "Arm Check",
    ("panels", "activity", "title"): "Activity",
    ("panels", "users_codes", "title"): "Users, Codes, Keypads",
    ("panels", "mirrors", "title"): "Zone Mirrors",
    ("panels", "ha_zones", "title"): "Zone Actions",
    ("panels", "connections", "title"): "Keypads",
}

# Word swaps for everything else (case preserved; whole words only).
WORDS = [
    ("areas", "partitions"),
    ("area", "partition"),
    ("sensors", "zones"),
    ("sensor", "zone"),
]


# ICU argument placeholders like {area} or {sensors} are code, not text: never rename
# them. Plural branches ("one {sensor}") are text and are renamed.
_PLURAL_BRANCH = re.compile(r"(?:zero|one|two|few|many|other|=\d+)\s*$")


def _swap(text: str) -> str:
    for old, new in WORDS:

        def repl(m: re.Match, new: str = new) -> str:
            w = m.group(0)
            start, end = m.start(), m.end()
            if (
                start > 0
                and text[start - 1] == "{"
                and end < len(text)
                and text[end] == "}"
                and not _PLURAL_BRANCH.search(text[: start - 1])
            ):
                return w
            if w.isupper():
                return new.upper()
            if w[0].isupper():
                return new[0].upper() + new[1:]
            return new

        text = re.sub(rf"\b{old}\b", repl, text, flags=re.IGNORECASE)
    return text


def rename(obj, path=""):
    """Return ``obj`` with display values renamed."""
    if isinstance(obj, dict):
        return {k: rename(v, f"{path}.{k}" if path else k) for k, v in obj.items()}
    if not isinstance(obj, str):
        return obj
    if path in EXACT:
        return EXACT[path]
    if path.startswith(SKIP_PREFIXES):
        return obj
    return _swap(obj)


def main() -> None:
    """Rewrite en.json in place, keeping its line endings and indent."""
    with open(EN, encoding="utf-8", newline="") as fh:
        raw = fh.read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    indent = len(re.match(r"\{\r?\n( +)", raw).group(1))
    data = json.loads(raw)
    for (a, b, c), value in EXT_KEYS.items():
        data.setdefault(a, {}).setdefault(b, {})[c] = value
    data = rename(data)
    out = json.dumps(data, indent=indent, ensure_ascii=False).replace("\n", nl)
    if raw.endswith("\n"):
        out += nl
    EN.write_text(out, encoding="utf-8", newline="")


if __name__ == "__main__":
    main()
