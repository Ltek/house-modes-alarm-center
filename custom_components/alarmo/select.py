"""House Mode select entity (alarmo ext)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.config_entries import ConfigEntry
from homeassistant.components.select import SelectEntity
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .house_modes import SIGNAL_HOUSE, HouseModeError

DATA_EXT = "alarmo_ext"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Add the House Mode select."""
    ext = hass.data.get(DATA_EXT)
    if ext is not None:
        async_add_entities([HouseModeSelect(ext)])


class HouseModeSelect(SelectEntity):
    """select.alarmo_house_mode — shows and sets the House Mode."""

    _attr_should_poll = False
    _attr_unique_id = "alarmo_house_mode"
    _attr_name = "House Mode"
    _attr_icon = "mdi:home-switch"

    def __init__(self, ext) -> None:
        """Initialize."""
        self.ext = ext
        self.entity_id = "select.alarmo_house_mode"

    async def async_added_to_hass(self) -> None:
        """Update on House Mode changes."""
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_HOUSE, self._updated)
        )

    @callback
    def _updated(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        """Only when House Modes are on."""
        s = self.ext.house.settings
        return s["enabled"] and bool(s["modes"])

    @property
    def options(self) -> list[str]:
        """Mode names."""
        return [m["name"] for m in self.ext.house.settings["modes"]]

    @property
    def current_option(self) -> str | None:
        """Active mode name (None = unknown)."""
        cur = self.ext.house.current()
        return cur["name"] if cur else None

    @property
    def icon(self) -> str:
        """Icon of the active mode."""
        cur = self.ext.house.current()
        return cur["icon"] if cur else "mdi:home-switch"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Previous mode, last source, when, pending timers."""
        s = self.ext.house.settings
        prev = next((m for m in s["modes"] if m["id"] == s["previous"]), None)
        return {
            "previous": prev["name"] if prev else None,
            "source": s["source"],
            "changed_at": s["changed_at"],
            "pending": [
                {"target": p.get("target"), "kind": p.get("kind"), "due": p.get("due")}
                for p in s["pending"]
            ],
        }

    async def async_select_option(self, option: str) -> None:
        """Dashboard/automation selection; source from the call context."""
        ctx = self._context
        source = "manual" if ctx and ctx.user_id else "automation"
        try:
            await self.ext.house.async_set_mode(option, source)
        except HouseModeError as err:
            raise ValueError(str(err)) from err
        self.async_write_ha_state()
