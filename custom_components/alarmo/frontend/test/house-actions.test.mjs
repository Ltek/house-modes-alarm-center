import { test } from 'node:test';
import assert from 'node:assert/strict';

import { editorPath, reactingTo, reactingToAny } from '../src/data/house-actions.ts';

const item = (name, kind, reacts) => ({ entity_id: `${kind}.${name.toLowerCase().replace(/ /g, '_')}`, kind, name, state: 'on',
  last_triggered: null, edit_id: '1', editable: true, labels: [], detected: null, reacts });

test('reactingTo splits entering and leaving a mode', () => {
  const lights = item('Sleep lights', 'automation', { to: ['Sleep'], from: [], any: false });
  const wake = item('Wake up', 'automation', { to: [], from: ['Sleep'], any: false });
  const both = item('Spa', 'automation', { to: ['Spa'], from: ['Spa'], any: false });
  const every = item('Notify', 'automation', { to: [], from: [], any: true });
  const none = item('Other', 'automation', null);
  const all = [lights, wake, both, every, none];
  assert.deepEqual(reactingTo(all, 'Sleep').enter.map(i => i.name), ['Sleep lights']);
  assert.deepEqual(reactingTo(all, 'Sleep').leave.map(i => i.name), ['Wake up']);
  // on entering and leaving: listed once, under entering
  assert.deepEqual(reactingTo(all, 'Spa').enter.map(i => i.name), ['Spa']);
  assert.deepEqual(reactingTo(all, 'Spa').leave, []);
  assert.deepEqual(reactingToAny(all).map(i => i.name), ['Notify']);
});

test('editorPath', () => {
  assert.equal(editorPath(item('A b', 'automation', null)), '/config/automation/edit/1');
  assert.equal(editorPath({ ...item('A', 'scene', null), edit_id: null }), null);
});
