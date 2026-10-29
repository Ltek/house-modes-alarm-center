// Unit tests for src/data/house-actions.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editorPath, suggestedModes, itemsForMode, matchesFilter } from '../src/data/house-actions.ts';

const a = { entity_id: 'automation.sleep_lights', kind: 'automation', name: 'Sleep lights', state: 'on', last_triggered: null,
  edit_id: '1740', editable: true, labels: ['Sleep'], detected: { modes: ['Sleep', 'Late Night'], any: false } };
const s = { entity_id: 'script.spa_on', kind: 'script', name: 'Spa on', state: 'off', last_triggered: null,
  edit_id: 'spa_on', editable: true, labels: [], detected: null };
const any = { ...s, entity_id: 'automation.last_duration', kind: 'automation', name: 'Last Duration', detected: { modes: [], any: true } };

test('editor paths', () => {
  assert.equal(editorPath(a), '/config/automation/edit/1740');
  assert.equal(editorPath(s), '/config/script/edit/spa_on');
  assert.equal(editorPath({ ...s, edit_id: null }), null);
});

test('suggestions and per-mode lists', () => {
  assert.deepEqual(suggestedModes(a), ['Late Night']);
  assert.deepEqual(itemsForMode([a, s], 'Sleep').map(i => i.name), ['Sleep lights']);
  assert.deepEqual(itemsForMode([a, s], 'Late Night'), []);
  assert.deepEqual(itemsForMode([a, s], 'Late Night', true).map(i => i.name), ['Sleep lights']);
});

test('filters', () => {
  const f = { search: '', kind: '', mode: '', show: 'related' };
  assert.equal(matchesFilter(a, f), true);
  assert.equal(matchesFilter(s, f), false);
  assert.equal(matchesFilter(s, { ...f, show: 'all' }), true);
  assert.equal(matchesFilter(any, { ...f, show: 'suggested' }), true);
  assert.equal(matchesFilter(a, { ...f, kind: 'script' }), false);
  assert.equal(matchesFilter(a, { ...f, mode: 'Late Night' }), true);
  assert.equal(matchesFilter(a, { ...f, search: 'spa' }), false);
});
