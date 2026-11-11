// Every zone setting shown in the table / rule editor has help text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZONE_HELP, helpText } from '../src/data/zone-help.ts';
import { SET_FIELD_LABELS, sensorField } from '../src/data/zone-rules.ts';

test('every rule field and table column has help', () => {
  const fields = [...Object.keys(SET_FIELD_LABELS), 'zone', 'group', 'area'];
  for (const f of fields) assert.ok(helpText(f).length > 20, `missing help for ${f}`);
  for (const f of Object.keys(SET_FIELD_LABELS)) assert.ok(helpText(sensorField(f)), f);
});

test('the two that prompted this are explained', () => {
  assert.match(ZONE_HELP.auto_bypass.text, /left out/);
  assert.match(ZONE_HELP.group.text, /several/);
  assert.equal(helpText('nope'), '');
});
