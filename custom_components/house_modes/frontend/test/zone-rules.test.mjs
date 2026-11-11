// Unit tests for src/data/zone-rules.ts pure helpers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  describeMatch,
  describeSet,
  emptyRule,
  matchCounts,
  ruleErrors,
  ruleTemplates,
  sensorField,
  specificity,
  toggle,
} from '../src/data/zone-rules.ts';

const reg = {
  labels: { perimeter: 'Perimeter', interior: 'Interior' },
  areas: { kitchen: 'Kitchen', garage: 'Garage' },
  floors: { ground: 'Ground' },
};

test('specificity counts labels each, areas/floors once', () => {
  assert.equal(specificity({ match: { labels: ['a', 'b'], areas: ['x', 'y'], floors: [] } }), 3);
  assert.equal(specificity({ match: { labels: [], areas: [], floors: ['g'] } }), 1);
});

test('ruleErrors mirrors the backend checks', () => {
  const r = emptyRule();
  assert.equal(ruleErrors(r).length, 3);
  r.name = 'x';
  r.match.labels = ['perimeter'];
  r.set = { modes: ['armed_away'] };
  assert.deepEqual(ruleErrors(r), []);
});

test('describeMatch and describeSet read naturally, flag missing refs', () => {
  assert.equal(
    describeMatch({ labels: ['perimeter', 'interior'], areas: ['kitchen', 'gone'], floors: ['ground'] }, reg),
    'Label Perimeter and Interior · Area Kitchen or gone (missing) · Floor Ground'
  );
  assert.equal(
    describeSet({ partition: 'p1', modes: ['armed_away'], use_entry_delay: false, entry_delay: null }, { p1: 'House' }, m =>
      m.replace('armed_', '')
    ),
    'Partition House · Arm modes away · Entry delay off · Entry delay override (s) default'
  );
});

test('matchCounts and field mapping', () => {
  const zones = {
    a: { sources: {}, conflicts: [], rules: ['r1', 'r2'], managed: true },
    b: { sources: {}, conflicts: [], rules: ['r1'], managed: true },
  };
  assert.deepEqual(matchCounts({ zones, needs_partition: [] }), { r1: 2, r2: 1 });
  assert.deepEqual(matchCounts(undefined), {});
  assert.equal(sensorField('partition'), 'area');
  assert.equal(sensorField('modes'), 'modes');
});

test('toggle is immutable and idempotent', () => {
  const l = ['a'];
  assert.deepEqual(toggle(l, 'b', true), ['a', 'b']);
  assert.deepEqual(toggle(l, 'a', true), ['a']);
  assert.deepEqual(toggle(l, 'a', false), []);
  assert.deepEqual(l, ['a']);
});

test('templates pick up labels by name', () => {
  const t = ruleTemplates(reg, 'p1');
  assert.equal(t.length, 3);
  assert.deepEqual(t[0].rule.set, { partition: 'p1' });
  assert.deepEqual(t[1].rule.match.labels, ['perimeter']);
  assert.deepEqual(t[2].rule.set.modes, ['armed_away', 'armed_vacation']);
  assert.deepEqual(ruleTemplates({ labels: {}, areas: {}, floors: {} }, undefined)[1].rule.match.labels, []);
});
