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
  fxClasses,
  fxPartClasses,
  fxRunning,
  withModeColors,
  armColorsFor,
  fxTriggers,
  fxVars,
  FX_PREVIEW,
  FX_TRIGGERS,
  ALARM_STATE_ICONS,
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

  /**
   * Which saved view belongs to this card: its alarm and its section layout (which sections exist and which can
   * collapse). Style edits keep the key, so the edit preview keeps its state; two different cards for the same alarm
   * get their own.
   */
  private get viewKey() {
    const c: any = this.config || {};
    const layout = ['show_header', 'show_house_modes', 'show_alarm', 'show_panel_keypad', 'collapsible', 'modes_collapsible', 'alarm_collapsible', 'keypad_collapsible']
      .map(k => (c[k] ? 1 : 0))
      .join('');
    return `${c.entity || '(first alarm)'}|${layout}`;
  }

  private saveView() {
    VIEW_STATE.set(this.viewKey, { collapsed: this.collapsed, closed: { ...this.closed } });
  }

  private onFxPreview = () => this.requestUpdate();
  /** effects are running in this render (a chosen trigger is true) */
  private fxRun = false;

  connectedCallback() {
    super.connectedCallback();
    FX_PREVIEW.listeners.add(this.onFxPreview);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    FX_PREVIEW.listeners.delete(this.onFxPreview);
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
      const viaOwnHelper = data.house.shadow && data.house.select_entity !== 'select.alarmo_house_mode';
      if (this.requestedAt && r?.at && Date.parse(r.at) >= this.requestedAt - 2000 && !(viaOwnHelper && r.result === 'shadow')) {
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

  /** The data as the card shows it: card-only House Mode colors applied. */
  private get dv(): CardData {
    const d = this.data!;
    const o = this.config?.mode_colors;
    if (this._dvFor?.d === d && this._dvFor.o === o) return this._dvFor.v;
    const v = withModeColors(d, o);
    this._dvFor = { d, o, v };
    return v;
  }

  private _dvFor?: { d: CardData; o?: Record<string, string>; v: CardData };

  private arm(alarmEnt: string | undefined) {
    return armColorsFor(this.dv, alarmEnt, this.config!.alarm_colors, this.config!.arm_colors);
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

  @state() private flashKey = '';
  private flashTimer = 0;

  private async press(key: string) {
    // the pressed key flashes for 500 ms (border / background, if set)
    this.flashKey = '';
    window.clearTimeout(this.flashTimer);
    requestAnimationFrame(() => {
      this.flashKey = key;
      this.flashTimer = window.setTimeout(() => (this.flashKey = ''), 500);
    });
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
    const h = this.dv.house;
    const mode = h.modes.find(m => m.id === h.current);
    const alarmEnt = this.alarmEntity;
    const link = linkFor(this.dv, alarmEnt);
    const alarmState = alarmEnt ? this.hass.states[alarmEnt]?.state : undefined;
    const panelState = link ? this.hass.states[link.panel_entity]?.state : undefined;
    const ready = link?.ready_entity ? this.hass.states[link.ready_entity]?.state : undefined;
    const border = borderColor(alarmState, panelState, ready, mode?.color);
    const active = FX_PREVIEW.on ? [...FX_TRIGGERS] : fxTriggers(alarmState, panelState, h.changing_to);
    const fx = fxClasses(c.effects, active);
    this.fxRun = fxRunning(c.effects, active);
    return html`
      <ha-card class=${fx.join(' ')} style=${`--hmac-border:${border};${styleVars(c.styles)};${fxVars(c.effects)}`}>
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
      const cols = this.arm(alarmEnt);
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
      shape: c.arm_shape,
      fit: c.arm_width === 'fit',
      gap: c.arm_gap,
      padding: c.arm_padding,
      button_style: c.styles?.arm_button,
      fx_classes: fxPartClasses(c.effects?.arm_button, this.fxRun),
      icon_style: c.styles?.alarm_icon,
    };
  }

  /** A section, optionally behind a bar that opens and closes it. */
  private section(id: string, collapsible: boolean, icon: string, color: string | undefined, label: string, body: () => unknown) {
    return html`<div class="sec sec-${id}">${this.sectionInner(id, collapsible, icon, color, label, body)}</div>`;
  }

  private sectionInner(id: string, collapsible: boolean, icon: string, color: string | undefined, label: string, body: () => unknown) {
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
    const color = this.arm(alarmEnt)[(alarmState === 'arming' || alarmState === 'pending' ? (st?.attributes as any)?.arm_mode : alarmState) || ''];
    const icon = alarmState === 'disarmed' ? 'mdi:lock-open-variant' : alarmState === 'triggered' ? 'mdi:bell-ring' : 'mdi:lock';
    return this.section('alarm', !!c.alarm_collapsible, icon, color, `${name} · ${stateText}`,
      () => html`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${this.alarmConfig(alarmEnt)}></hmac-alarm>`);
  }

  private renderHeader(mode: CardData['house']['modes'][0] | undefined, alarmState: string | undefined, link: ReturnType<typeof linkFor>) {
    const h = this.dv.house;
    const kp = link?.keypad_entity ? this.hass!.states[link.keypad_entity] : undefined;
    const [l1, l2] = lcdLines((kp?.attributes as any)?.alpha ?? kp?.state, this.config!.display_strip, this.config!.display_replace);
    const title = h.enabled ? (mode ? mode.name : 'unknown') : this.config!.name || (alarmState ? alarmState.replace(/_/g, ' ') : '');
    // House Modes off: the header shows the alarm (its state icon, in the arm mode color)
    const alarmSt = alarmState;
    const icon = h.enabled ? mode?.icon || 'mdi:shield-home' : ALARM_STATE_ICONS[alarmSt || ''] || 'mdi:shield-home';
    const own = h.enabled
      ? mode?.color || 'var(--secondary-text-color)'
      : this.arm(this.alarmEntity)[alarmSt || ''] || 'var(--secondary-text-color)';
    return html`
      <div class="head ${this.config!.collapsible ? 'clickable' : ''} ${this.config!.collapsible && this.config!.show_chevron ? 'chevron' : ''}" @click=${this.toggle}
        @contextmenu=${(e: Event) => { e.preventDefault(); this.moreInfo(link?.keypad_entity || this.alarmEntity); }}
        role=${this.config!.collapsible ? 'button' : nothing} aria-expanded=${this.config!.collapsible ? String(!this.collapsed) : nothing}>
        ${this.config!.show_header_icon
          ? this.config!.header_countdown && this.alarmEntity && (alarmState === 'arming' || alarmState === 'pending')
            ? html`<hmac-state-badge class="mode-icon countdown" .hass=${this.hass} .entity=${this.alarmEntity}
                style=${`--alarm-state-color:${this.arm(this.alarmEntity)[(this.hass!.states[this.alarmEntity]?.attributes as any)?.arm_mode || ''] || 'var(--warning-color)'}`}></hmac-state-badge>`
            : html`<ha-icon class="mode-icon" icon=${icon}
                style=${`color:${resolveColor(this.config!.styles?.header_icon?.color, own) || own}`}></ha-icon>`
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
    const h = this.dv.house;
    const modes = visibleModes(this.dv, this.config!.hidden_modes);
    // effects go to the mode being changed to, else (arming, entry delay, alarm) the current one
    const fxMode = h.changing_to ? h.modes.find(m => m.name === h.changing_to)?.id : h.current;
    const fxBtn = fxPartClasses(this.config!.effects?.mode_button, this.fxRun || FX_PREVIEW.on).join(' ');
    return html`
      <div class="modes ${this.config!.modes_width === 'fit' ? 'fit' : ''} ${this.config!.modes_align === 'center' ? 'center' : ''} ${this.config!.styles?.mode_button?.text_follows_icon ? 'follow' : ''} ${this.config!.modes_shape === 'round' ? 'round' : ''}"
        style=${`--cols:${Math.max(1, Math.min(9, this.config!.columns || 5))}${this.config!.modes_gap !== undefined ? `;--hmac-modes-gap:${Number(this.config!.modes_gap)}px` : ''}${this.config!.modes_padding !== undefined ? `;--hmac-modes-pad:${Number(this.config!.modes_padding)}px` : ''}`}>
        ${modes.map(m => {
          const on = m.id === h.current;
          const st = this.config!.styles || {};
          const target = m.id === fxMode;
          return html`<button class="mode fxe ${on ? 'on' : ''} ${target ? fxBtn : ''}" aria-pressed=${on ? 'true' : 'false'} title=${m.name}
              style=${`--mode-color:${m.color};${buttonVars(st.mode_button, st.mode_icon, m.color)}`}
              @click=${() => this.chooseMode(m.name)}>
              ${this.config!.show_mode_icons ? html`<span class="disc"><ha-icon icon=${m.icon}></ha-icon></span>` : nothing}
              ${this.config!.show_mode_labels ? html`<span>${m.name}</span>` : nothing}
            </button>`;
        })}
      </div>
    `;
  }

  private renderKeypad(link: NonNullable<ReturnType<typeof linkFor>>) {
    const kp = this.dv.keypad;
    const flash = this.config!.key_flash || {};
    const fl = [flash.border ? `--kf-bd:${resolveColor(flash.border, '')}` : '', flash.background ? `--kf-bg:${resolveColor(flash.background, '')}` : '']
      .filter(Boolean).join(';');
    const blocked = kp.blocked_keys || '';
    return html`
      <div class="keypad-wrap">
        ${!this.config!.show_header && link.keypad_entity
          ? (() => {
              const st = this.hass!.states[link.keypad_entity!];
              const [l1, l2] = lcdLines((st?.attributes as any)?.alpha ?? st?.state, this.config!.display_strip, this.config!.display_replace);
              return html`<div class="lcd big"><div>${l1 || ' '}</div><div>${l2 || ' '}</div></div>`;
            })()
          : nothing}
        ${!kp.allowed ? html`<div class="note">Panel keypad: ${kp.reason}</div>` : nothing}
        <div class="keys ${this.config!.keypad_shape === 'round' ? 'round' : ''} ${flash.border ? 'fl-bd' : ''} ${flash.background ? 'fl-bg' : ''}" style=${fl}>
          ${keypadKeys(this.config!.keypad_labels).map(([k, label]) => html`
            <button class="key ${this.flashKey === k ? 'flash' : ''}" ?disabled=${!kp.allowed || blocked.includes(k) || this.busyKey === k}
              aria-label=${label ? `${k} ${label}` : k} @click=${() => this.press(k)}>
              <span class="k">${k}</span>${label && this.config!.show_key_labels ? html`<span class="l">${label}</span>` : nothing}
            </button>`)}
        </div>
      </div>
    `;
  }

  static styles = css`
    /* Effects (from the Easy Thermostat Styler Card, without the moving backgrounds): fx-on while something is under
       way, fx-<part>-glow / -pulse per part. --fx-c is the effect color (default: the border's state color). */
    ha-card {
      --fx-size: 16px;
      --fx-speed: 1.6s;
      --fx-c: var(--fx-color, var(--hmac-border, var(--primary-color)));
    }
    /* the card: border glow / pulse (box-shadow), background glow / pulse (a tint overlay) */
    ha-card.fx-card-border-glow {
      box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 6) color-mix(in srgb, var(--fx-c) 55%, transparent);
    }
    ha-card.fx-card-border-pulse {
      animation: hmac-fx-border var(--fx-speed) ease-in-out infinite;
    }
    ha-card.fx-card-border-glow.fx-card-border-pulse {
      animation-name: hmac-fx-border-strong;
    }
    ha-card {
      position: relative;
    }
    ha-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--fx-c);
      opacity: 0;
      pointer-events: none;
    }
    ha-card.fx-card-background-glow::after {
      opacity: 0.12;
    }
    ha-card.fx-card-background-pulse::after {
      animation: hmac-fx-tint var(--fx-speed) ease-in-out infinite;
    }
    ha-card.fx-card-background-glow.fx-card-background-pulse::after {
      animation-name: hmac-fx-tint-strong;
    }
    /* the status icon */
    ha-card.fx-status-icon-glow .mode-icon {
      filter: drop-shadow(0 0 calc(var(--fx-size) / 3) var(--fx-c)) drop-shadow(0 0 calc(var(--fx-size) / 6) var(--fx-c));
    }
    ha-card.fx-status-icon-pulse .mode-icon {
      animation: hmac-fx-icon var(--fx-speed) ease-in-out infinite;
    }
    /* a House Mode button (.fxe) in its own color: background, border, icon */
    .mode.fxe {
      position: relative;
      --fx-own: var(--mode-color, var(--fx-c));
    }
    .mode.fxe::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--fx-own);
      opacity: 0;
      pointer-events: none;
    }
    .modes.round .mode.fxe::after {
      display: none;
    }
    .mode.fx-background-glow::after,
    .modes.round .mode.fx-background-glow .disc {
      opacity: 0.22;
    }
    .modes.round .mode.fx-background-glow .disc {
      opacity: 1;
      background-color: color-mix(in srgb, var(--fx-own) 30%, transparent);
    }
    .mode.fx-background-pulse::after {
      animation: hmac-fx-tint var(--fx-speed) ease-in-out infinite;
    }
    .mode.fx-background-glow.fx-background-pulse::after {
      animation-name: hmac-fx-tint-strong;
    }
    .mode.fx-border-glow,
    .modes.round .mode.fx-border-glow .disc {
      box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent);
    }
    .modes.round .mode.fx-border-glow {
      box-shadow: none;
    }
    .mode.fx-border-pulse,
    .modes.round .mode.fx-border-pulse .disc {
      animation: hmac-fx-ring var(--fx-speed) ease-out infinite;
    }
    .modes.round .mode.fx-border-pulse {
      animation: none;
    }
    .mode.fx-border-glow.fx-border-pulse,
    .modes.round .mode.fx-border-glow.fx-border-pulse .disc {
      animation-name: hmac-fx-ring-glow;
    }
    .modes.round .mode.fx-border-glow.fx-border-pulse {
      animation: none;
    }
    .mode.fx-icon-glow ha-icon {
      filter: drop-shadow(0 0 calc(var(--fx-size) / 3) var(--fx-own)) drop-shadow(0 0 calc(var(--fx-size) / 6) var(--fx-own));
    }
    .mode.fx-icon-pulse ha-icon {
      animation: hmac-fx-icon var(--fx-speed) ease-in-out infinite;
    }
    @keyframes hmac-fx-tint {
      0%, 100% { opacity: 0; }
      50% { opacity: 0.3; }
    }
    @keyframes hmac-fx-tint-strong {
      0%, 100% { opacity: 0.12; }
      50% { opacity: 0.4; }
    }
    @keyframes hmac-fx-ring {
      0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--fx-own, var(--fx-c)) 60%, transparent); }
      70%, 100% { box-shadow: 0 0 0 calc(var(--fx-size) / 2) color-mix(in srgb, var(--fx-own, var(--fx-c)) 0%, transparent); }
    }
    @keyframes hmac-fx-ring-glow {
      0% { box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own, var(--fx-c)) 55%, transparent), 0 0 0 0 color-mix(in srgb, var(--fx-own, var(--fx-c)) 60%, transparent); }
      70%, 100% { box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own, var(--fx-c)) 55%, transparent), 0 0 0 calc(var(--fx-size) / 2) color-mix(in srgb, var(--fx-own, var(--fx-c)) 0%, transparent); }
    }
    @keyframes hmac-fx-border {
      0%, 100% { box-shadow: 0 0 0 0 transparent; }
      50% { box-shadow: 0 0 calc(var(--fx-size) * 1.2) 0 color-mix(in srgb, var(--fx-c) 60%, transparent); }
    }
    @keyframes hmac-fx-border-strong {
      0%, 100% { box-shadow: 0 0 calc(var(--fx-size) * 0.6) 0 color-mix(in srgb, var(--fx-c) 45%, transparent); }
      50% { box-shadow: 0 0 calc(var(--fx-size) * 1.8) calc(var(--fx-size) / 6) color-mix(in srgb, var(--fx-c) 80%, transparent); }
    }
    @keyframes hmac-fx-icon {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.75; }
    }
    @media (prefers-reduced-motion: reduce) {
      ha-card,
      ha-card * {
        animation: none !important;
      }
    }
    ha-card {
      overflow: hidden;
      border: var(--hmac-border-width, 2px) solid var(--hmac-border, var(--divider-color));
      border-radius: var(--hmac-radius, var(--ha-card-border-radius, 12px));
      background: var(--hmac-card-bg, var(--ha-card-background, var(--card-background-color, #1c1c1c)));
    }
    /* section backgrounds (unset: the card background shows through) */
    .head {
      background: var(--hmac-header-bg, transparent);
    }
    .sec-modes {
      background: var(--hmac-modes-bg, transparent);
    }
    .sec-alarm {
      background: var(--hmac-alarm-bg, transparent);
    }
    .sec-keypad {
      background: var(--hmac-keypad-bg, transparent);
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
      gap: var(--hmac-modes-gap, 4px);
      padding: 4px 8px 8px;
    }
    /* 'center': same button width, every row (the last one too) centered across the card */
    .modes.center {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.center .mode {
      flex: 0 0 calc((100% - (var(--cols, 5) - 1) * var(--hmac-modes-gap, 4px)) / var(--cols, 5));
    }
    .mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--hmac-modes-pad, 6px) 2px;
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
    .disc {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* fit: buttons as wide as their content, centered, the space between them is the gap */
    .modes.fit {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.fit .mode,
    .modes.fit.center .mode {
      flex: 0 0 auto;
      padding-left: calc(var(--hmac-modes-pad, 6px) + 4px);
      padding-right: calc(var(--hmac-modes-pad, 6px) + 4px);
    }
    /* the countdown circle in place of the header icon */
    hmac-state-badge.countdown {
      --hmac-badge-size: var(--hmac-header-icon-size, 48px);
      display: block;
      position: relative;
    }
    /* round: a circle around the icon carries the background and border, the text sits below */
    .modes.round .mode,
    .modes.round .mode.on {
      background: none;
      border-color: transparent;
    }
    .modes.round .disc {
      width: calc(var(--hmac-mode-icon-size, 36px) * 1.6);
      height: calc(var(--hmac-mode-icon-size, 36px) * 1.6);
      border-radius: 50%;
      background: var(--b-bg, rgba(127, 127, 127, 0.08));
      box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      box-sizing: border-box;
    }
    .modes.round .mode.on .disc {
      background: var(--b-abg, rgba(127, 127, 127, 0.2));
      box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
    }
    .modes.round .mode ha-icon {
      --mdc-icon-size: calc(var(--hmac-mode-icon-size, 36px) * 0.8);
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
    /* round keys: circles, the text inside */
    .keys.round {
      justify-items: center;
    }
    .keys.round .key {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
    /* a pressed key flashes for 500 ms */
    .key {
      transition: box-shadow 0.15s, background-color 0.15s, border-color 0.15s;
    }
    .keys.fl-bd .key.flash {
      border-color: var(--kf-bd);
      box-shadow: 0 0 10px 1px var(--kf-bd);
    }
    .keys.fl-bg .key.flash {
      background: var(--kf-bg);
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
