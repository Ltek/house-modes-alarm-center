"""Alarmo Users <-> Z-Wave lock code slots, and per-User keypad actions."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.components import websocket_api
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import lock_codes as lc

if TYPE_CHECKING:
    from .ext_websockets import ExtManager

_LOGGER = logging.getLogger(__name__)

EVENT_KEYPAD = "alarmo_keypad_used"
ZWAVE = "zwave_js"


class LockCodeError(Exception):
    """User-facing error."""


class LockManager:
    """Links, keypad actions, reading/writing lock code slots."""

    def __init__(self, hass: HomeAssistant, ext: ExtManager) -> None:
        """Initialize."""
        self.hass = hass
        self.ext = ext
        self._unsub = None
        # (entity_id) -> (list of slots | None, api); replaceable in tests
        self.reader = self._read_zwave
        self.writer = self._write_zwave
        # (entity_id, slot) -> stand-in code for unreadable slots during the legacy migration
        self._fake: dict[tuple[str, int], str] = {}

    # ------------------------------------------------------------ settings

    @property
    def settings(self) -> dict[str, Any]:
        """Validated lock settings."""
        return lc.normalize(self.ext.extras.data.get("locks"))

    async def async_save(self, settings: dict) -> dict[str, Any]:
        """Validate and store; restart the listener."""
        clean = lc.normalize(settings)
        await self.ext.extras.async_update(locks=clean)
        self.async_restart()
        return clean

    def users(self) -> dict[str, dict]:
        """Alarmo Users (with code hashes) by user_id."""
        store = self.ext.coordinator.store
        return {uid: dict(u) for uid, u in store.async_get_users().items()}

    # ------------------------------------------------------------ locks

    def _node_id(self, entity_id: str) -> int | None:
        from .ext_house_ws import _zwave_node_id  # noqa: PLC0415

        entry = er.async_get(self.hass).async_get(entity_id)
        return _zwave_node_id(self.hass, entry) if entry else None

    def zwave_locks(self) -> list[dict]:
        """Z-Wave JS lock entities."""
        out = []
        for entry in er.async_get(self.hass).entities.values():
            if entry.domain != "lock" or entry.platform != ZWAVE:
                continue
            st = self.hass.states.get(entry.entity_id)
            out.append(
                {
                    "entity_id": entry.entity_id,
                    "name": (st.attributes.get("friendly_name") if st else None) or entry.entity_id,
                    "node_id": self._node_id(entry.entity_id),
                }
            )
        return sorted(out, key=lambda x: x["name"])

    async def _read_zwave(self, entity_id: str) -> tuple[list[dict] | None, str]:
        """Slots with PINs from Z-Wave JS. PINs stay in the backend."""
        try:
            from zwave_js_server.util.lock import get_usercodes  # noqa: PLC0415
            from homeassistant.components.zwave_js.helpers import (  # noqa: PLC0415
                async_get_node_from_entity_id,
            )

            node = async_get_node_from_entity_id(self.hass, entity_id)
            slots = lc.parse_usercodes(get_usercodes(node))
            if slots:
                return slots, "code_slots"
        except Exception as err:  # library missing, not a code-slot lock, ...
            _LOGGER.debug("get_usercodes(%s): %s", entity_id, err)
        for service, parser, api in (
            ("get_users", lc.parse_users, "user_credential"),
            ("get_lock_usercode", lc.parse_usercodes, "code_slots"),
        ):
            if not self.hass.services.has_service(ZWAVE, service):
                continue
            try:
                resp = await self.hass.services.async_call(
                    ZWAVE, service, {"entity_id": entity_id}, blocking=True, return_response=True
                )
            except Exception as err:
                _LOGGER.debug("zwave_js.%s(%s): %s", service, entity_id, err)
                continue
            slots = parser(resp)
            if slots:
                return slots, api
        return None, "unknown"

    async def _write_zwave(self, entity_id: str, slot: int, code: str | None) -> None:
        if code is None:
            await self.hass.services.async_call(
                ZWAVE, "clear_lock_usercode", {"entity_id": entity_id, "code_slot": slot}, blocking=True
            )
        else:
            await self.hass.services.async_call(
                ZWAVE,
                "set_lock_usercode",
                {"entity_id": entity_id, "code_slot": slot, "usercode": code},
                blocking=True,
            )

    async def async_read(self, entity_id: str) -> dict[str, Any]:
        """Slots of a lock with link, matching User and sync status. No PINs returned."""
        slots, api = await self.reader(entity_id)
        settings = self.settings
        users = self.users()

        def _work() -> list[dict]:
            out = []
            for s in slots or []:
                link = lc.link_for_slot(settings, entity_id, s["slot"])
                code = lc.usable_code(s.get("code"))
                match = lc.find_user_by_code(users, code) if (code and s["in_use"]) else None
                status = lc.sync_status(users.get(link["user_id"]), s) if link else None
                out.append(
                    {
                        "slot": s["slot"],
                        "in_use": s["in_use"],
                        "readable": code is not None,
                        "lock_name": s.get("name") or "",
                        "user_id": link["user_id"] if link else None,
                        "match_user_id": match,
                        "status": status,
                    }
                )
            # linked slots the lock did not report
            known = {s["slot"] for s in slots or []}
            for link in settings["links"]:
                if link["entity_id"] == entity_id and link["slot"] not in known:
                    out.append(
                        {
                            "slot": link["slot"],
                            "in_use": False,
                            "readable": False,
                            "lock_name": "",
                            "user_id": link["user_id"],
                            "match_user_id": None,
                            "status": "no_user" if link["user_id"] not in users else "unknown",
                        }
                    )
            return sorted(out, key=lambda x: x["slot"])

        rows = await self.hass.async_add_executor_job(_work)
        return {"entity_id": entity_id, "api": api, "readable": slots is not None, "slots": rows}

    # ------------------------------------------------------------ link / import

    async def async_link(self, entity_id: str, slot: int, user_id: str | None) -> dict:
        """Link (or unlink with user_id None) a slot."""
        s = self.settings
        if user_id is None:
            return await self.async_save(lc.remove_link(s, entity_id, slot))
        if user_id not in self.users():
            raise LockCodeError("Unknown Alarmo User")
        return await self.async_save(lc.set_link(s, user_id, entity_id, slot))

    async def async_import(self, entity_id: str, wanted: list[dict]) -> list[dict]:
        """One Alarmo User per slot; existing User with the same PIN is linked instead."""
        slots, _api = await self.reader(entity_id)
        by_slot = {s["slot"]: s for s in slots or []}
        store = self.ext.coordinator.store
        results = []
        settings = self.settings
        for item in wanted:
            slot = int(item["slot"])
            s = by_slot.get(slot) or {"slot": slot, "in_use": False, "code": None}
            code = lc.usable_code(s.get("code")) if s["in_use"] else None
            if code is None and (entity_id, slot) in self._fake:
                code = self._fake[(entity_id, slot)]
            if code is None:
                results.append({"slot": slot, "result": "error", "error": "code not readable or slot empty"})
                continue
            users = self.users()
            match = await self.hass.async_add_executor_job(lc.find_user_by_code, users, code)
            if match:
                settings = lc.set_link(settings, match, entity_id, slot)
                results.append({"slot": slot, "result": "linked", "user_id": match})
                continue
            taken = {u["name"] for u in users.values()}
            name = lc.unique_name(item.get("name") or s.get("name") or f"Slot {slot}", taken)
            hashed = await self.hass.async_add_executor_job(lc.hash_code, code, 10)
            fake = (entity_id, slot) in self._fake
            user = store.async_create_user(
                {
                    "name": name,
                    "code": hashed,
                    "code_format": "text" if fake else "number",
                    "code_length": 0 if fake else len(code),
                    "enabled": True,
                    # lock-only: the code works at the lock (and its keypad actions), not for Alarmo arming
                    "can_arm": False,
                    "can_disarm": False,
                    "area_limit": [],
                }
            )
            settings = lc.set_link(settings, user.user_id, entity_id, slot)
            results.append({"slot": slot, "result": "created", "user_id": user.user_id, "name": name})
        await self.async_save(settings)
        async_dispatcher_send(self.hass, "alarmo_update_frontend")
        return results

    # ------------------------------------------------------------ old slot -> House Mode table

    def legacy_slots(self) -> list[dict]:
        """Old keypad settings (slot -> House Mode) not moved to Users yet."""
        out = []
        locks = {lk["node_id"]: lk for lk in self.zwave_locks() if lk["node_id"] is not None}
        for kp in self.ext.house.settings["lock_keypads"]:
            lock = locks.get(kp["node_id"])
            for slot, mode in kp["slots"].items():
                out.append(
                    {
                        "node_id": kp["node_id"],
                        "entity_id": lock["entity_id"] if lock else kp.get("entity_id"),
                        "lock_name": lock["name"] if lock else (kp.get("name") or f"node {kp['node_id']}"),
                        "slot": int(slot),
                        "house_mode": mode,
                        "enabled": kp["enabled"],
                    }
                )
        return out

    async def async_migrate_legacy(self) -> list[dict]:
        """Move every old slot -> House Mode entry to an Alarmo User with that unlock action.

        The slot's code links to an existing User with the same PIN, or becomes a new lock-only User. A slot
        whose code cannot be read gets a lock-only User with a random code (it never works in Alarmo); its
        code check then shows "different" until the real code is set from the user editor.
        """
        import secrets  # noqa: PLC0415

        results = []
        legacy = [x for x in self.legacy_slots() if x["entity_id"]]
        for entity_id in sorted({x["entity_id"] for x in legacy}):
            items = [x for x in legacy if x["entity_id"] == entity_id]
            slots, _api = await self.reader(entity_id)
            by_slot = {s["slot"]: s for s in slots or []}
            for x in items:
                s = self.settings
                link = lc.link_for_slot(s, entity_id, x["slot"])
                if link is None:
                    code = by_slot.get(x["slot"], {}).get("code")
                    if lc.usable_code(code) is None:
                        self._fake[(entity_id, x["slot"])] = secrets.token_hex(16)
                    wanted = [{"slot": x["slot"], "name": f"{x['lock_name']} slot {x['slot']}"}]
                    res = (await self.async_import(entity_id, wanted))[0]
                    self._fake.pop((entity_id, x["slot"]), None)
                    if res["result"] == "error":
                        results.append({**x, "result": "error", "error": res.get("error")})
                        continue
                    user_id = res["user_id"]
                else:
                    user_id = link["user_id"]
                s = self.settings
                acts = s["actions"].get(user_id) or {}
                if lc.empty_action(acts.get("unlock")):
                    acts["unlock"] = {"house_mode": x["house_mode"], "targets": {}}
                    s["actions"][user_id] = acts
                    await self.async_save(s)
                results.append({**x, "result": "moved", "user_id": user_id})
        # drop the moved entries from the old table
        house = self.ext.house.settings
        moved = {(r["node_id"], r["slot"]) for r in results if r["result"] == "moved"}
        for kp in house["lock_keypads"]:
            kp["slots"] = {k: v for k, v in kp["slots"].items() if (kp["node_id"], int(k)) not in moved}
        house["lock_keypads"] = [kp for kp in house["lock_keypads"] if kp["slots"]]
        await self.ext.house.async_save_settings(house)
        return results

    # ------------------------------------------------------------ codes on locks

    async def async_push_code(self, user_id: str, code: str) -> list[dict]:
        """Write a User's (verified) code to all linked slots."""
        if not await self.ext.coordinator.async_authenticate_user(code, user_id):
            raise LockCodeError("The code does not match this user")
        return await self._write_all(user_id, code)

    async def async_clear(self, user_id: str, unlink: bool = False) -> list[dict]:
        """Clear the linked slots of a User on the locks."""
        results = await self._write_all(user_id, None)
        if unlink:
            s = self.settings
            s["links"] = [lk for lk in s["links"] if lk["user_id"] != user_id]
            s["actions"].pop(user_id, None)
            await self.async_save(s)
        return results

    async def user_code_from_locks(self, user_id: str) -> str | None:
        """The User's plain code, read from a linked slot that holds it (bcrypt-checked). None if no slot does."""
        users = self.users()
        user = users.get(user_id)
        if not user:
            return None
        for entity_id in sorted({lk["entity_id"] for lk in lc.links_for_user(self.settings, user_id)}):
            slots, _api = await self.reader(entity_id)
            for lk in lc.links_for_user(self.settings, user_id):
                if lk["entity_id"] != entity_id:
                    continue
                s = next((x for x in slots or [] if x["slot"] == lk["slot"]), None)
                code = lc.usable_code(s.get("code")) if s and s["in_use"] else None
                if code and await self.hass.async_add_executor_job(lc.check_code, code, user.get("code")):
                    return code
        return None

    async def async_sync_user(self, user_id: str, code: str | None = None) -> dict[str, Any]:
        """Write the User's code to every linked slot that does not hold it yet.

        The code comes from `code` (checked against the User) or from a linked slot that already holds it.
        """
        if code is not None:
            if not await self.ext.coordinator.async_authenticate_user(code, user_id):
                raise LockCodeError("The code does not match this user")
        else:
            code = await self.user_code_from_locks(user_id)
            if code is None:
                return {"results": [], "needs_code": True}
        users = self.users()
        out = []
        for entity_id in sorted({lk["entity_id"] for lk in lc.links_for_user(self.settings, user_id)}):
            slots, _api = await self.reader(entity_id)
            for lk in lc.links_for_user(self.settings, user_id):
                if lk["entity_id"] != entity_id:
                    continue
                s = next((x for x in slots or [] if x["slot"] == lk["slot"]), None)
                status = await self.hass.async_add_executor_job(lc.sync_status, users.get(user_id), s)
                if status == "in_sync":
                    out.append({**lk, "result": "already"})
                    continue
                try:
                    await self.writer(entity_id, lk["slot"], code)
                    out.append({**lk, "result": "ok"})
                except Exception as err:
                    out.append({**lk, "result": "error", "error": str(err)})
        return {"results": out, "needs_code": False}

    async def _write_all(self, user_id: str, code: str | None) -> list[dict]:
        out = []
        for link in lc.links_for_user(self.settings, user_id):
            try:
                await self.writer(link["entity_id"], link["slot"], code)
                out.append({**link, "result": "ok"})
            except Exception as err:
                out.append({**link, "result": "error", "error": str(err)})
        return out

    # ------------------------------------------------------------ keypad events

    @callback
    def async_restart(self) -> None:
        """(Re)subscribe when something needs keypad events."""
        self.async_stop()
        s = self.settings
        if s["links"] or s["lock_actions"]:
            self._unsub = self.hass.bus.async_listen("zwave_js_notification", self._on_event)

    @callback
    def async_stop(self) -> None:
        """Unsubscribe."""
        if self._unsub:
            self._unsub()
            self._unsub = None

    def handles(self, node_id: int | None, slot: int | None) -> bool:
        """True when a keypad code is handled here (the House Mode slot table is skipped)."""
        if slot is None:
            return False
        s = self.settings
        for link in s["links"]:
            if link["slot"] != int(slot) or self._node_id(link["entity_id"]) != node_id:
                continue
            user = self.users().get(link["user_id"])
            acts = s["actions"].get(link["user_id"]) or {}
            return user is None or not user.get("enabled", True) or not lc.empty_action(acts.get("unlock"))
        return False

    @callback
    def _on_event(self, event: Event) -> None:
        data = event.data
        op = lc.EVENT_LABELS.get(data.get("event_label"))
        if op is None:
            return
        slot = (data.get("parameters") or {}).get("userId")
        node_id = data.get("node_id")
        s = self.settings
        entities = {lk["entity_id"] for lk in s["links"]} | set(s["lock_actions"])
        entity_id = next((e for e in entities if self._node_id(e) == node_id), None)
        if entity_id is None:
            return
        self.hass.async_create_task(self.async_keypad(entity_id, op, slot), "alarmo_keypad")

    def _plan(self, user: dict | None, link: dict | None, action: dict) -> dict[str, Any]:
        if user is not None:
            return lc.plan(user, action)
        if link:  # linked to a removed User
            return {"house_mode": None, "targets": {}, "denied": {"user": "user no longer exists"}}
        # keypad lock without a code: nobody to check
        return {"house_mode": action.get("house_mode"), "targets": dict(action.get("targets") or {}), "denied": {}}

    async def async_keypad(self, entity_id: str, op: str, slot: int | None) -> dict[str, Any]:
        """Run the keypad action for a lock event."""
        s = self.settings
        user = None
        link = lc.link_for_slot(s, entity_id, slot) if slot is not None else None
        if link:
            user = self.users().get(link["user_id"])
            action = (s["actions"].get(link["user_id"]) or {}).get(op)
        elif op == "lock":
            action = s["lock_actions"].get(entity_id)
        else:
            return {"result": "ignored"}
        if lc.empty_action(action):
            return {"result": "ignored"}
        house = self.ext.house
        p = self._plan(user, link, action)
        result: dict[str, Any] = {"result": "done", **p}
        if p["house_mode"]:
            if not house.settings["enabled"]:
                p["denied"]["house_mode"] = "House Modes are off"
            else:
                try:
                    res = await house.async_set_mode(p["house_mode"], "lock")
                    result["house_result"] = res.get("result")
                except Exception as err:
                    result["house_result"] = f"error: {err}"
        if p["targets"]:
            result["failed"] = await house.async_apply_overrides(p["targets"])
        if p["denied"]:
            who = user["name"] if user else "unknown user"
            await house._notify(
                "Keypad action not allowed",
                f"{who} at {entity_id}: " + "; ".join(f"{k}: {v}" for k, v in p["denied"].items()),
            )
        self.hass.bus.async_fire(
            EVENT_KEYPAD,
            {
                "entity_id": entity_id,
                "operation": op,
                "slot": slot,
                "user_id": user["user_id"] if user else None,
                "user_name": user["name"] if user else None,
                "house_mode": p["house_mode"],
                "targets": p["targets"],
                "denied": p["denied"],
            },
        )
        return result


# ------------------------------------------------------------------ websockets


def _mgr(hass) -> LockManager:
    from .ext_websockets import DATA_EXT  # noqa: PLC0415

    return hass.data[DATA_EXT].locks


def _public_users(mgr: LockManager) -> list[dict]:
    keys = ("user_id", "name", "enabled", "can_arm", "can_disarm", "area_limit")
    return sorted(({k: u.get(k) for k in keys} for u in mgr.users().values()), key=lambda u: (u["name"] or "").lower())


def _guard(fn):
    async def wrapper(hass, connection, msg):
        try:
            await fn(hass, connection, msg)
        except (LockCodeError, vol.Invalid) as err:
            connection.send_error(msg["id"], "invalid", str(err))

    wrapper.__name__ = fn.__name__
    return wrapper


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/locks/get"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_locks_get(hass, connection, msg):
    """Lock settings, Z-Wave locks and Users (no codes)."""
    mgr = _mgr(hass)
    connection.send_result(
        msg["id"],
        {"settings": mgr.settings, "locks": mgr.zwave_locks(), "users": _public_users(mgr), "sync_labels": lc.SYNC},
    )


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/locks/read", vol.Required("entity_id"): str})
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_read(hass, connection, msg):
    """Slots of one lock with sync status."""
    connection.send_result(msg["id"], await _mgr(hass).async_read(msg["entity_id"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/link",
        vol.Required("entity_id"): str,
        vol.Required("slot"): vol.Coerce(int),
        vol.Optional("user_id"): vol.Any(None, str),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_link(hass, connection, msg):
    """Link / unlink a slot."""
    s = await _mgr(hass).async_link(msg["entity_id"], msg["slot"], msg.get("user_id"))
    connection.send_result(msg["id"], {"settings": s})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/import",
        vol.Required("entity_id"): str,
        vol.Required("slots"): [{vol.Required("slot"): vol.Coerce(int), vol.Optional("name"): str}],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_import(hass, connection, msg):
    """Import slots as Users."""
    res = await _mgr(hass).async_import(msg["entity_id"], msg["slots"])
    connection.send_result(msg["id"], {"results": res})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/actions",
        vol.Optional("user_id"): str,
        vol.Optional("entity_id"): str,
        vol.Optional("unlock"): vol.Any(None, dict),
        vol.Optional("lock"): vol.Any(None, dict),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_actions(hass, connection, msg):
    """Keypad actions of a User (unlock / lock) or of a lock (keypad lock without a code)."""
    mgr = _mgr(hass)
    s = mgr.settings
    if msg.get("user_id"):
        if msg["user_id"] not in mgr.users():
            raise LockCodeError("Unknown Alarmo User")
        acts = {
            op: lc.ACTION_SCHEMA(msg[op])
            for op in lc.OPERATIONS
            if msg.get(op) is not None and not lc.empty_action(msg[op])
        }
        if acts:
            s["actions"][msg["user_id"]] = acts
        else:
            s["actions"].pop(msg["user_id"], None)
    elif msg.get("entity_id"):
        act = msg.get("lock")
        if act is None or lc.empty_action(act):
            s["lock_actions"].pop(msg["entity_id"], None)
        else:
            s["lock_actions"][msg["entity_id"]] = lc.ACTION_SCHEMA(act)
    else:
        raise LockCodeError("user_id or entity_id is required")
    connection.send_result(msg["id"], {"settings": await mgr.async_save(s)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/push_code",
        vol.Required("user_id"): str,
        vol.Required("code"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_push_code(hass, connection, msg):
    """Set a User's code on the linked locks (the code must match the User)."""
    res = await _mgr(hass).async_push_code(msg["user_id"], msg["code"])
    connection.send_result(msg["id"], {"results": res})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/clear",
        vol.Required("user_id"): str,
        vol.Optional("unlink", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_clear(hass, connection, msg):
    """Clear a User's code from the linked locks."""
    res = await _mgr(hass).async_clear(msg["user_id"], msg["unlink"])
    connection.send_result(msg["id"], {"results": res})


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/locks/user", vol.Required("user_id"): str})
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_user(hass, connection, msg):
    """Linked slots of one User with sync status (reads the linked locks)."""
    mgr = _mgr(hass)
    links = lc.links_for_user(mgr.settings, msg["user_id"])
    out = []
    for entity_id in sorted({lk["entity_id"] for lk in links}):
        data = await mgr.async_read(entity_id)
        out += [{"entity_id": entity_id, **row} for row in data["slots"] if row["user_id"] == msg["user_id"]]
    connection.send_result(
        msg["id"],
        {"links": out, "actions": mgr.settings["actions"].get(msg["user_id"]) or {}, "sync_labels": lc.SYNC},
    )


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/locks/legacy"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_locks_legacy(hass, connection, msg):
    """Old slot -> House Mode entries still to move."""
    connection.send_result(msg["id"], {"legacy": _mgr(hass).legacy_slots()})


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/locks/migrate"})
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_migrate(hass, connection, msg):
    """Move the old slot -> House Mode entries to Users."""
    connection.send_result(msg["id"], {"results": await _mgr(hass).async_migrate_legacy()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/reveal",
        vol.Required("entity_id"): str,
        vol.Required("slot"): vol.Coerce(int),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_reveal(hass, connection, msg):
    """One slot's code, read from the lock now, for an admin who clicked "show". Never stored or logged."""
    slots, _api = await _mgr(hass).reader(msg["entity_id"])
    slot = next((s for s in slots or [] if s["slot"] == msg["slot"]), None)
    code = lc.usable_code(slot.get("code")) if slot and slot["in_use"] else None
    connection.send_result(msg["id"], {"code": code, "readable": code is not None})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/user/set_code",
        vol.Required("user_id"): str,
        vol.Required("code"): vol.All(str, vol.Length(min=4, max=32)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_user_set_code(hass, connection, msg):
    """Admin sets a User's code without the old one (Alarmo's own editor asks for it)."""
    mgr = _mgr(hass)
    coord = mgr.ext.coordinator
    code = msg["code"].strip()
    if msg["user_id"] not in mgr.users():
        raise LockCodeError("Unknown Alarmo User")
    other = await coord.async_authenticate_user(code)
    if other and other["user_id"] != msg["user_id"]:
        raise LockCodeError("Another user already has this code")
    hashed = await hass.async_add_executor_job(lc.hash_code, code, 10)
    coord.store.async_update_user(
        msg["user_id"],
        {"code": hashed, "code_format": "number" if code.isdigit() else "text", "code_length": len(code)},
    )
    async_dispatcher_send(hass, "alarmo_update_frontend")
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/locks/sync_user",
        vol.Required("user_id"): str,
        vol.Optional("code"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_locks_sync_user(hass, connection, msg):
    """Write the User's code to linked slots that do not hold it (code typed, or copied from a slot that has it)."""
    connection.send_result(msg["id"], await _mgr(hass).async_sync_user(msg["user_id"], msg.get("code")))


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/user/reveal", vol.Required("user_id"): str})
@websocket_api.require_admin
@websocket_api.async_response
@_guard
async def ws_user_reveal(hass, connection, msg):
    """The User's code, if a linked lock slot holds it (Alarmo itself only keeps a hash). Never stored."""
    code = await _mgr(hass).user_code_from_locks(msg["user_id"])
    connection.send_result(msg["id"], {"code": code, "readable": code is not None})


LOCK_COMMANDS = (
    ws_locks_sync_user,
    ws_user_reveal,
    ws_locks_reveal,
    ws_user_set_code,
    ws_locks_legacy,
    ws_locks_migrate,
    ws_locks_get,
    ws_locks_read,
    ws_locks_link,
    ws_locks_import,
    ws_locks_actions,
    ws_locks_push_code,
    ws_locks_clear,
    ws_locks_user,
)
