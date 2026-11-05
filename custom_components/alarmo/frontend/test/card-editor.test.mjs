// The editor's color classification (CARD_DESIGN_SYSTEM §3)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// colorMode lives in the editor module (Lit, not loadable in node): test the same rule from its source
const src = readFileSync(new URL('../card/src/editor.ts', import.meta.url), 'utf8');
test('four color modes and the shared token block', () => {
  assert.match(src, /if \(v === ''\) return 'default';/);
  assert.match(src, /\^#\[0-9a-fA-F\]\{3,8\}\$/);
  assert.match(src, /THEME_COLORS\.some/);
  const guide = '/shared/user/code/CARD_DESIGN_SYSTEM.md'; // the design guide, where it is available
  if (!existsSync(guide)) return;
  const design = readFileSync(guide, 'utf8');
  const block = t => t.slice(t.indexOf('/* Font sizes (by role'), t.indexOf('/* value readout column width */')).split('\n').map(l => l.trim()).join('\n');
  assert.equal(block(src), block(design));
});
