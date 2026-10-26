# ruff: noqa: E501
"""ext.12: Alarmo Users <-> lock code slots and per-User keypad actions."""

from typing import Any

import pytest
import voluptuous as vol
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.alarmo import lock_codes as lc
from tests.test_ext_house_modes import GF, GAR, E_GF, E_GAR, _setup, _state, _settle

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")

ALICE, BOB, GUEST = "1700000101", "1700000102", "1700000103"
FRONT = "lock.front_door_deadbolt"


# ------------------------------------------------------------------ pure logic


def test_parse_usercodes_shapes() -> None:
    """Library list, service mapping and wrapped mapping all normalise."""
    lib = [
        {"code_slot": 2, "usercode": "1234", "in_use": True, "name": "User Code (2)"},
        {"code_slot": 1, "usercode": "", "in_use": False},
    ]
    assert [s["slot"] for s in lc.parse_usercodes(lib)] == [1, 2]
    svc = {FRONT: {"3": {"usercode": "5555", "in_use": True}}}
    assert lc.parse_usercodes(svc) == [{"slot": 3, "in_use": True, "code": "5555", "name": ""}]
    assert lc.parse_usercodes({"4": {"usercode": "**********", "in_use": True}})[0]["slot"] == 4


def test_parse_users_credential_lock() -> None:
    """User Credential locks: PIN credentials become slots with the lock's user name."""
    raw = {
        FRONT: {
            "max_users": 10,
            "users": [
                {
                    "user_id": 1,
                    "user_name": "Anna",
                    "active": True,
                    "credentials": [{"type": "pin_code", "slot": 1, "data": "2468"}, {"type": "rfid_code", "slot": 1}],
                }
            ],
        }
    }
    assert lc.parse_users(raw) == [{"slot": 1, "in_use": True, "code": "2468", "name": "Anna", "lock_user_id": 1}]


def test_usable_code_and_sync() -> None:
    """Masked or empty codes are unknown; bcrypt decides in sync / different."""
    h = lc.hash_code("1234", rounds=4)
    user = {"enabled": True, "code": h}
    assert lc.usable_code("****") is None and lc.usable_code(" 1234 ") == "1234"
    assert lc.sync_status(user, {"in_use": True, "code": "1234"}) == "in_sync"
    assert lc.sync_status(user, {"in_use": True, "code": "4321"}) == "different"
    assert lc.sync_status(user, {"in_use": False, "code": ""}) == "empty"
    assert lc.sync_status(user, {"in_use": True, "code": "****"}) == "unknown"
    assert lc.sync_status({**user, "enabled": False}, {"in_use": True, "code": "1234"}) == "user_disabled"
    assert lc.sync_status(None, None) == "no_user"


def test_links_unique_and_names() -> None:
    """A slot can be linked once; names get a suffix."""
    s = lc.normalize({})
    s = lc.set_link(s, "a", FRONT, 2)
    s = lc.set_link(s, "b", FRONT, 2)
    assert s["links"] == [{"user_id": "b", "entity_id": FRONT, "slot": 2}]
    with pytest.raises(vol.Invalid):
        lc.normalize({"links": [{"user_id": "a", "entity_id": FRONT, "slot": 1}] * 2})
    assert lc.unique_name("Alice", {"alice", "Alice (2)"}) == "Alice (3)"


def test_plan_permissions() -> None:
    """Partition targets need Can arm / Can disarm and the partition limit; a House Mode only needs an enabled user."""
    guest = {"enabled": True, "can_arm": True, "can_disarm": False, "area_limit": [GF]}
    p = lc.plan(guest, {"house_mode": None, "targets": {GF: "armed_away", GAR: "armed_away"}})
    assert p["targets"] == {GF: "armed_away"} and GAR in p["denied"]
    lock_only = {"enabled": True, "can_arm": False, "can_disarm": False, "area_limit": []}
    p = lc.plan(lock_only, {"house_mode": "disarmed", "targets": {GF: "disarmed"}})
    assert p["house_mode"] == "disarmed" and p["targets"] == {} and "may not disarm" in p["denied"][GF]
    p = lc.plan({**guest, "enabled": False}, {"house_mode": "stay", "targets": {GF: "armed_home"}})
    assert p["house_mode"] is None and p["targets"] == {}


# ------------------------------------------------------------------ with Alarmo


def _add_lock(hass, node=138, entity="front_door_deadbolt", name="Front Door"):
    zentry = MockConfigEntry(domain="zwave_js")
    zentry.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(
        config_entry_id=zentry.entry_id, identifiers={("zwave_js", f"3967-{node}")}
    )
    er.async_get(hass).async_get_or_create(
        "lock", "zwave_js", f"3967.{node}-98-0-x", device_id=dev.id, config_entry=zentry, suggested_object_id=entity
    )
    hass.states.async_set(f"lock.{entity}", "locked", {"friendly_name": name})


class FakeLock:
    """Slots of fake locks; records writes."""

    def __init__(self, slots: dict[str, dict[int, str]]) -> None:  # noqa: D107
        self.slots = slots
        self.writes: list[tuple] = []

    async def read(self, entity_id):  # noqa: D102
        if entity_id not in self.slots:
            return None, "unknown"
        return [
            {"slot": n, "in_use": bool(c), "code": c, "name": ""} for n, c in sorted(self.slots[entity_id].items())
        ], "code_slots"

    async def write(self, entity_id, slot, code):  # noqa: D102
        self.writes.append((entity_id, slot, code))
        self.slots.setdefault(entity_id, {})[slot] = code or ""


async def _locks(hass, hass_storage, tmp_path, slots):
    house = await _setup(hass, hass_storage, tmp_path)
    _add_lock(hass)
    mgr = hass.data["alarmo_ext"].locks
    fake = FakeLock(slots)
    mgr.reader, mgr.writer = fake.read, fake.write
    return house, mgr, fake


async def _ws(client, i, **msg):
    await client.send_json({"id": i, **msg})
    return await client.receive_json()


async def test_read_import_links_and_creates(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Import: Alice's PIN links to Alice; an unknown PIN becomes a new User (hashed)."""
    _house, mgr, _fake = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "1234", 2: "5555", 3: ""}})
    client = await hass_ws_client(hass)
    res = (await _ws(client, 1, type="alarmo/ext/locks/read", entity_id=FRONT))["result"]
    assert [(r["slot"], r["in_use"], r["match_user_id"]) for r in res["slots"]] == [
        (1, True, ALICE),
        (2, True, None),
        (3, False, None),
    ]
    assert "5555" not in str(res) and "1234" not in str(res)
    out = (
        await _ws(
            client,
            2,
            type="alarmo/ext/locks/import",
            entity_id=FRONT,
            slots=[{"slot": 1}, {"slot": 2, "name": "Cleaner"}, {"slot": 3}],
        )
    )["result"]["results"]
    assert [r["result"] for r in out] == ["linked", "created", "error"]
    users = mgr.users()
    new = users[out[1]["user_id"]]
    assert new["name"] == "Cleaner" and new["code"] != "5555" and lc.check_code("5555", new["code"])
    assert new["can_arm"] is False and new["can_disarm"] is False  # lock-only
    assert "5555" not in str(hass_storage)
    res = (await _ws(client, 3, type="alarmo/ext/locks/read", entity_id=FRONT))["result"]
    assert {r["slot"]: r["status"] for r in res["slots"]} == {1: "in_sync", 2: "in_sync", 3: None}


async def test_import_two_users_same_second(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Several new Users created at once get distinct ids."""
    _house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {FRONT: {4: "1111", 5: "2222"}})
    out = await mgr.async_import(FRONT, [{"slot": 4}, {"slot": 5}])
    assert len({r["user_id"] for r in out}) == 2 and len(mgr.settings["links"]) == 2


async def test_push_and_clear_code(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """A verified code is written to the linked slots; a wrong one is refused; clear empties."""
    _house, mgr, fake = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "0000"}})
    await mgr.async_link(FRONT, 1, ALICE)
    client = await hass_ws_client(hass)
    bad = await _ws(client, 1, type="alarmo/ext/locks/push_code", user_id=ALICE, code="9999")
    assert not bad["success"] and fake.writes == []
    ok = (await _ws(client, 2, type="alarmo/ext/locks/push_code", user_id=ALICE, code="1234"))["result"]["results"]
    assert ok[0]["result"] == "ok" and fake.writes == [(FRONT, 1, "1234")]
    await _ws(client, 3, type="alarmo/ext/locks/clear", user_id=ALICE, unlink=True)
    assert fake.writes[-1] == (FRONT, 1, None) and mgr.settings["links"] == []


async def test_keypad_unlock_runs_user_action(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Unlock with Alice's slot → House Mode Stay, garage target wins (away); event fired."""
    house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "1234"}})
    await mgr.async_link(FRONT, 1, ALICE)
    client = await hass_ws_client(hass)
    r = await _ws(
        client,
        1,
        type="alarmo/ext/locks/actions",
        user_id=ALICE,
        unlock={"house_mode": "stay", "targets": {GAR: "armed_away"}},
    )
    assert r["success"], r
    events = []
    hass.bus.async_listen("alarmo_keypad_used", lambda e: events.append(e.data))
    hass.bus.async_fire(
        "zwave_js_notification", {"node_id": 138, "event_label": "Keypad unlock operation", "parameters": {"userId": 1}}
    )
    await _settle(hass)
    assert house.settings["current"] == "stay" and house.settings["source"] == "lock"
    assert _state(hass, E_GF) in ("armed_home", "arming")
    assert _state(hass, E_GAR) in ("armed_away", "arming")
    assert events and events[0]["user_name"] == "Alice" and events[0]["operation"] == "unlock"


async def test_keypad_partition_target_denied_for_guest(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Guest may not disarm: the disarm target is skipped; the old slot→mode mapping is skipped for linked users."""
    house = await _setup(hass, hass_storage, tmp_path, lock_keypads=[{"node_id": 138, "slots": {"2": "spa"}}])
    _add_lock(hass)
    mgr = hass.data["alarmo_ext"].locks
    await house.async_set_mode("stay", "manual")
    await _settle(hass)
    await mgr.async_link(FRONT, 2, GUEST)
    s = mgr.settings
    s["actions"][GUEST] = {"unlock": {"house_mode": None, "targets": {GF: "disarmed"}}}
    await mgr.async_save(s)
    res = await mgr.async_keypad(FRONT, "unlock", 2)
    assert res["targets"] == {} and GF in res["denied"]
    hass.bus.async_fire("zwave_js_notification", {"node_id": 138, "event_label": "Keypad unlock operation", "parameters": {"userId": 2}})
    await _settle(hass)
    assert house.settings["current"] == "stay"  # neither disarmed nor the legacy "spa"


async def test_lock_only_user_sets_house_mode(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A lock-only user (no Can arm / Can disarm) can still switch the House Mode from the lock."""
    house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {FRONT: {7: "7777"}})
    (res,) = await mgr.async_import(FRONT, [{"slot": 7, "name": "Cleaner"}])
    s = mgr.settings
    s["actions"][res["user_id"]] = {"unlock": {"house_mode": "stay", "targets": {}}}
    await mgr.async_save(s)
    hass.bus.async_fire("zwave_js_notification", {"node_id": 138, "event_label": "Keypad unlock operation", "parameters": {"userId": 7}})
    await _settle(hass)
    assert house.settings["current"] == "stay"


async def test_migrate_old_slot_table(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Old slot→House Mode entries become Users with that unlock action; unreadable slots get a lock-only stand-in."""
    house = await _setup(hass, hass_storage, tmp_path, lock_keypads=[{"node_id": 138, "enabled": True, "slots": {"1": "stay", "9": "spa"}}])
    _add_lock(hass)
    mgr = hass.data["alarmo_ext"].locks
    fake = FakeLock({FRONT: {1: "1234", 9: "****"}})
    mgr.reader, mgr.writer = fake.read, fake.write
    assert len(mgr.legacy_slots()) == 2
    res = await mgr.async_migrate_legacy()
    assert [r["result"] for r in res] == ["moved", "moved"]
    by_slot = {r["slot"]: r["user_id"] for r in res}
    assert by_slot[1] == ALICE  # same PIN as Alice → linked, not duplicated
    assert mgr.settings["actions"][ALICE]["unlock"]["house_mode"] == "stay"
    stand_in = mgr.users()[by_slot[9]]
    assert stand_in["can_arm"] is False and stand_in["code_length"] == 0
    assert mgr.settings["actions"][by_slot[9]]["unlock"]["house_mode"] == "spa"
    assert house.settings["lock_keypads"] == [] and mgr.legacy_slots() == []


async def test_keypad_lock_without_code(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """Schlage button (keypad lock, no user) → the lock's own action."""
    house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {})
    s = mgr.settings
    s["lock_actions"][FRONT] = {"house_mode": "stay", "targets": {}}
    await mgr.async_save(s)
    hass.bus.async_fire(
        "zwave_js_notification", {"node_id": 138, "event_label": "Keypad lock operation", "parameters": {}}
    )
    await _settle(hass)
    assert house.settings["current"] == "stay"


async def test_locks_in_export(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Lock links travel with the ext settings."""
    import yaml  # noqa: PLC0415

    _house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "1234"}})
    await mgr.async_link(FRONT, 1, ALICE)
    client = await hass_ws_client(hass)
    exp = yaml.safe_load((await _ws(client, 1, type="alarmo/ext/export"))["result"]["content"])
    assert exp["extras"]["locks"]["links"] == [{"user_id": ALICE, "entity_id": FRONT, "slot": 1}]
    got = (await _ws(client, 2, type="alarmo/ext/locks/get"))["result"]
    assert got["locks"][0]["node_id"] == 138 and all("code" not in u for u in got["users"])


async def test_reveal_and_admin_set_code(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Reveal reads one slot now (nothing stored); an admin sets a code without the old one; duplicates refused."""
    _house, mgr, _ = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "1234", 2: "****"}})
    client = await hass_ws_client(hass)
    r = (await _ws(client, 1, type="alarmo/ext/locks/reveal", entity_id=FRONT, slot=1))["result"]
    assert r == {"code": "1234", "readable": True}
    r = (await _ws(client, 2, type="alarmo/ext/locks/reveal", entity_id=FRONT, slot=2))["result"]
    assert r == {"code": None, "readable": False}
    assert "1234" not in str(hass_storage.get("alarmo_extras"))
    ok = await _ws(client, 3, type="alarmo/ext/user/set_code", user_id=ALICE, code="2580")
    assert ok["success"] and lc.check_code("2580", mgr.users()[ALICE]["code"])
    dup = await _ws(client, 4, type="alarmo/ext/user/set_code", user_id=ALICE, code="9876")  # Bob's code
    assert not dup["success"]


async def test_sync_user_copies_code_from_linked_slot(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """A slot added later gets the user's code copied from a slot that already has it; reveal uses the same slot."""
    _house, mgr, fake = await _locks(hass, hass_storage, tmp_path, {FRONT: {1: "1234", 2: ""}})
    await mgr.async_link(FRONT, 1, ALICE)
    await mgr.async_link(FRONT, 2, ALICE)
    client = await hass_ws_client(hass)
    r = (await _ws(client, 1, type="alarmo/ext/user/reveal", user_id=ALICE))["result"]
    assert r == {"code": "1234", "readable": True}
    res = (await _ws(client, 2, type="alarmo/ext/locks/sync_user", user_id=ALICE))["result"]
    assert [x["result"] for x in res["results"]] == ["already", "ok"] and fake.writes == [(FRONT, 2, "1234")]
    # Bob has no slot with his code: a code is needed
    await mgr.async_link(FRONT, 3, BOB)
    res = (await _ws(client, 3, type="alarmo/ext/locks/sync_user", user_id=BOB))["result"]
    assert res["needs_code"] is True
    res = (await _ws(client, 4, type="alarmo/ext/locks/sync_user", user_id=BOB, code="9876"))["result"]
    assert res["results"][0]["result"] == "ok" and fake.writes[-1] == (FRONT, 3, "9876")
