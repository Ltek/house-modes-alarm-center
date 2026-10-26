"""Task 4: zone rules resolver (pure; no Home Assistant needed)."""

import pytest
import voluptuous as vol

from custom_components.alarmo.zone_rules import (
    RULE_SCHEMA,
    EntityCtx,
    matches,
    resolve,
    specificity,
    stale_references,
    diff_against_store,
)

P1, P2 = "1700000001", "1700000002"
PARTS = {P1, P2}
KNOWN = {
    "labels": {"perimeter", "interior", "door", "upstairs_ok"},
    "areas": {"garage", "kitchen", "bedroom"},
    "floors": {"ground", "second"},
}


def rule(rid, *, labels=(), areas=(), floors=(), enabled=True, order=0, **sets):
    """Build a validated rule."""
    return RULE_SCHEMA(
        {
            "id": rid,
            "name": rid,
            "enabled": enabled,
            "order": order,
            "match": {
                "labels": list(labels),
                "areas": list(areas),
                "floors": list(floors),
            },
            "set": sets,
        }
    )


def ctx(eid, labels=(), area=None, floor=None, dc=None, exists=True):
    """Build an entity context."""
    return EntityCtx(eid, set(labels), area, floor, dc, exists)


def sensor(eid, area=P1, modes=(), **kw):
    """Minimal stored sensor."""
    return {"entity_id": eid, "area": area, "type": "door", "modes": list(modes), **kw}


WIN = "binary_sensor.kitchen_window"
MOT = "binary_sensor.bedroom_motion"
GAR = "cover.gdo1_garage_door"


def test_schema_rejects_empty_match_and_set() -> None:
    """A rule needs a condition and something to set."""
    with pytest.raises(vol.Invalid):
        rule("x", modes=["armed_away"])
    with pytest.raises(vol.Invalid):
        rule("x", labels=["door"])
    with pytest.raises(vol.Invalid):
        rule("x", labels=["door"], modes=["armed_party"])
    with pytest.raises(vol.Invalid):
        RULE_SCHEMA({"name": "x", "match": {"labels": ["a"]}, "set": {"label": 1}})


def test_specificity() -> None:
    """Labels count one each; areas and floors one per group."""
    assert specificity(rule("a", labels=["a", "b"], areas=["x", "y"], type="door")) == 3
    assert specificity(rule("a", floors=["g"], type="door")) == 1


@pytest.mark.parametrize(
    ("r", "c", "expected"),
    [
        (rule("l", labels=["perimeter"], type="door"), ctx(WIN, ["perimeter"]), True),
        (
            rule("l", labels=["perimeter", "door"], type="door"),
            ctx(WIN, ["perimeter"]),
            False,
        ),
        (
            rule("a", areas=["kitchen", "garage"], type="door"),
            ctx(WIN, area="kitchen"),
            True,
        ),
        (rule("a", areas=["garage"], type="door"), ctx(WIN, area="kitchen"), False),
        (rule("f", floors=["ground"], type="door"), ctx(WIN, floor="ground"), True),
        (
            rule("la", labels=["interior"], floors=["second"], type="door"),
            ctx(MOT, ["interior"], "bedroom", "ground"),
            False,
        ),
        (
            rule("d", labels=["perimeter"], enabled=False, type="door"),
            ctx(WIN, ["perimeter"]),
            False,
        ),
        # stale label is ignored: the remaining area condition decides
        (
            rule("s", labels=["gone"], areas=["kitchen"], type="door"),
            ctx(WIN, area="kitchen"),
            True,
        ),
        # only stale references: never matches
        (rule("s", labels=["gone"], type="door"), ctx(WIN, ["gone"]), False),
    ],
)
def test_matches(r, c, expected) -> None:
    """Label = all, area/floor = any, stale references ignored."""
    assert matches(r, c, KNOWN) is expected


def test_modes_union_and_label_area_beats_label() -> None:
    """Modes add up; Label+Area beats Label for single values."""
    rules = [
        rule(
            "perim",
            labels=["perimeter"],
            modes=["armed_home", "armed_night"],
            type="window",
        ),
        rule("away", labels=["perimeter"], modes=["armed_away"]),
        rule(
            "kitchen",
            labels=["perimeter"],
            areas=["kitchen"],
            type="door",
            use_entry_delay=False,
        ),
        rule("part", areas=["kitchen"], partition=P2),
    ]
    out = resolve(
        {WIN: ctx(WIN, ["perimeter"], "kitchen", "ground", "window")},
        rules,
        {},
        {WIN: sensor(WIN)},
        PARTS,
        KNOWN,
    )
    z = out["zones"][WIN]
    assert z["values"]["modes"] == ["armed_away", "armed_home", "armed_night"]
    assert z["values"]["type"] == "door"
    assert z["sources"]["type"] == {"kind": "rule", "rules": ["kitchen"]}
    assert z["values"]["use_entry_delay"] is False
    assert z["values"]["area"] == P2
    assert not z["conflicts"]
    assert sorted(z["rules"]) == ["away", "kitchen", "part", "perim"]


def test_equal_specificity_conflict_not_applied() -> None:
    """Two equally specific rules disagreeing -> conflict, value left alone."""
    rules = [
        rule("a", labels=["perimeter"], partition=P1),
        rule("b", labels=["door"], partition=P2),
    ]
    out = resolve(
        {WIN: ctx(WIN, ["perimeter", "door"])},
        rules,
        {},
        {WIN: sensor(WIN)},
        PARTS,
        KNOWN,
    )
    z = out["zones"][WIN]
    assert "area" not in z["values"]
    assert z["conflicts"] == [
        {"field": "area", "rules": ["a", "b"], "values": [P1, P2]}
    ]


def test_same_value_from_equal_rules_is_not_a_conflict() -> None:
    """Agreement is fine."""
    rules = [
        rule("a", labels=["perimeter"], type="door"),
        rule("b", labels=["door"], type="door"),
    ]
    z = resolve(
        {WIN: ctx(WIN, ["perimeter", "door"])},
        rules,
        {},
        {WIN: sensor(WIN)},
        PARTS,
        KNOWN,
    )["zones"][WIN]
    assert z["values"]["type"] == "door" and not z["conflicts"]


def test_unknown_partition_is_a_conflict() -> None:
    """A rule pointing at a deleted partition is reported, not applied."""
    z = resolve(
        {WIN: ctx(WIN, ["perimeter"])},
        [rule("a", labels=["perimeter"], partition="999")],
        {},
        {WIN: sensor(WIN)},
        PARTS,
        KNOWN,
    )["zones"][WIN]
    assert z["conflicts"][0]["reason"] == "partition does not exist"


def test_override_wins_and_clears_conflict() -> None:
    """A manual override beats rules (and resolves a conflict on that field)."""
    rules = [
        rule("a", labels=["perimeter"], partition=P1, modes=["armed_away"]),
        rule("b", labels=["door"], partition=P2),
    ]
    ovr = {WIN: {"area": P2, "modes": ["armed_night"]}}
    z = resolve(
        {WIN: ctx(WIN, ["perimeter", "door"])},
        rules,
        ovr,
        {WIN: sensor(WIN)},
        PARTS,
        KNOWN,
    )["zones"][WIN]
    assert z["values"]["area"] == P2
    assert z["values"]["modes"] == ["armed_night"]
    assert z["sources"]["modes"] == {"kind": "override", "rules": ["a"]}
    assert not z["conflicts"]


def test_new_zone_needs_partition() -> None:
    """Unconfigured matching entities become new zones only with a partition."""
    rules = [rule("perim", labels=["perimeter"], modes=["armed_away"])]
    c = {
        WIN: ctx(WIN, ["perimeter"], dc="window"),
        GAR: ctx(GAR, ["perimeter"], "garage"),
        "light.x": ctx("light.x", ["perimeter"]),  # not a zone domain
    }
    out = resolve(c, rules, {}, {}, PARTS, KNOWN)
    assert sorted(out["needs_partition"]) == sorted([GAR, WIN])
    rules.append(rule("part", areas=["garage"], partition=P1))
    out = resolve(c, rules, {}, {}, PARTS, KNOWN)
    assert out["needs_partition"] == [WIN]
    g = out["zones"][GAR]
    assert g["new"] and g["values"] == {
        "modes": ["armed_away"],
        "area": P1,
        "type": "door",
    }


def test_missing_entity_still_resolved_for_configured_zone() -> None:
    """A configured zone whose entity is gone keeps its override, flagged as missing."""
    out = resolve({}, [], {MOT: {"enabled": False}}, {MOT: sensor(MOT)}, PARTS, KNOWN)
    z = out["zones"][MOT]
    assert (
        z["exists"] is False and z["values"] == {"enabled": False} and not z["managed"]
    )


def test_unmatched_configured_zones_are_left_alone() -> None:
    """Rules never touch or delete zones they don't match."""
    out = resolve({MOT: ctx(MOT)}, [], {}, {MOT: sensor(MOT)}, PARTS, KNOWN)
    assert out["zones"] == {}
    d = diff_against_store(out, {MOT: sensor(MOT)})
    assert d == {"create": [], "update": [], "unmanaged": [MOT]}


def test_diff_only_real_changes() -> None:
    """Mode order does not count as a change."""
    rules = [
        rule(
            "r", labels=["perimeter"], modes=["armed_night", "armed_away"], type="door"
        )
    ]
    s = {WIN: sensor(WIN, modes=["armed_away", "armed_night"])}
    out = resolve({WIN: ctx(WIN, ["perimeter"])}, rules, {}, s, PARTS, KNOWN)
    assert diff_against_store(out, s)["update"] == []
    s[WIN]["type"] = "window"
    assert diff_against_store(out, s)["update"] == [
        {"entity_id": WIN, "changes": {"type": "door"}}
    ]


def test_stale_references_listed() -> None:
    """Deleted labels/areas/floors are reported per rule."""
    r = [rule("r", labels=["gone", "door"], floors=["attic"], type="door")]
    assert stale_references(r, KNOWN) == [
        {"rule": "r", "name": "r", "kind": "labels", "ref": "gone"},
        {"rule": "r", "name": "r", "kind": "floors", "ref": "attic"},
    ]
