// Status strip shown above every page: House Mode, alarms, physical panel link(s), pending rule changes,
// unsaved zone edits. Each chip links to the page that handles it.
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { StatusInfo, Warning, ZONE_DRAFT_KEY, fetchStatus } from '../../data/status';

const MAX_CHIPS = 3;
const WARN_ICON: Record<string, string> = {
  alarmo_enabled: 'mdi:alert-octagon',
  link_down: 'mdi:lan-disconnect',
  panel_code: 'mdi:dialpad',
  exit: 'mdi:timer-alert-outline',
  automations: 'mdi:robot-confused-outline',
  timer: 'mdi:timer-off-outline',
  missing_action: 'mdi:script-text-outline',
  selector: 'mdi:form-dropdown',
  notify: 'mdi:bell-off-outline',
  rules: 'mdi:auto-fix',
  draft: 'mdi:pencil-circle',
};
import { navigate } from '../../helpers';

const ALARM_ICON: Record<string, string> = {
  disarmed: 'mdi:shield-off-outline',
  armed_away: 'mdi:shield-lock',
  armed_home: 'mdi:shield-home',
  armed_night: 'mdi:shield-moon',
  armed_vacation: 'mdi:shield-airplane',
  armed_custom_bypass: 'mdi:shield-half-full',
  arming: 'mdi:shield-sync',
  pending: 'mdi:shield-alert-outline',
  triggered: 'mdi:bell-ring',
};
const pretty = (s?: string | null) => (s || 'unknown').replace(/_/g, ' ');

@customElement('hm-status-strip')
export class StatusStrip extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private info?: StatusInfo;
  @state() private open = false;
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.load();
    // settings (House Mode, links, rules) change rarely; states come live from hass
    this.timer = window.setInterval(() => this.load(), 15000);
    window.addEventListener('hm-ui-changed', this.load);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
    window.removeEventListener('hm-ui-changed', this.load);
  }

  private load = async () => {
    try {
      this.info = await fetchStatus(this.hass);
    } catch (_e) {
      /* ext backend not available */
    }
  };

  private go(path: string) {
    navigate(this, path);
    window.setTimeout(this.load, 1500);
  }

  private chip(icon: string, label: string, title: string, path: string, kind = '') {
    return html`<button class="chip ${kind}" title=${title} @click=${() => this.go(path)}>
      <ha-icon icon=${icon}></ha-icon><span>${label}</span>
    </button>`;
  }

  render() {
    const i = this.info;
    if (!i) return nothing;
    const st = (e: string | null) => (e ? this.hass.states[e] : undefined);
    const draft = (() => {
      try {
        return !!window.sessionStorage.getItem(ZONE_DRAFT_KEY);
      } catch (_e) {
        return false;
      }
    })();
    return html`
      <div class="strip" role="status" aria-label="Alarm system status">
        ${i.house.enabled
          ? this.chip(i.house.icon || 'mdi:home', `House Mode: ${i.house.name || 'unknown'}${i.house.shadow ? ' · shadow' : ''}`, `Changed by ${i.house.source || '—'}`, '/house_modes/house')
          : nothing}
        ${i.alarms.map(a => {
          const s = st(a.entity_id)?.state;
          const kind = s === 'triggered' ? 'bad' : s === 'pending' || s === 'arming' ? 'warn' : s && s !== 'disarmed' ? 'on' : '';
          return this.chip(ALARM_ICON[s || ''] || 'mdi:shield-outline', `${a.name}: ${pretty(s)}`, a.entity_id, '/house_modes/activity/arm_check', kind);
        })}
        ${i.links.map(l => {
          const p = st(l.panel_entity);
          const r = st(l.ready_entity);
          const pname = (p?.attributes.friendly_name as string) || l.panel_entity;
          const ready = r ? (r.state === 'on' ? ' · ready' : ' · not ready') : '';
          const kind = !l.running && l.mode !== 'off' ? 'bad' : l.mode === 'live' ? 'on' : '';
          return this.chip('mdi:alarm-panel-outline', `${pname}: ${pretty(p?.state)}${ready} · ${l.mode}`, `Physical panel link (${l.running ? 'running' : 'not running'})`, '/house_modes/panel', kind);
        })}
        ${this.renderWarnings(draft)}
        <span class="grow"></span>
        ${this.chip('mdi:help-circle-outline', "Why won't it arm?", 'What blocks arming right now', '/house_modes/activity/arm_check')}
      </div>
    `;
  }

  /** Each warning as a chip (errors red, the rest yellow); more than 3 fold into one chip that opens the list. */
  private renderWarnings(draft: boolean) {
    const list: Warning[] = [...(this.info?.warnings || [])];
    if (draft) list.push({ id: 'draft', level: 'warn', title: 'Unsaved zone edits', detail: 'Zones has unsaved changes.', link: '/house_modes/zones' });
    if (!list.length) return nothing;
    const icon = (w: Warning) => WARN_ICON[w.id.split(':')[0]] || (w.level === 'error' ? 'mdi:alert-circle' : 'mdi:alert');
    const kind = (w: Warning) => (w.level === 'error' ? 'bad' : 'warn');
    const tip = (w: Warning) => [w.detail, ...(w.items || []).map(i => `• ${i.name}: ${i.reasons.join('; ')}`)].join('\n');
    if (list.length <= MAX_CHIPS) return list.map(w => this.chip(icon(w), w.title, tip(w), w.link, kind(w)));
    const errors = list.filter(w => w.level === 'error').length;
    return html`<span class="fold">
      <button class="chip ${errors ? 'bad' : 'warn'}" aria-expanded=${this.open} @click=${() => (this.open = !this.open)}>
        <ha-icon icon="mdi:alert"></ha-icon><span>${list.length} to check${errors ? ` · ${errors} problem${errors === 1 ? '' : 's'}` : ''}</span>
        <ha-icon icon=${this.open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
      </button>
      ${this.open
        ? html`<div class="menu" role="menu">${list.map(w => html`<button class="item ${kind(w)}" role="menuitem" title=${tip(w)}
              @click=${() => { this.open = false; this.go(w.link); }}>
              <ha-icon icon=${icon(w)}></ha-icon><span><strong>${w.title}</strong><span class="d">${w.detail}</span></span></button>`)}</div>`
        : nothing}
    </span>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 8px;
      padding: 8px 12px 0;
    }
    .grow {
      flex: 1 1 auto;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px 3px 8px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      --mdc-icon-size: 16px;
      white-space: nowrap;
    }
    .chip:hover {
      border-color: var(--primary-color);
    }
    .chip.on {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .chip.warn {
      border-color: var(--warning-color, #ffa600);
      color: var(--warning-color, #ffa600);
    }
    .chip.bad {
      border-color: var(--error-color, #f44336);
      color: var(--error-color, #f44336);
    }
    .fold {
      position: relative;
    }
    .menu {
      position: absolute;
      z-index: 10;
      top: calc(100% + 4px);
      left: 0;
      min-width: 320px;
      max-width: 520px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      padding: 4px 0;
    }
    .item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      width: 100%;
      text-align: left;
      padding: 8px 12px;
      background: none;
      border: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .item:hover {
      background: var(--secondary-background-color);
    }
    .item.bad ha-icon {
      color: var(--error-color, #f44336);
    }
    .item.warn ha-icon {
      color: var(--warning-color, #ffa600);
    }
    .item .d {
      display: block;
      color: var(--secondary-text-color);
      white-space: normal;
    }
  `;
}
