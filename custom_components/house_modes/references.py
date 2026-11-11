"""Find and rewrite Alarmo names in the user's configuration: automations, scripts, templates, dashboards.

After the import the user's automations may still call ``alarmo.set_house_mode``, listen for
``alarmo_house_mode_changed`` or read ``select.alarmo_house_mode``. ``scan`` lists every such line (nothing is
changed); ``apply`` rewrites exactly the listed lines after the user confirms, with a copy of every file and dashboard
it changes in ``/config/house_modes/backups/references_<stamp>/``; ``undo`` puts those copies back (for a rollback to
Alarmo). Only the exact names in legacy.py are rewritten.

Files scanned: the ``*.yaml`` files in /config (not secrets.yaml), ``packages/`` and ``blueprints/``. Dashboards: the
ones stored by Home Assistant (UI mode); YAML-mode dashboards are listed, not changed.
"""

from __future__ import annotations

import os
import json
import shutil
import hashlib
import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from homeassistant.components import websocket_api

from . import legacy
from .combined_store import async_get_combined

_LOGGER = logging.getLogger(__name__)

SECTION = "references"
SKIP_FILES = {"secrets.yaml", "known_devices.yaml"}
SUB_DIRS = ("packages", "blueprints")
RELOADS = {"automations.yaml": "automation", "scripts.yaml": "script", "scenes.yaml": "scene",
           "templates.yaml": "template"}
MAX_OTHER = 50


def _yaml_files(config_dir: str) -> list[str]:
    """Relative paths of the YAML files to scan."""
    out = []
    for name in sorted(os.listdir(config_dir)):
        if name.endswith(".yaml") and name not in SKIP_FILES and os.path.isfile(os.path.join(config_dir, name)):
            out.append(name)
    for sub in SUB_DIRS:
        base = os.path.join(config_dir, sub)
        for root, dirs, files in os.walk(base):
            dirs[:] = sorted(d for d in dirs if not d.startswith("."))
            for name in sorted(files):
                if name.endswith(".yaml"):
                    out.append(os.path.relpath(os.path.join(root, name), config_dir))
    return out


def _scan_text(text: str) -> tuple[str, list[dict], list[dict], list[int]]:
    """(new text, hits, other 'alarmo' mentions, lines with custom:alarmo-card)."""
    hits: list[dict] = []
    other: list[dict] = []
    cards: list[int] = []
    out_lines = []
    for no, line in enumerate(text.splitlines(keepends=True), start=1):
        new, found = legacy.rewrite_text(line)
        for old, repl, kind in found:
            hits.append({"line": no, "old": old, "new": repl, "kind": kind, "text": line.strip()[:200]})
        if legacy.OLD_CARD in new:
            cards.append(no)
        elif "alarmo" in new.lower() and len(other) < MAX_OTHER:
            other.append({"line": no, "text": new.strip()[:200]})
        out_lines.append(new)
    return "".join(out_lines), hits, other, cards


def _scan_files_sync(config_dir: str) -> list[dict]:
    result = []
    for rel in _yaml_files(config_dir):
        path = os.path.join(config_dir, rel)
        try:
            with open(path, encoding="utf-8", newline="") as fh:
                text = fh.read()
        except (OSError, UnicodeDecodeError):
            continue
        if "alarmo" not in text.lower():
            continue
        _new, hits, other, cards = _scan_text(text)
        if hits or other or cards:
            result.append({"file": rel, "hits": hits, "other": other, "cards": cards})
    return result


def _dashboards(hass: HomeAssistant) -> dict:
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA  # noqa: PLC0415
    except ImportError:
        return {}
    data = hass.data.get(LOVELACE_DATA)
    return dict(getattr(data, "dashboards", {}) or {})


async def _scan_dashboards(hass: HomeAssistant) -> list[dict]:
    out = []
    for url, dash in _dashboards(hass).items():
        try:
            config = await dash.async_load(False)
        except Exception:  # an auto-generated dashboard has no stored config
            continue
        text = json.dumps(config, ensure_ascii=False)
        if "alarmo" not in text.lower():
            continue
        found: list = []
        legacy.rewrite_data(config, found)
        out.append(
            {
                "url_path": url,
                "mode": getattr(dash, "mode", "storage"),
                "hits": [{"old": o, "new": n, "kind": k} for o, n, k in found],
                "cards": text.count(legacy.OLD_CARD),
            }
        )
    return out


def _token(files: list[dict], dashboards: list[dict]) -> str:
    blob = json.dumps([files, dashboards], sort_keys=True, default=str).encode()
    return hashlib.sha256(blob).hexdigest()[:24]


async def async_scan(hass: HomeAssistant) -> dict[str, Any]:
    """Everything that would be rewritten (and what would be left). Changes nothing."""
    files = await hass.async_add_executor_job(_scan_files_sync, hass.config.config_dir)
    dashboards = await _scan_dashboards(hass)
    combined = await async_get_combined(hass)
    total = sum(len(f["hits"]) for f in files) + sum(len(d["hits"]) for d in dashboards if d["mode"] == "storage")
    return {
        "files": files,
        "dashboards": dashboards,
        "total": total,
        "token": _token(files, dashboards),
        "last": combined.get(SECTION),
    }


def _apply_files_sync(config_dir: str, backup_dir: str, files: list[str]) -> list[str]:
    changed = []
    for rel in files:
        path = os.path.join(config_dir, rel)
        with open(path, encoding="utf-8", newline="") as fh:
            text = fh.read()
        new, hits, _other, _cards = _scan_text(text)
        if not hits:
            continue
        dst = os.path.join(backup_dir, "files", rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(path, dst)
        tmp = path + ".house_modes.tmp"
        with open(tmp, "w", encoding="utf-8", newline="") as fh:
            fh.write(new)
        shutil.copymode(path, tmp)
        os.replace(tmp, path)
        changed.append(rel)
    return changed


async def _reload(hass: HomeAssistant, files: list[str]) -> list[str]:
    """Reload what the rewritten files belong to; the rest needs a restart."""
    restart = []
    done = set()
    for rel in files:
        domain = RELOADS.get(rel)
        if rel.startswith("blueprints" + os.sep) or rel.startswith("blueprints/"):
            domain = "automation"
        if domain is None:
            restart.append(rel)
            continue
        if domain in done or not hass.services.has_service(domain, "reload"):
            continue
        try:
            await hass.services.async_call(domain, "reload", blocking=True)
            done.add(domain)
        except Exception:
            _LOGGER.exception("Could not reload %s after rewriting references", domain)
            restart.append(rel)
    return restart


async def async_apply(hass: HomeAssistant, token: str) -> dict[str, Any]:
    """Rewrite what the scan listed (backup first). Raises ValueError if the scan is out of date."""
    scan = await async_scan(hass)
    if scan["token"] != token:
        raise ValueError("Something changed since the scan; scan again.")
    stamp = dt_util.now().strftime("%Y-%m-%d_%H%M%S")
    backup_dir = hass.config.path("house_modes", "backups", f"references_{stamp}")
    files = [f["file"] for f in scan["files"] if f["hits"]]
    changed = await hass.async_add_executor_job(_apply_files_sync, hass.config.config_dir, backup_dir, files)
    boards = []
    for d in scan["dashboards"]:
        if not d["hits"] or d["mode"] != "storage":
            continue
        dash = _dashboards(hass).get(d["url_path"])
        config = await dash.async_load(False)
        name = d["url_path"] or "overview"

        def _save_copy(cfg=config, name=name) -> None:
            os.makedirs(os.path.join(backup_dir, "dashboards"), exist_ok=True)
            with open(os.path.join(backup_dir, "dashboards", f"{name}.json"), "w", encoding="utf-8") as fh:
                json.dump(cfg, fh, indent=2, ensure_ascii=False)

        await hass.async_add_executor_job(_save_copy)
        await dash.async_save(legacy.rewrite_data(config))
        boards.append(d["url_path"])
    restart = await _reload(hass, changed)
    record = {"at": dt_util.now().isoformat(timespec="seconds"), "backup": backup_dir, "files": changed,
              "dashboards": boards, "restart": restart}
    combined = await async_get_combined(hass)
    await combined.async_save_section(SECTION, record)
    _LOGGER.warning("Rewrote Alarmo references in %s and dashboards %s (copies in %s)", changed, boards, backup_dir)
    return record


async def async_undo(hass: HomeAssistant) -> dict[str, Any]:
    """Put back the files and dashboards of the last rewrite."""
    combined = await async_get_combined(hass)
    rec = combined.get(SECTION)
    if not rec:
        raise ValueError("Nothing to undo.")
    backup_dir = rec["backup"]

    def _restore() -> list[str]:
        back = []
        for rel in rec["files"]:
            src = os.path.join(backup_dir, "files", rel)
            if os.path.isfile(src):
                shutil.copy2(src, hass.config.path(rel))
                back.append(rel)
        return back

    files = await hass.async_add_executor_job(_restore)
    boards = []
    for url in rec["dashboards"]:
        name = url or "overview"
        path = os.path.join(backup_dir, "dashboards", f"{name}.json")

        def _read(path=path) -> dict:
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)

        dash = _dashboards(hass).get(url)
        if dash is None or not os.path.isfile(path):
            continue
        await dash.async_save(await hass.async_add_executor_job(_read))
        boards.append(url)
    restart = await _reload(hass, files)
    await combined.async_remove_section(SECTION)
    return {"files": files, "dashboards": boards, "restart": restart}


# ------------------------------------------------------------------ websocket commands (admin only)


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/references/scan"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_scan(hass, connection, msg):
    """List the Alarmo names in the user's configuration."""
    connection.send_result(msg["id"], await async_scan(hass))


@websocket_api.websocket_command(
    {vol.Required("type"): "house_modes/ext/references/apply", vol.Required("token"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_apply(hass, connection, msg):
    """Rewrite them."""
    try:
        connection.send_result(msg["id"], await async_apply(hass, msg["token"]))
    except ValueError as err:
        connection.send_error(msg["id"], "invalid", str(err))
    except Exception as err:
        _LOGGER.exception("Rewriting references failed")
        connection.send_error(msg["id"], "unknown_error", str(err))


@websocket_api.websocket_command({vol.Required("type"): "house_modes/ext/references/undo"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_undo(hass, connection, msg):
    """Undo the last rewrite."""
    try:
        connection.send_result(msg["id"], await async_undo(hass))
    except ValueError as err:
        connection.send_error(msg["id"], "invalid", str(err))
    except Exception as err:
        _LOGGER.exception("Undoing the reference rewrite failed")
        connection.send_error(msg["id"], "unknown_error", str(err))


REFERENCE_COMMANDS = (ws_scan, ws_apply, ws_undo)
