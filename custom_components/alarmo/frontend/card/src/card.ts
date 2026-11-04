// House Modes & Alarm Center Card: House Mode, alarm and physical panel in one card.
// Loaded on every dashboard by the integration (no resource entry). Card type: custom:house-modes-alarm-center-card
import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from './alarm/lib/types';
import {
  CardConfig,
  CardData,
  DEFAULTS,
  borderColor,
  keypadKeys,
  lcdLines,
  linkFor,
  resultMessage,
  visibleModes,
} from './data';
import './alarm/alarmo-card';
import './editor';
import { VERSION } from '../../src/const';

export const CARD_VERSION = VERSION;

const TAG = 'house-modes-alarm-center-card';

@customElement(TAG)
export class HouseModesAlarmCenterCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private data?: CardData;
  @state() private error = '';
  @state() private collapsed = false;
  @state() private message = '';
  @state() private busyKey = '';

  private fetchedFor = '';
  private requestedAt = 0;
  private messageTimer = 0;

  static getConfigElement() {
    return document.createElement(`${TAG}-editor`);
  }

  static getStubConfig(hass: HomeAssistant): Partial<CardConfig> {
    const entity = Object.keys(hass.states).find(
      e => e.startsWith('alarm_control_panel.') && (hass.states[e].attributes as any).arm_mode !== undefined
    );
    return { entity };
  }

  setConfig(config: CardConfig) {
    if (!config) throw new Error('Invalid configuration');
    if (config.entity && !config.entity.startsWith('alarm_control_panel.'))
      throw new Error('entity must be an Alarmo alarm_control_panel');
    const first = !this.config;
    this.config = { ...DEFAULTS, ...config };
    if (first) this.collapsed = !!(this.config.collapsible && this.config.start_collapsed);
  }

  getCardSize() {
    if (this.collapsed) return 2;
    let n = 0;
    if (this.config?.show_header) n += 2;
    if (this.config?.show_house_modes) n += 2;
    if (this.config?.show_alarm) n += 4;
    if (this.config?.show_panel_keypad) n += 4;
    return n || 2;
  }

  // ------------------------------------------------------------ data

  /** Refetch when the House Mode (or the request entity) changes: modes, colours and the last result live there. */
  protected updated(changed: PropertyValues) {
    if (!changed.has('hass') || !this.hass) return;
    const sel = this.hass.states['select.alarmo_house_mode'];
    const req = this.data ? this.hass.states[this.data.house.select_entity] : undefined;
    const key = `${sel?.last_updated}|${req?.last_updated}`;
    if (key !== this.fetchedFor) {
      this.fetchedFor = key;
      this.fetch();
    }
  }

  private async fetch() {
    try {
      this.data = await this.hass!.callWS<CardData>({ type: 'alarmo/ext/card/get' });
      this.error = '';
      const r = this.data.house.last_result;
      if (this.requestedAt && r?.at && Date.parse(r.at) >= this.requestedAt - 2000) {
        this.requestedAt = 0;
        const m = resultMessage(r, e => this.name(e));
        if (m) this.flash(m);
      }
    } catch (err: any) {
      this.error = 'House Modes & Alarm Center is not installed or not up to date: ' + (err?.message || err);
    }
  }

  private name(eid: string) {
    return (this.hass?.states[eid]?.attributes as any)?.friendly_name || eid;
  }

  private flash(msg: string) {
    this.message = msg;
    window.clearTimeout(this.messageTimer);
    this.messageTimer = window.setTimeout(() => (this.message = ''), 8000);
  }

  private get alarmEntity(): string | undefined {
    return this.config?.entity || linkFor(this.data!, undefined)?.alarm_entity || this.data?.alarms[0]?.entity_id;
  }

  // ------------------------------------------------------------ actions

  private async chooseMode(name: string) {
    const ent = this.data!.house.select_entity;
    const domain = ent.split('.')[0];
    this.requestedAt = Date.now();
    try {
      await this.hass!.callService(domain, 'select_option', { entity_id: ent, option: name });
    } catch (err: any) {
      this.requestedAt = 0;
      this.flash(err?.message || String(err));
    }
  }

  private async press(key: string) {
    const link = linkFor(this.data!, this.alarmEntity);
    if (!link) return;
    this.busyKey = key;
    try {
      await this.hass!.callService('alarmo', 'panel_keypress', { keys: key, entity_id: link.panel_entity });
    } catch (err: any) {
      this.flash(err?.message || String(err));
    } finally {
      this.busyKey = '';
    }
  }

  private toggle() {
    if (this.config?.collapsible) this.collapsed = !this.collapsed;
  }

  private moreInfo(entityId?: string | null) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  // ------------------------------------------------------------ render

  render() {
    if (!this.config || !this.hass) return nothing;
    if (this.error) return html`<ha-card><div class="warn">${this.error}</div></ha-card>`;
    if (!this.data) return html`<ha-card><div class="loading">…</div></ha-card>`;
    const c = this.config;
    const h = this.data.house;
    const mode = h.modes.find(m => m.id === h.current);
    const alarmEnt = this.alarmEntity;
    const link = linkFor(this.data, alarmEnt);
    const alarmState = alarmEnt ? this.hass.states[alarmEnt]?.state : undefined;
    const panelState = link ? this.hass.states[link.panel_entity]?.state : undefined;
    const ready = link?.ready_entity ? this.hass.states[link.ready_entity]?.state : undefined;
    const border = borderColor(alarmState, panelState, ready, mode?.color);
    return html`
      <ha-card style=${`--hmac-border:${border}`}>
        ${c.show_header || this.collapsed ? this.renderHeader(mode, alarmState, link) : nothing}
        ${this.message ? html`<div class="message" role="status">${this.message}</div>` : nothing}
        ${this.collapsed
          ? nothing
          : html`
              ${c.show_house_modes && h.enabled ? this.renderModes() : nothing}
              ${c.show_alarm && alarmEnt
                ? html`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${{ type: 'hmac-alarm', ...(c.alarm || {}), entity: alarmEnt, ...(c.name ? { name: c.name } : {}) }}></hmac-alarm>`
                : nothing}
              ${c.show_panel_keypad && link?.panel_type === 'envisalink' ? this.renderKeypad(link) : nothing}
            `}
      </ha-card>
    `;
  }

  private renderHeader(mode: CardData['house']['modes'][0] | undefined, alarmState: string | undefined, link: ReturnType<typeof linkFor>) {
    const h = this.data!.house;
    const kp = link?.keypad_entity ? this.hass!.states[link.keypad_entity] : undefined;
    const [l1, l2] = lcdLines((kp?.attributes as any)?.alpha ?? kp?.state);
    const title = h.enabled ? (mode ? mode.name : 'unknown') : this.config!.name || (alarmState ? alarmState.replace(/_/g, ' ') : '');
    return html`
      <div class="head ${this.config!.collapsible ? 'clickable' : ''} ${this.config!.collapsible && this.config!.show_chevron ? 'chevron' : ''}" @click=${this.toggle}
        @contextmenu=${(e: Event) => { e.preventDefault(); this.moreInfo(link?.keypad_entity || this.alarmEntity); }}
        role=${this.config!.collapsible ? 'button' : nothing} aria-expanded=${this.config!.collapsible ? String(!this.collapsed) : nothing}>
        <ha-icon class="mode-icon" icon=${mode?.icon || 'mdi:shield-home'} style=${`color:${mode?.color || 'var(--secondary-text-color)'}`}></ha-icon>
        <div class="head-text">
          <div class="mode-name">${title.toUpperCase()}</div>
          ${kp ? html`<div class="lcd" aria-label="Panel display"><div>${l1 || ' '}</div><div>${l2 || ' '}</div></div>` : nothing}
        </div>
        ${h.shadow ? html`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>` : nothing}
        ${this.config!.collapsible && this.config!.show_chevron ? html`<ha-icon class="chev" icon=${this.collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}></ha-icon>` : nothing}
      </div>
    `;
  }

  private renderModes() {
    const h = this.data!.house;
    const modes = visibleModes(this.data!, this.config!.hidden_modes);
    return html`
      <div class="modes" style=${`grid-template-columns:repeat(${Math.max(1, Math.min(9, this.config!.columns || 5))}, 1fr)`}>
        ${modes.map(m => {
          const on = m.id === h.current;
          return html`<button class="mode ${on ? 'on' : ''}" aria-pressed=${on ? 'true' : 'false'} title=${m.name}
              @click=${() => this.chooseMode(m.name)}>
              <ha-icon icon=${m.icon} style=${on ? `color:${m.color}` : ''}></ha-icon>
              <span>${m.name}</span>
            </button>`;
        })}
      </div>
    `;
  }

  private renderKeypad(link: NonNullable<ReturnType<typeof linkFor>>) {
    const kp = this.data!.keypad;
    const blocked = kp.blocked_keys || '';
    return html`
      <div class="keypad-wrap">
        ${!this.config!.show_header && link.keypad_entity
          ? (() => {
              const st = this.hass!.states[link.keypad_entity!];
              const [l1, l2] = lcdLines((st?.attributes as any)?.alpha ?? st?.state);
              return html`<div class="lcd big"><div>${l1 || ' '}</div><div>${l2 || ' '}</div></div>`;
            })()
          : nothing}
        ${!kp.allowed ? html`<div class="note">Panel keypad: ${kp.reason}</div>` : nothing}
        <div class="keys">
          ${keypadKeys(this.config!.keypad_labels).map(([k, label]) => html`
            <button class="key" ?disabled=${!kp.allowed || blocked.includes(k) || this.busyKey === k}
              aria-label=${label ? `${k} ${label}` : k} @click=${() => this.press(k)}>
              <span class="k">${k}</span>${label ? html`<span class="l">${label}</span>` : nothing}
            </button>`)}
        </div>
      </div>
    `;
  }

  static styles = css`
    ha-card {
      overflow: hidden;
      border: 2px solid var(--hmac-border, var(--divider-color));
      border-radius: var(--ha-card-border-radius, 12px);
    }
    /* icon + text centred together, as in a button-card header: 48 px icon, 12 px gap, the pair nudged 10 px left
       so the text (not the icon) sits near the middle */
    .head {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 10px 20px 10px 0;
      min-height: 70px;
    }
    .head.clickable {
      cursor: pointer;
    }
    /* a box (ha-icon is inline in Home Assistant): its middle is the text block's middle */
    .mode-icon {
      --mdc-icon-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      flex: none;
      line-height: 0;
    }
    .head-text {
      flex: none;
      text-align: center;
      min-width: 0;
      max-width: calc(100% - 80px);
    }
    .mode-name {
      font-family: var(--code-font-family, monospace);
      font-size: 1.6em;
      letter-spacing: 0.06em;
      line-height: 1.25;
      color: var(--primary-text-color);
    }
    /* top-right corner, so it never pushes the centred text */
    .tag {
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 0.7em;
      padding: 1px 6px;
      border-radius: 8px;
      border: 1px solid var(--secondary-text-color);
      color: var(--secondary-text-color);
    }
    .head.chevron .tag {
      right: 40px;
    }
    .lcd {
      font-family: var(--code-font-family, monospace);
      font-size: 1em;
      white-space: pre;
      color: var(--primary-text-color);
      line-height: 1.6;
      margin-top: 2px;
    }
    .lcd.big {
      font-size: 1em;
      text-align: center;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .chev {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--secondary-text-color);
    }
    .message {
      margin: 0 12px 8px;
      padding: 6px 10px;
      border-left: 3px solid var(--warning-color, #ff9800);
      background: rgba(255, 152, 0, 0.1);
      font-size: 0.9em;
    }
    .modes {
      display: grid;
      gap: 4px;
      padding: 4px 8px 8px;
    }
    .mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 2px;
      background: none;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
    }
    .mode ha-icon {
      --mdc-icon-size: 36px;
    }
    .mode span {
      font-size: 0.72em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .mode.on {
      color: var(--primary-text-color);
      background: rgba(127, 127, 127, 0.12);
    }
    .mode:focus-visible,
    .key:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .keypad-wrap {
      padding: 4px 12px 12px;
    }
    .note {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .keys {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .key {
      height: 46px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      color: var(--primary-text-color);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font: inherit;
    }
    .key .k {
      font-size: 1.15em;
      line-height: 1;
    }
    .key .l {
      font-size: 0.7em;
      color: var(--secondary-text-color);
    }
    .key:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .warn,
    .loading {
      padding: 16px;
    }
  `;
}

(window as any).customCards = (window as any).customCards || [];
if (!(window as any).customCards.some((c: any) => c.type === TAG))
  (window as any).customCards.push({
    type: TAG,
    name: 'House Modes & Alarm Center Card',
    description: 'House Mode, Alarmo alarm and physical panel keypad in one card.',
    preview: true,
  });

console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${CARD_VERSION} `, 'background:#03a9f4;color:#fff', 'background:#333;color:#fff');
