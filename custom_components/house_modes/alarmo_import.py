"""One-time import from Alarmo: the first-run choice (Quick Start) and the Backup tab's "Import from Alarmo".

What is read (never written, moved or deleted):

* ``.storage/alarmo.storage`` - partitions, zones, users (code hashes), Alarm Events, sensor groups, settings
  (upstream Alarmo, or the Alarmo-based build of this integration)
* ``.storage/alarmo_extras``  - House Modes, panel link, zone rules, locks, … (the Alarmo-based build only)
* ``/config/alarmo/activity/`` and ``/config/alarmo/backups/`` - copied to ``/config/house_modes/`` (copies; the
  originals stay as they are)

Nothing happens until the user picks **Import** or **Start fresh**. "Start fresh" can be undone later from the Backup
tab while the old files exist. The import refuses while the old ``alarmo`` integration is still enabled: the two must
never run together. Service, event and entity names in the imported data are rewritten (legacy.py). The result goes
into the ``alarm`` and ``extras`` sections of ``.storage/house_modes``; the ``import`` section records the choice.
"""

from __future__ import annotations

import os
import json
import shutil
import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from homeassistant.components import websocket_api
from homeassistant.helpers.storage import Store

from . import legacy, yaml_io, ext_extras_io
from .store import LEGACY_STORAGE_KEY, STORAGE_VERSION_MAJOR, STORAGE_VERSION_MINOR, MigratableStore
from .extras_store import DEFAULTS as EXTRAS_DEFAULTS
from .extras_store import LEGACY_EXTRAS_KEY
from .combined_store import SECTION_IMPORT, async_get_combined

_LOGGER = logging.getLogger(__name__)

DATA_EXT = "house_modes_ext"
OLD_FOLDER = "alarmo"
NEW_FOLDER = "house_modes"
COPY_FOLDERS = ("activity", "backups")
LABEL_PRE_IMPORT = "before-alarmo-import"

CHOICE_IMPORTED = "imported"
CHOICE_FRESH = "fresh"


class ImportBlocked(Exception):
    """The import cannot run now (reason in the message)."""


# ------------------------------------------------------------------ reading the old files (read-only)


async def _read_old(hass: HomeAssistant) -> tuple[dict | None, dict | None]:
    """(alarm data, extras) from the old files, or None for a file that is not there. Never writes."""
    alarm_store = MigratableStore(
        hass, STORAGE_VERSION_MAJOR, LEGACY_STORAGE_KEY, minor_version=STORAGE_VERSION_MINOR, read_only=True
    )
    extras_store: Store = Store(hass, 1, LEGACY_EXTRAS_KEY, read_only=True)
    try:
        alarm = await alarm_store.async_load()
    except Exception:
        _LOGGER.exception("Could not read .storage/%s", LEGACY_STORAGE_KEY)
        alarm = None
    try:
        extras = await extras_store.async_load()
    except Exception:
        _LOGGER.exception("Could not read .storage/%s", LEGACY_EXTRAS_KEY)
        extras = None
    return (alarm if isinstance(alarm, dict) else None), (extras if isinstance(extras, dict) else None)


def _count_files(hass: HomeAssistant) -> dict[str, int]:
    out = {}
    for sub in COPY_FOLDERS:
        path = hass.config.path(OLD_FOLDER, sub)
        try:
            out[sub] = len([f for f in os.listdir(path) if not f.startswith(".")]) if os.path.isdir(path) else 0
        except OSError:
            out[sub] = 0
    return out


def _counts(alarm: dict | None, extras: dict | None) -> dict[str, int]:
    alarm = alarm or {}
    extras = extras or {}
    house = extras.get("house") or {}
    panel = extras.get("panel") or {}
    locks = extras.get("locks") or {}
    return {
        "partitions": len(alarm.get("areas") or []),
        "zones": len(alarm.get("sensors") or []),
        "users": len(alarm.get("users") or []),
        "alarm_events": len(alarm.get("automations") or []),
        "sensor_groups": len(alarm.get("sensor_groups") or []),
        "house_modes": len(house.get("modes") or []),
        "panel_links": len(panel.get("links") or {}),
        "mirrors": len(panel.get("mirrors") or {}),
        "zone_rules": len(extras.get("rules") or []),
        "lock_links": len(locks.get("links") or []),
    }


async def async_detect(hass: HomeAssistant) -> dict[str, Any]:
    """What the old files hold (read-only)."""
    alarm, extras = await _read_old(hass)
    files = await hass.async_add_executor_job(_count_files, hass)
    found = alarm is not None or extras is not None
    return {
        "found": found,
        # "fork": the Alarmo-based build with House Modes (it has alarmo_extras); "alarmo": upstream Alarmo only
        "kind": ("fork" if extras is not None else "alarmo") if found else None,
        "files": {LEGACY_STORAGE_KEY: alarm is not None, LEGACY_EXTRAS_KEY: extras is not None},
        "counts": _counts(alarm, extras),
        "folders": files,
        "old_entries": legacy.old_entry_info(hass),
        "old_active": legacy.old_alarmo_active(hass),
    }


async def async_status(hass: HomeAssistant) -> dict[str, Any]:
    """The recorded choice plus what is found now. ``ask`` = Quick Start opens on the import question."""
    combined = await async_get_combined(hass)
    rec = combined.get(SECTION_IMPORT) or {}
    detect = await async_detect(hass)
    return {
        **detect,
        "choice": rec.get("choice"),
        "at": rec.get("at"),
        "imported": rec.get("imported"),
        "ask": detect["found"] and not rec.get("choice"),
    }


# ------------------------------------------------------------------ copying the folders


def _copy_activity_line(line: str) -> str:
    """Activity entries recorded the alarm's own changes as kind "alarmo"; it is "alarm" now."""
    try:
        seq = json.loads(line)
    except ValueError:
        return line
    if not isinstance(seq, dict):
        return line
    if isinstance(seq.get("kinds"), list):
        seq["kinds"] = ["alarm" if k == "alarmo" else k for k in seq["kinds"]]
    for e in seq.get("entries") or []:
        if isinstance(e, dict) and e.get("kind") == "alarmo":
            e["kind"] = "alarm"
    return json.dumps(seq, separators=(",", ":"), ensure_ascii=False)


def _copy_folders(hass: HomeAssistant) -> dict[str, int]:
    """Copy /config/alarmo/{activity,backups} to /config/house_modes/ (never moves, never overwrites)."""
    copied = {}
    for sub in COPY_FOLDERS:
        src = hass.config.path(OLD_FOLDER, sub)
        dst = hass.config.path(NEW_FOLDER, sub)
        n = 0
        if not os.path.isdir(src):
            copied[sub] = 0
            continue
        os.makedirs(dst, exist_ok=True)
        for name in sorted(os.listdir(src)):
            s, d = os.path.join(src, name), os.path.join(dst, name)
            if os.path.isdir(s):
                if not os.path.exists(d):
                    shutil.copytree(s, d)
                    n += 1
                continue
            if sub == "activity" and name.endswith(".jsonl"):
                with open(s, encoding="utf-8") as fh:
                    old_lines = [_copy_activity_line(x.rstrip("\n")) for x in fh if x.strip()]
                new_lines: list[str] = []
                if os.path.isfile(d):  # the new recorder already wrote this day: keep both, oldest first
                    with open(d, encoding="utf-8") as fh:
                        new_lines = [x.rstrip("\n") for x in fh if x.strip()]
                lines = list(dict.fromkeys(old_lines + new_lines))

                def _start(x: str) -> float:
                    try:
                        return float(json.loads(x).get("start") or 0)
                    except (ValueError, AttributeError, TypeError):
                        return 0.0

                lines.sort(key=_start)
                tmp = d + ".tmp"
                with open(tmp, "w", encoding="utf-8") as fh:
                    fh.write("\n".join(lines) + "\n")
                os.replace(tmp, d)
                n += 1
            elif not os.path.exists(d):
                shutil.copy2(s, d)
                n += 1
        copied[sub] = n
    return copied


# ------------------------------------------------------------------ the import


async def async_import(hass: HomeAssistant) -> dict[str, Any]:
    """Import both old files (and copy the folders), then reload. Raises ImportBlocked / ImportValidationError."""
    ext = hass.data[DATA_EXT]
    if legacy.old_alarmo_active(hass):
        raise ImportBlocked(
            "The Alarmo integration is still enabled. Disable it first (Settings → Devices & services → Alarmo → "
            "⋮ → Disable), then import: the two must never run at the same time."
        )
    blocked = yaml_io.blocking_alarm_entities(hass)
    if blocked:
        raise ImportBlocked("Disarm first: " + ", ".join(blocked))
    alarm, extras = await _read_old(hass)
    if alarm is None and extras is None:
        raise ImportBlocked("No Alarmo files found (.storage/alarmo.storage, .storage/alarmo_extras).")

    new_alarm = None
    if alarm is not None:
        envelope = {
            "key": LEGACY_STORAGE_KEY,
            "version": STORAGE_VERSION_MAJOR,
            "minor_version": STORAGE_VERSION_MINOR,
            "data": alarm,
        }
        preview = await yaml_io.build_preview(hass, ext.store, json.dumps(envelope), yaml_io.MODE_REPLACE)
        if preview["errors"]:
            raise yaml_io.ImportValidationError(preview["errors"])
        new_alarm = preview["_new"]

    new_extras = None
    if extras is not None:
        raw = legacy.rewrite_data(extras)
        clean, errors = ext_extras_io.clean_extras(raw)
        if errors:
            raise yaml_io.ImportValidationError(errors)
        defaults = {k: (v.copy() if isinstance(v, (list, dict)) else v) for k, v in EXTRAS_DEFAULTS.items()}
        # everything from the old file (runtime state such as the current House Mode included), validated sections
        # replaced by their clean form
        new_extras = {**defaults, **raw, **clean}

    backup = await ext.backups.async_create(LABEL_PRE_IMPORT)
    if new_alarm is not None:
        await yaml_io.write_data(ext.store, new_alarm)
    if new_extras is not None:
        ext.extras.data = new_extras
        await ext.extras.async_update()
    copied = await hass.async_add_executor_job(_copy_folders, hass)
    counts = _counts(new_alarm, new_extras)
    record = {
        "choice": CHOICE_IMPORTED,
        "at": dt_util.now().isoformat(timespec="seconds"),
        "imported": {
            "kind": "fork" if extras is not None else "alarmo",
            "counts": counts,
            "copied": copied,
            "backup": backup["name"],
        },
    }
    combined = await async_get_combined(hass)
    await combined.async_save_section(SECTION_IMPORT, record)
    _LOGGER.warning("Imported from Alarmo: %s; copied %s (backup before: %s)", counts, copied, backup["name"])

    entry_id = ext.coordinator.entry.entry_id
    await hass.config_entries.async_reload(entry_id)
    if new_extras is not None:
        ext.panel.async_restart()
        ext.house.async_restart()
        ext.locks.async_restart()
        ext.rules.schedule_refresh(0)
    return record


async def async_start_fresh(hass: HomeAssistant) -> dict[str, Any]:
    """Record "Start fresh" (the Backup tab can still import later)."""
    combined = await async_get_combined(hass)
    record = {"choice": CHOICE_FRESH, "at": dt_util.now().isoformat(timespec="seconds")}
    await combined.async_save_section(SECTION_IMPORT, record)
    return record


# ------------------------------------------------------------------ cleanup (the last step of moving over)

CLEANUP_SECTION = "alarmo_cleanup"


def _leftover_paths(hass: HomeAssistant) -> list[str]:
    """Alarmo's files that are still there (relative to /config)."""
    out = []
    for rel in (os.path.join(".storage", LEGACY_STORAGE_KEY), os.path.join(".storage", LEGACY_EXTRAS_KEY),
                OLD_FOLDER, os.path.join("custom_components", OLD_FOLDER)):
        if os.path.exists(hass.config.path(rel)):
            out.append(rel)
    return out


async def async_cleanup_info(hass: HomeAssistant) -> dict[str, Any]:
    """What a cleanup would remove, and whether it may run."""
    combined = await async_get_combined(hass)
    paths = await hass.async_add_executor_job(_leftover_paths, hass)
    entries = legacy.old_entry_info(hass)
    return {
        "paths": paths,
        "entries": entries,
        "blocked": "Disable Alarmo first" if legacy.old_alarmo_active(hass) else None,
        "done": combined.get(CLEANUP_SECTION),
        "left": bool(paths or entries),
    }


def _backup_and_delete(hass: HomeAssistant, paths: list[str], dst: str) -> list[str]:
    os.makedirs(dst, exist_ok=True)
    for rel in paths:
        src = hass.config.path(rel)
        target = os.path.join(dst, rel)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if os.path.isdir(src):
            shutil.copytree(src, target, ignore=shutil.ignore_patterns("__pycache__", "node_modules"))
        else:
            shutil.copy2(src, target)
    removed = []
    for rel in paths:  # only after every copy worked
        src = hass.config.path(rel)
        if os.path.isdir(src):
            shutil.rmtree(src)
        else:
            os.remove(src)
        removed.append(rel)
    return removed


async def async_cleanup(hass: HomeAssistant) -> dict[str, Any]:
    """Remove Alarmo for good: its config entry, .storage files, /config/alarmo/ and custom_components/alarmo/.

    A copy of every file goes to /config/house_modes/backups/alarmo-final_<date>/ first. Refuses while Alarmo is
    enabled. The entry is removed while its code is still there (Alarmo's own removal runs), then the files.
    """
    if legacy.old_alarmo_active(hass):
        raise ImportBlocked("Disable Alarmo first (Settings → Devices & services → Alarmo → ⋮ → Disable).")
    stamp = dt_util.now().strftime("%Y-%m-%d_%H%M%S")
    dst = hass.config.path(NEW_FOLDER, "backups", f"alarmo-final_{stamp}")
    paths = await hass.async_add_executor_job(_leftover_paths, hass)
    # the entry first: removing it may make Alarmo write a last backup into /config/alarmo/ (copied next)
    entries = []
    for e in legacy.old_entries(hass):
        try:
            await hass.config_entries.async_remove(e.entry_id)
            entries.append(e.title)
        except Exception as err:
            _LOGGER.warning("Could not remove the Alarmo entry %s: %s", e.title, err)
    paths = await hass.async_add_executor_job(_leftover_paths, hass)
    removed = await hass.async_add_executor_job(_backup_and_delete, hass, paths, dst)
    record = {"at": dt_util.now().isoformat(timespec="seconds"), "removed": removed, "entries": entries,
              "backup": os.path.relpath(dst, hass.config.config_dir)}
    combined = await async_get_combined(hass)
    await combined.async_save_section(CLEANUP_SECTION, record)
    _LOGGER.warning("Alarmo removed: entries %s, files %s (copies in %s)", entries, removed, dst)
    return record


# ------------------------------------------------------------------ websocket commands (admin only)


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alarmo_import/status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_status(hass, connection, msg):
    """What was found, and what was chosen."""
    connection.send_result(msg["id"], await async_status(hass))


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alarmo_import/run"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_run(hass, connection, msg):
    """Import now."""
    try:
        result = await async_import(hass)
    except ImportBlocked as err:
        connection.send_error(msg["id"], "blocked", str(err))
        return
    except yaml_io.ImportValidationError as err:
        connection.send_error(msg["id"], "invalid", "\n".join(err.errors))
        return
    except Exception as err:
        _LOGGER.exception("Import from Alarmo failed")
        connection.send_error(msg["id"], "unknown_error", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alarmo_import/fresh"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_fresh(hass, connection, msg):
    """Start fresh (nothing imported)."""
    connection.send_result(msg["id"], await async_start_fresh(hass))


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alarmo_import/cleanup_info"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_cleanup_info(hass, connection, msg):
    """What the cleanup would remove."""
    connection.send_result(msg["id"], await async_cleanup_info(hass))


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/alarmo_import/cleanup"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_cleanup(hass, connection, msg):
    """Remove Alarmo for good (copies first)."""
    try:
        connection.send_result(msg["id"], await async_cleanup(hass))
    except ImportBlocked as err:
        connection.send_error(msg["id"], "blocked", str(err))
    except Exception as err:
        _LOGGER.exception("Alarmo cleanup failed")
        connection.send_error(msg["id"], "unknown_error", str(err))


IMPORT_COMMANDS = (ws_status, ws_run, ws_fresh, ws_cleanup_info, ws_cleanup)
