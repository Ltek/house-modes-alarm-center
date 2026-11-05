// House Modes & Alarm Center Card: House Mode, alarm and physical panel in one card.
// Loaded on every dashboard by the integration (no resource entry). Card type: custom:house-modes-alarm-center-card
import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from './alarm/lib/types';
import {
  CardConfig,
  CardData,
  DEFAULTS,
  armColors,
  borderColor,
  styleVars,
  fromPairs,
  buttonVars,
  migrateConfig,
  resolveColor,
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

/*
 * Rule (see CARD_DESIGN_SYSTEM.md §5 "Never fully refresh"): the dashboard editor creates a NEW card element for many
 * config edits. Anything the user opened or closed, and the data shown, therefore lives here, outside the element, so a
 * new instance renders the same view at once: no "loading" flash, nothing collapses. Keyed by the card's alarm entity.
 */
type ViewState = { collapsed: boolean; closed: Record<string, boolean> };
const VIEW_STATE = new Map<string, ViewState>();
let DATA_CACHE: CardData | undefined;

@customElement(TAG)
export class HouseModesAlarmCenterCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private data?: CardData;
  @state() private error = '';
  @state() private collapsed = false;
  @state() private message = '';
  @state() private busyKey = '';
  /** collapsed sections (collapsible ones only) */
  @state() private closed: Record<string, boolean> = {};

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
    this.config = { ...DEFAULTS, ...migrateConfig(config) };
    if (first) {
      if (DATA_CACHE && !this.data) this.data = DATA_CACHE;
      const kept = VIEW_STATE.get(this.viewKey);
      if (kept) {
        // a new element for the same card (dashboard editor): keep what the user opened or closed
        this.collapsed = kept.collapsed;
        this.closed = { ...kept.closed };
      } else {
        this.collapsed = !!(this.config.collapsible && this.config.start_collapsed);
        this.closed = {
          modes: !!(this.config.modes_collapsible && this.config.modes_start_collapsed),
          alarm: !!(this.config.alarm_collapsible && this.config.alarm_start_collapsed),
          keypad: !!(this.config.keypad_collapsible && this.config.keypad_start_collapsed),
        };
        this.saveView();
      }
    }
    // a "start closed" change in the editor must not fold anything that is open now; only a section that can no
    // longer collapse is shown again
    if (!this.config.collapsible) this.collapsed = false;
  }

  private get viewKey() {
    return this.config?.entity || '(first alarm)';
  }

  private saveView() {
    VIEW_STATE.set(this.viewKey, { collapsed: this.collapsed, closed: { ...this.closed } });
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

  /** Refetch when the House Mode (or the request entity) changes: modes, colors and the last result live there. */
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
      const data = await this.hass!.callWS<CardData>({ type: 'alarmo/ext/card/get' });
      // patch, don't flash: only replace the data when it changed
      if (JSON.stringify(data) !== JSON.stringify(this.data)) this.data = data;
      DATA_CACHE = data;
      this.error = '';
      const r = data.house.last_result;
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
    if (this.config?.collapsible) {
      this.collapsed = !this.collapsed;
      this.saveView();
    }
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
      <ha-card style=${`--hmac-border:${border};${styleVars(c.styles)}`}>
        ${c.show_header || this.collapsed ? this.renderHeader(mode, alarmState, link) : nothing}
        ${this.message ? html`<div class="message" role="status">${this.message}</div>` : nothing}
        ${this.collapsed
          ? nothing
          : html`
              ${c.show_house_modes && h.enabled
                ? this.section('modes', !!c.modes_collapsible, mode?.icon || 'mdi:home-switch', mode?.color, `House Mode · ${mode?.name || 'unknown'}`, () => this.renderModes())
                : nothing}
              ${c.show_alarm && alarmEnt ? this.renderAlarm(alarmEnt, alarmState) : nothing}
              ${c.show_panel_keypad && link?.panel_type === 'envisalink'
                ? this.section('keypad', !!c.keypad_collapsible, 'mdi:dialpad', undefined, 'Panel keypad', () => this.renderKeypad(link))
                : nothing}
            `}
      </ha-card>
    `;
  }

  private alarmConfig(alarmEnt: string) {
    const c = this.config!;
    const user = c.alarm || {};
    let states = user.states || {};
    if (c.alarm_colors !== 'theme') {
      // House Mode (or standard) colors first, the user's own per-state settings win
      const cols = armColors(this.data!, alarmEnt, c.alarm_colors);
      states = fromPairs(
        [...new Set([...Object.keys(cols), ...Object.keys(states)])].map(k => [k, { color: cols[k], ...(states[k] || {}) }] as [string, any])
      );
    }
    return {
      type: 'hmac-alarm',
      ...user,
      states,
      entity: alarmEnt,
      ...(c.name ? { name: c.name } : {}),
      show_name: c.show_alarm_name,
      show_state: c.show_alarm_state,
      show_icon: c.show_alarm_icon,
      show_arm_options: c.show_arm_options,
      show_icons: c.show_arm_icons,
      show_labels: c.show_arm_labels,
      button_style: c.styles?.arm_button,
      icon_style: c.styles?.alarm_icon,
    };
  }

  /** A section, optionally behind a bar that opens and closes it. */
  private section(id: string, collapsible: boolean, icon: string, color: string | undefined, label: string, body: () => unknown) {
    if (!collapsible) return body();
    const closed = collapsible && !!this.closed[id];
    return html`
      <button class="bar" aria-expanded=${String(!closed)} @click=${() => {
        this.closed = { ...this.closed, [id]: !closed };
        this.saveView();
      }}>
        <ha-icon icon=${icon} style=${color ? `color:${color}` : ''}></ha-icon>
        <span class="bar-text">${label}</span>
        ${this.config!.show_chevron ? html`<ha-icon class="bar-chev" icon=${closed ? 'mdi:chevron-down' : 'mdi:chevron-up'}></ha-icon>` : nothing}
      </button>
      ${closed ? nothing : body()}
    `;
  }

  private renderAlarm(alarmEnt: string, alarmState: string | undefined) {
    const c = this.config!;
    const st = this.hass!.states[alarmEnt];
    const name = c.name || (st?.attributes as any)?.friendly_name || alarmEnt;
    const stateText = alarmState ? this.hass!.localize(`component.alarm_control_panel.entity_component._.state.${alarmState}`) || alarmState.replace(/_/g, ' ') : '';
    const color = armColors(this.data!, alarmEnt, c.alarm_colors)[(alarmState === 'arming' || alarmState === 'pending' ? (st?.attributes as any)?.arm_mode : alarmState) || ''];
    const icon = alarmState === 'disarmed' ? 'mdi:lock-open-variant' : alarmState === 'triggered' ? 'mdi:bell-ring' : 'mdi:lock';
    return this.section('alarm', !!c.alarm_collapsible, icon, color, `${name} · ${stateText}`,
      () => html`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${this.alarmConfig(alarmEnt)}></hmac-alarm>`);
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
        ${this.config!.show_header_icon
          ? html`<ha-icon class="mode-icon" icon=${mode?.icon || 'mdi:shield-home'}
              style=${`color:${resolveColor(this.config!.styles?.header_icon?.color, mode?.color || 'var(--secondary-text-color)') || mode?.color || 'var(--secondary-text-color)'}`}></ha-icon>`
          : nothing}
        <div class="head-text">
          ${this.config!.show_mode_name ? html`<div class="mode-name">${title}</div>` : nothing}
          ${kp && (this.config!.show_line1 || this.config!.show_line2)
            ? html`<div class="lcd" aria-label="Panel display">
                ${this.config!.show_line1 ? html`<div class="line1">${l1 || ' '}</div>` : nothing}
                ${this.config!.show_line2 ? html`<div class="line2">${l2 || ' '}</div>` : nothing}
              </div>`
            : nothing}
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
      <div class="modes ${this.config!.modes_align === 'center' ? 'center' : ''} ${this.config!.styles?.mode_button?.text_follows_icon ? 'follow' : ''}"
        style=${`--cols:${Math.max(1, Math.min(9, this.config!.columns || 5))}`}>
        ${modes.map(m => {
          const on = m.id === h.current;
          const st = this.config!.styles || {};
          return html`<button class="mode ${on ? 'on' : ''}" aria-pressed=${on ? 'true' : 'false'} title=${m.name}
              style=${`--mode-color:${m.color};${buttonVars(st.mode_button, st.mode_icon, m.color)}`}
              @click=${() => this.chooseMode(m.name)}>
              ${this.config!.show_mode_icons ? html`<ha-icon icon=${m.icon}></ha-icon>` : nothing}
              ${this.config!.show_mode_labels ? html`<span>${m.name}</span>` : nothing}
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
              <span class="k">${k}</span>${label && this.config!.show_key_labels ? html`<span class="l">${label}</span>` : nothing}
            </button>`)}
        </div>
      </div>
    `;
  }

  static styles = css`
    ha-card {
      overflow: hidden;
      border: var(--hmac-border-width, 2px) solid var(--hmac-border, var(--divider-color));
      border-radius: var(--hmac-radius, var(--ha-card-border-radius, 12px));
    }
    /* icon + text centered together, as in a button-card header: 48 px icon, 12 px gap, the pair nudged 10 px left
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
      --mdc-icon-size: var(--hmac-header-icon-size, 48px);
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--hmac-header-icon-size, 48px);
      height: var(--hmac-header-icon-size, 48px);

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
      font-family: var(--hmac-mode-name-font, var(--code-font-family, monospace));
      font-size: var(--hmac-mode-name-size, 22px);
      font-weight: var(--hmac-mode-name-weight, 400);
      font-style: var(--hmac-mode-name-style, normal);
      text-transform: var(--hmac-mode-name-transform, uppercase);
      letter-spacing: 0.06em;
      line-height: 1.25;
      color: var(--hmac-mode-name-color, var(--primary-text-color));
    }
    /* top-right corner, so it never pushes the centered text */
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
      line-height: 1.6;
      margin-top: 2px;
    }
    .line1,
    .line2 {
      white-space: pre;
      font-family: var(--hmac-f, var(--code-font-family, monospace));
      font-size: var(--hmac-s, 14px);
      font-weight: var(--hmac-w, 400);
      font-style: var(--hmac-i, normal);
      text-transform: var(--hmac-t, none);
      color: var(--hmac-c, var(--primary-text-color));
    }
    .line1 {
      --hmac-f: var(--hmac-line1-font); --hmac-s: var(--hmac-line1-size); --hmac-w: var(--hmac-line1-weight);
      --hmac-i: var(--hmac-line1-style); --hmac-t: var(--hmac-line1-transform); --hmac-c: var(--hmac-line1-color);
    }
    .line2 {
      --hmac-f: var(--hmac-line2-font); --hmac-s: var(--hmac-line2-size); --hmac-w: var(--hmac-line2-weight);
      --hmac-i: var(--hmac-line2-style); --hmac-t: var(--hmac-line2-transform); --hmac-c: var(--hmac-line2-color);
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
      grid-template-columns: repeat(var(--cols, 5), 1fr);
      gap: 4px;
      padding: 4px 8px 8px;
    }
    /* 'center': same button width, every row (the last one too) centered across the card */
    .modes.center {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.center .mode {
      flex: 0 0 calc((100% - (var(--cols, 5) - 1) * 4px) / var(--cols, 5));
    }
    .mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 2px;
      background: var(--b-bg, none);
      border: 1px solid var(--b-bd, transparent);
      border-radius: 10px;
      box-sizing: border-box;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
    }
    .mode ha-icon {
      --mdc-icon-size: var(--hmac-mode-icon-size, 36px);
      color: var(--b-ic, var(--secondary-text-color));
    }
    .mode.on ha-icon {
      color: var(--b-aic, var(--mode-color));
    }
    /* text follows the icon color */
    .modes.follow .mode span {
      color: var(--b-ic, var(--secondary-text-color));
    }
    .modes.follow .mode.on span {
      color: var(--b-aic, var(--mode-color));
    }
    .mode span {
      font-family: var(--hmac-mode-label-font, inherit);
      font-size: var(--hmac-mode-label-size, 10px);
      font-weight: var(--hmac-mode-label-weight, 400);
      font-style: var(--hmac-mode-label-style, normal);
      text-transform: var(--hmac-mode-label-transform, none);
      color: var(--hmac-mode-label-color, inherit);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .mode.on {
      color: var(--primary-text-color);
      background: var(--b-abg, rgba(127, 127, 127, 0.12));
      border-color: var(--b-abd, var(--b-bd, transparent));
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
      font-family: var(--hmac-key-digit-font, inherit);
      font-size: var(--hmac-key-digit-size, 16px);
      font-weight: var(--hmac-key-digit-weight, 400);
      font-style: var(--hmac-key-digit-style, normal);
      color: var(--hmac-key-digit-color, inherit);
      line-height: 1;
    }
    .key .l {
      font-family: var(--hmac-key-label-font, inherit);
      font-size: var(--hmac-key-label-size, 10px);
      font-weight: var(--hmac-key-label-weight, 400);
      font-style: var(--hmac-key-label-style, normal);
      text-transform: var(--hmac-key-label-transform, none);
      color: var(--hmac-key-label-color, var(--secondary-text-color));
    }
    /* a collapsible section's divider (as on the other Ltek cards): line · icon · title · arrow · line */
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin: 0;
      padding: 6px 14px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--primary-text-color);
      font: inherit;
      --mdc-icon-size: 20px;
    }
    .bar::before,
    .bar::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--hmac-divider-color, var(--divider-color));
    }
    .bar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .bar-text {
      flex: none;
      text-align: center;
      font-family: var(--hmac-alarm-bar-font, inherit);
      font-size: var(--hmac-alarm-bar-size, 14px);
      font-weight: var(--hmac-alarm-bar-weight, 500);
      font-style: var(--hmac-alarm-bar-style, normal);
      text-transform: var(--hmac-alarm-bar-transform, none);
      color: var(--hmac-alarm-bar-color, inherit);
    }
    .bar-chev {
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
