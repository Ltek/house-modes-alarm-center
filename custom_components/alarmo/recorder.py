"""Activity recorder (ext.24): House Modes, Alarmo, the physical panel, locks and bypasses, grouped into sequences.

A sequence starts with a "starter" (House Mode helpers, a lock keypad use, an Alarmo or panel state change, the
BYPASS indicator, an alarm) and collects everything that follows until nothing happens for `window_s` seconds.
Closed sequences are written to /config/alarmo/activity/YYYY-MM-DD.jsonl (one JSON object per line) and kept for
`retention_days`. Codes are never recorded: keypresses are masked, lock events carry only the slot number.

Recording only observes; it never changes anything.
"""

from __future__ import annotations

import os
import re
import json
import time
import uuid
import logging
import datetime as dt
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util
from homeassistant.helpers.event import async_track_time_interval

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

ACTIVITY_SUBDIR = ("alarmo", "activity")
DEFAULT_WINDOW = 120
MAX_SEQUENCE = 3600  # a sequence never stays open longer than this
OPEN_STATES = ("arming", "pending")  # while an alarm entity is here, the sequence stays open
# only these keep a sequence open; the rest (keypad text scrolling, zones, notifications) is recorded but does not
# reset the quiet timer — a Vista scrolls its fault messages every few seconds
EXTENDING = ("house", "alarmo", "panel", "lock", "bypass", "helper", "link", "command")
MAX_ZONE_ENTRIES = 3  # per zone and sequence (motion zones change constantly)

SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("enabled", default=True): bool,
        vol.Optional("window_s", default=DEFAULT_WINDOW): vol.All(vol.Coerce(int), vol.Range(min=15, max=1800)),
        vol.Optional("retention_days", default=30): vol.All(vol.Coerce(int), vol.Range(min=1, max=365)),
        # extra entities to record (on top of the automatic ones)
        vol.Optional("entities", default=[]): [vol.Match(r"^[a-z_]+\.[a-z0-9_]+$")],
    }
)

KIND_LABELS = {
    "house": "House Mode",
    "alarmo": "Alarmo",
    "panel": "Physical panel",
    "keypad": "Panel keypad",
    "lock": "Lock",
    "bypass": "Bypass",
    "zone": "Zone",
    "helper": "Helper",
    "automation": "Automation",
    "command": "Command",
    "notify": "Notification",
    "link": "Panel link",
    "event": "Event",
}
WATCH_SERVICES = ("alarm_control_panel", "envisalink_new", "notify", "lock", "input_select", "alarmo")
CODE_KEYS = ("code", "usercode", "keypress", "keys")


def normalize(raw: dict | None) -> dict[str, Any]:
    """Validated recorder settings."""
    return SETTINGS_SCHEMA(dict(raw or {}))


def mask(value: Any, codes: list[str] | None = None) -> Any:
    """Hide a code. Keypresses keep their command keys: '1234' + '6#' -> '••••6#'.

    Known codes (the panel's default code) are replaced wherever they appear; otherwise the first 4 digits.
    """
    if not isinstance(value, str):
        return "•••"
    for code in sorted({c for c in codes or [] if c}, key=len, reverse=True):
        if code in value:
            return value.replace(code, "•" * len(code))
    return re.sub(r"^\d{4}", "••••", value) if re.match(r"^\d{5,}", value) else re.sub(r"\d", "•", value)


class ActivityRecorder:
    """Records sequences; never acts."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize."""
        self.hass = hass
        self.ext = ext
        self._unsubs: list = []
        self.current: dict | None = None
        self._last_event = 0.0
        self._ctx: dict[str, str] = {}  # context id -> automation name
        self._watch: dict[str, str] = {}  # entity -> kind
        self._zones: set[str] = set()
        self._users: dict[str, str] = {}
        self.last_write: float | None = None
        self.last_error: str | None = None

    # ------------------------------------------------------------ settings

    @property
    def settings(self) -> dict[str, Any]:
        """Validated settings."""
        return normalize(self.ext.extras.data.get("recorder"))

    async def async_save_settings(self, raw: dict) -> dict[str, Any]:
        """Store settings and restart."""
        clean = normalize(raw)
        await self.ext.extras.async_update(recorder=clean)
        self.async_restart()
        return clean

    @property
    def directory(self) -> str:
        """Where the daily files go."""
        return self.hass.config.path(*ACTIVITY_SUBDIR)

    # ------------------------------------------------------------ what to watch

    def watched(self) -> dict[str, str]:  # noqa: PLR0912
        """Entities to record and their kind (automatic + the user's extras)."""
        out: dict[str, str] = {}
        data = self.hass.data.get("alarmo") or {}
        for ent in [*(data.get("areas") or {}).values(), data.get("master")]:
            if ent is not None and getattr(ent, "entity_id", None):
                out[ent.entity_id] = "alarmo"
        panel = self.ext.panel.settings
        for link in (panel.get("links") or {}).values():
            out[link["panel_entity"]] = "panel"
        for kp in getattr(self.ext.panel, "_keypads", {}):
            out[kp] = "keypad"
        for st in self.hass.states.async_all("sensor"):
            if "armed_bypass" in st.attributes and "alpha" in st.attributes:
                out.setdefault(st.entity_id, "keypad")
        for st in self.hass.states.async_all(("input_select", "input_boolean")):
            eid = st.entity_id
            if "house_mode" in eid:
                out[eid] = "house"
            elif eid.startswith("input_boolean.bypass") or "alarmo_change" in eid:
                out[eid] = "helper"
        house = self.ext.house.settings
        if house.get("input_select"):
            out[house["input_select"]] = "house"
        out["select.alarmo_house_mode"] = "house"
        for lk in self.ext.locks.zwave_locks():
            out[lk["entity_id"]] = "lock"
        if panel.get("bypass_entity"):
            out[panel["bypass_entity"]] = "helper"
        for e in self.settings["entities"]:
            out.setdefault(e, "helper")
        return out

    def zones(self) -> set[str]:
        """Alarmo zones and mirrors: recorded only inside a sequence (they change too often otherwise)."""
        store = self.ext.coordinator.store
        zones = set(store.async_get_sensors())
        zones |= {f"binary_sensor.{z.split('.', 1)[1]}_mirror" for z in self.ext.panel.settings["mirrors"]}
        return zones

    # ------------------------------------------------------------ start / stop

    @callback
    def async_restart(self) -> None:
        """(Re)subscribe."""
        self.async_stop()
        if not self.settings["enabled"]:
            return
        try:
            self._watch = self.watched()
        except Exception as err:
            self.last_error = f"finding the entities to record failed: {err}"
            _LOGGER.exception("Activity recorder")
            self._watch = {}
        try:
            self._zones = self.zones()
        except Exception:
            self._zones = set()
        bus = self.hass.bus
        self._unsubs += [
            bus.async_listen("state_changed", self._on_state),
            bus.async_listen("automation_triggered", self._on_automation),
            bus.async_listen("call_service", self._on_service),
            bus.async_listen("zwave_js_notification", self._on_zwave),
            bus.async_listen("alarmo_keypad_used", self._on_named_event),
            bus.async_listen("alarmo_failed_to_arm", self._on_named_event),
            bus.async_listen("alarmo_command_success", self._on_named_event),
            bus.async_listen("alarmo_house_mode_changed", self._on_named_event),
            bus.async_listen("alarmo_house_mode_blocked", self._on_named_event),
            bus.async_listen("alarmo_house_mode_failed", self._on_named_event),
            bus.async_listen("alarmo_ext_panel", self._on_named_event),
            async_track_time_interval(self.hass, self._tick, dt.timedelta(seconds=5)),
        ]
        self.hass.async_create_task(self._load_users(), "alarmo_recorder_users")

    @callback
    def async_stop(self) -> None:
        """Unsubscribe and close the open sequence."""
        while self._unsubs:
            self._unsubs.pop()()
        if self.current:
            self._close()

    async def _load_users(self) -> None:
        try:
            for u in await self.hass.auth.async_get_users():
                self._users[u.id] = u.name or u.id
        except Exception:
            pass

    # ------------------------------------------------------------ sequences

    def _cause(self, context) -> str | None:
        if context is None:
            return None
        for cid in (context.id, context.parent_id):
            if cid and cid in self._ctx:
                return f"automation: {self._ctx[cid]}"
        if context.user_id:
            return f"user: {self._users.get(context.user_id, context.user_id)}"
        return None

    def _name(self, entity_id: str) -> str:
        st = self.hass.states.get(entity_id)
        return (st.attributes.get("friendly_name") if st else None) or entity_id

    def add(self, kind: str, text: str, *, starter: bool = False, entity: str | None = None, **data: Any) -> None:
        """One entry. Starters open a sequence; other entries only join an open one (or open one if `starter`)."""
        if not self.settings["enabled"]:
            return
        now = time.time()
        if self.current is None:
            if not starter:
                return
            self.current = {
                "id": uuid.uuid4().hex[:10],
                "start": now,
                "title": text,
                "kinds": [],
                "entries": [],
            }
        seq = self.current
        cause = data.get("cause")
        if cause and cause.startswith("automation: "):
            # the automation that caused this is listed once, right before its first effect
            ran = f"ran: {cause[len('automation: '):]}"
            if not any(e["kind"] == "automation" and e["text"] == ran for e in seq["entries"]):
                seq["entries"].append(
                    {"t": round(now, 3), "dt": round(now - seq["start"], 1), "kind": "automation", "text": ran}
                )
                if "automation" not in seq["kinds"]:
                    seq["kinds"].append("automation")
        if kind == "keypad" and any(e["kind"] == "keypad" and e["text"] == text for e in seq["entries"]):
            return  # the keypad scrolls the same messages over and over
        same_zone = sum(1 for e in seq["entries"] if entity and e.get("entity") == entity)
        if kind == "zone" and same_zone >= MAX_ZONE_ENTRIES:
            return
        entry = {"t": round(now, 3), "dt": round(now - seq["start"], 1), "kind": kind, "text": text}
        if entity:
            entry["entity"] = entity
        entry.update({k: v for k, v in data.items() if v is not None})
        seq["entries"].append(entry)
        if kind not in seq["kinds"]:
            seq["kinds"].append(kind)
        if starter or kind in EXTENDING:
            self._last_event = time.monotonic()

    def _alarm_busy(self) -> bool:
        for eid, kind in self._watch.items():
            if kind in ("alarmo", "panel"):
                st = self.hass.states.get(eid)
                if st is not None and st.state in OPEN_STATES:
                    return True
        return False

    @callback
    def _tick(self, _now=None) -> None:
        if self.current is None:
            return
        try:
            idle = time.monotonic() - self._last_event
            age = time.time() - self.current["start"]
            if age > MAX_SEQUENCE or (idle >= self.settings["window_s"] and not self._alarm_busy()):
                self._close()
        except Exception as err:
            self.last_error = f"closing a sequence failed: {err}"
            _LOGGER.exception("Activity recorder")
            self.current = None

    def _close(self) -> None:
        seq, self.current = self.current, None
        if not seq:
            return
        seq["end"] = seq["entries"][-1]["t"] if seq["entries"] else seq["start"]
        seq["duration"] = round(seq["end"] - seq["start"], 1)
        self.hass.async_create_task(self._write(seq), "alarmo_recorder_write")

    async def _write(self, seq: dict) -> None:
        day = dt_util.as_local(dt_util.utc_from_timestamp(seq["start"])).strftime("%Y-%m-%d")
        path = os.path.join(self.directory, f"{day}.jsonl")
        line = json.dumps(seq, default=str)
        keep = self.settings["retention_days"]

        def _do() -> None:
            os.makedirs(self.directory, exist_ok=True)
            with open(path, "a", encoding="utf-8") as fh:
                fh.write(line + "\n")
            cutoff = (dt.date.today() - dt.timedelta(days=keep)).isoformat()
            for name in os.listdir(self.directory):
                if name.endswith(".jsonl") and name[:10] < cutoff:
                    os.remove(os.path.join(self.directory, name))

        try:
            await self.hass.async_add_executor_job(_do)
            self.last_write = time.time()
            self.last_error = None
        except OSError as err:
            self.last_error = str(err)
            _LOGGER.warning("Activity log write failed: %s", err)

    # ------------------------------------------------------------ listeners

    @callback
    def _on_state(self, event: Event) -> None:
        eid = event.data.get("entity_id")
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or old is None:
            return
        kind = self._watch.get(eid)
        if kind is None:
            if eid in self._zones and self.current is not None and old.state != new.state:
                self.add("zone", f"{self._name(eid)}: {old.state} → {new.state}", entity=eid)
            return
        cause = self._cause(new.context)
        if kind == "keypad":
            was_b, now_b = bool(old.attributes.get("armed_bypass")), bool(new.attributes.get("armed_bypass"))
            if was_b != now_b:
                self.add("bypass", f"Panel BYPASS indicator {'on' if now_b else 'off'}", starter=True, entity=eid)
            if new.state != old.state:
                self.add("keypad", f"Keypad: {new.state}", starter=False, entity=eid)
            return
        if old.state == new.state:
            return
        starter = kind in ("house", "alarmo", "panel", "lock") or (kind == "helper" and "bypass" in eid)
        if kind in ("alarmo", "panel") and new.state == "triggered":
            starter = True
        self.add(kind, f"{self._name(eid)}: {old.state} → {new.state}", starter=starter, entity=eid, cause=cause)

    @callback
    def _on_automation(self, event: Event) -> None:
        name = event.data.get("name") or event.data.get("entity_id")
        self._ctx[event.context.id] = name
        if len(self._ctx) > 500:
            for k in list(self._ctx)[:250]:
                self._ctx.pop(k, None)
        # listed in a sequence only when it changed something recorded (see add: cause)

    @callback
    def _on_service(self, event: Event) -> None:
        domain = event.data.get("domain")
        if domain not in WATCH_SERVICES or (self.current is None and domain == "notify"):
            return
        service = event.data.get("service")
        data = dict(event.data.get("service_data") or {})
        target = data.pop("entity_id", None)
        targets = [target] if isinstance(target, str) else list(target or [])
        codes = [self.ext.panel.panel_code(t) for t in targets if str(t).startswith("alarm_control_panel.")]
        for k in CODE_KEYS:
            if k in data:
                data[k] = mask(data[k], [c for c in codes if c])
        if domain == "input_select" and not any(str(t) in self._watch for t in targets):
            return
        if domain == "notify":
            title, message = str(data.get("title") or "")[:60], str(data.get("message") or "")[:80]
            text = f"notify.{service}: {title} {message}".strip()
            self.add("notify", text, cause=self._cause(event.context))
            return
        brief = {k: v for k, v in data.items() if k not in ("data",)}
        text = f"{domain}.{service} {target or ''} {json.dumps(brief, default=str) if brief else ''}".strip()
        self.add("command", text, cause=self._cause(event.context))

    @callback
    def _on_zwave(self, event: Event) -> None:
        d = event.data
        label = d.get("event_label")
        if not label or "operation" not in str(label).lower():
            return
        node = d.get("node_id")
        lock = next((lk for lk in self.ext.locks.zwave_locks() if lk["node_id"] == node), None)
        slot = (d.get("parameters") or {}).get("userId")
        who = ""
        if lock and slot is not None:
            from .lock_codes import link_for_slot  # noqa: PLC0415

            link = link_for_slot(self.ext.locks.settings, lock["entity_id"], slot)
            user = self.ext.locks.users().get(link["user_id"]) if link else None
            who = f" · slot {slot}" + (f" ({user['name']})" if user else "")
        name = lock["name"] if lock else f"node {node}"
        self.add("lock", f"{label} · {name}{who}", starter=True, entity=lock["entity_id"] if lock else None)

    @callback
    def _on_named_event(self, event: Event) -> None:
        d = {k: v for k, v in event.data.items() if k not in CODE_KEYS}
        et = event.event_type
        if et == "alarmo_keypad_used":
            if d.get("denied"):
                self.add("lock", f"keypad action for {d.get('user_name') or 'unknown'}: not allowed {d['denied']}")
            elif d.get("house_mode") or d.get("targets"):
                what = f"House Mode {d.get('house_mode')} {d.get('targets') or ''}".strip()
                self.add("lock", f"keypad action for {d.get('user_name')}: {what}")
            return
        if et == "alarmo_failed_to_arm":
            if d.get("reason") == "not_allowed":
                # e.g. a second disarm while already disarmed: Alarmo ignores it
                self.add("alarmo", "Alarmo ignored a command (not allowed in its current state)")
            else:
                why = f"{d.get('reason')} {list(d.get('sensors') or [])}"
                self.add("alarmo", f"Alarmo failed to arm: {why}", starter=True)
            return
        if et == "alarmo_ext_panel":
            self.add("link", f"panel link: {d.get('type')} {d.get('zones') or ''}".strip())
            return
        self.add("event", f"{et.replace('alarmo_', '')}: {json.dumps(d, default=str)[:160]}")

    # ------------------------------------------------------------ hooks for ext modules

    def link_log(self, level: str, msg: str) -> None:
        """Panel link activity (shadow predictions, timings) joins the open sequence."""
        self.add("link", msg, level=level)

    # ------------------------------------------------------------ reading

    def days(self) -> list[str]:
        """Days with a log file, newest first."""
        try:
            names = os.listdir(self.directory)
        except OSError:
            return []
        return sorted((n[:10] for n in names if n.endswith(".jsonl")), reverse=True)

    def read_day(self, day: str) -> list[dict]:
        """Closed sequences of one day (blocking: run in the executor)."""
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", day):
            return []
        path = os.path.join(self.directory, f"{day}.jsonl")
        out = []
        try:
            with open(path, encoding="utf-8") as fh:
                for line in fh:
                    try:
                        out.append(json.loads(line))
                    except ValueError:
                        continue
        except OSError:
            return []
        return out


def summarize(seqs: list[dict]) -> dict[str, Any]:
    """Counts per starter kind, failures, and panel latency per target state (from 'Physical panel' entries)."""
    starters: dict[str, int] = {}
    failures = 0
    lat: dict[str, list[float]] = {}
    for s in seqs:
        first = s["entries"][0]["kind"] if s.get("entries") else "?"
        starters[first] = starters.get(first, 0) + 1
        alarmo_t: dict[str, float] = {}
        for e in s.get("entries", []):
            text = e.get("text", "")
            if "failed" in text.lower() or e.get("level") == "error":
                failures += 1
            m = re.search(r"→ (\w+)$", text)
            if m and e["kind"] == "alarmo":
                alarmo_t[m.group(1)] = e["dt"]
            elif m and e["kind"] == "panel" and m.group(1) in alarmo_t:
                lat.setdefault(m.group(1), []).append(round(e["dt"] - alarmo_t[m.group(1)], 1))
    return {
        "sequences": len(seqs),
        "starters": starters,
        "failures": failures,
        "panel_latency": {k: {"n": len(v), "avg": round(sum(v) / len(v), 1), "max": max(v)} for k, v in lat.items()},
    }


# ------------------------------------------------------------------ websockets

from homeassistant.components import websocket_api  # noqa: E402


def _rec(hass) -> ActivityRecorder:
    from .ext_websockets import DATA_EXT  # noqa: PLC0415

    return hass.data[DATA_EXT].recorder


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/activity/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_activity_get(hass, connection, msg):
    """Settings, available days, the open sequence."""
    rec = _rec(hass)
    days = await hass.async_add_executor_job(rec.days)
    connection.send_result(
        msg["id"],
        {
            "settings": rec.settings,
            "days": days,
            "open": rec.current,
            "kinds": KIND_LABELS,
            "watched": rec._watch,
            "directory": rec.directory,
            "running": bool(rec._unsubs),
            "last_write": rec.last_write,
            "last_error": rec.last_error,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/activity/day", vol.Required("day"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_activity_day(hass, connection, msg):
    """Sequences of one day (newest first) and a summary."""
    rec = _rec(hass)
    seqs = await hass.async_add_executor_job(rec.read_day, msg["day"])
    seqs.reverse()
    connection.send_result(msg["id"], {"sequences": seqs, "summary": summarize(seqs)})


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/activity/settings", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_activity_settings(hass, connection, msg):
    """Save recorder settings."""
    try:
        res = await _rec(hass).async_save_settings(msg["settings"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], {"settings": res})


ACTIVITY_COMMANDS = (ws_activity_get, ws_activity_day, ws_activity_settings)
