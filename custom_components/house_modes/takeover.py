"""Entity ids: the new integration's entities get the ids the old Alarmo ones had, and give them back on unload.

The alarm entities (``alarm_control_panel.*``) need nothing: Alarmo removes them from the entity registry when its
entry is disabled, so the new ones get the same ids by themselves. The mirror zones (``binary_sensor.*_mirror``) stay
in the registry when Alarmo is disabled, so without this the new mirrors would get ``_2`` ids and templates and
automations that use them would follow the old, unavailable ones.

Take-over (at setup, only while the old ``alarmo`` entry is disabled): the old registry entry is renamed to
``<id>_alarmo`` and the new entity gets ``<id>``. Give-back (when the new entry is unloaded: disabled, removed or
reloaded): the new entity becomes ``<id>_house_modes`` and the old one gets ``<id>`` back, so re-enabling Alarmo is
a full rollback. Only the entity registry is changed; Alarmo's own files are never touched.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from . import legacy
from .const import DOMAIN
from .combined_store import async_get_combined

_LOGGER = logging.getLogger(__name__)

SECTION = "entity_ids"
OLD_SUFFIX = "_alarmo"
NEW_SUFFIX = "_house_modes"
# old unique_id prefix -> new unique_id prefix (entities that stay in the registry when Alarmo is disabled)
UNIQUE_ID_PREFIXES = {"alarmo_mirror_": "house_modes_mirror_"}


def _new_unique_id(old_uid: str) -> str | None:
    for old, new in UNIQUE_ID_PREFIXES.items():
        if old_uid.startswith(old):
            return new + old_uid[len(old):]
    return None


def _free(reg: er.EntityRegistry, entity_id: str) -> bool:
    return reg.async_get(entity_id) is None


def _rename(reg: er.EntityRegistry, current: str, new: str) -> bool:
    if current == new:
        return True
    if not _free(reg, new):
        return False
    reg.async_update_entity(current, new_entity_id=new)
    return True


async def _records(hass: HomeAssistant) -> dict[str, Any]:
    combined = await async_get_combined(hass)
    return dict(combined.get(SECTION) or {})


async def _save(hass: HomeAssistant, records: dict[str, Any]) -> None:
    combined = await async_get_combined(hass)
    await combined.async_save_section(SECTION, records)


async def async_take_over(hass: HomeAssistant) -> list[str]:
    """Give our entities the old ids (only while Alarmo is disabled). Returns the ids taken over. Never raises."""
    try:
        if legacy.old_alarmo_active(hass):
            return []
        reg = er.async_get(hass)
        records = await _records(hass)
        taken = []
        for old in list(reg.entities.values()):
            if old.platform != legacy.OLD_DOMAIN:
                continue
            new_uid = _new_unique_id(str(old.unique_id))
            if new_uid is None:
                continue
            rec = records.get(old.id) or {}
            target = rec.get("entity_id") or old.entity_id
            ours = reg.async_get_entity_id(old.domain, DOMAIN, new_uid)
            if old.entity_id == target and not _rename(reg, target, target + OLD_SUFFIX):
                continue
            if ours and ours != target and not _rename(reg, ours, target):
                continue
            records[old.id] = {"entity_id": target, "new_unique_id": new_uid, "domain": old.domain}
            taken.append(target)
        if taken:
            await _save(hass, records)
            _LOGGER.info("Took over entity ids from Alarmo: %s", ", ".join(taken))
        return taken
    except Exception:
        _LOGGER.exception("Could not take over the Alarmo entity ids")
        return []


async def async_give_back(hass: HomeAssistant) -> list[str]:
    """Give the old entities their ids back (the new entry is being unloaded). Never raises."""
    try:
        reg = er.async_get(hass)
        records = await _records(hass)
        back = []
        for reg_id, rec in records.items():
            target = rec["entity_id"]
            old = reg.entities.get_entry(reg_id)
            if old is None or old.entity_id == target:
                continue
            ours = reg.async_get_entity_id(rec["domain"], DOMAIN, rec["new_unique_id"])
            if ours == target and not _rename(reg, target, target + NEW_SUFFIX):
                continue
            if _rename(reg, old.entity_id, target):
                back.append(target)
        if back:
            _LOGGER.info("Gave entity ids back to Alarmo: %s", ", ".join(back))
        return back
    except Exception:
        _LOGGER.exception("Could not give the entity ids back to Alarmo")
        return []
