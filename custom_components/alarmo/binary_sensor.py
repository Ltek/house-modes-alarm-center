"""Mirror zones (alarmo ext): a binary_sensor per physical panel zone.

Bypass state comes from: the zone's `bypassed` attribute (DSC and other panels); on a Honeywell/Vista via
envisalink_new, the keypad sensor's BYPASS indicator (`armed_bypass`) and "BYPAS zz" text (Quick Bypass = the
zones open at arming); bypasses the panel link sent itself; optionally a helper entity.

Follows its panel zone live. While the zone is bypassed on the panel the panel stops reporting it, so the mirror
holds the last known state ("last", default) or shows unknown ("unknown"). The
attribute `bypass_held` is true while a held value is shown.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.components.binary_sensor import BinarySensorEntity

from .panel_link import SIGNAL_MIRRORS
from .panel_config import mirror_object_id

DATA_EXT = "alarmo_ext"


def _unique_id(source: str) -> str:
    return f"alarmo_mirror_{source}"


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Create mirrors from the panel settings; follow later changes."""
    ext = hass.data.get(DATA_EXT)
    if ext is None:
        return
    current: dict[str, MirrorZone] = {}

    @callback
    def _sync() -> None:
        wanted = ext.panel.settings["mirrors"]
        new = [
            MirrorZone(ext, src, cfg["hold"])
            for src, cfg in wanted.items()
            if src not in current
        ]
        for ent in new:
            current[ent.source] = ent
        if new:
            async_add_entities(new)
        for src in [s for s in current if s not in wanted]:
            ent = current.pop(src)
            reg = er.async_get(hass)
            if ent.entity_id and reg.async_get(ent.entity_id):
                reg.async_remove(ent.entity_id)
            else:
                hass.async_create_task(ent.async_remove())
        for src, ent in current.items():
            ent.hold = wanted[src]["hold"]
            if ent.hass:
                ent.async_write_ha_state()

    _sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_MIRRORS, _sync))


class MirrorZone(BinarySensorEntity, RestoreEntity):
    """binary_sensor that mirrors a panel zone, bypass-aware."""

    _attr_should_poll = False

    def __init__(self, ext, source: str, hold: str) -> None:
        """Initialize."""
        self.ext = ext
        self.source = source
        self.hold = hold
        self._held: bool | None = None
        self._attr_unique_id = _unique_id(source)
        self.entity_id = f"binary_sensor.{mirror_object_id(source)}"

    async def async_added_to_hass(self) -> None:
        """Follow the source zone and bypass changes."""
        self.async_on_remove(
            async_track_state_change_event(self.hass, [self.source], self._changed)
        )
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_MIRRORS, self._bypass_changed)
        )
        st = self.hass.states.get(self.source)
        self._held = st.state == "on" if st and st.state in ("on", "off") else None
        # after a restart while bypassed, the panel still reports "closed": keep what we showed before
        last = await self.async_get_last_state()
        if last is not None and last.state == "on" and self.ext.panel.is_bypassed(self.source):
            self._held = True

    @callback
    def _changed(self, _event: Event) -> None:
        st = self.hass.states.get(self.source)
        if st and st.state == "on":
            self._held = True
        elif st and st.state == "off" and not self.ext.panel.is_bypassed(self.source):
            self._held = False
        self.async_write_ha_state()

    @callback
    def _bypass_changed(self) -> None:
        if self.source in self.ext.panel.held_open and self.ext.panel.is_bypassed(self.source):
            self._held = True  # it was open when the panel bypassed it
        if not self.ext.panel.is_bypassed(self.source):
            st = self.hass.states.get(self.source)
            self._held = (
                st.state == "on" if st and st.state in ("on", "off") else self._held
            )
        if self.hass:
            self.async_write_ha_state()

    @property
    def _source_state(self):
        return self.hass.states.get(self.source)

    @property
    def name(self) -> str:
        """Same name as the panel zone."""
        st = self._source_state
        return (st.attributes.get("friendly_name") if st else None) or self.source

    @property
    def device_class(self) -> str | None:
        """Same device class as the panel zone."""
        st = self._source_state
        return st.attributes.get("device_class") if st else None

    @property
    def available(self) -> bool:
        """Unavailable when the panel zone is."""
        st = self._source_state
        return st is not None and st.state in ("on", "off")

    @property
    def _bypass_held(self) -> bool:
        st = self._source_state
        return bool(
            st
            and st.state == "off"
            and self.ext.panel.is_bypassed(self.source)
            and self._held
        )

    @property
    def is_on(self) -> bool | None:
        """Live state, or the held state while bypassed."""
        st = self._source_state
        if st is None:
            return None
        if st.state == "on":
            return True
        if self.ext.panel.is_bypassed(self.source):
            if self.hold == "unknown":
                return None
            return bool(self._held)
        return False

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Where it comes from and whether the value is held."""
        return {
            "source": self.source,
            "bypassed": self.ext.panel.is_bypassed(self.source),
            "bypass_held": self._bypass_held,
        }
