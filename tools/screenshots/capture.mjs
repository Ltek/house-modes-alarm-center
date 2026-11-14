// Render the panel with demo data and save screenshots to screenshots/.
//   1. HOUSE_MODES_SCREENSHOT_DEMO=1 uv run pytest -q tests/test_screenshot_demo.py   (writes tools/screenshots/demo.json)
//   2. node tools/screenshots/capture.mjs                                          (needs playwright-core + Chromium)
// The pages and their file names are listed in SHOTS. Push the PNGs; the GitHub workflow updates the README gallery.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const FE = path.join(ROOT, 'custom_components/house_modes/frontend');
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
  ['/house_modes/house', '01-house-modes', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('details.hm-tabsec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelector('details.hm-tabsec').open = true;
      await new Promise(r => setTimeout(r, 100));
    });
  }],
  ['/house_modes/actions', '02-alarm-events'],
  ['/house_modes/actions', '19-alarm-event-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-actions');
      t.shadowRoot.querySelector('.toolbar ha-button').click();
    });
  }],
  ['/house_modes/zones', '04-zone-assignments', async (p) => {
    await p.evaluate(async () => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-sensor-table');
      for (let i = 0; i < 30 && !t.shadowRoot.querySelector('details.tab-sec'); i++) await new Promise(r => setTimeout(r, 100));
      t.shadowRoot.querySelector('details.tab-sec').open = true;
    });
  }],
  ['/house_modes/notifications', '17-notifications', async (p) => {
    await p.evaluate(async () => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-actions');
      const sa = t.shadowRoot.querySelector('hm-smart-alerts');
      for (let i = 0; i < 30 && !sa.info; i++) await new Promise(r => setTimeout(r, 100));
      t.shadowRoot.querySelectorAll('details.tab-sec').forEach((d, i) => (d.open = i > 0));
      await new Promise(r => setTimeout(r, 100));
    });
  }],
  ['/house_modes/notifications/open/house', '27-house-mode-notifications', async (p) => {
    await p.evaluate(async () => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-actions');
      const hn = t.shadowRoot.querySelector('hm-house-notifications');
      for (let i = 0; i < 30 && !hn.shadowRoot.querySelector('details.event'); i++) await new Promise(r => setTimeout(r, 100));
      hn.shadowRoot.querySelectorAll('details.event')[0].open = true;
      await new Promise(r => setTimeout(r, 100));
    });
  }],
  ['/house_modes/notifications', '18-notification-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-actions');
      t.shadowRoot.querySelector('ha-button').click();
    });
  }],
  ['/house_modes/zones', '05-zone-editor', async (p) => {
    await p.evaluate(() => {
      const t = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-sensor-table');
      t.shadowRoot.querySelector('details.tab-sec').open = true;
      t.expanded = ['binary_sensor.back_door'];
    });
  }],
  ['/house_modes/panel', '06-physical-panel', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-panel');
      const m = v.shadowRoot.querySelector('hm-view-mirrors');
      for (let i = 0; i < 20 && !m.shadowRoot.querySelector('details.tab-sec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelector('details.tab-sec').open = true;
      m.shadowRoot.querySelector('details.tab-sec').open = true;
    });
  }],
  ['/house_modes/codes', '07-users-codes-keypads', async (p) => {
    await p.evaluate(() => {
      const c = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-codes');
      c.shadowRoot.querySelectorAll('details.uc-sec').forEach(d => (d.open = true));
      const k = c && c.shadowRoot.querySelector('hm-view-connections');
      const d = k && k.shadowRoot.querySelector('details.collapse');
      if (d) d.open = true;
    });
  }],
  ['/house_modes/activity/arm_check', '08-arm-check'],
  ['/house_modes/activity', '09-activity', async (p) => {
    await p.evaluate(async () => {
      const a = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-activity');
      a.seqOpen = true;
      await a.updateComplete;
      const d = a && a.shadowRoot.querySelector('details.collapse.seq');
      if (d) d.open = true;
    });
  }],
  ['/house_modes/backup', '10-backup', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-backup');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('details.tab-sec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelectorAll('details.tab-sec')[1].open = true;
    });
  }],
  ['/house_modes/partitions', '22-partitions-arm-modes', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-general');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('details.tab-sec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelectorAll('details.tab-sec').forEach(d => (d.open = true));
      await new Promise(r => setTimeout(r, 300));
    });
  }],
  ['/house_modes/house', '12-house-modes-shadow', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('details.hm-tabsec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelector('details.hm-tabsec').open = true;
      await new Promise(r => setTimeout(r, 100));
      v.info = { ...v.info, settings: { ...v.info.settings, run_mode: 'shadow', compare_entity: 'input_select.house_mode' } };
      v.draft = JSON.parse(JSON.stringify(v.info.settings));
      await v.updateComplete;
    });
  }],
  ['/house_modes/activity', '21-shadow-comparison', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-activity');
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
  ['/house_modes/house', '14-house-mode-editor', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('details.hm-tabsec'); i++) await new Promise(r => setTimeout(r, 100));
      v.shadowRoot.querySelector('details.hm-tabsec').open = true;
      await new Promise(r => setTimeout(r, 100));
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
  ['/house_modes/house', '20-script-actions-all-modes', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
      const d = [...v.shadowRoot.querySelectorAll('details.hm-tabsec')].find(x => x.textContent.includes('All Modes'));
      d.open = true;
      await new Promise(r => setTimeout(r, 150));
      d.scrollIntoView();
      window.scrollBy(0, -80);
    });
  }],
  ['/house_modes/house', '23-automations-all-modes', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
      for (let i = 0; i < 30 && !v.actions; i++) await new Promise(r => setTimeout(r, 100));
      const d = [...v.shadowRoot.querySelectorAll('details.hm-tabsec')].find(x => x.textContent.includes('Automations - All Modes'));
      d.open = true;
      await new Promise(r => setTimeout(r, 150));
      d.scrollIntoView();
      window.scrollBy(0, -80);
    });
  }],
  ['/house_modes/house', '13-house-modes-detect', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-house');
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
  ['/house_modes/actions', '11-alarm-events-migrate', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-actions');
      const m = v.shadowRoot.querySelector('hm-event-migrate');
      m.events = [...m.events, { automation_id: 'x', type: 'action', name: 'Siren and hall light on trigger',
        triggers: [{ event: 'triggered' }],
        actions: [{ service: 'siren.turn_on', entity_id: 'siren.hall', data: { tone: 'alarm', duration: 300 } },
                  { service: 'light.turn_on', entity_id: 'light.hall', data: { brightness: 255 } }] }];
      await m.updateComplete;
      m.shadowRoot.querySelector('ha-button').click();
      await new Promise(r => setTimeout(r, 200));
    });
  }],
  ['/house_modes/general?demo=ask', '24-import-from-alarmo'],
  ['/house_modes/general?demo=imported', '26-quick-start-moving-from-alarmo', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-quick-start');
      for (let i = 0; i < 30 && !v.shadowRoot.querySelector('hm-alarmo-import[mode="backup"]'); i++) await new Promise(r => setTimeout(r, 100));
      const imp = v.shadowRoot.querySelector('hm-alarmo-import[mode="backup"]');
      for (let i = 0; i < 30 && !imp.shadowRoot.querySelector('details.ref'); i++) await new Promise(r => setTimeout(r, 100));
      imp.shadowRoot.querySelectorAll('details.ref').forEach(d => (d.open = true));
    });
  }],
  ['/house_modes/backup?demo=imported', '25-import-done-and-references', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-backup');
      v.shadowRoot.querySelector('details.tab-sec').open = true;
      const imp = v.shadowRoot.querySelector('hm-alarmo-import');
      for (let i = 0; i < 30 && !imp.shadowRoot.querySelector('ha-button'); i++) await new Promise(r => setTimeout(r, 100));
      imp.shadowRoot.querySelector('.refs ha-button').click();
      await new Promise(r => setTimeout(r, 400));
      imp.shadowRoot.querySelectorAll('details.ref').forEach(d => (d.open = true));
    });
  }],
  ['/house_modes/general', '00-quick-start', async (p) => {
    await p.evaluate(async () => {
      const v = document.querySelector('house-modes-panel').shadowRoot.querySelector('hm-view-quick-start');
      await new Promise(r => setTimeout(r, 300));
      v.shadowRoot.querySelectorAll('details.tab-sec').forEach(d => (d.open = true));
      await new Promise(r => setTimeout(r, 100));
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
  await import('/house-modes-panel.js');
  const el = document.createElement('house-modes-panel');
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
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_house_modes: false, show_alarm: false,
    show_alarm_status: false, show_history: true, show_panel_keypad: true, popup_sections: ['keypad'], show_chevron: true, history: { shown: ['house', 'alarm'], hide_short: 60, max_rows: 8 } }));
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_house_modes: false, show_alarm: false, show_panel_keypad: true }));
  // collapsed to its Status section, with a Button Menu inside it on the right (keypad and History in popups)
  cols[2].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', collapsible: true, start_collapsed: true, show_panel_keypad: true,
    show_history: true, display_replace: [{ from: '****', to: '*' }],
    status_sections: [{ id: 'house', name: 'House Mode Status', lines: ['house_mode', 'panel_line1', 'panel_line2'], countdown: true }],
    button_menus: [{ id: 'm1', name: 'Additional Buttons', embed_in: 'status:house', show_labels: false,
      buttons: [{ section: 'keypad', action: 'popup' }, { section: 'history', action: 'popup' }] }] }));
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
  // a Button Menu (chips): Arm / disarm shown in place (pressed below), the keypad and History in popups
  const menuCard = mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_house_modes: false, show_alarm_status: false,
    show_panel_keypad: true, show_history: true, arm_shape: 'rounded', show_arm_options: false, alarm: { hide_keypad: true },
    button_menus: [{ id: 'm1', name: 'Menu', buttons: [{ section: 'alarm' }, { section: 'keypad', action: 'popup' }, { section: 'history', action: 'popup' }] }],
    section_order: ['menu:m1', 'alarm'] });
  cols[2].appendChild(menuCard);
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_alarm: false, columns: 5, modes_shape: 'round', modes_gap: 8,
    styles: { mode_button: { active_background: 'mode', border: 'mode' }, mode_icon: { color: 'mode', active_color: '#ffffff' } } }));
  cols[1].appendChild(mk({ entity: 'alarm_control_panel.ground_floor', show_header: false, show_alarm: false, columns: 5,
    styles: { mode_button: { background: 'transparent', border: 'mode', active_background: 'mode', text_follows_icon: true },
              mode_icon: { color: 'mode', active_color: '#ffffff' } } }));
  await new Promise(r => setTimeout(r, 400));
  menuCard.shadowRoot.querySelector('.mchip')?.click();
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
    effects: { border: 'both', status_icon: 'glow' }, show_history: true,
    button_menus: [{ id: 'm1', name: 'Quick buttons', style: 'mode', buttons: [{ section: 'keypad', action: 'popup' }, { section: 'history' }] }] });
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
  '/house-modes-panel.js': [path.join(FE, 'dist/house-modes-panel.js'), 'text/javascript'],
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
// Chromium must not inherit a node wrapper's LD_LIBRARY_PATH (its older libstdc++ breaks the GPU libraries)
const env = { ...process.env };
delete env.LD_LIBRARY_PATH;
const browser = await chromium.launch({ env, ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.log('page:', m.text()));
page.on('pageerror', (e) => console.log('page error:', e.message));
// ONLY=01-house-modes,02-actions captures just those (and skips the card pages)
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
for (const [url, name, action] of SHOTS) {
  if (ONLY && !ONLY.includes(name)) continue;
  // the panel remembers "came from Notifications" in sessionStorage and would redirect /house_modes/actions there
  await page.evaluate(() => { try { sessionStorage.clear(); } catch (_e) { /* about:blank */ } });
  await page.goto(base + url);
  await page.waitForFunction(() => {
    const p = document.querySelector('house-modes-panel');
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
