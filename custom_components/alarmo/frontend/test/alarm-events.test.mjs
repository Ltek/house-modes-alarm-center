// Unit tests for src/data/alarm-events.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planMigration, isLegacyEvent, scriptSequence, freeScriptId, nativeActions, eventTargets } from '../src/data/alarm-events.ts';

const ev = (name, actions) => ({ automation_id: name, name, type: 'action', triggers: [{ event: 'armed' }], actions });

test('every old-style event becomes a script', () => {
  for (const actions of [
    [{ service: 'input_boolean.turn_on', entity_id: 'input_boolean.a' }, { service: 'lock.lock', entity_id: 'lock.front' }],
    [{ service: 'light.turn_on', entity_id: 'light.a', data: { brightness: 255 } }],
    [{ service: 'siren.turn_on', entity_id: 'siren.a' }],
    [{ service: 'notify.mobile', data: { message: 'x' } }],
  ])
    assert.equal(planMigration([ev('E', actions)], new Set())[0].kind, 'script', JSON.stringify(actions));
});

test('script keeps the order, targets and data', () => {
  const [p] = planMigration(
    [ev('Siren on!', [{ service: 'siren.turn_on', entity_id: 'siren.a', data: { tone: 'fire' } }, { service: 'notify.x', data: { message: 'm' } }])],
    new Set(['alarm_event_siren_on'])
  );
  assert.equal(p.scriptId, 'alarm_event_siren_on_2');
  assert.deepEqual(p.script.sequence, [
    { action: 'siren.turn_on', target: { entity_id: 'siren.a' }, data: { tone: 'fire' } },
    { action: 'notify.x', data: { message: 'm' } },
  ]);
  assert.equal(p.script.mode, 'queued');
});

test('native events are skipped and not legacy', () => {
  const e = ev('N', nativeActions(['scene.x', 'script.y']));
  assert.equal(isLegacyEvent(e), false);
  assert.deepEqual(eventTargets(e), ['scene.x', 'script.y']);
  assert.equal(planMigration([e], new Set())[0].kind, 'skip');
  assert.deepEqual(e.actions, [
    { service: 'scene.turn_on', entity_id: 'scene.x' },
    { service: 'script.turn_on', entity_id: 'script.y' },
  ]);
  // notifications are never touched
  assert.equal(planMigration([{ ...e, type: 'notification', actions: [{ service: 'notify.a' }] }], new Set()).length, 0);
  assert.equal(isLegacyEvent(ev('L', [{ service: 'switch.turn_on', entity_id: 'switch.a' }])), true);
});

test('script ids are unique slugs', () => {
  const taken = new Set();
  assert.equal(freeScriptId('Ärger: Alarm!', taken), 'alarm_event_arger_alarm');
  assert.equal(freeScriptId('Ärger: Alarm!', taken), 'alarm_event_arger_alarm_2');
  assert.deepEqual(scriptSequence([{}]), []);
});
