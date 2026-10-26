"""Task 3: backup manager, settings and the alarmo.create_backup service."""

import json
from typing import Any
from datetime import timedelta

import yaml
import pytest
from homeassistant.util import dt as dt_util

from tests.ext_helpers import (
    setup_real_alarmo,
    write_storage_file,
    load_fixture_envelope,
)
from custom_components.alarmo import backup as backup_mod

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


def _backup_dir(tmp_path) -> Any:
    return tmp_path / "alarmo" / "backups"


async def test_create_backup_pair_exact_copy(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """A backup is a date-stamped pair: exact .storage copy + YAML export."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    live = write_storage_file(tmp_path, env)
    client = await hass_ws_client(hass)

    msg = await _ws(
        client, 1, type="alarmo/ext/backup/create", label="Before Big Change!"
    )
    assert msg["success"], msg
    info = msg["result"]
    assert backup_mod.NAME_RE.match(info["name"])
    assert info["name"].endswith("_before-big-change")
    assert info["label"] == "before-big-change"
    assert set(info["files"]) == {"storage", "yaml", "extras"}

    folder = _backup_dir(tmp_path)
    storage_copy = folder / info["files"]["storage"]["file"]
    assert storage_copy.read_bytes() == live.read_bytes()
    doc = yaml.safe_load((folder / info["files"]["yaml"]["file"]).read_text())
    assert doc["data"] == env["data"]
    # date stamp is "today" in local time
    assert dt_util.now().strftime("%Y-%m-%d") in info["name"]


async def test_backup_without_storage_file_uses_store_data(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """If .storage/alarmo.storage is not on disk yet, the envelope is written."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    info = await hass.data["alarmo_ext"].backups.async_create("x")
    raw = (_backup_dir(tmp_path) / info["files"]["storage"]["file"]).read_text()
    stored = json.loads(raw)
    assert stored["key"] == "alarmo.storage"
    assert (stored["version"], stored["minor_version"]) == (6, 3)
    assert stored["data"] == env["data"]


async def test_list_download_delete_and_name_checks(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """List newest first; download/delete reject anything but backup names."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    first = (await _ws(client, 1, type="alarmo/ext/backup/create"))["result"]
    second = (await _ws(client, 2, type="alarmo/ext/backup/create", label="b"))[
        "result"
    ]

    listed = (await _ws(client, 3, type="alarmo/ext/backup/list"))["result"]
    names = [b["name"] for b in listed["backups"]]
    assert names == [second["name"], first["name"]]
    assert listed["settings"]["retention_days"] == 30

    msg = await _ws(
        client,
        4,
        type="alarmo/ext/backup/download",
        file=second["files"]["yaml"]["file"],
    )
    assert msg["success"] and msg["result"]["content"].startswith("# Alarmo")

    for i, bad in enumerate(
        ["../.storage/alarmo.storage", "alarmo_x.yaml", "secrets.yaml", "/etc/passwd"],
        start=10,
    ):
        msg = await _ws(client, i, type="alarmo/ext/backup/download", file=bad)
        assert not msg["success"]
        assert msg["error"]["code"] == "backup_error"
    msg = await _ws(client, 20, type="alarmo/ext/backup/delete", name="../../x")
    assert not msg["success"]

    msg = await _ws(client, 21, type="alarmo/ext/backup/delete", name=first["name"])
    assert msg["success"]
    left = sorted(p.name for p in _backup_dir(tmp_path).iterdir())
    assert all(second["name"] in f for f in left) and len(left) == 3


async def test_same_second_backups_do_not_collide(
    hass: Any, hass_storage: Any, tmp_path: Any, freezer: Any
) -> None:
    """Two backups in the same second get distinct names."""
    freezer.move_to("2026-10-08 12:00:00")
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    mgr = hass.data["alarmo_ext"].backups
    a = await mgr.async_create(None)
    b = await mgr.async_create(None)
    assert a["name"] != b["name"]
    assert len(await mgr.async_list()) == 2


def _fake_backup(folder, when) -> str:
    folder.mkdir(parents=True, exist_ok=True)
    name = "alarmo_" + when.strftime(backup_mod.STAMP_FORMAT) + "_old"
    (folder / f"{name}.yaml").write_text("x")
    (folder / f"{name}.storage.json").write_text("{}")
    return name


async def test_retention_prunes_old_and_keeps_newest(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Backups older than retention_days are deleted; settings persist."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    folder = _backup_dir(tmp_path)
    now = dt_util.now()
    old = _fake_backup(folder, now - timedelta(days=40))
    recent = _fake_backup(folder, now - timedelta(days=5))
    mgr = hass.data["alarmo_ext"].backups

    assert await mgr.async_prune() == [old]
    assert [b["name"] for b in await mgr.async_list()] == [recent]

    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="alarmo/ext/backup/settings", retention_days=2)
    assert msg["success"] and msg["result"]["retention_days"] == 2
    assert hass_storage["alarmo_extras"]["data"]["retention_days"] == 2
    # 'recent' is the only (newest) backup, so it is kept even though > 2 days
    assert [b["name"] for b in await mgr.async_list()] == [recent]
    await mgr.async_create("new")
    assert len(await mgr.async_list()) == 1  # recent pruned, new kept

    msg = await _ws(client, 2, type="alarmo/ext/backup/settings", retention_days=0)
    assert msg["result"]["retention_days"] == 0
    _fake_backup(folder, now - timedelta(days=900))
    assert await mgr.async_prune() == []

    msg = await _ws(client, 3, type="alarmo/ext/backup/settings", retention_days=-1)
    assert not msg["success"]


async def test_create_backup_service(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """alarmo.create_backup writes a labelled pair and can return its info."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    assert hass.services.has_service("alarmo", "create_backup")
    resp = await hass.services.async_call(
        "alarmo",
        "create_backup",
        {"label": "nightly"},
        blocking=True,
        return_response=True,
    )
    assert resp["name"].endswith("_nightly")
    await hass.services.async_call("alarmo", "create_backup", {}, blocking=True)
    names = [b["name"] for b in await hass.data["alarmo_ext"].backups.async_list()]
    assert len(names) == 2 and any(n.endswith("_manual") for n in names)


def test_label_sanitizing() -> None:
    """Labels become safe file-name fragments."""
    assert backup_mod.sanitize_label(" Pre Import ") == "pre-import"
    assert backup_mod.sanitize_label("../../etc") == "etc"
    assert backup_mod.sanitize_label("!!!") is None
    assert len(backup_mod.sanitize_label("x" * 100)) == 32
