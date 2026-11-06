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

import { settingMode, settingFromTemplate, setterWarnings, setterSource, describeSetter } from '../src/data/house-actions.ts';

test('automations that set a mode, and their warnings', () => {
  const it = (name, sets, kinds = ['time']) => ({ entity_id: `automation.${name}`, kind: 'automation', name, state: 'on', last_triggered: null,
    edit_id: name, editable: true, labels: [], detected: null, reacts: null, sets, trigger_kinds: kinds });
  const items = [
    it('a', [{ mode: 'Stay', template: false, via: 'service', source: 'schedule' }]),
    it('b', [{ mode: 'stay', template: false, via: 'selector', source: null }], ['presence']),
    it('c', [{ mode: null, template: true, via: 'current', source: null }]),
    it('d', null),
  ];
  assert.deepEqual(settingMode(items, 'Stay').map(x => x.item.name), ['a', 'b']);
  assert.deepEqual(settingFromTemplate(items).map(i => i.name), ['c']);
  const all = ['manual', 'automation', 'schedule'];
  assert.deepEqual(setterWarnings(items[0].sets[0], 'Stay', all), []);
  assert.equal(setterWarnings(items[0].sets[0], 'Stay', ['manual']).length, 1);
  assert.match(setterWarnings(items[1].sets[0], 'Stay', all)[0], /arrives as "automation"/);
  assert.match(setterWarnings({ mode: 'Stay', template: false, via: 'service', source: null }, 'Stay', all)[0], /without a source/);
  assert.match(setterWarnings(items[2].sets[0], 'Stay', all)[0], /never sees a request/);
  assert.equal(setterSource(items[1].sets[0]), 'automation');
  assert.equal(describeSetter(items[0], items[0].sets[0]), 'on a time · via alarmo.set_house_mode (schedule)');
  assert.equal(describeSetter(items[1], items[1].sets[0]), 'on presence · via your selector');
});
