"""Date-stamped backups of the Alarmo configuration.

Each backup is a pair of files in ``<config>/alarmo/backups/`` sharing one name:

* ``<name>.storage.json`` - exact copy of ``.storage/alarmo.storage``
* ``<name>.yaml``         - full YAML export (same data + ext settings, human readable)
* ``<name>.extras.json``  - copy of the ext settings (``.storage/alarmo_extras``: House Modes,
  physical panel, zone rules, overrides, mirrors). Older backups may not have it.

``<name>`` is ``alarmo_YYYY-MM-DD_HHMMSS[-N][_label]`` in local time.
"""

from __future__ import annotations

import os
import re
import json
import logging
from typing import Any
from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import yaml_io
from .store import STORAGE_KEY
from .extras_store import ExtrasStore

_LOGGER = logging.getLogger(__name__)

BACKUP_SUBDIR = ("alarmo", "backups")
STAMP_FORMAT = "%Y-%m-%d_%H%M%S"
EXT_STORAGE = ".storage.json"
EXT_YAML = ".yaml"
EXT_EXTRAS = ".extras.json"
FILE_TYPES = {"storage": EXT_STORAGE, "yaml": EXT_YAML, "extras": EXT_EXTRAS}

NAME_RE = re.compile(
    r"^alarmo_(?P<stamp>\d{4}-\d{2}-\d{2}_\d{6})(?:-(?P<seq>\d{1,3}))?"
    r"(?:_(?P<label>[a-z0-9-]{1,32}))?$"
)
FILE_RE = re.compile(
    r"^(?P<name>alarmo_[a-z0-9_-]+)(?P<ext>\.storage\.json|\.extras\.json|\.yaml)$"
)


class BackupError(Exception):
    """Raised for invalid backup requests."""


def sanitize_label(label: str | None) -> str | None:
    """Turn a free-text label into the filename-safe form (or None)."""
    if not label:
        return None
    clean = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:32].strip("-")
    return clean or None


def parse_name(name: str) -> dict[str, Any] | None:
    """Parse a backup name; None if it is not a valid backup name."""
    m = NAME_RE.match(name or "")
    if not m:
        return None
    try:
        naive = datetime.strptime(m["stamp"], STAMP_FORMAT)
    except ValueError:
        return None
    created = naive.replace(tzinfo=dt_util.get_default_time_zone())
    return {
        "name": name,
        "label": m["label"],
        "created": created,
        "seq": int(m["seq"] or 0),
    }


def check_file_name(file_name: str) -> tuple[str, str]:
    """Validate a backup file name; return (backup name, file type)."""
    m = FILE_RE.match(file_name or "")
    if not m or not parse_name(m["name"]):
        raise BackupError(f"invalid backup file name '{file_name}'")
    ftype = next(t for t, ext in FILE_TYPES.items() if ext == m["ext"])
    return m["name"], ftype


class BackupManager:
    """Create, list, read, delete and prune backups."""

    def __init__(self, hass: HomeAssistant, store, extras: ExtrasStore) -> None:
        """Initialize."""
        self.hass = hass
        self.store = store
        self.extras = extras

    @property
    def backup_dir(self) -> str:
        """Absolute backup folder."""
        return self.hass.config.path(*BACKUP_SUBDIR)

    @property
    def storage_file(self) -> str:
        """Absolute path of the live alarmo.storage file."""
        return self.hass.config.path(".storage", STORAGE_KEY)

    # ---------------------------------------------------------------- create

    async def async_create(self, label: str | None = None) -> dict[str, Any]:
        """Flush pending changes, then write a new backup pair. Returns its info."""
        await self.store.async_save()  # make the on-disk file current
        extras = dict(self.extras.data)
        yaml_text = yaml_io.dump_yaml(yaml_io.build_export(self.store, extras))
        fallback = json.dumps(yaml_io.storage_envelope(self.store), indent=4)
        extras_text = json.dumps(yaml_io.plain(extras), indent=2)
        now = dt_util.now()
        info = await self.hass.async_add_executor_job(
            self._write_pair,
            now,
            sanitize_label(label),
            yaml_text,
            fallback,
            extras_text,
        )
        _LOGGER.info("Alarmo backup created: %s", info["name"])
        await self.async_prune()
        return info

    def _write_pair(
        self,
        now: datetime,
        label: str | None,
        yaml_text: str,
        fallback: str,
        extras_text: str | None = None,
    ) -> dict[str, Any]:
        os.makedirs(self.backup_dir, exist_ok=True)
        stamp = now.strftime(STAMP_FORMAT)
        taken = set()
        for f in os.listdir(self.backup_dir):
            m = FILE_RE.match(f)
            n = NAME_RE.match(m["name"]) if m else None
            if n and n["stamp"] == stamp:
                taken.add(int(n["seq"] or 0))
        seq = 0
        while seq in taken:
            seq += 1
        if seq > 999:  # pragma: no cover
            raise BackupError("too many backups in the same second")
        name = (
            f"alarmo_{stamp}"
            + (f"-{seq}" if seq else "")
            + (f"_{label}" if label else "")
        )
        storage_path = os.path.join(self.backup_dir, name + EXT_STORAGE)
        yaml_path = os.path.join(self.backup_dir, name + EXT_YAML)
        if os.path.isfile(self.storage_file):
            with open(self.storage_file, "rb") as src:
                raw = src.read()
        else:  # file not written yet (fresh install) - same content, our format
            raw = (fallback + "\n").encode("utf-8")
        self._atomic_write(storage_path, raw)
        self._atomic_write(yaml_path, yaml_text.encode("utf-8"))
        if extras_text is not None:
            self._atomic_write(
                os.path.join(self.backup_dir, name + EXT_EXTRAS),
                extras_text.encode("utf-8"),
            )
        return self._info(name)

    @staticmethod
    def _atomic_write(path: str, raw: bytes) -> None:
        tmp = path + ".tmp"
        with open(tmp, "wb") as fh:
            fh.write(raw)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp, path)

    # ------------------------------------------------------------------ list

    def _info(self, name: str) -> dict[str, Any]:
        parsed = parse_name(name)
        files = {}
        for ftype, ext in FILE_TYPES.items():
            path = os.path.join(self.backup_dir, name + ext)
            if os.path.isfile(path):
                files[ftype] = {"file": name + ext, "size": os.path.getsize(path)}
        return {
            "name": name,
            "label": parsed["label"] if parsed else None,
            "created": parsed["created"].isoformat() if parsed else None,
            "files": files,
        }

    def _list_sync(self) -> list[dict[str, Any]]:
        if not os.path.isdir(self.backup_dir):
            return []
        names = set()
        for f in os.listdir(self.backup_dir):
            m = FILE_RE.match(f)
            if m and parse_name(m["name"]):
                names.add(m["name"])
        infos = [self._info(n) for n in names]
        infos.sort(
            key=lambda i: (i["created"] or "", parse_name(i["name"])["seq"]),
            reverse=True,
        )
        return infos

    async def async_list(self) -> list[dict[str, Any]]:
        """Return all backups, newest first."""
        return await self.hass.async_add_executor_job(self._list_sync)

    # ------------------------------------------------------------ read/delete

    async def async_read(self, file_name: str) -> str:
        """Return the text of one backup file."""
        check_file_name(file_name)
        path = os.path.join(self.backup_dir, file_name)

        def _read() -> str:
            if not os.path.isfile(path):
                raise BackupError(f"backup file '{file_name}' not found")
            with open(path, encoding="utf-8") as fh:
                return fh.read()

        return await self.hass.async_add_executor_job(_read)

    async def async_read_extras(self, name: str) -> dict | None:
        """The ext settings saved with a backup (None for older backups)."""
        if not parse_name(name):
            raise BackupError(f"invalid backup name '{name}'")
        info = await self.hass.async_add_executor_job(self._info, name)
        if "extras" not in info["files"]:
            return None
        try:
            data = json.loads(await self.async_read(info["files"]["extras"]["file"]))
        except ValueError:
            return None
        return data if isinstance(data, dict) else None

    async def async_read_for_restore(self, name: str) -> str:
        """Return the best file of a backup for restoring (storage copy first)."""
        if not parse_name(name):
            raise BackupError(f"invalid backup name '{name}'")
        info = await self.hass.async_add_executor_job(self._info, name)
        if "storage" in info["files"]:
            return await self.async_read(info["files"]["storage"]["file"])
        if "yaml" in info["files"]:
            return await self.async_read(info["files"]["yaml"]["file"])
        raise BackupError(f"backup '{name}' not found")

    async def async_delete(self, name: str) -> None:
        """Delete both files of a backup."""
        if not parse_name(name):
            raise BackupError(f"invalid backup name '{name}'")

        def _delete() -> int:
            count = 0
            for ext in FILE_TYPES.values():
                path = os.path.join(self.backup_dir, name + ext)
                if os.path.isfile(path):
                    os.remove(path)
                    count += 1
            return count

        if not await self.hass.async_add_executor_job(_delete):
            raise BackupError(f"backup '{name}' not found")

    # ----------------------------------------------------------------- prune

    async def async_prune(self) -> list[str]:
        """Delete backups older than the retention period (newest is always kept)."""
        days = self.extras.retention_days
        if days <= 0:
            return []
        cutoff = dt_util.now() - timedelta(days=days)
        backups = await self.async_list()
        removed = []
        for info in backups[1:]:  # never delete the newest backup
            created = parse_name(info["name"])["created"]
            if created < cutoff:
                await self.async_delete(info["name"])
                removed.append(info["name"])
        if removed:
            _LOGGER.info("Alarmo: removed %d old backup(s)", len(removed))
        return removed
