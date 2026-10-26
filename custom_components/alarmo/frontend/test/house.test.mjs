// Unit tests for src/data/house.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMode, modeErrors, describeTargets, removeMode, slug, SOURCES } from '../src/data/house.ts';

test('newMode makes unique ids and allows every source', () => {
  const a = newMode('Late Night', []);
  assert.equal(a.id, 'late_night');
  assert.deepEqual(a.enter_sources, SOURCES);
  assert.equal(newMode('Late night!', [a]).id, 'late_night_2');
  assert.equal(slug('***'), 'mode');
});

test('modeErrors', () => {
  const a = newMode('Stay', []);
  const b = newMode('stay', [a]);
  assert.match(modeErrors([a, b])[0], /unique/);
  b.name = 'Spa';
  b.timers = [{ after_minutes: 45, then: 'nope', from_modes: [], notify: true }];
  assert.match(modeErrors([a, b])[0], /no longer exists/);
  b.timers[0].then = 'previous';
  assert.deepEqual(modeErrors([a, b]), []);
});

test('describeTargets', () => {
  const m = newMode('Stay', []);
  assert.equal(describeTargets(m, {}, s => s), 'no partition changes');
  m.targets = { p1: 'armed_home', p2: 'disarmed' };
  assert.equal(describeTargets(m, { p1: 'Ground' }, s => s.replace('armed_', '')), 'Ground: home · p2: disarmed');
});

test('removeMode cleans references', () => {
  const stay = newMode('Stay', []);
  const spa = newMode('Spa', [stay]);
  spa.timers = [{ after_minutes: 5, then: 'stay', from_modes: [], notify: true }];
  const s = {
    enabled: true,
    modes: [stay, spa],
    lock_keypads: [{ node_id: 1, name: '', slots: { 1: 'stay', 2: 'spa' } }],
    current: 'stay',
    previous: null,
    source: null,
    changed_at: null,
    history: [],
    pending: [],
  };
  const out = removeMode(s, 'stay');
  assert.deepEqual(out.modes.map(m => m.id), ['spa']);
  assert.deepEqual(out.modes[0].timers, []);
  assert.deepEqual(out.lock_keypads[0].slots, { 2: 'spa' });
  assert.equal(out.current, null);
});

import { keypadFor, slotList } from '../src/data/house.ts';

test('keypadFor and slotList', () => {
  const s = { lock_keypads: [{ node_id: 138, name: '', enabled: true, slots: { 9: 'guest' } }] };
  const lock = { entity_id: 'lock.f', name: 'F', node_id: 138, slots: [{ slot: 1, status: 'in use' }, { slot: 3, status: 'disabled' }], configured: true };
  assert.equal(keypadFor(s, lock).node_id, 138);
  assert.equal(keypadFor(s, { ...lock, node_id: 50 }), undefined);
  assert.deepEqual(slotList(lock, keypadFor(s, lock)), [1, 3, 9]);
  assert.deepEqual(slotList({ ...lock, slots: null }, undefined), []);
});
