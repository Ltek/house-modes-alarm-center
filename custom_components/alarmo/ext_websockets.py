"""Websocket API and services for the alarmo "ext" additions.

All commands require an admin user (exports and backups contain code hashes).

Commands:
  alarmo/ext/info                    version, backup folder, settings
  alarmo/ext/export                  full YAML export (text)
  alarmo/ext/backup/list|create|delete|download|settings
  alarmo/ext/import/preview          parse + validate + diff (no changes)
  alarmo/ext/import/apply            backup, then write and reload Alarmo
  alarmo/ext/sensors/apply_changes   backup, then apply a batch of sensor edits
Service:
  alarmo.create_backup               same as backup/create (admin only)
"""

from __future__ import annotations

import os
import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import (
    CoreState,
    ServiceCall,
    HomeAssistant,
    SupportsResponse,
    callback,
)
from homeassistant.const import EVENT_HOMEASSISTANT_STOP, EVENT_HOMEASSISTANT_STARTED
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.service import async_register_admin_service
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import const, yaml_io, ext_extras_io
from .backup import BackupError, BackupManager
from .sensors import ATTR_GROUP
from .recorder import ACTIVITY_COMMANDS, ActivityRecorder
from .ext_locks import LOCK_COMMANDS, LockManager
from .ext_rules import RulesError, RulesManager
from .ext_status import STATUS_COMMANDS
from .panel_link import PanelLinkManager
from .house_modes import HouseModeManager
from .ext_house_ws import HOUSE_COMMANDS, register_house_service
from .ext_panel_ws import PANEL_COMMANDS
from .ext_rules_ws import RULE_COMMANDS
from .extras_store import MAX_RETENTION_DAYS, ExtrasStore
from .ext_house_actions import HOUSE_ACTION_COMMANDS

_LOGGER = logging.getLogger(__name__)

DATA_EXT = "alarmo_ext"
SERVICE_CREATE_BACKUP = "create_backup"
EXT_VERSION_SUFFIX = "ext.1"

LABEL_SENSOR_TABLE = "sensor-table"
LABEL_PRE_IMPORT = "pre-import"
LABEL_MANUAL = "manual"
LABEL_BEFORE_REMOVE = "before-integration-removed"


class ExtManager:
    """Holds the ext helpers; survives config-entry reloads."""

    def __init__(self, hass: HomeAssistant, store) -> None:
        """Initialize."""
        self.hass = hass
        self.store = store
        self.extras = ExtrasStore(hass)
        self.backups = BackupManager(hass, store, self.extras)
        self.rules = RulesManager(hass, self)
        self.panel = PanelLinkManager(hass, self)
        self.house = HouseModeManager(hass, self)
        self.locks = LockManager(hass, self)
        self.recorder = ActivityRecorder(hass, self)

    def backup_settings(self) -> dict[str, Any]:
        """Settings shown on the backup page."""
        return {"retention_days": self.extras.retention_days}

    @property
    def coordinator(self):
        """The current Alarmo coordinator (replaced on every reload)."""
        return self.hass.data[const.DOMAIN]["coordinator"]

    # ---------------------------------------------------------- import/apply

    async def _import_content(self, msg: dict) -> str:
        if msg.get("backup_name"):
            return await self.backups.async_read_for_restore(msg["backup_name"])
        if msg.get("content") is None:
            raise yaml_io.ImportValidationError(["no file or backup selected"])
        return msg["content"]

    async def _new_extras(
        self, msg: dict, preview: dict
    ) -> tuple[dict | None, list[str]]:
        """Ext settings from the file (YAML) or the backup's extras file; None = keep."""
        raw = preview.get("extras")
        if raw is None and msg.get("backup_name"):
            raw = await self.backups.async_read_extras(msg["backup_name"])
        if raw is None:
            return None, []
        clean, errors = ext_extras_io.clean_extras(raw)
        if errors:
            return None, errors
        return ext_extras_io.merge_extras(
            dict(self.extras.data), clean, msg["mode"]
        ), []

    async def _full_preview(self, msg: dict) -> dict[str, Any]:
        content = await self._import_content(msg)
        preview = await yaml_io.build_preview(
            self.hass, self.store, content, msg["mode"]
        )
        new_extras, errors = await self._new_extras(msg, preview)
        preview["errors"] += errors
        preview["_extras"] = new_extras
        preview["extras_changes"] = (
            ext_extras_io.summary(dict(self.extras.data), new_extras)
            if new_extras
            else []
        )
        preview["extras_included"] = new_extras is not None
        preview["total_changes"] += len(preview["extras_changes"])
        preview["token"] = preview["token"] + (
            ext_extras_io.token(new_extras) if new_extras else ""
        )
        return preview

    async def async_preview(self, msg: dict) -> dict[str, Any]:
        """Preview an import."""
        preview = await self._full_preview(msg)
        preview.pop("_new")
        preview.pop("_extras")
        preview.pop("extras", None)
        preview["blocked_by"] = yaml_io.blocking_alarm_entities(self.hass)
        return preview

    async def async_apply(self, msg: dict) -> dict[str, Any]:
        """Apply an import after re-validating it against the preview token."""
        blocked = yaml_io.blocking_alarm_entities(self.hass)
        if blocked:
            raise BlockedError(
                "Disarm first. Import/restore is not allowed while armed, arming, "
                "pending or triggered: " + ", ".join(blocked)
            )
        preview = await self._full_preview(msg)
        if preview["errors"]:
            raise yaml_io.ImportValidationError(preview["errors"])
        if preview["token"] != msg["token"]:
            raise yaml_io.ImportValidationError(
                ["the configuration changed since the preview; preview again"]
            )
        backup = await self.backups.async_create(LABEL_PRE_IMPORT)
        await yaml_io.write_data(self.store, preview["_new"])
        if preview["_extras"] is not None:
            self.extras.data = preview["_extras"]
            await self.extras.async_update()
        _LOGGER.warning(
            "Alarmo configuration %s from %s (backup %s); reloading Alarmo",
            "replaced" if msg["mode"] == yaml_io.MODE_REPLACE else "merged",
            msg.get("backup_name") or "uploaded file",
            backup["name"],
        )
        entry_id = self.coordinator.entry.entry_id
        await self.hass.config_entries.async_reload(entry_id)
        if preview["_extras"] is not None:
            self.panel.async_restart()
            self.house.async_restart()
            self.locks.async_restart()
            self.rules.schedule_refresh(0)
        return {
            "backup": backup,
            "summary": preview["summary"],
            "total_changes": preview["total_changes"],
        }

    # ------------------------------------------------------ sensor batch edits

    def validate_sensor_changes(self, msg: dict) -> list[str]:
        """Check a whole batch; return a list of errors (empty = OK)."""
        errors: list[str] = []
        sensors = self.store.async_get_sensors()
        areas = self.store.async_get_areas()
        groups = self.store.async_get_sensor_groups()
        seen: set[str] = set()

        def check_fields(eid: str, fields: dict) -> None:
            if "area" in fields and fields["area"] not in areas:
                errors.append(f"{eid}: unknown area '{fields['area']}'")
            grp = fields.get(ATTR_GROUP)
            if grp and grp not in groups:
                errors.append(f"{eid}: unknown sensor group '{grp}'")

        for item in msg["create"]:
            eid = item["entity_id"]
            if eid in sensors:
                errors.append(f"{eid}: already configured")
            if eid in seen:
                errors.append(f"{eid}: listed more than once")
            seen.add(eid)
            if "area" not in item:
                errors.append(f"{eid}: an area is required")
            check_fields(eid, item)
        for item in msg["update"]:
            eid = item["entity_id"]
            if eid not in sensors:
                errors.append(f"{eid}: not configured")
            if eid in seen:
                errors.append(f"{eid}: listed more than once")
            seen.add(eid)
            check_fields(eid, item["changes"])
        for eid in msg["delete"]:
            if eid not in sensors:
                errors.append(f"{eid}: not configured")
            if eid in seen:
                errors.append(f"{eid}: listed more than once")
            seen.add(eid)
        if not seen:
            errors.append("there are no changes to save")
        return errors

    async def async_apply_sensor_changes(
        self,
        msg: dict,
        label: str = LABEL_SENSOR_TABLE,
        record_overrides: bool = True,
    ) -> dict[str, Any]:
        """Back up, then apply the batch through the coordinator.

        Zone-table saves (``record_overrides``) turn edits of rule-managed fields
        into overrides; computed before the change, stored after the backup.
        """
        errors = self.validate_sensor_changes(msg)
        if errors:
            raise yaml_io.ImportValidationError(errors)
        new_overrides = (
            self.rules.overrides_for_batch(msg) if record_overrides else None
        )
        backup = await self.backups.async_create(label)
        if new_overrides is not None:
            await self.extras.async_update(overrides=new_overrides)
        coordinator = self.coordinator
        # Order matters: upstream deletes a sensor group once it drops below two
        # members, so apply everything that ADDS to a group first, then the
        # rest, then deletions - otherwise a group referenced later in the same
        # batch could vanish half-way through.
        adds_group = [
            ("create", item) for item in msg["create"] if item.get(ATTR_GROUP)
        ] + [
            ("update", item)
            for item in msg["update"]
            if item["changes"].get(ATTR_GROUP)
        ]
        others = [
            ("create", item) for item in msg["create"] if not item.get(ATTR_GROUP)
        ] + [
            ("update", item)
            for item in msg["update"]
            if not item["changes"].get(ATTR_GROUP)
        ]
        for kind, item in adds_group + others:
            if kind == "create":
                data = {k: v for k, v in item.items() if k != "entity_id"}
            else:
                data = dict(item["changes"])
            coordinator.async_update_sensor_config(item["entity_id"], data)
        for eid in msg["delete"]:
            coordinator.async_update_sensor_config(eid, {const.ATTR_REMOVE: True})
        await self.store.async_save()
        self.rules.schedule_refresh(0)
        async_dispatcher_send(self.hass, "alarmo_update_frontend")
        return {
            "backup": backup,
            "created": len(msg["create"]),
            "updated": len(msg["update"]),
            "deleted": len(msg["delete"]),
        }


class BlockedError(Exception):
    """Raised when the alarm state blocks an operation."""


def _ext(hass: HomeAssistant) -> ExtManager:
    return hass.data[DATA_EXT]


def _send_error(connection, msg_id: int, err: Exception) -> None:
    if isinstance(err, yaml_io.ImportValidationError):
        connection.send_error(msg_id, "invalid", "\n".join(err.errors))
    elif isinstance(err, BlockedError):
        connection.send_error(msg_id, "blocked", str(err))
    elif isinstance(err, RulesError):
        connection.send_error(msg_id, "invalid", "\n".join(err.errors))
    elif isinstance(err, BackupError):
        connection.send_error(msg_id, "backup_error", str(err))
    else:
        _LOGGER.exception("Alarmo ext command failed")
        connection.send_error(msg_id, "unknown_error", str(err))


# -------------------------------------------------------------- commands

_SENSOR_FIELDS = {
    k: v for k, v in yaml_io.SENSOR_FIELDS_SCHEMA.items() if str(k) != "area"
}
_SENSOR_FIELDS[vol.Optional("area")] = cv.string
_SENSOR_FIELDS[vol.Optional(ATTR_GROUP)] = vol.Any(None, str)


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/info"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_info(hass, connection, msg):
    """Return build info and settings."""
    ext = _ext(hass)
    connection.send_result(
        msg["id"],
        {
            "version": const.VERSION,
            "export_version": yaml_io.EXPORT_VERSION,
            "backup_dir": ext.backups.backup_dir,
            "settings": ext.backup_settings(),
            "blocked_by": yaml_io.blocking_alarm_entities(hass),
            "ui": dict(ext.extras.data.get("ui") or {}),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/ui/set",
        vol.Required("ui"): vol.Schema({vol.In(("show_legacy_zones",)): bool}),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_ui_set(hass, connection, msg):
    """Page options (e.g. show the Zones (legacy) tab)."""
    ext = _ext(hass)
    ui = {**(ext.extras.data.get("ui") or {}), **msg["ui"]}
    await ext.extras.async_update(ui=ui)
    connection.send_result(msg["id"], {"ui": ui})


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/export"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export(hass, connection, msg):
    """Return a full YAML export."""
    ext = _ext(hass)
    stamp = yaml_io.dt_util.now().strftime("%Y-%m-%d_%H%M%S")
    connection.send_result(
        msg["id"],
        {
            "file_name": f"alarmo_export_{stamp}.yaml",
            "content": yaml_io.dump_yaml(
                yaml_io.build_export(ext.store, dict(ext.extras.data))
            ),
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/backup/list"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_list(hass, connection, msg):
    """List backups (newest first)."""
    ext = _ext(hass)
    connection.send_result(
        msg["id"],
        {"backups": await ext.backups.async_list(), "settings": ext.backup_settings()},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/backup/create",
        vol.Optional("label"): vol.Any(None, cv.string),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_create(hass, connection, msg):
    """Create a backup now."""
    try:
        info = await _ext(hass).backups.async_create(msg.get("label") or LABEL_MANUAL)
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], info)


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/backup/delete", vol.Required("name"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_delete(hass, connection, msg):
    """Delete a backup (both files)."""
    try:
        await _ext(hass).backups.async_delete(msg["name"])
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"deleted": msg["name"]})


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/backup/download", vol.Required("file"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_download(hass, connection, msg):
    """Return the contents of one backup file."""
    try:
        content = await _ext(hass).backups.async_read(msg["file"])
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"file_name": msg["file"], "content": content})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/backup/settings",
        vol.Optional("retention_days"): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=MAX_RETENTION_DAYS)
        ),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_settings(hass, connection, msg):
    """Get or set backup settings."""
    ext = _ext(hass)
    if "retention_days" in msg:
        await ext.extras.async_update(retention_days=msg["retention_days"])
        await ext.backups.async_prune()
    connection.send_result(msg["id"], ext.backup_settings())


_IMPORT_SOURCE = {
    vol.Exclusive("content", "source"): str,
    vol.Exclusive("backup_name", "source"): str,
    vol.Required("mode"): vol.In([yaml_io.MODE_MERGE, yaml_io.MODE_REPLACE]),
}


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/import/preview", **_IMPORT_SOURCE}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_preview(hass, connection, msg):
    """Preview an import; validation problems are returned, not raised."""
    try:
        result = await _ext(hass).async_preview(msg)
    except yaml_io.ImportValidationError as err:
        connection.send_result(msg["id"], {"ok": False, "errors": err.errors})
        return
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"ok": not result["errors"], **result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/import/apply",
        vol.Required("token"): str,
        **_IMPORT_SOURCE,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_apply(hass, connection, msg):
    """Apply an import (backup first, then write and reload)."""
    try:
        result = await _ext(hass).async_apply(msg)
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/sensors/apply_changes",
        vol.Optional("create", default=[]): [
            vol.Schema({vol.Required("entity_id"): cv.entity_id, **_SENSOR_FIELDS})
        ],
        vol.Optional("update", default=[]): [
            vol.Schema(
                {
                    vol.Required("entity_id"): cv.entity_id,
                    vol.Required("changes"): vol.Schema(_SENSOR_FIELDS),
                }
            )
        ],
        vol.Optional("delete", default=[]): [cv.entity_id],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_sensors_apply_changes(hass, connection, msg):
    """Save a batch of sensor-table edits (all-or-nothing)."""
    try:
        result = await _ext(hass).async_apply_sensor_changes(msg)
    except Exception as err:
        _send_error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], result)


COMMANDS = (
    ws_info,
    ws_ui_set,
    ws_export,
    ws_backup_list,
    ws_backup_create,
    ws_backup_delete,
    ws_backup_download,
    ws_backup_settings,
    ws_import_preview,
    ws_import_apply,
    ws_sensors_apply_changes,
    *RULE_COMMANDS,
    *PANEL_COMMANDS,
    *HOUSE_COMMANDS,
    *LOCK_COMMANDS,
    *STATUS_COMMANDS,
    *ACTIVITY_COMMANDS,
    *HOUSE_ACTION_COMMANDS,
)


# -------------------------------------------------------------- setup


async def async_setup_ext(hass: HomeAssistant, store) -> None:
    """Set up the ext additions. Never raises: core Alarmo must keep working."""
    try:
        if DATA_EXT not in hass.data:
            manager = ExtManager(hass, store)
            await manager.extras.async_load()
            hass.data[DATA_EXT] = manager

            @callback
            def _on_stop(_event) -> None:
                manager.rules.async_stop()
                manager.panel.async_stop()
                manager.house.async_stop()
                manager.locks.async_stop()
                manager.recorder.async_stop()

            hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, _on_stop)
        manager = hass.data[DATA_EXT]

        for command in COMMANDS:
            websocket_api.async_register_command(hass, command)

        async def _srv_create_backup(call: ServiceCall):
            info = await manager.backups.async_create(
                call.data.get("label") or LABEL_MANUAL
            )
            return info if call.return_response else None

        async_register_admin_service(
            hass,
            const.DOMAIN,
            SERVICE_CREATE_BACKUP,
            _srv_create_backup,
            schema=vol.Schema({vol.Optional("label"): cv.string}),
            supports_response=SupportsResponse.OPTIONAL,
        )

        @callback
        def _prune_later() -> None:
            hass.async_create_task(manager.backups.async_prune(), "alarmo_ext_prune")

        _prune_later()
        manager.rules.async_start()
        register_house_service(hass)

        # panel links need the Alarmo alarm entities, which are added after setup
        @callback
        def _start_links(_now=None) -> None:
            # each part separately: one failing must not stop the others
            parts = [manager.house, manager.locks, manager.recorder]
            if not manager.panel.started:
                parts.insert(0, manager.panel)
            for part in parts:
                try:
                    part.async_restart()
                except Exception:
                    _LOGGER.exception("Alarmo ext: %s failed to start", type(part).__name__)

        if hass.state is CoreState.running:
            async_call_later(hass, 2, _start_links)
        else:
            hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _start_links)
    except Exception:
        _LOGGER.exception(
            "Alarmo ext features failed to start; core Alarmo is unaffected"
        )


async def async_backup_before_remove(hass: HomeAssistant) -> None:
    """Deleting the Alarmo integration wipes alarmo.storage: make a backup first. Never raises.

    The backup (configuration + ext settings) lands in /config/alarmo/backups/ and can be restored from the Backup
    tab after adding the integration again. If the ext backup fails, the raw storage files are copied instead.
    """
    try:
        ext = hass.data.get(DATA_EXT)
        if ext is not None:
            info = await ext.backups.async_create(LABEL_BEFORE_REMOVE)
            _LOGGER.warning(
                "Alarmo integration removed: its configuration was backed up first as %s "
                "(restore it from the Backup tab after adding the integration again)",
                info["name"],
            )
            return
    except Exception:
        _LOGGER.exception("Alarmo: backup before removal failed; copying the storage files instead")
    try:
        import shutil  # noqa: PLC0415

        stamp = yaml_io.dt_util.now().strftime("%Y-%m-%d_%H%M%S")
        dst = hass.config.path("alarmo", "backups", f"raw-before-remove_{stamp}")

        def _copy() -> None:
            os.makedirs(dst, exist_ok=True)
            for name in ("alarmo.storage", "alarmo_extras"):
                src = hass.config.path(".storage", name)
                if os.path.isfile(src):
                    shutil.copy2(src, os.path.join(dst, name))

        await hass.async_add_executor_job(_copy)
        _LOGGER.warning("Alarmo integration removed: storage files copied to %s", dst)
    except Exception:
        _LOGGER.exception("Alarmo: could not copy the storage files before removal")


EXT_PLATFORMS = ["binary_sensor", "select"]


async def async_setup_ext_platforms(hass: HomeAssistant, entry) -> None:
    """Forward the ext entity platforms (mirror zones). Never raises."""
    try:
        await hass.config_entries.async_forward_entry_setups(entry, EXT_PLATFORMS)
    except Exception:
        _LOGGER.exception(
            "Alarmo ext platforms failed to start; core Alarmo is unaffected"
        )


async def async_unload_ext_platforms(hass: HomeAssistant, entry) -> bool:
    """Unload the ext entity platforms."""
    try:
        return await hass.config_entries.async_unload_platforms(entry, EXT_PLATFORMS)
    except Exception:
        _LOGGER.exception("Alarmo ext platforms failed to unload")
        return True
