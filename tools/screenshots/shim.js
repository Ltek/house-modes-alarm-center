// Minimal stand-ins for Home Assistant's frontend elements and a mock `hass`, so the Alarmo panel renders outside HA
// for screenshots. Answers come from demo.json (recorded from the real integration by tests/test_screenshot_demo.py).
import * as mdi from '/mdi.js';

const demo = await (await fetch('/demo.json')).json();
const css = (s) => { const st = new CSSStyleSheet(); st.replaceSync(s); return st; };
const iconPath = (name) => {
  if (!name) return '';
  const key = 'mdi' + name.replace(/^mdi:/, '').split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
  return mdi[key] || mdi.mdiHelpCircleOutline;
};
const svg = (path, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="display:block;fill:currentColor"><path d="${path}"></path></svg>`;

class Base extends HTMLElement {
  constructor(shadow = true) {
    super();
    if (shadow) this.attachShadow({ mode: 'open' });
  }
}
const def = (name, cls) => !customElements.get(name) && customElements.define(name, cls);

def('ha-icon', class extends Base {
  static get observedAttributes() { return ['icon']; }
  set icon(v) { this._icon = v; this.render(); }
  get icon() { return this._icon || this.getAttribute('icon'); }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
  render() {
    const size = getComputedStyle(this).getPropertyValue('--mdc-icon-size').trim() || '24px';
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;vertical-align:middle;width:${size};height:${size}}</style>${svg(iconPath(this.icon), parseInt(size))}`;
  }
});
def('ha-svg-icon', class extends Base {
  set path(v) { this._p = v; this.connectedCallback(); }
  get path() { return this._p; }
  connectedCallback() {
    if (!this.shadowRoot) return;
    const size = getComputedStyle(this).getPropertyValue('--mdc-icon-size').trim() || '24px';
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;vertical-align:middle}</style>${svg(this._p || '', parseInt(size))}`;
  }
});
def('ha-card', class extends Base {
  static get observedAttributes() { return ['header']; }
  attributeChangedCallback() { this.connectedCallback(); }
  set header(v) { this.setAttribute('header', v); }
  connectedCallback() {
    const h = this.getAttribute('header');
    this.shadowRoot.innerHTML = `<style>:host{display:block;background:var(--card-background-color);border-radius:12px;
      border:1px solid var(--divider-color);color:var(--primary-text-color);box-sizing:border-box}
      .h{font-size:24px;padding:16px 16px 8px}</style>${h ? `<div class="h">${h}</div>` : ''}<slot></slot>`;
  }
});
def('ha-button', class extends Base {
  connectedCallback() {
    const plain = this.getAttribute('appearance') === 'plain';
    const danger = this.getAttribute('variant') === 'danger';
    const col = danger ? 'var(--error-color)' : 'var(--primary-color)';
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex}
      button{display:inline-flex;align-items:center;gap:6px;font:500 14px/1 Roboto,sans-serif;border-radius:18px;padding:9px 16px;
      cursor:pointer;border:none;${plain ? `background:none;color:${col}` : `background:${col};color:#fff`}}
      ::slotted([slot=start]){--mdc-icon-size:18px}</style><button><slot name="start"></slot><slot></slot></button>`;
  }
});
def('ha-icon-button', class extends Base {
  set path(v) { this._p = v; this.connectedCallback(); }
  get path() { return this._p; }
  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;color:var(--secondary-text-color)}
      button{background:none;border:none;color:inherit;padding:8px;cursor:pointer;display:inline-flex}</style>
      <button>${this._p ? svg(this._p) : ''}<slot></slot></button>`;
  }
});
class Toggle extends Base {
  constructor() { super(); this._checked = false; }
  set checked(v) { this._checked = !!v; this.render(); }
  get checked() { return this._checked; }
  set disabled(v) { this._dis = !!v; this.render(); }
  get disabled() { return this._dis; }
  connectedCallback() {
    if (this.hasAttribute('checked')) this._checked = true;
    this.render();
    this.onclick = () => { if (this._dis) return; this.checked = !this._checked; this.dispatchEvent(new Event('change', { bubbles: true })); };
  }
}
def('ha-switch', class extends Toggle {
  render() {
    const on = this._checked;
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;cursor:pointer;vertical-align:middle}
      .t{width:36px;height:14px;border-radius:7px;background:${on ? 'var(--switch-checked-track-color)' : 'var(--switch-unchecked-track-color)'};position:relative;margin:8px 4px}
      .k{position:absolute;top:-3px;${on ? 'left:16px' : 'left:-2px'};width:20px;height:20px;border-radius:50%;
      background:${on ? 'var(--primary-color)' : 'var(--switch-unchecked-button-color)'};box-shadow:0 1px 3px rgba(0,0,0,.5)}</style>
      <div class="t"><div class="k"></div></div>`;
  }
});
def('ha-checkbox', class extends Toggle {
  render() {
    const on = this._checked;
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;padding:8px;vertical-align:middle;opacity:${this._dis ? 0.4 : 1}}
      .b{width:16px;height:16px;border-radius:3px;border:2px solid ${on ? 'var(--primary-color)' : 'var(--secondary-text-color)'};
      background:${on ? 'var(--primary-color)' : 'none'};color:#fff;display:flex;align-items:center;justify-content:center}</style>
      <div class="b">${on ? svg(mdi.mdiCheck, 14) : ''}</div>`;
  }
});
def('ha-input', class extends Base {
  set value(v) { this._v = v; this.connectedCallback(); }
  get value() { return this._v || ''; }
  connectedCallback() {
    if (!this.shadowRoot) return;
    const label = this.getAttribute('label') || '';
    this.shadowRoot.innerHTML = `<style>:host{display:inline-block;min-width:220px}
      .f{background:var(--input-fill-color);border-bottom:1px solid var(--secondary-text-color);border-radius:4px 4px 0 0;padding:6px 12px}
      .l{font-size:11px;color:var(--secondary-text-color)}.v{min-height:20px}</style>
      <div class="f"><div class="l">${label}</div><div class="v">${this.getAttribute('type') === 'password' ? '' : (this._v ?? this.getAttribute('value') ?? '')}</div></div>`;
  }
});
def('ha-tab-group', class extends Base {
  connectedCallback() {
    this.shadowRoot.innerHTML = `<style>:host{display:block;border-bottom:1px solid var(--divider-color)}
      nav{display:flex;flex-wrap:wrap;padding:0 8px}</style><nav><slot name="nav"></slot></nav><slot></slot>`;
  }
});
def('ha-tab-group-tab', class extends Base {
  set active(v) { this._a = !!v; this.connectedCallback(); }
  get active() { return this._a; }
  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>:host{display:block}
      div{padding:12px 14px;font:500 14px Roboto,sans-serif;white-space:nowrap;
      color:${this._a ? 'var(--primary-color)' : 'var(--secondary-text-color)'};border-bottom:2px solid ${this._a ? 'var(--primary-color)' : 'transparent'}}</style>
      <div><slot></slot></div>`;
  }
});
const stateIcon = (st) => {
  const [domain] = st.entity_id.split('.');
  const dc = st.attributes.device_class;
  const on = ['on', 'open', 'unlocked'].includes(st.state);
  if (domain === 'lock') return on ? 'mdi:lock-open-variant' : 'mdi:lock';
  if (domain === 'cover') return on ? 'mdi:garage-open' : 'mdi:garage';
  if (domain === 'alarm_control_panel') return 'mdi:shield-home';
  return {
    door: on ? 'mdi:door-open' : 'mdi:door-closed', window: on ? 'mdi:window-open' : 'mdi:window-closed',
    motion: on ? 'mdi:motion-sensor' : 'mdi:motion-sensor-off', smoke: on ? 'mdi:smoke-detector-alert' : 'mdi:smoke-detector',
    carbon_monoxide: 'mdi:molecule-co', moisture: on ? 'mdi:water' : 'mdi:water-off', tamper: 'mdi:alert-octagram',
  }[dc] || (on ? 'mdi:checkbox-marked-circle' : 'mdi:checkbox-blank-circle-outline');
};
def('state-badge', class extends Base {
  set stateObj(v) { this._s = v; this.render(); }
  get stateObj() { return this._s; }
  set hass(v) {}
  set stateColor(v) {}
  connectedCallback() { this.render(); }
  render() {
    if (!this.shadowRoot || !this._s) return;
    const on = ['on', 'open', 'unlocked'].includes(this._s.state);
    const own = this.style.getPropertyValue('--state-icon-color');
    const col = own || (on ? 'var(--state-active-color)' : 'var(--state-icon-color)');
    this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;width:40px;height:40px;align-items:center;justify-content:center;color:${col}}</style>
      ${svg(iconPath(stateIcon(this._s)))}`;
  }
});
for (const n of ['ha-menu-button', 'ha-tooltip', 'paper-tooltip', 'ha-panel-config', 'ha-slider', 'partial-panel-resolver',
  'ha-dialog', 'ha-dialog-header', 'ha-dialog-footer', 'ha-yaml-editor', 'ha-selector', 'ha-generic-picker', 'ha-dropdown',
  'ha-dropdown-item', 'mwc-list-item', 'ha-select']) {
  def(n, class extends HTMLElement {});
}

// ---------------------------------------------------------------- mock hass
const reply = (msg) => {
  const ws = demo.ws;
  const keyed = msg.entity_id ? `${msg.type}|${msg.entity_id}` : msg.user_id ? `${msg.type}|${msg.user_id}` : msg.day ? `${msg.type}|${msg.day}` : msg.type;
  if (keyed in ws) return ws[keyed];
  if (msg.type in ws) return ws[msg.type];
  if (msg.type === 'alarmo/ext/locks/reveal' || msg.type === 'alarmo/ext/user/reveal') return { code: null, readable: false };
  console.warn('no demo answer for', JSON.stringify(msg));
  return {};
};
const services = { notify: { mobile_app_phone: {}, family_phones: {} }, alarm_control_panel: {}, input_select: {} };
window.demoHass = {
  states: demo.states,
  language: 'en',
  locale: { language: 'en', number_format: 'language', time_format: 'language' },
  user: { id: 'u1', name: 'Admin', is_admin: true },
  themes: { darkMode: true },
  services,
  config: { components: ['alarmo', 'zwave_js'], time_zone: 'UTC' },
  localize: (k) => (k.split('.').pop() || k).replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
  callWS: async (msg) => JSON.parse(JSON.stringify(reply(msg))),
  callApi: async () => ({ success: true }),
  callService: async () => ({}),
  connection: { subscribeMessage: async () => () => {}, subscribeEvents: async () => () => {} },
};
