"""Validate / merge the ext settings (``alarmo_extras``) for import and restore."""

from __future__ import annotations

import copy
import json
import hashlib
from typing import Any

import voluptuous as vol

from .recorder import normalize as normalize_recorder
from .lock_codes import normalize as normalize_locks
from .zone_rules import RULE_SCHEMA, OVERRIDE_FIELDS_SCHEMA
from .extras_store import MAX_RETENTION_DAYS
from .house_config import STATE_KEYS
from .house_config import normalize as normalize_house
from .panel_config import normalize_settings as normalize_panel

SECTIONS = ("panel", "house", "rules", "overrides", "retention_days", "ui", "locks", "recorder")
LABELS = {
    "panel": "Physical panel, zone actions and mirrors",
    "house": "House Modes and keypads",
    "rules": "Zone rules",
    "overrides": "Zone rule overrides",
    "retention_days": "Backup retention",
    "ui": "Page options",
    "locks": "Lock codes and keypad actions",
    "recorder": "Activity log settings",
}


def clean_extras(raw: Any) -> tuple[dict[str, Any], list[str]]:
    """Validated extras sections from a file; returns (clean, errors). Unknown keys ignored."""
    if raw is None:
        return {}, []
    if not isinstance(raw, dict):
        return {}, ["extras: must be a mapping"]
    out: dict[str, Any] = {}
    errors: list[str] = []
    try:
        if "panel" in raw:
            out["panel"] = normalize_panel(raw["panel"])
        if "house" in raw:
            out["house"] = normalize_house(raw["house"])
        if "rules" in raw:
            out["rules"] = [RULE_SCHEMA(r) for r in raw["rules"] or []]
        if "overrides" in raw:
            out["overrides"] = {
                str(k): OVERRIDE_FIELDS_SCHEMA(v)
                for k, v in (raw["overrides"] or {}).items()
            }
        if "retention_days" in raw:
            out["retention_days"] = vol.All(
                vol.Coerce(int), vol.Range(min=0, max=MAX_RETENTION_DAYS)
            )(raw["retention_days"])
        if "locks" in raw:
            out["locks"] = normalize_locks(raw["locks"])
        if "recorder" in raw:
            out["recorder"] = normalize_recorder(raw["recorder"])
        if "ui" in raw:
            out["ui"] = vol.Schema({str: bool})(raw["ui"] or {})
    except (vol.Invalid, TypeError, ValueError) as err:
        errors.append(f"extras: {err}")
    return out, errors


def merge_extras(current: dict, incoming: dict, mode: str) -> dict[str, Any]:
    """New extras after an import. House Mode runtime state always stays as it is now."""
    new = copy.deepcopy(current)
    for key, value in incoming.items():
        if mode == "merge" and key == "rules":
            by_id = {r.get("id"): r for r in new.get("rules") or []}
            for r in value:
                by_id[r.get("id")] = r
            new["rules"] = list(by_id.values())
        elif mode == "merge" and key == "overrides":
            new["overrides"] = {**(new.get("overrides") or {}), **value}
        else:
            new[key] = copy.deepcopy(value)
    if "house" in incoming:
        cur_house = normalize_house(current.get("house"))
        for k in STATE_KEYS:
            new["house"][k] = copy.deepcopy(cur_house[k])
    return new


def summary(current: dict, new: dict) -> list[dict[str, str]]:
    """Which ext sections an import changes."""
    out = []
    norm, _ = clean_extras({k: v for k, v in current.items() if k in SECTIONS})
    current = {**current, **norm}
    for key in SECTIONS:
        a = json.dumps(current.get(key), sort_keys=True, default=str)
        b = json.dumps(new.get(key), sort_keys=True, default=str)
        if a != b:
            out.append({"key": key, "label": LABELS[key]})
    return out


def token(extras: dict) -> str:
    """Fingerprint for the preview token."""
    return hashlib.sha256(
        json.dumps(extras, sort_keys=True, default=str).encode()
    ).hexdigest()[:16]
