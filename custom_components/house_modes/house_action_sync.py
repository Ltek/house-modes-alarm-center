"""House Mode actions: mirror them onto the scripts they run.

The House Mode's action list (its ``steps``) is the only source of truth. From it the integration writes, so the
scripts can be found from Home Assistant's own lists and files:

* a label "House Mode: <mode>" on each script, one per mode that runs it (removed when no mode does; scenes, which
  older configs could run, are kept in step too);
* a first line in each script's description, e.g. "House Mode action: Sleep, Away · entering, before arming".

Neither is ever read back. Descriptions are written only for scripts in ``scripts.yaml``, the same way Home
Assistant's script editor saves (which also means comments in that file are not kept), and only when they change.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import label_registry as lr
from homeassistant.helpers import entity_registry as er
from homeassistant.util.file import write_utf8_file_atomic
from homeassistant.util.yaml import dump, load_yaml

from .ext_house_actions import LABEL_PREFIX, set_modes

_LOGGER = logging.getLogger(__name__)

DESC_PREFIX = "House Mode action: "
SCRIPTS_FILE = "scripts.yaml"
ACTION_DOMAINS = ("script", "scene")
PHASE_TEXT = {"before": "before arming", "after": "after the change"}


def actions_by_entity(settings: dict) -> dict[str, list[tuple[dict, dict]]]:
    """entity_id -> [(mode, step)] for every action of every House Mode, in mode order."""
    out: dict[str, list[tuple[dict, dict]]] = {}
    for mode in settings.get("modes", []):
        for st in mode.get("steps", []):
            out.setdefault(st["entity_id"], []).append((mode, st))
    return out


def action_line(entries: list[tuple[dict, dict]], settings: dict) -> str | None:
    """The description line for one script, e.g. "House Mode action: Sleep, Away · entering, before arming".

    Actions with the same timing are grouped; groups are joined with "; ".
    """
    if not entries:
        return None
    names = {m["id"]: m["name"] for m in settings.get("modes", [])}
    groups: dict[tuple, list[str]] = {}
    for mode, st in entries:
        key = (st.get("when", "enter"), st.get("phase", "after"), tuple(st.get("modes") or ()))
        if mode["name"] not in groups.setdefault(key, []):
            groups[key].append(mode["name"])
    parts = []
    for (when, phase, only), modes in groups.items():
        timing = "entering" if when == "enter" else "leaving"
        if only:
            timing += (" from " if when == "enter" else " to ") + ", ".join(names.get(x, x) for x in only)
        parts.append(f"{', '.join(modes)} · {timing}, {PHASE_TEXT.get(phase, phase)}")
    return DESC_PREFIX + "; ".join(parts)


def merge_description(old: str | None, line: str | None) -> str | None:
    """``old`` with our line replaced by ``line`` (first), the user's own text kept below it."""
    rest = [x for x in (old or "").split("\n") if not x.startswith(DESC_PREFIX)]
    while rest and not rest[0].strip():
        rest.pop(0)
    out = ([line] + ([""] if rest else []) if line else []) + rest
    text = "\n".join(out).rstrip()
    return text or None


def sync_labels(hass: HomeAssistant, settings: dict) -> list[str]:
    """Give every script and scene exactly the House Mode labels of the modes that run it. Returns those changed."""
    want: dict[str, list[str]] = {}
    for eid, entries in actions_by_entity(settings).items():
        want[eid] = sorted({m["name"] for m, _ in entries})
    reg = er.async_get(hass)
    ours = {lab.label_id: lab.name[len(LABEL_PREFIX) :] for lab in lr.async_get(hass).async_list_labels()
            if lab.name.startswith(LABEL_PREFIX)}
    changed = []
    for entry in list(reg.entities.values()):
        if entry.domain not in ACTION_DOMAINS:
            continue
        have = sorted({ours[x] for x in entry.labels if x in ours})
        target = want.get(entry.entity_id, [])
        if have != target:
            set_modes(hass, entry.entity_id, target)
            changed.append(entry.entity_id)
    return changed


def _read(path: str) -> Any:
    try:
        return load_yaml(path)
    except FileNotFoundError:
        return None


async def sync_descriptions(hass: HomeAssistant, settings: dict) -> list[str]:
    """Write the House Mode line into the description of each script in scripts.yaml. Returns those changed."""
    path = hass.config.path(SCRIPTS_FILE)
    data = await hass.async_add_executor_job(_read, path)
    if not isinstance(data, dict):
        return []
    actions = actions_by_entity(settings)
    reg = er.async_get(hass)
    changed = []
    for object_id, cfg in data.items():
        if not isinstance(cfg, dict):
            continue
        eid = reg.async_get_entity_id("script", "script", object_id) or f"script.{object_id}"
        new = merge_description(cfg.get("description"), action_line(actions.get(eid, []), settings))
        if new == (cfg.get("description") or None):
            continue
        if new is None:
            cfg.pop("description", None)
        else:
            cfg["description"] = new
        changed.append(eid)
    if changed:
        await hass.async_add_executor_job(lambda: write_utf8_file_atomic(path, dump(data)))
        if hass.services.has_service("script", "reload"):
            await hass.services.async_call("script", "reload", blocking=True)
    return changed


async def async_sync_actions(hass: HomeAssistant, settings: dict) -> dict[str, list[str]]:
    """Labels and descriptions from the House Mode actions. Never raises; errors are returned."""
    out: dict[str, list[str]] = {"labels": [], "descriptions": [], "errors": []}
    try:
        out["labels"] = sync_labels(hass, settings)
    except Exception as err:
        _LOGGER.warning("House Mode action labels not updated: %s", err)
        out["errors"].append(f"labels: {err}")
    try:
        out["descriptions"] = await sync_descriptions(hass, settings)
    except Exception as err:
        _LOGGER.warning("House Mode action descriptions not updated: %s", err)
        out["errors"].append(f"descriptions: {err}")
    return out
