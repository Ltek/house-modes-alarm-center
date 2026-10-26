"""Shared helpers for the alarmo "ext" (table UI / backup / import) tests."""

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


async def setup_real_alarmo(
    hass: Any,
    hass_storage: dict[str, Any],
    config_dir: Path,
    envelope: dict[str, Any] | None = None,
    create_states: bool = True,
):
    """Set up Alarmo with the *real* AlarmoStorage loaded from ``envelope``.

    Uses ``config_dir`` (a tmp dir) as /config so backups land there.
    Returns the config entry.
    """
    envelope = envelope or load_fixture_envelope()
    hass.config.config_dir = str(config_dir)
    hass_storage["alarmo.storage"] = copy.deepcopy(envelope)
    hass.data.pop("alarmo_storage", None)
    hass.data.pop("alarmo_ext", None)

    if create_states:
        for s in envelope["data"]["sensors"]:
            hass.states.async_set(
                s["entity_id"], "off", {"friendly_name": s["entity_id"]}
            )

    entry = MockConfigEntry(
        domain="alarmo", data={}, entry_id="ext_test", unique_id="ext_test"
    )
    entry.add_to_hass(hass)
    with (
        patch("custom_components.alarmo.async_register_panel", AsyncMock()),
        patch("custom_components.alarmo.async_register_card", AsyncMock()),
        patch("custom_components.alarmo.async_register_websockets", AsyncMock()),
    ):
        assert await async_setup_component(hass, "websocket_api", {})
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def storage_file(config_dir: Path) -> Path:
    """Path of the live alarmo.storage under a test config dir."""
    return config_dir / ".storage" / "alarmo.storage"


def write_storage_file(config_dir: Path, envelope: dict[str, Any]) -> Path:
    """Write a real .storage/alarmo.storage (hass_storage mocks the real file)."""
    path = storage_file(config_dir)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(envelope, indent=4), encoding="utf-8")
    return path
