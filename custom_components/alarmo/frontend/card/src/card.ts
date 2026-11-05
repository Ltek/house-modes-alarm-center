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
  SECTION_INFO,
  statusLayout,
  StatusSection,
  STATUS_LINE_INFO,
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
        const cf: any = this.config;
        this.closed = {};
        for (const id of ['house_modes', 'alarm', 'keypad'] as const) {
          const info = SECTION_INFO[id];
          this.closed[id === 'house_modes' ? 'modes' : id] = !!(cf[info.collapse] && cf[info.start]);
        }
        for (const st of statusLayout(cf).sections)
          this.closed[`status:${st.id}`] = !!(st.collapsible && st.start_collapsed !== false);
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
    const lay = statusLayout(c);
    const layout = `${lay.order.join(',')}|${lay.sections.map(x => (x.collapsible ? 1 : 0)).join('')}|${[c.collapsible, c.modes_collapsible, c.alarm_collapsible, c.keypad_collapsible].map(x => (x ? 1 : 0)).join('')}`;
    return `${c.entity || '(first alarm)'}|${layout}`;
  }

  private saveView() {
    VIEW_STATE.set(this.viewKey, { collapsed: this.collapsed, closed: { ...this.closed } });
  }

  private onFxPreview = () => this.requestUpdate();
  /**
   * A House Mode change the integration reports, for at most 3 minutes: if a report ever got stuck, the effects
   * stop anyway (an exit delay is limited by the alarm's own state).
   */
  private changeSeen?: { name: string; at: number };

  private freshChange(name: string | null | undefined): string | null {
    if (!name) {
      this.changeSeen = undefined;
      return null;
    }
    if (this.changeSeen?.name !== name) this.changeSeen = { name, at: Date.now() };
    if (Date.now() - this.changeSeen.at > 180000) return null;
    // repaint when the limit passes, so the effect stops without waiting for a state change
    window.clearTimeout(this.changeTimer);
    this.changeTimer = window.setTimeout(() => this.requestUpdate(), 180000 - (Date.now() - this.changeSeen.at) + 50);
    return name;
  }

  private changeTimer = 0;

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
    // Shadow: your automations own the House Mode, so the card shows your helper's mode (as your old card did)
    const own = d.house.display_entity ? this.hass?.states[d.house.display_entity]?.state : undefined;
    if (this._dvFor?.d === d && this._dvFor.o === o && this._dvFor.own === own) return this._dvFor.v;
    let v = withModeColors(d, o);
    if (own) {
      const m = v.house.modes.find(x => x.name.toLowerCase() === own.toLowerCase());
      v = { ...v, house: { ...v.house, current: m ? m.id : null } };
    }
    this._dvFor = { d, o, own, v };
    return v;
  }

  private _dvFor?: { d: CardData; o?: Record<string, string>; own?: string; v: CardData };

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
    // border: the House Mode's color (the default, as the original card), or the alarm / panel state
    const border = c.border_color === 'state' || !h.enabled || !mode
      ? borderColor(alarmState, panelState, ready, mode?.color)
      : mode.color;
    const active = FX_PREVIEW.on ? [...FX_TRIGGERS] : fxTriggers(alarmState, panelState, this.freshChange(h.changing_to));
    const fx = fxClasses(c.effects, active);
    this.fxRun = fxRunning(c.effects, active);
    const layout = statusLayout(c);
    const statusById = new Map(layout.sections.map(x => [`status:${x.id}`, x]));
    const shown = (id: string): boolean => {
      const cf: any = c;
      const st = statusById.get(id);
      if (st) return st.show !== false;
      if (id === 'house_modes') return !!cf.show_house_modes && h.enabled;
      if (id === 'alarm') return !!cf.show_alarm && !!alarmEnt;
      if (id === 'keypad') return !!cf.show_panel_keypad && link?.panel_type === 'envisalink';
      return false;
    };
    const order = layout.order.filter(shown);
    // a collapsed card shows only its first section, which opens it again
    const visible = this.collapsed && c.collapsible ? order.slice(0, 1) : order;
    return html`
      <ha-card class=${fx.join(' ')} style=${`--hmac-border:${border};${styleVars(c.styles)};${fxVars(c.effects)}`}>
        ${visible.map((id, i) => {
          const body = this.renderSectionById(id, i === 0, { mode, alarmEnt, alarmState, link, status: statusById.get(id) });
          return i === 0 && c.collapsible
            ? html`<div class="first clickable" @click=${this.toggle}>${body}
                ${c.show_chevron ? html`<ha-icon class="first-chev" icon=${this.collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}></ha-icon>` : nothing}</div>`
            : body;
        })}
        ${this.message ? html`<div class="message" role="status">${this.message}</div>` : nothing}
      </ha-card>
    `;
  }

  private renderSectionById(id: string, first: boolean, x: { mode: any; alarmEnt?: string; alarmState?: string; link: any; status?: StatusSection }) {
    const c = this.config!;
    const cf: any = c;
    // the first section of a foldable card is its title: no bar of its own
    const can = (v: boolean) => (!first || !c.collapsible ? v : false);
    if (x.status) {
      const st = x.status;
      return html`<div class="sec sec-status" style=${[st.background ? `--hmac-status-bg:${String(st.background).replace(/[;{}<>]/g, '')}` : '', styleVars(st.styles as any)].filter(Boolean).join(';')}>
        ${this.sectionInner(id, can(!!st.collapsible), x.mode?.icon || ALARM_STATE_ICONS[x.alarmState || ''] || 'mdi:information-outline', x.mode?.color,
          st.name || 'Status', () => this.renderStatus(st, x.mode, x.alarmState, x.link))}</div>`;
    }
    switch (id) {
      case 'house_modes':
        return this.section('modes', can(!!cf.modes_collapsible), x.mode?.icon || 'mdi:home-switch', x.mode?.color, `House Mode buttons · ${x.mode?.name || 'unknown'}`, () => this.renderModes());
      case 'alarm':
        return this.renderAlarm(x.alarmEnt!, x.alarmState, can(!!cf.alarm_collapsible));
      case 'keypad':
        return this.section('keypad', can(!!cf.keypad_collapsible), 'mdi:dialpad', undefined, 'Panel keypad', () => this.renderKeypad(x.link));
      default:
        return nothing;
    }
  }

  /** One Status section: its icon slot (or the countdown during a delay) and its text lines, in order. */
  private renderStatus(st: StatusSection, mode: any, alarmState: string | undefined, link: any) {
    const c = this.config!;
    const h = this.dv.house;
    const ent = this.alarmEntity;
    const aSt = ent ? this.hass!.states[ent] : undefined;
    const armMode = (aSt?.attributes as any)?.arm_mode;
    const kp = link?.keypad_entity ? this.hass!.states[link.keypad_entity] : undefined;
    const [l1, l2] = lcdLines((kp?.attributes as any)?.alpha ?? kp?.state, c.display_strip, c.display_replace);
    const stateText = alarmState
      ? this.hass!.localize(`component.alarm_control_panel.entity_component._.state.${alarmState}`) || alarmState.replace(/_/g, ' ')
      : '';
    // the icon: House Mode (the alarm's when House Modes are off), alarm state, or none; the countdown during a delay
    const useAlarm = st.icon === 'alarm' || !h.enabled;
    const icon = useAlarm ? ALARM_STATE_ICONS[alarmState || ''] || 'mdi:shield-home' : mode?.icon || 'mdi:shield-home';
    const own = useAlarm
      ? this.arm(ent)[alarmState === 'arming' || alarmState === 'pending' ? armMode || '' : alarmState || ''] || 'var(--secondary-text-color)'
      : mode?.color || 'var(--secondary-text-color)';
    const iconStyle = { ...(c.styles?.header_icon || {}), ...(st.styles?.header_icon || {}) };
    const delay = alarmState === 'arming' || alarmState === 'pending';
    const iconEl =
      st.icon === 'none'
        ? nothing
        : st.countdown && delay && ent
          ? html`<hmac-state-badge class="mode-icon countdown" .hass=${this.hass} .entity=${ent}
              style=${`--alarm-state-color:${this.arm(ent)[armMode || ''] || 'var(--warning-color)'}`}></hmac-state-badge>`
          : html`<ha-icon class="mode-icon" icon=${icon} style=${`color:${resolveColor(iconStyle.color, own) || own}`}></ha-icon>`;
    const since = h.changed_at ? new Date(h.changed_at) : null;
    const text = (line: string): unknown => {
      switch (line) {
        case 'house_mode':
          return h.enabled ? (mode ? mode.name : 'unknown') : c.name || stateText;
        case 'alarm_name':
          return c.name || (aSt?.attributes as any)?.friendly_name || ent || '';
        case 'alarm_state':
          return delay && armMode ? `${stateText} · ${this.hass!.localize(`component.alarm_control_panel.entity_component._.state.${armMode}`) || armMode}` : stateText;
        case 'panel_line1':
          return kp ? l1 || null : null;
        case 'panel_line2':
          return kp ? l2 || null : null;
        case 'changing':
          return h.changing_to ? `Changing to ${h.changing_to}…` : null;
        case 'since':
          return since ? `since ${since.toLocaleString(this.hass!.locale?.language || undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}` : null;
        default:
          return null;
      }
    };
    const lines = (st.lines || []).map(l => [l, text(l)] as [string, unknown]).filter(([, t]) => t !== null && t !== '');
    const showTag = h.shadow && (st.lines || []).includes('house_mode');
    return html`
      <div class="head" @contextmenu=${(e: Event) => { e.preventDefault(); this.moreInfo(link?.keypad_entity || ent); }}>
        ${iconEl}
        ${lines.length
          ? html`<div class="head-text">${lines.map(([l, t]) => html`<div class="st-line st-${l} ${l.startsWith('panel_') ? 'lcd-line' : ''}">${t}</div>`)}</div>`
          : nothing}
        ${showTag ? html`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>` : nothing}
      </div>
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

  private renderAlarm(alarmEnt: string, alarmState: string | undefined, bar: boolean) {
    const st = this.hass!.states[alarmEnt];
    const color = this.arm(alarmEnt)[(alarmState === 'arming' || alarmState === 'pending' ? (st?.attributes as any)?.arm_mode : alarmState) || ''];
    return this.section('alarm', bar, 'mdi:shield-lock-outline', color, 'Arm / disarm',
      () => html`<hmac-alarm class="alarm-controls" piece="controls" embedded .hass=${this.hass} .cardConfig=${{ ...this.alarmConfig(alarmEnt), part: 'controls' }}></hmac-alarm>`);
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
    const kb = this.config!.styles?.key_button || {};
    const fl = [
      flash.border ? `--kf-bd:${resolveColor(flash.border, '')}` : '',
      flash.background ? `--kf-bg:${resolveColor(flash.background, '')}` : '',
      kb.background ? `--k-bg:${resolveColor(kb.background, '')}` : '',
      kb.border ? `--k-bd:${resolveColor(kb.border, '')}` : '',
    ].filter(Boolean).join(';');
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
    .sec-modes {
      background: var(--hmac-modes-bg, transparent);
    }
    .sec-alarm {
      background: var(--hmac-alarm-bg, transparent);
    }
    .sec-alarm_status {
      background: var(--hmac-alarm_status-bg, transparent);
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
      border: 1px solid var(--k-bd, var(--divider-color));
      background: var(--k-bg, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
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
    .first.clickable {
      position: relative;
      cursor: pointer;
    }
    .first-chev {
      position: absolute;
      right: 12px;
      top: 12px;
      color: var(--secondary-text-color);
    }
    .sec-status {
      background: var(--hmac-status-bg, transparent);
    }
    .st-line {
      font-family: var(--f);
      font-size: var(--s);
      font-weight: var(--w);
      font-style: var(--i, normal);
      text-transform: var(--t, none);
      color: var(--c, var(--primary-text-color));
      line-height: 1.35;
    }
    .lcd-line {
      white-space: pre;
      line-height: 1.6;
    }
    .st-house_mode {
      --f: var(--hmac-mode-name-font, var(--code-font-family, monospace)); --s: var(--hmac-mode-name-size, 22px);
      --w: var(--hmac-mode-name-weight, 400); --i: var(--hmac-mode-name-style); --t: var(--hmac-mode-name-transform, uppercase);
      --c: var(--hmac-mode-name-color, var(--primary-text-color));
      letter-spacing: 0.06em;
      line-height: 1.25;
    }
    .st-alarm_name {
      --f: var(--hmac-alarm-name-font, inherit); --s: var(--hmac-alarm-name-size, 18px); --w: var(--hmac-alarm-name-weight, 400);
      --i: var(--hmac-alarm-name-style); --t: var(--hmac-alarm-name-transform); --c: var(--hmac-alarm-name-color);
    }
    .st-alarm_state {
      --f: var(--hmac-alarm-state-font, inherit); --s: var(--hmac-alarm-state-size, 14px); --w: var(--hmac-alarm-state-weight, 400);
      --i: var(--hmac-alarm-state-style); --t: var(--hmac-alarm-state-transform); --c: var(--hmac-alarm-state-color, var(--secondary-text-color));
    }
    .st-panel_line1 {
      --f: var(--hmac-line1-font, var(--code-font-family, monospace)); --s: var(--hmac-line1-size, 14px); --w: var(--hmac-line1-weight, 400);
      --i: var(--hmac-line1-style); --t: var(--hmac-line1-transform); --c: var(--hmac-line1-color);
    }
    .st-panel_line2 {
      --f: var(--hmac-line2-font, var(--code-font-family, monospace)); --s: var(--hmac-line2-size, 14px); --w: var(--hmac-line2-weight, 400);
      --i: var(--hmac-line2-style); --t: var(--hmac-line2-transform); --c: var(--hmac-line2-color);
    }
    .st-changing {
      --f: var(--hmac-changing-font, inherit); --s: var(--hmac-changing-size, 13px); --w: var(--hmac-changing-weight, 500);
      --i: var(--hmac-changing-style); --t: var(--hmac-changing-transform); --c: var(--hmac-changing-color, var(--warning-color, #ffa500));
    }
    .st-since {
      --f: var(--hmac-since-font, inherit); --s: var(--hmac-since-size, 12px); --w: var(--hmac-since-weight, 400);
      --i: var(--hmac-since-style); --t: var(--hmac-since-transform); --c: var(--hmac-since-color, var(--secondary-text-color));
    }
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
