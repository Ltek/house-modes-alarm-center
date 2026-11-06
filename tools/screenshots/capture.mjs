// Render the Alarmo panel with demo data and save screenshots to screenshots/.
//   1. ALARMO_SCREENSHOT_DEMO=1 uv run pytest -q tests/test_screenshot_demo.py   (writes tools/screenshots/demo.json)
//   2. node tools/screenshots/capture.mjs                                          (needs playwright-core + Chromium)
// The pages and their file names are listed in SHOTS. Push the PNGs; the GitHub workflow updates the README gallery.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const FE = path.join(ROOT, 'custom_components/alarmo/frontend');
const OUT = path.join(ROOT, 'screenshots');
const require = createRequire(path.join(FE, 'package.json'));
let chromium;
for (const mod of ['playwright-core', 'playwright']) {
  try {
    ({ chromium } = require(mod));
    break;
  } catch (_e) { /* try the next one */ }
}
if (!chromium) {
  try {
    ({ chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core'));
  } catch (_e) {
    console.error('playwright-core not found: npm i --no-save playwright-core (and npx playwright install chromium)');
    process.exit(1);
  }
}

// page path, file name, optional action before the shot
const SHOTS = [
  ['/alarmo/house', '01-house-modes'],
  ['/alarmo/actions', '02-alarm-events'],
  ['/alarmo/actions', '19-alarm-event-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-actions');
      t.shadowRoot.querySelector('.toolbar ha-button').click();
    });
  }],
  ['/alarmo/zones', '04-zone-assignments'],
  ['/alarmo/notifications', '17-notifications'],
  ['/alarmo/notifications', '18-notification-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-actions');
      t.shadowRoot.querySelector('ha-button').click();
    });
  }],
  ['/alarmo/zones', '05-zone-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-sensor-table');
      t.expanded = ['binary_sensor.back_door'];
    });
  }],
  ['/alarmo/panel', '06-physical-panel', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-panel');
      const m = v.shadowRoot.querySelector('alarm-view-mirrors');
      for (let i = 0; i < 20 && !m.shadowRoot.querySelector('details.pz-list'); i++) await new Promise(r => setTimeout(r, 100));
      m.shadowRoot.querySelector('details.pz-list').open = true;
    });
  }],
  ['/alarmo/codes', '07-users-codes-keypads', async (p) => {
    await p.evaluate(() => {
      const c = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-codes');
      c.shadowRoot.querySelectorAll('details.uc-sec').forEach(d => (d.open = true));
      const k = c && c.shadowRoot.querySelector('alarm-view-connections');
      const d = k && k.shadowRoot.querySelector('details.collapse');
      if (d) d.open = true;
    });
  }],
  ['/alarmo/activity/arm_check', '08-arm-check'],
  ['/alarmo/activity', '09-activity', async (p) => {
    await p.evaluate(() => {
      const a = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-activity');
      const d = a && a.shadowRoot.querySelector('details.collapse.seq');
      if (d) d.open = true;
    });
  }],
  ['/alarmo/backup', '10-backup'],
  ['/alarmo/house', '12-house-modes-shadow', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house');
      v.info = { ...v.info, settings: { ...v.info.settings, run_mode: 'shadow', compare_entity: 'input_select.house_mode' } };
      v.draft = JSON.parse(JSON.stringify(v.info.settings));
      await v.updateComplete;
    });
  }],
  ['/alarmo/activity', '21-shadow-comparison', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-activity');
      for (let i = 0; i < 30 && !v.house; i++) await new Promise(r => setTimeout(r, 100));
      const t0 = Date.parse('2026-10-28T20:30:00');
      const at = (m) => (t0 + m * 60000) / 1000;
      v.house = { ...v.house, settings: { ...v.house.settings, run_mode: 'shadow', enabled: true } };
      v.shadow = { summary: { matched: 9, differed: 2, since: at(0), watching: false }, log: [
        { t: at(0), kind: 'request', ok: null, msg: 'automation: Disarmed → Stay: would set House Stay; would run script.lock_up' },
        { t: at(0.5), kind: 'request', ok: true, msg: 'Stay: your automations got there after 26 s' },
        { t: at(0.6), kind: 'compare', ok: true, msg: 'input_select.house_mode is Stay' },
        { t: at(21), kind: 'request', ok: null, msg: 'manual: Stay → Disarmed: would set House Disarmed' },
        { t: at(21.1), kind: 'request', ok: true, msg: 'Disarmed: your automations got there after 1 s' },
        { t: at(31), kind: 'request', ok: null, msg: 'automation: Disarmed → Stay: would set House Stay' },
        { t: at(34), kind: 'request', ok: false, msg: 'Stay: after 180 s the partitions are House Disarmed (live House Modes: failed, on failure undo)' },
        { t: at(600), kind: 'external', ok: null, msg: 'partitions changed outside House Modes → House Mode would become Disarmed' },
        { t: at(600.5), kind: 'compare', ok: false, msg: 'input_select.house_mode is Stay, House Modes: Disarmed' },
      ] };
      v.shadowOpen = true;
      await v.updateComplete;
    });
  }],
  ['/alarmo/house', '14-house-mode-editor', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house');
      const sleep = v.draft.modes.find(m => /sleep/i.test(m.name)) || v.draft.modes[1];
      v.draft.modes.forEach(m => { if (/sleep/i.test(m.name)) m.icon = 'mdi:bed'; });
      v.info.settings.modes.forEach(m => { if (/sleep/i.test(m.name)) m.icon = 'mdi:bed'; });
      v.draft = JSON.parse(JSON.stringify(v.draft));
      v.open = [sleep.id];
      await v.updateComplete;
      const secs = v.shadowRoot.querySelectorAll('.hm-ed details.hm-sec');
      [3, 4, 5].forEach(i => secs[i] && (secs[i].open = true));
      await new Promise(r => setTimeout(r, 150));
      v.shadowRoot.querySelector('.hm-ed').scrollIntoView();
      window.scrollBy(0, -60);
    });
  }],
  ['/alarmo/house', '20-house-mode-actions-by-script', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house');
      const d = v.shadowRoot.querySelectorAll('details.hm-every')[0];
      d.open = true;
      await new Promise(r => setTimeout(r, 150));
      d.scrollIntoView();
      window.scrollBy(0, -80);
    });
  }],
  ['/alarmo/house', '13-house-modes-detect', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house');
      const key = v.info.targets.find(t => t.key !== 'master')?.key || v.info.targets[0].key;
      const sel = [['input_select.house_mode', 'House Mode'], ['input_select.house_mode_last', 'House Mode - Last'],
                   ['input_select.house_mode_selector', 'House Mode Selector']].map(([e, n]) => ({ entity_id: e, name: n }));
      const s = (name, icon, t, basis, seen, share, note) => ({ name, icon, targets: t ? { [key]: t } : {}, basis, seen, share: t && share ? { [key]: share } : {}, note });
      v.detect = {
        entities: { selector: 'input_select.house_mode_selector', current: 'input_select.house_mode', previous: 'input_select.house_mode_last' },
        selects: sel, changes: 189, span: [0, 18 * 86400], targets: v.info.targets,
        suggestions: [
          s('Disarmed', 'mdi:shield-lock-open-outline', 'disarmed', 'activity', 76, 1, ''),
          s('Stay', 'mdi:shield-home', 'armed_home', 'activity', 68, 0.75, 'also seen: Custom 16×'),
          s('Sleep', 'mdi:weather-night', 'armed_home', 'activity', 19, 0.79, 'the activity log disagrees with the name; the log is used'),
          s('Away', 'mdi:shield-lock', 'armed_away', 'activity', 25, 0.72, 'also seen: Disarmed 6×'),
          s('Vacation', 'mdi:shield-airplane', 'armed_vacation', 'name', 0, 0, ''),
          s('Guest', 'mdi:account-group', 'disarmed', 'activity', 1, 1, ''),
        ],
      };
      v.detectPick = ['Disarmed', 'Stay', 'Sleep', 'Away', 'Vacation', 'Guest'];
      await v.updateComplete;
      v.shadowRoot.querySelector('.subhead').scrollIntoView();
    });
  }],
  ['/alarmo/actions', '11-alarm-events-migrate', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-actions');
      const m = v.shadowRoot.querySelector('alarmo-ext-event-migrate');
      m.events = [...m.events, { automation_id: 'x', type: 'action', name: 'Siren and hall light on trigger',
        triggers: [{ event: 'triggered' }],
        actions: [{ service: 'siren.turn_on', entity_id: 'siren.hall', data: { tone: 'alarm', duration: 300 } },
                  { service: 'light.turn_on', entity_id: 'light.hall', data: { brightness: 255 } }] }];
      await m.updateComplete;
      m.shadowRoot.querySelector('ha-button').click();
      await new Promise(r => setTimeout(r, 200));
    });
  }],
  ['/alarmo/general', '00-quick-start', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-quick-start');
      await new Promise(r => setTimeout(r, 300));
      v.shadowRoot.querySelectorAll('details.collapse')[1].open = true;
      await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelector('details.zgroup')?.setAttribute('open', '');
    });
  }],
];

const MAX_HEIGHT = 1500;
const THEME = `:root{--primary-color:#03a9f4;--rgb-primary-color:3,169,244;--accent-color:#ff9800;--primary-text-color:#e1e1e1;
  --rgb-primary-text-color:225,225,225;--secondary-text-color:#9b9b9b;--disabled-text-color:#6f6f6f;--text-primary-color:#fff;
  --primary-background-color:#111111;--secondary-background-color:#202020;--card-background-color:#1c1c1c;
  --divider-color:rgba(225,225,225,.12);--error-color:#ef5350;--warning-color:#ffa600;--success-color:#43a047;--info-color:#039be5;
  --state-icon-color:#44739e;--state-active-color:#fdd835;--input-fill-color:#2a2a2a;--switch-checked-track-color:#0288d1;
  --switch-unchecked-track-color:#555;--switch-unchecked-button-color:#999;--mdc-theme-primary:#03a9f4;--app-header-background-color:#101e24;
  --app-header-text-color:#e1e1e1;--code-font-family:monospace;color-scheme:dark}
  html,body{margin:0;background:var(--primary-background-color);color:var(--primary-text-color);font-family:Roboto,"Noto Sans",Arial,sans-serif;font-size:14px}`;
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>${THEME}</style></head><body>
<script type="module">
  await import('/shim.js');
  await import('/alarm-panel.js');
  const el = document.createElement('alarm-panel');
  el.hass = window.demoHass;
  el.narrow = false;
  document.body.appendChild(el);
</script></body></html>`;

// the dashboard card, three ways: everyday (House Modes + alarm), the panel keypad, collapsed
const CARD_PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>${THEME}
  body{padding:16px;display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
  .col{width:420px;display:flex;flex-direction:column;gap:16px}</style></head><body>
<script type="module">
  await import('/shim.js');
  window.loadCardHelpers = async () => ({ createCardElement: async () => ({ constructor: { getConfigElement: async () => {} } }) });
  await import('/card.js');
  const mk = (cfg) => { const c = document.createElement('house-modes-alarm-center-card'); c.setConfig({ type: 'custom:house-modes-alarm-center-card', ...cfg }); c.hass = window.demoHass; return c; };
  const cols = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
  cols.forEach(c => { c.className = 'col'; document.body.appendChild(c); });
  cols[0].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', display_replace: [{ from: '*' }],
    styles: { header_section: { background: '#162430' } }, effects: { border: 'glow', status_icon: 'glow' } }));
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_house_modes: false, show_alarm: false, show_panel_keypad: true }));
  cols[2].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', collapsible: true, start_collapsed: true, show_chevron: true }));
  cols[2].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_alarm: false, columns: 4, modes_align: 'center',
    styles: { mode_name: { font: 'sans', weight: 600 }, line2: { color: 'var(--secondary-text-color)' } } }));
  // one combined Status section: House Mode and alarm state, then the House Mode buttons
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', status_sections: [
      { id: 's1', name: 'Home', lines: ['house_mode', 'alarm_state', 'since'] }],
    section_order: ['status:s1', 'house_modes'], show_alarm: false }));
  // the alarm only: Alarm Panel Status first (with the panel display), then the buttons
  cols[2].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_house_modes: false,
    section_order: ['alarm_status', 'alarm'], show_alarm_line1: true, show_alarm_line2: true, display_replace: [{ from: '*' }],
    alarm: { hide_keypad: true }, show_arm_options: false }));
  cols[2].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_house_modes: false, show_alarm_status: false, alarm_collapsible: true, alarm_start_collapsed: true, show_chevron: true,
    show_panel_keypad: true, keypad_collapsible: true }));
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_alarm: false, columns: 5, modes_shape: 'round', modes_gap: 8,
    styles: { mode_button: { active_background: 'mode', border: 'mode' }, mode_icon: { color: 'mode', active_color: '#ffffff' } } }));
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_alarm: false, columns: 5,
    styles: { mode_button: { background: 'transparent', border: 'mode', active_background: 'mode', text_follows_icon: true },
              mode_icon: { color: 'mode', active_color: '#ffffff' } } }));
  // show the effects (a still frame of the glow)
  await new Promise(r => setTimeout(r, 600));
  window.__hmacFxPreview.set(true);
  await new Promise(r => setTimeout(r, 300));
  window.cardsReady = true;
</script></body></html>`;

const EDITOR_PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>${THEME}
  body{padding:16px;display:flex;gap:24px;align-items:flex-start} .ed{width:560px}</style></head><body>
<script type="module">
  await import('/shim.js');
  await import('/card.js');
  const ed = document.createElement('house-modes-alarm-center-card-editor');
  ed.hass = window.demoHass;
  ed.setConfig({ type: 'custom:house-modes-alarm-center-card', entity: 'alarm_control_panel.ground_floor', collapsible: true, alarm_collapsible: true,
    show_panel_keypad: true, display_replace: [{ from: '*' }, { from: 'DISARMED', to: 'Disarmed' }],
    effects: { border: 'both', status_icon: 'glow' } });
  const box = document.createElement('div'); box.className = 'ed'; box.appendChild(ed); document.body.appendChild(box);
  await new Promise(r => setTimeout(r, 400));
  const root = ed.shadowRoot;
  root.querySelector('details[data-id="card"]').open = false;
  root.querySelector('details[data-id="sections"]').open = true;
  await new Promise(r => setTimeout(r, 100));
  root.querySelector('details[data-id="sections"] details.sub')?.setAttribute('open', '');
  root.querySelector('details[data-id="sections"]').open = true;
  window.editorReady = true;
</script></body></html>`;

const files = {
  '/card.js': [path.join(FE, 'dist/house-modes-alarm-center-card.js'), 'text/javascript'],
  '/shim.js': [path.join(HERE, 'shim.js'), 'text/javascript'],
  '/demo.json': [path.join(HERE, 'demo.json'), 'application/json'],
  '/alarm-panel.js': [path.join(FE, 'dist/alarm-panel.js'), 'text/javascript'],
  '/mdi.js': [path.join(FE, 'node_modules/@mdi/js/mdi.js'), 'text/javascript'],
};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const f = files[url.pathname];
  if (f) {
    res.writeHead(200, { 'content-type': f[1] });
    return res.end(fs.readFileSync(f[0]));
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(url.pathname === '/card' ? CARD_PAGE : url.pathname === '/editor' ? EDITOR_PAGE : PAGE);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.log('page:', m.text()));
page.on('pageerror', (e) => console.log('page error:', e.message));
// ONLY=01-house-modes,02-actions captures just those (and skips the card pages)
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
for (const [url, name, action] of SHOTS) {
  if (ONLY && !ONLY.includes(name)) continue;
  // the panel remembers "came from Notifications" in sessionStorage and would redirect /alarmo/actions there
  await page.evaluate(() => { try { sessionStorage.clear(); } catch (_e) { /* about:blank */ } });
  await page.goto(base + url);
  await page.waitForFunction(() => {
    const p = document.querySelector('alarm-panel');
    return p && p.shadowRoot && p.shadowRoot.querySelector('.view');
  }, null, { timeout: 15000 });
  await page.waitForTimeout(1200);
  if (action) {
    await action(page);
    await page.waitForTimeout(600);
  }
  const file = path.join(OUT, `${name}.png`);
  // long pages (the zone table) are cut at MAX_HEIGHT so the gallery stays readable
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width: 1360, height: Math.min(height, MAX_HEIGHT) } });
  console.log('saved', path.relative(ROOT, file));
}
if (ONLY) { await browser.close(); server.close(); process.exit(0); }
// dashboard card
await page.setViewportSize({ width: 1360, height: 760 });
await page.goto(base + '/card');
await page.waitForFunction(() => window.cardsReady, null, { timeout: 15000 });
await page.waitForTimeout(1500);
{
  const file = path.join(OUT, '15-dashboard-card.png');
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1360, height: Math.min(height, MAX_HEIGHT) } });
  console.log('saved', path.relative(ROOT, file));
}
// card editor
await page.setViewportSize({ width: 1360, height: 900 });
await page.goto(base + '/editor');
await page.waitForFunction(() => window.editorReady, null, { timeout: 15000 });
await page.waitForTimeout(800);
{
  const file = path.join(OUT, '16-card-editor.png');
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 620, height: Math.min(height, MAX_HEIGHT) } });
  console.log('saved', path.relative(ROOT, file));
}
await browser.close();
server.close();
