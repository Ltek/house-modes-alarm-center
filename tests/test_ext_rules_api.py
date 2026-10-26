"""Tasks 3, 5, 6: zone rules with real HA registries, overrides, preview/apply."""

from typing import Any

import pytest
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from tests.helpers import advance_time
from tests.ext_helpers import (
    setup_real_alarmo,
    load_fixture_envelope,
    assert_upstream_round_trip,
)

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

GF, UP = "1700000001", "1700000002"
WIN1 = "binary_sensor.gf_window_1"
WIN2 = "binary_sensor.gf_window_2"
NEW = "binary_sensor.new_window"


async def _ws(client, msg_id: int, **cmd) -> dict:
    await client.send_json({"id": msg_id, **cmd})
    return await client.receive_json()


def _sensors(hass_storage) -> dict[str, dict]:
    return {
        s["entity_id"]: s for s in hass_storage["alarmo.storage"]["data"]["sensors"]
    }


async def _setup(hass, hass_storage, tmp_path):
    """Alarmo + registries: floor ground > area kitchen; labels perimeter/interior."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    floor = fr.async_get(hass).async_create("Ground")
    area = ar.async_get(hass).async_create("Kitchen", floor_id=floor.floor_id)
    labels = lr.async_get(hass)
    perim = labels.async_create("Perimeter")
    interior = labels.async_create("Interior")
    other = MockConfigEntry(domain="test")
    other.add_to_hass(hass)
    ents = er.async_get(hass)
    for eid in (WIN1, WIN2, NEW):
        hass.states.async_remove(eid)  # else the registry picks "<id>_2"
        entry = ents.async_get_or_create(
            "binary_sensor",
            "test",
            eid,
            suggested_object_id=eid.split(".")[1],
            config_entry=other,
        )
        assert entry.entity_id == eid
        hass.states.async_set(eid, "off", {"device_class": "window"})
    await hass.async_block_till_done()
    return {
        "env": env,
        "floor": floor.floor_id,
        "area": area.id,
        "perimeter": perim.label_id,
        "interior": interior.label_id,
        "entry": other,
    }


def _rule(name, *, labels=(), areas=(), floors=(), **sets):
    return {
        "name": name,
        "match": {"labels": list(labels), "areas": list(areas), "floors": list(floors)},
        "set": sets,
    }


async def test_save_rule_validates_references(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Unknown labels/partitions are refused; valid rules get an id and persist."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    bad = await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule("x", labels=["nope"], modes=["armed_away"]),
    )
    assert not bad["success"] and "unknown label 'nope'" in bad["error"]["message"]
    bad = await _ws(
        client,
        2,
        type="alarmo/ext/rules/save",
        rule=_rule("x", labels=[ctx["perimeter"]], partition="999"),
    )
    assert "unknown partition" in bad["error"]["message"]
    bad = await _ws(
        client, 3, type="alarmo/ext/rules/save", rule=_rule("x", modes=["armed_away"])
    )
    assert not bad["success"]

    ok = await _ws(
        client,
        4,
        type="alarmo/ext/rules/save",
        rule=_rule("Perimeter", labels=[ctx["perimeter"]], modes=["armed_away"]),
    )
    assert ok["success"], ok
    rid = ok["result"]["id"]
    stored = hass_storage["alarmo_extras"]["data"]["rules"]
    assert [r["id"] for r in stored] == [rid]
    listed = (await _ws(client, 5, type="alarmo/ext/rules/list"))["result"]
    assert listed["rules"][0]["name"] == "Perimeter"

    upd = await _ws(
        client,
        6,
        type="alarmo/ext/rules/save",
        rule={**ok["result"], "name": "Perimeter doors"},
    )
    assert upd["success"] and upd["result"]["id"] == rid
    assert (await _ws(client, 7, type="alarmo/ext/rules/delete", rule_id=rid))[
        "success"
    ]
    assert hass_storage["alarmo_extras"]["data"]["rules"] == []


async def test_preview_then_apply_with_one_backup(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Label changes are pending until Apply; Apply backs up once and writes."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass)
    events = []
    hass.bus.async_listen("alarmo_ext_rules_pending", lambda e: events.append(e.data))

    await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule("Perimeter", labels=[ctx["perimeter"]], modes=["armed_away"]),
    )
    prev = (await _ws(client, 2, type="alarmo/ext/rules/preview"))["result"]
    assert prev["total_changes"] == 0  # no entity has the label yet

    er.async_get(hass).async_update_entity(WIN1, labels={ctx["perimeter"]})
    await advance_time(hass, 3)  # debounce
    assert events and events[-1]["count"] == 1

    prev = (await _ws(client, 3, type="alarmo/ext/rules/preview"))["result"]
    assert prev["update"] == [{"entity_id": WIN1, "changes": {"modes": ["armed_away"]}}]
    assert prev["zones"][WIN1]["sources"]["modes"]["kind"] == "rule"
    assert _sensors(hass_storage)[WIN1]["modes"] != [
        "armed_away"
    ]  # nothing written yet

    stale = await _ws(client, 4, type="alarmo/ext/rules/apply", token="x")
    assert not stale["success"] and "preview again" in stale["error"]["message"]

    res = await _ws(client, 5, type="alarmo/ext/rules/apply", token=prev["token"])
    assert res["success"], res
    assert res["result"]["backup"]["name"].endswith("_rules")
    assert len(await hass.data["alarmo_ext"].backups.async_list()) == 1
    assert _sensors(hass_storage)[WIN1]["modes"] == ["armed_away"]
    await assert_upstream_round_trip(hass, hass_storage["alarmo.storage"])

    again = (await _ws(client, 6, type="alarmo/ext/rules/preview"))["result"]
    assert again["total_changes"] == 0
    nothing = await _ws(client, 7, type="alarmo/ext/rules/apply", token=again["token"])
    assert not nothing["success"]


async def test_new_zone_from_area_and_device_labels(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Entity in area Kitchen + device label -> new zone in the partition (on apply)."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    devs = dr.async_get(hass)
    dev = devs.async_get_or_create(
        config_entry_id=ctx["entry"].entry_id, identifiers={("test", "w")}
    )
    devs.async_update_device(dev.id, labels={ctx["perimeter"]}, area_id=ctx["area"])
    er.async_get(hass).async_update_entity(NEW, device_id=dev.id)
    client = await hass_ws_client(hass)

    await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule(
            "Perimeter", labels=[ctx["perimeter"]], modes=["armed_home", "armed_away"]
        ),
    )
    prev = (await _ws(client, 2, type="alarmo/ext/rules/preview"))["result"]
    assert prev["needs_partition"] == [NEW] and prev["create"] == []

    await _ws(
        client,
        3,
        type="alarmo/ext/rules/save",
        rule=_rule("Ground floor", floors=[ctx["floor"]], partition=GF),
    )
    prev = (await _ws(client, 4, type="alarmo/ext/rules/preview"))["result"]
    assert prev["create"] == [
        {
            "entity_id": NEW,
            "modes": ["armed_away", "armed_home"],
            "area": GF,
            "type": "window",
        }
    ]
    res = await _ws(client, 5, type="alarmo/ext/rules/apply", token=prev["token"])
    assert res["success"], res
    s = _sensors(hass_storage)[NEW]
    assert s["area"] == GF and s["type"] == "window" and s["use_entry_delay"] is True
    await assert_upstream_round_trip(hass, hass_storage["alarmo.storage"])


async def test_conflict_reported_and_not_applied(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Equal-specificity rules setting different partitions -> conflict."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    er.async_get(hass).async_update_entity(
        WIN1, labels={ctx["perimeter"], ctx["interior"]}
    )
    client = await hass_ws_client(hass)
    await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule("A", labels=[ctx["perimeter"]], partition=GF),
    )
    await _ws(
        client,
        2,
        type="alarmo/ext/rules/save",
        rule=_rule("B", labels=[ctx["interior"]], partition=UP),
    )
    prev = (await _ws(client, 3, type="alarmo/ext/rules/preview"))["result"]
    assert [c["entity_id"] for c in prev["conflicts"]] == [WIN1]
    assert prev["conflicts"][0]["field"] == "area"
    assert prev["total_changes"] == 0


async def test_zone_table_edit_becomes_override(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Editing a rule-managed field records an override; clearing reverts on apply."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    er.async_get(hass).async_update_entity(WIN1, labels={ctx["perimeter"]})
    client = await hass_ws_client(hass)
    await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule("Perimeter", labels=[ctx["perimeter"]], modes=["armed_away"]),
    )
    prev = (await _ws(client, 2, type="alarmo/ext/rules/preview"))["result"]
    await _ws(client, 3, type="alarmo/ext/rules/apply", token=prev["token"])

    # manual edit of the rule-managed field (modes) + an unmanaged field (enabled)
    msg = await _ws(
        client,
        4,
        type="alarmo/ext/sensors/apply_changes",
        update=[
            {"entity_id": WIN1, "changes": {"modes": ["armed_night"], "enabled": False}}
        ],
    )
    assert msg["success"], msg
    ovr = hass_storage["alarmo_extras"]["data"]["overrides"]
    assert ovr == {WIN1: {"modes": ["armed_night"]}}
    prev = (await _ws(client, 5, type="alarmo/ext/rules/preview"))["result"]
    assert prev["total_changes"] == 0
    assert prev["zones"][WIN1]["sources"]["modes"]["kind"] == "override"

    msg = await _ws(
        client, 6, type="alarmo/ext/overrides/clear", entity_id=WIN1, field="modes"
    )
    assert msg["success"] and msg["result"]["overrides"] == {}
    prev = (await _ws(client, 7, type="alarmo/ext/rules/preview"))["result"]
    assert prev["update"] == [{"entity_id": WIN1, "changes": {"modes": ["armed_away"]}}]

    bad = await _ws(client, 8, type="alarmo/ext/overrides/clear", entity_id=WIN1)
    assert not bad["success"]


async def test_deleting_zone_drops_its_overrides(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """Overrides do not outlive their zone."""
    ctx = await _setup(hass, hass_storage, tmp_path)
    er.async_get(hass).async_update_entity(WIN1, labels={ctx["perimeter"]})
    client = await hass_ws_client(hass)
    await _ws(
        client,
        1,
        type="alarmo/ext/rules/save",
        rule=_rule("Perimeter", labels=[ctx["perimeter"]], modes=["armed_away"]),
    )
    await _ws(
        client,
        2,
        type="alarmo/ext/sensors/apply_changes",
        update=[{"entity_id": WIN1, "changes": {"modes": ["armed_night"]}}],
    )
    assert WIN1 in hass_storage["alarmo_extras"]["data"]["overrides"]
    await _ws(client, 3, type="alarmo/ext/sensors/apply_changes", delete=[WIN1])
    assert hass_storage["alarmo_extras"]["data"]["overrides"] == {}


async def test_ext1_extras_still_load(
    hass: Any, hass_storage: Any, tmp_path: Any
) -> None:
    """An alarmo_extras from ext.1 (retention only) gets rule defaults."""
    hass_storage["alarmo_extras"] = {
        "version": 1,
        "key": "alarmo_extras",
        "data": {"retention_days": 9},
    }
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    extras = hass.data["alarmo_ext"].extras
    assert extras.retention_days == 9
    assert extras.data["rules"] == [] and extras.data["overrides"] == {}


async def test_rule_commands_require_admin(
    hass: Any,
    hass_storage: Any,
    hass_ws_client: Any,
    hass_read_only_access_token: str,
    tmp_path: Any,
) -> None:
    """All rule commands are admin-only."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass, hass_read_only_access_token)
    cmds = [
        {"type": "alarmo/ext/rules/list"},
        {"type": "alarmo/ext/rules/save", "rule": {}},
        {"type": "alarmo/ext/rules/delete", "rule_id": "x"},
        {"type": "alarmo/ext/rules/preview"},
        {"type": "alarmo/ext/rules/apply", "token": "x"},
        {"type": "alarmo/ext/overrides/list"},
        {"type": "alarmo/ext/overrides/clear", "entity_id": WIN1},
    ]
    for i, cmd in enumerate(cmds, start=1):
        msg = await _ws(client, i, **cmd)
        assert msg["error"]["code"] == "unauthorized", cmd
