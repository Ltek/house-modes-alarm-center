"""ext.29: deleting the integration backs up the configuration first."""

import os
from typing import Any

import pytest

from tests.ext_helpers import setup_real_alarmo

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def test_backup_before_integration_removed(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Removing the config entry writes a backup (config + ext settings) before Alarmo wipes alarmo.storage."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    ext = hass.data["alarmo_ext"]
    await ext.panel.async_save_settings({"monitored": True})
    entry = hass.config_entries.async_entries("alarmo")[0]
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    names = await hass.async_add_executor_job(os.listdir, ext.backups.backup_dir)
    assert any("before-integration-removed" in n and n.endswith(".storage.json") for n in names)
    assert any("before-integration-removed" in n and n.endswith(".extras.json") for n in names)


async def test_raw_copy_when_ext_backup_fails(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """If the ext backup fails, the storage files are copied as they are."""
    from custom_components.alarmo.ext_websockets import async_backup_before_remove  # noqa: PLC0415

    await setup_real_alarmo(hass, hass_storage, tmp_path)
    ext = hass.data["alarmo_ext"]

    async def boom(*_a, **_k):
        raise OSError("disk full")

    ext.backups.async_create = boom
    os.makedirs(hass.config.path(".storage"), exist_ok=True)
    with open(hass.config.path(".storage", "alarmo.storage"), "w") as fh:
        fh.write("{}")
    await async_backup_before_remove(hass)
    root = hass.config.path("alarmo", "backups")
    raw = [d for d in os.listdir(root) if d.startswith("raw-before-remove_")]
    assert raw and os.path.isfile(os.path.join(root, raw[0], "alarmo.storage"))
