// Unit tests for src/data/scenes.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { captureMember, captureMembers, patchMember, hexToRgb, rgbToHex, describeMember, sceneSupported } from '../src/data/scenes.ts';

test('capture lights: off, or on with brightness, one colour format and effect', () => {
  assert.deepEqual(captureMember('light.a', { state: 'off', attributes: { brightness: 100 } }), { state: 'off' });
  assert.deepEqual(
    captureMember('light.a', { state: 'on', attributes: { brightness: 128, color_mode: 'color_temp', color_temp_kelvin: 2700, rgb_color: [1, 2, 3], effect: 'None' } }, 2),
    { state: 'on', brightness: 128, color_temp_kelvin: 2700, transition: 2 }
  );
  assert.deepEqual(captureMember('light.a', { state: 'on', attributes: { hs_color: [30, 80], effect: 'rainbow' } }), { state: 'on', hs_color: [30, 80], effect: 'rainbow' });
});

test('capture other domains with their settable attributes; unsupported skipped', () => {
  assert.deepEqual(captureMember('cover.c', { state: 'open', attributes: { current_position: 65, friendly_name: 'x' } }), { state: 'open', current_position: 65 });
  assert.equal(captureMember('sensor.t', { state: '20', attributes: {} }), null);
  assert.equal(sceneSupported('lock.front'), true);
  const all = captureMembers(['lock.front', 'sensor.t', 'missing.x'], { 'lock.front': { state: 'locked', attributes: {} }, 'sensor.t': { state: '1', attributes: {} } });
  assert.deepEqual(all, { 'lock.front': { state: 'locked' } });
});

test('patch replaces the colour format; undefined removes', () => {
  const m = { state: 'on', color_temp_kelvin: 2700, brightness: 10 };
  assert.deepEqual(patchMember(m, { rgb_color: [255, 0, 0] }), { state: 'on', brightness: 10, rgb_color: [255, 0, 0] });
  assert.deepEqual(patchMember(m, { brightness: undefined }), { state: 'on', color_temp_kelvin: 2700 });
});

test('colour helpers and description', () => {
  assert.deepEqual(hexToRgb('#ff8800'), [255, 136, 0]);
  assert.equal(rgbToHex([255, 136, 0]), '#ff8800');
  assert.equal(describeMember({ state: 'on', brightness: 153, color_temp_kelvin: 2700 }), 'on · 60 % · 2700 K');
  assert.equal(describeMember({ state: 'open', current_position: 65 }), 'open · 65 % open');
});
