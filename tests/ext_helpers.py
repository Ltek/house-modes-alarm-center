"""Shared helpers for the ext (table UI / backup / import) tests."""

import copy
import json
from typing import Any
from pathlib import Path
from unittest.mock import AsyncMock, patch

from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from tests.ext_upstream import store_upstream as up

FIXTURE_PATH = Path(__file__).parent / "ext_fixtures" / "complex_alarmo.storage.json"
FIXTURE_CODES = {"Alice": "1234", "Bob": "9876", "Guest": "guest01"}


def load_fixture_envelope() -> dict[str, Any]:
    """Return a fresh copy of the complex storage fixture (HA Store envelope)."""
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


def plain(obj: Any) -> Any:
    """Convert to plain JSON types (StrEnum -> str, tuples -> lists)."""
    return json.loads(json.dumps(obj))


async def load_with_upstream(hass: Any, stored: dict[str, Any]) -> "up.AlarmoStorage":
    """Load storage data with an untouched copy of upstream v1.10.19 store.py.

    ``stored`` may be a HA Store envelope ({"version", "minor_version", "key",
    "data"}) or the bare ``data`` dict. Raises if upstream could not load it.
    Also asserts the envelope version is one upstream accepts without migration.
    """
    data = stored
    if "key" in stored and "data" in stored:
        assert stored["key"] == up.STORAGE_KEY
        assert stored["version"] == up.STORAGE_VERSION_MAJOR
        assert stored.get("minor_version", 1) <= up.STORAGE_VERSION_MINOR
        data = stored["data"]

    storage = up.AlarmoStorage(hass)
    with patch.object(
        storage._store, "async_load", AsyncMock(return_value=copy.deepcopy(data))
    ):
        await storage.async_load()
    return storage


async def assert_upstream_round_trip(hass: Any, stored: dict[str, Any]) -> None:
    """Upstream must load ``stored`` and write back exactly the same data.

    This is the "swap back to upstream at any time" guarantee: no unknown
    fields, no lost fields, nothing upstream would rewrite differently.
    """
    data = stored["data"] if "key" in stored and "data" in stored else stored
    storage = await load_with_upstream(hass, stored)
    assert plain(storage._data_to_save()) == plain(data)


async def setup_real_house_modes(
    hass: Any,
    hass_storage: dict[str, Any],
    config_dir: Path,
    envelope: dict[str, Any] | None = None,
    create_states: bool = True,
):
    """Set up the alarm with the *real* HouseModesStorage loaded from ``envelope``.

    Uses ``config_dir`` (a tmp dir) as /config so backups land there.
    Returns the config entry.
    """
    envelope = envelope or load_fixture_envelope()
    hass.config.config_dir = str(config_dir)
    seed(hass_storage, alarm=copy.deepcopy(envelope["data"]))
    hass.data.pop("house_modes_storage", None)
    hass.data.pop("house_modes_ext", None)
    hass.data.pop("house_modes_combined_store", None)

    if create_states:
        for s in envelope["data"]["sensors"]:
            hass.states.async_set(
                s["entity_id"], "off", {"friendly_name": s["entity_id"]}
            )

    entry = MockConfigEntry(
        domain="house_modes", data={}, entry_id="ext_test", unique_id="ext_test"
    )
    entry.add_to_hass(hass)
    with (
        patch("custom_components.house_modes.async_register_panel", AsyncMock()),
        patch("custom_components.house_modes.async_register_card", AsyncMock()),
        patch("custom_components.house_modes.async_register_websockets", AsyncMock()),
    ):
        assert await async_setup_component(hass, "websocket_api", {})
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def storage_file(config_dir: Path) -> Path:
    """Path of the live .storage/house_modes under a test config dir."""
    return config_dir / ".storage" / "house_modes"


def write_storage_file(config_dir: Path, envelope: dict[str, Any]) -> Path:
    """Write a real .storage/house_modes (hass_storage mocks the real file)."""
    path = storage_file(config_dir)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(envelope, indent=4), encoding="utf-8")
    return path


# ---------------------------------------------------------------- the combined storage file (.storage/house_modes)

STORE_KEY = "house_modes"


def seed(hass_storage: dict[str, Any], alarm: dict | None = None, extras: dict | None = None, **sections: Any) -> None:
    """Put sections into the mocked .storage/house_modes (keeps the sections already there)."""
    env = hass_storage.setdefault(STORE_KEY, {"version": 1, "minor_version": 1, "key": STORE_KEY, "data": {}})
    if alarm is not None:
        env["data"]["alarm"] = alarm
    if extras is not None:
        env["data"]["extras"] = extras
    env["data"].update(sections)


def stored_section(hass_storage: dict[str, Any], name: str) -> Any:
    """A section as last written to the mocked file (None if not written)."""
    env = hass_storage.get(STORE_KEY) or {}
    return (env.get("data") or {}).get(name)


def stored_alarm(hass_storage: dict[str, Any]) -> dict:
    """The "alarm" section as last written."""
    return stored_section(hass_storage, "alarm")


def stored_extras(hass_storage: dict[str, Any]) -> dict:
    """The "extras" section as last written."""
    return stored_section(hass_storage, "extras")
