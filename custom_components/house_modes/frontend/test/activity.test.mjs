// Unit tests for src/data/activity.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sequenceMatches } from '../src/data/activity.ts';

const seq = {
  id: 'a', start: 0, title: 'House Mode Selector: Disarmed → Away', kinds: ['house', 'alarm'],
  entries: [
    { t: 0, dt: 0, kind: 'house', text: 'House Mode Selector: Disarmed → Away', cause: 'user: Alex' },
    { t: 1, dt: 1, kind: 'alarm', text: 'Master: disarmed → arming' },
  ],
};

test('sequenceMatches: kinds, problems, search', () => {
  assert.equal(sequenceMatches(seq, [], false, ''), true);
  assert.equal(sequenceMatches(seq, ['lock'], false, ''), false);
  assert.equal(sequenceMatches(seq, ['alarm', 'lock'], false, ''), true);
  assert.equal(sequenceMatches(seq, [], true, ''), false);
  assert.equal(sequenceMatches({ ...seq, entries: [...seq.entries, { t: 2, dt: 2, kind: 'alarm', text: 'Alarm failed to arm' }] }, [], true, ''), true);
  assert.equal(sequenceMatches(seq, [], false, 'alex'), true);
  assert.equal(sequenceMatches(seq, [], false, 'vacation'), false);
});

import { daysInRange, mergeSummaries } from '../src/data/activity.ts';

test('day ranges and merged summaries', () => {
  const days = ['2026-11-07', '2026-11-06', '2026-11-05', '2026-11-03'];
  assert.deepEqual(daysInRange(days, '2026-11-05', '2026-11-07'), ['2026-11-07', '2026-11-06', '2026-11-05']);
  assert.deepEqual(daysInRange(days, '2026-11-06', '2026-11-03'), ['2026-11-06', '2026-11-05', '2026-11-03']);
  const m = mergeSummaries([
    { sequences: 2, starters: { lock: 1, house: 1 }, failures: 1, panel_latency: { armed_away: { n: 1, avg: 2, max: 2 } } },
    { sequences: 3, starters: { lock: 2 }, failures: 0, panel_latency: { armed_away: { n: 3, avg: 1, max: 4 } } },
  ]);
  assert.deepEqual(m, { sequences: 5, starters: { lock: 3, house: 1 }, failures: 1, panel_latency: { armed_away: { n: 4, avg: 1.3, max: 4 } } });
});
