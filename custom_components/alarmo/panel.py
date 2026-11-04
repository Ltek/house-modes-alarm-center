"""Panel registration for Alarmo integration."""

import os
import logging

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig

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
    """ext: serve the dashboard card and load it on every dashboard (once per HA run)."""
    card = os.path.join(panel_dir, CARD_FILENAME)
    if not os.path.exists(card):
        return
    try:
        bust = int(os.path.getmtime(card))
    except OSError:
        bust = 0
    url = f"{CARD_URL}?v={VERSION}&m={bust}"
    data = hass.data.setdefault("alarmo_ext_card", {})
    if not data.get("static"):
        await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, card, cache_headers=False)])
        data["static"] = True
    if data.get("url") != url:
        if data.get("url"):
            frontend.remove_extra_js_url(hass, data["url"])
        frontend.add_extra_js_url(hass, url)
        data["url"] = url


def async_unregister_panel(hass):
    """Unregister the panel."""
    frontend.async_remove_panel(hass, DOMAIN)
    _LOGGER.debug("Removing panel")
