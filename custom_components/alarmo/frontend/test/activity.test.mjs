// Unit tests for src/data/activity.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sequenceMatches } from '../src/data/activity.ts';

const seq = {
  id: 'a', start: 0, title: 'House Mode Selector: Disarmed → Away', kinds: ['house', 'alarmo'],
  entries: [
    { t: 0, dt: 0, kind: 'house', text: 'House Mode Selector: Disarmed → Away', cause: 'user: Alex' },
    { t: 1, dt: 1, kind: 'alarmo', text: 'Master: disarmed → arming' },
  ],
};

test('sequenceMatches: kinds, problems, search', () => {
  assert.equal(sequenceMatches(seq, [], false, ''), true);
  assert.equal(sequenceMatches(seq, ['lock'], false, ''), false);
  assert.equal(sequenceMatches(seq, ['alarmo', 'lock'], false, ''), true);
  assert.equal(sequenceMatches(seq, [], true, ''), false);
  assert.equal(sequenceMatches({ ...seq, entries: [...seq.entries, { t: 2, dt: 2, kind: 'alarmo', text: 'Alarmo failed to arm' }] }, [], true, ''), true);
  assert.equal(sequenceMatches(seq, [], false, 'alex'), true);
  assert.equal(sequenceMatches(seq, [], false, 'vacation'), false);
});
