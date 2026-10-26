"""Baseline: the complex fixture and the upstream-compatibility harness."""

import base64
from typing import Any

import bcrypt

from tests.ext_helpers import (
    FIXTURE_CODES,
    plain,
    load_with_upstream,
    load_fixture_envelope,
    assert_upstream_round_trip,
)
from custom_components.alarmo.store import (
    STORAGE_VERSION_MAJOR,
    STORAGE_VERSION_MINOR,
    AlarmoStorage,
)


def test_storage_version_is_unchanged() -> None:
    """The shipped store.py must keep upstream's storage version (6.3)."""
    assert (STORAGE_VERSION_MAJOR, STORAGE_VERSION_MINOR) == (6, 3)


async def test_fixture_loads_in_upstream_and_round_trips(hass: Any) -> None:
    """The fixture is something upstream itself would write."""
    env = load_fixture_envelope()
    await assert_upstream_round_trip(hass, env)
    storage = await load_with_upstream(hass, env)
    assert len(storage.areas) == 3
    assert len(storage.sensors) >= 30
    assert len(storage.users) == 3
    assert len(storage.automations) == 3
    assert len(storage.sensor_groups) == 2


async def test_fixture_loads_in_shipped_store(hass: Any, hass_storage: Any) -> None:
    """Our shipped store.py loads the fixture identically to upstream."""
    env = load_fixture_envelope()
    hass_storage["alarmo.storage"] = env
    storage = AlarmoStorage(hass)
    await storage.async_load()
    assert plain(storage._data_to_save()) == env["data"]


def test_fixture_user_codes_are_real_bcrypt() -> None:
    """Fixture users authenticate with their documented PINs."""
    users = {u["name"]: u for u in load_fixture_envelope()["data"]["users"]}
    for name, code in FIXTURE_CODES.items():
        assert bcrypt.checkpw(code.encode(), base64.b64decode(users[name]["code"]))


async def test_upstream_rejects_unknown_sensor_field(hass: Any) -> None:
    """Documents why we never add fields: upstream fails to load them."""
    env = load_fixture_envelope()
    env["data"]["sensors"][0]["label_rule"] = "x"
    try:
        await load_with_upstream(hass, env)
    except TypeError:
        return
    raise AssertionError("upstream accepted an unknown sensor field")
