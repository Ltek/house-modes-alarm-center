// Unit tests for src/data/status.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { liveState, blocksModes, walkUpdate, walkSummary, walkPassed } from '../src/data/status.ts';

test('liveState', () => {
  assert.equal(liveState('on'), 'open');
  assert.equal(liveState('unlocked'), 'open');
  assert.equal(liveState('off'), 'closed');
  assert.equal(liveState('unavailable'), 'unavailable');
  assert.equal(liveState(undefined), 'unavailable');
  assert.equal(liveState('42'), 'unknown');
});

test('blocksModes follows Alarmo readiness rules', () => {
  const door = { enabled: true, type: 'door', modes: ['armed_away', 'armed_home'] };
  const modes = ['armed_away', 'armed_home', 'armed_night'];
  assert.deepEqual(blocksModes(door, 'open', modes), ['armed_away', 'armed_home']);
  assert.deepEqual(blocksModes(door, 'closed', modes), []);
  assert.deepEqual(blocksModes({ ...door, allow_open: true }, 'open', modes), []);
  assert.deepEqual(blocksModes({ ...door, auto_bypass: true, auto_bypass_modes: ['armed_home'] }, 'open', modes), ['armed_away']);
  assert.deepEqual(blocksModes({ ...door, type: 'motion' }, 'open', modes), []);
  assert.deepEqual(blocksModes({ ...door, always_on: true }, 'open', modes), modes);
  assert.deepEqual(blocksModes(door, 'unavailable', modes), []);
  assert.deepEqual(blocksModes({ ...door, trigger_unavailable: true }, 'unavailable', modes), ['armed_away', 'armed_home']);
  assert.deepEqual(blocksModes({ ...door, enabled: false }, 'open', modes), []);
});

test('walk test: a zone passes after open then closed', () => {
  let w = {};
  w = walkUpdate(w, 'a', 'off');
  assert.equal(walkPassed(w.a), false);
  w = walkUpdate(w, 'a', 'on');
  w = walkUpdate(w, 'a', 'on');
  assert.deepEqual(walkSummary(w, ['a', 'b']), { passed: 0, open: 1, left: 2, total: 2 });
  w = walkUpdate(w, 'a', 'off');
  assert.equal(walkPassed(w.a), true);
  assert.deepEqual(walkSummary(w, ['a', 'b']), { passed: 1, open: 0, left: 1, total: 2 });
});
