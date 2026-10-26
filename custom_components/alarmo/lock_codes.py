"""Alarmo Users <-> lock code slots: configuration and decision logic (no HA objects).

Stored in alarmo_extras under ``locks``:

    links:        [{user_id, entity_id, slot}]          one Alarmo User per lock slot
    actions:      {user_id: {unlock: ACTION, lock: ACTION}}
    lock_actions: {entity_id: ACTION}                   keypad lock without a code (Schlage button)

ACTION = {house_mode: <mode id> | None, targets: {<partition key>: <state>}}; partition targets
win over the House Mode for those partitions.

PINs are never stored here: they are compared against the Users' bcrypt hashes when needed.
"""

from __future__ import annotations

import copy
import base64
from typing import Any

import bcrypt
import voluptuous as vol

TARGET_STATES = (
    "armed_away",
    "armed_home",
    "armed_night",
    "armed_vacation",
    "armed_custom_bypass",
    "disarmed",
)
OPERATIONS = ("unlock", "lock")
EVENT_LABELS = {
    "Keypad unlock operation": "unlock",
    "Keypad lock operation": "lock",
}
MASTER_KEY = "master"

ACTION_SCHEMA = vol.Schema(
    {
        vol.Optional("house_mode", default=None): vol.Any(None, vol.Match(r"^[a-z0-9_]{1,32}$")),
        vol.Optional("targets", default={}): {str: vol.In(TARGET_STATES)},
    }
)
LINK_SCHEMA = vol.Schema(
    {
        vol.Required("user_id"): vol.All(str, vol.Length(min=1)),
        vol.Required("entity_id"): vol.Match(r"^lock\.[a-z0-9_]+$"),
        vol.Required("slot"): vol.All(vol.Coerce(int), vol.Range(min=1, max=999)),
    }
)


def _unique_links(links: list[dict]) -> list[dict]:
    seen = set()
    for link in links:
        key = (link["entity_id"], link["slot"])
        if key in seen:
            raise vol.Invalid(f"{link['entity_id']} slot {link['slot']} is linked twice")
        seen.add(key)
    return links


SETTINGS_SCHEMA = vol.Schema(
    {
        vol.Optional("links", default=[]): vol.All([LINK_SCHEMA], _unique_links),
        vol.Optional("actions", default={}): {str: vol.Schema({vol.Optional(op): ACTION_SCHEMA for op in OPERATIONS})},
        vol.Optional("lock_actions", default={}): {vol.Match(r"^lock\.[a-z0-9_]+$"): ACTION_SCHEMA},
    }
)


def normalize(raw: dict | None) -> dict[str, Any]:
    """Validated lock settings."""
    return SETTINGS_SCHEMA(copy.deepcopy(raw or {}))


def empty_action(action: dict | None) -> bool:
    """True when an action does nothing."""
    return not action or (not action.get("house_mode") and not action.get("targets"))


def links_for_user(settings: dict, user_id: str) -> list[dict]:
    """Lock slots linked to a User."""
    return [link for link in settings["links"] if link["user_id"] == user_id]


def link_for_slot(settings: dict, entity_id: str, slot: int) -> dict | None:
    """The link of one lock slot."""
    return next(
        (lk for lk in settings["links"] if lk["entity_id"] == entity_id and lk["slot"] == int(slot)),
        None,
    )


def set_link(settings: dict, user_id: str, entity_id: str, slot: int) -> dict:
    """Link a slot to a User (replacing any other link of that slot)."""
    new = copy.deepcopy(settings)
    new["links"] = [lk for lk in new["links"] if not (lk["entity_id"] == entity_id and lk["slot"] == int(slot))]
    new["links"].append({"user_id": user_id, "entity_id": entity_id, "slot": int(slot)})
    new["links"].sort(key=lambda lk: (lk["entity_id"], lk["slot"]))
    return new


def remove_link(settings: dict, entity_id: str, slot: int) -> dict:
    """Unlink a slot."""
    new = copy.deepcopy(settings)
    new["links"] = [lk for lk in new["links"] if not (lk["entity_id"] == entity_id and lk["slot"] == int(slot))]
    return new


def drop_unknown_users(settings: dict, user_ids: set[str]) -> dict:
    """Remove links and actions of Users that no longer exist."""
    new = copy.deepcopy(settings)
    new["links"] = [lk for lk in new["links"] if lk["user_id"] in user_ids]
    new["actions"] = {k: v for k, v in new["actions"].items() if k in user_ids}
    return new


# ------------------------------------------------------------------ permissions


def denied_targets(user: dict, targets: dict[str, str]) -> dict[str, str]:
    """Partition targets the User may not set: {key: reason}. Empty dict = allowed."""
    out: dict[str, str] = {}
    if not user.get("enabled", True):
        return dict.fromkeys(targets, "user disabled")
    limit = user.get("area_limit") or []
    for key, state in targets.items():
        if limit and key != MASTER_KEY and key not in limit:
            out[key] = "partition not allowed for this user"
        elif limit and key == MASTER_KEY:
            out[key] = "master needs a user without partition limit"
        elif state == "disarmed" and not user.get("can_disarm"):
            out[key] = "user may not disarm"
        elif state != "disarmed" and not user.get("can_arm"):
            out[key] = "user may not arm"
    return out


def plan(user: dict, action: dict, mode_targets: dict[str, str] | None = None) -> dict[str, Any]:
    """What a keypad action does for a User.

    - House Mode: allowed for any enabled User (lock-only Users included). Whether the House Mode may
      change is decided by the House Mode's own source table ("Lock keypad"), not by Can arm / Can disarm.
    - Partition targets (Alarmo Arm Modes / disarm): need Can arm / Can disarm and the partition limit;
      denied targets are left out.
    Returns {house_mode, targets, denied}.
    """
    house_mode = action.get("house_mode")
    denied: dict[str, str] = {}
    if house_mode and not user.get("enabled", True):
        denied["house_mode"] = "user disabled"
        house_mode = None
    t_denied = denied_targets(user, action.get("targets") or {})
    denied.update(t_denied)
    targets = {k: v for k, v in (action.get("targets") or {}).items() if k not in t_denied}
    return {"house_mode": house_mode, "targets": targets, "denied": denied}


# ------------------------------------------------------------------ codes


def check_code(code: str | None, hashed: str | None) -> bool:
    """Bcrypt check of a plain code against an Alarmo User code hash (blocking)."""
    if not code or not hashed:
        return False
    try:
        return bcrypt.checkpw(code.encode("utf-8"), base64.b64decode(hashed))
    except Exception:
        return False


def hash_code(code: str, rounds: int = 10) -> str:
    """Hash like Alarmo does (blocking)."""
    return base64.b64encode(bcrypt.hashpw(code.encode("utf-8"), bcrypt.gensalt(rounds=rounds))).decode()


def usable_code(code: Any) -> str | None:
    """A PIN read from a lock, or None when it is empty or masked."""
    if code is None:
        return None
    code = str(code).strip()
    if not code or "*" in code or not code.isdigit():
        return None
    return code


def find_user_by_code(users: dict[str, dict], code: str) -> str | None:
    """user_id whose code is this PIN (blocking)."""
    for uid, user in users.items():
        if check_code(code, user.get("code")):
            return uid
    return None


SYNC = {
    "in_sync": "Slot = User Code",
    "different": "Slot ≠ User Code",
    "empty": "Slot Empty",
    "unknown": "Not readable",
    "user_disabled": "User disabled, code still in slot",
    "no_user": "User removed",
}


def sync_status(user: dict | None, slot: dict | None) -> str:
    """Compare a link (blocking: bcrypt)."""
    if user is None:
        return "no_user"
    if slot is None or not slot.get("in_use"):
        return "empty"
    code = usable_code(slot.get("code"))
    if code is None:
        return "unknown"
    if not user.get("enabled", True):
        return "user_disabled"
    return "in_sync" if check_code(code, user.get("code")) else "different"


def unique_name(name: str, taken: set[str]) -> str:
    """User names must be unique in Alarmo."""
    base = name.strip() or "Lock user"
    lower = {t.lower() for t in taken}
    if base.lower() not in lower:
        return base
    n = 2
    while f"{base} ({n})".lower() in lower:
        n += 1
    return f"{base} ({n})"


def parse_usercodes(raw: Any) -> list[dict]:
    """Normalise lock slot data from zwave_js_server get_usercodes / zwave_js.get_lock_usercode.

    Accepts a list of {code_slot, usercode, in_use[, name]} or a mapping {slot: {usercode, in_use}}
    (optionally wrapped in {entity_id: ...}). Returns [{slot, in_use, code, name}].
    """
    items: list[dict] = []
    if isinstance(raw, dict) and len(raw) == 1:
        (only,) = raw.values()
        if isinstance(only, dict | list) and not str(next(iter(raw))).isdigit():
            raw = only
    if isinstance(raw, dict):
        raw = [{"code_slot": k, **(v if isinstance(v, dict) else {"usercode": v})} for k, v in raw.items()]
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        try:
            slot = int(item.get("code_slot", item.get("slot")))
        except (TypeError, ValueError):
            continue
        code = item.get("usercode", item.get("code"))
        in_use = item.get("in_use")
        if in_use is None:
            in_use = bool(code)
        items.append({"slot": slot, "in_use": bool(in_use), "code": code, "name": item.get("name") or ""})
    return sorted(items, key=lambda x: x["slot"])


def parse_users(raw: Any) -> list[dict]:
    """Normalise zwave_js.get_users (User Credential locks) to the slot format.

    Each PIN credential becomes one entry; the lock's user name comes along.
    """
    if isinstance(raw, dict) and len(raw) == 1 and "users" not in raw:
        (raw,) = raw.values()
    users = raw.get("users") if isinstance(raw, dict) else raw
    out = []
    for user in users or []:
        if not isinstance(user, dict):
            continue
        for cred in user.get("credentials") or []:
            if cred.get("type") not in ("pin_code", "PIN code", 1):
                continue
            try:
                slot = int(cred.get("slot", user.get("user_id")))
            except (TypeError, ValueError):
                continue
            out.append(
                {
                    "slot": slot,
                    "in_use": bool(user.get("active", True)),
                    "code": cred.get("data"),
                    "name": user.get("user_name") or "",
                    "lock_user_id": user.get("user_id"),
                }
            )
    return sorted(out, key=lambda x: x["slot"])
