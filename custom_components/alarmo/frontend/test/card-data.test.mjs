// Unit tests for the dashboard card's helpers (card/src/data.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { borderColor, keypadKeys, lcdLines, linkFor, resultMessage, visibleModes } from '../card/src/data.ts';

const data = {
  house: { enabled: true, shadow: false, select_entity: 'select.alarmo_house_mode', current: 'stay', previous: null, changed_at: null, source: null, last_result: null,
    modes: [{ id: 'stay', name: 'Stay', icon: 'mdi:home', color: '#ff9800' }, { id: 'spa', name: 'Spa', icon: 'mdi:hot-tub', color: '#00bcd4' }] },
  alarms: [], keypad: { allowed: true, reason: '', blocked_keys: '' },
  links: [{ key: '1', alarm_entity: 'alarm_control_panel.master', panel_entity: 'alarm_control_panel.p1', panel_type: 'envisalink', keypad_entity: 'sensor.k', ready_entity: 'binary_sensor.r', mode: 'live' }],
};

test('border: alarm, delay, armed in the mode colour, ready / not ready', () => {
  assert.equal(borderColor('triggered', 'disarmed', 'on'), '#f44336');
  assert.equal(borderColor('disarmed', 'triggered', 'on'), '#f44336');
  assert.equal(borderColor('arming', 'disarmed', 'on'), '#ff9800');
  assert.equal(borderColor('armed_home', 'armed_home', 'off', '#5c6bc0'), '#5c6bc0');
  assert.equal(borderColor('disarmed', 'disarmed', 'on'), '#4caf50');
  assert.equal(borderColor('disarmed', 'disarmed', 'off'), '#ff9800');
  assert.equal(borderColor(undefined, undefined, undefined), 'var(--divider-color)');
});

test('panel display, keys, links, hidden modes', () => {
  assert.deepEqual(lcdLines('****DISARMED****  Ready to Arm  '), ['****DISARMED****', '  Ready to Arm']);
  assert.deepEqual(lcdLines(null), ['', '']);
  assert.deepEqual(keypadKeys()[5], ['6', 'BYPASS']);
  assert.deepEqual(keypadKeys({ 6: 'BYP' })[5], ['6', 'BYP']);
  assert.equal(linkFor(data, 'alarm_control_panel.other').panel_entity, 'alarm_control_panel.p1');
  assert.deepEqual(visibleModes(data, ['spa']).map(m => m.id), ['stay']);
  assert.deepEqual(visibleModes(data, ['Stay']).map(m => m.id), ['spa']);
});

test('messages after a House Mode button', () => {
  const name = e => ({ 'binary_sensor.d': 'Front Door' })[e] || e;
  assert.equal(resultMessage({ result: 'changed' }, name), null);
  assert.equal(resultMessage({ result: 'blocked', requested: 'Away', reason: 'Spa cannot be changed by manual' }, name), 'Away not set: Spa cannot be changed by manual');
  assert.equal(resultMessage({ result: 'not_ready', requested: 'Night', open: ['binary_sensor.d'] }, name), 'Night not set: open Front Door');
  assert.equal(resultMessage({ result: 'delayed', requested: 'Stay', minutes: 30 }, name), 'Stay in 30 min');
  assert.equal(resultMessage({ result: 'shadow', would: 'changed' }, name), null);
  assert.equal(resultMessage({ result: 'shadow', requested: 'Away', would: 'not_ready' }, name), 'Shadow: Away would be not ready');
});
