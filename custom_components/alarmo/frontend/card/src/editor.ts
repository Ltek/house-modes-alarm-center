// Visual editor for the House Modes & Alarm Center Card, following CARD_DESIGN_SYSTEM.md:
// --ltek-* chrome tokens (§1), collapsible top-level panels with an accent border when open, flat sub-panels with
// UPPERCASE accent titles, mixed-case group subtitles (§2), sliders for every size, the four-mode color control
// (§3), three-state selects for boolean style overrides (§5) and byte-stable YAML: a key is written only when set.
import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from './alarm/lib/types';
import { VERSION } from '../../src/const';
import {
  CardConfig,
  CardData,
  DEFAULTS,
  ICON_ELEMENTS,
  IconElement,
  TEXT_ELEMENTS,
  TextElement,
  TextStyle,
  pruneStyles,
  migrateConfig,
  BUTTON_PRESETS,
  presetOf,
  FX_DEFAULTS,
  FX_PARTS,
  ARM_STATE_LABELS,
  ARM_DEFAULT_COLORS,
  FX_PREVIEW,
  FX_TARGETS,
  FX_TRIGGERS,
  FX_TRIGGER_LABELS,
  EffectsConfig,
  SECTION_INFO,
  statusLayout,
  StatusSection,
  StatusLine,
  STATUS_LINES,
  STATUS_LINE_INFO,
  OLD_STATUS_KEYS,
  newStatusId,
} from './data';

const THEME_COLORS: [string, string][] = [
  ['var(--primary-color)', 'Primary'],
  ['var(--accent-color)', 'Accent'],
  ['var(--primary-text-color)', 'Primary text'],
  ['var(--secondary-text-color)', 'Secondary text'],
  ['var(--disabled-text-color)', 'Disabled text'],
  ['var(--state-active-color)', 'State active'],
  ['var(--error-color)', 'Error'],
  ['var(--warning-color)', 'Warning'],
  ['var(--success-color)', 'Success'],
  ['var(--info-color)', 'Info'],
];

export const colorMode = (cur: unknown): 'default' | 'theme' | 'custom' | 'css' => {
  const v = cur == null ? '' : String(cur);
  if (v === '') return 'default';
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return 'custom';
  if (/^var\(/.test(v) && THEME_COLORS.some(([t]) => t === v)) return 'theme';
  return 'css';
};

const ALARM_KEYS = ['keep_keypad_visible', 'use_code_dialog', 'hide_keypad', 'show_messages', 'show_ready_indicator', 'show_bypassed_sensors'];
const ALARM_DEFAULTS: Record<string, boolean> = {
  keep_keypad_visible: false,
  use_code_dialog: false,
  hide_keypad: false,
  show_messages: true,
  show_ready_indicator: true,
  show_bypassed_sensors: true,
};
const ALARM_LABELS: Record<string, string> = {
  keep_keypad_visible: 'Always show the code keypad',
  use_code_dialog: 'Ask for the code in a dialog',
  hide_keypad: 'Hide the code keypad',
  show_messages: 'Messages (not ready, triggered)',
  show_ready_indicator: 'Ready dot on the arm buttons',
  show_bypassed_sensors: 'Warn about bypassed zones',
};
const WEIGHTS = [300, 400, 500, 600, 700, 800];
const FONTS: [string, string][] = [
  ['monospace', 'Monospace (panel display)'],
  ['sans', 'Sans-serif (theme)'],
  ['serif', 'Serif'],
];
const FONT_NAME: Record<string, string> = { monospace: 'monospace', sans: 'sans-serif', serif: 'serif' };

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v ?? null));
/** A swatch seed: #rrggbb only (a theme color or name falls back to gray). */
const toHex6 = (c: string) => (/^#[0-9a-fA-F]{6}$/.test(c || '') ? c : '#9e9e9e');

@customElement('house-modes-alarm-center-card-editor')
export class HouseModesAlarmCenterCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private data?: CardData;

  setConfig(config: CardConfig) {
    this.config = migrateConfig(config);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (FX_PREVIEW.on) FX_PREVIEW.set(false); // the preview never outlives the editor
  }

  private setFxPart(target: string, part: string, value: string) {
    const fx: any = { ...((this.config || ({} as any)).effects || {}) };
    const t = { ...(fx[target] || {}) };
    if (!value || value === 'none') delete t[part];
    else t[part] = value;
    if (Object.keys(t).length) fx[target] = t;
    else delete fx[target];
    this.emit({ ...(this.config as CardConfig), effects: fx });
  }

  private setFx(key: string, value: unknown) {
    const fx: any = { ...((this.config || ({} as any)).effects || {}) };
    if (value === undefined || value === '' || value === 'none') delete fx[key];
    else fx[key] = value;
    this.emit({ ...(this.config as CardConfig), effects: fx });
  }

  private setMap(key: 'mode_colors' | 'arm_colors' | 'key_flash', id: string, value: string | undefined) {
    const map: any = { ...((this.config as any)?.[key] || {}) };
    if (value === undefined || value === '') delete map[id];
    else map[id] = value;
    this.set(key, Object.keys(map).length ? map : undefined);
  }

  /** §5 two levels: the card background, and the same property per section ("Card background" = inherit). */
  private sectionBg(key: 'header_section' | 'modes_section' | 'alarm_section' | 'keypad_section') {
    return html`${this.group('Background')}
      ${this.color('Section background', this.styleOf(key).background, 'Card background', '#262626',
        v => this.setStyle(key, 'background', v))}`;
  }

  private effectsBody() {
    const fx: EffectsConfig = this.config?.effects || {};
    const when = fx.when || FX_DEFAULTS.when;
    const opts: [string, string][] = [['none', 'Off'], ['glow', 'Glow'], ['pulse', 'Pulse'], ['both', 'Glow + pulse']];
    const partLabel: Record<string, string> = { background: 'Background', border: 'Border', icon: 'Icon' };
    return html`
      ${(Object.keys(FX_TARGETS) as (keyof typeof FX_TARGETS)[]).map(t => html`
        ${this.group(FX_TARGETS[t].label)}
        ${FX_PARTS.filter(p => (FX_TARGETS[t].parts as string[]).includes(p)).map(p =>
          this.select(partLabel[p], (fx[t] as any)?.[p] || 'none', opts, v => this.setFxPart(t, p, v)))}`)}
      ${fx.mode_button || fx.arm_button ? html`<p class="hint">Buttons glow and pulse in their own House Mode / arm mode color.</p>` : nothing}
      ${this.group('When')}
      ${FX_TRIGGERS.map(t => this.toggle(FX_TRIGGER_LABELS[t], when.includes(t), v => {
        const next = v ? [...new Set([...when, t])] : when.filter(x => x !== t);
        this.setFx('when', FX_TRIGGERS.every(x => next.includes(x)) ? undefined : next);
      }))}
      ${this.group('Look')}
      ${this.slider('Glow size', fx.size || 0, 2, 60, 1, ' px', FX_DEFAULTS.size, v => this.setFx('size', v || undefined))}
      ${this.slider('Pulse speed', fx.speed || 0, 0.4, 6, 0.1, ' s', FX_DEFAULTS.speed, v => this.setFx('speed', v ? Math.round(v * 10) / 10 : undefined))}
      ${this.color('Effect color', fx.color, 'State color (the border color)', '#ff9800', v => this.setFx('color', v))}
      ${this.group('Try it')}
      ${this.toggle('Preview the effects now', FX_PREVIEW.on, v => {
        FX_PREVIEW.set(v);
        this.requestUpdate();
      }, 'for 20 s; not saved')}
    `;
  }

  private displayBody() {
    const c = this.cfg;
    const rep = c.display_replace || [];
    const setRep = (next: { from: string; to?: string }[]) => this.set('display_replace', next.length ? next : undefined);
    return html`
      ${this.group('Panel display text')}
      <div class="row"><span class="lab">Replace</span>
        <button class="add" @click=${() => setRep([...rep, { from: '', to: '' }])}>+ Replacement</button></div>
      ${rep.map((x, i) => html`<div class="row rep">
        <input type="text" aria-label="Find" placeholder="find" .value=${x.from || ''}
          @change=${(e: any) => setRep(rep.map((y, j) => (j === i ? { ...y, from: e.target.value } : y)))} />
        <span class="lab">→</span>
        <input type="text" aria-label="Replace with" placeholder="replace with (empty = remove)" .value=${x.to || ''}
          @change=${(e: any) => setRep(rep.map((y, j) => (j === i ? { ...y, to: e.target.value || undefined } : y)))} />
        <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${() => setRep(rep.filter((_, j) => j !== i))}>
          <ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
      </div>`)}
      <p class="hint">Applied in order, to each line; exact text, case sensitive. Replace "*" with nothing to turn
        ****DISARMED**** into DISARMED.</p>
    `;
  }

  protected firstUpdated() {
    this.hass
      ?.callWS<CardData>({ type: 'alarmo/ext/card/get' })
      .then(d => (this.data = d))
      .catch(() => undefined);
  }

  // ------------------------------------------------------------ writing

  private get cfg(): Required<CardConfig> {
    return { ...DEFAULTS, ...(this.config || {}) } as Required<CardConfig>;
  }

  private emit(next: CardConfig) {
    const v: any = { ...next };
    for (const [k, d] of Object.entries(DEFAULTS)) if (v[k] === d) delete v[k];
    if (Array.isArray(v.hidden_modes) && !v.hidden_modes.length) delete v.hidden_modes;
    const styles = pruneStyles(v.styles);
    if (styles) v.styles = styles;
    else delete v.styles;
    if (v.alarm) {
      for (const [k, d] of Object.entries(ALARM_DEFAULTS)) if (v.alarm[k] === d) delete v.alarm[k];
      for (const k of ['button_scale_actions', 'button_scale_keypad']) if (v.alarm[k] === 1) delete v.alarm[k];
      if (!Object.keys(v.alarm).length) delete v.alarm;
    }
    if (!v.name) delete v.name;
    delete v.alarm_colors_from_modes;
    // Status sections: once edited, the config uses status_sections + section_order (old status keys dropped)
    const lay = statusLayout(v);
    v.status_sections = lay.sections.map(x => {
      const y: any = { ...x };
      if (y.show === true) delete y.show;
      if (!y.countdown) delete y.countdown;
      if (!y.collapsible) delete y.collapsible;
      if (y.start_collapsed === true) delete y.start_collapsed;
      if (y.icon === 'house') delete y.icon;
      if (!y.background) delete y.background;
      if (y.styles && !Object.keys(pruneStyles(y.styles) || {}).length) delete y.styles;
      else if (y.styles) y.styles = pruneStyles(y.styles);
      return y;
    });
    v.section_order = lay.order;
    for (const k of OLD_STATUS_KEYS) delete v[k];
    if (v.styles) {
      delete v.styles.header_section;
      delete v.styles.alarm_status_section;
      if (!Object.keys(v.styles).length) delete v.styles;
    }
    for (const k of ['effects', 'mode_colors', 'arm_colors', 'key_flash']) if (v[k] && !Object.keys(v[k]).length) delete v[k];
    if (!v.entity) delete v.entity;
    this.config = v;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: v }, bubbles: true, composed: true }));
  }

  private set(key: string, value: unknown) {
    this.emit({ ...(this.config as CardConfig), [key]: value });
  }

  private setAlarm(key: string, value: unknown) {
    const alarm = { ...((this.config || ({} as any)).alarm || {}), [key]: value };
    this.emit({ ...(this.config as CardConfig), alarm });
  }

  private setStyle(el: string, key: string, value: unknown) {
    const styles: any = clone((this.config || ({} as any)).styles || {});
    styles[el] = { ...(styles[el] || {}) };
    if (value === undefined || value === '' || value === null) delete styles[el][key];
    else styles[el][key] = value;
    this.emit({ ...(this.config as CardConfig), styles });
  }

  private styleOf(el: string): any {
    return ((this.config || ({} as any)).styles || {})[el] || {};
  }

  // ------------------------------------------------------------ controls

  private toggle(label: string, checked: boolean, onChange: (v: boolean) => void, hint?: string) {
    return html`<label class="row check">
      <input type="checkbox" .checked=${checked} @change=${(e: any) => onChange(e.target.checked)} />
      <span>${label}</span>${hint ? html`<span class="hint inline">${hint}</span>` : nothing}
    </label>`;
  }

  /** §2: sizes are sliders with a bold tabular readout; 0 = the default (nothing written). */
  private slider(label: string, value: number, min: number, max: number, step: number, unit: string, def: number,
    onChange: (v: number) => void, zeroIsDefault = true) {
    return html`<div class="row slider">
      <span class="lab">${label}</span>
      <div class="ctl nowrap">
        <input type="range" .min=${String(zeroIsDefault ? 0 : min)} .max=${String(max)} .step=${String(step)}
          .value=${String(value || (zeroIsDefault ? 0 : min))}
          @input=${(e: any) => {
            const v = Number(e.target.value);
            onChange(zeroIsDefault && v > 0 && v < min ? min : v);
          }} />
        <span class="val">${zeroIsDefault && !value ? html`<span class="muted">${def}${unit}</span>` : html`${value}${unit}`}</span>
      </div>
    </div>`;
  }

  private select(label: string, value: string, options: [string, string][], onChange: (v: string) => void) {
    return html`<div class="row">
      <span class="lab">${label}</span>
      <select class="ctl" @change=${(e: any) => onChange(e.target.value)}>
        ${options.map(([v, l]) => html`<option value=${v} ?selected=${v === value}>${l}</option>`)}
      </select>
    </div>`;
  }

  /** §5: a boolean override needs three states. */
  private triState(label: string, value: boolean | undefined, defaultLabel: string, onChange: (v: boolean | undefined) => void) {
    const cur = value === undefined ? '' : value ? 'on' : 'off';
    return this.select(label, cur, [['', defaultLabel], ['off', 'Off'], ['on', 'On']], v =>
      onChange(v === '' ? undefined : v === 'on'));
  }

  /**
   * §3: the four-mode color control. `presets` add context choices to the mode list (Transparent, None, House Mode
   * color, …), stored as their keyword.
   */
  private color(label: string, value: string | undefined, defaultLabel: string, seedHex: string,
    onChange: (v: string | undefined) => void, presets: [string, string][] = []) {
    const preset = presets.find(([v]) => v === value);
    const mode = preset ? `preset:${preset[0]}` : colorMode(value);
    const swatch = /^#[0-9a-fA-F]{6}$/.test(value || '') ? value! : seedHex;
    return html`<div class="row">
      <span class="lab">${label}</span>
      <div class="ctl color">
        <select aria-label=${`${label}: kind`} @change=${(e: any) => {
          const m = e.target.value;
          if (m.startsWith('preset:')) onChange(m.slice(7));
          else if (m === 'default') onChange(undefined);
          else if (m === 'theme') onChange(THEME_COLORS[0][0]);
          else if (m === 'custom') onChange(swatch);
          else onChange(value && (mode === 'theme' || mode === 'custom' || mode === 'css') ? value : seedHex);
        }}>
          <option value="default" ?selected=${mode === 'default'}>${defaultLabel}</option>
          ${presets.map(([v, l]) => html`<option value=${`preset:${v}`} ?selected=${mode === `preset:${v}`}>${l}</option>`)}
          <option value="theme" ?selected=${mode === 'theme'}>Theme color</option>
          <option value="custom" ?selected=${mode === 'custom'}>Custom color</option>
          <option value="css" ?selected=${mode === 'css'}>CSS value</option>
        </select>
        ${mode === 'theme'
          ? html`<select aria-label=${`${label}: theme color`} @change=${(e: any) => onChange(e.target.value)}>
              ${THEME_COLORS.map(([v, l]) => html`<option value=${v} ?selected=${v === value}>${l}</option>`)}
            </select>`
          : mode === 'custom'
            ? html`<input type="color" aria-label=${label} .value=${swatch} @input=${(e: any) => onChange(e.target.value)} />`
            : mode === 'css'
              ? html`<input type="text" aria-label=${label} placeholder="tomato, rgba(…), var(--…)" .value=${value || ''}
                  @change=${(e: any) => onChange(e.target.value || undefined)} />`
              : nothing}
      </div>
    </div>`;
  }

  // ------------------------------------------------------------ layout pieces

  private panel(id: string, icon: string, title: string, hint: string, body: TemplateResult | TemplateResult[], open = false) {
    return html`<details class="panel" ?open=${open} data-id=${id} @toggle=${this.onlyOne}>
      <summary><ha-icon icon=${icon}></ha-icon><span>${title}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${hint}</p>${body}</div>
    </details>`;
  }

  private sub(title: string, body: TemplateResult | TemplateResult[] | typeof nothing) {
    return html`<details class="sub" @toggle=${this.onlyOne}>
      <summary><span>${title}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${body}</div>
    </details>`;
  }

  /** Only one panel open at a time: opening one closes its open siblings (top-level panels, and sub-panels). */
  private onlyOne = (e: Event) => {
    const d = e.currentTarget as HTMLDetailsElement;
    if (!d.open) return;
    const cls = d.classList.contains('panel') ? 'panel' : 'sub';
    for (const other of Array.from(d.parentElement?.children || []))
      if (other !== d && other instanceof HTMLDetailsElement && other.classList.contains(cls) && other.open) other.open = false;
  };

  private group(title: string) {
    return html`<div class="group">${title}</div>`;
  }

  private textStyle(el: TextElement, scope?: { get: () => TextStyle; set: (k: string, v: unknown) => void; label?: string },
    extra?: TemplateResult): TemplateResult {
    const d = TEXT_ELEMENTS[el];
    const t: TextStyle = scope ? scope.get() : this.styleOf(el);
    const setStyle = (_el: string, k: string, v: unknown) => (scope ? scope.set(k, v) : setStyle(el, k, v));
    return this.sub(scope?.label || d.label, html`
      ${extra || nothing}
      ${this.group('Size and weight')}
      ${this.slider('Size', t.size || 0, 6, 48, 1, ' px', d.size, v => setStyle(el, 'size', v || undefined))}
      ${this.select('Weight', t.weight ? String(t.weight) : '', [['', `Card default (${d.weight})`], ...WEIGHTS.map(w => [String(w), String(w)] as [string, string])],
        v => setStyle(el, 'weight', v ? Number(v) : undefined))}
      ${this.group('Font and case')}
      ${this.select('Font', t.font || '', [['', `Card default (${FONT_NAME[d.font]})`], ...FONTS], v => setStyle(el, 'font', v || undefined))}
      ${this.triState('Italic', t.italic, 'Card default (off)', v => setStyle(el, 'italic', v))}
      ${this.triState('Capitals', t.caps, `Card default (${d.caps ? 'on' : 'off'})`, v => setStyle(el, 'caps', v))}
      ${this.group('Color')}
      ${this.color('Text color', t.color, 'Card default', '#e1e1e1', v => setStyle(el, 'color', v))}
    `);
  }

  private iconStyle(el: IconElement, withColor?: { defaultLabel: string; presets: [string, string][] }): TemplateResult {
    const d = ICON_ELEMENTS[el];
    const i = this.styleOf(el);
    return this.sub(d.label, html`
      ${this.group('Size')}
      ${this.slider('Size', i.size || 0, 12, 96, 1, ' px', d.size, v => this.setStyle(el, 'size', v || undefined))}
      ${withColor
        ? html`${this.group('Color')}
            ${this.color('Icon color', i.color, withColor.defaultLabel, '#9e9e9e', v => this.setStyle(el, 'color', v), withColor.presets)}`
        : nothing}
    `);
  }

  private applyPreset(set: 'mode_button' | 'arm_button', icon: 'mode_icon' | 'alarm_icon', key: string) {
    const p = BUTTON_PRESETS[key];
    if (!p) return;
    const styles: any = clone((this.config || ({} as any)).styles || {});
    styles[set] = { ...p.button };
    const size = (styles[icon] || {}).size;
    styles[icon] = { ...p.icon, ...(size ? { size } : {}) };
    this.emit({ ...(this.config as CardConfig), styles });
  }

  private keyPreset(): string {
    const k = this.styleOf('key_button');
    if (!k.background && !k.border) return 'filled';
    if (k.background === 'transparent' && !k.border) return 'outline';
    if (k.background === 'transparent' && k.border === 'none') return 'plain';
    return '';
  }

  private setKeyPreset(v: string) {
    const styles: any = clone((this.config || ({} as any)).styles || {});
    if (v === 'filled') delete styles.key_button;
    else if (v === 'outline') styles.key_button = { background: 'transparent' };
    else if (v === 'plain') styles.key_button = { background: 'transparent', border: 'none' };
    else return;
    this.emit({ ...(this.config as CardConfig), styles });
  }

  /** Colors of a set of buttons (§3 control everywhere; 'mode' = each button's own House Mode / arm mode color). */
  private buttonColors(set: 'mode_button' | 'arm_button', icon: 'mode_icon' | 'alarm_icon', own: string, defaults: {
    bg: string; abg: string; ic: string; aic: string; }): TemplateResult {
    const b = this.styleOf(set);
    const i = this.styleOf(icon);
    const fill: [string, string][] = [['transparent', 'Transparent'], ['mode', own]];
    const line: [string, string][] = [['none', 'None'], ['mode', own]];
    const ink: [string, string][] = [['mode', own]];
    const preset = presetOf(b, i);
    return this.sub('Button colors', html`
      ${this.group('Style')}
      ${this.select('Style', preset, [...Object.entries(BUTTON_PRESETS).map(([k, p]) => [k, p.label] as [string, string]),
        ...(preset ? [] : [['', 'Custom (the settings below)'] as [string, string]])], v => this.applyPreset(set, icon, v))}
      <p class="hint">${own} = each button's own color${set === 'arm_button' ? ' (see Arm mode colors above)' : ''}. Pick a style, then
        fine-tune it below.</p>
      ${this.group('Background')}
      ${this.color('Background', b.background, defaults.bg, '#2a2a2a', v => this.setStyle(set, 'background', v), fill)}
      ${this.color('Background (selected)', b.active_background, defaults.abg, '#3a3a3a', v => this.setStyle(set, 'active_background', v), fill)}
      ${set === 'arm_button' ? this.color('Bar behind the buttons', b.track, 'Card default (faint)', '#202020', v => this.setStyle(set, 'track', v), [['transparent', 'Transparent']]) : nothing}
      ${this.group('Border')}
      ${this.color('Border', b.border, 'Card default (none)', '#444444', v => this.setStyle(set, 'border', v), line)}
      ${this.color('Border (selected)', b.active_border, 'Same as not selected', '#ffffff', v => this.setStyle(set, 'active_border', v), line)}
      ${this.group('Icon and text')}
      ${this.color('Icon color', i.color, defaults.ic, '#9e9e9e', v => this.setStyle(icon, 'color', v), ink)}
      ${this.color('Icon color (selected)', i.active_color, defaults.aic, '#ffffff', v => this.setStyle(icon, 'active_color', v), ink)}
      ${this.toggle('Text color follows the icon', !!b.text_follows_icon, v => this.setStyle(set, 'text_follows_icon', v || undefined))}
    `);
  }

  /** The card's sections: Status sections and their order. */
  private get layout() {
    return statusLayout(this.cfg as any);
  }

  /** Write the Status sections (and keep the order in step). */
  private setStatus(sections: StatusSection[], order?: string[]) {
    this.emit({ ...(this.config as CardConfig), status_sections: sections, section_order: order || this.layout.order } as any);
  }

  private updStatus(id: string, fn: (x: StatusSection) => void) {
    const sections = clone(this.layout.sections);
    const x = sections.find(y => y.id === id);
    if (!x) return;
    fn(x);
    this.setStatus(sections);
  }

  private addStatus() {
    const { sections, order } = this.layout;
    const id = newStatusId(sections);
    const x: StatusSection = { id, name: `Status ${sections.length + 1}`, icon: 'house', countdown: true, lines: ['house_mode'] };
    this.setStatus([...clone(sections), x], [`status:${id}`, ...order]);
  }

  private removeStatus(id: string) {
    const { sections, order } = this.layout;
    const x = sections.find(y => y.id === id);
    if (!window.confirm(`Delete the Status section "${x?.name || id}"?`)) return;
    this.setStatus(sections.filter(y => y.id !== id), order.filter(o => o !== `status:${id}`));
  }

  /** One Status section's panel: name, icon slot, lines (ordered), background, styles. */
  private statusPanel(st: StatusSection) {
    const lines = st.lines || [];
    const sty = (el: TextElement) => ({
      get: () => ((st.styles || {}) as any)[el] || {},
      set: (k: string, v: unknown) => this.updStatus(st.id, x => {
        const styles: any = { ...(x.styles || {}) };
        const e = { ...(styles[el] || {}) };
        if (v === undefined || v === '' || v === null) delete e[k];
        else e[k] = v;
        if (Object.keys(e).length) styles[el] = e;
        else delete styles[el];
        x.styles = Object.keys(styles).length ? styles : undefined;
      }),
      label: `${TEXT_ELEMENTS[el].label} (this section)`,
    });
    const moveLine = (i: number, d: number) => this.updStatus(st.id, x => {
      const l = [...(x.lines || [])];
      [l[i], l[i + d]] = [l[i + d], l[i]];
      x.lines = l;
    });
    const free = STATUS_LINES.filter(l => !lines.includes(l));
    const icon = st.styles?.header_icon || {};
    return this.panel(`status:${st.id}`, 'mdi:information-outline', st.name || 'Status', 'A status block: an icon (or the countdown during a delay) and the lines you choose, in order.', html`
      ${this.group('Name')}
      <div class="row"><span class="lab">Name</span>
        <input class="ctl" type="text" .value=${st.name || ''} @change=${(e: any) => this.updStatus(st.id, x => (x.name = e.target.value || undefined))} /></div>
      ${this.group('Icon')}
      ${this.select('Icon', st.icon || 'house', [
        ['house', "House Mode's icon (the alarm's when House Modes are off)"],
        ['alarm', "The alarm state's icon"],
        ['none', 'No icon'],
      ], v => this.updStatus(st.id, x => (x.icon = v as any)))}
      ${st.icon !== 'none' ? this.toggle('Countdown circle in its place during an exit or entry delay', !!st.countdown, v => this.updStatus(st.id, x => (x.countdown = v || undefined))) : nothing}
      ${this.group('Lines')}
      <div class="row">
        <select class="add-sel" aria-label="Add a line" @change=${(e: any) => {
          const v = e.target.value as StatusLine;
          e.target.value = '';
          if (v) this.updStatus(st.id, x => (x.lines = [...(x.lines || []), v]));
        }}>
          <option value="">+ Line…</option>
          ${free.map(l => html`<option value=${l}>${STATUS_LINE_INFO[l].label}</option>`)}
        </select>
      </div>
      ${lines.map((l, i) => html`<div class="line-row">
        <span>${STATUS_LINE_INFO[l]?.label || l}</span>
        <span class="order">
          <button class="icon-btn" title="Move up" aria-label="Move up" ?disabled=${i === 0} @click=${() => moveLine(i, -1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="icon-btn" title="Move down" aria-label="Move down" ?disabled=${i === lines.length - 1} @click=${() => moveLine(i, 1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${() => this.updStatus(st.id, x => (x.lines = (x.lines || []).filter(y => y !== l)))}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
        </span>
      </div>`)}
      ${!lines.length ? html`<p class="hint">No lines: only the icon is shown.</p>` : nothing}
      ${lines.some(l => l.startsWith('panel_')) ? this.displayBody() : nothing}
      ${this.group('Background')}
      ${this.color('Section background', st.background, 'Card background', '#262626', v => this.updStatus(st.id, x => (x.background = v)))}
      ${this.group('Styles')}
      ${st.icon !== 'none'
        ? this.sub('Icon (this section)', html`
            ${this.slider('Size', icon.size || 0, 12, 96, 1, ' px', ICON_ELEMENTS.header_icon.size, v => this.updStatus(st.id, x => {
              const ic = { ...(x.styles?.header_icon || {}), size: v || undefined };
              x.styles = { ...(x.styles || {}), header_icon: ic };
            }))}
            ${this.color('Icon color', icon.color, st.icon === 'alarm' ? 'Arm mode color' : 'House Mode color', '#9e9e9e', v => this.updStatus(st.id, x => {
              const ic = { ...(x.styles?.header_icon || {}), color: v };
              x.styles = { ...(x.styles || {}), header_icon: ic };
            }), [['mode', st.icon === 'alarm' ? 'Arm mode color' : 'House Mode color']])}`)
        : nothing}
      ${lines.map(l => this.textStyle(STATUS_LINE_INFO[l].style, sty(STATUS_LINE_INFO[l].style)))}
      <p class="hint">A style left at "Card default" uses the one under Card → Status text (all Status sections).</p>
    `);
  }

  /** One row of the Sections panel: icon · name · hint · chips (Collapsible, Starts collapsed) · eye ↑ ↓ (· trash). */
  private sectionRow(id: string, index: number, all: string[]) {
    const c: any = this.cfg;
    const move = (d: number) => {
      const next = [...all];
      [next[index], next[index + d]] = [next[index + d], next[index]];
      this.setStatus(clone(this.layout.sections), next);
    };
    const st = id.startsWith('status:') ? this.layout.sections.find(x => `status:${x.id}` === id) : undefined;
    const fixed = st ? undefined : (SECTION_INFO as any)[id];
    if (!st && !fixed) return nothing;
    const title = st ? st.name || 'Status' : fixed.title;
    const hint = st ? (st.lines || []).map(l => STATUS_LINE_INFO[l]?.label.split(' (')[0]).join(', ') || 'icon only' : fixed.hint;
    const show = st ? st.show !== false : !!c[fixed.show];
    const collapse = st ? !!st.collapsible : !!c[fixed.collapse];
    const start = st ? st.start_collapsed !== false : !!c[fixed.start];
    const setShow = (v: boolean) => (st ? this.updStatus(st.id, x => (x.show = v ? undefined : false)) : this.set(fixed.show, v));
    const setCollapse = (v: boolean) => (st ? this.updStatus(st.id, x => (x.collapsible = v || undefined)) : this.set(fixed.collapse, v));
    const setStart = (v: boolean) => (st ? this.updStatus(st.id, x => (x.start_collapsed = v ? undefined : false)) : this.set(fixed.start, v));
    const icon = st ? 'mdi:information-outline' : (({ house_modes: 'mdi:home-switch-outline', alarm: 'mdi:shield-lock-outline', keypad: 'mdi:dialpad' }) as any)[id];
    return html`<div class="sec-row ${show ? '' : 'hidden'}">
      <ha-icon class="sec-ic" icon=${icon}></ha-icon>
      <div class="sec-text">
        <span class="sec-name">${title}</span>
        ${hint ? html`<span class="hint inline">${hint}</span>` : nothing}
        ${show
          ? html`<span class="sec-chips">
              <button class="chip ${collapse ? 'on' : ''}" aria-pressed=${collapse ? 'true' : 'false'}
                title="A bar expands and collapses this section" @click=${() => setCollapse(!collapse)}>
                <ha-icon icon="mdi:unfold-less-horizontal"></ha-icon>Collapsible</button>
              ${collapse
                ? html`<button class="chip ${start ? 'on' : ''}" aria-pressed=${start ? 'true' : 'false'}
                    title="Collapsed when the card first appears" @click=${() => setStart(!start)}>
                    <ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon>Starts collapsed</button>`
                : nothing}
            </span>`
          : nothing}
      </div>
      <span class="order">
        <button class="icon-btn" title=${show ? 'Hide' : 'Show'} aria-label=${`${show ? 'Hide' : 'Show'} ${title}`} @click=${() => setShow(!show)}>
          <ha-icon icon=${show ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}></ha-icon></button>
        <button class="icon-btn" title="Move up" aria-label=${`Move ${title} up`} ?disabled=${index === 0} @click=${() => move(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon-btn" title="Move down" aria-label=${`Move ${title} down`} ?disabled=${index === all.length - 1} @click=${() => move(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
        ${st ? html`<button class="icon-btn del" title="Delete" aria-label=${`Delete ${title}`} @click=${() => this.removeStatus(st.id)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>` : html`<span class="spacer"></span>`}
      </span>
    </div>`;
  }

  // ------------------------------------------------------------ render

  render() {
    if (!this.hass || !this.config) return nothing;
    const c = this.cfg;
    const alarm: any = { ...ALARM_DEFAULTS, button_scale_actions: 1, button_scale_keypad: 1, ...(this.config.alarm || {}) };
    const alarms = this.data?.alarms || [];
    const modes = this.data?.house.modes || [];
    const frame = this.styleOf('card');
    return html`<div class="ed">
      <div class="ed-header">
        <ha-icon icon="mdi:shield-home"></ha-icon>
        <span class="ed-header-title">House Modes &amp; Alarm Center Card</span>
        <span class="ed-header-build">v${VERSION}</span>
      </div>
      ${this.panel('card', 'mdi:card-outline', 'Card', 'Which Alarmo alarm the card controls, and the frame around it.', html`
        ${this.group('Alarm')}
        ${this.select('Alarmo alarm', c.entity || '', [['', 'First linked alarm'], ...alarms.map(a => [a.entity_id, `${a.name} (${a.entity_id})`] as [string, string])],
          v => this.set('entity', v || undefined))}
        <div class="row"><span class="lab">Name</span>
          <input class="ctl" type="text" placeholder="Shown when House Modes are off" .value=${c.name || ''}
            @change=${(e: any) => this.set('name', e.target.value || undefined)} /></div>
        ${this.group('Frame')}
        ${this.slider('Border width', frame.border_width ?? 2, 0, 8, 1, ' px', 2, v => this.setStyle('card', 'border_width', v === 2 ? undefined : v), false)}
        ${this.slider('Corner radius', frame.radius ?? 12, 0, 32, 1, ' px', 12, v => this.setStyle('card', 'radius', v === 12 ? undefined : v), false)}
        ${this.color('Card background', frame.background, 'Theme card background', '#1c1c1c', v => this.setStyle('card', 'background', v), [['transparent', 'Transparent']])}
        <p class="hint">The card background is the default for every section; a section can set its own below (Header,
          House Mode buttons, Alarm, Physical panel keypad).</p>
        ${this.group('Status text (all Status sections)')}
        ${this.iconStyle('header_icon')}
        ${(['mode_name', 'alarm_name', 'alarm_state', 'line1', 'line2', 'changing', 'since'] as TextElement[]).map(el => this.textStyle(el))}
        ${this.group('Collapse')}
        ${this.toggle('Collapse the card to its first section (tap it to expand)', c.collapsible, v => this.set('collapsible', v))}
        ${c.collapsible ? this.toggle('Start collapsed', c.start_collapsed, v => this.set('start_collapsed', v)) : nothing}
        ${this.group('Border')}
        ${this.select('Border color', c.border_color, [
          ['mode', "The House Mode's color"],
          ['state', 'The alarm state (red alarm, orange arming / not ready, mode color armed, green ready)'],
        ], v => this.set('border_color', v))}
      `, true)}

      ${this.panel('sections', 'mdi:view-agenda-outline', 'Sections', 'The parts of the card, in order: show or hide each one, make it collapsible, move it up or down.', html`
        <div class="row"><button class="add" @click=${() => this.addStatus()}>+ Status</button></div>
        <div class="sec-list">${this.layout.order.map((id, i, all) => this.sectionRow(id, i, all))}</div>
        <p class="hint">Tap a chip to switch it: <em>Collapsible</em> puts the section behind a bar that expands and
          collapses it; <em>Starts collapsed</em> is how it first appears. The eye shows or hides the section.</p>
        ${c.collapsible || Object.values(SECTION_INFO).some(x => (c as any)[x.collapse]) || this.layout.sections.some(x => x.collapsible)
          ? this.textStyle('alarm_bar', undefined, html`
              ${this.group('Arrow')}
              ${this.toggle('Show the expand / collapse arrow', c.show_chevron, v => this.set('show_chevron', v))}`)
          : nothing}
      `)}

      ${this.layout.sections.map(st => this.statusPanel(st))}

      ${this.panel('modes', 'mdi:home-switch-outline', 'House Mode buttons', 'One button per House Mode; icons and colors come from the House Modes tab.', c.show_house_modes
        ? html`
          ${this.group('Show')}
          ${this.toggle('Icons', c.show_mode_icons, v => this.set('show_mode_icons', v))}
          ${this.toggle('Text', c.show_mode_labels, v => this.set('show_mode_labels', v))}
          ${this.group('Layout')}
          ${this.select('Alignment', c.modes_align, [['grid', 'Standard (fixed columns, wrap left)'], ['center', 'Center on width']], v => this.set('modes_align', v))}
          ${this.slider('Buttons per row', c.columns, 2, 9, 1, '', 5, v => this.set('columns', v), false)}
          ${this.select('Shape', c.modes_shape, [['rounded', 'Rounded rectangles'], ['round', 'Round (circle around the icon)']], v => this.set('modes_shape', v))}
          ${this.select('Button width', c.modes_width, [['fill', 'Fill the width (share it equally)'], ['fit', 'Fit the content (centered)']], v => this.set('modes_width', v))}
          ${this.slider('Space between buttons', c.modes_gap ?? 4, 0, 24, 1, ' px', 4, v => this.set('modes_gap', v === 4 ? undefined : v), false)}
          ${this.slider('Button padding', c.modes_padding ?? 6, 0, 20, 1, ' px', 6, v => this.set('modes_padding', v === 6 ? undefined : v), false)}
          ${modes.length
            ? html`${this.group('Buttons shown')}
                <div class="chips">${modes.map(m => {
                  const hidden = (c.hidden_modes || []).includes(m.id) || (c.hidden_modes || []).includes(m.name);
                  return html`<button class="chip ${hidden ? '' : 'on'}" aria-pressed=${hidden ? 'false' : 'true'}
                    @click=${() => this.set('hidden_modes', hidden ? (c.hidden_modes || []).filter(x => x !== m.id && x !== m.name) : [...(c.hidden_modes || []), m.id])}>
                    <ha-icon icon=${m.icon} style=${`color:${m.color}`}></ha-icon>${m.name}</button>`;
                })}</div>`
            : nothing}
          ${modes.length
            ? this.sub('House Mode colors', html`
                <p class="hint">Each House Mode's color comes from the House Modes tab. Set one here to use a different color
                  on this card only.</p>
                ${modes.map(m => this.color(m.name, (c.mode_colors || {})[m.id], `House Modes tab (${m.color})`, toHex6(m.color),
                  v => this.setMap('mode_colors', m.id, v)))}`)
            : nothing}
          ${this.sectionBg('modes_section')}
          ${this.group('Styles')}
          ${this.buttonColors('mode_button', 'mode_icon', 'House Mode color', {
            bg: 'Card default (transparent)', abg: 'Card default (faint gray)', ic: 'Card default (secondary text)', aic: 'House Mode color' })}
          ${c.show_mode_icons ? this.iconStyle('mode_icon') : nothing}
          ${c.show_mode_labels ? this.textStyle('mode_label') : nothing}`
        : html`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel('alarm', 'mdi:shield-lock-outline', 'Alarm Panel buttons', 'Arm and disarm Alarmo, enter the code, see why it will not arm.', c.show_alarm
        ? html`
          ${this.group('Show')}
          ${this.toggle('Arm button icons', c.show_arm_icons, v => this.set('show_arm_icons', v))}
          ${this.toggle('Arm button text', c.show_arm_labels, v => this.set('show_arm_labels', v))}
          ${this.toggle('Option chips: Skip exit delay, Bypass open sensors', c.show_arm_options, v => this.set('show_arm_options', v))}
          ${this.group('Arm buttons')}
          ${this.select('Arm mode colors', c.alarm_colors, [
            ['modes', 'From the House Modes (the mode that sets each arm mode)'],
            ['standard', 'Standard (green disarmed, red away, orange home, …)'],
            ['theme', 'Home Assistant theme (alarm state colors)'],
          ], v => this.set('alarm_colors', v))}
          ${this.sub('Arm mode colors', html`
            <p class="hint">Change one arm mode, or match it to a House Mode's color.</p>
            ${Object.keys(ARM_STATE_LABELS).map(st => this.color(ARM_STATE_LABELS[st], (c.arm_colors || {})[st], 'From the choice above',
              ARM_DEFAULT_COLORS[st], v => this.setMap('arm_colors', st, v),
              modes.map(m => [`house:${m.id}`, `House Mode: ${m.name}`] as [string, string])))}`)}
          ${this.select('Shape', c.arm_shape, [['rounded', 'Rounded rectangles'], ['round', 'Round (circle around the icon)']], v => this.set('arm_shape', v))}
          ${this.select('Button width', c.arm_width, [['fill', 'Fill the width (share it equally)'], ['fit', 'Fit the content (centered)']], v => this.set('arm_width', v))}
          ${this.slider('Space between buttons', c.arm_gap ?? 0, 0, 24, 1, ' px', 0, v => this.set('arm_gap', v === 0 ? undefined : v), false)}
          ${this.slider('Button padding', c.arm_padding ?? 8, 0, 20, 1, ' px', 8, v => this.set('arm_padding', v === 8 ? undefined : v), false)}
          ${this.slider('Arm button scale', Math.round(alarm.button_scale_actions * 10) / 10, 1, 2.5, 0.1, '×', 1, v => this.setAlarm('button_scale_actions', v), false)}
          ${this.group('Code entry and messages')}
          ${ALARM_KEYS.map(k => this.toggle(ALARM_LABELS[k], !!alarm[k], v => this.setAlarm(k, v)))}
          ${this.slider('Code keypad scale', Math.round(alarm.button_scale_keypad * 10) / 10, 1, 2.5, 0.1, '×', 1, v => this.setAlarm('button_scale_keypad', v), false)}
          ${this.sectionBg('alarm_section')}
          ${this.group('Styles')}
          ${this.buttonColors('arm_button', 'alarm_icon', 'Arm mode color', {
            bg: 'Card default (transparent)', abg: 'Arm mode color', ic: 'Arm mode color', aic: 'Card default (white)' })}
          ${c.show_arm_icons ? this.iconStyle('alarm_icon') : nothing}
          ${c.show_arm_labels ? this.textStyle('alarm_button') : nothing}
          ${c.show_arm_options ? this.textStyle('chip') : nothing}`
        : html`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel('effects', 'mdi:shimmer', 'Effects', 'Make parts of the card glow or pulse while something is under way: arming, an entry delay, a House Mode change, an alarm.', this.effectsBody())}

      ${this.panel('keypad', 'mdi:dialpad', 'Physical panel keypad', "The panel's 12 keys with their functions, sent through Alarmo.", c.show_panel_keypad
        ? html`
          <p class="hint">Who may use the keys is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad on
            dashboards</em>. Other users see the keys disabled.</p>
          ${this.group('Show')}
          ${this.toggle('Key functions (OFF, AWAY, STAY, …)', c.show_key_labels, v => this.set('show_key_labels', v))}
          ${this.group('Keys')}
          ${this.select('Shape', c.keypad_shape, [['rounded', 'Rounded rectangles'], ['round', 'Round']], v => this.set('keypad_shape', v))}
          ${this.select('Style', this.keyPreset(), [
            ['filled', 'Filled (gray keys with a border)'],
            ['outline', 'Transparent with a border'],
            ['plain', 'Transparent, no border'],
            ...(this.keyPreset() ? [] : [['', 'Custom (the colors below)'] as [string, string]]),
          ], v => this.setKeyPreset(v))}
          ${this.color('Key background', this.styleOf('key_button').background, 'Card default (gray)', '#2a2a2a',
            v => this.setStyle('key_button', 'background', v), [['transparent', 'Transparent']])}
          ${this.color('Key border', this.styleOf('key_button').border, 'Card default (divider)', '#444444',
            v => this.setStyle('key_button', 'border', v), [['none', 'None']])}
          ${this.group('When a key is pressed')}
          ${this.color('Border glows', (c.key_flash || {}).border, 'Off', '#03a9f4', v => this.setMap('key_flash', 'border', v))}
          ${this.color('Background flashes', (c.key_flash || {}).background, 'Off', '#03a9f4', v => this.setMap('key_flash', 'background', v))}
          <p class="hint">For half a second, so you can see the key was sent.</p>
          ${this.sectionBg('keypad_section')}
          ${this.group('Styles')}
          ${this.textStyle('key_digit')}
          ${c.show_key_labels ? this.textStyle('key_label') : nothing}`
        : html`<p class="hint">Turned off under Sections.</p>`)}
    </div>`;
  }

  static styles = css`
    .ed {
      /* Font sizes (by role, not by pixel) */
      --ltek-fs-panel-title: 16px;  /* top-level panel / section title */
      --ltek-fs-header: 15px;       /* editor header, panel summary */
      --ltek-fs-group: 14px;        /* group heading inside a panel */
      --ltek-fs-label: 13px;        /* standard field label / row */
      --ltek-fs-body: 12px;         /* body text, most controls */
      --ltek-fs-small: 11px;        /* hints, secondary text */
      --ltek-fs-tiny: 10px;         /* badges, micro-labels */
      /* Font weights */
      --ltek-fw-normal: 400;        /* control labels (recede) */
      --ltek-fw-medium: 500;
      --ltek-fw-semibold: 600;
      --ltek-fw-bold: 700;          /* titles, values (lead) */
      /* Text colors */
      --ltek-c-text: var(--primary-text-color, #e1e1e1);  /* primary */
      --ltek-c-label: #ccc;         /* control labels */
      --ltek-c-muted: #888;         /* hints / disabled */
      --ltek-c-accent: var(--primary-color, #2196F3);
      /* Accent tints — hover / active fills */
      --ltek-c-accent-fade: rgba(var(--rgb-primary-color,33,150,243),0.12);       /* active / pressed fill */
      --ltek-c-accent-fade-soft: rgba(var(--rgb-primary-color,33,150,243),0.08);  /* hover fill */
      --ltek-c-error-fade: rgba(244,67,54,0.15);         /* delete hover fill */
      /* Status colors — defer to the user's theme, fall back to Material. */
      --ltek-c-error: var(--error-color, #f44336);
      --ltek-c-success: var(--success-color, #4caf50);
      --ltek-c-warning: var(--warning-color, #ffb300);
      --ltek-c-info: var(--info-color, #2196F3);
      /* Second accent: the green "library / shared" grouping (NOT tied to --primary-color). */
      --ltek-c-accent-lib: #7fd18a;
      --ltek-c-on-accent: #fff;   /* text/icon on a solid accent fill */
      /* Action icons: neutral idle → brighten on hover; delete uses error on hover. */
      --ltek-c-icon: #aaa;        /* idle action icon */
      --ltek-c-icon-hover: #fff;  /* hovered action icon */
      /* Surfaces */
      --ltek-c-surface: rgba(255,255,255,0.015);        /* panels */
      --ltek-c-surface-raised: rgba(255,255,255,0.02);  /* cards / rows */
      /* Borders */
      --ltek-c-panel-border: #3a3a3a;   /* panels */
      --ltek-c-border: #444;            /* controls */
      --ltek-c-border-soft: #333;       /* subtle inner dividers */
      /* Radii */
      --ltek-r-panel: 12px;   /* panels */
      --ltek-r-card: 10px;    /* section cards */
      --ltek-r-md: 8px;       /* blocks */
      --ltek-r-ctrl: 6px;     /* inputs, selects, buttons */
      /* Spacing scale (4px base) */
      --ltek-sp-1: 4px;  --ltek-sp-2: 6px;  --ltek-sp-3: 8px;
      --ltek-sp-4: 10px; --ltek-sp-5: 12px; --ltek-sp-6: 16px;
      /* Control padding — uniform input/select/button height. */
      --ltek-ctrl-pad: 6px 10px;
      /* Icon sizes (two clear roles; one-off glyphs stay literal). */
      --ltek-icon-sm: 16px;   /* inline / action icons */
      --ltek-icon-lg: 20px;   /* panel-title icons */
      /* Slider row geometry */
      --ltek-slider-val-w: 44px;   /* value readout column width */

      --hmac-ed-theme-accent: var(--accent-color, var(--ltek-c-accent));
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--ltek-c-text);
      font-size: var(--ltek-fs-body);
    }
    /* editor header: icon + name + build, as on the other Ltek cards */
    .ed-header {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      padding: 2px 2px 10px;
      border-bottom: 1px solid var(--ltek-c-border-soft);
      margin-bottom: 4px;
    }
    .ed-header ha-icon {
      --mdc-icon-size: 22px;
      color: var(--ltek-c-accent);
    }
    .ed-header-title {
      font-size: var(--ltek-fs-header);
      font-weight: var(--ltek-fw-bold);
      color: var(--ltek-c-text);
    }
    .ed-header-build {
      margin-left: auto;
      font-size: var(--ltek-fs-small);
      color: var(--ltek-c-muted);
      font-family: var(--code-font-family, monospace);
    }
    /* top-level panels: bordered box, accent border when open */
    .panel {
      border: 1px solid var(--ltek-c-panel-border);
      border-radius: var(--ltek-r-panel);
      background: var(--ltek-c-surface);
    }
    .panel[open] {
      border-color: var(--ltek-c-accent);
    }
    summary {
      list-style: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
    }
    summary::-webkit-details-marker {
      display: none;
    }
    .panel > summary {
      padding: var(--ltek-sp-4) var(--ltek-sp-5);
      font-size: var(--ltek-fs-panel-title);
      font-weight: var(--ltek-fw-bold);
      --mdc-icon-size: var(--ltek-icon-lg);
    }
    .panel > summary > ha-icon:first-child {
      color: var(--ltek-c-accent);
    }
    summary > span {
      flex: 1;
    }
    .chev {
      color: var(--ltek-c-accent);
      transition: transform 0.15s;
      --mdc-icon-size: var(--ltek-icon-lg);
    }
    details[open] > summary > .chev {
      transform: rotate(180deg);
    }
    .body {
      padding: 0 var(--ltek-sp-5) var(--ltek-sp-5);
      display: flex;
      flex-direction: column;
    }
    /* flat sub-panels: no fill, thin top divider; open → accent border, accent UPPERCASE title, inset content */
    .sub {
      border-top: 1px solid var(--ltek-c-border-soft);
      border-radius: 0;
    }
    .sub[open] {
      border: 1px solid var(--hmac-ed-theme-accent);
      border-radius: var(--ltek-r-ctrl);
      margin: var(--ltek-sp-1) 0;
    }
    .sub > summary {
      padding: var(--ltek-sp-3) var(--ltek-sp-2);
      color: var(--ltek-c-accent);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: var(--ltek-fs-label);
      font-weight: var(--ltek-fw-semibold);
    }
    .sub-body {
      padding: 0 var(--ltek-sp-4) var(--ltek-sp-4);
    }
    /* group subtitle: theme accent, mixed case, divider (none on the first) */
    .group {
      color: var(--hmac-ed-theme-accent);
      font-size: var(--ltek-fs-group);
      font-weight: var(--ltek-fw-semibold);
      padding-top: var(--ltek-sp-3);
      margin-top: var(--ltek-sp-3);
      border-top: 1px solid var(--ltek-c-border-soft);
    }
    .body > .group:first-of-type,
    .sub-body > .group:first-child,
    .hint + .group {
      border-top: none;
      margin-top: 0;
    }
    .hint {
      color: var(--ltek-c-muted);
      font-size: var(--ltek-fs-small);
      margin: var(--ltek-sp-1) 0 var(--ltek-sp-2);
    }
    .hint.inline {
      margin: 0;
    }
    /* canonical field row: label content width, control right beside it */
    .row {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-4);
      padding: var(--ltek-sp-1) 0;
      flex-wrap: wrap;
      justify-content: flex-start;
      font-size: var(--ltek-fs-label);
    }
    .lab {
      color: var(--ltek-c-label);
      font-weight: var(--ltek-fw-normal);
    }
    .ctl {
      flex: 1 1 auto;
      min-width: 0;
    }
    .row.check {
      cursor: pointer;
    }
    .row.check input {
      accent-color: var(--ltek-c-accent);
      margin: 0;
    }
    select,
    input[type='text'] {
      font: inherit;
      font-size: var(--ltek-fs-body);
      padding: var(--ltek-ctrl-pad);
      border: 1px solid var(--ltek-c-border);
      border-radius: var(--ltek-r-ctrl);
      background: var(--card-background-color, #1c1c1c);
      color: var(--ltek-c-text);
      max-width: 100%;
    }
    .ctl.color {
      display: flex;
      gap: var(--ltek-sp-3);
      flex-wrap: wrap;
      align-items: center;
    }
    input[type='color'] {
      width: 44px;
      height: 30px;
      padding: 0 2px;
      border: 1px solid var(--ltek-c-border);
      border-radius: var(--ltek-r-ctrl);
      background: none;
    }
    /* slider + readout never break across lines */
    .ctl.nowrap {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      flex-wrap: nowrap;
    }
    .ctl.nowrap input[type='range'] {
      flex: 1;
      min-width: 80px;
      accent-color: var(--ltek-c-accent);
    }
    .val {
      width: var(--ltek-slider-val-w);
      text-align: right;
      font-weight: var(--ltek-fw-bold);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .muted {
      color: var(--ltek-c-muted);
      font-weight: var(--ltek-fw-normal);
    }
    /* Sections panel: raised rows — accent icon, name, hint and chips, then action icons (§2 section rows) */
    .sec-list {
      display: flex;
      flex-direction: column;
      gap: var(--ltek-sp-2);
      padding: var(--ltek-sp-2) 0;
    }
    .sec-row {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      padding: 6px 8px;
      border-radius: var(--ltek-r-card);
      background: var(--ltek-c-surface-raised);
      border: 1px solid var(--ltek-c-border-soft);
      font-size: var(--ltek-fs-label);
    }
    .sec-row > .sec-ic {
      --mdc-icon-size: var(--ltek-icon-lg);
      color: var(--ltek-c-accent);
      margin: 0;
    }
    .sec-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px var(--ltek-sp-3);
    }
    .sec-name {
      font-weight: var(--ltek-fw-normal);
      color: var(--ltek-c-text);
    }
    .sec-chips {
      display: inline-flex;
      gap: var(--ltek-sp-2);
      flex-basis: 100%;
    }
    .sec-chips .chip {
      padding: 1px 8px 1px 5px;
      font-size: var(--ltek-fs-small);
    }
    .sec-row.hidden .sec-name,
    .sec-row.hidden > .sec-ic {
      color: var(--ltek-c-muted);
      opacity: 0.6;
    }
    .line-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ltek-sp-3);
      padding: var(--ltek-sp-1) var(--ltek-sp-2);
      border-top: 1px solid var(--ltek-c-border-soft);
      font-size: var(--ltek-fs-label);
    }
    .add-sel {
      border-style: dashed;
      border-color: var(--ltek-c-accent);
      color: var(--ltek-c-accent);
    }
    .sec-ic {
      --mdc-icon-size: var(--ltek-icon-sm);
      color: var(--ltek-c-accent);
      margin-right: 4px;
      vertical-align: -2px;
    }
    .spacer {
      width: var(--ltek-icon-sm);
    }
    .order {
      display: flex;
      gap: 4px;
      justify-self: end;
    }
    .order .icon-btn:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .sec-row input {
      accent-color: var(--ltek-c-accent);
      margin: 0;
    }
    .row.rep input[type='text'] {
      flex: 1 1 120px;
      min-width: 0;
    }
    .add {
      font: inherit;
      font-size: var(--ltek-fs-body);
      padding: var(--ltek-ctrl-pad);
      border: 1px dashed var(--ltek-c-accent);
      border-radius: var(--ltek-r-ctrl);
      background: none;
      color: var(--ltek-c-accent);
      cursor: pointer;
    }
    .icon-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--ltek-c-icon);
      --mdc-icon-size: var(--ltek-icon-sm);
    }
    .icon-btn:hover {
      color: var(--ltek-c-icon-hover);
    }
    .icon-btn.del:hover {
      color: var(--ltek-c-error);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ltek-sp-2);
      padding: var(--ltek-sp-2) 0;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: var(--ltek-sp-1);
      padding: 3px 10px 3px 6px;
      border-radius: 14px;
      border: 1px solid var(--ltek-c-border);
      background: none;
      color: var(--ltek-c-muted);
      font: inherit;
      font-size: var(--ltek-fs-body);
      cursor: pointer;
      --mdc-icon-size: var(--ltek-icon-sm);
    }
    .chip.on {
      border-color: var(--ltek-c-accent);
      background: var(--ltek-c-accent-fade);
      color: var(--ltek-c-text);
    }
    .chip:not(.on) ha-icon {
      opacity: 0.5;
    }
  `;
}
