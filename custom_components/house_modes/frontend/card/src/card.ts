import './guard';
// House Modes & Alarm Center Card: House Mode, alarm and physical panel in one card.
// Added as a Dashboard resource by the integration (extra frontend module in YAML mode). Card type: custom:house-modes-alarm-center-card
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
  ARM_STATE_LABELS,
  HISTORY_KINDS,
  HISTORY_KIND_LABEL,
  HistoryKind,
  HistoryRow,
  HistoryState,
  SOURCE_WORDS,
  dayLabel,
  formatSpan,
  historyOptions,
  historyRows,
  historySince,
  ButtonMenu,
  MenuButton,
  buttonMenus,
  menuTargets,
  menuColumns,
  menuButtonDefault,
  embeddedMenus,
} from './data';
import './alarm/hmac-alarm';
import './editor';
import { VERSION } from '../../src/const';

export const CARD_VERSION = VERSION;

const TAG = 'house-modes-alarm-center-card';
/** An attribute value, or none (Lit's ifDefined, without the import). */
const ifDef = (v: string | undefined): any => (v === undefined ? nothing : v);

/*
 * Rule (see CARD_DESIGN_SYSTEM.md §5 "Never fully refresh"): the dashboard editor creates a NEW card element for many
 * config edits. Anything the user opened or closed, and the data shown, therefore lives here, outside the element, so a
 * new instance renders the same view at once: no "loading" flash, nothing collapses. Keyed by the card's alarm entity.
 */
type ViewState = { collapsed: boolean; closed: Record<string, boolean> };
type SectionMode = 'normal' | 'collapsible' | 'popup';
const VIEW_STATE = new Map<string, ViewState>();
/** History section: the kinds ticked, per card (kept across new elements, like the open sections). */
const HISTORY_SHOWN = new Map<string, HistoryKind[]>();
/** History rows already loaded, per card and entity set: shown at once by a new element. */
const HISTORY_CACHE = new Map<string, HistoryRow[]>();
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
      throw new Error('entity must be an alarm_control_panel of this integration');
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
        for (const id of ['house_modes', 'alarm', 'keypad', 'history'] as const) {
          const info = SECTION_INFO[id];
          this.closed[id === 'house_modes' ? 'modes' : id] = !!(cf[info.collapse] && cf[info.start]);
        }
        for (const st of statusLayout(cf).sections)
          this.closed[`status:${st.id}`] = !!(st.collapsible && st.start_collapsed !== false);
        for (const m of buttonMenus(cf)) this.closed[`menu:${m.id}`] = !!(m.collapsible && m.start_collapsed !== false);
        this.saveView();
      }
    }
    // a "start collapsed" change in the editor must not collapse anything that is open now; only a section that can no
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
    // a section shown as a popup: open its dialog in the browser's top layer (above the dashboard)
    const dlg = this.shadowRoot?.querySelector('dialog.pop') as HTMLDialogElement | null;
    if (dlg && !dlg.open) dlg.showModal();
    if (!changed.has('hass') || !this.hass) return;
    this.maybeFetchHistory();
    const sel = this.hass.states['select.house_mode'];
    const req = this.data ? this.hass.states[this.data.house.select_entity] : undefined;
    const key = `${sel?.last_updated}|${req?.last_updated}`;
    if (key !== this.fetchedFor) {
      this.fetchedFor = key;
      this.fetch();
    }
  }

  private async fetch() {
    try {
      const data = await this.hass!.callWS<CardData>({ type: 'house_modes/ext/card/get' });
      // patch, don't flash: only replace the data when it changed
      if (JSON.stringify(data) !== JSON.stringify(this.data)) this.data = data;
      DATA_CACHE = data;
      this.error = '';
      const r = data.house.last_result;
      const viaOwnHelper = data.house.shadow && data.house.select_entity !== 'select.house_mode';
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
      await this.hass!.callService('house_modes', 'panel_keypress', { keys: key, entity_id: link.panel_entity });
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
    const menus = buttonMenus(c);
    const menuById = new Map(menus.map(m => [`menu:${m.id}`, m]));
    const targets = menuTargets(menus);
    const shown = (id: string): boolean => {
      const cf: any = c;
      const st = statusById.get(id);
      if (st) return st.show !== false;
      const m = menuById.get(id);
      if (m) return m.show !== false;
      if (id === 'house_modes') return !!cf.show_house_modes && h.enabled;
      if (id === 'alarm') return !!cf.show_alarm && !!alarmEnt;
      if (id === 'keypad') return !!cf.show_panel_keypad && link?.panel_type === 'envisalink';
      if (id === 'history') return !!cf.show_history;
      return false;
    };
    // a section that is a button on a Button Menu is shown in its place only while its button has it toggled on
    const avail = layout.order.filter(shown);
    this.ctx = { avail, statusById, menuById };
    // a Button Menu inside a Status section is drawn there, not in the section order
    const embedded = embeddedMenus(menus, layout.sections.map(x => `status:${x.id}`));
    const inside = new Set<string>();
    for (const l of Object.values(embedded)) for (const m of l) inside.add(`menu:${m.id}`);
    this.ctx.embedded = embedded;
    const order = avail.filter(id => !inside.has(id) && (!targets[id] || (targets[id] === 'toggle' && !!this.closed[`shown:${id}`])));
    // a collapsed card shows only its first section, which opens it again
    const visible = this.collapsed && c.collapsible ? order.slice(0, 1) : order;
    return html`
      <ha-card class=${fx.join(' ')} style=${`--hmac-border:${border};${styleVars(c.styles)};${fxVars(c.effects)}`}>
        ${visible.map((id, i) => {
          const body = this.renderSectionById(id, i === 0, { mode, alarmEnt, alarmState, link, status: statusById.get(id) }, targets[id] ? 'normal' : undefined);
          return i === 0 && c.collapsible
            ? html`<div class="first clickable" @click=${this.toggle}>${body}
                ${c.show_chevron ? html`<ha-icon class="first-chev" icon=${this.collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}></ha-icon>` : nothing}</div>`
            : body;
        })}
        ${this.message ? html`<div class="message" role="status">${this.message}</div>` : nothing}
      </ha-card>
    `;
  }

  /** What the current render knows about the sections: the shown ones, the Status sections and the Button Menus. */
  private ctx: { avail: string[]; statusById: Map<string, StatusSection>; menuById: Map<string, ButtonMenu>; embedded?: Record<string, ButtonMenu[]> } = {
    avail: [], statusById: new Map(), menuById: new Map(),
  };

  private renderSectionById(id: string, first: boolean, x: { mode: any; alarmEnt?: string; alarmState?: string; link: any; status?: StatusSection },
    force?: SectionMode) {
    const c = this.config!;
    const cf: any = c;
    // each section is shown normally, behind a bar that collapses it, or behind a bar that opens it in a popup;
    // the first section of a collapsible card is its title: no bar of its own. A section a Button Menu shows has
    // no bar either (force = normal): its button is the bar.
    const pops: string[] = (cf.popup_sections as string[]) || [];
    const can = (collapsible: boolean, popup: boolean): SectionMode =>
      force ? force : first && c.collapsible ? 'normal' : popup ? 'popup' : collapsible ? 'collapsible' : 'normal';
    const menu = this.ctx.menuById.get(id);
    if (menu)
      return html`<div class="sec sec-menu">${this.sectionInner(id, can(!!menu.collapsible, !!menu.popup), 'mdi:gesture-tap-button', undefined,
        menu.name || 'Button Menu', () => this.renderMenu(menu, x))}</div>`;
    if (x.status) {
      const st = x.status;
      return html`<div class="sec sec-status" style=${[st.background ? `--hmac-status-bg:${String(st.background).replace(/[;{}<>]/g, '')}` : '', styleVars(st.styles as any)].filter(Boolean).join(';')}>
        ${this.sectionInner(id, can(!!st.collapsible, !!st.popup), x.mode?.icon || ALARM_STATE_ICONS[x.alarmState || ''] || 'mdi:information-outline', x.mode?.color,
          st.name || 'Status', () => this.renderStatus(st, x.mode, x.alarmState, x.link))}</div>`;
    }
    switch (id) {
      case 'house_modes':
        return this.section('modes', can(!!cf.modes_collapsible, pops.includes('house_modes')), x.mode?.icon || 'mdi:home-switch', x.mode?.color, `House Mode buttons · ${x.mode?.name || 'unknown'}`, () => this.renderModes());
      case 'alarm':
        return this.renderAlarm(x.alarmEnt!, x.alarmState, can(!!cf.alarm_collapsible, pops.includes('alarm')));
      case 'keypad':
        return this.section('keypad', can(!!cf.keypad_collapsible, pops.includes('keypad')), 'mdi:dialpad', undefined, 'Panel keypad', () => this.renderKeypad(x.link));
      case 'history':
        return this.section('history', can(!!cf.history_collapsible, pops.includes('history')), 'mdi:history', undefined, 'History', () => this.renderHistory());
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
    const menus = (this.ctx.embedded?.[`status:${st.id}`] || []).filter(m => m.show !== false);
    if (menus.length) {
      // Button Menus inside this Status section: left / right of the icon and text, or above / below them. A tap on
      // a button must not also collapse the card (the first section is its title).
      const at = (p: string) => menus.filter(m => (m.position || 'right') === p)
        .map(m => html`<div class="st-menu st-menu-${p}" @click=${(e: Event) => e.stopPropagation()}>${this.renderMenu(m, { mode, alarmState, link, alarmEnt: ent })}</div>`);
      return html`<div class="st-wrap">
        ${at('above')}
        <div class="st-row"><div class="st-side st-l">${at('left')}</div>${this.statusHead(link, ent, iconEl, lines, showTag, st.align, st.indent)}<div class="st-side st-r">${at('right')}</div></div>
        ${at('below')}
      </div>`;
    }
    return this.statusHead(link, ent, iconEl, lines, showTag, st.align, st.indent);
  }

  private statusHead(link: any, ent: string | undefined, iconEl: unknown, lines: [string, unknown][], showTag: boolean, align?: string, indent?: number) {
    // 'text': the text is centered on the card and the icon sits to its left (an empty column of the same width on
    // the right keeps the text in the middle); standard: the icon and text are centered together
    const textMid = align === 'text' && iconEl !== nothing && lines.length > 0;
    return html`
      <div class="head ${textMid ? 'align-text' : ''}" style=${indent ? `left:${Math.max(-300, Math.min(300, Number(indent) || 0))}px` : ''} @contextmenu=${(e: Event) => { e.preventDefault(); this.moreInfo(link?.keypad_entity || ent); }}>
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
  private section(id: string, mode: SectionMode, icon: string, color: string | undefined, label: string, body: () => unknown) {
    return html`<div class="sec sec-${id}">${this.sectionInner(id, mode, icon, color, label, body)}</div>`;
  }

  @state() private popup: string | null = null;

  private sectionInner(id: string, mode: SectionMode, icon: string, color: string | undefined, label: string, body: () => unknown) {
    if (mode === 'normal') return body();
    if (mode === 'popup')
      return html`
        <button class="bar" aria-haspopup="dialog" @click=${() => (this.popup = id)}>
          <ha-icon icon=${icon} style=${color ? `color:${color}` : ''}></ha-icon>
          <span class="bar-text">${label}</span>
          ${this.config!.show_chevron ? html`<ha-icon class="bar-chev" icon="mdi:open-in-new"></ha-icon>` : nothing}
        </button>
        ${this.popup === id ? this.popDialog(icon, color, label, body) : nothing}`;
    const closed = !!this.closed[id];
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

  /** A popup above the dashboard (a native modal dialog: Esc, a tap outside or the X closes it). */
  private popDialog(icon: string, color: string | undefined, label: string, body: () => unknown) {
    return html`<dialog class="pop" @close=${() => (this.popup = null)} @cancel=${() => (this.popup = null)}
      @click=${(e: Event) => { if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close(); }}>
      <div class="pop-card">
        <div class="pop-head">
          <ha-icon icon=${icon} style=${color ? `color:${color}` : ''}></ha-icon>
          <span class="pop-title">${label}</span>
          <button class="pop-close" aria-label="Close" @click=${(e: Event) => (e.currentTarget as HTMLElement).closest('dialog')!.close()}>
            <ha-icon icon="mdi:close"></ha-icon></button>
        </div>
        <div class="pop-body">${body()}</div>
      </div>
    </dialog>`;
  }

  /**
   * A Button Menu: one button per section it shows, all in the menu's one look. A button shows / hides its section in
   * its place in the section order, or opens it in a popup.
   */
  private renderMenu(m: ButtonMenu, x: { mode: any; alarmEnt?: string; alarmState?: string; link: any }) {
    const c = this.config!;
    const st = c.styles || {};
    const buttons = (m.buttons || []).filter((b): b is MenuButton => !!b && !!b.section && !b.section.startsWith('menu:') && this.ctx.avail.includes(b.section));
    if (!buttons.length) {
      // say why: no buttons yet, or their sections are turned off (eye) / not available (no panel link, House Modes off)
      const off = (m.buttons || []).filter(b => b && b.section && !b.section.startsWith('menu:'))
        .map(b => b.label || menuButtonDefault(b.section, this.ctx.statusById.get(b.section)?.name).label);
      return html`<div class="note menu-empty">${m.name || 'Button Menu'}: ${off.length
        ? `${off.join(', ')} ${off.length > 1 ? 'are' : 'is'} turned off or not available. Turn ${off.length > 1 ? 'them' : 'it'} on with the eye in the card editor → Sections.`
        : 'no buttons yet.'}</div>`;
    }
    const style = m.style || 'chips';
    const icons = m.show_icons !== false;
    const labels = m.show_labels !== false;
    const cols = menuColumns(m, buttons.length);
    const accent = 'var(--primary-color)';
    const item = (b: MenuButton) => {
      const d = menuButtonDefault(b.section, this.ctx.statusById.get(b.section)?.name);
      const label = b.label || d.label;
      const icon = b.icon || d.icon;
      const popup = b.action === 'popup';
      const key = popup ? `via:${b.section}` : `shown:${b.section}`;
      const on = popup ? this.popup === key : !!this.closed[key];
      const click = () => {
        if (popup) this.popup = key;
        else {
          this.closed = { ...this.closed, [key]: !on };
          this.saveView();
        }
      };
      const aria = popup ? { pop: 'dialog' } : { pressed: on ? 'true' : 'false' };
      const ic = icons ? html`<ha-icon icon=${icon}></ha-icon>` : nothing;
      const tx = labels || !icons ? label : '';
      switch (style) {
        case 'mode':
          return html`<button class="mode ${on ? 'on' : ''}" title=${label} aria-pressed=${ifDef(aria.pressed)} aria-haspopup=${ifDef(aria.pop)}
            style=${`--mode-color:${accent};${buttonVars(st.mode_button, st.mode_icon, accent)}`} @click=${click}>
            ${icons ? html`<span class="disc">${ic}</span>` : nothing}${tx ? html`<span>${tx}</span>` : nothing}</button>`;
        case 'arm':
          return html`<button class="arm-b ${on ? 'on' : ''}" title=${label} aria-pressed=${ifDef(aria.pressed)} aria-haspopup=${ifDef(aria.pop)}
            style=${buttonVars(st.arm_button, st.alarm_icon, accent)} @click=${click}>${ic}${tx ? html`<span>${tx}</span>` : nothing}</button>`;
        case 'key':
          return html`<button class="key ${on ? 'on' : ''}" title=${label} aria-pressed=${ifDef(aria.pressed)} aria-haspopup=${ifDef(aria.pop)} @click=${click}>
            ${icons ? html`<span class="k">${ic}</span>` : nothing}${tx ? html`<span class=${icons ? 'l' : 'k'}>${tx}</span>` : nothing}</button>`;
        default:
          return html`<button class="mchip ${on ? 'on' : ''}" title=${label} aria-pressed=${ifDef(aria.pressed)} aria-haspopup=${ifDef(aria.pop)} @click=${click}>
            ${ic}${tx ? html`<span>${tx}</span>` : nothing}</button>`;
      }
    };
    const kb = st.key_button || {};
    const wrap =
      style === 'mode'
        ? html`<div class="modes ${c.modes_width === 'fit' ? 'fit' : ''} ${c.modes_align === 'center' ? 'center' : ''} ${st.mode_button?.text_follows_icon ? 'follow' : ''} ${c.modes_shape === 'round' ? 'round' : ''}"
            style=${`--cols:${cols}${c.modes_gap !== undefined ? `;--hmac-modes-gap:${Number(c.modes_gap)}px` : ''}${c.modes_padding !== undefined ? `;--hmac-modes-pad:${Number(c.modes_padding)}px` : ''}`}>${buttons.map(item)}</div>`
        : style === 'arm'
          ? html`<div class="menu-arm ${c.arm_shape === 'round' ? 'round' : ''} ${st.arm_button?.text_follows_icon ? 'follow' : ''}"
              style=${[st.arm_button?.track ? `--b-track:${resolveColor(st.arm_button.track, accent)};--b-track-opacity:1` : '', c.arm_gap !== undefined ? `--b-gap:${Number(c.arm_gap)}px` : ''].filter(Boolean).join(';')}>${buttons.map(item)}</div>`
          : style === 'key'
            ? html`<div class="keypad-wrap"><div class="keys menu-keys ${c.keypad_shape === 'round' ? 'round' : ''}"
                style=${[`grid-template-columns:repeat(${cols},1fr)`, kb.background ? `--k-bg:${resolveColor(kb.background, '')}` : '', kb.border ? `--k-bd:${resolveColor(kb.border, '')}` : ''].filter(Boolean).join(';')}>${buttons.map(item)}</div></div>`
            : html`<div class="menu-chips">${buttons.map(item)}</div>`;
    const open = buttons.find(b => b.action === 'popup' && this.popup === `via:${b.section}`);
    const d = open ? menuButtonDefault(open.section, this.ctx.statusById.get(open.section)?.name) : undefined;
    return html`${wrap}${open
      ? this.popDialog(open.icon || d!.icon, undefined, open.label || d!.label,
          () => this.renderSectionById(open.section, false, { ...x, status: this.ctx.statusById.get(open.section) }, 'normal'))
      : nothing}`;
  }

  private renderAlarm(alarmEnt: string, alarmState: string | undefined, bar: SectionMode) {
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

  // ------------------------------------------------------------ History

  @state() private histRows?: HistoryRow[];
  @state() private histShown?: HistoryKind[];
  private histKey = '';
  private histStamp = '';
  private histAt = 0;
  private histTimer = 0;

  /** The entities per kind: the House Mode select (or the configured one), the card's alarm, its linked panel. */
  private historyEntities(): Partial<Record<HistoryKind, string>> {
    const o = historyOptions(this.config?.history);
    const alarm = this.alarmEntity;
    const link = this.data ? linkFor(this.data, alarm) : undefined;
    const out: Partial<Record<HistoryKind, string>> = {};
    if (o.kinds.includes('house')) out.house = o.house_entity || 'select.house_mode';
    if (o.kinds.includes('alarm') && alarm) out.alarm = alarm;
    if (o.kinds.includes('panel') && link?.panel_entity) out.panel = link.panel_entity;
    return out;
  }

  /** Load the history when the section is shown and one of its entities changed (at most every 10 s). */
  private maybeFetchHistory() {
    if (!this.config?.show_history || !this.hass) return;
    const ents = this.historyEntities();
    const o = historyOptions(this.config.history);
    const key = `${JSON.stringify(ents)}|${o.days}|${historySince(o.days)}`;
    const stamp = Object.values(ents).map(e => this.hass!.states[e!]?.last_changed || '').join('|');
    if (key === this.histKey && stamp === this.histStamp) return;
    if (key !== this.histKey && HISTORY_CACHE.has(key)) this.histRows = HISTORY_CACHE.get(key);
    this.histKey = key;
    this.histStamp = stamp;
    const wait = Math.max(0, this.histAt + 10000 - Date.now());
    window.clearTimeout(this.histTimer);
    this.histTimer = window.setTimeout(() => this.fetchHistory(key, ents, o.days, o.hide_short), wait);
  }

  private async fetchHistory(key: string, ents: Partial<Record<HistoryKind, string>>, days: number, hideShort: number) {
    const ids = Object.values(ents).filter(Boolean) as string[];
    if (!ids.length) {
      this.histRows = [];
      return;
    }
    this.histAt = Date.now();
    const since = historySince(days);
    try {
      const res = await this.hass!.callWS<Record<string, HistoryState[]>>({
        type: 'history/history_during_period',
        start_time: new Date(since * 1000).toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      const series: Partial<Record<HistoryKind, HistoryState[]>> = {};
      for (const k of HISTORY_KINDS) if (ents[k]) series[k] = res[ents[k]!] || [];
      const sources = (this.data?.house.history || [])
        .filter(h => h.at)
        .map(h => ({ at: Date.parse(h.at!) / 1000, to: h.to, source: h.source }));
      const rows = historyRows(series, { since, hide_short: hideShort, sources });
      if (key !== this.histKey) return;
      this.histRows = rows;
      HISTORY_CACHE.set(key, rows);
    } catch (err) {
      this.histRows = this.histRows || [];
      this.error = `History: ${(err as any)?.message || err}`;
    }
  }

  private historyState(kind: HistoryKind, state: string) {
    if (kind === 'house') {
      const m = this.dv.house.modes.find(x => x.name.toLowerCase() === state.toLowerCase());
      return { label: m?.name || state, icon: m?.icon || 'mdi:home-switch', color: m?.color };
    }
    const alarm = this.alarmEntity;
    const colors = alarm ? this.arm(alarm) : {};
    // short in the list: "Home", "Away", "Night" (the kind line says it is the alarm or the panel)
    const label = (ARM_STATE_LABELS[state] || state).replace(/^Armed\s+/i, '');
    return { label: label.charAt(0).toUpperCase() + label.slice(1), icon: ALARM_STATE_ICONS[state] || 'mdi:shield-outline', color: colors[state] };
  }

  private renderHistory() {
    const o = historyOptions(this.config!.history);
    const view = this.viewKey;
    const shown = this.histShown || HISTORY_SHOWN.get(view) || o.shown.filter(k => o.kinds.includes(k));
    const rows = this.histRows;
    if (!rows) return html`<div class="hist-empty">Loading…</div>`;
    const ents = this.historyEntities();
    const kinds = HISTORY_KINDS.filter(k => ents[k]);
    const counts = fromPairs(kinds.map(k => [k, rows.filter(r => r.kind === k).length] as [string, number])) as Record<HistoryKind, number>;
    const list = rows.filter(r => shown.includes(r.kind)).slice(0, o.max_rows);
    const now = Date.now() / 1000;
    const toggle = (k: HistoryKind, on: boolean) => {
      const next = on ? [...shown, k] : shown.filter(x => x !== k);
      this.histShown = next;
      HISTORY_SHOWN.set(view, next);
    };
    const time = (t: number) => new Date(t * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    const multi = shown.length > 1;
    return html`<div class="hist">
      ${o.show_filters && kinds.length > 1
        ? html`<div class="hist-filters">${kinds.map(k => html`<label><input type="checkbox" .checked=${shown.includes(k)}
            @change=${(e: any) => toggle(k, e.target.checked)} />${HISTORY_KIND_LABEL[k]} <span class="dim">(${counts[k]})</span></label>`)}</div>`
        : nothing}
      ${list.length
        ? html`<div class="hist-grid ${o.show_day ? '' : 'no-day'} ${o.show_duration ? '' : 'no-dur'}">
            <span></span><span></span>${o.show_day ? html`<span class="hh">Day</span>` : nothing}<span class="hh">Start</span><span class="hh">End</span>
            ${o.show_duration ? html`<span class="hh r">Duration</span>` : nothing}
            ${list.map((r, i) => {
              const st = this.historyState(r.kind, r.state);
              const cur = r.end === null;
              const sub = [multi ? HISTORY_KIND_LABEL[r.kind] : '', o.show_source && r.source ? SOURCE_WORDS[r.source] || r.source : '']
                .filter(Boolean)
                .join(' · ');
              return html`
                <ha-icon class="hi" icon=${st.icon} style=${st.color ? `color:${st.color}` : ''}></ha-icon>
                <span class="hn ${cur ? 'cur' : ''}" style=${st.color ? `color:${st.color}` : ''}>${st.label}${sub ? html`<span class="hs">${sub}</span>` : nothing}</span>
                ${o.show_day ? html`<span class="hd ${cur ? 'cur' : ''}">${dayLabel(r.start, now)}</span>` : nothing}
                <span class="ht ${cur ? 'cur' : ''}">${time(r.start)}</span>
                <span class="ht ${cur ? 'cur' : ''}">${cur ? 'Now' : time(r.end!)}</span>
                ${o.show_duration ? html`<span class="ht r ${cur ? 'cur' : ''}">${formatSpan((r.end ?? now) - r.start)}</span>` : nothing}
                ${i < list.length - 1 ? html`<span class="hl"></span>` : nothing}`;
            })}
          </div>`
        : html`<div class="hist-empty">${shown.length ? (o.days ? `Nothing today or in the ${o.days} day${o.days === 1 ? '' : 's'} before.` : 'Nothing today.') : 'Tick what to show.'}</div>`}
    </div>`;
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
    dialog.pop {
      padding: 0;
      border: none;
      background: transparent;
      max-width: min(560px, 94vw);
      width: 100%;
    }
    dialog.pop::backdrop {
      background: rgba(0, 0, 0, 0.55);
    }
    .pop-card {
      background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--hmac-border, var(--divider-color));
      max-height: 85vh;
      overflow: auto;
    }
    .pop-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 8px 6px 16px;
      position: sticky;
      top: 0;
      background: inherit;
      --mdc-icon-size: 20px;
    }
    .pop-title {
      flex: 1;
      font-weight: 500;
    }
    .pop-close {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 4px;
    }
    .pop-body {
      padding: 0 0 8px;
    }
    .hist {
      padding: 4px 16px 12px;
    }
    .hist-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      font-size: 13px;
      padding: 0 0 6px;
    }
    .hist-filters label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .hist-filters input {
      accent-color: var(--primary-color);
    }
    .hist-grid {
      display: grid;
      grid-template-columns: 28px minmax(96px, 1fr) auto auto auto auto;
      align-items: center;
      column-gap: 10px;
      row-gap: 0;
      font-size: 14px;
    }
    .hist-grid.no-day,
    .hist-grid.no-dur {
      grid-template-columns: 28px minmax(96px, 1fr) auto auto auto;
    }
    .hist-grid.no-day.no-dur {
      grid-template-columns: 28px minmax(96px, 1fr) auto auto;
    }
    .hist-grid .hh {
      color: var(--hmac-history-head, var(--success-color, #4caf50));
      font-size: 12px;
      text-align: center;
      padding-bottom: 4px;
    }
    .hist-grid .r {
      text-align: right;
    }
    .hist-grid .hi {
      --mdc-icon-size: 24px;
      padding: 6px 0;
    }
    .hist-grid .hn {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hist-grid .hs {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .hist-grid .hd,
    .hist-grid .ht {
      text-align: center;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .hist-grid .ht.r {
      text-align: right;
    }
    .hist-grid .cur {
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .hist-grid .hn.cur {
      font-weight: 700;
    }
    .hist-grid .hl {
      grid-column: 1 / -1;
      border-top: 1px solid var(--divider-color);
      opacity: 0.4;
    }
    .hist-empty {
      padding: 6px 16px 12px;
      color: var(--secondary-text-color);
    }
    .dim {
      color: var(--secondary-text-color);
    }
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
      padding: 10px 0;
      min-height: 70px;
    }
    /* Button Menus inside a Status section */
    /* the icon and text stay in the middle of the card; the buttons sit at its edges */
    .st-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
    }
    /* no width limit on the text here: in the middle column it would make the box narrower than its lines */
    .st-row > .head > .head-text {
      max-width: none;
    }
    .st-row > .head {
      padding-right: 0;
    }
    .st-side {
      display: flex;
      gap: 6px;
    }
    .st-l {
      justify-content: flex-start;
      padding-left: 10px;
    }
    .st-r {
      justify-content: flex-end;
      padding-right: 10px;
    }
    /* left / right: the menu's own buttons stacked in a column (direct children only: a popup it opens is drawn in
       here too, and its keypad, buttons and chips keep their own layout) */
    .st-menu-left > .menu-chips,
    .st-menu-right > .menu-chips {
      flex-direction: column;
      align-items: stretch;
      padding: 6px 0;
    }
    .st-menu-left > .menu-arm,
    .st-menu-right > .menu-arm {
      flex-direction: column;
      margin: 6px 0;
    }
    .st-menu-left > .modes,
    .st-menu-right > .modes,
    .st-menu-left > .keypad-wrap > .keys,
    .st-menu-right > .keypad-wrap > .keys {
      display: flex;
      flex-direction: column;
      padding: 6px 0;
    }
    .st-menu-left > .keypad-wrap,
    .st-menu-right > .keypad-wrap {
      padding: 0;
    }
    .st-menu-left > .keypad-wrap > .keys > .key,
    .st-menu-right > .keypad-wrap > .keys > .key {
      min-width: 46px;
      padding: 0 10px;
    }
    /* center the text on the card: icon · text · an empty column as wide as the icon's */
    .head.align-text {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      column-gap: 12px;
      padding-right: 0;
    }
    .head.align-text > .mode-icon {
      justify-self: end;
    }
    .head.align-text > .head-text {
      max-width: none;
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
    /* Button Menu looks: chips, and the arm buttons' segmented bar (House Mode buttons and keypad keys reuse theirs) */
    .menu-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px 10px;
    }
    .mchip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      font-family: var(--hmac-chip-font, inherit);
      font-size: var(--hmac-chip-size, 12px);
      font-weight: var(--hmac-chip-weight, 500);
      font-style: var(--hmac-chip-style, normal);
      text-transform: var(--hmac-chip-transform, none);
      --mdc-icon-size: 18px;
    }
    .mchip.on {
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
      color: var(--primary-color);
    }
    .menu-arm {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: var(--b-gap, 0px);
      margin: 4px 10px 10px;
      padding: 4px;
    }
    .menu-arm::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--b-track, var(--primary-text-color));
      opacity: var(--b-track-opacity, 0.05);
      border-radius: 18px;
      pointer-events: none;
    }
    .arm-b {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-height: 40px;
      padding: 8px 2px;
      border: none;
      border-radius: 14px;
      background: var(--b-bg, none);
      box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font-family: var(--hmac-alarm-button-font, inherit);
      font-size: var(--hmac-alarm-button-size, 14px);
      font-weight: var(--hmac-alarm-button-weight, 400);
      text-transform: var(--hmac-alarm-button-transform, none);
      --mdc-icon-size: var(--hmac-alarm-icon-size, 22px);
    }
    .arm-b ha-icon {
      color: var(--b-ic, var(--primary-color));
    }
    .arm-b.on {
      background: var(--b-abg, var(--primary-color));
      box-shadow: inset 0 0 0 1px var(--b-abd, transparent);
      color: #fff;
    }
    .arm-b.on ha-icon {
      color: var(--b-aic, #fff);
    }
    .menu-arm.follow .arm-b span {
      color: var(--b-ic, var(--primary-color));
    }
    .menu-arm.follow .arm-b.on span {
      color: var(--b-aic, #fff);
    }
    .menu-arm.round .arm-b {
      border-radius: 50px;
    }
    .menu-keys .key {
      --mdc-icon-size: 22px;
    }
    .menu-keys .key.on {
      border-color: var(--primary-color);
      color: var(--primary-color);
      box-shadow: inset 0 0 0 1px var(--primary-color);
    }
    .menu-empty {
      padding: 6px 12px;
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
    description: 'House Mode, alarm and physical panel keypad in one card.',
    preview: true,
  });

console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${CARD_VERSION} `, 'background:#03a9f4;color:#fff', 'background:#333;color:#fff');
