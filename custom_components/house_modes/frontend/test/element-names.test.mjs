// Coexistence with an installed Alarmo (upstream or the Alarmo-based build): both panels can load in the same browser
// only if no element name is defined twice. Every panel element is hm-* (or house-modes-panel); the card keeps its
// own house-modes-alarm-center-card / hmac-* names, which card/src/guard.ts defines once only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// every element the Alarmo-based build (2026.11.10.93) and upstream Alarmo's panel define
const OLD_PANEL = `add-sensors-card alarm-mode-card alarm-panel alarm-view-actions alarm-view-activity alarm-view-backup
  alarm-view-codes alarm-view-connections alarm-view-general alarm-view-ha-zones alarm-view-house alarm-view-mirrors
  alarm-view-panel alarm-view-quick-start alarm-view-sensor-table alarm-view-sensors alarm-view-why alarmo-chip
  alarmo-chip-set alarmo-collapsible-body alarmo-collapsible-group alarmo-collapsible-header alarmo-collapsible-item
  alarmo-collapsible-section alarmo-duration-picker alarmo-ext-add-sensors alarmo-ext-event-migrate alarmo-ext-icon-field
  alarmo-ext-import-dialog alarmo-ext-keypad-action alarmo-ext-multi-picker alarmo-ext-page-intro alarmo-ext-reveal-code
  alarmo-ext-rule-editor alarmo-ext-rules-card alarmo-ext-rules-preview alarmo-ext-slider alarmo-ext-smart-alerts
  alarmo-ext-status-strip alarmo-ext-user-locks alarmo-select alarmo-selector alarmo-settings-row alarmo-table
  area-config-card automation-editor-card confirm-delete-dialog create-area-dialog create-sensor-group-dialog
  edit-master-dialog error-dialog manage-sensor-groups-dialog mqtt-config-card notification-editor-card
  sensor-editor-card sensors-overview-card user-editor-card alarmo-card`.split(/\s+/);

const files = (dir) =>
  readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : [];
  });

const defined = (dir) =>
  files(dir).flatMap(f => [...readFileSync(f, 'utf8').matchAll(/@customElement\(\s*['"]([a-z0-9-]+)['"]\s*\)/g)].map(m => m[1]));

test('panel elements never clash with an installed Alarmo panel', () => {
  const names = defined(new URL('../src', import.meta.url).pathname);
  assert.ok(names.length > 50);
  for (const n of names) {
    assert.ok(n === 'house-modes-panel' || n.startsWith('hm-'), `panel element ${n} must be hm-*`);
    assert.ok(!OLD_PANEL.includes(n), `${n} is also defined by Alarmo`);
  }
  assert.equal(new Set(names).size, names.length, 'an element is defined twice');
});

test('card elements keep their own names (guarded, defined once)', () => {
  const names = defined(new URL('../card/src', import.meta.url).pathname);
  for (const n of names) {
    assert.ok(n.startsWith('hmac-') || n.startsWith('house-modes-alarm-center-card'), `card element ${n}`);
    assert.ok(!OLD_PANEL.includes(n), `${n} is also defined by Alarmo`);
  }
  const guard = readFileSync(new URL('../card/src/guard.ts', import.meta.url), 'utf8');
  assert.match(guard, /house-modes-alarm-center-card\|hmac-/);
});

test('no websocket command, service or event of the old domain is used', () => {
  for (const dir of ['../src', '../card/src']) {
    for (const f of files(new URL(dir, import.meta.url).pathname)) {
      const text = readFileSync(f, 'utf8');
      assert.doesNotMatch(text, /type:\s*['"]alarmo\//, f);
      assert.doesNotMatch(text, /callService\(\s*['"]alarmo['"]/, f);
      assert.doesNotMatch(text, /['"]alarmo_[a-z_]+['"]/, f);
    }
  }
});
