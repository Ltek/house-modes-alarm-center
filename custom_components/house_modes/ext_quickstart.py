"""Quick Start: guided setups for new users (admin only).

Three setups, each a list of steps with a status:
- ``house``: House Modes only (one hidden partition; modes leave it alone).
- ``virtual``: this integration as the alarm (no physical panel): a partition, its Arm Modes, zones from door /
  window / motion sensors, a user code.
- ``panel``: House Modes and a physical panel: the panel link in Shadow, the panel's zones, House Modes in Shadow.
- ``alarmo``: moving over from Alarmo (shown only when Alarmo's files or entry are found, or after the import):
  Alarmo disabled, the import, Alarmo names in your automations, entity ids, the checks. Its steps are done with the
  buttons in that section (alarmo_import.py, references.py), never by Apply.

Step status: done / todo (Apply does it) / manual (needs you) / optional (useful, not needed) / skip.

``house_modes/ext/quickstart/plan`` returns the steps; ``…/apply`` makes a backup, then does every automatic step that
is not done yet. Steps that need the user (a code, the dashboard card) are "manual" and link to the right tab.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api

from . import const, house_detect
from .zone_rules import EntityCtx, _default_type
from .ext_panel_ws import TYPE_DEFAULTS, _discover, _link_targets
from .house_config import SOURCES, slug

DATA_EXT = "house_modes_ext"
SETUPS = ("alarmo", "house", "virtual", "panel")
APPLY_SETUPS = ("house", "virtual", "panel")  # the Alarmo steps have their own buttons
LABEL = "quick-start"
ZONE_CLASSES = {"door", "window", "garage_door", "opening", "motion", "occupancy", "presence"}
HOUSE_ONLY_MODES = ["Home", "Away", "Sleep", "Guest", "Vacation"]
CARD_YAML = "type: custom:house-modes-alarm-center-card"


def _ext(hass):
    return hass.data[DATA_EXT]


def _step(sid: str, title: str, status: str, detail: str = "", link: str | None = None, **extra: Any) -> dict:
    """status: done / todo (done by Apply) / manual (the user does it) / optional / skip (not needed)."""
    return {"id": sid, "title": title, "status": status, "detail": detail, "link": link, **extra}


def _areas(ext) -> dict[str, dict]:
    return dict(ext.store.async_get_areas())


def _first_area(ext) -> tuple[str, dict] | tuple[None, None]:
    areas = _areas(ext)
    if not areas:
        return None, None
    key = sorted(areas)[0]
    return key, areas[key]


def _zone_candidates(hass, ext, exclude: set[str]) -> list[dict]:
    """Door / window / motion binary sensors that are not zones yet (the alarm's own and panel zones excluded)."""
    reg = er.async_get(hass)
    configured = set(ext.store.async_get_sensors())
    out = []
    for st in hass.states.async_all("binary_sensor"):
        eid = st.entity_id
        if eid in configured or eid in exclude:
            continue
        ent = reg.async_get(eid)
        if ent is not None and (ent.platform == const.DOMAIN or ent.disabled_by or ent.hidden_by):
            continue
        dc = st.attributes.get("device_class")
        if dc not in ZONE_CLASSES:
            continue
        out.append({"entity_id": eid, "name": st.attributes.get("friendly_name") or eid, "device_class": dc})
    return sorted(out, key=lambda z: z["name"].lower())


def _detect_house(hass) -> dict[str, Any]:
    """The user's House Mode input_selects and the modes they offer (no activity evidence: Quick Start is fast)."""
    selects = [
        {
            "entity_id": st.entity_id,
            "name": st.attributes.get("friendly_name"),
            "options": st.attributes.get("options") or [],
        }
        for st in hass.states.async_all("input_select")
    ]
    picked = house_detect.pick_entities(selects)
    by_id = {s["entity_id"]: s for s in selects}
    options: list[str] = []
    for key in ("selector", "current"):
        options += (by_id.get(picked[key] or "") or {}).get("options", [])
    return {"entities": picked, "names": house_detect.mode_names(options)}


def _house_settings(hass, setup: str, area_key: str | None) -> dict[str, Any]:
    """House Mode settings for a setup: the user's own modes when found (Shadow), else starter modes (Live)."""
    found = _detect_house(hass)
    ents = found["entities"]
    own = bool(found["names"]) and bool(ents["selector"] or ents["current"])
    names = found["names"] or HOUSE_ONLY_MODES
    if setup == "house":
        # House Modes only: the modes describe what is going on; they never arm anything
        suggestions = [{"name": n, "icon": house_detect.rule_for(n)[1], "targets": {}} for n in names]
    else:
        suggestions = house_detect.suggest(names, {"modes": {}}, [area_key] if area_key else [])
    modes = []
    for s in suggestions:
        mid = slug(s["name"])
        modes.append(
            {
                "id": mid,
                "name": s["name"],
                "icon": s["icon"],
                "targets": s["targets"],
                "enter_sources": list(SOURCES),
                "leave_sources": list(SOURCES),
            }
        )
    settings: dict[str, Any] = {"enabled": True, "run_mode": "shadow" if own else "live", "modes": modes}
    if own:
        settings["input_select"] = ents["selector"] or ents["current"]
        if ents["current"]:
            settings["current_entity"] = ents["current"]
        if ents["previous"]:
            settings["previous_entity"] = ents["previous"]
    return settings


def _helper_picks(hass, house: dict) -> dict[str, str]:
    """Helpers found in Home Assistant that House Modes does not use yet (selector, current, previous)."""
    ents = _detect_house(hass)["entities"]
    out = {}
    for key, found in (("input_select", ents["selector"]), ("current_entity", ents["current"]),
                       ("previous_entity", ents["previous"])):
        if found and not house.get(key) and found not in (house.get("input_select"), house.get("current_entity"),
                                                         house.get("previous_entity")):
            out[key] = found
    return out


def _helpers_step(hass, house: dict) -> dict:
    used = [house.get(k) for k in ("input_select", "current_entity", "previous_entity") if house.get(k)]
    picks = _helper_picks(hass, house)
    link = "/house_modes/house/open/helpers"
    if picks:
        return _step("helpers", "House Mode helpers", "todo",
                     "uses your " + ", ".join(picks.values()) + " (selector / current / previous mode)",
                     link, picks=picks)
    if used:
        return _step("helpers", "House Mode helpers", "done", ", ".join(used), link)
    return _step("helpers", "House Mode helpers", "optional",
                 "none: House Modes works with select.house_mode alone. To have a selector, current and previous "
                 "mode helper, create them on House Modes → Helpers and notifications", link)


def _notify_step(house: dict) -> dict:
    n = house.get("notify_services") or []
    link = "/house_modes/house/open/helpers"
    if n:
        every = " · every change" if house.get("notify_changes") else ""
        return _step("notify", "House Mode notifications", "done", ", ".join(n) + every, link)
    return _step("notify", "House Mode notifications", "optional",
                 "none: pick a notify service for blocked changes, failed arming and timers", link)


def _automations_step(hass) -> dict:
    """The user's own House Mode automations, found by reading them (the House Modes tab lists them per mode)."""
    from .ext_house_actions import items_payload  # noqa: PLC0415

    try:
        items = items_payload(hass)["items"]
    except Exception:  # never let Quick Start fail on one odd automation
        items = []
    sets = [i for i in items if i.get("sets")]
    reacts = [i for i in items if i.get("reacts")]
    bypass = [i for i in sets if any(x["via"] in ("selector", "current") for x in i["sets"])
              or any(x["via"] == "service" and not x["source"] for x in i["sets"])]
    link = "/house_modes/house"
    if not sets and not reacts:
        return _step("automations", "What changes the House Mode", "manual",
                     "no automation sets a House Mode yet: add one with the blueprints ⏰ House Mode on a Schedule / "
                     "🏠 House Mode on Presence, or change it from the dashboard card", link)
    detail = f"found your automations: {len(sets)} set a House Mode, {len(reacts)} run when one starts or ends"
    if bypass:
        detail += f" · {len(bypass)} to check (they write the selector or leave out the source)"
    return _step("automations", "Your House Mode automations", "manual" if bypass else "done", detail, link)


def _recording_step(ext) -> dict:
    on = bool(ext.recorder.settings.get("enabled"))
    return _step("recording", "Activity recording", "done" if on else "todo",
                 "on" if on else "turns it on (records House Modes, the alarm, the panel, locks; never codes)",
                 "/house_modes/activity")


def plan(hass, setup: str) -> dict[str, Any]:  # noqa: PLR0912, PLR0915
    """The steps of a setup and their status."""
    ext = _ext(hass)
    area_key, area = _first_area(ext)
    house = ext.house.settings
    steps: list[dict] = []

    # a partition
    if area_key:
        steps.append(
            _step("partition", "A partition", "done", f"{area.get('name') or area_key}", "/house_modes/partitions")
        )
    else:
        name = "House"
        steps.append(
            _step(
                "partition",
                "A partition",
                "todo",
                f'creates "{name}"' + (" (hidden on the card: House Modes only)" if setup == "house" else ""),
            )
        )

    if setup in ("virtual",):
        modes = (area or {}).get("modes") or {}
        want = ["armed_away", "armed_home", "armed_night"]
        missing = [m for m in want if not (modes.get(m) or {}).get("enabled")]
        steps.append(
            _step(
                "arm_modes",
                "Arm Modes Away, Home and Night",
                "todo" if missing else "done",
                "turns on: " + ", ".join(m.replace("armed_", "").title() for m in missing) if missing else "on",
                "/house_modes/partitions",
            )
        )

    if setup == "panel":
        panels = _discover(hass)
        links = ext.panel.settings.get("links") or {}
        if links:
            link = next(iter(links.values()))
            steps.append(
                _step(
                    "panel_link",
                    "Physical panel link",
                    "done",
                    f"{link['panel_entity']} · {link['mode']}",
                    "/house_modes/panel",
                )
            )
        elif panels:
            p = panels[0]
            steps.append(
                _step("panel_link", "Physical panel link", "todo", f"links {p['name']} ({p['entity_id']}) in Shadow")
            )
        else:
            steps.append(
                _step(
                    "panel_link",
                    "Physical panel link",
                    "manual",
                    "no physical alarm panel found in Home Assistant (Envisalink: install envisalink_new first)",
                    "/house_modes/panel",
                )
            )
        panel_entity = (
            next(iter(links.values()))["panel_entity"] if links else (panels[0]["entity_id"] if panels else None)
        )
        p = next((x for x in panels if x["entity_id"] == panel_entity), None)
        if p:
            new = [z["entity_id"] for z in p["zones"] if not z["configured"] and not z["mirror_configured"]]
            steps.append(
                _step(
                    "panel_zones",
                    "The panel's zones as zones",
                    "todo" if new else "done",
                    f"adds {len(new)} zone(s)" if new else f"{len(p['zones'])} zone(s)",
                    "/house_modes/zones",
                    entities=new,
                )
            )
            steps.append(
                _step(
                    "panel_code",
                    "The panel's default code",
                    "done" if p["code_set"] else "manual",
                    "set"
                    if p["code_set"]
                    else f"set a default code on {p['entity_id']} (its settings in Home Assistant)",
                )
            )

    if setup == "virtual":
        cands = _zone_candidates(hass, ext, set())
        steps.append(
            _step(
                "zones",
                "Zones from your door, window and motion sensors",
                "todo" if cands else "done",
                f"adds {len(cands)} zone(s)" if cands else f"{len(ext.store.async_get_sensors())} zone(s)",
                "/house_modes/zones",
                candidates=cands,
            )
        )
    if setup in ("virtual", "panel"):
        users = ext.store.async_get_users()
        steps.append(
            _step(
                "user",
                "A user with a code",
                "done" if users else ("manual" if setup == "virtual" else "optional"),
                f"{len(users)} user(s)"
                if users
                else ("add one on Users, Codes, Keypads (codes are never made up)" if setup == "virtual" else
                      "to arm and disarm from the card or a lock keypad: add one on Users, Codes, Keypads"),
                "/house_modes/codes",
            )
        )
        notes = [a for a in ext.store.async_get_automations().values() if a.get("type") == "notification"]
        triggered = [a for a in notes if any(t.get("event") == "triggered" for t in a.get("triggers") or [])]
        steps.append(
            _step(
                "alarm_notify",
                "A notification when the alarm goes off",
                "done" if triggered else "manual",
                f"{len(notes)} notification(s)"
                if triggered
                else "add one on Notifications: When Triggered → your phone",
                "/house_modes/notifications",
            )
        )

    if setup in ("house", "panel"):
        if house["enabled"] and house["modes"]:
            mode = "Shadow" if house.get("run_mode") == "shadow" else "Live"
            steps.append(
                _step(
                    "house_modes",
                    "House Modes",
                    "done",
                    f"{len(house['modes'])} mode(s) · {mode}",
                    "/house_modes/house",
                )
            )
        else:
            s = _house_settings(hass, setup, area_key)
            how = (
                f"your own House Modes from {s.get('input_select')}, in Shadow (your automations stay in charge)"
                if s.get("input_select")
                else "starter modes " + ", ".join(m["name"] for m in s["modes"])
            )
            steps.append(_step("house_modes", "House Modes", "todo", how))
        steps.append(_helpers_step(hass, house))
        steps.append(_automations_step(hass))
        steps.append(_notify_step(house))

    steps.append(_recording_step(ext))

    steps.append(_step("card", "The dashboard card", "manual", "add it to a dashboard:", None, yaml=CARD_YAML))
    if setup == "panel":
        steps.append(
            _step(
                "live",
                "Go live",
                "manual",
                "when the Shadow logs match your automations: switch the panel link and House Modes to Live and "
                "turn off the automations they replace (HOUSE-MODES.md)",
                "/house_modes/activity",
            )
        )
    return _plan(setup, steps)


def _plan(setup: str, steps: list[dict]) -> dict[str, Any]:
    return {"setup": setup, "steps": steps, "todo": sum(1 for s in steps if s["status"] == "todo")}


async def plan_alarmo(hass) -> dict[str, Any] | None:  # noqa: PLR0912
    """Moving over from Alarmo. None when there is nothing of Alarmo (no files, no entry, never imported)."""
    from . import legacy, references, alarmo_import  # noqa: PLC0415
    from .takeover import SECTION as TAKEOVER  # noqa: PLC0415
    from .combined_store import async_get_combined  # noqa: PLC0415

    st = await alarmo_import.async_status(hass)
    if not (st["found"] or st["old_entries"] or st["choice"] == "imported"):
        return None
    ext = _ext(hass)
    steps: list[dict] = []
    link = None  # the Import / Rewrite buttons are in this section itself
    if st["old_active"]:
        steps.append(_step("alarmo_off", "Disable Alarmo", "manual",
                           "Settings → Devices & services → Alarmo → ⋮ → Disable (not Delete). Never both running: "
                           "until then the panel link stays in Shadow and the import is refused"))
    elif st["old_entries"]:
        steps.append(_step("alarmo_off", "Disable Alarmo", "done", "disabled"))
    else:
        steps.append(_step("alarmo_off", "Disable Alarmo", "done", "not installed"))

    if st["choice"] == "imported":
        imp = st["imported"] or {}
        c = imp.get("counts") or {}
        steps.append(_step("import", "Import from Alarmo", "done",
                           f"{(st['at'] or '')[:16].replace('T', ' ')} · {c.get('partitions', 0)} partitions, "
                           f"{c.get('zones', 0)} zones, {c.get('users', 0)} users, "
                           f"{c.get('house_modes', 0)} House Modes",
                           link))
    elif st["found"]:
        steps.append(_step("import", "Import from Alarmo", "manual",
                           "press Import below (a backup is made first; the Alarmo files are only read)", link))
    else:
        steps.append(_step("import", "Import from Alarmo", "skip", "no Alarmo files found"))

    if st["choice"] == "imported":
        scan = await references.async_scan(hass)
        if scan["total"]:
            files = ", ".join(f["file"] for f in scan["files"] if f["hits"])
            boards = [d["url_path"] or "Overview" for d in scan["dashboards"] if d["hits"]]
            where = files + ((", dashboards " + ", ".join(boards)) if boards else "")
            steps.append(_step("references", "Alarmo names in your automations, scripts and dashboards", "manual",
                               f"{scan['total']} to rewrite in {where}: check the list below, then press Rewrite "
                               "(copies are kept; Undo)",
                               link))
        else:
            last = scan.get("last")
            steps.append(_step("references", "Alarmo names in your automations, scripts and dashboards", "done",
                               "rewritten " + last["at"][:16].replace("T", " ") if last else "none found", link))
        combined = await async_get_combined(hass)
        taken = combined.get(TAKEOVER) or {}
        reg = er.async_get(hass)
        waiting = [e for e in reg.entities.values() if e.platform == legacy.OLD_DOMAIN
                   and str(e.unique_id).startswith("alarmo_mirror_") and e.id not in taken]
        if taken and not waiting:
            steps.append(_step("entity_ids", "Entity ids", "done",
                               f"alarm entities keep their ids; {len(taken)} mirror zone(s) took over the old ids"))
        elif waiting:
            steps.append(_step("entity_ids", "Entity ids", "manual",
                               "the mirror zones get the old ids once Alarmo is disabled and this integration restarts "
                               "(Settings → Devices & services → House Modes & Alarm Center → ⋮ → Reload)"))
        else:
            steps.append(_step("entity_ids", "Entity ids", "done", "the alarm entities keep their ids"))
        house = ext.house.settings
        cur = next((m["name"] for m in house["modes"] if m["id"] == house.get("current")), None)
        links = ext.panel.settings.get("links") or {}
        steps.append(_step("check_mode", "Check the House Mode and the panel link", "manual",
                           f"House Mode {cur or 'unknown'} · House Modes {house.get('run_mode', 'live')}"
                           + (f" · panel link {next(iter(links.values()))['mode']}" if links else "")
                           + ": the same as before the move?", "/house_modes/house"))
        steps.append(_step("check_cycle", "One full test before any Away", "manual",
                           "disarm and arm once with a code, arm and disarm at the panel keypad, then watch Activity "
                           "for an hour. Way back: disable this integration, enable Alarmo (MIGRATION.md §2)",
                           "/house_modes/activity"))
        steps.append(_step("retire", "Remove Alarmo", "optional",
                           "after a few stable days, with a backup of its files: MIGRATION.md §3"))
    return _plan("alarmo", steps)


async def apply(hass, setup: str, entities: list[str] | None = None) -> dict[str, Any]:  # noqa: PLR0912, PLR0915
    """Back up, then do every automatic step that is not done yet. Returns the new plan and what was done."""
    ext = _ext(hass)
    before = plan(hass, setup)
    if not before["todo"]:
        return {"plan": before, "done": [], "backup": None}
    backup = await ext.backups.async_create(LABEL)
    done: list[str] = []
    coord = ext.coordinator
    steps = {s["id"]: s for s in before["steps"]}

    if steps["partition"]["status"] == "todo":
        modes = {
            m: {"enabled": False, "exit_time": 60, "entry_time": 30, "trigger_time": 300}
            for m in ("armed_away", "armed_home", "armed_night", "armed_vacation", "armed_custom_bypass")
        }
        if setup != "house":
            for m in ("armed_away", "armed_home", "armed_night"):
                modes[m]["enabled"] = True
        await coord.async_update_area_config(None, {"name": "House", "modes": modes})
        done.append("partition")
    area_key, area = _first_area(ext)

    if steps.get("arm_modes", {}).get("status") == "todo" and area_key:
        modes = {k: dict(v) for k, v in (area.get("modes") or {}).items()}
        for m in ("armed_away", "armed_home", "armed_night"):
            modes.setdefault(m, {"exit_time": 60, "entry_time": 30, "trigger_time": 300})
            modes[m]["enabled"] = True
            for k, d in (("exit_time", 60), ("entry_time", 30), ("trigger_time", 300)):
                if modes[m].get(k) is None:
                    modes[m][k] = d
        await coord.async_update_area_config(area_key, {"modes": modes})
        done.append("arm_modes")

    if steps.get("panel_link", {}).get("status") == "todo" and area_key:
        p = _discover(hass)[0]
        settings = dict(ext.panel.settings)
        links = dict(settings.get("links") or {})
        links[area_key] = {
            "panel_entity": p["entity_id"],
            "panel_type": "envisalink" if p["platform"] == "envisalink_new" else "generic",
            "mode": "shadow",
        }
        settings["links"] = links
        await ext.panel.async_save_settings(settings)
        done.append("panel_link")

    zone_ids: list[str] = []
    if steps.get("panel_zones", {}).get("status") == "todo":
        zone_ids = steps["panel_zones"]["entities"]
    if steps.get("zones", {}).get("status") == "todo":
        zone_ids = [c["entity_id"] for c in steps["zones"]["candidates"]]
    if entities is not None:
        zone_ids = [z for z in zone_ids if z in entities]
    if zone_ids and area_key:
        enabled = [m for m, c in (_areas(ext)[area_key].get("modes") or {}).items() if c.get("enabled")]
        create = []
        for eid in zone_ids:
            st = hass.states.get(eid)
            ztype = _default_type(
                EntityCtx(entity_id=eid, device_class=st.attributes.get("device_class") if st else None)
            )
            cfg = dict(TYPE_DEFAULTS[ztype])
            cfg["modes"] = [m for m in cfg["modes"] if m in enabled]
            create.append({"entity_id": eid, "area": area_key, "type": ztype, **cfg})
        await ext.async_apply_sensor_changes(
            {"create": create, "update": [], "delete": []}, label=LABEL, record_overrides=False
        )
        done.append("zones")

    if steps.get("house_modes", {}).get("status") == "todo":
        await ext.house.async_save_settings(_house_settings(hass, setup, area_key))
        done.append("house_modes")

    helpers = plan(hass, setup)["steps"]
    hstep = next((s for s in helpers if s["id"] == "helpers"), None)
    if hstep and hstep["status"] == "todo":
        await ext.house.async_save_settings({**ext.house.settings, **hstep["picks"]})
        done.append("helpers")

    if steps.get("recording", {}).get("status") == "todo":
        await ext.recorder.async_save_settings({**ext.recorder.settings, "enabled": True})
        done.append("recording")

    return {"plan": plan(hass, setup), "done": done, "backup": backup}


def status(hass) -> dict[str, Any]:
    """What is configured, for Quick Start's summary."""
    ext = _ext(hass)
    house = ext.house.settings
    links = ext.panel.settings.get("links") or {}
    rec = ext.recorder.settings
    return {
        "partitions": len(_areas(ext)),
        "zones": len(ext.store.async_get_sensors()),
        "users": len(ext.store.async_get_users()),
        "house": {"enabled": house["enabled"], "modes": len(house["modes"]), "run_mode": house.get("run_mode", "live")},
        "panel_links": [{"panel": li["panel_entity"], "mode": li["mode"]} for li in links.values()],
        "recording": bool(rec.get("enabled")),
        "alarms": [t["entity_id"] for t in _link_targets(hass)],
    }


@websocket_api.websocket_command(
    {vol.Required("type"): "house_modes/ext/quickstart/plan", vol.Optional("setup"): vol.In(SETUPS)}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_quickstart_plan(hass, connection, msg):
    """The steps of one setup (or all three) and what is configured."""
    setups = [msg["setup"]] if msg.get("setup") else list(SETUPS)
    plans = {s: plan(hass, s) for s in setups if s != "alarmo"}
    if "alarmo" in setups:
        alarmo = await plan_alarmo(hass)
        if alarmo is not None:
            plans["alarmo"] = alarmo
    connection.send_result(msg["id"], {"status": status(hass), "plans": plans})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "house_modes/ext/quickstart/apply",
        vol.Required("setup"): vol.In(APPLY_SETUPS),
        vol.Optional("entities"): [cv.entity_id],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_quickstart_apply(hass, connection, msg):
    """Back up, then do the setup's automatic steps."""
    try:
        res = await apply(hass, msg["setup"], msg.get("entities"))
    except Exception as err:  # report, never half-silently fail
        connection.send_error(msg["id"], "failed", str(err))
        return
    connection.send_result(msg["id"], {**res, "status": status(hass)})


QUICKSTART_COMMANDS = (ws_quickstart_plan, ws_quickstart_apply)
