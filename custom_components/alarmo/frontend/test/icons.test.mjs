// Unit tests for src/data/icons.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIcon, shortIcon } from '../src/data/icons.ts';
import { newMode, defaultModeIcon } from '../src/data/house.ts';

test('mdi: is never required', () => {
  assert.equal(normalizeIcon('bed'), 'mdi:bed');
  assert.equal(normalizeIcon(' Bed King '), 'mdi:bed-king');
  assert.equal(normalizeIcon('mdi:bed'), 'mdi:bed');
  assert.equal(normalizeIcon('hass:flash'), 'hass:flash');
  assert.equal(normalizeIcon(''), '');
  assert.equal(shortIcon('mdi:bed'), 'bed');
  assert.equal(shortIcon('hass:flash'), 'hass:flash');
});

test('default House Mode icons, Sleep is a bed', () => {
  assert.equal(defaultModeIcon('Sleep'), 'mdi:bed');
  assert.equal(defaultModeIcon('Night'), 'mdi:bed');
  assert.equal(defaultModeIcon('Away'), 'mdi:car');
  assert.equal(defaultModeIcon('Disarmed'), 'mdi:shield-off-outline');
  assert.equal(defaultModeIcon('Local'), 'mdi:map-marker-radius');
  assert.equal(defaultModeIcon('Zebra'), 'mdi:home');
  assert.equal(newMode('Sleep', []).icon, 'mdi:bed');
});
