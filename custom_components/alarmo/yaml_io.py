"""YAML export, import parsing/validation, diff preview and apply for Alarmo.

Part of the alarmo "ext" additions (sensor table, backup, import/export).

Design rules (upstream compatibility):
* The only thing ever written to ``.storage/alarmo.storage`` is data built from
  the store's own attrs classes, so the file stays exactly what upstream
  v1.10.19 (storage 6.3) itself would write.
* Validation rejects unknown fields, because upstream rebuilds records with
  ``SensorEntry(**sensor)`` etc. and an unknown key fails setup.
* User ``code`` values are bcrypt hashes and are copied as-is (never re-hashed).
"""

from __future__ import annotations

import copy
import json
import hashlib
import logging
from typing import Any
from collections import OrderedDict

import attr
import yaml
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from homeassistant.components.alarm_control_panel import AlarmControlPanelState

from . import const
from .store import (
    STORAGE_KEY,
    STORAGE_VERSION_MAJOR,
    STORAGE_VERSION_MINOR,
    Config,
    AreaEntry,
    ModeEntry,
    UserEntry,
    MqttConfig,
    SensorEntry,
    MasterConfig,
    AutomationEntry,
    MigratableStore,
    SensorGroupEntry,
    parse_automation_entry,
)
from .sensors import SENSOR_TYPES

_LOGGER = logging.getLogger(__name__)

EXPORT_VERSION = 1
# the upstream Alarmo release this build is based on (its storage format is kept)
UPSTREAM_ALARMO = "1.10.19"
SECTIONS = ("config", "areas", "sensors", "users", "automations", "sensor_groups")
RECORD_SECTIONS = ("areas", "sensors", "users", "automations", "sensor_groups")
ID_FIELD = {
    "areas": "area_id",
    "sensors": "entity_id",
    "users": "user_id",
    "automations": "automation_id",
    "sensor_groups": "group_id",
}
MODE_MERGE = "merge"
MODE_REPLACE = "replace"
FORMAT_YAML = "yaml"
FORMAT_STORAGE = "storage"

BLOCKING_ALARM_STATES = {
    *const.ARM_MODES,
    AlarmControlPanelState.ARMING,
    AlarmControlPanelState.PENDING,
    AlarmControlPanelState.TRIGGERED,
}


class ImportValidationError(Exception):
    """Raised when an import file cannot be used. ``errors`` lists the reasons."""

    def __init__(self, errors: list[str]) -> None:
        """Store the list of errors."""
        super().__init__("; ".join(errors))
        self.errors = errors


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------


def plain(obj: Any) -> Any:
    """Return a deep copy using only JSON types (StrEnum -> str)."""
    return json.loads(json.dumps(obj))


def current_data(store) -> dict[str, Any]:
    """Return the store contents exactly as upstream writes them to disk."""
    return plain(store._data_to_save())


def ext_version() -> str:
    """Return the version string of this build."""
    return const.VERSION


# --------------------------------------------------------------------------
# export
# --------------------------------------------------------------------------


def build_export(store, extras: dict | None = None) -> dict[str, Any]:
    """Build the full export document (header + every section + ext settings)."""
    doc = {
        "alarmo_export_version": EXPORT_VERSION,
        "alarmo_version": ext_version(),
        "based_on_alarmo": UPSTREAM_ALARMO,
        "storage_version": f"{STORAGE_VERSION_MAJOR}.{STORAGE_VERSION_MINOR}",
        "exported_at": dt_util.now().isoformat(timespec="seconds"),
        "data": current_data(store),
    }
    if extras is not None:
        # House Modes, physical panel, zone rules, overrides, mirrors, settings
        doc["extras"] = plain(extras)
    return doc


class _Dumper(yaml.SafeDumper):
    """Safe dumper that indents lists under their key (readable diffs)."""

    def increase_indent(self, flow: bool = False, indentless: bool = False):
        """Never write indentless sequences."""
        return super().increase_indent(flow, False)


def dump_yaml(document: dict[str, Any]) -> str:
    """Serialize an export document to YAML (stable key order)."""
    header = (
        "# Alarmo configuration export\n"
        "# Contains hashed user codes - keep this file private.\n"
    )
    return header + yaml.dump(
        document,
        Dumper=_Dumper,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
        width=100,
    )


def storage_envelope(store) -> dict[str, Any]:
    """Return a HA Store envelope for the current data (fallback for backups)."""
    return {
        "version": STORAGE_VERSION_MAJOR,
        "minor_version": STORAGE_VERSION_MINOR,
        "key": STORAGE_KEY,
        "data": current_data(store),
    }


# --------------------------------------------------------------------------
# validation schemas (must match the upstream attrs classes exactly)
# --------------------------------------------------------------------------

_opt_int = vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0)))
_str_or_none = vol.Any(None, str)
_mode_list = [vol.In(const.ARM_MODES)]

MODE_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled"): bool,
        vol.Optional("exit_time"): _opt_int,
        vol.Optional("entry_time"): _opt_int,
        vol.Optional("trigger_time"): _opt_int,
    }
)

AREA_SCHEMA = vol.Schema(
    {
        vol.Required("area_id"): vol.All(vol.Coerce(str), vol.Length(min=1)),
        vol.Required("name"): vol.All(str, vol.Length(min=1)),
        vol.Optional("modes"): {vol.In(const.ARM_MODES): MODE_SCHEMA},
    }
)

SENSOR_FIELDS_SCHEMA = {
    vol.Optional("type"): vol.In(SENSOR_TYPES),
    vol.Optional("modes"): _mode_list,
    vol.Optional("use_exit_delay"): bool,
    vol.Optional("use_entry_delay"): bool,
    vol.Optional("always_on"): bool,
    vol.Optional("arm_on_close"): bool,
    vol.Optional("allow_open"): bool,
    vol.Optional("trigger_unavailable"): bool,
    vol.Optional("auto_bypass"): bool,
    vol.Optional("auto_bypass_modes"): _mode_list,
    vol.Optional("area"): vol.Any(None, vol.Coerce(str)),
    vol.Optional("enabled"): bool,
    vol.Optional("entry_delay"): _opt_int,
    vol.Optional("delay_on"): _opt_int,
}

SENSOR_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"),
        **SENSOR_FIELDS_SCHEMA,
    }
)

USER_SCHEMA = vol.Schema(
    {
        vol.Required("user_id"): vol.All(vol.Coerce(str), vol.Length(min=1)),
        vol.Optional("name"): str,
        vol.Optional("enabled"): bool,
        vol.Optional("code"): str,
        vol.Optional("can_arm"): bool,
        vol.Optional("can_disarm"): bool,
        vol.Optional("is_override_code"): bool,
        vol.Optional("code_format"): str,
        vol.Optional("code_length"): vol.All(vol.Coerce(int), vol.Range(min=0)),
        vol.Optional("area_limit"): [vol.Coerce(str)],
        # legacy key that upstream itself strips on load
        vol.Optional("is_admin"): vol.Any(bool, None),
    }
)

_ALARMO_TRIGGER = vol.Schema(
    {
        vol.Required("event"): str,
        vol.Optional("area"): vol.Any(None, vol.Coerce(str)),
        vol.Optional("modes"): _mode_list,
    }
)
_ENTITY_TRIGGER = vol.Schema(
    {vol.Required("entity_id"): _str_or_none, vol.Optional("state"): _str_or_none}
)
_ACTION = vol.Schema(
    {
        vol.Optional("service"): str,
        vol.Optional("entity_id"): vol.Any(None, str, [str]),
        vol.Optional("data"): vol.Any(None, dict),
    }
)
AUTOMATION_SCHEMA = vol.Schema(
    {
        vol.Required("automation_id"): vol.All(vol.Coerce(str), vol.Length(min=1)),
        vol.Optional("type"): _str_or_none,
        vol.Optional("name"): str,
        vol.Optional("triggers"): [vol.Any(_ALARMO_TRIGGER, _ENTITY_TRIGGER)],
        vol.Optional("actions"): [_ACTION],
        vol.Optional("enabled"): bool,
    }
)

GROUP_SCHEMA = vol.Schema(
    {
        vol.Required("group_id"): vol.All(vol.Coerce(str), vol.Length(min=1)),
        vol.Optional("name"): str,
        vol.Optional("entities"): [str],
        vol.Optional("timeout"): vol.All(vol.Coerce(int), vol.Range(min=0)),
        vol.Optional("event_count"): vol.All(vol.Coerce(int), vol.Range(min=0)),
    }
)

CONFIG_SCHEMA = vol.Schema(
    {
        vol.Optional("code_arm_required"): bool,
        vol.Optional("code_mode_change_required"): bool,
        vol.Optional("code_disarm_required"): bool,
        vol.Optional("code_format"): vol.In(["number", "text"]),
        vol.Optional("disarm_after_trigger"): bool,
        vol.Optional("ignore_blocking_sensors_after_trigger"): bool,
        vol.Optional("master"): vol.Schema(
            {vol.Optional("enabled"): bool, vol.Optional("name"): str}
        ),
        vol.Optional("mqtt"): vol.Schema(
            {
                vol.Optional("enabled"): bool,
                vol.Optional("state_topic"): str,
                vol.Optional("state_payload"): vol.Any(None, dict),
                vol.Optional("command_topic"): str,
                vol.Optional("command_payload"): vol.Any(None, dict),
                vol.Optional("require_code"): bool,
                vol.Optional("event_topic"): str,
            }
        ),
    }
)

SECTION_SCHEMAS = {
    "areas": AREA_SCHEMA,
    "sensors": SENSOR_SCHEMA,
    "users": USER_SCHEMA,
    "automations": AUTOMATION_SCHEMA,
    "sensor_groups": GROUP_SCHEMA,
}

# Which attrs class each schema mirrors (checked by tests so they stay in sync).
SCHEMA_CLASSES = {
    "areas": (AREA_SCHEMA, AreaEntry),
    "sensors": (SENSOR_SCHEMA, SensorEntry),
    "users": (USER_SCHEMA, UserEntry),
    "automations": (AUTOMATION_SCHEMA, AutomationEntry),
    "sensor_groups": (GROUP_SCHEMA, SensorGroupEntry),
    "config": (CONFIG_SCHEMA, Config),
}


def _fmt_path(path: list) -> str:
    out = ""
    for p in path:
        out += f"[{p}]" if isinstance(p, int) else (f".{p}" if out else str(p))
    return out


def _validate_section(name: str, records: Any, errors: list[str]) -> list[dict]:
    if not isinstance(records, list):
        errors.append(f"{name}: must be a list")
        return []
    schema = SECTION_SCHEMAS[name]
    id_field = ID_FIELD[name]
    out, seen = [], set()
    for i, rec in enumerate(records):
        if not isinstance(rec, dict):
            errors.append(f"{name}[{i}]: must be a mapping")
            continue
        label = rec.get(id_field, f"#{i}")
        try:
            clean = schema(rec)
        except vol.MultipleInvalid as err:
            for e in err.errors:
                errors.append(f"{name}[{label}]: {e.msg} @ {_fmt_path(e.path) or '-'}")
            continue
        clean.pop("is_admin", None)
        if clean[id_field] in seen:
            errors.append(f"{name}: duplicate {id_field} '{clean[id_field]}'")
            continue
        seen.add(clean[id_field])
        out.append(clean)
    return out


def validate_data(data: Any, mode: str) -> dict[str, Any]:
    """Validate imported ``data`` sections; return the cleaned (un-defaulted) data.

    Fields absent from a record stay absent, so a merge only touches the fields
    that are actually in the file. Raises ImportValidationError.
    """
    errors: list[str] = []
    if not isinstance(data, dict):
        raise ImportValidationError(["data: must be a mapping"])
    unknown = [k for k in data if k not in SECTIONS]
    if unknown:
        errors.append(f"data: unknown section(s): {', '.join(map(str, unknown))}")
    if mode == MODE_REPLACE:
        missing = [s for s in SECTIONS if s not in data]
        if missing:
            errors.append(
                "replace needs a complete file; missing section(s): "
                + ", ".join(missing)
            )
    clean: dict[str, Any] = {}
    if "config" in data:
        try:
            clean["config"] = CONFIG_SCHEMA(data["config"] or {})
        except vol.MultipleInvalid as err:
            for e in err.errors:
                errors.append(f"config: {e.msg} @ {_fmt_path(e.path) or '-'}")
    for name in RECORD_SECTIONS:
        if name in data:
            clean[name] = _validate_section(name, data[name] or [], errors)
    if errors:
        raise ImportValidationError(errors)
    return clean


# --------------------------------------------------------------------------
# parsing
# --------------------------------------------------------------------------


def _parse_version(text: Any) -> tuple[int, int]:
    try:
        major, _, minor = str(text).partition(".")
        return int(major), int(minor or 1)
    except ValueError as err:
        raise ImportValidationError([f"invalid storage_version '{text}'"]) from err


async def parse_file(content: str) -> dict[str, Any]:  # noqa: PLR0912
    """Parse an export (YAML/JSON) or a raw ``alarmo.storage`` file.

    Returns {"format", "data", "source_version", "exported_at", "alarmo_version"}.
    Older storage versions are migrated with upstream's own migration code.
    """
    if not isinstance(content, str) or not content.strip():
        raise ImportValidationError(["file is empty"])
    try:
        doc = yaml.safe_load(content)  # YAML is a superset of JSON
    except yaml.YAMLError as err:
        raise ImportValidationError([f"not valid YAML/JSON: {err}"]) from err
    if not isinstance(doc, dict):
        raise ImportValidationError(["file does not contain an Alarmo configuration"])

    if doc.get("key") == STORAGE_KEY and "data" in doc:
        fmt = FORMAT_STORAGE
        version = (int(doc.get("version", 0)), int(doc.get("minor_version", 1)))
        meta = {"exported_at": None, "alarmo_version": None}
    elif "alarmo_export_version" in doc:
        fmt = FORMAT_YAML
        try:
            exp_version = int(doc["alarmo_export_version"])
        except (TypeError, ValueError) as err:
            raise ImportValidationError(["invalid alarmo_export_version"]) from err
        if exp_version > EXPORT_VERSION or exp_version < 1:
            raise ImportValidationError(
                [f"export version {exp_version} is not supported by this build"]
            )
        version = _parse_version(doc.get("storage_version", "6.3"))
        meta = {
            "exported_at": str(doc.get("exported_at") or "") or None,
            "alarmo_version": str(doc.get("alarmo_version") or "") or None,
        }
    else:
        raise ImportValidationError(
            ["not an Alarmo export or alarmo.storage file (no header found)"]
        )

    data = doc.get("data")
    if not isinstance(data, dict):
        raise ImportValidationError(["data: must be a mapping"])
    current = (STORAGE_VERSION_MAJOR, STORAGE_VERSION_MINOR)
    if version > current:
        raise ImportValidationError(
            [
                f"file uses storage version {version[0]}.{version[1]}, newer than "
                f"this Alarmo ({current[0]}.{current[1]})"
            ]
        )
    if version < current:
        if version[0] < 1:
            raise ImportValidationError(["unknown storage version"])
        try:
            data = await MigratableStore._async_migrate_func(
                None, version[0], version[1], copy.deepcopy(data)
            )
        except Exception as err:
            raise ImportValidationError(
                [f"could not migrate from storage version {version}: {err}"]
            ) from err

    extras = doc.get("extras") if fmt == FORMAT_YAML else None
    return {
        "format": fmt,
        "data": data,
        "source_version": f"{version[0]}.{version[1]}",
        "extras": extras if isinstance(extras, dict) else None,
        **meta,
    }


# --------------------------------------------------------------------------
# merge / normalize / diff
# --------------------------------------------------------------------------


def _deep_update(base: dict, upd: dict) -> dict:
    out = copy.deepcopy(base)
    for k, v in upd.items():
        if (
            isinstance(v, dict)
            and isinstance(out.get(k), dict)
            and k
            not in (
                "state_payload",
                "command_payload",
            )
        ):
            out[k] = _deep_update(out[k], v)
        else:
            out[k] = copy.deepcopy(v)
    return out


def merge_data(current: dict, imported: dict, mode: str) -> dict:
    """Combine current and imported data (un-normalized result)."""
    if mode == MODE_REPLACE:
        return copy.deepcopy(imported)
    result = copy.deepcopy(current)
    if "config" in imported:
        result["config"] = _deep_update(result.get("config", {}), imported["config"])
    for name in RECORD_SECTIONS:
        if name not in imported:
            continue
        id_field = ID_FIELD[name]
        existing = OrderedDict((r[id_field], r) for r in result.get(name, []))
        for rec in imported[name]:
            rid = rec[id_field]
            upd = rec
            if rid in existing:
                if name == "areas" and "modes" in rec:
                    upd = {
                        **rec,
                        "modes": {**existing[rid].get("modes", {}), **rec["modes"]},
                    }
                existing[rid] = {**existing[rid], **copy.deepcopy(upd)}
            else:
                existing[rid] = copy.deepcopy(rec)
        result[name] = list(existing.values())
    return result


def build_entries(data: dict) -> dict[str, Any]:
    """Build the store's attrs entries from (merged) data, filling defaults."""
    cfg = dict(data.get("config", {}))
    master = MasterConfig(**cfg.pop("master", {}) or {})
    mqtt = MqttConfig(**cfg.pop("mqtt", {}) or {})
    config = Config(**cfg, master=master, mqtt=mqtt)

    areas: OrderedDict[str, AreaEntry] = OrderedDict()
    for a in data.get("areas", []):
        modes = {m: ModeEntry(**(c or {})) for m, c in (a.get("modes") or {}).items()}
        entry = AreaEntry(area_id=str(a["area_id"]), name=a["name"])
        if modes:
            entry = attr.evolve(entry, modes=modes)
        else:
            entry = attr.evolve(entry, modes={m: ModeEntry() for m in entry.modes})
        areas[entry.area_id] = entry
    sensors = OrderedDict(
        (s["entity_id"], SensorEntry(**s)) for s in data.get("sensors", [])
    )
    users = OrderedDict(
        (
            str(u["user_id"]),
            UserEntry(**{k: v for k, v in u.items() if k != "is_admin"}),
        )
        for u in data.get("users", [])
    )
    automations = OrderedDict(
        (str(a["automation_id"]), AutomationEntry(**parse_automation_entry(a)))
        for a in data.get("automations", [])
    )
    groups = OrderedDict(
        (str(g["group_id"]), SensorGroupEntry(**g))
        for g in data.get("sensor_groups", [])
    )
    return {
        "config": config,
        "areas": areas,
        "sensors": sensors,
        "users": users,
        "automations": automations,
        "sensor_groups": groups,
    }


def normalize_data(data: dict) -> dict[str, Any]:
    """Return ``data`` exactly as upstream would save it (defaults filled)."""
    e = build_entries(data)
    return plain(
        {
            "config": attr.asdict(e["config"]),
            "areas": [attr.asdict(x) for x in e["areas"].values()],
            "sensors": [attr.asdict(x) for x in e["sensors"].values()],
            "users": [attr.asdict(x) for x in e["users"].values()],
            "automations": [attr.asdict(x) for x in e["automations"].values()],
            "sensor_groups": [attr.asdict(x) for x in e["sensor_groups"].values()],
        }
    )


def _flatten(d: Any, prefix: str = "") -> dict[str, Any]:
    if isinstance(d, dict) and d:
        out = {}
        for k, v in d.items():
            out.update(_flatten(v, f"{prefix}.{k}" if prefix else str(k)))
        return out
    return {prefix: d}


def _field_changes(section: str, old: dict, new: dict) -> list[dict]:
    fo, fn = _flatten(old), _flatten(new)
    changes = []
    for key in sorted(set(fo) | set(fn)):
        if fo.get(key, "<missing>") != fn.get(key, "<missing>"):
            o, n = fo.get(key), fn.get(key)
            if section == "users" and key == "code":
                o = "(code set)" if o else "(no code)"
                n = "(code set)" if n else "(no code)"
                if o == n:
                    n = "(code changed)"
            changes.append({"field": key, "old": o, "new": n})
    return changes


def _label(section: str, rec: dict, hass: HomeAssistant | None, areas: dict) -> str:
    if section == "areas":
        return rec.get("name") or rec["area_id"]
    if section == "sensors":
        state = hass.states.get(rec["entity_id"]) if hass else None
        name = state.attributes.get("friendly_name") if state else None
        return f"{name} ({rec['entity_id']})" if name else rec["entity_id"]
    if section in ("users", "automations", "sensor_groups"):
        return rec.get("name") or str(rec[ID_FIELD[section]])
    return section


def diff_data(current: dict, new: dict, hass: HomeAssistant | None = None) -> dict:
    """Return a per-section added / changed / removed diff of two normalized dicts."""
    areas = {a["area_id"]: a for a in new.get("areas", [])}
    sections: dict[str, Any] = {}
    cfg_changes = _field_changes(
        "config", current.get("config", {}), new.get("config", {})
    )
    sections["config"] = {
        "added": [],
        "removed": [],
        "changed": [
            {"id": "config", "label": "General settings", "fields": cfg_changes}
        ]
        if cfg_changes
        else [],
    }
    for name in RECORD_SECTIONS:
        id_field = ID_FIELD[name]
        old_by = {r[id_field]: r for r in current.get(name, [])}
        new_by = {r[id_field]: r for r in new.get(name, [])}
        added = [
            {"id": rid, "label": _label(name, r, hass, areas)}
            for rid, r in new_by.items()
            if rid not in old_by
        ]
        removed = [
            {"id": rid, "label": _label(name, r, hass, areas)}
            for rid, r in old_by.items()
            if rid not in new_by
        ]
        changed = []
        for rid, r in new_by.items():
            if rid in old_by and old_by[rid] != r:
                changed.append(
                    {
                        "id": rid,
                        "label": _label(name, r, hass, areas),
                        "fields": _field_changes(name, old_by[rid], r),
                    }
                )
        sections[name] = {"added": added, "changed": changed, "removed": removed}
    return sections


def check_references(  # noqa: PLR0912
    new: dict, hass: HomeAssistant | None
) -> tuple[list, list]:
    """Return (errors, warnings) for the resulting configuration."""
    errors: list[str] = []
    warnings: list[str] = []
    area_ids = {a["area_id"] for a in new.get("areas", [])}
    if not area_ids:
        errors.append("the configuration must contain at least one area")
    for s in new.get("sensors", []):
        if s.get("area") not in area_ids:
            errors.append(
                f"sensor {s['entity_id']} refers to area '{s.get('area')}' "
                "which does not exist"
            )
        if hass and hass.states.get(s["entity_id"]) is None:
            warnings.append(
                f"sensor {s['entity_id']} does not exist in Home Assistant (yet)"
            )
    sensor_ids = {s["entity_id"] for s in new.get("sensors", [])}
    seen: dict[str, str] = {}
    for g in new.get("sensor_groups", []):
        for ent in g.get("entities", []):
            if ent not in sensor_ids:
                warnings.append(
                    f"sensor group '{g.get('name')}' contains unknown sensor {ent}"
                )
            if ent in seen:
                warnings.append(f"sensor {ent} is in more than one group")
            seen[ent] = g["group_id"]
    names: set[str] = set()
    for u in new.get("users", []):
        for a in u.get("area_limit", []):
            if a not in area_ids:
                warnings.append(
                    f"user '{u.get('name')}' is limited to unknown area '{a}'"
                )
        if u.get("name") in names:
            warnings.append(f"more than one user is called '{u.get('name')}'")
        names.add(u.get("name"))
    for a in new.get("automations", []):
        for t in a.get("triggers", []):
            if t.get("area") not in (None, *area_ids):
                warnings.append(
                    f"action '{a.get('name')}' refers to unknown area '{t.get('area')}'"
                )
    return errors, warnings


def preview_token(current: dict, new: dict) -> str:
    """Fingerprint of (current, result); apply refuses if it no longer matches."""
    blob = json.dumps([current, new], sort_keys=True).encode()
    return hashlib.sha256(blob).hexdigest()[:32]


async def build_preview(
    hass: HomeAssistant | None, store, content: str, mode: str
) -> dict[str, Any]:
    """Parse + validate + merge an import, returning the preview (no changes)."""
    if mode not in (MODE_MERGE, MODE_REPLACE):
        raise ImportValidationError([f"unknown mode '{mode}'"])
    parsed = await parse_file(content)
    imported = validate_data(parsed["data"], mode)
    current = current_data(store)
    try:
        new = normalize_data(merge_data(current, imported, mode))
    except (TypeError, ValueError, KeyError) as err:
        raise ImportValidationError([f"could not build configuration: {err}"]) from err
    errors, warnings = check_references(new, hass)
    sections = diff_data(current, new, hass)
    summary = {
        name: {k: len(v) for k, v in sec.items()} for name, sec in sections.items()
    }
    total = sum(sum(v.values()) for v in summary.values())
    return {
        "extras": parsed["extras"],
        "format": parsed["format"],
        "source_version": parsed["source_version"],
        "exported_at": parsed["exported_at"],
        "alarmo_version": parsed["alarmo_version"],
        "mode": mode,
        "sections": sections,
        "summary": summary,
        "total_changes": total,
        "errors": errors,
        "warnings": warnings,
        "token": preview_token(current, new),
        "_new": new,  # stripped before sending to the client
    }


def blocking_alarm_entities(hass: HomeAssistant) -> list[str]:
    """Return alarm entities whose state blocks an import/restore."""
    domain_data = hass.data.get(const.DOMAIN) or {}
    entities = list((domain_data.get("areas") or {}).values())
    if domain_data.get("master"):
        entities.append(domain_data["master"])
    blocked = []
    for ent in entities:
        state = getattr(ent, "alarm_state", None)
        if state in BLOCKING_ALARM_STATES:
            blocked.append(f"{ent.entity_id} ({state})")
    return blocked


async def write_data(store, new: dict) -> None:
    """Replace the store contents with normalized ``new`` data and save now."""
    entries = build_entries(new)
    store.config = entries["config"]
    store.areas = entries["areas"]
    store.sensors = entries["sensors"]
    store.users = entries["users"]
    store.automations = entries["automations"]
    store.sensor_groups = entries["sensor_groups"]
    await store.async_save()
    written = current_data(store)
    if written != new:  # pragma: no cover - defensive, should be impossible
        _LOGGER.error("Alarmo import: written data differs from preview")
