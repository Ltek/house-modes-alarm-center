"""One storage file for everything: ``.storage/house_modes``.

The file holds named sections:

* ``alarm``  - partitions, zones, users (code hashes), Alarm Events, sensor groups, settings
  (store.py, same layout as the alarm data has always had: storage format 6.3)
* ``extras`` - House Modes, panel link, notifications, card, zone rules, locks, … (extras_store.py)
* ``import`` - the one-time import from Alarmo: the user's choice, when, what (alarmo_import.py)

Each part of the integration reads and writes its own section through ``section(name)``, which offers the small
part of the ``homeassistant.helpers.storage.Store`` interface the code uses (``async_load``, ``async_save``,
``async_delay_save``, ``async_remove``). Every write saves the whole file, so the sections never get out of step.
The file is private (mode 600): it contains user code hashes.
"""

from __future__ import annotations

from typing import Any
from collections.abc import Callable

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORAGE_KEY = DOMAIN  # .storage/house_modes
STORAGE_VERSION = 1
DATA_KEY = f"{DOMAIN}_combined_store"

SECTION_ALARM = "alarm"
SECTION_EXTRAS = "extras"
SECTION_IMPORT = "import"


class CombinedStore:
    """The single storage file, shared by every section."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Create the store (not loaded yet)."""
        self.hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY, private=True, atomic_writes=True)
        self._data: dict[str, Any] = {}
        self._providers: dict[str, Callable[[], Any]] = {}
        self._loaded = False
        self.existed = False  # the file was on disk when Home Assistant started

    async def async_load(self) -> None:
        """Read the file once."""
        if self._loaded:
            return
        stored = await self._store.async_load()
        self.existed = stored is not None
        self._data = dict(stored) if isinstance(stored, dict) else {}
        self._loaded = True

    def section(self, name: str) -> SectionStore:
        """A Store-like handle for one section."""
        return SectionStore(self, name)

    def get(self, name: str) -> Any:
        """The section's current data (None if it has none)."""
        if name in self._providers:
            return self._providers[name]()
        return self._data.get(name)

    @callback
    def _data_to_save(self) -> dict[str, Any]:
        out = dict(self._data)
        for name, provider in self._providers.items():
            out[name] = provider()
        return out

    async def async_save_section(self, name: str, data: Any) -> None:
        """Set one section and write the file now."""
        self._providers.pop(name, None)
        self._data[name] = data
        await self._store.async_save(self._data_to_save())

    @callback
    def async_delay_save_section(self, name: str, provider: Callable[[], Any], delay: float) -> None:
        """Write the file after ``delay`` seconds; the section's data is taken from ``provider`` then."""
        self._providers[name] = provider
        self._store.async_delay_save(self._data_to_save, delay)

    async def async_remove_section(self, name: str) -> None:
        """Drop one section and write the file now."""
        self._providers.pop(name, None)
        self._data.pop(name, None)
        await self._store.async_save(self._data_to_save())

    async def async_remove(self) -> None:
        """Delete the whole file (the integration is being removed)."""
        self._providers.clear()
        self._data = {}
        await self._store.async_remove()

    async def async_flush(self) -> None:
        """Write pending changes now."""
        await self._store.async_save(self._data_to_save())

    @property
    def path(self) -> str:
        """Absolute path of the storage file."""
        return self._store.path


class SectionStore:
    """One section of the combined file, with the Store methods the code uses."""

    def __init__(self, combined: CombinedStore, name: str) -> None:
        """Bind to a section."""
        self.combined = combined
        self.name = name

    async def async_load(self) -> Any:
        """The section's data, or None when it has none yet."""
        await self.combined.async_load()
        return self.combined.get(self.name)

    async def async_save(self, data: Any) -> None:
        """Save the section now."""
        await self.combined.async_save_section(self.name, data)

    @callback
    def async_delay_save(self, data_func: Callable[[], Any], delay: float = 0) -> None:
        """Save the section later (``data_func`` is called at write time)."""
        self.combined.async_delay_save_section(self.name, data_func, delay)

    async def async_remove(self) -> None:
        """Drop the section."""
        await self.combined.async_remove_section(self.name)


def get_combined(hass: HomeAssistant) -> CombinedStore:
    """The shared combined store (loaded on first use)."""
    store = hass.data.get(DATA_KEY)
    if store is None:
        store = hass.data[DATA_KEY] = CombinedStore(hass)
    return store


async def async_get_combined(hass: HomeAssistant) -> CombinedStore:
    """The shared, loaded combined store."""
    store = get_combined(hass)
    await store.async_load()
    return store
