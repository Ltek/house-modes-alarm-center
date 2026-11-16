// The built card loaded twice in one page (old + new URL after an update): no error, every element defined once,
// and the browser's customElements.define is left as it is (other cards' registrations never pass through ours).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

test('card bundle loads twice without errors and leaves define alone', async () => {
  await import('/shared/user/code/_tests/dom-stub.mjs');
  // a browser throws when a name is defined twice
  const stubDefine = customElements.define;
  customElements.define = function (n, c) {
    if (customElements.get(n)) throw new DOMException(`the name "${n}" has already been used with this registry`);
    return stubDefine.call(this, n, c);
  };
  const native = customElements.define;
  const card = new URL('../dist/house-modes-alarm-center-card.js', import.meta.url).pathname;
  const dir = mkdtempSync(join(tmpdir(), 'hmac-'));
  for (const n of ['a', 'b']) {
    const f = join(dir, `card-${n}.mjs`);
    copyFileSync(card, f);
    await import(pathToFileURL(f).href);
  }
  assert.equal(customElements.define, native, 'customElements.define was replaced');
  for (const tag of ['house-modes-alarm-center-card', 'house-modes-alarm-center-card-editor', 'hmac-alarm', 'hmac-button'])
    assert.ok(customElements.get(tag), `${tag} not defined`);
});
