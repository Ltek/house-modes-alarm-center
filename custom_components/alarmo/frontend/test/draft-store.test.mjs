// Unit tests for src/data/draft-store.ts  —  run with:  npm test
// (Node >= 22.18 / 23.6 strips the TypeScript annotations on import.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DraftStore, valuesEqual } from '../src/data/draft-store.ts';

const saved = () => ({
  'binary_sensor.door': {
    entity_id: 'binary_sensor.door',
    type: 'door',
    area: 'a1',
    modes: ['armed_away', 'armed_home'],
    enabled: true,
    always_on: false,
    group: null,
  },
  'binary_sensor.motion': {
    entity_id: 'binary_sensor.motion',
    type: 'motion',
    area: 'a1',
    modes: ['armed_away'],
    enabled: true,
    always_on: false,
    group: 'g1',
  },
});

test('a fresh draft is clean', () => {
  const d = new DraftStore(saved());
  assert.equal(d.isDirty(), false);
  assert.equal(d.changeCount(), 0);
  assert.deepEqual(d.ids(), ['binary_sensor.door', 'binary_sensor.motion']);
  assert.deepEqual(d.toBatch(), { create: [], update: [], delete: [] });
});

test('editing a field marks it; editing back clears the mark', () => {
  const d = new DraftStore(saved());
  d.setField('binary_sensor.door', 'area', 'a2');
  assert.equal(d.isFieldChanged('binary_sensor.door', 'area'), true);
  assert.equal(d.rowStatus('binary_sensor.door'), 'changed');
  assert.equal(d.rowChangeCount('binary_sensor.door'), 1);
  assert.equal(d.get('binary_sensor.door').area, 'a2');
  d.setField('binary_sensor.door', 'area', 'a1');
  assert.equal(d.isFieldChanged('binary_sensor.door', 'area'), false);
  assert.equal(d.rowStatus('binary_sensor.door'), 'unchanged');
  assert.equal(d.isDirty(), false);
});

test('mode toggles compare as sets and mark single modes', () => {
  const d = new DraftStore(saved());
  d.toggleMode('binary_sensor.door', 'armed_away', false);
  assert.deepEqual(d.get('binary_sensor.door').modes, ['armed_home']);
  assert.equal(d.isModeChanged('binary_sensor.door', 'armed_away'), true);
  assert.equal(d.isModeChanged('binary_sensor.door', 'armed_home'), false);
  d.toggleMode('binary_sensor.door', 'armed_away', true); // now ['armed_home','armed_away']
  assert.equal(d.isDirty(), false, 'same set in a different order is not a change');
  assert.ok(valuesEqual('modes', ['b', 'a'], ['a', 'b']));
  assert.ok(!valuesEqual('area', 'a', 'b'));
  assert.ok(valuesEqual('group', null, undefined));
});

test('saved data is never mutated by the draft', () => {
  const s = saved();
  const d = new DraftStore(s);
  d.toggleMode('binary_sensor.door', 'armed_night', true);
  d.get('binary_sensor.motion').modes.push('x');
  assert.deepEqual(s['binary_sensor.door'].modes, ['armed_away', 'armed_home']);
  assert.deepEqual(d.get('binary_sensor.motion').modes, ['armed_away']);
});

test('add / remove / restore and the resulting batch', () => {
  const d = new DraftStore(saved());
  d.add({ entity_id: 'binary_sensor.window', type: 'window', area: 'a1', modes: ['armed_away'], group: null });
  d.setField('binary_sensor.window', 'area', 'a2'); // editing a new row stays "new"
  d.remove('binary_sensor.motion');
  d.setField('binary_sensor.door', 'enabled', false);
  assert.equal(d.rowStatus('binary_sensor.window'), 'new');
  assert.equal(d.rowStatus('binary_sensor.motion'), 'removed');
  assert.equal(d.changeCount(), 3);
  assert.deepEqual(d.toBatch(), {
    create: [{ entity_id: 'binary_sensor.window', type: 'window', area: 'a2', modes: ['armed_away'] }],
    update: [{ entity_id: 'binary_sensor.door', changes: { enabled: false } }],
    delete: ['binary_sensor.motion'],
  });
  d.restore('binary_sensor.motion');
  assert.equal(d.rowStatus('binary_sensor.motion'), 'unchanged');
  d.remove('binary_sensor.window'); // removing an unsaved row just drops it
  assert.equal(d.has('binary_sensor.window'), false);
  assert.deepEqual(d.ids(), ['binary_sensor.door', 'binary_sensor.motion']);
});

test('edits on a row marked for removal are not sent as updates', () => {
  const d = new DraftStore(saved());
  d.setField('binary_sensor.door', 'area', 'a2');
  d.remove('binary_sensor.door');
  assert.deepEqual(d.toBatch(), { create: [], update: [], delete: ['binary_sensor.door'] });
  assert.equal(d.changeCount(), 1);
});

test('bulk operations skip removed rows', () => {
  const d = new DraftStore(saved());
  d.remove('binary_sensor.motion');
  d.setFieldMany(['binary_sensor.door', 'binary_sensor.motion'], 'area', 'a3');
  d.toggleModeMany(['binary_sensor.door', 'binary_sensor.motion'], 'armed_night', true);
  assert.equal(d.get('binary_sensor.door').area, 'a3');
  assert.deepEqual(d.get('binary_sensor.door').modes.sort(), ['armed_away', 'armed_home', 'armed_night']);
  assert.equal(d.get('binary_sensor.motion').area, 'a1');
  d.removeMany(['binary_sensor.door']);
  assert.deepEqual(d.toBatch().delete.sort(), ['binary_sensor.door', 'binary_sensor.motion']);
});

test('revert row and discard all', () => {
  const d = new DraftStore(saved());
  d.setField('binary_sensor.door', 'type', 'window');
  d.add({ entity_id: 'binary_sensor.x', area: 'a1' });
  d.revertRow('binary_sensor.door');
  assert.equal(d.rowStatus('binary_sensor.door'), 'unchanged');
  assert.equal(d.changeCount(), 1);
  d.discardAll();
  assert.equal(d.isDirty(), false);
  assert.deepEqual(d.ids(), ['binary_sensor.door', 'binary_sensor.motion']);
});

test('new saved data keeps unrelated edits and drops ones that now match', () => {
  const d = new DraftStore(saved());
  d.setField('binary_sensor.door', 'area', 'a2');
  d.setField('binary_sensor.motion', 'enabled', false);
  d.add({ entity_id: 'binary_sensor.new', area: 'a1' });
  const next = saved();
  next['binary_sensor.door'].area = 'a2'; // someone saved the same change elsewhere
  next['binary_sensor.new'] = { entity_id: 'binary_sensor.new', area: 'a1' };
  d.setSaved(next);
  assert.equal(d.isFieldChanged('binary_sensor.door', 'area'), false);
  assert.equal(d.isFieldChanged('binary_sensor.motion', 'enabled'), true);
  assert.equal(d.rowStatus('binary_sensor.new'), 'unchanged');
  assert.equal(d.changeCount(), 1);
});

test('snapshot / loadSnapshot survive leaving the page', () => {
  const d = new DraftStore(saved());
  d.setField('binary_sensor.door', 'area', 'a2');
  d.add({ entity_id: 'binary_sensor.x', area: 'a1' });
  d.remove('binary_sensor.motion');
  const snap = JSON.parse(JSON.stringify(d.snapshot()));
  const e = new DraftStore(saved());
  e.loadSnapshot(snap);
  assert.deepEqual(e.toBatch(), d.toBatch());
  // a snapshot referring to sensors that no longer exist is ignored safely
  const f = new DraftStore({});
  f.loadSnapshot(snap);
  assert.deepEqual(f.toBatch(), { create: [{ entity_id: 'binary_sensor.x', area: 'a1' }], update: [], delete: [] });
});

test('unknown sensor edits throw', () => {
  const d = new DraftStore(saved());
  assert.throws(() => d.setField('binary_sensor.nope', 'area', 'a1'));
});
