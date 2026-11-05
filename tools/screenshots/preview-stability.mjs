import http from 'node:http'; import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
// Regression check (CARD_DESIGN_SYSTEM §5 "Never fully refresh"): the dashboard editor creates a new card element
// for config edits; the new element must show the same open/closed sections at once, with no loading state.
//   PLAYWRIGHT_CORE=…/playwright-core/index.mjs node tools/screenshots/preview-stability.mjs   (run by tools/package.sh)
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const R=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'), FE=R+'/custom_components/alarmo/frontend';
const files={'/shim.js':R+'/tools/screenshots/shim.js','/demo.json':R+'/tools/screenshots/demo.json','/card.js':FE+'/dist/house-modes-alarm-center-card.js','/mdi.js':FE+'/node_modules/@mdi/js/mdi.js'};
const srv=http.createServer((q,r)=>{const u=new URL(q.url,'http://x').pathname; if(files[u]){r.writeHead(200,{'content-type':u.endsWith('json')?'application/json':'text/javascript'});return r.end(fs.readFileSync(files[u]));}
 r.writeHead(200,{'content-type':'text/html'}); r.end(`<!doctype html><body><div id=box style="width:420px"></div><script type="module">
 await import('/shim.js'); window.loadCardHelpers=async()=>({createCardElement:async()=>({constructor:{getConfigElement:async()=>{}}})});
 // slow backend: a refetch takes 400 ms, so a "loading" render would be visible
 const orig=window.demoHass.callWS; window.demoHass.callWS=async m=>{await new Promise(r=>setTimeout(r,400)); return orig(m);};
 await import('/card.js'); window.ready=1;</script>`);});
await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const b=await chromium.launch(); const p=await b.newPage();
await p.goto(`http://127.0.0.1:${srv.address().port}/`); await p.waitForFunction(()=>window.ready);
const cfg={type:'x',entity:'alarm_control_panel.ground_floor',collapsible:true,start_collapsed:false,alarm_collapsible:true,alarm_start_collapsed:true,keypad_collapsible:true,show_panel_keypad:true};
const view = () => p.evaluate(() => { const c=document.querySelector('house-modes-alarm-center-card'); const r=c.shadowRoot;
  return { loading: !!r.querySelector('.loading'), modes: !!r.querySelector('.modes'), alarmOpen: !!r.querySelector('hmac-alarm.alarm-controls'), keypadOpen: !!r.querySelector('.keys'), alarmDrawn: !!(r.querySelector('hmac-alarm.alarm-controls')?.shadowRoot?.querySelector('hmac-actions-bar')) }; });
const mount = (cfg) => p.evaluate((cfg) => { const box=document.getElementById('box'); box.innerHTML=''; const c=document.createElement('house-modes-alarm-center-card'); c.setConfig(cfg); c.hass=window.demoHass; box.appendChild(c); }, cfg);
await mount(cfg); await p.waitForTimeout(1200);
const want = (name, got, exp) => { for (const [k, v] of Object.entries(exp)) if (got[k] !== v) { console.error(`FAIL ${name}: ${k} is ${got[k]}, expected ${v}`); process.exitCode = 1; } };
want('first', await view(), { loading: false, modes: true, alarmOpen: false, keypadOpen: false });
// user opens the alarm bar and the keypad bar
await p.evaluate(()=>{const r=document.querySelector('house-modes-alarm-center-card').shadowRoot; r.querySelectorAll('button.bar').forEach(b=>b.click());}); await p.waitForTimeout(1600);
want('opened', await view(), { alarmOpen: true, keypadOpen: true, alarmDrawn: true });
// same element, a style edit (setConfig again)
await p.evaluate(()=>{const c=document.querySelector('house-modes-alarm-center-card'); c.setConfig({...c.config, styles:{mode_name:{size:30}}});}); await p.waitForTimeout(50);
want('setConfig on the same element', await view(), { loading: false, alarmOpen: true, keypadOpen: true, alarmDrawn: true });
// a NEW element (what the dashboard editor does), checked 30 ms after mounting, before the slow refetch returns
await mount({...cfg, styles:{mode_name:{size:31}}}); await p.waitForTimeout(30);
want('new element', await view(), { loading: false, modes: true, alarmOpen: true, keypadOpen: true, alarmDrawn: true });
await p.waitForTimeout(1200);
want('after the refetch', await view(), { loading: false, alarmOpen: true, keypadOpen: true, alarmDrawn: true });
if (!process.exitCode) console.log('preview stability OK');
await b.close(); srv.close();
