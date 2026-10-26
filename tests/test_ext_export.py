"""Task 2: full YAML export."""

from typing import Any

import attr
import yaml
import pytest

from tests.ext_helpers import setup_real_alarmo, load_fixture_envelope
from custom_components.alarmo import yaml_io

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


def test_validation_schemas_match_upstream_fields() -> None:
    """Every schema accepts exactly the fields of the attrs class it mirrors."""
    for name, (schema, cls) in yaml_io.SCHEMA_CLASSES.items():
        keys = {str(k) for k in schema.schema}
        fields = {f.name for f in attr.fields(cls)}
        if name == "users":
            keys.discard("is_admin")  # legacy key upstream strips on load
        assert keys == fields, f"{name}: schema {keys ^ fields} differ from {cls}"


async def test_export_round_trips_store_data(
    hass: Any, hass_storage: Any, hass_ws_client: Any, tmp_path: Any
) -> None:
    """The export contains exactly what is stored, with a versioned header."""
    env = load_fixture_envelope()
    await setup_real_alarmo(hass, hass_storage, tmp_path, env)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "alarmo/ext/export"})
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["file_name"].startswith("alarmo_export_")
    text = msg["result"]["content"]
    assert text.startswith("# Alarmo configuration export")
    doc = yaml.safe_load(text)
    assert doc["alarmo_export_version"] == 1
    assert doc["storage_version"] == "6.3"
    from custom_components.alarmo import const  # noqa: PLC0415

    assert doc["alarmo_version"] == const.VERSION and doc["based_on_alarmo"] == "1.10.19"
    assert doc["data"] == env["data"]
    # key order is stable: header first, then sections in storage order
    assert list(doc) == [
        "alarmo_export_version",
        "alarmo_version",
        "based_on_alarmo",
        "storage_version",
        "exported_at",
        "data",
        "extras",
    ]
    assert list(doc["data"]) == list(yaml_io.SECTIONS)


async def test_export_requires_admin(
    hass: Any,
    hass_storage: Any,
    hass_ws_client: Any,
    hass_read_only_access_token: str,
    tmp_path: Any,
) -> None:
    """Non-admin users cannot export (the file contains code hashes)."""
    await setup_real_alarmo(hass, hass_storage, tmp_path)
    client = await hass_ws_client(hass, hass_read_only_access_token)
    for i, cmd in enumerate(
        [
            {"type": "alarmo/ext/export"},
            {"type": "alarmo/ext/backup/list"},
            {"type": "alarmo/ext/backup/create"},
            {"type": "alarmo/ext/import/preview", "content": "x", "mode": "merge"},
            {"type": "alarmo/ext/sensors/apply_changes", "delete": ["binary_sensor.x"]},
        ],
        start=1,
    ):
        await client.send_json({"id": i, **cmd})
        msg = await client.receive_json()
        assert not msg["success"]
        assert msg["error"]["code"] == "unauthorized"
