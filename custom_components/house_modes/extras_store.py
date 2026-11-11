"""Settings for everything beyond the alarm itself: House Modes, panel link, zone rules, locks, card.

Kept in the "extras" section of ``.storage/house_modes`` (combined_store.py); the alarm data is the "alarm" section.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .combined_store import SECTION_EXTRAS, get_combined

LEGACY_EXTRAS_KEY = "alarmo_extras"  # the Alarmo-based build's file, read once by the import (never written)

DEFAULT_RETENTION_DAYS = 30
MAX_RETENTION_DAYS = 3650

DEFAULTS: dict[str, Any] = {
    "retention_days": DEFAULT_RETENTION_DAYS,
    # zone rules (see zone_rules.py) and per-zone manual overrides
    "rules": [],
    "overrides": {},
    # page options, e.g. {"show_legacy_zones": false}
    "ui": {},
    # Users <-> lock code slots and keypad actions (lock_codes.py)
    "locks": {},
}


class ExtrasStore:
    """Small key/value settings store."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Create the store."""
        self.hass = hass
        self._store = get_combined(hass).section(SECTION_EXTRAS)
        self.data: dict[str, Any] = {
            k: (v.copy() if isinstance(v, (list, dict)) else v)
            for k, v in DEFAULTS.items()
        }

    async def async_load(self) -> None:
        """Load settings, filling in defaults."""
        stored = await self._store.async_load()
        defaults = {
            k: (v.copy() if isinstance(v, (list, dict)) else v)
            for k, v in DEFAULTS.items()
        }
        self.data = {**defaults, **(stored or {})}

    @property
    def retention_days(self) -> int:
        """Days to keep backups (0 = keep forever)."""
        return int(self.data.get("retention_days", DEFAULT_RETENTION_DAYS))

    async def async_update(self, **changes: Any) -> dict[str, Any]:
        """Update settings and save immediately."""
        self.data = {**self.data, **changes}
        await self._store.async_save(self.data)
        return dict(self.data)
