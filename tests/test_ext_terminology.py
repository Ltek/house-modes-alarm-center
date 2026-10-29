"""Phase 2.5: the terminology rename changes English display text only."""

import re
import json
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).parent.parent
LANG_DIR = "custom_components/alarmo/frontend/localize/languages"
EXT_ADDED_KEYS = {
    "panels.sensor_table.title",
    "panels.backup.title",
    "panels.partitions.title",
    "panels.modes.title",
    "panels.notifications.title",
    "panels.zones.title",
    "panels.zones_legacy.title",
    "panels.panel.title",
    "panels.house.title",
    "panels.why.title",
    "panels.activity.title",
    "panels.house_actions.title",
    "panels.users_codes.title",
    "panels.mirrors.title",
    "panels.ha_zones.title",
    "panels.connections.title",
}


def _head(path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"HEAD:{path}"], cwd=ROOT)


def _keys(obj, prefix=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from _keys(v, f"{prefix}.{k}" if prefix else k)
    else:
        yield prefix


def _placeholders(text: str) -> set[str]:
    """ICU argument names, e.g. {area} or {number, plural, ...}."""
    return set(re.findall(r"(?<![a-z] )\{(\w+)[},]", text))


def _values(obj, prefix=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from _values(v, f"{prefix}.{k}" if prefix else k)
    else:
        yield prefix, obj


@pytest.fixture(scope="module")
def git_available() -> None:
    """Skip when the upstream git history is not available."""
    try:
        _head(f"{LANG_DIR}/en.json")
    except (subprocess.CalledProcessError, FileNotFoundError):
        pytest.skip("git checkout of upstream not available")


def test_english_keys_unchanged(git_available) -> None:
    """Only values change; the ext build adds just its own tab titles."""
    old = json.loads(_head(f"{LANG_DIR}/en.json"))
    new = json.loads((ROOT / LANG_DIR / "en.json").read_text(encoding="utf-8"))
    assert set(_keys(new)) == set(_keys(old)) | EXT_ADDED_KEYS


def test_english_placeholders_kept(git_available) -> None:
    """Message arguments such as {area} must survive the rename."""
    old = dict(_values(json.loads(_head(f"{LANG_DIR}/en.json"))))
    new = dict(_values(json.loads((ROOT / LANG_DIR / "en.json").read_text("utf-8"))))
    for key, text in old.items():
        lost = (
            _placeholders(str(text))
            - _placeholders(str(new[key]))
            - {
                "sensor",
                "sensors",
            }
        )  # plural branch words, not arguments
        assert not lost, f"{key} lost {lost}"


def test_english_terms_renamed() -> None:
    """Spot-check the new terms."""
    en = json.loads((ROOT / LANG_DIR / "en.json").read_text(encoding="utf-8"))
    assert en["panels"]["general"]["cards"]["areas"]["title"] == "Partitions"
    assert en["panels"]["sensors"]["title"] == "Zones"
    assert en["panels"]["general"]["cards"]["modes"]["title"] == "Alarmo Arm Modes"
    assert "cross-zone" in en["panels"]["sensors"]["dialogs"]["manage_groups"]["title"]
    assert en["panels"]["sensor_table"]["title"] == "Zone Assignments"
    assert en["panels"]["zones"]["title"] == "Zone Assignments"
    assert en["panels"]["zones_legacy"]["title"] == "Zones (legacy)"
    assert en["panels"]["modes"]["title"] == "Alarmo Arm Modes"
    assert en["panels"]["panel"]["title"] == "Physical Panel"
    # device-type descriptions describe physical sensors and are not renamed
    choose = en["panels"]["sensors"]["cards"]["editor"]["fields"]["device_type"][
        "choose"
    ]
    assert "sensor" in choose["motion"]["description"].lower()


def test_other_languages_untouched(git_available) -> None:
    """The other 21 languages are byte-identical to upstream."""
    for path in sorted((ROOT / LANG_DIR).glob("*.json")):
        if path.name == "en.json":
            continue
        rel = f"{LANG_DIR}/{path.name}"
        assert path.read_bytes() == _head(rel), f"{path.name} changed"


def test_service_field_keys_unchanged(git_available) -> None:
    """Backend translation keys (service fields) stay as upstream + create_backup."""
    rel = "custom_components/alarmo/translations/en.json"
    old = json.loads(_head(rel))
    new = json.loads((ROOT / rel).read_text(encoding="utf-8"))
    added = set(_keys(new)) - set(_keys(old))
    assert set(_keys(old)) <= set(_keys(new))
    assert all(
        k.startswith(("services.create_backup.", "services.set_house_mode."))
        for k in added
    ), added
