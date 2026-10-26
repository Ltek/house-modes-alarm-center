// Unit tests for src/data/ext-tabs.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TABS, tabForPath, isEditorPath } from '../src/data/ext-tabs.ts';

test('tab order and sections', () => {
  assert.deepEqual(
    TABS.map(t => t.id),
    ['general', 'house', 'why', 'partitions', 'zones', 'zones_legacy', 'codes', 'notifications', 'actions', 'panel', 'activity', 'backup']
  );
  assert.equal(TABS.find(t => t.id === 'partitions').view, 'general');
  assert.equal(TABS.find(t => t.id === 'notifications').section, 'notifications');
  assert.equal(TABS.find(t => t.id === 'zones').view, 'sensor_table');
  assert.equal(TABS.find(t => t.id === 'zones_legacy').view, 'sensors');
});

test('plain pages map to their tab; empty page is General', () => {
  for (const t of TABS) assert.equal(tabForPath(t.id).id, t.id);
  assert.equal(tabForPath(undefined).id, 'general');
  assert.equal(tabForPath('nope'), undefined);
});

test('old addresses still work', () => {
  assert.equal(tabForPath('sensors').id, 'zones_legacy');
  assert.equal(tabForPath('sensors', undefined, { edit: 'binary_sensor.x' }).id, 'zones_legacy');
  assert.equal(tabForPath('sensor_table').id, 'zones');
  assert.equal(tabForPath('modes').id, 'partitions');
  assert.equal(tabForPath('mirrors').id, 'panel');
  assert.equal(tabForPath('ha_zones').id, 'panel');
  assert.equal(tabForPath('connections').id, 'codes');
});

test('upstream editors highlight the right tab', () => {
  assert.equal(tabForPath('general', undefined, { edit_area: '123' }).id, 'partitions');
  assert.equal(tabForPath('general', 'mqtt_configuration').id, 'general');
  assert.equal(tabForPath('actions', 'new_notification').id, 'notifications');
  assert.equal(tabForPath('actions', undefined, { edit_notification: '1' }).id, 'notifications');
  assert.equal(tabForPath('actions', 'new_action').id, 'actions');
  assert.equal(tabForPath('actions', undefined, { edit_action: '1' }).id, 'actions');
  assert.equal(tabForPath('actions', undefined, { area: '1' }).id, 'actions');
});

test('isEditorPath', () => {
  assert.equal(isEditorPath(undefined, {}), false);
  assert.equal(isEditorPath('new_action', {}), true);
  assert.equal(isEditorPath(undefined, { edit_area: '1' }), true);
});
