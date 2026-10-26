"""Websocket commands for zone rules (admin only)."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.helpers import config_validation as cv
from homeassistant.components import websocket_api

from .ext_rules import RulesError, list_payload

DATA_EXT = "alarmo_ext"


def _mgr(hass):
    return hass.data[DATA_EXT].rules


def _err(connection, msg_id: int, err: Exception) -> None:
    if isinstance(err, RulesError):
        connection.send_error(msg_id, "invalid", "\n".join(err.errors))
    else:
        connection.send_error(msg_id, "unknown_error", str(err))


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/rules/list"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rules_list(hass, connection, msg):
    """Rules, overrides and the pending count."""
    connection.send_result(msg["id"], list_payload(_mgr(hass)))


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/rules/save", vol.Required("rule"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rules_save(hass, connection, msg):
    """Create (no id) or update (with id) a rule. Changes no zones."""
    try:
        rule = await _mgr(hass).async_save_rule(msg["rule"])
    except Exception as err:
        _err(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], rule)


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/rules/delete", vol.Required("rule_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rules_delete(hass, connection, msg):
    """Delete a rule. Zones keep their current values."""
    try:
        await _mgr(hass).async_delete_rule(msg["rule_id"])
    except Exception as err:
        _err(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"deleted": msg["rule_id"]})


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/rules/preview"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rules_preview(hass, connection, msg):
    """What applying the rules would change, plus sources and conflicts."""
    connection.send_result(msg["id"], _mgr(hass).preview())


@websocket_api.websocket_command(
    {vol.Required("type"): "alarmo/ext/rules/apply", vol.Required("token"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rules_apply(hass, connection, msg):
    """Back up, then write the previewed rule results."""
    try:
        result = await _mgr(hass).async_apply(msg["token"])
    except Exception as err:
        _err(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "alarmo/ext/overrides/list"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_overrides_list(hass, connection, msg):
    """Per-zone manual overrides."""
    connection.send_result(msg["id"], {"overrides": _mgr(hass).overrides})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "alarmo/ext/overrides/clear",
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("field"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_overrides_clear(hass, connection, msg):
    """Remove an override; the rule value comes back on the next apply."""
    try:
        await _mgr(hass).async_clear_override(msg["entity_id"], msg.get("field"))
    except Exception as err:
        _err(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"overrides": _mgr(hass).overrides})


RULE_COMMANDS = (
    ws_rules_list,
    ws_rules_save,
    ws_rules_delete,
    ws_rules_preview,
    ws_rules_apply,
    ws_overrides_list,
    ws_overrides_clear,
)
