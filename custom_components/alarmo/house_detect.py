"""House Modes auto-detect: suggest House Modes from the user's input_selects and the activity log.

Pure functions (no Home Assistant objects), so they can be tested against real exports.

- ``pick_entities``: which input_select is the selector (manual choice), the current mode and the previous mode.
- ``evidence``: every time the current-mode entity changed, which state each Alarmo partition was in shortly after.
- ``suggest``: one House Mode per option, with partition targets from the evidence (majority) or, without
  evidence, from the mode's name.
"""

from __future__ import annotations

import re
from typing import Any
from collections import Counter, defaultdict

SKIP_OPTIONS = {"", "unknown", "none", "unavailable", "-", "—"}
TRANSIENT = ("arming", "pending", "triggered", "unavailable", "unknown")
TARGET_STATES = ("armed_away", "armed_home", "armed_night", "armed_vacation", "armed_custom_bypass", "disarmed")
# after the current-mode entity changes, the partitions' state this many seconds later counts
SETTLE = 90
WORD = {
    "armed_away": "Away",
    "armed_home": "Home (Stay)",
    "armed_night": "Night",
    "armed_vacation": "Vacation",
    "armed_custom_bypass": "Custom",
    "disarmed": "Disarmed",
}
# a mode needs this share of the votes for a partition to suggest a target for it
MAJORITY = 0.6

NAME_RULES: list[tuple[str, str | None, str]] = [
    (r"vacation|holiday|travel", "armed_vacation", "mdi:airplane"),
    (r"disarm|^off$|^home$|wake|^day", "disarmed", "mdi:shield-off-outline"),
    (r"away|out|leave", "armed_away", "mdi:car"),
    (r"sleep|night|bed", "armed_night", "mdi:weather-night"),
    (r"stay|home", "armed_home", "mdi:home-lock"),
    (r"spa|bypass|custom|pool|hot.?tub", "armed_custom_bypass", "mdi:hot-tub"),
    (r"guest|party|visitor|clean", None, "mdi:account-group"),
]


def rule_for(name: str) -> tuple[str | None, str, bool]:
    """(target state or None, icon, matched) from a mode name."""
    n = name.strip().lower()
    for pattern, state, icon in NAME_RULES:
        if re.search(pattern, n):
            return state, icon, True
    return None, "mdi:home", False


def pick_entities(selects: list[dict]) -> dict[str, str | None]:
    """selects: [{entity_id, name}] of input_selects. Returns selector / current / previous entity ids."""

    def score(s: dict, words: tuple[str, ...]) -> int:
        text = f"{s['entity_id']} {s.get('name') or ''}".lower()
        return sum(1 for w in words if w in text)

    house = [s for s in selects if re.search(r"house.?mode", f"{s['entity_id']} {s.get('name') or ''}", re.I)]
    out: dict[str, str | None] = {"selector": None, "current": None, "previous": None}
    wanted = (("selector", ("selector", "select", "choose", "manual")), ("previous", ("last", "previous", "prior")))
    for key, words in wanted:
        best = max(house, key=lambda s, w=words: score(s, w), default=None)
        if best is not None and score(best, words):
            out[key] = best["entity_id"]
    rest = [s for s in house if s["entity_id"] not in (out["selector"], out["previous"])]
    if rest:
        # the plainest name is the current mode: input_select.house_mode before input_select.house_mode_xyz
        out["current"] = min(rest, key=lambda s: len(s["entity_id"]))["entity_id"]
    return out


def mode_names(options: list[str]) -> list[str]:
    """Mode names from input_select options (placeholders dropped, order kept, no duplicates)."""
    seen: set[str] = set()
    out = []
    for o in options:
        if str(o).strip().lower() in SKIP_OPTIONS or o.lower() in seen:
            continue
        seen.add(o.lower())
        out.append(o)
    return out


_CHANGE = re.compile(r"→\s*(\S+)\s*$")


def _new_state(text: str) -> str | None:
    m = _CHANGE.search(text or "")
    return m.group(1) if m else None


def evidence(seqs: list[dict], current_entity: str, alarm_entities: dict[str, str]) -> dict[str, Any]:
    """Partition states that followed each change of ``current_entity``.

    seqs: activity sequences ({entries: [{t, kind, text, entity}]}); alarm_entities: entity_id → partition key.
    Returns {"modes": {name: {"count": n, "votes": {key: {state: n}}}}, "changes": n, "days": [first, last]}.
    """
    entries = sorted((e for s in seqs for e in s.get("entries", [])), key=lambda e: e.get("t", 0))
    changes = []
    timeline: dict[str, list[tuple[float, str]]] = defaultdict(list)
    for e in entries:
        ent = e.get("entity")
        new = _new_state(e.get("text", ""))
        if not ent or new is None:
            continue
        if ent == current_entity:
            changes.append((e["t"], new))
        elif ent in alarm_entities:
            timeline[ent].append((e["t"], new))

    def state_at(ent: str, t: float) -> str | None:
        last = None
        for when, st in timeline.get(ent, []):
            if when > t:
                break
            if st not in TRANSIENT:
                last = st
        return last

    modes: dict[str, dict] = {}
    for i, (t, name) in enumerate(changes):
        m = modes.setdefault(name, {"count": 0, "votes": defaultdict(Counter)})
        m["count"] += 1
        # until the next House Mode change at the latest: a quick change back must not count
        until = t + SETTLE if i + 1 == len(changes) else min(t + SETTLE, changes[i + 1][0] - 1)
        for ent, key in alarm_entities.items():
            st = state_at(ent, until)
            if st in TARGET_STATES:
                m["votes"][key][st] += 1
    for m in modes.values():
        m["votes"] = {k: dict(v) for k, v in m["votes"].items()}
    span = [changes[0][0], changes[-1][0]] if changes else []
    return {"modes": modes, "changes": len(changes), "span": span}


def _targets_from_votes(votes: dict[str, dict[str, int]], count: int) -> tuple[dict[str, str], dict[str, float]]:
    targets, share = {}, {}
    for key, c in votes.items():
        state, n = max(c.items(), key=lambda kv: kv[1])
        total = sum(c.values())
        if total and n / total >= MAJORITY:
            targets[key] = state
            share[key] = round(n / total, 2)
    return targets, share


def suggest(names: list[str], ev: dict[str, Any], partitions: list[str]) -> list[dict]:
    """One suggested House Mode per name.

    partitions: the partition keys a mode may target (the name rule sets all of them).
    Each item: {name, icon, targets, basis: "activity"|"name"|"none", seen, share, note}.
    """
    out = []
    by_lower = {k.lower(): v for k, v in (ev.get("modes") or {}).items()}
    for name in names:
        state, icon, matched = rule_for(name)
        seen = by_lower.get(name.lower())
        item = {"name": name, "icon": icon, "targets": {}, "basis": "none", "seen": 0, "share": {}, "note": ""}
        if seen and seen["count"]:
            targets, share = _targets_from_votes(seen["votes"], seen["count"])
            item.update(seen=seen["count"], targets=targets, share=share, basis="activity")
            if not targets:
                item["note"] = "partitions differed each time: left alone"
            elif matched and state and any(v != state for v in targets.values()):
                item["note"] = "the activity log disagrees with the name; the log is used"
            also = sorted(
                {st for c in seen["votes"].values() for st, n in c.items() if st not in targets.values() and n}
            )
            if also:
                counts = {st: sum(c.get(st, 0) for c in seen["votes"].values()) for st in also}
                extra = ", ".join(f"{WORD.get(st, st)} {n}×" for st, n in counts.items())  # noqa: RUF001
                item["note"] = (item["note"] + "; " if item["note"] else "") + f"also seen: {extra}"
        elif matched:
            item["basis"] = "name"
            if state:
                item["targets"] = dict.fromkeys(partitions, state)
            else:
                item["note"] = "leaves the partitions alone"
        else:
            item["note"] = "no activity and the name gives no hint: set the partitions yourself"
        out.append(item)
    return out
