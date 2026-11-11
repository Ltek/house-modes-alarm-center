# ruff: noqa: E501
"""Dashboard card support: card data for every user, the panel keypad service, colors, clock-time timers."""

import os
import datetime as dt
from typing import Any

import pytest
from homeassistant.core import Context
from homeassistant.exceptions import ServiceValidationError
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

from tests.helpers import advance_time
from tests.test_ext_panel_link import GF, PANEL, _link, _save, _setup
from custom_components.house_modes.panel import async_register_panel
from custom_components.house_modes.house_config import normalize, timer_due, mode_color

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


def test_mode_color_and_clock_timer() -> None:
    """Colors default from the name; a timer at 01:00 fires at the next 01:00."""
    s = normalize({"modes": [
        {"id": "ln", "name": "Late Night", "timers": [{"at": "01:00", "then": "sleep"}]},
        {"id": "sleep", "name": "Sleep", "color": "midnightblue"},
    ]})
    assert mode_color(s["modes"][0]) == "#00bfff" and mode_color(s["modes"][1]) == "midnightblue"
    tz = dt.timezone(dt.timedelta(hours=-7))
    t = s["modes"][0]["timers"][0]
    assert timer_due(t, dt.datetime(2026, 11, 4, 23, 30, tzinfo=tz)) == dt.datetime(2026, 11, 5, 1, 0, tzinfo=tz).timestamp()
    assert timer_due(t, dt.datetime(2026, 11, 5, 0, 30, tzinfo=tz)) == dt.datetime(2026, 11, 5, 1, 0, tzinfo=tz).timestamp()
    with pytest.raises(Exception):
        normalize({"modes": [{"id": "a", "name": "A", "timers": [{"then": "a"}]}]})
    with pytest.raises(Exception):
        normalize({"modes": [{"id": "a", "name": "A", "color": "red; background:url(x)"}]})


async def test_card_data_for_ordinary_users(hass: Any, hass_storage: Any, hass_ws_client: Any, hass_read_only_access_token: str, tmp_path: Any) -> None:
    """A non-admin gets the modes, colors, link entities and whether the keypad is allowed (admins only by default)."""
    await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"))
    house = hass.data["house_modes_ext"].house
    await house.async_save_settings({"enabled": True, "run_mode": "shadow", "input_select": "input_select.sel",
                                     "modes": [{"id": "stay", "name": "Stay", "targets": {GF: "armed_home"}}]})
    client = await hass_ws_client(hass, hass_read_only_access_token)
    await client.send_json({"id": 1, "type": "house_modes/ext/card/get"})
    res = (await client.receive_json())["result"]
    assert res["house"]["modes"] == [{"id": "stay", "name": "Stay", "icon": "mdi:shield-home", "color": "#ffa500", "targets": {GF: "armed_home"}}]
    assert res["house"]["shadow"] and res["house"]["select_entity"] == "input_select.sel"
    assert res["house"]["display_entity"] == "input_select.sel"
    assert res["links"][0]["panel_entity"] == PANEL and res["links"][0]["mode"] == "shadow"
    assert res["keypad"]["allowed"] is False and "administrators" in res["keypad"]["reason"]


async def test_card_permissions_for_the_editor(hass: Any, hass_storage: Any, hass_ws_client: Any, hass_admin_user: Any,
                                              hass_read_only_access_token: str, tmp_path: Any) -> None:
    """Admins get who may use each section (names only); ordinary users are refused."""
    await _setup(hass, hass_storage, tmp_path)
    ext = hass.data["house_modes_ext"]
    ext.store.async_update_config({"code_arm_required": False, "code_disarm_required": True})
    ext.store.async_create_user({"name": "Ann", "code": "1234", "can_arm": True, "can_disarm": True})
    ext.store.async_create_user({"name": "Bob", "code": "5678", "can_arm": True, "can_disarm": False})
    ext.store.async_create_user({"name": "Off", "code": "9999", "can_arm": True, "can_disarm": True, "enabled": False})
    await _save(hass, **_link("shadow"), keypad_input={"mode": "users", "users": [hass_admin_user.id], "blocked_keys": ""})
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "house_modes/ext/card/permissions"})
    res = (await client.receive_json())["result"]
    a = res["alarm"]
    assert not a["arm_code"] and a["disarm_code"]
    assert "Ann" in a["disarm_users"] and "Ann" in a["arm_users"]
    assert "Off" not in a["arm_users"]  # disabled users are left out
    assert a["disarm_users"].count("Bob") < a["arm_users"].count("Bob")  # the new Bob may arm, not disarm
    assert "1234" not in str(res)
    assert res["keypad"] == {"mode": "users", "users": [hass_admin_user.name]}
    ro = await hass_ws_client(hass, hass_read_only_access_token)
    await ro.send_json({"id": 1, "type": "house_modes/ext/card/permissions"})
    assert (await ro.receive_json())["success"] is False


async def test_last_result_on_the_select(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """A blocked change is visible to cards as last_result."""
    await _setup(hass, hass_storage, tmp_path)
    house = hass.data["house_modes_ext"].house
    await house.async_save_settings({"enabled": True, "modes": [
        {"id": "d", "name": "Disarmed", "targets": {GF: "disarmed"}},
        {"id": "v", "name": "Vacation", "targets": {GF: "armed_away"}, "enter_sources": ["manual"]},
    ]})
    await advance_time(hass, 5)
    res = await house.async_set_mode("Vacation", "schedule")
    assert res["result"] == "blocked"
    await hass.async_block_till_done()
    last = hass.states.get("select.house_mode").attributes["last_result"]
    assert last["result"] == "blocked" and last["requested"] == "Vacation" and last["source"] == "schedule"


async def test_panel_keypress_checks_the_user(hass: Any, hass_storage: Any, tmp_path: Any, hass_admin_user: Any, hass_read_only_user: Any) -> None:
    """Admins pass by default, other users are refused; 'users' mode, blocked keys, off; automations pass."""
    calls = await _setup(hass, hass_storage, tmp_path)
    await _save(hass, **_link("shadow"))

    async def press(keys, user=None):
        await hass.services.async_call("house_modes", "panel_keypress", {"keys": keys}, blocking=True,
                                       context=Context(user_id=user.id) if user else None)

    await press("*", hass_admin_user)
    assert calls["keypress"][-1].data == {"entity_id": PANEL, "keypress": "*"}
    with pytest.raises(ServiceValidationError, match="administrators only"):
        await press("1", hass_read_only_user)
    await _save(hass, **_link("shadow"), keypad_input={"mode": "users", "users": [hass_read_only_user.id], "blocked_keys": "6"})
    await press("12343", hass_read_only_user)
    with pytest.raises(ServiceValidationError, match="key\\(s\\) 6"):
        await press("12346", hass_read_only_user)
    await _save(hass, **_link("shadow"), keypad_input={"mode": "off"})
    with pytest.raises(ServiceValidationError, match="turned off"):
        await press("1", hass_admin_user)
    await press("1")  # an automation (no user)
    assert len(calls["keypress"]) == 3
    log = [e["text"] for e in (hass.data["house_modes_ext"].recorder.current or {}).get("entries", [])]
    assert not any("12343" in t for t in log)  # digits are masked


async def test_card_is_served(hass: Any, hass_storage: Any, hass_client_no_auth: Any, tmp_path: Any) -> None:
    """The card file is served without login and added as a Dashboard resource (or, without one, an extra module)."""
    await _setup(hass, hass_storage, tmp_path)
    dist = os.path.join(hass.config.path("custom_components"), "house_modes", "frontend", "dist")
    os.makedirs(dist, exist_ok=True)
    for name in ("house-modes-panel.js", "house-modes-alarm-center-card.js"):
        with open(os.path.join(dist, name), "w", encoding="utf-8") as fh:
            fh.write("export const x = 1;\n")
    hass.data.pop("house_modes_ext_card", None)
    await async_register_panel(hass)
    from homeassistant.components.lovelace.const import LOVELACE_DATA  # noqa: PLC0415

    ll = hass.data.get(LOVELACE_DATA)
    if ll is not None and hasattr(ll.resources, "async_create_item"):
        urls = [i["url"] for i in ll.resources.async_items()]
        assert len(urls) == 1
        url = urls[0]
        assert not hass.data["house_modes_ext_card"].get("url")
    else:
        url = hass.data["house_modes_ext_card"]["url"]
        assert url in hass.data[DATA_EXTRA_MODULE_URL].urls
    assert url.startswith("/house_modes_ext/house-modes-alarm-center-card.js?v=")
    client = await hass_client_no_auth()
    res = await client.get(url)
    assert res.status == 200 and "export const x" in await res.text()


async def test_changing_to_while_a_change_runs(hass: Any, hass_storage: Any, tmp_path: Any) -> None:
    """changing_to names the target while the partitions are being set, then clears."""
    await _setup(hass, hass_storage, tmp_path)
    house = hass.data["house_modes_ext"].house
    await house.async_save_settings({"enabled": True, "modes": [
        {"id": "d", "name": "Disarmed", "targets": {GF: "disarmed"}},
        {"id": "s", "name": "Stay", "targets": {GF: "armed_home"}},
    ]})
    await advance_time(hass, 5)
    seen = []
    orig = house._apply

    async def spy(target, source):
        seen.append(house.changing_to)
        return await orig(target, source)

    house._apply = spy
    await house.async_set_mode("Stay", "manual")
    assert seen == ["Stay"] and house.changing_to is None
    assert "changing_to" in hass.states.get("select.house_mode").attributes
