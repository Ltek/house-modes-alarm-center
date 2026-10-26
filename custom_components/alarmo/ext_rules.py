"""Zone rules wired to Home Assistant: registries, storage, preview and apply.

Rule results are never written silently: registry/rule changes only update a
"pending" count. Writing happens on an explicit apply, which backs up first and
goes through the same batch path as the zone table.
"""

from __future__ import annotations

import re
import json
import time
import hashlib
import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import zone_rules
from .zone_rules import (
    RULE_SCHEMA,
    SET_FIELDS_LIST,
    OVERRIDE_FIELDS_SCHEMA,
    EntityCtx,
)

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

EVENT_RULES_PENDING = "alarmo_ext_rules_pending"
LABEL_RULES = "rules"
DEBOUNCE_SECONDS = 2.0
REGISTRY_EVENTS = (
    er.EVENT_ENTITY_REGISTRY_UPDATED,
    dr.EVENT_DEVICE_REGISTRY_UPDATED,
    ar.EVENT_AREA_REGISTRY_UPDATED,
    fr.EVENT_FLOOR_REGISTRY_UPDATED,
    lr.EVENT_LABEL_REGISTRY_UPDATED,
)


class RulesError(Exception):
    """Invalid rule request; ``errors`` lists the reasons."""

    def __init__(self, errors: list[str]) -> None:
        """Store errors."""
        super().__init__("; ".join(errors))
        self.errors = errors


def _slug(name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")[:24] or "rule"
    return f"{base}_{int(time.time() * 1000) % 100000:05d}"


class RulesManager:
    """Rules + overrides stored in alarmo_extras."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize (call async_start once)."""
        self.hass = hass
        self.ext = ext
        self.pending_count = 0
        self._unsubs: list = []
        self._debounce = None

    # ------------------------------------------------------------ data

    @property
    def rules(self) -> list[dict]:
        """Stored rules (validated on save)."""
        return self.ext.extras.data.get("rules") or []

    @property
    def overrides(self) -> dict[str, dict]:
        """Stored overrides {entity_id: {field: value}}."""
        return self.ext.extras.data.get("overrides") or {}

    def known_refs(self) -> dict[str, set[str]]:
        """Labels, areas and floors that exist in HA right now."""
        return {
            "labels": {x.label_id for x in lr.async_get(self.hass).async_list_labels()},
            "areas": {x.id for x in ar.async_get(self.hass).async_list_areas()},
            "floors": {x.floor_id for x in fr.async_get(self.hass).async_list_floors()},
        }

    def partitions(self) -> dict[str, dict]:
        """Alarmo partitions (store areas)."""
        return self.ext.store.async_get_areas()

    def contexts(self) -> dict[str, EntityCtx]:
        """Labels / area / floor / device class of every possible zone entity."""
        ents = er.async_get(self.hass)
        devs = dr.async_get(self.hass)
        areas = ar.async_get(self.hass)
        out: dict[str, EntityCtx] = {}
        for entry in ents.entities.values():
            if entry.domain not in zone_rules.ZONE_DOMAINS or entry.disabled_by:
                continue
            device = devs.async_get(entry.device_id) if entry.device_id else None
            labels = set(entry.labels) | (set(device.labels) if device else set())
            area_id = entry.area_id or (device.area_id if device else None)
            area = areas.async_get_area(area_id) if area_id else None
            state = self.hass.states.get(entry.entity_id)
            dc = (state.attributes.get("device_class") if state else None) or (
                entry.device_class or entry.original_device_class
            )
            out[entry.entity_id] = EntityCtx(
                entity_id=entry.entity_id,
                labels=labels,
                area=area_id,
                floor=area.floor_id if area else None,
                device_class=dc,
                exists=state is not None,
            )
        for eid in self.ext.store.async_get_sensors():
            if eid not in out:
                out[eid] = EntityCtx(
                    entity_id=eid, exists=self.hass.states.get(eid) is not None
                )
        return out

    def resolve(self) -> dict[str, Any]:
        """Resolve all rules against the current registries and store."""
        return zone_rules.resolve(
            self.contexts(),
            self.rules,
            self.overrides,
            self.ext.store.async_get_sensors(),
            set(self.partitions()),
            self.known_refs(),
        )

    # ------------------------------------------------------------ rules CRUD

    def validate_rule(self, data: dict) -> dict:
        """Schema + reference checks. Raises RulesError."""
        try:
            rule = RULE_SCHEMA(data)
        except vol.Invalid as err:
            raise RulesError([str(err)]) from err
        known = self.known_refs()
        errors = [
            f"unknown {kind[:-1]} '{ref}'"
            for kind in ("labels", "areas", "floors")
            for ref in rule["match"][kind]
            if ref not in known[kind]
        ]
        part = rule["set"].get("partition")
        if part is not None and part not in self.partitions():
            errors.append(f"unknown partition '{part}'")
        if errors:
            raise RulesError(errors)
        return rule

    async def async_save_rule(self, data: dict) -> dict:
        """Create or update a rule (by id). Changes no zones."""
        rule = self.validate_rule(data)
        rules = [dict(r) for r in self.rules]
        if rule.get("id"):
            idx = next(
                (i for i, r in enumerate(rules) if r.get("id") == rule["id"]), None
            )
            if idx is None:
                raise RulesError([f"rule '{rule['id']}' not found"])
            rules[idx] = rule
        else:
            rule["id"] = _slug(rule["name"])
            while any(r.get("id") == rule["id"] for r in rules):
                rule["id"] = _slug(rule["name"])
            rules.append(rule)
        await self.ext.extras.async_update(rules=rules)
        self.schedule_refresh(0)
        return rule

    async def async_delete_rule(self, rule_id: str) -> None:
        """Delete a rule. Changes no zones (values stay as last applied)."""
        rules = [r for r in self.rules if r.get("id") != rule_id]
        if len(rules) == len(self.rules):
            raise RulesError([f"rule '{rule_id}' not found"])
        await self.ext.extras.async_update(rules=rules)
        self.schedule_refresh(0)

    # ------------------------------------------------------------ overrides

    async def async_clear_override(self, entity_id: str, field: str | None) -> None:
        """Remove an override (whole zone or one field). Takes effect on apply."""
        ovr = {k: dict(v) for k, v in self.overrides.items()}
        if entity_id not in ovr or (field and field not in ovr[entity_id]):
            raise RulesError(
                [f"no override for {entity_id}{'.' + field if field else ''}"]
            )
        if field:
            ovr[entity_id].pop(field)
        if not field or not ovr[entity_id]:
            ovr.pop(entity_id)
        await self.ext.extras.async_update(overrides=ovr)
        self.schedule_refresh(0)

    def overrides_for_batch(self, batch: dict) -> dict[str, dict] | None:
        """Overrides after a zone-table save, or None if unchanged.

        Any edited field that a rule currently sets becomes an override; deleted
        zones lose their overrides.
        """
        if not self.rules and not self.overrides:
            return None
        resolved = self.resolve()["zones"]
        ovr = {k: dict(v) for k, v in self.overrides.items()}
        changed = False
        for item in batch.get("update", []):
            eid = item["entity_id"]
            sources = resolved.get(eid, {}).get("sources", {})
            for f, v in item["changes"].items():
                if f == "group":
                    continue
                if sources.get(f, {}).get("kind") in ("rule", "override"):
                    try:
                        clean = OVERRIDE_FIELDS_SCHEMA({f: v})
                    except vol.Invalid:
                        continue
                    ovr.setdefault(eid, {}).update(clean)
                    changed = True
        for eid in batch.get("delete", []):
            if ovr.pop(eid, None) is not None:
                changed = True
        return ovr if changed else None

    # ------------------------------------------------------------ preview / apply

    def preview(self) -> dict[str, Any]:
        """What applying the rules would change (no writes)."""
        sensors = self.ext.store.async_get_sensors()
        resolved = self.resolve()
        diff = zone_rules.diff_against_store(resolved, sensors)
        conflicts = [
            {"entity_id": eid, **c}
            for eid, z in resolved["zones"].items()
            for c in z["conflicts"]
        ]
        names = {r.get("id"): r["name"] for r in self.rules}
        zones = {
            eid: {
                "sources": z["sources"],
                "conflicts": z["conflicts"],
                "rules": z["rules"],
                "managed": z["managed"],
            }
            for eid, z in resolved["zones"].items()
        }
        token = hashlib.sha256(
            json.dumps(
                [diff["create"], diff["update"], sensors], sort_keys=True, default=str
            ).encode()
        ).hexdigest()[:32]
        return {
            "create": diff["create"],
            "update": diff["update"],
            "unmanaged": diff["unmanaged"],
            "conflicts": conflicts,
            "needs_partition": resolved["needs_partition"],
            "stale": zone_rules.stale_references(self.rules, self.known_refs()),
            "zones": zones,
            "rule_names": names,
            "total_changes": len(diff["create"]) + len(diff["update"]),
            "token": token,
        }

    async def async_apply(self, token: str) -> dict[str, Any]:
        """Back up, then write the rule results through the zone batch path."""
        prev = self.preview()
        if prev["token"] != token:
            raise RulesError(
                ["zones or rules changed since the preview; preview again"]
            )
        if not prev["total_changes"]:
            raise RulesError(["there are no rule changes to apply"])
        batch = {"create": prev["create"], "update": prev["update"], "delete": []}
        result = await self.ext.async_apply_sensor_changes(
            batch, label=LABEL_RULES, record_overrides=False
        )
        self.schedule_refresh(0)
        return result

    # ------------------------------------------------------------ pending tracking

    @callback
    def async_start(self) -> None:
        """Listen for registry changes (once per HA run)."""
        if self._unsubs:
            return
        for event_type in REGISTRY_EVENTS:
            self._unsubs.append(
                self.hass.bus.async_listen(event_type, self._on_registry)
            )
        self.schedule_refresh(DEBOUNCE_SECONDS)

    @callback
    def _on_registry(self, _event: Event) -> None:
        self.schedule_refresh(DEBOUNCE_SECONDS)

    @callback
    def schedule_refresh(self, delay: float) -> None:
        """Recompute the pending count after ``delay`` seconds (debounced)."""
        if self._debounce:
            self._debounce()
            self._debounce = None
        if delay <= 0:
            self.refresh_pending()
            return

        @callback
        def _run(_now) -> None:
            self._debounce = None
            self.refresh_pending()

        self._debounce = async_call_later(self.hass, delay, _run)

    @callback
    def refresh_pending(self) -> int:
        """Update the pending count; fire an event when it changes."""
        try:
            prev = self.preview()
        except Exception:
            _LOGGER.exception("Alarmo zone rules: could not compute pending changes")
            return self.pending_count
        count = prev["total_changes"]
        if count != self.pending_count:
            self.pending_count = count
            self.hass.bus.async_fire(
                EVENT_RULES_PENDING,
                {"count": count, "conflicts": len(prev["conflicts"])},
            )
            async_dispatcher_send(self.hass, "alarmo_update_frontend")
        return count

    @callback
    def async_stop(self) -> None:
        """Remove listeners."""
        while self._unsubs:
            self._unsubs.pop()()
        if self._debounce:
            self._debounce()
            self._debounce = None


def list_payload(mgr: RulesManager) -> dict[str, Any]:
    """Rules, overrides and the registries the editor needs."""
    return {
        "rules": mgr.rules,
        "overrides": mgr.overrides,
        "pending": mgr.pending_count,
        "list_fields": list(SET_FIELDS_LIST),
    }
