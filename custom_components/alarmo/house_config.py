"""House Modes: pure configuration and decision logic (no Home Assistant objects)."""

from __future__ import annotations

import re
import copy
import datetime as dt
from typing import Any

import voluptuous as vol

SOURCES = (
    "manual",
    "automation",
    "schedule",
    "presence_away",
    "presence_home",
    "lock",
    "panel_keypad",
    "timer",
)
TARGET_STATES = (
    "armed_away",
    "armed_home",
    "armed_night",
    "armed_vacation",
    "armed_custom_bypass",
    "disarmed",
)
FAILURE = ("undo", "keep", "previous")
HISTORY_SIZE = 50
OPEN_STATES = ("on", "open", "opening", "closing", "unlocked")

_time = vol.Match(r"^([01]\d|2[0-3]):[0-5]\d$")

TIMER_SCHEMA = vol.Schema(
    {
        vol.Required("after_minutes"): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=1440)
        ),
        vol.Required("then"): vol.All(str, vol.Length(min=1)),
        vol.Optional("from_modes", default=[]): [str],
        vol.Optional("window_start"): vol.Any(None, _time),
        vol.Optional("window_end"): vol.Any(None, _time),
        vol.Optional("notify", default=True): bool,
    }
)

STEP_SCHEMA = vol.Schema(
    {
        # a native HA scene (scene.turn_on) or script (script.turn_on with the House Mode variables)
        vol.Required("entity_id"): vol.Match(r"^(scene|script)\.[a-z0-9_]+$"),
        vol.Optional("when", default="enter"): vol.In(("enter", "leave")),
        # before: before the partitions are armed/disarmed; after: once the change succeeded
        vol.Optional("phase", default="after"): vol.In(("before", "after")),
        # only when coming from (enter) / going to (leave) these modes; empty = any
        vol.Optional("modes", default=[]): [str],
        # scripts: wait until the script has finished before going on (max 5 min)
        vol.Optional("wait", default=False): bool,
    }
)

MODE_SCHEMA = vol.Schema(
    {
        vol.Required("id"): vol.Match(r"^[a-z0-9_]{1,32}$"),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Optional("icon", default="mdi:home"): str,
        vol.Optional("targets", default={}): {str: vol.In(TARGET_STATES)},
        vol.Optional("enter_sources", default=list(SOURCES)): [vol.In(SOURCES)],
        vol.Optional("leave_sources", default=list(SOURCES)): [vol.In(SOURCES)],
        vol.Optional("delay_sources", default={}): {
            vol.In(SOURCES): vol.All(vol.Coerce(int), vol.Range(min=1, max=1440))
        },
        vol.Optional("readiness", default={}): vol.Schema(
            {
                vol.Optional("entities", default=[]): [str],
                vol.Optional("labels", default=[]): [str],
                vol.Optional("action", default="warn"): vol.In(("block", "warn")),
            }
        ),
        vol.Optional("on_failure", default="undo"): vol.In(FAILURE),
        vol.Optional("timers", default=[]): [TIMER_SCHEMA],
        vol.Optional("steps", default=[]): [STEP_SCHEMA],
    }
)

KEYPAD_SCHEMA = vol.Schema(
    {
        vol.Required("node_id"): vol.All(vol.Coerce(int), vol.Range(min=1)),
        vol.Optional("name", default=""): str,
        vol.Optional("entity_id"): vol.Any(None, vol.Match(r"^lock\.[a-z0-9_]+$")),
        vol.Optional("enabled", default=True): bool,
        vol.Optional("slots", default={}): {vol.Coerce(str): str},
    }
)


def _unique_modes(modes: list[dict]) -> list[dict]:
    ids = [m["id"] for m in modes]
    names = [m["name"].lower() for m in modes]
    if len(set(ids)) != len(ids):
        raise vol.Invalid("House Mode ids must be unique")
    if len(set(names)) != len(names):
        raise vol.Invalid("House Mode names must be unique")
    known = set(ids)
    for m in modes:
        for t in m["timers"]:
            if t["then"] != "previous" and t["then"] not in known:
                raise vol.Invalid(
                    f"{m['name']}: timer goes to unknown mode '{t['then']}'"
                )
    return modes


SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=False): bool,
        vol.Optional("modes", default=[]): vol.All([MODE_SCHEMA], _unique_modes),
        vol.Optional("input_select"): vol.Any(
            None, vol.Match(r"^input_select\.[a-z0-9_]+$")
        ),
        vol.Optional("lock_keypads", default=[]): [KEYPAD_SCHEMA],
        # shadow: evaluate and compare next to the user's own automations, change nothing
        vol.Optional("run_mode", default="live"): vol.In(("shadow", "live")),
        # the user's own current / previous House Mode entities: written in Live, compared in Shadow
        vol.Optional("current_entity"): vol.Any(None, vol.Match(r"^(input_select|input_text)\.[a-z0-9_]+$")),
        vol.Optional("previous_entity"): vol.Any(None, vol.Match(r"^(input_select|input_text)\.[a-z0-9_]+$")),
        vol.Optional("notify_services", default=[]): [
            vol.Match(r"^notify\.[a-z0-9_]+$")
        ],
    }
)

# Runtime state kept next to the settings (not edited by the user).
STATE_KEYS = ("current", "previous", "history", "pending", "source", "changed_at")


def normalize(raw: dict | None) -> dict[str, Any]:
    """Validate the user-editable part; runtime keys pass through."""
    raw = copy.deepcopy(raw or {})
    state = {k: raw.pop(k) for k in STATE_KEYS if k in raw}
    # ext.6/7 stored a single notify_service; it is a list now
    # v2026.10.29.34 had compare_entity (Shadow only)
    cmp = raw.pop("compare_entity", None)
    if cmp and not raw.get("current_entity") and cmp.split(".")[0] in ("input_select", "input_text"):
        raw["current_entity"] = cmp
    old = raw.pop("notify_service", None)
    if old and not raw.get("notify_services"):
        raw["notify_services"] = [old]
    clean = SETTINGS_SCHEMA(raw)
    clean["current"] = state.get("current")
    clean["previous"] = state.get("previous")
    clean["history"] = list(state.get("history") or [])[-HISTORY_SIZE:]
    clean["pending"] = list(state.get("pending") or [])
    clean["source"] = state.get("source")
    clean["changed_at"] = state.get("changed_at")
    return clean


def slug(name: str) -> str:
    """Mode id from a name."""
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")[:32] or "mode"


def find_mode(settings: dict, ref: str | None) -> dict | None:
    """Mode by id or (case-insensitive) name."""
    if not ref:
        return None
    for m in settings["modes"]:
        if m["id"] == ref or m["name"].lower() == str(ref).lower():
            return m
    return None


def permission(settings: dict, target: dict, source: str) -> tuple[str, Any]:
    """('allow'|'block'|'delay', detail) for changing to ``target`` from ``source``."""
    if source not in target["enter_sources"]:
        return "block", f"{target['name']} cannot be selected by {source}"
    cur = find_mode(settings, settings.get("current"))
    if cur and cur["id"] != target["id"]:
        if source in cur["delay_sources"]:
            return "delay", cur["delay_sources"][source]
        if source not in cur["leave_sources"]:
            return "block", f"{cur['name']} cannot be changed by {source}"
    return "allow", None


def open_entities(
    states: dict[str, str], readiness: dict, label_members: dict[str, list[str]]
) -> list[str]:
    """Readiness entities (direct or by label) that are open now."""
    ids = list(readiness.get("entities", []))
    for lab in readiness.get("labels", []):
        ids += label_members.get(lab, [])
    return sorted({e for e in ids if states.get(e) in OPEN_STATES})


def derive_mode(
    settings: dict, states: dict[str, str], overrides: dict[str, str] | None = None
) -> str | None:
    """Mode matching the alarm states now: keep current if it still matches.

    ``overrides`` are partition targets set on top of the current mode (keypad actions).
    """

    def matches(m: dict, extra: dict | None = None) -> bool:
        targets = {**m["targets"], **(extra or {})}
        return bool(targets) and all(states.get(k) == v for k, v in targets.items())

    cur = find_mode(settings, settings.get("current"))
    if cur and (matches(cur, overrides) or not cur["targets"]):
        return cur["id"]
    for m in settings["modes"]:
        if matches(m):
            return m["id"]
    return None


def in_window(now: dt.time, start: str | None, end: str | None) -> bool:
    """Is ``now`` within [start, end) (may wrap past midnight)? No window = always."""
    if not start or not end:
        return True
    s = dt.time.fromisoformat(start)
    e = dt.time.fromisoformat(end)
    return s <= now < e if s <= e else (now >= s or now < e)


def timers_for(mode: dict, previous: str | None, now: dt.time) -> list[dict]:
    """Timers of ``mode`` that apply when entering it from ``previous`` at ``now``."""
    out = []
    for t in mode["timers"]:
        if t["from_modes"] and previous not in t["from_modes"]:
            continue
        if not in_window(now, t.get("window_start"), t.get("window_end")):
            continue
        out.append(t)
    return out


def steps_for(
    leaving: dict | None, entering: dict | None, phase: str
) -> list[tuple[dict, dict]]:
    """Steps to run for a change, in order: the old mode's "leave" steps, then the new mode's "enter" steps.

    Returns [(mode, step)]. Filters: an enter step's ``modes`` = previous modes it applies to; a leave step's ``modes``
    = next modes it applies to (empty = any).
    """
    out: list[tuple[dict, dict]] = []
    if leaving:
        for st in leaving.get("steps", []):
            if st["when"] == "leave" and st["phase"] == phase:
                if not st["modes"] or (entering and entering["id"] in st["modes"]):
                    out.append((leaving, st))
    if entering:
        for st in entering.get("steps", []):
            if st["when"] == "enter" and st["phase"] == phase:
                if not st["modes"] or (leaving and leaving["id"] in st["modes"]):
                    out.append((entering, st))
    return out
