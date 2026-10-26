"""Tasks 4-5: import preview, apply (merge/replace), restore, armed blocking."""

import copy
import json
from typing import Any

import yaml
import pytest

from tests.ext_helpers import (
    FIXTURE_CODES,
    setup_real_alarmo,
    load_fixture_envelope,
    assert_upstream_round_trip,
)
from custom_components.alarmo import yaml_io

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF = "1700000001"


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


def _export_text(data: dict, storage_version: str = "6.3") -> str:
    return yaml_io.dump_yaml(
        {
            "alarmo_export_version": 1,
            "alarmo_version": "test",
            "storage_version": storage_version,
            "exported_at": "2026-10-08T10:00:00+00:00",
            "data": data,
        }
    )


def _modified(env: dict) -> dict:
    data = copy.deepcopy(env["data"])
    data["sensors"][0]["modes"] = ["armed_away"]  # front door
    data["sensors"].append(
        {**copy.deepcopy(data["sensors"][1]), "entity_id": "binary_sensor.new_door"}
    )
    data["config"]["disarm_after_trigger"] = True
    return data


async def test_preview_merge_shows_field_level_changes(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Merge preview lists added/changed records; nothing is removed or written."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    data = _modified(env)
    del data["sensors"][5]  # absent from file: merge must NOT remove it
    client = await hass_ws_client(hass)
    msg = await _ws(
        client,
        1,
        type="alarmo/ext/import/preview",
        content=_export_text(data),
        mode="merge",
    )
    assert msg["success"], msg
    res = msg["result"]
    assert res["ok"] and res["format"] == "yaml" and not res["errors"]
    sensors = res["sections"]["sensors"]
    assert [a["id"] for a in sensors["added"]] == ["binary_sensor.new_door"]
    assert sensors["removed"] == []
    (chg,) = sensors["changed"]
    assert chg["id"] == "binary_sensor.front_door"
    assert chg["fields"] == [
        {
            "field": "modes",
            "old": ["armed_away", "armed_home", "armed_night", "armed_vacation"],
            "new": ["armed_away"],
        }
    ]
    assert res["sections"]["config"]["changed"][0]["fields"] == [
        {"field": "disarm_after_trigger", "old": False, "new": True}
    ]
    assert res["total_changes"] == 3
    assert any("binary_sensor.new_door" in w for w in res["warnings"])
    assert "_new" not in res
    # nothing written
    assert hass_storage["alarmo.storage"]["data"] == env["data"]


async def test_preview_replace_shows_removals(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Replace makes the file the complete config."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    data = copy.deepcopy(env["data"])
    gone = data["sensors"].pop(3)["entity_id"]
    data["users"] = data["users"][:1]
    client = await hass_ws_client(hass)
    res = (
        await _ws(
            client,
            1,
            type="alarmo/ext/import/preview",
            content=_export_text(data),
            mode="replace",
        )
    )["result"]
    assert [r["id"] for r in res["sections"]["sensors"]["removed"]] == [gone]
    assert len(res["sections"]["users"]["removed"]) == 2
    assert res["summary"]["users"] == {"added": 0, "changed": 0, "removed": 2}


@pytest.mark.parametrize(
    ("mutate", "mode", "expected"),
    [
        (
            lambda d: d["sensors"][0].update(label_rule="x"),
            "merge",
            "extra keys not allowed",
        ),
        (
            lambda d: d["sensors"][0].update(type="laser"),
            "merge",
            "sensors[binary_sensor.front_door]",
        ),
        (lambda d: d["sensors"][0].update(modes=["armed_party"]), "merge", "modes"),
        (lambda d: d.pop("users"), "replace", "missing section(s): users"),
        (lambda d: d.update(widgets=[]), "merge", "unknown section(s): widgets"),
        (
            lambda d: d["sensors"].append(dict(d["sensors"][0])),
            "merge",
            "duplicate entity_id",
        ),
        (
            lambda d: d["sensors"][0].update(area="nope"),
            "merge",
            "area 'nope' which does not exist",
        ),
        (lambda d: d.update(areas=[]), "replace", "at least one area"),
    ],
)
async def test_preview_rejects_invalid_data(
    hass: Any,
    hass_storage: Any,
    hass_ws_client: Any,
    tmp_path: Any,
    mutate,
    mode,
    expected,
) -> None:
    """Invalid files are reported with a clear reason, never applied."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    data = copy.deepcopy(env["data"])
    mutate(data)
    client = await hass_ws_client(hass)
    res = (
        await _ws(
            client,
            1,
            type="alarmo/ext/import/preview",
            content=_export_text(data),
            mode=mode,
        )
    )["result"]
    assert not res["ok"]
    assert any(expected in e for e in res["errors"]), res["errors"]


@pytest.mark.parametrize(
    ("content", "expected"),
    [
        ("", "empty"),
        ("just: some: yaml: [", "not valid"),
        ("hello: world\n", "no header"),
        (
            json.dumps(
                {"key": "alarmo.storage", "version": 7, "minor_version": 1, "data": {}}
            ),
            "newer",
        ),
        ("alarmo_export_version: 99\ndata: {}\n", "not supported"),
    ],
)
async def test_preview_rejects_bad_files(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any, content, expected
) -> None:
    """Unusable files give a readable error."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    res = (
        await _ws(
            client, 1, type="alarmo/ext/import/preview", content=content, mode="merge"
        )
    )["result"]
    assert not res["ok"]
    assert any(expected in e for e in res["errors"]), res["errors"]


async def test_preview_storage_file_and_old_version_migrates(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Raw alarmo.storage files (incl. older 6.1) are accepted."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    client = await hass_ws_client(hass)
    res = (
        await _ws(
            client,
            1,
            type="alarmo/ext/import/preview",
            content=json.dumps(env),
            mode="replace",
        )
    )["result"]
    assert res["ok"] and res["format"] == "storage" and res["total_changes"] == 0

    old = copy.deepcopy(env)
    old["minor_version"] = 1
    for u in old["data"]["users"]:
        u["is_admin"] = False
    res = (
        await _ws(
            client,
            2,
            type="alarmo/ext/import/preview",
            content=json.dumps(old),
            mode="replace",
        )
    )["result"]
    assert res["ok"], res
    assert res["source_version"] == "6.1"


async def test_apply_merge_writes_reloads_and_keeps_codes(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Apply = backup first, write upstream-compatible data, reload, codes intact."""
    env = load_fixture_envelope()
    entry = await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    hass.states.async_set("binary_sensor.new_door", "off")
    content = _export_text(_modified(env))
    client = await hass_ws_client(hass)
    prev = (
        await _ws(
            client, 1, type="alarmo/ext/import/preview", content=content, mode="merge"
        )
    )["result"]
    msg = await _ws(
        client,
        2,
        type="alarmo/ext/import/apply",
        content=content,
        mode="merge",
        token=prev["token"],
    )
    assert msg["success"], msg
    res = msg["result"]
    assert res["backup"]["name"].endswith("_pre-import")
    assert res["total_changes"] == 3
    await hass.async_block_till_done()

    # pre-import backup holds the OLD configuration
    ext = hass.data["alarmo_ext"]
    old_yaml = await ext.backups.async_read(res["backup"]["files"]["yaml"]["file"])
    assert yaml.safe_load(old_yaml)["data"] == env["data"]

    stored = hass_storage["alarmo.storage"]
    assert (stored["version"], stored["minor_version"]) == (6, 3)
    sensors = {s["entity_id"]: s for s in stored["data"]["sensors"]}
    assert sensors["binary_sensor.front_door"]["modes"] == ["armed_away"]
    assert "binary_sensor.new_door" in sensors
    assert stored["data"]["users"] == env["data"]["users"]  # hashes untouched
    await assert_upstream_round_trip(hass, stored)

    # Alarmo reloaded and works: entities exist, PINs authenticate
    assert entry.state.value == "loaded"
    assert hass.states.get("alarm_control_panel.ground_floor") is not None
    coordinator = hass.data["alarmo"]["coordinator"]
    for name, code in FIXTURE_CODES.items():
        user = await coordinator.async_authenticate_user(code)
        assert user and user["name"] == name


async def test_restore_backup_replace_round_trip(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Restoring a backup (replace) brings the old configuration back exactly."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    client = await hass_ws_client(hass)
    first = (await _ws(client, 1, type="alarmo/ext/backup/create", label="good"))[
        "result"
    ]

    msg = await _ws(
        client,
        2,
        type="alarmo/ext/sensors/apply_changes",
        delete=["binary_sensor.front_door", "binary_sensor.back_door"],
    )
    assert msg["success"], msg
    assert (
        len(hass_storage["alarmo.storage"]["data"]["sensors"])
        == len(env["data"]["sensors"]) - 2
    )

    prev = (
        await _ws(
            client,
            3,
            type="alarmo/ext/import/preview",
            backup_name=first["name"],
            mode="replace",
        )
    )["result"]
    assert [a["id"] for a in prev["sections"]["sensors"]["added"]] == [
        "binary_sensor.front_door",
        "binary_sensor.back_door",
    ]
    msg = await _ws(
        client,
        4,
        type="alarmo/ext/import/apply",
        backup_name=first["name"],
        mode="replace",
        token=prev["token"],
    )
    assert msg["success"], msg
    await hass.async_block_till_done()
    restored = hass_storage["alarmo.storage"]["data"]
    assert {s["entity_id"] for s in restored["sensors"]} == {
        s["entity_id"] for s in env["data"]["sensors"]
    }
    assert sorted(json.dumps(s, sort_keys=True) for s in restored["sensors"]) == sorted(
        json.dumps(s, sort_keys=True) for s in env["data"]["sensors"]
    )


async def test_apply_refuses_stale_preview(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """If the config changed after the preview, apply refuses."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    content = _export_text(_modified(env))
    client = await hass_ws_client(hass)
    prev = (
        await _ws(
            client, 1, type="alarmo/ext/import/preview", content=content, mode="merge"
        )
    )["result"]
    await _ws(
        client,
        2,
        type="alarmo/ext/sensors/apply_changes",
        delete=["binary_sensor.shed_door"],
    )
    msg = await _ws(
        client,
        3,
        type="alarmo/ext/import/apply",
        content=content,
        mode="merge",
        token=prev["token"],
    )
    assert not msg["success"]
    assert "preview again" in msg["error"]["message"]


async def test_apply_blocked_while_armed(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Import/restore is refused while any area is armed; no backup is made."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    await hass.services.async_call(
        "alarm_control_panel",
        "alarm_arm_home",
        {"entity_id": "alarm_control_panel.ground_floor", "code": "1234"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert hass.states.get("alarm_control_panel.ground_floor").state == "armed_home"

    content = _export_text(_modified(env))
    client = await hass_ws_client(hass)
    prev = (
        await _ws(
            client, 1, type="alarmo/ext/import/preview", content=content, mode="merge"
        )
    )["result"]
    assert prev["blocked_by"] and "ground_floor" in prev["blocked_by"][0]
    msg = await _ws(
        client,
        2,
        type="alarmo/ext/import/apply",
        content=content,
        mode="merge",
        token=prev["token"],
    )
    assert not msg["success"]
    assert msg["error"]["code"] == "blocked"
    assert await hass.data["alarmo_ext"].backups.async_list() == []
    assert hass_storage["alarmo.storage"]["data"] == env["data"]


async def test_extras_in_backup_and_restore(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Backups carry the ext settings; restoring a backup brings them back (not runtime state)."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    ext = hass.data["alarmo_ext"]
    await ext.house.async_save_settings(
        {"enabled": True, "modes": [{"id": "stay", "name": "Stay", "targets": {}}]}
    )
    await ext.panel.async_save_settings(
        {"monitored": True, "zone_trip": {"binary_sensor.front_door": "none"}}
    )
    client = await hass_ws_client(hass)
    good = (await _ws(client, 1, type="alarmo/ext/backup/create", label="good"))[
        "result"
    ]
    assert "extras" in good["files"]
    exp = yaml.safe_load(
        (await _ws(client, 2, type="alarmo/ext/export"))["result"]["content"]
    )
    assert exp["extras"]["panel"]["monitored"] is True

    await ext.house.async_save_settings({"enabled": False, "modes": []})
    await ext.panel.async_save_settings({})
    prev = (
        await _ws(
            client,
            3,
            type="alarmo/ext/import/preview",
            backup_name=good["name"],
            mode="replace",
        )
    )["result"]
    assert prev["ok"], prev["errors"]
    assert prev["extras_included"] is True
    assert {c["key"] for c in prev["extras_changes"]} == {"panel", "house"}
    res = await _ws(
        client,
        4,
        type="alarmo/ext/import/apply",
        backup_name=good["name"],
        mode="replace",
        token=prev["token"],
    )
    assert res["success"], res
    await hass.async_block_till_done()
    assert ext.panel.settings["monitored"] is True
    assert (
        ext.house.settings["enabled"] is True
        and ext.house.settings["modes"][0]["name"] == "Stay"
    )
    assert hass_storage["alarmo_extras"]["data"]["panel"]["zone_trip"] == {
        "binary_sensor.front_door": "none"
    }


async def test_old_backup_without_extras_keeps_current_extras(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """A plain alarmo.storage import leaves the ext settings alone."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    ext = hass.data["alarmo_ext"]
    await ext.panel.async_save_settings({"monitored": True})
    client = await hass_ws_client(hass)
    prev = (
        await _ws(
            client,
            1,
            type="alarmo/ext/import/preview",
            content=json.dumps(env),
            mode="replace",
        )
    )["result"]
    assert prev["extras_included"] is False and prev["extras_changes"] == []
    assert ext.panel.settings["monitored"] is True


async def test_bad_extras_rejected(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Invalid ext settings in a YAML file are reported, nothing applied."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    doc = yaml.safe_load(_export_text(env["data"]))
    doc["extras"] = {"panel": {"links": {"x": {"panel_entity": "light.nope"}}}}
    client = await hass_ws_client(hass)
    prev = (
        await _ws(
            client,
            1,
            type="alarmo/ext/import/preview",
            content=yaml_io.dump_yaml(doc),
            mode="merge",
        )
    )["result"]
    assert not prev["ok"] and any(e.startswith("extras:") for e in prev["errors"])
