// Unit tests for src/data/house.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMode, modeErrors, describeTargets, removeMode, slug, SOURCES, describeTimer, setEnterSteps, enterStepModes } from '../src/data/house.ts';

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

test('describeTimer', () => {
  const name = id => ({ stay: 'Stay', away: 'Away' })[id] || id;
  assert.equal(describeTimer({ after_minutes: 10, then: 'stay', from_modes: ['away', 'stay'], window_start: '20:30', window_end: '05:00', notify: true }, name),
    'after 10 min → Stay · only from Away, Stay · 20:30–05:00');
  assert.equal(describeTimer({ at: '01:00', then: 'previous', from_modes: [], notify: true }, name), 'at 01:00 → the previous mode');
});

test('setEnterSteps adds and removes a scene as an entering step, keeping other steps', () => {
  const lock = { entity_id: 'script.lock_up', when: 'enter', phase: 'before', modes: [], wait: true };
  const s = { modes: [{ id: 'stay', name: 'Stay', steps: [lock] }, { id: 'spa', name: 'Spa', steps: [] }] };
  const a = setEnterSteps(s, 'scene.spa', ['Spa']);
  assert.deepEqual(a.modes[1].steps, [{ entity_id: 'scene.spa', when: 'enter', phase: 'after', modes: [], wait: false }]);
  assert.deepEqual(a.modes[0].steps, [lock]);
  assert.deepEqual(enterStepModes(a, 'scene.spa'), ['Spa']);
  const b = setEnterSteps(a, 'scene.spa', []);
  assert.deepEqual(b.modes[1].steps, []);
  assert.deepEqual(enterStepModes(a, 'script.lock_up'), ['Stay']);
});
