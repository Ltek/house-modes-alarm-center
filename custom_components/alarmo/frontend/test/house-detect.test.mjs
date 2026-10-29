// Unit tests for applyDetected (src/data/house.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDetected, newMode } from '../src/data/house.ts';

const sug = (name, targets, basis = 'activity', icon = 'mdi:car') => ({ name, icon, targets, basis, seen: 3, share: {}, note: '' });

test('adds new modes, updates same-named ones, sets the entities and Shadow', () => {
  const stay = newMode('Stay', []);
  const d = { enabled: false, modes: [stay], lock_keypads: [], notify_services: [] };
  const ents = { selector: 'input_select.sel', current: 'input_select.cur', previous: 'input_select.last' };
  const changes = applyDetected(d, [sug('stay', { m: 'armed_home' }, 'activity', 'mdi:home-lock'), sug('Away', { m: 'armed_away' }), sug('Zebra', {}, 'none')], ents);
  assert.equal(d.modes.length, 3);
  assert.deepEqual(d.modes[0].targets, { m: 'armed_home' });
  assert.equal(d.modes[0].icon, 'mdi:home-lock');
  assert.equal(d.modes[1].name, 'Away');
  assert.deepEqual(d.modes[2].targets, {}); // no basis: added empty
  assert.equal(d.input_select, 'input_select.sel');
  assert.equal(d.current_entity, 'input_select.cur');
  assert.equal(d.previous_entity, 'input_select.last');
  assert.equal(d.enabled, true);
  assert.equal(d.run_mode, 'shadow');
  assert.ok(changes.includes('House Modes: Shadow'));
});

test('keeps Live and leaves a same-named mode alone without evidence', () => {
  const stay = { ...newMode('Stay', []), targets: { m: 'armed_night' } };
  const d = { enabled: true, run_mode: 'live', modes: [stay], lock_keypads: [], notify_services: [] };
  applyDetected(d, [sug('Stay', {}, 'none')], { selector: null, current: null, previous: null });
  assert.deepEqual(d.modes[0].targets, { m: 'armed_night' });
  assert.equal(d.run_mode, 'live');
});
