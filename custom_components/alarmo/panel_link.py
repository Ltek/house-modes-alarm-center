"""Panel link: keep an Alarmo alarm entity and a physical panel in step.

Alarmo -> panel: when Alarmo reaches an armed state (or disarms), send the matching
command, wait for the panel to confirm, retry, then apply the failure policy.
Panel -> Alarmo: keypad arm/disarm at the panel is followed by Alarmo.
Shadow mode: nothing is sent and Alarmo is never changed; the log shows what would
have happened and whether the panel reached the expected state on its own.
"""

from __future__ import annotations

import re
import time
import asyncio
import logging
from typing import TYPE_CHECKING, Any
from collections import deque

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import const
from .panel_config import (
    MASTER_KEY,
    SERVICE_FOR,
    mask_code,
    follow_mode,
    render_keys,
    trip_policy,
    zone_number,
    mode_from_keypad,
    normalize_settings,
)

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

EVENT_PANEL = "alarmo_ext_panel"
SIGNAL_MIRRORS = "alarmo_ext_mirrors_updated"
# seconds before the BYPASS indicator came on in which a closed zone still counts as "open at arming"
QUICK_BYPASS_WINDOW = 90
# after the BYPASS indicator comes on, the Vista lists every bypassed zone ("BYPAS 09", "BYPAS 11", …) within ~10 s;
# those messages replace the "open at arming" guess (10-18: a front door closed 6 s before Quick Bypass was guessed)
BYPASS_CONFIRM_SECONDS = 25
ARMED = tuple(s for s in SERVICE_FOR if s != "disarmed")
EXPECT_SECONDS = 60
# start-up / reconnect check: both sides must be unchanged this long before they are compared
SETTLE_SECONDS = 30
# give up waiting for the panel to report after this long
CHECK_TIMEOUT = 300
NOT_REPORTING = ("unavailable", "unknown")
TRANSIENT = ("arming", "pending", "triggered")
LOG_SIZE = 300


class PanelLinkManager:
    """Owns all links, the activity log and the bypassed-zone set."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize."""
        self.hass = hass
        self.ext = ext
        self.links: dict[str, PanelLink] = {}
        self.log: deque[dict] = deque(maxlen=LOG_SIZE)
        self.bypassed: set[str] = set()
        self._bypassed_loaded = False
        # keypad sensor -> zones of that panel (Honeywell/Vista: the panel's own bypass indicator + "BYPAS zz" text)
        self._keypads: dict[str, list[str]] = {}
        # zone -> time it was last seen open (Quick Bypass bypasses the zones open at arming)
        self._last_open: dict[str, float] = {}
        # zones whose mirror must show "open" because they were open when the panel bypassed them
        self.held_open: set[str] = set()
        # keypad -> (guessed zones, zones confirmed by "BYPAS zz") while the Vista lists its bypasses
        self._bypass_confirm: dict[str, tuple[set[str], set[str]]] = {}
        self.started = False
        self._unsubs: list = []

    # ---------------------------------------------------------------- settings

    @property
    def settings(self) -> dict[str, Any]:
        """Validated settings with defaults."""
        return normalize_settings(self.ext.extras.data.get("panel"))

    async def async_save_settings(self, raw: dict) -> dict[str, Any]:
        """Validate, store and restart the links."""
        clean = normalize_settings(raw)
        await self.ext.extras.async_update(panel=clean)
        self.async_restart()
        async_dispatcher_send(self.hass, SIGNAL_MIRRORS)
        return clean

    def add_log(self, link: str | None, level: str, msg: str, **data: Any) -> None:
        """Activity log entry (also to the HA log)."""
        entry = {"ts": time.time(), "link": link, "level": level, "msg": msg, **data}
        self.log.append(entry)
        rec = getattr(self.ext, "recorder", None)
        if rec is not None:
            rec.link_log(level, msg)
        getattr(_LOGGER, "warning" if level == "error" else "info")(
            "Alarmo panel link %s: %s", link, msg
        )

    # ---------------------------------------------------------------- lifecycle

    @callback
    def async_restart(self) -> None:
        """(Re)create links from settings."""
        self.async_stop()
        self.started = True
        settings = self.settings
        for key, cfg in settings["links"].items():
            if cfg["mode"] == "off":
                continue
            link = PanelLink(self, key, cfg)
            if link.async_start():
                self.links[key] = link
        if not self._bypassed_loaded:
            # bypasses survive a restart (the panel does not report them again)
            self.bypassed = set(self.ext.extras.data.get("panel_bypassed") or [])
            self.held_open = set(self.ext.extras.data.get("panel_held_open") or [])
            self._bypassed_loaded = True
        panels = [
            c["panel_entity"] for c in settings["links"].values() if c["mode"] != "off"
        ]
        # bypass tracking runs for linked panels' zones and for every mirrored zone (no link needed)
        zones = sorted({z for p in panels for z in self.panel_zones(p)} | set(settings["mirrors"]))
        if zones:
            self._unsubs.append(
                async_track_state_change_event(self.hass, zones, self._on_zone_change)
            )
        self._keypads = self._find_keypads(zones)
        if self._keypads:
            self._unsubs.append(
                async_track_state_change_event(self.hass, list(self._keypads), self._on_keypad)
            )
        if settings.get("bypass_entity"):
            self._unsubs.append(
                async_track_state_change_event(
                    self.hass, [settings["bypass_entity"]], self._on_bypass_entity
                )
            )

    @callback
    def async_stop(self) -> None:
        """Remove all listeners."""
        for link in self.links.values():
            link.async_stop()
        self.links = {}
        while self._unsubs:
            self._unsubs.pop()()

    # ---------------------------------------------------------------- helpers

    def alarmo_entity(self, key: str):
        """The Alarmo alarm entity for a link key."""
        data = self.hass.data.get(const.DOMAIN) or {}
        if key == MASTER_KEY:
            return data.get("master")
        return (data.get("areas") or {}).get(key)

    def panel_zones(self, panel_entity: str) -> list[str]:
        """Zone binary_sensors from the same integration entry as the panel."""
        reg = er.async_get(self.hass)
        panel = reg.async_get(panel_entity)
        if not panel or not panel.config_entry_id:
            return []
        out = []
        for entry in er.async_entries_for_config_entry(reg, panel.config_entry_id):
            if entry.domain != "binary_sensor":
                continue
            st = self.hass.states.get(entry.entity_id)
            if st is not None and zone_number(st.attributes) is not None:
                out.append(entry.entity_id)
        return sorted(out)

    def panel_code(self, panel_entity: str) -> str | None:
        """The HA default code set on the panel entity (entity settings)."""
        entry = er.async_get(self.hass).async_get(panel_entity)
        if not entry:
            return None
        return (entry.options.get("alarm_control_panel") or {}).get(
            "default_code"
        ) or None

    def bypass_helper_on(self) -> bool:
        """The bypass helper (if set) is on."""
        ent = self.settings.get("bypass_entity")
        st = self.hass.states.get(ent) if ent else None
        return bool(st and st.state == "on")

    def is_bypassed(self, zone_entity: str) -> bool:
        """Bypassed now: bypassed on the panel since it last disarmed, or the bypass helper is on (mirrored zones)."""
        if zone_entity in self.bypassed:
            return True
        return zone_entity in self.settings["mirrors"] and self.bypass_helper_on()

    def _persist_bypassed(self) -> None:
        self.hass.async_create_task(
            self.ext.extras.async_update(
                panel_bypassed=sorted(self.bypassed), panel_held_open=sorted(self.held_open)
            ),
            "alarmo_ext_bypassed",
        )

    def bypass_attr_reliable(self, zone_entity: str) -> bool:
        """Can the zone's `bypassed` attribute be trusted?

        Not for envisalink_new on a Honeywell/Vista panel (checked in its source, 2026-10-10): the attribute is set
        only when the keypad shows "BYPAS zz", is never cleared (clearing is a TODO), and reaches the zone entity
        only with its next zone update — so it shows up late and stays on until HA restarts.
        """
        reg = er.async_get(self.hass)
        entry = reg.async_get(zone_entity)
        if not entry or not entry.config_entry_id:
            return True
        cfg = self.hass.config_entries.async_get_entry(entry.config_entry_id)
        return not (cfg and cfg.domain == "envisalink_new" and cfg.data.get("panel_type") == "HONEYWELL")

    def honeywell_zones(self) -> list[str]:
        """Mirrored zones whose panel reports bypasses neither per zone nor via a keypad sensor."""
        covered = {z for zones in self._keypads.values() for z in zones}
        return [z for z in self.settings["mirrors"] if not self.bypass_attr_reliable(z) and z not in covered]

    def _find_keypads(self, zones: list[str]) -> dict[str, list[str]]:
        """envisalink_new Honeywell keypad sensors (attributes `armed_bypass` + `alpha`) and their zones.

        Several partitions: a zone belongs to the keypad whose entity id contains `partition_<n>` for the zone's
        `partition` attribute; with one keypad per panel, all its zones.
        """
        reg = er.async_get(self.hass)
        by_entry: dict[str, list[str]] = {}
        for z in zones:
            if self.bypass_attr_reliable(z):
                continue
            ent = reg.async_get(z)
            if ent and ent.config_entry_id:
                by_entry.setdefault(ent.config_entry_id, []).append(z)
        out: dict[str, list[str]] = {}
        for entry_id, zs in by_entry.items():
            keypads = [
                e.entity_id
                for e in er.async_entries_for_config_entry(reg, entry_id)
                if e.domain == "sensor"
                and (st := self.hass.states.get(e.entity_id)) is not None
                and "armed_bypass" in st.attributes
                and "alpha" in st.attributes
            ]
            for kp in keypads:
                if len(keypads) == 1:
                    out[kp] = sorted(zs)
                    continue
                mine = []
                for z in zs:
                    st = self.hass.states.get(z)
                    part = st.attributes.get("partition") if st else None
                    if part is not None and f"partition_{part}" in kp:
                        mine.append(z)
                out[kp] = sorted(mine)
        return out

    def keypad_for_panel(self, panel_entity: str) -> str | None:
        """The envisalink_new keypad sensor (attributes `alpha`, `armed_bypass`) of a panel, if any."""
        reg = er.async_get(self.hass)
        panel = reg.async_get(panel_entity)
        if not panel or not panel.config_entry_id:
            return None
        cands = []
        for e in er.async_entries_for_config_entry(reg, panel.config_entry_id):
            st = self.hass.states.get(e.entity_id) if e.domain == "sensor" else None
            if st is not None and "alpha" in st.attributes:
                same = panel_entity.rsplit(".", 1)[1] in e.entity_id  # alarm_partition_1 -> ..._keypad
                cands.append((not same, e.entity_id))
        return sorted(cands)[0][1] if cands else None

    def _zone_by_number(self, keypad: str, number: int) -> str | None:
        for z in self._keypads.get(keypad, []):
            st = self.hass.states.get(z)
            if st is not None and zone_number(st.attributes) == number:
                return z
        return None

    @callback
    def _on_keypad(self, event: Event) -> None:  # noqa: PLR0912
        """Vista: the BYPASS indicator (`armed_bypass`) and "BYPAS zz" keypad text are the panel's bypass state."""
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None:
            return
        if new.state in ("unavailable", "unknown") or (old is not None and old.state in ("unavailable", "unknown")):
            return  # a connection drop is not the panel clearing its bypasses (seen 2026-10-10 22:22)
        kp = new.entity_id
        zones = self._keypads.get(kp, [])
        now_on = bool(new.attributes.get("armed_bypass"))
        was_on = bool(old is not None and old.attributes.get("armed_bypass"))
        changed = False
        if now_on and not was_on:
            # Quick Bypass: guess the zones open at arming (or closed only a moment ago); the panel's "BYPAS zz"
            # list then confirms which ones it really bypassed (see _confirm_bypasses)
            cutoff = time.monotonic() - QUICK_BYPASS_WINDOW
            guessed: set[str] = set()
            for z in zones:
                st = self.hass.states.get(z)
                if (st is not None and st.state == "on") or self._last_open.get(z, 0) >= cutoff:
                    guessed.add(z)
                    if z not in self.bypassed:
                        self.bypassed.add(z)
                        changed = True
                    self.held_open.add(z)
            self._bypass_confirm[kp] = (guessed, set())
            @callback
            def _later(_now, k=kp) -> None:
                self._confirm_bypasses(k)

            self._unsubs.append(async_call_later(self.hass, BYPASS_CONFIRM_SECONDS, _later))
        if now_on:
            m = re.match(r"^\s*BYPAS\s+0*(\d+)", str(new.attributes.get("alpha") or new.state or ""))
            z = self._zone_by_number(kp, int(m.group(1))) if m else None
            if z and kp in self._bypass_confirm:
                self._bypass_confirm[kp][1].add(z)
            if z and z not in self.bypassed:
                self.bypassed.add(z)
                changed = True
        if was_on and not now_on:
            self._bypass_confirm.pop(kp, None)
            for z in zones:
                if z in self.bypassed:
                    self.bypassed.discard(z)
                    changed = True
                self.held_open.discard(z)
        rec = getattr(self.ext, "recorder", None)
        if rec is not None and changed:
            names = ", ".join(sorted(z for z in zones if z in self.bypassed)) or "none"
            held = ", ".join(sorted(z for z in zones if z in self.held_open))
            rec.add(
                "bypass",
                f"bypassed on the panel: {names}" + (f" · mirrors holding open: {held}" if held else ""),
                starter=True,
            )
        if rec is not None and was_on and not now_on:
            rec.add("bypass", "panel bypasses cleared (BYPASS indicator off)", starter=True)
        if changed or (was_on and not now_on):
            self._persist_bypassed()
            async_dispatcher_send(self.hass, SIGNAL_MIRRORS)

    @callback
    def _confirm_bypasses(self, kp: str) -> None:
        """Keep only the guessed zones the panel listed as "BYPAS zz" (if it listed any)."""
        guessed, confirmed = self._bypass_confirm.pop(kp, (set(), set()))
        if not confirmed:
            return  # no list seen (e.g. no keypad text): keep the guess
        wrong = {z for z in guessed if z not in confirmed and z in self.bypassed}
        if not wrong:
            return
        self.bypassed -= wrong
        self.held_open -= wrong
        rec = getattr(self.ext, "recorder", None)
        if rec is not None:
            rec.add("bypass", f"not bypassed after all (the panel did not list them): {', '.join(sorted(wrong))}")
        self._persist_bypassed()
        async_dispatcher_send(self.hass, SIGNAL_MIRRORS)

    @callback
    def _on_zone_change(self, event: Event) -> None:
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None:
            return
        if new.state == "on":
            self._last_open[new.entity_id] = time.monotonic()
        elif old is not None and old.state == "on":
            self._last_open[new.entity_id] = time.monotonic()
        if not self.bypass_attr_reliable(new.entity_id):
            return
        now_b = bool(new.attributes.get("bypassed"))
        was_b = bool(old is not None and old.attributes.get("bypassed"))
        # only a change of the attribute counts: Honeywell keeps `bypassed` true after the panel disarmed
        if now_b and not was_b and new.entity_id not in self.bypassed:
            self.bypassed.add(new.entity_id)
        elif was_b and not now_b and new.entity_id in self.bypassed:
            self.bypassed.discard(new.entity_id)
        else:
            return
        self._persist_bypassed()
        async_dispatcher_send(self.hass, SIGNAL_MIRRORS)

    @callback
    def _on_bypass_entity(self, _event: Event) -> None:
        async_dispatcher_send(self.hass, SIGNAL_MIRRORS)

    @callback
    def clear_bypassed(self) -> None:
        """The panel disarmed: all bypasses are gone."""
        if self.bypassed or self.held_open:
            self.bypassed.clear()
            self.held_open.clear()
            self._persist_bypassed()
            async_dispatcher_send(self.hass, SIGNAL_MIRRORS)

    async def async_notify(self, title: str, message: str) -> None:
        """Persistent notification + optional notify service."""
        await self.hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "title": title,
                "message": message,
                "notification_id": "alarmo_panel_link",
            },
        )
        svc = self.settings.get("notify_service")
        if svc:
            domain, name = svc.split(".", 1)
            try:
                await self.hass.services.async_call(
                    domain, name, {"title": title, "message": message}, blocking=True
                )
            except Exception as err:
                self.add_log(None, "error", f"notify {svc} failed: {err}")


class PanelLink:
    """One Alarmo entity <-> one panel entity."""

    def __init__(self, mgr: PanelLinkManager, key: str, cfg: dict) -> None:
        """Initialize."""
        self.mgr = mgr
        self.hass = mgr.hass
        self.key = key
        self.cfg = cfg
        self.live = cfg["mode"] == "live"
        self.panel = cfg["panel_entity"]
        self.expect_panel: dict | None = None
        self.expect_alarmo: dict | None = None
        self._arming_since: float | None = None
        self._target: str | None = None  # Alarmo target the running command is for
        self._alarmo_arming_since: float | None = None
        self._task: asyncio.Task | None = None
        self._unsubs: list = []
        # start-up check (after a restart, reload or panel reconnect)
        self._check_settle = None
        self._check_timeout = None
        self._check_why = "start"

    # ---------------------------------------------------------------- start/stop

    @callback
    def async_start(self) -> bool:
        """Listen to both entities. False if the Alarmo entity does not exist."""
        alarmo = self.mgr.alarmo_entity(self.key)
        if alarmo is None or not alarmo.entity_id:
            self.mgr.add_log(
                self.key, "error", "Alarmo entity not found; link not started"
            )
            return False
        self.alarmo_entity_id = alarmo.entity_id
        self._unsubs.append(
            async_track_state_change_event(
                self.hass, [alarmo.entity_id], self._on_alarmo
            )
        )
        self._unsubs.append(
            async_track_state_change_event(self.hass, [self.panel], self._on_panel)
        )
        self.mgr.add_log(
            self.key,
            "info",
            f"started ({self.cfg['mode']}): {alarmo.entity_id} <-> {self.panel}",
        )
        self._check_start("start")
        return True

    # ---------------------------------------------------------------- start-up check
    # After a restart Alarmo restores its last saved state, which can be older than the
    # last change (an unclean shutdown). The panel kept running, so it is the one to trust.

    @property
    def checking(self) -> bool:
        """A start-up check is waiting for both sides to settle."""
        return self._check_timeout is not None

    def _check_start(self, why: str) -> None:
        if not self.checking:
            self._check_why = why
            self._check_timeout = async_call_later(self.hass, CHECK_TIMEOUT, self._check_gave_up)
        self._check_rearm()

    def _check_rearm(self) -> None:
        if self._check_settle:
            self._check_settle()
        self._check_settle = async_call_later(self.hass, SETTLE_SECONDS, self._check_now)

    def _check_cancel(self) -> None:
        for name in ("_check_settle", "_check_timeout"):
            unsub = getattr(self, name)
            if unsub:
                unsub()
            setattr(self, name, None)

    @callback
    def _check_gave_up(self, _now) -> None:
        self._check_timeout = None
        self._check_cancel()
        panel = self.hass.states.get(self.panel)
        self._log(
            "warning",
            f"{self._check_why} check: physical panel did not report "
            f"({panel.state if panel else 'missing'}); Alarmo and the panel were not compared",
        )
        if self.live:
            self.hass.async_create_task(
                self.mgr.async_notify(
                    "Alarm panel not reporting",
                    f"The alarm panel has not reported since Home Assistant started, so Alarmo could not check "
                    f"that both are in the same state. Check {self.panel}.",
                )
            )

    @callback
    def _check_now(self, _now) -> None:
        self._check_settle = None
        panel = self.hass.states.get(self.panel)
        alarmo = self.hass.states.get(self.alarmo_entity_id) if self.alarmo_entity_id else None
        if panel is None or panel.state in NOT_REPORTING or alarmo is None or alarmo.state in NOT_REPORTING:
            return  # keep waiting: a report re-arms the settle timer, the timeout gives up
        why = self._check_why
        self._check_cancel()
        self._reconcile(why, alarmo.state, panel.state)

    def _agree(self, alarmo: str, panel: str) -> bool:
        if alarmo == "disarmed" or panel == "disarmed":
            return alarmo == panel
        cmd = (self.cfg.get("commands") or {}).get(alarmo) or {}
        return panel in (cmd.get("accept") or [alarmo]) or follow_mode(self.cfg, panel) == alarmo

    def _reconcile(self, why: str, astate: str, pstate: str) -> None:  # noqa: PLR0911
        if self._agree(astate, pstate):
            self._log("info", f"{why} check: in step (Alarmo {astate}, physical panel {pstate})", ok=True)
            return
        if astate in TRANSIENT or pstate in TRANSIENT or (pstate not in SERVICE_FOR):
            self._log("warning", f"{why} check: Alarmo is {astate}, physical panel is {pstate}; nothing changed")
            if self.live:
                self.hass.async_create_task(
                    self.mgr.async_notify(
                        "Alarmo and the alarm panel differ",
                        f"After {why}: Alarmo is {astate}, the alarm panel is {pstate}. "
                        "Nothing was changed automatically; please check.",
                    )
                )
            return
        if not self.cfg["follow_panel"]:
            self._log("warning", f"{why} check: Alarmo is {astate}, physical panel is {pstate} (follow panel is off)")
            if self.live:
                self.hass.async_create_task(
                    self.mgr.async_notify(
                        "Alarmo and the alarm panel differ",
                        f"After {why}: Alarmo is {astate}, the alarm panel is {pstate}.",
                    )
                )
            return
        alarmo = self.mgr.alarmo_entity(self.key)
        if alarmo is None:
            return
        note = " If your House Mode selector still shows the old mode, set it again."
        if pstate == "disarmed":
            self._log("warning", f"{why} check: physical panel is disarmed, Alarmo restored {astate} → disarm Alarmo")
            if not self.live:
                return
            self.expect_alarmo = {"target": "disarmed", "deadline": time.monotonic() + EXPECT_SECONDS}
            self.hass.async_create_task(alarmo.async_alarm_disarm(code=None, skip_code=True))
            self.hass.async_create_task(
                self.mgr.async_notify(
                    "Alarmo disarmed to match the alarm panel",
                    f"After {why}, Alarmo was {astate} but the alarm panel is disarmed, so Alarmo was disarmed. "
                    f"Zones only Home Assistant watches are not armed now.{note}",
                )
            )
            return
        mode = follow_mode(self.cfg, pstate)
        self._log("warning", f"{why} check: physical panel is {pstate}, Alarmo restored {astate} → arm Alarmo {mode}")
        if not self.live:
            return
        self._follow_arm(mode, pstate, skip_delay=True, notify=False)
        self.hass.async_create_task(
            self.mgr.async_notify(
                "Alarmo armed to match the alarm panel",
                f"After {why}, Alarmo was {astate} but the alarm panel is {pstate}, so Alarmo was armed "
                f"{mode.replace('armed_', '')} (no exit delay; open zones the panel does not watch are bypassed)."
                f"{note}",
            )
        )

    @callback
    def async_stop(self) -> None:
        """Stop listening and cancel a running command."""
        self._check_cancel()
        while self._unsubs:
            self._unsubs.pop()()
        if self._task and not self._task.done():
            self._task.cancel()

    def _log(self, level: str, msg: str, **data: Any) -> None:
        self.mgr.add_log(
            self.key, level, ("" if self.live else "[shadow] ") + msg, **data
        )

    @staticmethod
    def _valid(expect: dict | None) -> bool:
        return bool(expect) and expect["deadline"] > time.monotonic()

    # ---------------------------------------------------------------- Alarmo -> panel

    @property
    def panel_leads(self) -> bool:
        """Send to the panel when Alarmo starts arming (not after its exit delay)."""
        return self.cfg.get("arm_order", "panel_leads") == "panel_leads"

    def _ours(self, state: str) -> bool:
        """Is this Alarmo change one we caused (keypad follow)? Then it is not sent back to the panel."""
        exp = self.expect_alarmo
        if not self._valid(exp):
            return False
        if state == exp["target"]:
            self.expect_alarmo = None
            return True
        return state in exp.get("also", ())

    @callback
    def _on_alarmo(self, event: Event) -> None:  # noqa: PLR0911
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or (old is not None and old.state == new.state):
            return
        if old is None or old.state in NOT_REPORTING or new.state in NOT_REPORTING:
            # restored after a restart/reload, not a command: compare once both sides settle
            self._check_start("restart")
            return
        if self.checking:
            self._check_cancel()  # normal operation resumed
        state = new.state
        if state == "triggered":
            self.hass.async_create_task(self._handle_trip(), "alarmo_panel_trip")
            return
        if state == "arming":
            self._alarmo_arming_since = time.monotonic()
            if not self.panel_leads or self._ours(state):
                return
            alarmo = self.mgr.alarmo_entity(self.key)
            target = getattr(alarmo, "arm_mode", None)
            if target in SERVICE_FOR and target != "disarmed":
                self._start(target, leading=True)
            return
        if state not in SERVICE_FOR:
            return
        if self._ours(state):
            return
        if state != "disarmed" and self._target == state and self._task and not self._task.done():
            return  # panel leads: the command for this arming is already running; it confirms
        cmd = self.cfg["commands"][state]
        panel_state = self.hass.states.get(self.panel)
        if panel_state is not None and panel_state.state in cmd["accept"]:
            self._log(
                "info", f"Alarmo {state}; physical panel already {panel_state.state}"
            )
            return
        self._start(state, leading=False)

    def _start(self, target: str, leading: bool) -> None:
        if self._task and not self._task.done():
            self._task.cancel()
        self._target = target
        self._task = self.hass.async_create_background_task(
            self._run(target, leading), "alarmo_panel_command"
        )

    def _alarmo_exit_time(self, target: str) -> int:
        alarmo = self.mgr.alarmo_entity(self.key)
        try:
            return int(alarmo._config["modes"][target]["exit_time"] or 0)
        except Exception:
            return 0

    def _confirm_deadline(self, target: str, cmd: dict) -> int:
        """Seconds (from sending) to wait for the panel to be armed when the panel leads."""
        accept = cmd["accept"]
        learned = max([self.cfg["learned_exit_delay"].get(a, 0) for a in accept] or [0])
        longest = max(cmd["timeout"], learned, self._alarmo_exit_time(target))
        return longest + self.cfg.get("confirm_margin", 10)

    async def _send(self, kind: str, target: str, keys: str = "") -> None:
        """Send a service call or keypresses. Raises on failure."""
        if kind == "service":
            await self.hass.services.async_call(
                "alarm_control_panel",
                SERVICE_FOR[target],
                {"entity_id": self.panel},
                blocking=True,
            )
            return
        if self.cfg["panel_type"] != "envisalink":
            raise ValueError("keypresses are only supported for Envisalink panels")
        await self.hass.services.async_call(
            "envisalink_new",
            "alarm_keypress",
            {"entity_id": self.panel, "keypress": keys},
            blocking=True,
        )

    async def _wait_for(self, accept: list[str], timeout: int) -> str | None:
        """Wait until the panel is in one of ``accept``. Returns that state or None."""
        st = self.hass.states.get(self.panel)
        if st is not None and st.state in accept:
            return st.state
        fut: asyncio.Future = self.hass.loop.create_future()

        @callback
        def _changed(event: Event) -> None:
            new = event.data.get("new_state")
            if new is not None and new.state in accept and not fut.done():
                fut.set_result(new.state)

        unsub = async_track_state_change_event(self.hass, [self.panel], _changed)
        try:
            return await asyncio.wait_for(fut, timeout)
        except TimeoutError:
            return None
        finally:
            unsub()

    def _bypass_zones(self, target: str) -> list[tuple[str, int]]:
        """Panel zones Alarmo bypassed for this arming: [(entity, zone number)]."""
        if target == "disarmed":
            return []
        alarmo = self.mgr.alarmo_entity(self.key)
        bypassed = list(getattr(alarmo, "bypassed_sensors", None) or [])
        zones = set(self.mgr.panel_zones(self.panel))
        out = []
        for eid in bypassed:
            st = self.hass.states.get(eid)
            num = zone_number(st.attributes) if st else None
            if eid in zones and num is not None:
                out.append((eid, num))
        return out

    async def _run(self, target: str, leading: bool = False) -> None:
        cmd = self.cfg["commands"][target]
        try:
            await self._run_inner(target, cmd, leading)
        finally:
            if self._target == target:
                self._target = None

    def _not_ready_text(self) -> str | None:
        """The panel keypad text when the panel is not ready to arm (Vista), else None."""
        kp = self.mgr.keypad_for_panel(self.panel)
        st = self.hass.states.get(kp) if kp else None
        if st is None or st.attributes.get("ready", True):
            return None
        return str(st.attributes.get("alpha") or st.state)

    async def _run_inner(self, target: str, cmd: dict, leading: bool) -> None:  # noqa: PLR0912, PLR0915
        if cmd["method"] == "none":
            self._log("info", f"Alarmo {target}; nothing configured to send")
            return
        code = self.mgr.panel_code(self.panel)
        try:
            keys = render_keys(cmd["keys"], code) if cmd["method"] == "keypress" else ""
            bypass = [
                (eid, render_keys(self.cfg["bypass_keys"], code, num))
                for eid, num in self._bypass_zones(target)
            ]
        except ValueError as err:
            self._log(
                "error",
                f"cannot send {target}: {err}. Set a default code on {self.panel}.",
            )
            await self._failed(target, str(err))
            return

        if leading and target != "disarmed":
            not_ready = self._not_ready_text()
            if not_ready and not bypass and "6#" not in (cmd["keys"] or ""):
                self._log("warning", f"physical panel is not ready to arm: {not_ready}")
        # panel leads: "arming" means the panel accepted; the final state must follow before the deadline
        accept_now = [*cmd["accept"], "arming"] if leading and target != "disarmed" else cmd["accept"]
        attempts = self.cfg["retries"] + 1 if self.live else 1
        sent_at = time.monotonic()
        for attempt in range(1, attempts + 1):
            what = (
                f"keys {mask_code(keys, code)}"
                if keys
                else f"service {SERVICE_FOR[target]}"
            )
            try:
                for eid, bkeys in bypass:
                    self._log("info", f"bypass {eid}: keys {mask_code(bkeys, code)}")
                    if self.live:
                        await self._send("keypress", target, bkeys)
                        self.mgr.bypassed.add(eid)
                        self.mgr._persist_bypassed()
                if bypass:
                    async_dispatcher_send(self.hass, SIGNAL_MIRRORS)
                self._log(
                    "info",
                    f"Alarmo {target} → physical panel: {what} "
                    f"(try {attempt}/{attempts})",
                )
                self.expect_panel = {
                    "accept": accept_now,
                    "deadline": time.monotonic() + self._confirm_deadline(target, cmd) + 5,
                }
                if self.live:
                    await self._send(cmd["method"], target, keys)
            except Exception as err:
                self._log("error", f"sending failed: {err}")
            started = time.monotonic()
            # shadow: the user's own automations may send later (after Alarmo's exit delay) — observe longer
            first_wait = cmd["timeout"] if self.live else self._confirm_deadline(target, cmd) + 30
            got = await self._wait_for(accept_now, first_wait)
            if got == "arming":
                self._log("info", f"physical panel started arming after {round(time.monotonic() - started)} s")
                remaining = self._confirm_deadline(target, cmd) - (time.monotonic() - sent_at)
                got = await self._wait_for(cmd["accept"], max(5, remaining) if self.live else remaining + 30)
                if not got:
                    self.expect_panel = None
                    if self.live:
                        secs = self._confirm_deadline(target, cmd)
                        await self._failed(target, f"physical panel did not finish arming within {secs} s")
                    else:
                        self._log("warning", "physical panel did not finish arming")
                    return
            if got:
                total = round(time.monotonic() - sent_at)
                note = ""
                if leading and target != "disarmed":
                    alarmo_exit = self._alarmo_exit_time(target)
                    if alarmo_exit + 2 < total:
                        note = f" — Alarmo's exit time is {alarmo_exit} s; set it to about {total + 3} s"
                self._log("info", f"physical panel is {got} after {total} s{note}", ok=True)
                self.expect_panel = None
                return
            if not self.live:
                self._log(
                    "warning",
                    f"physical panel did not reach {'/'.join(cmd['accept'])} "
                    f"within {cmd['timeout']} s",
                )
                return
            if attempt < attempts:
                await asyncio.sleep(self.cfg["retry_delay"])
        self.expect_panel = None
        await self._failed(
            target, f"physical panel did not reach {'/'.join(cmd['accept'])}"
        )

    async def _failed(self, target: str, reason: str) -> None:
        """All tries failed: notify and apply the failure policy."""
        self.hass.bus.async_fire(
            EVENT_PANEL,
            {
                "type": "command_failed",
                "link": self.key,
                "target": target,
                "reason": reason,
            },
        )
        if not self.live:
            return
        policy = self.cfg["failure_policy"]
        msg = f"The alarm panel did not follow Alarmo ({target}): {reason}."
        if target != "disarmed" and policy == "disarm":
            msg += " Alarmo was disarmed again."
            alarmo = self.mgr.alarmo_entity(self.key)
            if alarmo is not None:
                self.expect_alarmo = {
                    "target": "disarmed",
                    "deadline": time.monotonic() + EXPECT_SECONDS,
                }
                await alarmo.async_alarm_disarm(code=None, skip_code=True)
        self._log("error", msg)
        await self.mgr.async_notify("Alarm panel did not respond", msg)

    # ---------------------------------------------------------------- panel -> Alarmo

    @callback
    def _on_panel(self, event: Event) -> None:  # noqa: PLR0911, PLR0912
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or (old is not None and old.state == new.state):
            return
        if old is None or old.state in NOT_REPORTING or new.state in NOT_REPORTING:
            # the panel (re)connected: its state is a report, not a keypad action
            self._check_start("restart" if self.checking else "panel reconnect")
            return
        if self.checking:
            self._check_cancel()  # normal operation resumed
        state = new.state
        now = time.monotonic()
        if state == "arming":
            self._arming_since = now
            if not self._valid(self.expect_panel):
                self._follow_arming(now)
            return
        if state in ARMED and self._arming_since is not None:
            self.hass.async_create_task(
                self._learn(state, round(now - self._arming_since))
            )
        self._arming_since = None
        if state == "disarmed":
            self.mgr.clear_bypassed()
        if state == "triggered":
            self._log("warning", "physical panel is in ALARM")
            self.hass.bus.async_fire(
                EVENT_PANEL,
                {"type": "triggered", "link": self.key, "panel": self.panel},
            )
            return
        if self._valid(self.expect_panel) and state in self.expect_panel["accept"]:
            return  # our own command; the waiter handles it
        if not self.cfg["follow_panel"] or state not in SERVICE_FOR:
            return
        alarmo = self.mgr.alarmo_entity(self.key)
        if alarmo is None:
            return
        astate = self.hass.states.get(self.alarmo_entity_id)
        astate = astate.state if astate else None
        if state == "disarmed" and astate not in (None, "disarmed"):
            self._log("info", "physical panel disarmed at its keypad → disarm Alarmo")
            if self.live:
                self.expect_alarmo = {
                    "target": "disarmed",
                    "deadline": now + EXPECT_SECONDS,
                }
                self.hass.async_create_task(
                    alarmo.async_alarm_disarm(code=None, skip_code=True)
                )
        elif state in ARMED and astate == "disarmed":
            self._follow_arm(follow_mode(self.cfg, state), state, skip_delay=True)

    def _follow_arming(self, now: float) -> None:
        """The panel started arming by itself (keypad, app): Alarmo starts arming too, so both count down."""
        if not self.cfg["follow_panel"]:
            return
        astate = self.hass.states.get(self.alarmo_entity_id)
        if astate is None or astate.state != "disarmed":
            return
        kp = self.mgr.keypad_for_panel(self.panel)
        kst = self.hass.states.get(kp) if kp else None
        panel_mode = mode_from_keypad(str(kst.attributes.get("alpha") or kst.state) if kst else None)
        if panel_mode is None:
            self._log("info", "physical panel is arming at its keypad; Alarmo follows once the mode is known")
            return
        self._follow_arm(follow_mode(self.cfg, panel_mode), panel_mode, skip_delay=False)

    def _follow_arm(self, mode: str, panel_mode: str, skip_delay: bool, notify: bool = True) -> None:
        alarmo = self.mgr.alarmo_entity(self.key)
        if alarmo is None:
            return
        ha_open = self._open_ha_only(mode)
        extra = f" (Alarmo {mode})" if mode != panel_mode else ""
        how = "armed" if skip_delay else "arming"
        bypass_note = f"; open zones the panel does not watch will be bypassed: {', '.join(ha_open)}" if ha_open else ""
        self._log("info", f"physical panel {how} {panel_mode} at its keypad → arm Alarmo {mode}{extra}{bypass_note}")
        if not self.live:
            return
        self.expect_alarmo = {
            "target": mode,
            "also": ("arming",),
            "deadline": time.monotonic() + EXPECT_SECONDS,
        }
        self.hass.async_create_task(
            alarmo.async_handle_arm_request(mode, skip_code=True, bypass_open_sensors=True, skip_delay=skip_delay)
        )
        if ha_open and notify:
            self.hass.async_create_task(
                self.mgr.async_notify(
                    "Armed at the alarm panel",
                    f"Armed {panel_mode.replace('armed_', '')} at the keypad. "
                    f"Not protected (open, bypassed in Alarmo): {', '.join(ha_open)}",
                )
            )

    def _open_ha_only(self, mode: str) -> list[str]:
        """Names of open Alarmo zones for ``mode`` that the panel does not watch."""
        handler = (self.hass.data.get("alarmo") or {}).get("sensor_handler")
        area = self.key if self.key != MASTER_KEY else None
        if handler is None or area is None:
            return []
        try:
            blocking, _bypassed = handler.validate_arming_event(area, mode)
        except Exception:
            return []
        panel_zones = set(self.mgr.panel_zones(self.panel))
        mirrors = set(self.mgr.settings["mirrors"])
        out = []
        for eid in blocking:
            if eid in panel_zones or self._mirror_source(eid) in mirrors:
                continue
            st = self.hass.states.get(eid)
            out.append((st.attributes.get("friendly_name") if st else None) or eid)
        return sorted(out)

    async def _learn(self, state: str, seconds: int) -> None:
        """Remember how long the panel's exit delay took."""
        if not 0 < seconds <= 600:
            return
        raw = dict(self.mgr.ext.extras.data.get("panel") or {})
        links = dict(raw.get("links") or {})
        if self.key not in links:
            return
        link = dict(links[self.key])
        learned = dict(link.get("learned_exit_delay") or {})
        if learned.get(state) == seconds:
            return
        learned[state] = seconds
        link["learned_exit_delay"] = learned
        links[self.key] = link
        raw["links"] = links
        self.cfg["learned_exit_delay"] = learned
        await self.mgr.ext.extras.async_update(panel=raw)
        self._log("info", f"learned exit delay for {state}: {seconds} s")

    # ------------------------------------------------------------ HA-only zone trips

    async def _handle_trip(self) -> None:
        alarmo = self.mgr.alarmo_entity(self.key)
        open_sensors = dict(getattr(alarmo, "open_sensors", None) or {})
        if not open_sensors:
            return
        settings = self.mgr.settings
        panel_zones = set(self.mgr.panel_zones(self.panel))
        mirrors = set(settings["mirrors"])
        ha_only = [
            e
            for e in open_sensors
            if e not in panel_zones and self._mirror_source(e) not in mirrors
        ]
        if not ha_only:
            return  # the panel watches these zones itself
        policies = {e: trip_policy(e, settings) for e in ha_only}
        names = ", ".join(
            (
                self.hass.states.get(e).attributes.get("friendly_name")
                if self.hass.states.get(e)
                else None
            )
            or e
            for e in ha_only
        )
        if any(p == "panel" for p in policies.values()):
            await self._set_off_panel(settings["trip"], names)
        if any(p in ("panel", "notify") for p in policies.values()):
            self._log("warning", f"alarm by zone(s) the panel does not watch: {names}")
            if self.live:
                await self.mgr.async_notify(
                    "Alarm triggered", f"Alarmo alarm by: {names}"
                )
        self.hass.bus.async_fire(
            EVENT_PANEL,
            {
                "type": "ha_zone_trip",
                "link": self.key,
                "zones": ha_only,
                "policies": policies,
            },
        )

    def _mirror_source(self, entity_id: str) -> str:
        """Mirror entities point back at their panel zone."""
        st = self.hass.states.get(entity_id)
        return (st.attributes.get("source") if st else None) or ""

    async def _set_off_panel(self, trip: dict, names: str) -> None:
        method = trip["method"]
        self._log("warning", f"setting off the alarm ({method}) for: {names}")
        if not self.live or method == "none":
            return
        try:
            if method in ("siren", "relay"):
                if not trip.get("entity"):
                    raise ValueError(f"no {method} entity configured")
                domain = trip["entity"].split(".", 1)[0]
                await self.hass.services.async_call(
                    domain, "turn_on", {"entity_id": trip["entity"]}, blocking=True
                )
            elif method == "panic":
                if trip["panic_method"] == "keypress":
                    keys = render_keys(
                        trip["panic_keys"], self.mgr.panel_code(self.panel)
                    )
                    await self._send("keypress", "disarmed", keys)
                else:
                    await self.hass.services.async_call(
                        "alarm_control_panel",
                        "alarm_trigger",
                        {"entity_id": self.panel},
                        blocking=True,
                    )
        except Exception as err:
            self._log("error", f"could not set off the alarm: {err}")
            await self.mgr.async_notify("Alarm could not sound", f"{names}: {err}")
