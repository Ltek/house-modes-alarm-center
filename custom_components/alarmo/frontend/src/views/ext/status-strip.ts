// Status strip shown above every page: House Mode, Alarmo alarms, physical panel link(s), pending rule changes,
// unsaved zone edits. Each chip links to the page that handles it.
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { StatusInfo, ZONE_DRAFT_KEY, fetchStatus } from '../../data/status';
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

@customElement('alarmo-ext-status-strip')
export class StatusStrip extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private info?: StatusInfo;
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.load();
    // settings (House Mode, links, rules) change rarely; states come live from hass
    this.timer = window.setInterval(() => this.load(), 15000);
    window.addEventListener('alarmo-ext-ui-changed', this.load);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
    window.removeEventListener('alarmo-ext-ui-changed', this.load);
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
      <div class="strip" role="status" aria-label="Alarmo status">
        ${i.house.enabled
          ? this.chip(i.house.icon || 'mdi:home', `House Mode: ${i.house.name || 'unknown'}`, `Changed by ${i.house.source || '—'}`, '/alarmo/house')
          : nothing}
        ${i.alarms.map(a => {
          const s = st(a.entity_id)?.state;
          const kind = s === 'triggered' ? 'bad' : s === 'pending' || s === 'arming' ? 'warn' : s && s !== 'disarmed' ? 'on' : '';
          return this.chip(ALARM_ICON[s || ''] || 'mdi:shield-outline', `${a.name}: ${pretty(s)}`, a.entity_id, '/alarmo/why', kind);
        })}
        ${i.links.map(l => {
          const p = st(l.panel_entity);
          const r = st(l.ready_entity);
          const pname = (p?.attributes.friendly_name as string) || l.panel_entity;
          const ready = r ? (r.state === 'on' ? ' · ready' : ' · not ready') : '';
          const kind = !l.running && l.mode !== 'off' ? 'bad' : l.mode === 'live' ? 'on' : '';
          return this.chip('mdi:alarm-panel-outline', `${pname}: ${pretty(p?.state)}${ready} · ${l.mode}`, `Physical panel link (${l.running ? 'running' : 'not running'})`, '/alarmo/panel', kind);
        })}
        ${i.rules_pending ? this.chip('mdi:auto-fix', `${i.rules_pending} zone rule change(s) pending`, 'Review on Zone Assignments', '/alarmo/zones', 'warn') : nothing}
        ${draft ? this.chip('mdi:pencil-circle', 'Unsaved zone edits', 'Zone Assignments has unsaved changes', '/alarmo/zones', 'warn') : nothing}
        <span class="grow"></span>
        ${this.chip('mdi:help-circle-outline', "Why won't it arm?", 'What blocks arming right now', '/alarmo/why')}
      </div>
    `;
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
  `;
}
