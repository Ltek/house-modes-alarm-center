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
  ['/alarmo/house_actions', '02-house-mode-actions'],
  ['/alarmo/house_actions', '03-scenes', async (p) => {
    await p.evaluate(() => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house-actions');
      const ed = v.shadowRoot.querySelector('alarmo-ext-scene-editor');
      ed.startNew();
      ed.draft = { id: 'demo', name: 'Evening lights', icon: 'mdi:weather-sunset',
        entities: { 'light.living_room': { state: 'on', brightness: 153, color_temp_kelvin: 2700 },
                    'light.kitchen': { state: 'on', brightness: 77, rgb_color: [255, 170, 80] },
                    'cover.living_room_blinds': { state: 'open', current_position: 40 },
                    'lock.front_door_lock': { state: 'locked' } } };
      ed.draftModes = ['Stay'];
      ed.scrollIntoView();
    });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.evaluate(() => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house-actions');
      v.shadowRoot.querySelector('ha-card').style.display = 'none';
    });
  }],
  ['/alarmo/zones', '04-zone-assignments'],
  ['/alarmo/zones', '05-zone-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-sensor-table');
      t.expanded = ['binary_sensor.back_door'];
    });
  }],
  ['/alarmo/panel', '06-physical-panel'],
  ['/alarmo/codes', '07-users-codes-keypads', async (p) => {
    await p.evaluate(() => {
      const c = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-codes');
      const k = c && c.shadowRoot.querySelector('alarm-view-connections');
      const d = k && k.shadowRoot.querySelector('details.collapse');
      if (d) d.open = true;
    });
  }],
  ['/alarmo/why', '08-arm-check'],
  ['/alarmo/activity', '09-activity', async (p) => {
    await p.evaluate(() => {
      const a = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-activity');
      const d = a && a.shadowRoot.querySelector('details.collapse');
      if (d) d.open = true;
    });
  }],
  ['/alarmo/backup', '10-backup'],
  ['/alarmo/house', '12-house-modes-shadow', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('alarm-panel').shadowRoot.querySelector('alarm-view-house');
      const t0 = Date.parse('2026-10-28T20:30:00');
      const at = (m) => (t0 + m * 60000) / 1000;
      v.info = { ...v.info, settings: { ...v.info.settings, run_mode: 'shadow', compare_entity: 'input_select.house_mode' } };
      v.draft = JSON.parse(JSON.stringify(v.info.settings));
      v.shadow = { summary: { matched: 9, differed: 2, since: at(0), watching: false }, log: [
        { t: at(0), kind: 'request', ok: null, msg: 'automation: Disarmed → Stay: would set House Stay; would run scene.lock_up' },
        { t: at(0.5), kind: 'request', ok: true, msg: 'Stay: your automations got there after 26 s' },
        { t: at(0.6), kind: 'compare', ok: true, msg: 'input_select.house_mode is Stay' },
        { t: at(21), kind: 'request', ok: null, msg: 'manual: Stay → Disarmed: would set House Disarmed' },
        { t: at(21.1), kind: 'request', ok: true, msg: 'Disarmed: your automations got there after 1 s' },
        { t: at(31), kind: 'request', ok: null, msg: 'automation: Disarmed → Stay: would set House Stay' },
        { t: at(34), kind: 'request', ok: false, msg: 'Stay: after 180 s the partitions are House Disarmed (live House Modes: failed, on failure undo)' },
        { t: at(600), kind: 'external', ok: null, msg: 'partitions changed outside House Modes → House Mode would become Disarmed' },
        { t: at(600.5), kind: 'compare', ok: false, msg: 'input_select.house_mode is Stay, House Modes: Disarmed' },
      ] };
      await v.updateComplete;
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

const files = {
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
  res.end(PAGE);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.log('page:', m.text()));
page.on('pageerror', (e) => console.log('page error:', e.message));
for (const [url, name, action] of SHOTS) {
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
await browser.close();
server.close();
