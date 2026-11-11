// Unit tests for src/data/locks.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEmptyAction, withTarget, describeAction, importable, actionWarnings } from '../src/data/locks.ts';

test('withTarget sets and clears partition targets', () => {
  let a = withTarget(undefined, 'gar', 'armed_away');
  assert.deepEqual(a, { house_mode: null, targets: { gar: 'armed_away' } });
  assert.equal(isEmptyAction(a), false);
  a = withTarget(a, 'gar', '');
  assert.equal(isEmptyAction(a), true);
});

test('describeAction', () => {
  const d = describeAction({ house_mode: 'stay', targets: { gar: 'armed_away' } }, () => 'Stay', () => 'Garage', () => 'Away');
  assert.equal(d, 'House Mode Stay · Garage: Away');
  assert.equal(describeAction(undefined, String, String, String), 'nothing');
});

test('importable: in use, readable, not linked', () => {
  const rows = [
    { slot: 1, in_use: true, readable: true, user_id: null },
    { slot: 2, in_use: true, readable: true, user_id: 'a' },
    { slot: 3, in_use: false, readable: true, user_id: null },
    { slot: 4, in_use: true, readable: false, user_id: null },
  ];
  assert.deepEqual(importable(rows).map(r => r.slot), [1]);
});

test('actionWarnings: House Mode needs only an enabled user; targets need permissions', () => {
  const lockOnly = { user_id: 'g', name: 'Guest', enabled: true, can_arm: false, can_disarm: false, area_limit: ['gf'] };
  assert.deepEqual(actionWarnings(lockOnly, { house_mode: 'off', targets: {} }), []);
  const w = actionWarnings(lockOnly, { house_mode: null, targets: { gf: 'disarmed', gar: 'armed_away' } });
  assert.deepEqual(w, ['Partition target: the user may not disarm (Can disarm is off).', 'Partition target: partition not allowed for this user.']);
  assert.deepEqual(actionWarnings({ ...lockOnly, enabled: false }, { house_mode: 'x', targets: {} }), ['The user is disabled: nothing will happen.']);
  assert.deepEqual(actionWarnings(lockOnly, undefined), []);
});
