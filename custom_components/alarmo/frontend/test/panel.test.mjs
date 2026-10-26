// Unit tests for src/data/panel.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newLink, parseStates, formatStates, settingsWarnings, tripPolicy } from '../src/data/panel.ts';

const base = () => ({ links: {}, monitored: false, notify_service: null, trip: { method: 'siren', entity: 'siren.x', panic_method: 'service', panic_keys: '' }, zone_trip: {}, mirrors: {} });

test('newLink picks the Envisalink type and safe defaults', () => {
  const l = newLink('alarm_control_panel.p', 'envisalink_new');
  assert.equal(l.panel_type, 'envisalink');
  assert.equal(l.mode, 'shadow');
  assert.equal(newLink('alarm_control_panel.p', 'qolsys').panel_type, 'generic');
});

test('states parse and format', () => {
  assert.deepEqual(parseStates('armed_home, armed_night  bogus,disarmed'), ['armed_home', 'armed_night', 'disarmed']);
  assert.equal(formatStates(['a', 'b']), 'a, b');
});

test('warnings: missing panel, missing code, missing siren', () => {
  const s = base();
  s.links = { master: newLink('alarm_control_panel.p', 'envisalink_new') };
  assert.match(settingsWarnings(s, [])[0], /not found/);
  const panels = [{ entity_id: 'alarm_control_panel.p', platform: 'envisalink_new', name: 'p', state: 'disarmed', code_set: false, zones: [] }];
  assert.match(settingsWarnings(s, panels)[0], /default code/);
  panels[0].code_set = true;
  assert.deepEqual(settingsWarnings(s, panels), []);
  s.trip.entity = null;
  assert.match(settingsWarnings(s, panels)[0], /siren entity/);
});

test('trip policy mirrors the backend', () => {
  const s = base();
  assert.equal(tripPolicy(s, 'binary_sensor.x'), 'panel');
  s.monitored = true;
  assert.equal(tripPolicy(s, 'binary_sensor.x'), 'notify');
  s.zone_trip['binary_sensor.x'] = 'none';
  assert.equal(tripPolicy(s, 'binary_sensor.x'), 'none');
});

test('zoneKind groups device classes for "Create mirror for"', async () => {
  const { zoneKind, MIRROR_TYPES } = await import('../src/data/panel.ts');
  assert.equal(zoneKind('window'), 'window');
  assert.equal(zoneKind('garage_door'), 'door');
  assert.equal(zoneKind('occupancy'), 'motion');
  assert.equal(zoneKind('smoke'), '');
  assert.equal(zoneKind(null), '');
  assert.deepEqual(MIRROR_TYPES.map(t => t.id), ['door', 'window', 'motion']);
});
