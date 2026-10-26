"""Task 6: batched sensor-table saves."""

from typing import Any

import pytest

from tests.ext_helpers import (
    setup_real_alarmo,
    load_fixture_envelope,
    assert_upstream_round_trip,
)

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF, UP, GAR = "1700000001", "1700000002", "1700000003"


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


def _sensors(hass_storage) -> dict[str, dict]:
    return {
        s["entity_id"]: s for s in hass_storage["alarmo.storage"]["data"]["sensors"]
    }


async def test_mixed_batch_applies_with_one_backup(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Create + update + delete in one call; one backup; upstream-compatible."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    hass.states.async_set("binary_sensor.porch_motion", "off")
    updates = [
        {
            "entity_id": f"binary_sensor.gf_window_{i}",
            "changes": {"modes": ["armed_away"]},
        }
        for i in range(1, 7)
    ] + [
        {
            "entity_id": "binary_sensor.office_motion",
            "changes": {"enabled": True, "area": GF},
        },
        {"entity_id": "binary_sensor.living_motion", "changes": {"group": None}},
        {
            "entity_id": "binary_sensor.dining_motion",
            "changes": {"group": "1700000301"},
        },
    ]
    client = await hass_ws_client(hass)
    msg = await _ws(
        client,
        1,
        type="alarmo/ext/sensors/apply_changes",
        create=[
            {
                "entity_id": "binary_sensor.porch_motion",
                "area": GAR,
                "type": "motion",
                "modes": ["armed_away"],
                "allow_open": True,
            }
        ],
        update=updates,
        delete=["binary_sensor.shed_door"],
    )
    assert msg["success"], msg
    res = msg["result"]
    assert (res["created"], res["updated"], res["deleted"]) == (1, 9, 1)
    assert res["backup"]["name"].endswith("_sensor-table")
    assert len(await hass.data["alarmo_ext"].backups.async_list()) == 1

    s = _sensors(hass_storage)
    assert "binary_sensor.shed_door" not in s
    assert s["binary_sensor.porch_motion"]["area"] == GAR
    assert s["binary_sensor.porch_motion"]["allow_open"] is True
    assert s["binary_sensor.porch_motion"]["use_entry_delay"] is True  # default filled
    assert all(
        s[f"binary_sensor.gf_window_{i}"]["modes"] == ["armed_away"]
        for i in range(1, 7)
    )
    assert s["binary_sensor.office_motion"]["enabled"] is True
    assert s["binary_sensor.office_motion"]["area"] == GF

    groups = {
        g["group_id"]: g
        for g in hass_storage["alarmo.storage"]["data"]["sensor_groups"]
    }
    assert set(groups["1700000301"]["entities"]) == {
        "binary_sensor.hall_motion",
        "binary_sensor.dining_motion",
    }
    await assert_upstream_round_trip(hass, hass_storage["alarmo.storage"])

    # live handler picked up the change: sensor list served to the old UI too
    coordinator = hass.data["alarmo"]["coordinator"]
    assert "binary_sensor.porch_motion" in coordinator.store.async_get_sensors()


@pytest.mark.parametrize(
    ("batch", "expected"),
    [
        (
            {"create": [{"entity_id": "binary_sensor.front_door", "area": GF}]},
            "already configured",
        ),
        ({"create": [{"entity_id": "binary_sensor.zz"}]}, "an area is required"),
        (
            {"create": [{"entity_id": "binary_sensor.zz", "area": "nope"}]},
            "unknown area",
        ),
        (
            {"update": [{"entity_id": "binary_sensor.zz", "changes": {}}]},
            "not configured",
        ),
        (
            {
                "update": [
                    {"entity_id": "binary_sensor.front_door", "changes": {"group": "x"}}
                ]
            },
            "unknown sensor group",
        ),
        ({"delete": ["binary_sensor.zz"]}, "not configured"),
        (
            {
                "delete": ["binary_sensor.front_door"],
                "update": [{"entity_id": "binary_sensor.front_door", "changes": {}}],
            },
            "more than once",
        ),
        ({}, "no changes"),
    ],
)
async def test_invalid_batch_changes_nothing(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any, batch, expected
) -> None:
    """One bad item rejects the whole batch; no backup, no write."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    good = {"entity_id": "binary_sensor.back_door", "changes": {"modes": []}}
    batch = {**batch, "update": [*batch.get("update", []), good]} if batch else batch
    client = await hass_ws_client(hass)
    msg = await _ws(client, 1, type="alarmo/ext/sensors/apply_changes", **batch)
    assert not msg["success"]
    assert expected in msg["error"]["message"], msg
    assert hass_storage["alarmo.storage"]["data"] == env["data"]
    assert await hass.data["alarmo_ext"].backups.async_list() == []


async def test_schema_rejects_unknown_fields(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Fields upstream does not know can never reach the store."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    msg = await _ws(
        client,
        1,
        type="alarmo/ext/sensors/apply_changes",
        update=[{"entity_id": "binary_sensor.front_door", "changes": {"label": "x"}}],
    )
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"


async def test_sensor_changes_allowed_while_armed(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Like upstream's own sensor editor, saving is not blocked while armed."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    await hass.services.async_call(
        "alarm_control_panel",
        "alarm_arm_home",
        {"entity_id": "alarm_control_panel.ground_floor", "code": "1234"},
        blocking=True,
    )
    client = await hass_ws_client(hass)
    msg = await _ws(
        client,
        1,
        type="alarmo/ext/sensors/apply_changes",
        update=[
            {"entity_id": "binary_sensor.back_door", "changes": {"enabled": False}}
        ],
    )
    assert msg["success"], msg
    assert hass.states.get("alarm_control_panel.ground_floor").state == "armed_home"
