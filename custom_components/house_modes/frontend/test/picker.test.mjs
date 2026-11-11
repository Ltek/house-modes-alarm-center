import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterOptions, toOptions } from '../src/data/picker.ts';

test('filterOptions hides chosen, filters by label or id, sorts', () => {
  const opts = toOptions({ win: 'Window Sensor', door: 'Door', fire: 'Fire', bath: 'Basement Bathroom' });
  assert.deepEqual(filterOptions(opts, ['door'], '').map(o => o.value), ['bath', 'fire', 'win']);
  assert.deepEqual(filterOptions(opts, [], 'sensor').map(o => o.value), ['win']);
  assert.deepEqual(filterOptions(opts, [], 'FI').map(o => o.value), ['fire']);
  assert.deepEqual(filterOptions(opts, [], 'bath').map(o => o.value), ['bath']);
});
