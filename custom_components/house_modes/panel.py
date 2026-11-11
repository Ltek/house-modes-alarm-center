# Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
"""Panel registration for House Modes & Alarm Center integration."""

import os
import logging

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig

from . import legacy
from .const import (
    DOMAIN,
    VERSION,
    CARD_URL,
    PANEL_URL,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_TITLE,
    PANEL_FOLDER,
    CARD_FILENAME,
    PANEL_FILENAME,
    CUSTOM_COMPONENTS,
    INTEGRATION_FOLDER,
)

_LOGGER = logging.getLogger(__name__)

# where the Alarmo-based build served the same card
OLD_CARD_URL = "/alarmo_ext/house-modes-alarm-center-card.js"


async def async_register_panel(hass):
    """Register the panel."""
    root_dir = os.path.join(hass.config.path(CUSTOM_COMPONENTS), INTEGRATION_FOLDER)
    panel_dir = os.path.join(root_dir, PANEL_FOLDER)
    view_url = os.path.join(panel_dir, PANEL_FILENAME)

    try:
        cache_bust = int(os.path.getmtime(view_url))
    except OSError:
        cache_bust = 0

    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_URL, view_url, cache_headers=False)]
    )

    await _register_card(hass, panel_dir)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_NAME,
        frontend_url_path=DOMAIN,
        module_url=f"{PANEL_URL}?v={VERSION}&m={cache_bust}",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=True,
        config={},
        config_panel_domain=DOMAIN,
    )


async def _register_card(hass, panel_dir: str) -> None:
    """ext: serve the dashboard card and load it on every dashboard.

    The card is added as a Dashboard resource (Settings → Dashboards → Resources), the way cards normally load, and
    its URL is updated when the build changes. Dashboards in YAML mode have read-only resources: there the card is
    loaded as an extra frontend module instead.
    """
    card = os.path.join(panel_dir, CARD_FILENAME)
    if not os.path.exists(card):
        return
    try:
        bust = int(os.path.getmtime(card))
    except OSError:
        bust = 0
    url = f"{CARD_URL}?v={VERSION}&m={bust}"
    data = hass.data.setdefault("house_modes_ext_card", {})
    if not data.get("static"):
        await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, card, cache_headers=False)])
        data["static"] = True
    try:
        as_resource = await _register_resource(hass, url)
    except Exception as err:
        _LOGGER.warning("Could not add the dashboard card as a resource (%s); loading it as a frontend module", err)
        as_resource = False
    if as_resource:
        if data.get("url"):
            frontend.remove_extra_js_url(hass, data["url"])
            data["url"] = None
        return
    if data.get("url") != url:
        if data.get("url"):
            frontend.remove_extra_js_url(hass, data["url"])
        frontend.add_extra_js_url(hass, url)
        data["url"] = url


async def _register_resource(hass, url: str) -> bool:
    """Add or update the card's Dashboard resource. False when resources are not editable (YAML mode)."""
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA  # noqa: PLC0415
        from homeassistant.components.lovelace.resources import ResourceStorageCollection  # noqa: PLC0415
    except ImportError:
        return False
    ll = hass.data.get(LOVELACE_DATA)
    res = getattr(ll, "resources", None)
    if not isinstance(res, ResourceStorageCollection):
        return False
    if not res.loaded:
        await res.async_load()
        res.loaded = True
    ours = [i for i in res.async_items() if str(i.get("url", "")).split("?", 1)[0] == CARD_URL]
    if not ours:
        await res.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Added the dashboard card as a resource: %s", url)
    else:
        first, *extra = ours
        if first.get("url") != url or first.get("type") != "module":
            await res.async_update_item(first["id"], {"res_type": "module", "url": url})
            _LOGGER.info("Updated the dashboard card resource: %s", url)
        for item in extra:
            await res.async_delete_item(item["id"])
    # the Alarmo-based build's copy of the same card: it no longer loads once Alarmo is disabled (Alarmo adds it
    # back itself if it is enabled again)
    if not legacy.old_alarmo_active(hass):
        for item in [i for i in res.async_items() if str(i.get("url", "")).split("?", 1)[0] == OLD_CARD_URL]:
            await res.async_delete_item(item["id"])
            _LOGGER.info("Removed the Alarmo build's card resource: %s", item.get("url"))
    return True


def async_unregister_panel(hass):
    """Unregister the panel."""
    frontend.async_remove_panel(hass, DOMAIN)
    _LOGGER.debug("Removing panel")
