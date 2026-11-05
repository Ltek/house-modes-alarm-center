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
  assert.match(resultMessage({ result: 'shadow', would: 'changed' }, name), /nothing was changed/);
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

import { migrateConfig, presetOf, BUTTON_PRESETS, ARM_DEFAULT_COLORS } from '../card/src/data.ts';

test('arm mode colors: standard and theme, old setting migrated', () => {
  assert.deepEqual(armColors(data, 'x', 'standard'), ARM_DEFAULT_COLORS);
  assert.equal(armColors(data, 'x', 'standard').disarmed, '#4caf50');
  assert.deepEqual(armColors(data, 'x', 'theme'), {});
  assert.deepEqual(migrateConfig({ type: 'x', alarm_colors_from_modes: false }), { type: 'x', alarm_colors: 'standard' });
  assert.deepEqual(migrateConfig({ type: 'x', alarm_colors_from_modes: true }), { type: 'x' });
  assert.deepEqual(migrateConfig({ type: 'x', alarm_colors_from_modes: false, alarm_colors: 'theme' }), { type: 'x', alarm_colors: 'theme' });
});

test('button style presets are recognised, the icon size does not matter', () => {
  const p = BUTTON_PRESETS.outline_selected;
  assert.equal(presetOf(p.button, { ...p.icon, size: 26 }), 'outline_selected');
  assert.equal(presetOf(undefined, undefined), 'filled');
  assert.equal(presetOf({ background: 'red' }, undefined), '');
});

import { cleanLine, lcdLines as lcd2, fxClasses, fxTriggers, fxVars } from '../card/src/data.ts';

test('panel display: strip, then replace', () => {
  assert.equal(cleanLine('****DISARMED****', '*'), 'DISARMED');
  assert.equal(cleanLine('  Ready to Arm  ', '*'), 'Ready to Arm');
  assert.equal(cleanLine('FAULT 02 MAIN ROOM', '', [{ from: 'FAULT', to: 'Open:' }]), 'Open: 02 MAIN ROOM');
  assert.equal(cleanLine('****DISARMED****', '*', [{ from: 'DISARMED', to: 'Disarmed' }, { from: 'x' }]), 'Disarmed');
  assert.deepEqual(lcd2('****DISARMED****  Ready to Arm  ', '*'), ['DISARMED', 'Ready to Arm']);
  assert.equal(cleanLine('**', '*'), '');
});

test('effects: only while a chosen trigger is true', () => {
  assert.deepEqual(fxTriggers('arming', 'disarmed', null), ['arming']);
  assert.deepEqual(fxTriggers('disarmed', 'pending', 'Away'), ['entry', 'changing']);
  assert.deepEqual(fxClasses({ card: { border: 'both', background: 'glow' }, status_icon: { icon: 'pulse' } }, ['arming']),
    ['fx-on', 'fx-card-background-glow', 'fx-card-border-glow', 'fx-card-border-pulse', 'fx-status-icon-pulse']);
  assert.deepEqual(fxClasses({ card: { border: 'glow' }, when: ['triggered'] }, ['arming']), []);
  assert.deepEqual(fxClasses({ when: ['arming'] }, ['arming']), []); // no parts chosen
  assert.deepEqual(fxClasses(undefined, ['arming']), []);
  assert.equal(fxVars({ size: 20, speed: 1.2, color: 'var(--warning-color)' }), '--fx-size:20px;--fx-speed:1.2s;--fx-color:var(--warning-color)');
});

test('card and section backgrounds', () => {
  assert.equal(styleVars({ card: { background: 'transparent' }, header_section: { background: '#222222' } }),
    '--hmac-card-bg:transparent;--hmac-header-bg:#222222');
});

import { resultMessage as rm2, ALARM_STATE_ICONS } from '../card/src/data.ts';

test('Shadow without an own helper says nothing changed; alarm icons when House Modes are off', () => {
  assert.equal(rm2({ result: 'shadow', would: 'changed', requested: 'Stay' }, e => e), 'Shadow: House Modes would set Stay; nothing was changed');
  assert.equal(ALARM_STATE_ICONS.disarmed, 'mdi:lock-open-variant');
});

import { migrateEffects, fxPartClasses, withModeColors, armColorsFor } from '../card/src/data.ts';

test('effects: parts per target, old settings migrated', () => {
  assert.deepEqual(migrateEffects({ border: 'both', status_icon: 'glow', mode_button: 'both', size: 20 }),
    { card: { border: 'both' }, status_icon: { icon: 'glow' }, mode_button: { border: 'glow', icon: 'pulse' }, size: 20 });
  assert.deepEqual(migrateEffects({ card: { border: 'glow' } }), { card: { border: 'glow' } });
  assert.deepEqual(fxPartClasses({ background: 'pulse', icon: 'both' }, true), ['fx-background-pulse', 'fx-icon-glow', 'fx-icon-pulse']);
  assert.deepEqual(fxPartClasses({ background: 'pulse' }, false), []);
});

test('color mapping: card-only House Mode colors, arm modes matched to a House Mode', () => {
  const d = { ...data, alarms: [{ key: 'gf', entity_id: 'alarm_control_panel.gf', name: 'GF' }] };
  const v = withModeColors(d, { stay: '#111111' });
  assert.equal(v.house.modes[0].color, '#111111');
  assert.equal(d.house.modes[0].color, '#ff9800'); // the original is untouched
  const c = armColorsFor(v, 'alarm_control_panel.gf', 'standard', { disarmed: 'house:spa', armed_away: '#222222', armed_home: 'house:none' });
  assert.equal(c.disarmed, '#00bcd4');
  assert.equal(c.armed_away, '#222222');
  assert.equal(c.armed_home, '#ff9800'); // unknown House Mode: the standard color stays
});
