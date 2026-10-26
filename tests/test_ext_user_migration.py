# ruff: noqa: E501
"""The author's migration file (configs/) imports cleanly over the author's backup."""

import json
from typing import Any
from pathlib import Path

import pytest

from tests.ext_helpers import setup_real_alarmo, assert_upstream_round_trip

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

CFG = Path(__file__).parent.parent / "configs"
BACKUP = CFG / "alarmo_2026-10-08_130745_sensor-table.storage.json"
MIGRATED = CFG / "alarmo_migrated_one_partition.yaml"
MINIMAL = CFG / "alarmo_migrated_one_partition_minimal.yaml"


@pytest.mark.parametrize(("path", "added"), [(MIGRATED, 2), (MINIMAL, 0)])
async def test_user_migration(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any, path, added) -> None:
    """Replace-import: one partition 'Master' -> alarm_control_panel.master; zones kept."""
    if not (BACKUP.exists() and path.exists()):
        pytest.skip("user config files not present")
    env = json.loads(BACKUP.read_text())
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    assert hass.states.get("alarm_control_panel.master") is not None  # today: the Master entity
    client = await hass_ws_client(hass)
    content = path.read_text()
    await client.send_json({"id": 1, "type": "alarmo/ext/import/preview", "content": content, "mode": "replace"})
    prev = (await client.receive_json())["result"]
    assert prev["ok"], prev["errors"]
    assert prev["summary"]["areas"] == {"added": 1, "changed": 0, "removed": 8}
    assert prev["summary"]["sensors"]["added"] == added  # the two garage doors (or none)
    assert prev["summary"]["sensors"]["removed"] == 0
    await client.send_json({"id": 2, "type": "alarmo/ext/import/apply", "content": content, "mode": "replace", "token": prev["token"]})
    res = await client.receive_json()
    assert res["success"], res
    await hass.async_block_till_done()

    data = hass_storage["alarmo.storage"]["data"]
    assert [a["name"] for a in data["areas"]] == ["Master"]
    area = data["areas"][0]["area_id"]
    old = {s["entity_id"]: s for s in env["data"]["sensors"]}
    new = {s["entity_id"]: s for s in data["sensors"]}
    for eid, s in old.items():  # every zone kept its modes/options, only the partition changed
        assert {**s, "area": area} == new[eid]
    st = hass.states.get("alarm_control_panel.master")
    assert st is not None and st.state == "disarmed"
    assert len([e for e in hass.states.async_entity_ids("alarm_control_panel")]) == 1
    assert all(t["area"] == area for a in data["automations"] for t in a["triggers"] if "event" in t)
    await assert_upstream_round_trip(hass, hass_storage["alarmo.storage"])
