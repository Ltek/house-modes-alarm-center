"""House Modes shadow mode.

House Modes run next to the user's own automations without changing anything: every request
(the input_select, the select entity, a lock code, a timer) is evaluated the way live House Modes
would handle it, and then compared with what really happened to the Alarmo partitions (and,
optionally, to the user's own "confirmed mode" entity). Nothing is armed or disarmed, no step runs,
no notification is sent and no House Mode event is fired. Timers and delayed requests are kept in
memory only.
"""

from __future__ import annotations

import time
from typing import TYPE_CHECKING, Any
from collections import deque

from homeassistant.core import Event, callback
from homeassistant.util import dt as dt_util
from homeassistant.helpers.event import async_call_later, async_track_state_change_event

from .house_config import (
    HISTORY_SIZE,
    find_mode,
    steps_for,
    permission,
    timers_for,
    derive_mode,
    open_entities,
)

if TYPE_CHECKING:
    from .house_modes import HouseModeManager

LOG_SIZE = 300
# how long to wait for the user's automations to reach (or not reach) the mode's partition states
WATCH_SECONDS = 180
# the user's own "confirmed mode" entity is written a moment after Alarmo settles
COMPARE_DELAY = 5
# after an external change: give the user's automations time to update their own mode entity
EXTERNAL_COMPARE = 30
TRANSIENT = ("arming", "pending", "triggered")
STATE_WORD = {
    "armed_away": "Away",
    "armed_home": "Home",
    "armed_night": "Night",
    "armed_vacation": "Vacation",
    "armed_custom_bypass": "Custom",
    "disarmed": "Disarmed",
}


class HouseShadow:
    """Dry-run House Modes and compare with reality."""

    def __init__(self, mgr: HouseModeManager) -> None:
        """Initialize."""
        self.mgr = mgr
        self.hass = mgr.hass
        self.log: deque[dict] = deque(maxlen=LOG_SIZE)
        self._watch: dict | None = None
        self._timers: dict[str, Any] = {}
        self._later: list = []

    # ------------------------------------------------------------ log

    def add(self, kind: str, msg: str, ok: bool | None = None, *, starter: bool = False) -> None:
        """One shadow log line (also in the Activity log)."""
        self.log.append({"t": time.time(), "kind": kind, "msg": msg, "ok": ok})
        rec = getattr(self.mgr.ext, "recorder", None)
        if rec is not None:
            mark = {True: " ✓", False: " ✗"}.get(ok, "")
            rec.add("house", f"[shadow] {msg}{mark}", starter=starter, level="warning" if ok is False else "info")

    def summary(self) -> dict[str, Any]:
        """Counts for the House Modes tab."""
        judged = [e for e in self.log if e["ok"] is not None]
        return {
            "matched": sum(1 for e in judged if e["ok"]),
            "differed": sum(1 for e in judged if not e["ok"]),
            "since": self.log[0]["t"] if self.log else None,
            "watching": bool(self._watch),
        }

    # ------------------------------------------------------------ start / stop

    @callback
    def start(self) -> None:
        """Pick up the current mode from the partitions if none is known."""
        s = self.mgr.settings
        if s["current"]:
            return
        derived = derive_mode(s, self.mgr._live_states(s))
        if derived:
            self.hass.async_create_task(self._record(derived, "start"))
            self.add("start", f"started; the partitions match {self._mname(derived)}")
        else:
            self.add("start", "started; the partitions match no House Mode yet")

    @callback
    def stop(self) -> None:
        """Cancel the watch and all in-memory timers."""
        self._end_watch()
        for unsub in self._timers.values():
            unsub()
        self._timers = {}
        while self._later:
            self._later.pop()()

    @property
    def watching(self) -> bool:
        """A request is being compared with what happens."""
        return self._watch is not None

    # ------------------------------------------------------------ requests

    async def request(self, target: dict, source: str, force: bool = False, replay_delay: bool = False) -> dict:
        """What live House Modes would do for this request; then watch what really happens."""
        s = self.mgr.settings
        cur = find_mode(s, s["current"])
        head = f"{source}: {cur['name'] if cur else 'unknown'} → {target['name']}"
        if not force:
            verdict, detail = permission(s, target, source)
            if verdict == "delay" and replay_delay:
                verdict = "allow"
            if verdict == "block":
                self._begin_watch(target, source, "no_change", f"{head}: would be blocked ({detail})")
                return {"result": "shadow", "would": "blocked", "reason": detail}
            if verdict == "delay":
                self._delay(target, source, int(detail), cur["id"] if cur else None)
                self._begin_watch(target, source, "no_change", f"{head}: would wait {detail} min")
                return {"result": "shadow", "would": "delayed", "minutes": detail}
            states = {st.entity_id: st.state for st in self.hass.states.async_all()}
            labels = target["readiness"].get("labels", [])
            opened = open_entities(states, target["readiness"], self.mgr._label_members(labels))
            if opened and target["readiness"]["action"] == "block":
                names = ", ".join(self.mgr._name(e) for e in opened)
                self._begin_watch(target, source, "no_change", f"{head}: would not change, not ready (open: {names})")
                return {"result": "shadow", "would": "not_ready", "open": opened}
        steps = [st["entity_id"] for _m, st in steps_for(cur, target, "before") + steps_for(cur, target, "after")]
        sets = ", ".join(f"{self._area(k)} {STATE_WORD.get(v, v)}" for k, v in target["targets"].items())
        msg = f"{head}: would set {sets or 'no partitions'}"
        if steps:
            msg += f"; would run {', '.join(steps)}"
        if not target["targets"]:
            self.add("request", msg)
            await self._record(target["id"], source)
            self._compare_later(target, COMPARE_DELAY)
            return {"result": "shadow", "would": "changed"}
        self._begin_watch(target, source, "change", msg)
        return {"result": "shadow", "would": "changed"}

    # ------------------------------------------------------------ watch

    def _matches(self, target: dict) -> bool:
        live = self.mgr._live_states(self.mgr.settings)
        return all(live.get(k) == v for k, v in target["targets"].items())

    def _begin_watch(self, target: dict, source: str, expect: str, msg: str) -> None:
        if self._watch:
            old = self._watch
            self._end_watch()
            self.add("request", f"{old['target']['name']}: superseded by the next request before it settled")
        if expect == "no_change" and (not target["targets"] or self._matches(target)):
            # the partitions cannot show whether the change happened: only the user's own mode entity can
            self.add("request", msg)
            self._compare_later(target, COMPARE_DELAY, expect_same=False)
            return
        if expect == "change" and self._matches(target):
            self.add("request", f"{msg}; the partitions already match", True)
            self.hass.async_create_task(self._record(target["id"], source))
            self._compare_later(target, COMPARE_DELAY)
            return
        self.add("request", msg)
        ents = [e.entity_id for k in target["targets"] if (e := self.mgr._entity(k)) is not None and e.entity_id]
        name = target["name"]
        w = {"target": target, "source": source, "expect": expect, "msg": name, "t0": time.monotonic()}
        w["unsubs"] = [
            async_track_state_change_event(self.hass, ents, self._on_state),
            async_call_later(self.hass, WATCH_SECONDS, self._on_timeout),
        ]
        self._watch = w

    def _end_watch(self) -> None:
        w, self._watch = self._watch, None
        for unsub in (w or {}).get("unsubs", []):
            unsub()

    @callback
    def _on_state(self, event: Event) -> None:
        w = self._watch
        if w is None:
            return
        new = event.data.get("new_state")
        if new is not None and new.state in TRANSIENT:
            return
        if not self._matches(w["target"]):
            return
        secs = round(time.monotonic() - w["t0"])
        self._end_watch()
        if w["expect"] == "change":
            self.add("request", f"{w['msg']}: your automations got there after {secs} s", True)
        else:
            self.add("request", f"{w['msg']}: but your automations changed to it after {secs} s", False)
        self.hass.async_create_task(self._record(w["target"]["id"], w["source"]))
        self._compare_later(w["target"], COMPARE_DELAY)

    @callback
    def _on_timeout(self, _now) -> None:
        w = self._watch
        if w is None:
            return
        self._watch = None
        for unsub in w["unsubs"][:1]:
            unsub()
        live = self.mgr._live_states(self.mgr.settings)
        now = ", ".join(f"{self._area(k)} {STATE_WORD.get(live.get(k), live.get(k))}" for k in w["target"]["targets"])
        if w["expect"] == "change":
            policy = w["target"]["on_failure"]
            self.add(
                "request",
                f"{w['msg']}: after {WATCH_SECONDS} s the partitions are {now} (live House Modes: failed, on failure "
                f"{policy})",
                False,
            )
        else:
            self.add("request", f"{w['msg']}: the partitions stayed {now}", True)
        self._resync()

    # ------------------------------------------------------------ external changes

    @callback
    def on_alarm_change(self) -> None:
        """A partition changed and no request is being watched (keypad, card, other automation)."""
        if self._watch:
            return
        s = self.mgr.settings
        live = self.mgr._live_states(s, self.mgr.overrides)
        if any(v in TRANSIENT for v in live.values()):
            return
        derived = derive_mode(s, live, self.mgr.overrides)
        if derived == s["current"]:
            return
        mode = find_mode(s, derived)
        self.add("external", f"partitions changed outside House Modes → House Mode would become "
                 f"{mode['name'] if mode else 'unknown'}")
        self.hass.async_create_task(self._record(derived, "external"))
        if mode:
            self._compare_later(mode, EXTERNAL_COMPARE)

    def not_a_mode(self, option: str) -> None:
        """The input_select was set to an option that is no House Mode."""
        self.add("request", f"{self.mgr.settings.get('input_select')} set to '{option}', which is not a House Mode")

    # ------------------------------------------------------------ compare with the user's own mode entity

    def _compare_later(self, target: dict, delay: int, expect_same: bool = True) -> None:
        ent = self.mgr.settings.get("current_entity")
        if not ent:
            return
        prev_ent = self.mgr.settings.get("previous_entity")

        @callback
        def _check(_now) -> None:
            st = self.hass.states.get(ent)
            have = st.state if st else "missing"
            same = have.lower() == target["name"].lower()
            if expect_same:
                self.add("compare", f"{ent} is {have}" + ("" if same else f", House Modes: {target['name']}"), same)
                prev = find_mode(self.mgr.settings, self.mgr.settings["previous"])
                if prev_ent and prev:
                    pst = self.hass.states.get(prev_ent)
                    phave = pst.state if pst else "missing"
                    psame = phave.lower() == prev["name"].lower()
                    tail = "" if psame else f", House Modes: {prev['name']}"
                    self.add("compare", f"{prev_ent} is {phave}{tail}", psame)
            else:
                self.add("compare", f"{ent} is {have}" + (f" (House Modes would not have changed to {target['name']})"
                                                           if same else ""), not same)

        self._later.append(async_call_later(self.hass, delay, _check))
        if len(self._later) > 20:
            self._later = self._later[-20:]

    # ------------------------------------------------------------ timers and delays (in memory)

    def _timer(self, key: str, minutes: float, fire) -> None:
        old = self._timers.pop(key, None)
        if old:
            old()
        self._timers[key] = async_call_later(self.hass, minutes * 60, fire)

    def _delay(self, target: dict, source: str, minutes: int, context: str | None) -> None:
        @callback
        def _fire(_now) -> None:
            self._timers.pop("delayed", None)
            if self.mgr.settings["current"] != context:
                return
            self.add("timer", f"delayed request due: {target['name']} now", starter=True)
            self.hass.async_create_task(self.request(target, source, replay_delay=True))

        self._timer("delayed", minutes, _fire)

    def _start_timers(self, mode: dict | None, prev: str | None) -> None:
        for key in [k for k in self._timers if k.startswith("timer")]:
            self._timers.pop(key)()
        delayed = self._timers.pop("delayed", None)
        if delayed:
            delayed()  # any change cancels a delayed request, as in live House Modes
        if not mode:
            return
        for i, t in enumerate(timers_for(mode, prev, dt_util.now().time())):
            tgt_id = t["then"] if t["then"] != "previous" else prev
            tgt = find_mode(self.mgr.settings, tgt_id)
            if not tgt:
                continue
            self.add("timer", f"{mode['name']}: would change to {tgt['name']} in {t['after_minutes']} min")

            @callback
            def _fire(_now, tgt=tgt, context=mode["id"], key=f"timer{i}") -> None:
                self._timers.pop(key, None)
                if self.mgr.settings["current"] != context:
                    return
                self.add("timer", f"timer due: {tgt['name']} now", starter=True)
                self.hass.async_create_task(self.request(tgt, "timer"))

            self._timer(f"timer{i}", t["after_minutes"], _fire)

    # ------------------------------------------------------------ shadow state

    def _resync(self) -> None:
        s = self.mgr.settings
        derived = derive_mode(s, self.mgr._live_states(s, self.mgr.overrides), self.mgr.overrides)
        if derived != s["current"]:
            self.hass.async_create_task(self._record(derived, "external"))

    async def _record(self, mode_id: str | None, source: str) -> None:
        """Keep the shadow's own current/previous/history (nothing else is touched)."""
        data = self.mgr.settings
        prev = data["current"]
        if mode_id == prev:
            return
        data["previous"] = prev
        data["current"] = mode_id
        data["source"] = source
        data["changed_at"] = dt_util.utcnow().isoformat()
        data["history"] = (
            data["history"]
            + [{"at": data["changed_at"], "from": prev, "to": mode_id, "source": source, "result": "shadow"}]
        )[-HISTORY_SIZE:]
        data["pending"] = []
        await self.mgr._store(data)
        self._start_timers(find_mode(data, mode_id), prev)

    # ------------------------------------------------------------ names

    def _mname(self, mode_id: str | None) -> str:
        m = find_mode(self.mgr.settings, mode_id)
        return m["name"] if m else str(mode_id)

    def _area(self, key: str) -> str:
        ent = self.mgr._entity(key)
        return getattr(ent, "name", None) or key
