"""One-off rebrand pass: alarmo -> house_modes (run once on the fresh copy, 2026-11-11).

Kept in tools/ as the record of how the rename was done. Running it again on the renamed tree is a no-op apart from
reporting what it would change (it looks for files under custom_components/alarmo, which no longer exist).
"""

from __future__ import annotations

import os
import re
import sys
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OLD = ROOT / "custom_components" / "alarmo"
NEW = ROOT / "custom_components" / "house_modes"
FE = NEW / "frontend"

SKIP_DIRS = {"node_modules", "dist", ".git", "__pycache__", ".pytest_cache", "archive", "release", "configs", "logs"}
SKIP_FILES = {"CHANGELOG.md", "package-lock.json", "uv.lock", "LICENSE", "LICENSE-alarmo-card", "rebrand_rename.py",
              "ROADMAP.md", "store_upstream.py"}
TEXT_EXT = {".py", ".ts", ".js", ".mjs", ".json", ".md", ".yaml", ".yml", ".sh", ".toml", ".ini", ".txt", ".cfg"}

# Strings that must survive as they are (credits, upstream links, the old file names the import reads).
PROTECT = [
    "nielsfaber/alarmo-card",
    "nielsfaber/alarmo",
    "LICENSE-alarmo-card",
    "complex_alarmo.storage.json",
    "mdi:alarm-panel",
]

# Panel elements with generic upstream names: prefixed hm- so they never clash with an installed Alarmo panel.
GENERIC_TAGS = [
    "area-config-card", "mqtt-config-card", "alarm-mode-card", "user-editor-card", "automation-editor-card",
    "notification-editor-card", "sensor-editor-card", "sensors-overview-card", "add-sensors-card",
    "confirm-delete-dialog", "create-area-dialog", "error-dialog", "edit-master-dialog",
    "create-sensor-group-dialog", "manage-sensor-groups-dialog",
]


def move_tree() -> None:  # noqa: PLR0912
    """Move and rename folders and files; drop the non-English language files."""
    if OLD.exists():
        shutil.move(str(OLD), str(NEW))
    for tr in (NEW / "translations").glob("*.json"):
        if tr.name != "en.json":
            tr.unlink()
    for d in (FE / "localize" / "languages", FE / "card" / "src" / "alarm" / "localize" / "languages"):
        for f in d.glob("*.json"):
            if f.name != "en.json":
                f.unlink()
    comp = FE / "src" / "components"
    for f in comp.glob("alarmo-*.ts"):
        f.rename(comp / f.name.replace("alarmo-", "hm-"))
    alarm = FE / "card" / "src" / "alarm"
    if (alarm / "alarmo-card.ts").exists():
        (alarm / "alarmo-card.ts").rename(alarm / "hmac-alarm.ts")
    for f in (alarm / "components").glob("alarmo-*.ts"):
        f.rename(f.with_name(f.name.replace("alarmo-", "hmac-")))
    if (FE / "src" / "alarm-panel.ts").exists():
        (FE / "src" / "alarm-panel.ts").rename(FE / "src" / "house-modes-panel.ts")
    old_dist = FE / "dist" / "alarm-panel.js"
    if old_dist.exists():
        old_dist.unlink()
    bp_old = ROOT / "blueprints" / "automation" / "alarmo"
    bp_new = ROOT / "blueprints" / "automation" / "LTek"
    if bp_old.exists():
        bp_new.mkdir(parents=True, exist_ok=True)
        for f in bp_old.glob("*.yaml"):
            f.rename(bp_new / (f.stem.replace("_", "-") + "-ltek.yaml"))
        bp_old.rmdir()


def rename_text(text: str, path: Path) -> str:
    """Apply the renames to one file's text."""
    ts = path.suffix in (".ts", ".js", ".mjs")
    in_card = "frontend/card/" in path.as_posix()
    keep = {}
    for i, s in enumerate(PROTECT):
        token = f"\x00P{i}\x00"
        keep[token] = s
        text = text.replace(s, token)

    text = text.replace("custom_components/alarmo", "custom_components/house_modes")
    text = text.replace("custom_components.alarmo", "custom_components.house_modes")
    text = text.replace("blueprints/automation/alarmo/house_mode_schedule.yaml",
                        "blueprints/automation/LTek/house-mode-schedule-ltek.yaml")
    text = text.replace("blueprints/automation/alarmo/house_mode_presence.yaml",
                        "blueprints/automation/LTek/house-mode-presence-ltek.yaml")
    text = text.replace("blueprints/automation/alarmo", "blueprints/automation/LTek")
    text = text.replace("select.alarmo_house_mode", "select.house_mode")
    text = text.replace("alarm-panel", "house-modes-panel")
    text = text.replace("alarm-view-", "hm-view-")
    text = text.replace("alarmo-ext-", "hm-")
    if in_card:
        text = text.replace("alarmo-card", "hmac-alarm")
        text = text.replace("alarmo-", "hmac-")
    if ts:
        text = text.replace("alarmo-", "hm-")
        for tag in GENERIC_TAGS:
            for a, b in (("<", ""), ("</", ">"), ("'", "'"), ('"', '"'), ("`", "`")):
                text = text.replace(f"{a}{tag}{b}", f"{a}hm-{tag}{b}")
            text = re.sub(rf"<{tag}(?=[\s>])", f"<hm-{tag}", text)
    else:
        text = text.replace("alarmo-", "house-modes-")
    text = text.replace("alarmo/", "house_modes/")
    text = text.replace("ALARMO_", "HOUSE_MODES_")
    if ts:
        text = re.sub(r"Alarmo(?=[A-Z])", "Hm", text)
        text = re.sub(r"\balarmo(?=[A-Z])", "hm", text)
    else:
        text = re.sub(r"Alarmo(?=[A-Z])", "HouseModes", text)
    text = text.replace("alarmo", "house_modes")

    for token, s in keep.items():
        text = text.replace(token, s)
    return text


def walk():
    """Text files to rename in."""
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            p = Path(dirpath) / name
            if name in SKIP_FILES or p.suffix not in TEXT_EXT:
                continue
            yield p


def main() -> int:
    """Run the rebrand pass."""
    move_tree()
    changed = 0
    for p in walk():
        old = p.read_text(encoding="utf-8")
        new = rename_text(old, p)
        if new != old:
            p.write_text(new, encoding="utf-8")
            changed += 1
    print(f"changed {changed} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
