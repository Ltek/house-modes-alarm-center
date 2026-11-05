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

test('border: alarm, delay, armed in the mode color, ready / not ready', () => {
  assert.equal(borderColor('triggered', 'disarmed', 'on'), '#f44336');
  assert.equal(borderColor('disarmed', 'triggered', 'on'), '#f44336');
  assert.equal(borderColor('arming', 'disarmed', 'on'), '#ff9800');
  assert.equal(borderColor('armed_home', 'armed_home', 'off', '#5c6bc0'), '#5c6bc0');
  assert.equal(borderColor('disarmed', 'disarmed', 'on'), '#4caf50');
  assert.equal(borderColor('disarmed', 'disarmed', 'off'), '#ff9800');
  assert.equal(borderColor(undefined, undefined, undefined), 'var(--divider-color)');
});

test('panel display, keys, links, hidden modes', () => {
  assert.deepEqual(lcdLines('****DISARMED****  Ready to Arm  '), ['****DISARMED****', 'Ready to Arm']);
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

import { styleVars, pruneStyles, armColors } from '../card/src/data.ts';

test('style variables: only what is set, safe values', () => {
  assert.equal(styleVars(undefined), '');
  assert.equal(styleVars({ mode_name: { size: 30, weight: 700, font: 'serif', italic: false, caps: false, color: 'var(--accent-color)' } }),
    '--hmac-mode-name-size:30px;--hmac-mode-name-weight:700;--hmac-mode-name-color:var(--accent-color);--hmac-mode-name-font:Georgia, "Times New Roman", serif;--hmac-mode-name-style:normal;--hmac-mode-name-transform:none');
  assert.equal(styleVars({ mode_icon: { size: 40, active_color: '#fff' }, card: { border_width: 0 } }),
    '--hmac-mode-icon-size:40px;--hmac-border-width:0px'); // icon colors are set per button (see buttonVars)
  assert.ok(!styleVars({ line1: { color: 'red;}body{x' } }).includes(';}'));
});

test('prune: empty styles disappear, a 0 px border stays', () => {
  assert.equal(pruneStyles({ line1: {}, line2: { size: 0, color: '' } }), undefined);
  assert.deepEqual(pruneStyles({ card: { border_width: 0 }, chip: { italic: false } }), { card: { border_width: 0 }, chip: { italic: false } });
});

test('arm button colors follow the House Modes', () => {
  const d = { ...data, alarms: [{ key: 'gf', entity_id: 'alarm_control_panel.gf', name: 'GF' }], house: { ...data.house, modes: [
    { id: 'stay', name: 'Stay', icon: '', color: '#123456', targets: { gf: 'armed_home' } },
    { id: 'sleep', name: 'Sleep', icon: '', color: '#654321', targets: { other: 'armed_night' } },
  ] } };
  const c = armColors(d, 'alarm_control_panel.gf');
  assert.equal(c.armed_home, '#123456'); // this partition
  assert.equal(c.armed_night, '#654321'); // another partition
  assert.equal(c.armed_away, '#f44336'); // default
});

import { buttonVars, resolveColor } from '../card/src/data.ts';

test('button colors: keywords resolve per button', () => {
  assert.equal(resolveColor('mode', '#ff9800'), '#ff9800');
  assert.equal(resolveColor('none', '#ff9800'), 'transparent');
  assert.equal(resolveColor('transparent', '#ff9800'), 'transparent');
  assert.equal(resolveColor(undefined, '#ff9800'), undefined);
  assert.equal(buttonVars({ background: 'transparent', active_border: 'mode', border: 'none' }, { active_color: 'mode', color: 'var(--primary-color)' }, '#123456'),
    '--b-bg:transparent;--b-bd:transparent;--b-abd:#123456;--b-ic:var(--primary-color);--b-aic:#123456');
  assert.equal(buttonVars(undefined, undefined, '#000'), '');
});
