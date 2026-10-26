"""Zone rules: assign zones (Alarmo sensors) from Home Assistant labels, areas, floors.

Part of the alarmo "ext" additions. This module is pure: it takes plain data and
returns plain data, so it can be tested without Home Assistant.

A rule matches entities by any combination of
  * labels  - ALL listed labels must be present (entity labels + device labels)
  * areas   - ANY of the listed HA areas (entity area, else device area)
  * floors  - ANY of the listed HA floors (from the area)
and sets zone fields (partition = Alarmo area id, modes, type, options).

Combining:
  * ``modes`` (and ``auto_bypass_modes``) are the union over all matching rules.
  * single-value fields: the matching rule with the highest specificity wins;
    equal specificity with different values is a conflict (no value applied).
  * an override (manual edit in the zone table) beats any rule.
Specificity = number of labels + 1 if areas + 1 if floors.
"""

from __future__ import annotations

from typing import Any
from dataclasses import field, dataclass

import voluptuous as vol

from . import const
from .sensors import SENSOR_TYPES

SET_FIELDS_LIST = ("modes", "auto_bypass_modes")
SET_FIELDS_BOOL = (
    "enabled",
    "always_on",
    "use_entry_delay",
    "use_exit_delay",
    "allow_open",
    "arm_on_close",
    "trigger_unavailable",
    "auto_bypass",
)
SET_FIELDS_SINGLE = ("partition", "type", *SET_FIELDS_BOOL, "entry_delay", "delay_on")
SET_FIELDS = (*SET_FIELDS_SINGLE, *SET_FIELDS_LIST)

# rule field -> Alarmo sensor field
TO_SENSOR_FIELD = {"partition": "area"}
FROM_SENSOR_FIELD = {v: k for k, v in TO_SENSOR_FIELD.items()}

ZONE_DOMAINS = ("binary_sensor", "cover", "lock")

_mode_list = [vol.In(const.ARM_MODES)]
_opt_secs = vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0, max=3600)))

SET_SCHEMA = vol.Schema(
    {
        vol.Optional("partition"): vol.All(str, vol.Length(min=1)),
        vol.Optional("type"): vol.In(SENSOR_TYPES),
        vol.Optional("modes"): _mode_list,
        vol.Optional("auto_bypass_modes"): _mode_list,
        **{vol.Optional(k): bool for k in SET_FIELDS_BOOL},
        vol.Optional("entry_delay"): _opt_secs,
        vol.Optional("delay_on"): _opt_secs,
    }
)

MATCH_SCHEMA = vol.Schema(
    {
        vol.Optional("labels", default=[]): [vol.All(str, vol.Length(min=1))],
        vol.Optional("areas", default=[]): [vol.All(str, vol.Length(min=1))],
        vol.Optional("floors", default=[]): [vol.All(str, vol.Length(min=1))],
    }
)


def _match_not_empty(rule: dict) -> dict:
    m = rule["match"]
    if not (m["labels"] or m["areas"] or m["floors"]):
        raise vol.Invalid(
            "a rule needs at least one label, area or floor", path=["match"]
        )
    if not rule["set"]:
        raise vol.Invalid("a rule must set at least one field", path=["set"])
    return rule


RULE_SCHEMA = vol.All(
    vol.Schema(
        {
            vol.Optional("id"): vol.All(str, vol.Match(r"^[a-z0-9_-]{1,40}$")),
            vol.Required("name"): vol.All(str, vol.Length(min=1, max=80)),
            vol.Optional("enabled", default=True): bool,
            vol.Optional("order", default=0): vol.Coerce(int),
            vol.Required("match"): MATCH_SCHEMA,
            vol.Required("set"): SET_SCHEMA,
        }
    ),
    _match_not_empty,
)

OVERRIDE_FIELDS_SCHEMA = vol.Schema(
    {
        vol.Optional("area"): vol.All(str, vol.Length(min=1)),
        vol.Optional("type"): vol.In(SENSOR_TYPES),
        vol.Optional("modes"): _mode_list,
        vol.Optional("auto_bypass_modes"): _mode_list,
        **{vol.Optional(k): bool for k in SET_FIELDS_BOOL},
        vol.Optional("entry_delay"): _opt_secs,
        vol.Optional("delay_on"): _opt_secs,
    }
)


# ---------------------------------------------------------------------------
# context


@dataclass
class EntityCtx:
    """What the rules can see about one entity."""

    entity_id: str
    labels: set[str] = field(default_factory=set)
    area: str | None = None
    floor: str | None = None
    device_class: str | None = None
    exists: bool = True


def specificity(rule: dict) -> int:
    """Number of match conditions (labels count one each)."""
    m = rule["match"]
    return len(m.get("labels", [])) + bool(m.get("areas")) + bool(m.get("floors"))


def matches(
    rule: dict, ctx: EntityCtx, known: dict[str, set[str]] | None = None
) -> bool:
    """Does ``rule`` match ``ctx``?

    ``known`` = {"labels": ids, "areas": ids, "floors": ids} that still exist in HA.
    References that no longer exist are ignored; a condition group that only
    contained stale references is dropped (it neither matches nor blocks).
    """
    if not rule.get("enabled", True):
        return False
    m = rule["match"]

    def live(kind: str) -> list[str]:
        vals = m.get(kind, [])
        return [v for v in vals if known is None or v in known.get(kind, set())]

    labels, areas, floors = live("labels"), live("areas"), live("floors")
    if not (labels or areas or floors):
        return False
    if labels and not set(labels) <= ctx.labels:
        return False
    if areas and ctx.area not in areas:
        return False
    return not (floors and ctx.floor not in floors)


def stale_references(rules: list[dict], known: dict[str, set[str]]) -> list[dict]:
    """Rule conditions that point at labels/areas/floors that no longer exist."""
    out = []
    for r in rules:
        for kind in ("labels", "areas", "floors"):
            for ref in r["match"].get(kind, []):
                if ref not in known.get(kind, set()):
                    out.append(
                        {
                            "rule": r.get("id"),
                            "name": r["name"],
                            "kind": kind,
                            "ref": ref,
                        }
                    )
    return out


# ---------------------------------------------------------------------------
# resolve


def _default_type(ctx: EntityCtx) -> str:  # noqa: PLR0911
    domain = ctx.entity_id.split(".", 1)[0]
    if domain in ("cover", "lock"):
        return "door"
    dc = ctx.device_class
    if dc in ("door", "garage_door", "lock", "opening"):
        return "door"
    if dc == "window":
        return "window"
    if dc in ("motion", "moving", "occupancy", "presence"):
        return "motion"
    if dc in ("carbon_monoxide", "gas", "heat", "moisture", "smoke", "safety"):
        return "environmental"
    if dc in ("sound", "vibration", "tamper"):
        return "tamper"
    return "other"


def resolve(  # noqa: PLR0912
    contexts: dict[str, EntityCtx],
    rules: list[dict],
    overrides: dict[str, dict[str, Any]],
    sensors: dict[str, dict[str, Any]],
    partitions: set[str],
    known: dict[str, set[str]] | None = None,
) -> dict[str, Any]:
    """Work out what every zone should look like.

    Returns {
      "zones": {entity_id: {"values": {sensor_field: value}, "sources": {sensor_field:
                 {"kind": "rule"|"override"|"manual", "rules": [ids]}},
                 "conflicts": [{"field", "rules": [ids], "values": [...]}],
                 "new": bool, "managed": bool}},
      "needs_partition": [entity_id],   # matched, not configured, no partition rule
    }
    Only fields that rules/overrides manage appear in ``values``.
    """
    active = [r for r in rules if r.get("enabled", True)]
    zones: dict[str, Any] = {}
    needs_partition: list[str] = []

    candidates = set(sensors) | {
        eid for eid in contexts if eid.split(".", 1)[0] in ZONE_DOMAINS
    }
    for eid in sorted(candidates):
        ctx = contexts.get(eid) or EntityCtx(entity_id=eid, exists=False)
        hit = [r for r in active if matches(r, ctx, known)]
        ovr = overrides.get(eid, {})
        configured = eid in sensors
        if not hit and not (configured and ovr):
            continue
        if not configured and not hit:
            continue

        values: dict[str, Any] = {}
        sources: dict[str, Any] = {}
        conflicts: list[dict] = []

        for f in SET_FIELDS_LIST:
            contrib = [r for r in hit if f in r["set"]]
            if contrib:
                union: list[str] = []
                for r in sorted(contrib, key=lambda r: r.get("order", 0)):
                    union += [m for m in r["set"][f] if m not in union]
                values[f] = [m for m in const.ARM_MODES if m in union]
                sources[f] = {"kind": "rule", "rules": [r.get("id") for r in contrib]}

        for f in SET_FIELDS_SINGLE:
            contrib = [r for r in hit if f in r["set"]]
            if not contrib:
                continue
            top = max(specificity(r) for r in contrib)
            best = [r for r in contrib if specificity(r) == top]
            distinct = []
            for r in best:
                if r["set"][f] not in distinct:
                    distinct.append(r["set"][f])
            sf = TO_SENSOR_FIELD.get(f, f)
            if len(distinct) > 1:
                conflicts.append(
                    {
                        "field": sf,
                        "rules": [r.get("id") for r in best],
                        "values": distinct,
                    }
                )
                continue
            value = distinct[0]
            if f == "partition" and value not in partitions:
                conflicts.append(
                    {
                        "field": sf,
                        "rules": [r.get("id") for r in best],
                        "values": [value],
                        "reason": "partition does not exist",
                    }
                )
                continue
            values[sf] = value
            sources[sf] = {"kind": "rule", "rules": [r.get("id") for r in best]}

        for f, v in ovr.items():
            values[f] = v
            sources[f] = {
                "kind": "override",
                "rules": sources.get(f, {}).get("rules", []),
            }
            conflicts = [c for c in conflicts if c["field"] != f]

        if not configured:
            if "area" not in values:
                needs_partition.append(eid)
                continue
            values.setdefault("type", _default_type(ctx))
            values.setdefault("modes", [])

        zones[eid] = {
            "values": values,
            "sources": sources,
            "conflicts": conflicts,
            "new": not configured,
            "managed": bool(hit),
            "rules": [r.get("id") for r in hit],
            "exists": ctx.exists,
        }

    return {"zones": zones, "needs_partition": needs_partition}


def diff_against_store(
    resolved: dict[str, Any], sensors: dict[str, dict[str, Any]]
) -> dict[str, Any]:
    """Batch (create/update) needed to make the store match the resolved zones.

    Rules never delete zones. Returns {"create": [...], "update": [...],
    "unmanaged": [entity ids configured but matched by no rule]}.
    """
    create, update = [], []
    for eid, z in resolved["zones"].items():
        if z["new"]:
            create.append({"entity_id": eid, **z["values"]})
            continue
        current = sensors.get(eid, {})
        changes = {}
        for f, v in z["values"].items():
            cur = current.get(f)
            if f in SET_FIELDS_LIST:
                if sorted(cur or []) != sorted(v or []):
                    changes[f] = v
            elif cur != v:
                changes[f] = v
        if changes:
            update.append({"entity_id": eid, "changes": changes})
    unmanaged = sorted(eid for eid in sensors if eid not in resolved["zones"])
    return {"create": create, "update": update, "unmanaged": unmanaged}
