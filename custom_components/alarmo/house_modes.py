"""House Modes runtime.

Applies modes to Alarmo partitions, with permissions, readiness, external-change
tracking, an input_select mirror, lock keypads and timers.
"""

from __future__ import annotations

import time
import uuid
import asyncio
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, Context, HomeAssistant, callback
from homeassistant.util import dt as dt_util
from homeassistant.helpers import label_registry as lr  # noqa: F401
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_point_in_utc_time,
    async_track_state_change_event,
)
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .house_config import (
    HISTORY_SIZE,
    slug,
    find_mode,
    normalize,
    steps_for,
    permission,
    timers_for,
    derive_mode,
    open_entities,
)
from .house_shadow import HouseShadow

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

SIGNAL_HOUSE = "alarmo_ext_house_updated"
EVENT_CHANGED = "alarmo_house_mode_changed"
EVENT_FAILED = "alarmo_house_mode_failed"
EVENT_BLOCKED = "alarmo_house_mode_blocked"
ARM_TIMEOUT = 180


class HouseModeError(Exception):
    """Invalid request."""


class HouseModeManager:
    """Owns House Mode state; one per HA run."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize."""
        self.hass = hass
        self.ext = ext
        self._lock = asyncio.Lock()
        self._applying = False
        self._unsubs: list = []
        self._timer_unsubs: dict[str, Any] = {}
        self._own_select_write: str | None = None
        # partition targets on top of the current mode (keypad actions); cleared on a mode change
        self.overrides: dict[str, str] = {}
        self.shadow_log = HouseShadow(self)

    @property
    def shadow(self) -> bool:
        """House Modes run in shadow: evaluate and compare, change nothing."""
        s = self.settings
        return s["enabled"] and s.get("run_mode") == "shadow"

    # ------------------------------------------------------------ settings/state

    @property
    def settings(self) -> dict[str, Any]:
        """Validated settings + runtime state."""
        return normalize(self.ext.extras.data.get("house"))

    async def _store(self, data: dict) -> None:
        await self.ext.extras.async_update(house=data)
        async_dispatcher_send(self.hass, SIGNAL_HOUSE)

    async def async_save_settings(self, raw: dict) -> dict[str, Any]:
        """Validate editable settings; keep runtime state."""
        raw = dict(raw)
        for m in raw.get("modes", []):
            if not m.get("id") and m.get("name"):
                m["id"] = slug(m["name"])
        current = self.settings
        for k in ("current", "previous", "history", "pending", "source", "changed_at"):
            raw[k] = current[k]
        clean = normalize(raw)
        if clean["current"] and not find_mode(clean, clean["current"]):
            clean["current"] = None
        await self._store(clean)
        self.async_restart()
        return clean

    def current(self) -> dict | None:
        """The active House Mode."""
        s = self.settings
        return find_mode(s, s["current"])

    # ------------------------------------------------------------ alarm entities

    def _entity(self, key: str):
        from .panel_config import MASTER_KEY  # noqa: PLC0415

        data = self.hass.data.get("alarmo") or {}
        if key == MASTER_KEY:
            return data.get("master")
        return (data.get("areas") or {}).get(key)

    def _target_states(self, settings: dict, extra: dict | None = None) -> dict[str, str]:
        out = {}
        keys = {k for m in settings["modes"] for k in m["targets"]} | set(extra or {})
        for k in keys:
            ent = self._entity(k)
            st = self.hass.states.get(ent.entity_id) if ent and ent.entity_id else None
            if st:
                out[k] = st.state
        return out

    def _live_states(self, settings: dict, extra: dict | None = None) -> dict[str, str]:
        """The entities' own states now (state events can arrive late)."""
        out = {}
        keys = {k for m in settings["modes"] for k in m["targets"]} | set(extra or {})
        for k in keys:
            ent = self._entity(k)
            if ent is not None and ent.entity_id and ent.alarm_state:
                out[k] = ent.alarm_state
        return out

    def _label_members(self, labels: list[str]) -> dict[str, list[str]]:
        reg = er.async_get(self.hass)
        return {
            lab: [e.entity_id for e in er.async_entries_for_label(reg, lab)]
            for lab in labels
        }

    # ------------------------------------------------------------ public API

    async def async_set_mode(
        self,
        ref: str,
        source: str = "manual",
        force: bool = False,
        replay_delay: bool = False,
    ) -> dict[str, Any]:
        """Change the House Mode. Returns {"result": ...}."""
        settings = self.settings
        if not settings["enabled"]:
            raise HouseModeError("House Modes are turned off")
        target = find_mode(settings, ref)
        if target is None:
            raise HouseModeError(f"unknown House Mode '{ref}'")
        if settings["current"] == target["id"]:
            return {"result": "same", "mode": target["id"]}
        if self.shadow:
            return await self.shadow_log.request(target, source, force=force, replay_delay=replay_delay)

        if not force:
            verdict, detail = permission(settings, target, source)
            if verdict == "delay" and replay_delay:
                verdict = "allow"
            if verdict == "block":
                self._event(EVENT_BLOCKED, target, source, reason=detail)
                return {"result": "blocked", "reason": detail}
            if verdict == "delay":
                await self._schedule(
                    {
                        "kind": "delayed",
                        "target": target["id"],
                        "source": source,
                        "context": settings["current"],
                    },
                    detail,
                )
                return {"result": "delayed", "minutes": detail}
            states = {s.entity_id: s.state for s in self.hass.states.async_all()}
            labels = target["readiness"].get("labels", [])
            opened = open_entities(
                states, target["readiness"], self._label_members(labels)
            )
            if opened:
                names = ", ".join(self._name(e) for e in opened)
                if target["readiness"]["action"] == "block":
                    self._event(EVENT_BLOCKED, target, source, reason=f"open: {names}")
                    await self._notify(f"{target['name']} not set", f"Open: {names}")
                    return {"result": "not_ready", "open": opened}
                await self._notify(f"{target['name']}: not ready", f"Open: {names}")

        async with self._lock:
            prev = find_mode(settings, settings["current"])
            await self._run_steps(prev, target, "before", source)
            return await self._apply(target, source)

    def _name(self, entity_id: str) -> str:
        st = self.hass.states.get(entity_id)
        return (st.attributes.get("friendly_name") if st else None) or entity_id

    async def _apply(self, target: dict, source: str) -> dict[str, Any]:
        settings = self.settings
        before = self._target_states(settings)
        self._applying = True
        try:
            failed = await self._drive(target["targets"])
            if failed:
                policy = target["on_failure"]
                prev = find_mode(settings, settings["current"])
                if policy == "undo":
                    await self._drive(
                        {k: v for k, v in before.items() if k in target["targets"]}
                    )
                elif policy == "previous" and prev:
                    await self._drive(prev["targets"])
                self._event(EVENT_FAILED, target, source, failed=failed, policy=policy)
                await self._notify(
                    f"House Mode {target['name']} failed",
                    "Did not arm: " + ", ".join(failed) + f" (on failure: {policy})",
                )
                if policy == "keep":
                    await self._record(None, source, result="failed")
                return {"result": "failed", "failed": failed, "policy": policy}
            await self._record(target["id"], source)
            return {"result": "changed", "mode": target["id"]}
        finally:
            self._applying = False

    async def async_apply_overrides(self, targets: dict[str, str]) -> list[str]:
        """Set partitions on top of the current House Mode (kept until the mode changes)."""
        self._applying = True
        try:
            failed = await self._drive(targets)
        finally:
            self._applying = False
        self.overrides.update({k: v for k, v in targets.items() if k not in failed})
        return failed

    async def _drive(self, targets: dict[str, str]) -> list[str]:
        """Bring each Alarmo entity to its target state. Returns keys that failed."""
        failed: list[str] = []
        waiting: dict[str, tuple[Any, str]] = {}
        for key, want in targets.items():
            ent = self._entity(key)
            if ent is None or not ent.entity_id:
                failed.append(key)
                continue
            have = ent.alarm_state
            if have == want:
                continue
            if want == "disarmed":
                await ent.async_alarm_disarm(code=None, skip_code=True)
            else:
                if have not in ("disarmed", None):
                    await ent.async_alarm_disarm(code=None, skip_code=True)
                await ent.async_handle_arm_request(want, skip_code=True)
            waiting[ent.entity_id] = (ent, want)
        if waiting:
            results = await self._wait(waiting)
            failed += [eid for eid, ok in results.items() if not ok]
        return failed

    async def _wait(self, waiting: dict[str, tuple[Any, str]]) -> dict[str, bool]:
        """Wait until every entity reaches its target, or fails back to disarmed."""
        results: dict[str, bool] = {}
        fut: asyncio.Future = self.hass.loop.create_future()

        def check(eid: str) -> None:
            ent, want = waiting[eid]
            state = ent.alarm_state  # the entity's own state (written to HA later)
            # "arming" counts: Alarmo's exit delay runs on its own; if it is aborted,
            # external-change tracking moves the House Mode to whatever now matches.
            if state == want or (want != "disarmed" and state == "arming"):
                results[eid] = True
            elif want != "disarmed" and state == "disarmed":
                results[eid] = False
            if len(results) == len(waiting) and not fut.done():
                fut.set_result(True)

        @callback
        def changed(event: Event) -> None:
            eid = event.data["entity_id"]
            if eid not in results:
                check(eid)

        unsub = async_track_state_change_event(self.hass, list(waiting), changed)
        try:
            for eid in waiting:
                check(eid)
            if not fut.done():
                await asyncio.wait_for(fut, ARM_TIMEOUT)
        except TimeoutError:
            pass
        finally:
            unsub()
        return {eid: results.get(eid, False) for eid in waiting}

    async def _record(
        self, mode_id: str | None, source: str, result: str = "changed"
    ) -> None:
        data = self.settings
        prev = data["current"]
        if mode_id != prev:
            self.overrides = {}
        data["previous"] = prev
        data["current"] = mode_id
        data["source"] = source
        data["changed_at"] = dt_util.utcnow().isoformat()
        data["history"] = (
            data["history"]
            + [
                {
                    "at": data["changed_at"],
                    "from": prev,
                    "to": mode_id,
                    "source": source,
                    "result": result,
                }
            ]
        )[-HISTORY_SIZE:]
        # any change cancels timers/delayed requests that belonged to the old mode
        data["pending"] = []
        self._cancel_timers()
        mode = find_mode(data, mode_id)
        new_pending = []
        if mode:
            now = dt_util.now()
            for t in timers_for(mode, prev, now.time()):
                new_pending.append(
                    {
                        "id": uuid.uuid4().hex[:12],
                        "kind": "timer",
                        "due": time.time() + t["after_minutes"] * 60,
                        "context": mode_id,
                        "target": t["then"]
                        if t["then"] != "previous"
                        else (prev or ""),
                        "source": "timer",
                        "notify": t["notify"],
                        "minutes": t["after_minutes"],
                    }
                )
        data["pending"] = new_pending
        await self._store(data)
        for p in new_pending:
            self._arm_timer(p)
            if p["notify"] and p["target"]:
                tgt = find_mode(data, p["target"])
                await self._notify(
                    f"House Mode {mode['name']}",
                    f"Changes to {tgt['name'] if tgt else p['target']} "
                    f"in {p['minutes']} min",
                )
        self._event(EVENT_CHANGED, mode, source, previous=prev, result=result)
        self._mirror_to_select(mode)
        self._write_mode_entities(mode, find_mode(data, prev) if mode_id != prev else None)
        if mode_id != prev and result in ("changed", "external"):
            self.hass.async_create_task(
                self._run_steps(find_mode(data, prev), mode, "after", source), "alarmo_house_steps"
            )

    async def _run_steps(self, leaving: dict | None, entering: dict | None, phase: str, source: str) -> None:
        """Run the House Mode steps (native scenes / scripts) for this change and phase. Never raises."""
        steps = steps_for(leaving, entering, phase)
        if not steps:
            return
        variables = {
            "from_mode": leaving["name"] if leaving else None,
            "to_mode": entering["name"] if entering else None,
            "source": source,
        }
        rec = getattr(self.ext, "recorder", None)
        for mode, st in steps:
            eid = st["entity_id"]
            what = f"{mode['name']} · {'leaving' if st['when'] == 'leave' else 'entering'} · {phase}: {eid}"
            try:
                if eid.startswith("scene."):
                    await self.hass.services.async_call("scene", "turn_on", {"entity_id": eid}, blocking=True)
                elif st["wait"]:
                    await asyncio.wait_for(
                        self.hass.services.async_call(
                            "script", eid.split(".", 1)[1], variables, blocking=True
                        ),
                        300,
                    )
                else:
                    await self.hass.services.async_call(
                        "script", "turn_on", {"entity_id": eid, "variables": variables}, blocking=False
                    )
                if rec is not None:
                    rec.add("house", f"House Mode step ran: {what}")
            except Exception as err:  # a failing step must not stop the change or the other steps
                _LOGGER.warning("House Mode step %s failed: %s", what, err)
                if rec is not None:
                    rec.add("house", f"House Mode step failed: {what}: {err}", level="error")
                await self._notify("House Mode step failed", f"{what}: {err}")

    def _event(
        self, event_type: str, mode: dict | None, source: str, **extra: Any
    ) -> None:
        self.hass.bus.async_fire(
            event_type,
            {
                "mode": mode["id"] if mode else None,
                "name": mode["name"] if mode else None,
                "source": source,
                **extra,
            },
        )

    async def _notify(self, title: str, message: str) -> None:
        for svc in self.settings.get("notify_services") or []:
            domain, name = svc.split(".", 1)
            try:
                await self.hass.services.async_call(
                    domain, name, {"title": title, "message": message}, blocking=True
                )
            except Exception as err:
                _LOGGER.warning("House Mode notify via %s failed: %s", svc, err)

    # ------------------------------------------------------------ timers (Phase 6)

    async def _schedule(self, entry: dict, minutes: int) -> None:
        data = self.settings
        entry = {
            "id": uuid.uuid4().hex[:12],
            "due": time.time() + minutes * 60,
            "minutes": minutes,
            "notify": True,
            **entry,
        }
        data["pending"] = [p for p in data["pending"] if p.get("kind") != "delayed"] + [
            entry
        ]
        await self._store(data)
        self._arm_timer(entry)
        tgt = find_mode(data, entry["target"])
        await self._notify(
            "House Mode delayed",
            f"{tgt['name'] if tgt else entry['target']} in {minutes} min",
        )

    def _arm_timer(self, entry: dict) -> None:
        when = dt_util.utc_from_timestamp(max(entry["due"], time.time() + 1))

        @callback
        def _fire(_now) -> None:
            self._timer_unsubs.pop(entry["id"], None)
            self.hass.async_create_task(
                self._run_timer(entry["id"]), "alarmo_house_timer"
            )

        self._timer_unsubs[entry["id"]] = async_track_point_in_utc_time(
            self.hass, _fire, when
        )

    def _cancel_timers(self) -> None:
        for unsub in self._timer_unsubs.values():
            unsub()
        self._timer_unsubs = {}

    async def _run_timer(self, entry_id: str) -> None:
        data = self.settings
        entry = next((p for p in data["pending"] if p["id"] == entry_id), None)
        if entry is None:
            return
        data["pending"] = [p for p in data["pending"] if p["id"] != entry_id]
        await self._store(data)
        if data["current"] != entry.get("context") or not entry.get("target"):
            return  # the mode changed meanwhile
        try:
            await self.async_set_mode(
                entry["target"],
                entry.get("source", "timer"),
                replay_delay=entry["kind"] == "delayed",
            )
        except HouseModeError as err:
            _LOGGER.warning("House Mode timer: %s", err)

    # ------------------------------------------------------------ listeners

    @callback
    def async_restart(self) -> None:
        """(Re)start listeners and timers from the stored settings."""
        self.async_stop()
        s = self.settings
        if not s["enabled"]:
            return
        shadow = s.get("run_mode") == "shadow"
        keys = {k for m in s["modes"] for k in m["targets"]}
        ents = [
            e.entity_id
            for k in keys
            if (e := self._entity(k)) is not None and e.entity_id
        ]
        if ents:
            self._unsubs.append(
                async_track_state_change_event(self.hass, ents, self._on_alarm_change)
            )
        if s.get("input_select"):
            self._unsubs.append(
                async_track_state_change_event(
                    self.hass, [s["input_select"]], self._on_input_select
                )
            )
        if s["lock_keypads"]:
            self._unsubs.append(
                self.hass.bus.async_listen("zwave_js_notification", self._on_lock)
            )
        if shadow:
            self.shadow_log.start()
            return
        for p in s["pending"]:
            self._arm_timer(p)

    @callback
    def async_stop(self) -> None:
        """Remove listeners and timers."""
        while self._unsubs:
            self._unsubs.pop()()
        self._cancel_timers()
        self.shadow_log.stop()

    @callback
    def _on_alarm_change(self, _event: Event) -> None:
        """Keypad / card / automation changed a partition directly."""
        if self._applying or self._lock.locked():
            return
        new = _event.data.get("new_state")
        if new is None or new.state in ("arming", "pending", "triggered"):
            return
        if self.shadow:
            self.shadow_log.on_alarm_change()
            return
        s = self.settings
        live = self._live_states(s, self.overrides)
        if any(v in ("arming", "pending", "triggered") for v in live.values()):
            return  # still on its way; the final state change comes later
        derived = derive_mode(s, live, self.overrides)
        if derived != s["current"]:
            self.hass.async_create_task(
                self._record(derived, "external", result="external")
            )

    @callback
    def _on_input_select(self, event: Event) -> None:
        new = event.data.get("new_state")
        if new is None:
            return
        if self._own_select_write == new.state:
            self._own_select_write = None
            return
        cur = self.current()
        if cur and cur["name"].lower() == new.state.lower():
            return
        ctx: Context = new.context
        source = "manual" if ctx and ctx.user_id else "automation"
        self.hass.async_create_task(self._from_select(new.state, source))

    async def _from_select(self, option: str, source: str) -> None:
        try:
            res = await self.async_set_mode(option, source)
        except HouseModeError as err:
            _LOGGER.info("input_select option %s is not a House Mode: %s", option, err)
            if self.shadow:
                self.shadow_log.not_a_mode(option)
            return
        if self.shadow:
            return
        if res["result"] in ("blocked", "failed", "not_ready"):
            self._mirror_to_select(self.current())

    def _mirror_to_select(self, mode: dict | None) -> None:
        ent = self.settings.get("input_select")
        if not ent or mode is None or self.shadow:
            return
        st = self.hass.states.get(ent)
        if st is None or st.state == mode["name"]:
            return
        if mode["name"] not in (st.attributes.get("options") or []):
            _LOGGER.warning("%s has no option '%s'", ent, mode["name"])
            return
        self._own_select_write = mode["name"]
        self.hass.async_create_task(
            self.hass.services.async_call(
                "input_select",
                "select_option",
                {"entity_id": ent, "option": mode["name"]},
            )
        )

    def _write_mode_entities(self, mode: dict | None, prev: dict | None) -> None:
        """Live: keep the user's own current / previous House Mode entities up to date."""
        if self.shadow:
            return
        s = self.settings
        for key, m in (("previous_entity", prev), ("current_entity", mode)):
            ent = s.get(key)
            if not ent or m is None:
                continue
            st = self.hass.states.get(ent)
            if st is None or st.state == m["name"]:
                continue
            if ent.startswith("input_select."):
                if m["name"] not in (st.attributes.get("options") or []):
                    _LOGGER.warning("%s has no option '%s'", ent, m["name"])
                    continue
                call = ("input_select", "select_option", {"entity_id": ent, "option": m["name"]})
            else:
                call = ("input_text", "set_value", {"entity_id": ent, "value": m["name"]})
            self.hass.async_create_task(self.hass.services.async_call(*call))

    @callback
    def _on_lock(self, event: Event) -> None:
        data = event.data
        if data.get("event_label") != "Keypad unlock operation":
            return
        user = (data.get("parameters") or {}).get("userId")
        for kp in self.settings["lock_keypads"]:
            if not kp["enabled"] or user is None:
                continue
            if kp["node_id"] == data.get("node_id"):
                locks = getattr(self.ext, "locks", None)
                if locks is not None and locks.handles(kp["node_id"], user):
                    continue  # linked Alarmo User with its own keypad actions
                mode = kp["slots"].get(str(user))
                if mode:
                    self.hass.async_create_task(self._from_lock(mode))

    async def _from_lock(self, mode: str) -> None:
        try:
            await self.async_set_mode(mode, "lock")
        except HouseModeError as err:
            _LOGGER.warning("Lock keypad: %s", err)
