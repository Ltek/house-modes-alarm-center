// Unit tests for src/data/house.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newMode, modeErrors, describeTargets, removeMode, slug, SOURCES, describeTimer } from '../src/data/house.ts';

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

import { actionChoices, isHmEntity } from '../src/data/house.ts';

test('action choices: scripts only, hm_ ones first', () => {
  const states = { 'script.zzz': {}, 'scene.hm_spa': {}, 'light.x': {}, 'script.hm_lock_up': {}, 'scene.movie': {} };
  assert.deepEqual(actionChoices({ states }), ['script.hm_lock_up', 'script.zzz']);
  assert.equal(isHmEntity('script.hm_x'), true);
  assert.equal(isHmEntity('script.xhm_'), false);
});

import { actionGroups, setGroupModes, updateGroup, removeGroup } from '../src/data/house.ts';

test('actions by script: one group per script and timing, across modes', () => {
  const st = (e, when = 'enter', phase = 'after', extra = {}) => ({ entity_id: e, when, phase, modes: [], wait: false, ...extra });
  let s = { modes: [
    { id: 'sleep', name: 'Sleep', steps: [st('script.lock', 'enter', 'before'), st('script.lights')] },
    { id: 'away', name: 'Away', steps: [st('script.lock', 'enter', 'before', { modes: ['stay'], wait: true })] },
    { id: 'vac', name: 'Vacation', steps: [st('script.lock', 'leave')] },
    { id: 'stay', name: 'Stay', steps: [] },
  ] };
  assert.deepEqual(actionGroups(s), [
    { entity_id: 'script.lock', when: 'enter', phase: 'before', modes: ['sleep', 'away'] },
    { entity_id: 'script.lights', when: 'enter', phase: 'after', modes: ['sleep'] },
    { entity_id: 'script.lock', when: 'leave', phase: 'after', modes: ['vac'] },
  ]);
  const lock = { entity_id: 'script.lock', when: 'enter', phase: 'before' };
  s = setGroupModes(s, lock, ['away', 'stay']);
  assert.deepEqual(actionGroups(s).find(g => g.entity_id === 'script.lock' && g.when === 'enter').modes, ['away', 'stay']);
  assert.deepEqual(s.modes[1].steps[0].modes, ['stay'], 'an existing action keeps its own settings');
  assert.equal(s.modes[1].steps[0].wait, true);
  s = updateGroup(s, lock, { phase: 'after' });
  assert.deepEqual(actionGroups(s).find(g => g.entity_id === 'script.lock' && g.when === 'enter').phase, 'after');
  // retiming onto an action the mode already has keeps one
  s = updateGroup(s, { entity_id: 'script.lock', when: 'leave', phase: 'after' }, { when: 'enter' });
  assert.equal(s.modes[2].steps.length, 1);
  s = removeGroup(s, { entity_id: 'script.lights', when: 'enter', phase: 'after' });
  assert.equal(actionGroups(s).some(g => g.entity_id === 'script.lights'), false);
});

import { timerWarnings } from '../src/data/house.ts';

test('timer checks: blocked in or out, itself, unknown or own from-mode, ping-pong', () => {
  const all = ['manual', 'automation', 'schedule', 'presence_away', 'presence_home', 'lock', 'panel_keypad', 'timer'];
  const mode = (id, extra = {}) => ({ id, name: id[0].toUpperCase() + id.slice(1), enter_sources: [...all], leave_sources: [...all], timers: [], ...extra });
  const t = (then, extra = {}) => ({ after_minutes: 10, then, from_modes: [], window_start: null, window_end: null, notify: true, ...extra });
  assert.deepEqual(timerWarnings([mode('stay'), mode('spa', { timers: [t('stay')] })]), []);
  const w = timerWarnings([
    mode('stay', { enter_sources: all.filter(s => s !== 'timer') }),
    mode('spa', { timers: [t('stay'), t('spa'), t('previous', { from_modes: ['gone', 'spa'] })] }),
    mode('lock', { leave_sources: ['manual'], timers: [t('previous')] }),
    mode('a', { timers: [t('b')] }),
    mode('b', { timers: [t('a')] }),
  ]).map(x => x.text);
  assert.ok(w.some(x => x.startsWith('Spa: the timer to Stay is blocked')));
  assert.ok(w.some(x => x === 'Spa: a timer goes to Spa itself.'));
  assert.ok(w.some(x => x.includes('no longer exists (gone)')));
  assert.ok(w.some(x => x.includes('names Spa itself')));
  assert.ok(w.some(x => x.startsWith('Lock: its timers never fire')));
  assert.equal(w.filter(x => x.includes('go to each other')).length, 1);
});
