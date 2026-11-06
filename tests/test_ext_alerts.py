"""Smart Alerts on the Notifications tab: the blueprint is installed safely, and its automations are listed."""

import os
from typing import Any

import pytest
from homeassistant.setup import async_setup_component

from tests.ext_helpers import setup_real_alarmo
from custom_components.alarmo.ext_alerts import SHIPPED, summary, blueprint_status, install_blueprint

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


async def test_install_and_list(hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any) -> None:
    """Installs into blueprints/automation/LTek/, refuses to replace someone else's file, lists the automations."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    hass.config.config_dir = str(tmp_path)
    assert blueprint_status(hass)["installed"] is False
    st = await hass.async_add_executor_job(install_blueprint, hass)
    assert st["installed"] and st["ours"] and st["installed_version"] == st["shipped_version"] and not st["update"]
    target = tmp_path / "blueprints" / "automation" / "LTek" / "smart-alerts-ltek.yaml"
    target.write_text("blueprint:\n  name: someone else's\n")
    try:
        await hass.async_add_executor_job(install_blueprint, hass)
        raise AssertionError("replaced a file that is not ours")
    except ValueError:
        pass
    await hass.async_add_executor_job(install_blueprint, hass, True)
    assert os.path.getsize(target) == os.path.getsize(SHIPPED)

    assert await async_setup_component(hass, "automation", {"automation": [
        {"id": "a1", "alias": "Front Door", "use_blueprint": {"path": "LTek/smart-alerts-ltek.yaml", "input": {
            "alert_trigger": [{"trigger": "state", "entity_id": "binary_sensor.front_door", "to": "on"}],
            "repeat_notification": True, "test_mode": True}}},
        {"id": "a2", "alias": "Plain", "triggers": [], "actions": []},
    ]})
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/alerts/get"})
    res = (await client.receive_json())["result"]
    assert [i["name"] for i in res["items"]] == ["Front Door"]
    item = res["items"][0]
    assert item["edit_id"] == "a1" and item["old"] is None
    assert item["summary"]["triggers"] == ["binary_sensor.front_door"] and item["summary"]["test_mode"]


def test_summary() -> None:
    """The list summary reads triggers, targets, camera and critical from the inputs."""
    s = summary({"alert_trigger": [{"trigger": "moisture.detected", "target": {"label_id": "leak"}},
                                   {"trigger": "state", "entity_id": ["binary_sensor.a", "binary_sensor.b"]},
                                   {"trigger": "time", "at": "20:00"}],
                 "notify_device": ["d1", "d2"], "notify_services": ["family"], "camera": "camera.patio",
                 "notification_interruption_level": "critical"})
    assert s["triggers"] == ["label leak", "binary_sensor.a", "binary_sensor.b", "time"]
    assert s["devices"] == 2 and s["services"] == 1 and s["camera"] == "camera.patio" and s["critical"]
