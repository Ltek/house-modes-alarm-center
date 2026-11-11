// Unit tests for the House Modes Off / Shadow / Live setting (src/data/house.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runState, setRunState } from '../src/data/house.ts';

test('run state from enabled + run_mode, and back', () => {
  assert.equal(runState({ enabled: false, run_mode: 'shadow' }), 'off');
  assert.equal(runState({ enabled: true }), 'live'); // older settings have no run_mode
  assert.equal(runState({ enabled: true, run_mode: 'shadow' }), 'shadow');
  const s = { enabled: false };
  setRunState(s, 'shadow');
  assert.deepEqual(s, { enabled: true, run_mode: 'shadow' });
  setRunState(s, 'off');
  assert.deepEqual(s, { enabled: false, run_mode: 'shadow' }); // remembered for next time
  setRunState(s, 'live');
  assert.equal(runState(s), 'live');
});
