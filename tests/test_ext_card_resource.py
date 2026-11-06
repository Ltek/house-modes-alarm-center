"""The dashboard card is added as a Dashboard resource, updated on a new build, and never duplicated."""

from typing import Any

from homeassistant.setup import async_setup_component
from homeassistant.components.lovelace.const import LOVELACE_DATA

from custom_components.alarmo.const import CARD_URL
from custom_components.alarmo.panel import _register_resource


async def test_card_resource(hass: Any) -> None:
    """Created once, URL updated in place, extra copies (e.g. a manual one) removed."""
    assert await async_setup_component(hass, "lovelace", {})
    res = hass.data[LOVELACE_DATA].resources
    assert await _register_resource(hass, f"{CARD_URL}?v=1&m=1")
    assert [i["url"] for i in res.async_items()] == [f"{CARD_URL}?v=1&m=1"]
    await res.async_create_item({"res_type": "module", "url": f"{CARD_URL}?old"})
    await res.async_create_item({"res_type": "module", "url": "/local/other-card.js"})
    assert await _register_resource(hass, f"{CARD_URL}?v=2&m=2")
    urls = sorted(i["url"] for i in res.async_items())
    assert urls == sorted([f"{CARD_URL}?v=2&m=2", "/local/other-card.js"])


async def test_card_resource_yaml_mode(hass: Any) -> None:
    """Resources in YAML mode are read-only: the caller falls back to an extra frontend module."""
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"mode": "yaml", "resources": []}})
    assert not await _register_resource(hass, f"{CARD_URL}?v=1")
