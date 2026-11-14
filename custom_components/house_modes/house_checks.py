"""Everything that needs the user's attention, in one list: the status strip shows it, Quick Start and the tabs link it.

Each warning: {"id", "level": "error" | "warn", "title", "detail", "link", "items": [...] (optional)}.
``error``: something does not work or works wrongly now (Alarmo still enabled, a panel link not running, the alarm
counting as armed before the panel). ``warn``: worth fixing (an automation that bypasses House Modes, a timer that
cannot fire, a selector missing mode names, no notify service, pending zone rules).

Never raises: a check that fails is left out.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from . import legacy
from .house_config import find_mode

_LOGGER = logging.getLogger(__name__)

DATA_EXT = "house_modes_ext"


def _w(wid: str, level: str, title: str, detail: str, link: str, **extra: Any) -> dict[str, Any]:
    return {"id": wid, "level": level, "title": title, "detail": detail, "link": link, **extra}


# ------------------------------------------------------------------ automations


def setter_reasons(setter: dict, mode: dict | None) -> list[str]:
    """Why one way an automation sets the House Mode needs a look (the same rules as the House Modes tab)."""
    via, source = setter.get("via"), setter.get("source")
    if via == "current":
        return ["writes the current-mode helper directly: House Modes never sees the request (nothing is armed, no "
                "script runs). Call house_modes.set_house_mode instead"]
    out = []
    if via in ("selector", "select"):
        out.append('writes the selector, so the request arrives as "automation": call house_modes.set_house_mode '
                   "with a source")
    elif via == "service" and not source:
        out.append('calls house_modes.set_house_mode without a source, so it arrives as "automation"')
    src = source if via == "service" and source else ("automation" if via in ("selector", "select") else None)
    if mode is not None and src and src not in (mode.get("enter_sources") or []):
        out.append(f'{mode["name"]} does not allow "{src}" to enter (Allowed Sources, May Enter)')
    return out


def automations_to_check(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Enabled automations that set the House Mode in a way that needs a look. Turned-off ones are left out."""
    from .ext_house_actions import items_payload  # noqa: PLC0415

    ext = hass.data[DATA_EXT]
    house = ext.house.settings
    out = []
    for item in items_payload(hass)["items"]:
        if item["kind"] != "automation" or not item.get("sets") or item["state"] != "on":
            continue
        reasons: list[str] = []
        for s in item["sets"]:
            mode = find_mode(house, s["mode"]) if s.get("mode") else None
            for r in setter_reasons(s, mode):
                text = f"{s['mode']}: {r}" if s.get("mode") else r
                if text not in reasons:
                    reasons.append(text)
        if reasons:
            out.append(
                {
                    "entity_id": item["entity_id"],
                    "name": item["name"],
                    "edit_id": item.get("edit_id"),
                    "reasons": reasons,
                }
            )
    return out


# ------------------------------------------------------------------ House Mode settings


def timer_problems(modes: list[dict]) -> list[str]:
    """Timers that can never fire, or that bounce between two modes (the House Modes tab shows the same)."""
    by_id = {m["id"]: m for m in modes}
    out = []
    for m in modes:
        timers = m.get("timers") or []
        if timers and "timer" not in (m.get("leave_sources") or []):
            out.append(f"{m['name']}: its timers never fire ({m['name']} doesn't allow House Mode timers to exit)")
        for t in timers:
            then = t.get("then")
            to = None if then == "previous" else by_id.get(then)
            if then == m["id"]:
                out.append(f"{m['name']}: a timer goes to {m['name']} itself")
            elif then != "previous" and to is None:
                out.append(f"{m['name']}: a timer goes to a mode that no longer exists")
            elif to and "timer" not in (to.get("enter_sources") or []):
                out.append(f"{m['name']}: the timer to {to['name']} is blocked ({to['name']} doesn't allow House Mode "
                           "timers to enter)")
    return out


def selector_missing(hass: HomeAssistant, house: dict) -> list[str]:
    """Mode names the House Mode selector does not offer."""
    sel = house.get("input_select")
    st = hass.states.get(sel) if sel else None
    if st is None:
        return []
    opts = {str(o).lower() for o in st.attributes.get("options") or []}
    return [m["name"] for m in house["modes"] if m["name"].lower() not in opts]


# ------------------------------------------------------------------ all of it


def collect(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every warning, errors first."""
    ext = hass.data.get(DATA_EXT)
    if ext is None:
        return []
    out: list[dict[str, Any]] = []

    def guard(fn) -> None:
        try:
            fn()
        except Exception:
            _LOGGER.exception("A House Modes check failed")

    def alarmo() -> None:
        if legacy.old_alarmo_active(hass):
            out.append(_w("alarmo_enabled", "error", "Alarmo is still enabled",
                          "Disable the Alarmo integration: the two must never run together. Until then the panel link "
                          "stays in Shadow.", "/house_modes/general"))

    def links() -> None:
        from .ext_panel_ws import _discover, exit_mismatches  # noqa: PLC0415

        panels = {p["entity_id"]: p for p in _discover(hass)}
        for key, link in (ext.panel.settings.get("links") or {}).items():
            name = (panels.get(link["panel_entity"]) or {}).get("name") or link["panel_entity"]
            if link["mode"] != "off" and key not in ext.panel.links:
                out.append(_w(f"link_down:{key}", "error", f"Panel link not running: {name}",
                              "Physical Panel tab → its log says why (alarm entity or panel missing).",
                              "/house_modes/panel"))
            p = panels.get(link["panel_entity"])
            if p is not None and not p.get("code_set") and link["mode"] != "off":
                out.append(_w(f"panel_code:{key}", "error", f"No default code on {name}",
                              f"Set a default code on {link['panel_entity']} (its entity settings): keypresses "
                              "need it.",
                              "/house_modes/panel"))
            for item in exit_mismatches(ext, key, link):
                short = any(v["kind"] == "short" for v in item["modes"].values())
                txt = ", ".join(
                    f"{m.replace('armed_', '').replace('_', ' ').title()} {v['alarm']} s (panel {v['panel']} s)"
                    for m, v in item["modes"].items()
                )
                out.append(_w(f"exit:{key}:{item['area_id']}", "error" if short else "warn",
                              "Exit times don't match the panel",
                              f"{item['name']}: {txt}. "
                              + ("The alarm shows armed while the panel is still counting down."
                                 if short else "The alarm keeps counting down after the panel is armed.")
                              + " Physical Panel → Match the alarm's exit times.",
                              "/house_modes/panel"))

    def automations() -> None:
        if not ext.house.settings["enabled"]:
            return
        items = automations_to_check(hass)
        if items:
            out.append(_w("automations", "warn", f"{len(items)} House Mode automation{'s' if len(items) != 1 else ''} "
                          "to check", "They change the House Mode in a way that bypasses or is refused by House Modes.",
                          "/house_modes/general", items=items))

    def house() -> None:
        h = ext.house.settings
        if not h["enabled"]:
            return
        for i, text in enumerate(timer_problems(h["modes"])):
            out.append(_w(f"timer:{i}", "warn", "A House Mode timer can't work", text, "/house_modes/house"))
        missing = selector_missing(hass, h)
        if missing:
            out.append(_w("selector", "warn", "The House Mode selector is missing modes",
                          f"{h['input_select']} has no option {', '.join(missing)}: changing to them can't be "
                          "shown there. House Modes → Helpers → Add them.", "/house_modes/house/open/helpers"))
        n = h.get("notifications") or {}
        on = [ev for ev in ("changed", "blocked", "failed", "timer") if (n.get(ev) or {}).get("enabled")]
        if on and not n.get("services"):
            out.append(_w("notify", "warn", "House Mode notifications have no recipient",
                          "Blocked and Failed to arm are on but no notify service is chosen: nothing is sent.",
                          "/house_modes/notifications/open/house"))

    def rules() -> None:
        n = ext.rules.pending_count
        if n:
            out.append(_w("rules", "warn", f"{n} zone rule change{'s' if n != 1 else ''} pending",
                          "Review and apply them on Zones.", "/house_modes/zones"))

    for fn in (alarmo, links, automations, house, rules):
        guard(fn)
    out.sort(key=lambda w: w["level"] != "error")
    return out
