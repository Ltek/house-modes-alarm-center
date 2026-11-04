// Visual editor for the House Modes & Alarm Center Card, following CARD_DESIGN_SYSTEM.md:
// --ltek-* chrome tokens (§1), collapsible top-level panels with an accent border when open, flat sub-panels with
// UPPERCASE accent titles, mixed-case group subtitles (§2), sliders for every size, the four-mode colour control
// (§3), three-state selects for boolean style overrides (§5) and byte-stable YAML: a key is written only when set.
import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from './alarm/lib/types';
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

@customElement('house-modes-alarm-center-card-editor')
export class HouseModesAlarmCenterCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private data?: CardData;

  setConfig(config: CardConfig) {
    this.config = config;
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

  /** §3: the four-mode colour control. */
  private color(label: string, value: string | undefined, defaultLabel: string, seedHex: string, onChange: (v: string | undefined) => void) {
    const mode = colorMode(value);
    const swatch = /^#[0-9a-fA-F]{6}$/.test(value || '') ? value! : seedHex;
    return html`<div class="row">
      <span class="lab">${label}</span>
      <div class="ctl color">
        <select aria-label=${`${label}: kind`} @change=${(e: any) => {
          const m = e.target.value;
          if (m === 'default') onChange(undefined);
          else if (m === 'theme') onChange(THEME_COLORS[0][0]);
          else if (m === 'custom') onChange(swatch);
          else onChange(value && mode !== 'default' ? value : seedHex);
        }}>
          <option value="default" ?selected=${mode === 'default'}>${defaultLabel}</option>
          <option value="theme" ?selected=${mode === 'theme'}>Theme colour</option>
          <option value="custom" ?selected=${mode === 'custom'}>Custom colour</option>
          <option value="css" ?selected=${mode === 'css'}>CSS value</option>
        </select>
        ${mode === 'theme'
          ? html`<select aria-label=${`${label}: theme colour`} @change=${(e: any) => onChange(e.target.value)}>
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
    return html`<details class="panel" ?open=${open} data-id=${id}>
      <summary><ha-icon icon=${icon}></ha-icon><span>${title}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${hint}</p>${body}</div>
    </details>`;
  }

  private sub(title: string, body: TemplateResult | TemplateResult[] | typeof nothing) {
    return html`<details class="sub">
      <summary><span>${title}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${body}</div>
    </details>`;
  }

  private group(title: string) {
    return html`<div class="group">${title}</div>`;
  }

  private textStyle(el: TextElement): TemplateResult {
    const d = TEXT_ELEMENTS[el];
    const t: TextStyle = this.styleOf(el);
    return this.sub(d.label, html`
      ${this.group('Size and weight')}
      ${this.slider('Size', t.size || 0, 6, 48, 1, ' px', d.size, v => this.setStyle(el, 'size', v || undefined))}
      ${this.select('Weight', t.weight ? String(t.weight) : '', [['', `Card default (${d.weight})`], ...WEIGHTS.map(w => [String(w), String(w)] as [string, string])],
        v => this.setStyle(el, 'weight', v ? Number(v) : undefined))}
      ${this.group('Font and case')}
      ${this.select('Font', t.font || '', [['', `Card default (${FONT_NAME[d.font]})`], ...FONTS], v => this.setStyle(el, 'font', v || undefined))}
      ${this.triState('Italic', t.italic, 'Card default (off)', v => this.setStyle(el, 'italic', v))}
      ${this.triState('Capitals', t.caps, `Card default (${d.caps ? 'on' : 'off'})`, v => this.setStyle(el, 'caps', v))}
      ${this.group('Colour')}
      ${this.color('Text colour', t.color, 'Card default', '#e1e1e1', v => this.setStyle(el, 'color', v))}
    `);
  }

  private iconStyle(el: IconElement, colorDefault: string, activeLabel?: string, activeDefault?: string): TemplateResult {
    const d = ICON_ELEMENTS[el];
    const i = this.styleOf(el);
    return this.sub(d.label, html`
      ${this.group('Size')}
      ${this.slider('Size', i.size || 0, 12, 96, 1, ' px', d.size, v => this.setStyle(el, 'size', v || undefined))}
      ${this.group('Colour')}
      ${this.color(activeLabel ? 'Colour (not selected)' : 'Colour', i.color, colorDefault, '#9e9e9e', v => this.setStyle(el, 'color', v))}
      ${activeLabel ? this.color(activeLabel, i.active_color, activeDefault || 'Card default', '#ffffff', v => this.setStyle(el, 'active_color', v)) : nothing}
    `);
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
        <p class="hint">The border shows the state: red alarm, orange arming or not ready, the House Mode's colour while
          armed, green ready.</p>
      `, true)}

      ${this.panel('sections', 'mdi:view-agenda-outline', 'Sections', 'Turn each part of the card on or off.', html`
        ${this.toggle('Header: House Mode and panel display', c.show_header, v => this.set('show_header', v))}
        ${this.toggle('House Mode buttons', c.show_house_modes, v => this.set('show_house_modes', v))}
        ${this.toggle('Alarm: arm / disarm, code, messages', c.show_alarm, v => this.set('show_alarm', v))}
        ${this.toggle('Physical panel keypad', c.show_panel_keypad, v => this.set('show_panel_keypad', v))}
        ${this.group('Collapsing')}
        ${this.toggle('Collapsible card (tap the header)', c.collapsible, v => this.set('collapsible', v))}
        ${c.collapsible ? this.toggle('Start collapsed', c.start_collapsed, v => this.set('start_collapsed', v)) : nothing}
        ${c.collapsible || c.alarm_collapsible ? this.toggle('Show the open / close arrow', c.show_chevron, v => this.set('show_chevron', v)) : nothing}
      `)}

      ${this.panel('header', 'mdi:page-layout-header', 'Header', 'The House Mode icon and name, and the physical panel\'s two display lines.', html`
        ${this.group('Status lines')}
        ${this.toggle('House Mode name', c.show_mode_name, v => this.set('show_mode_name', v))}
        ${this.toggle('Panel display, line 1', c.show_line1, v => this.set('show_line1', v))}
        ${this.toggle('Panel display, line 2', c.show_line2, v => this.set('show_line2', v))}
        ${this.group('Styles')}
        ${this.iconStyle('header_icon', "House Mode's colour")}
        ${c.show_mode_name ? this.textStyle('mode_name') : nothing}
        ${c.show_line1 ? this.textStyle('line1') : nothing}
        ${c.show_line2 ? this.textStyle('line2') : nothing}
      `)}

      ${this.panel('modes', 'mdi:home-switch-outline', 'House Mode buttons', 'One button per House Mode; icons and colours come from the House Modes tab.', c.show_house_modes
        ? html`
          ${this.group('Layout')}
          ${this.select('Alignment', c.modes_align, [['grid', 'Standard (fixed columns, wrap left)'], ['center', 'Centre on width']], v => this.set('modes_align', v))}
          ${this.slider('Buttons per row', c.columns, 2, 9, 1, '', 5, v => this.set('columns', v), false)}
          ${this.toggle('Button text', c.show_mode_labels, v => this.set('show_mode_labels', v))}
          ${modes.length
            ? html`${this.group('Buttons shown')}
                <div class="chips">${modes.map(m => {
                  const hidden = (c.hidden_modes || []).includes(m.id) || (c.hidden_modes || []).includes(m.name);
                  return html`<button class="chip ${hidden ? '' : 'on'}" aria-pressed=${hidden ? 'false' : 'true'}
                    @click=${() => this.set('hidden_modes', hidden ? (c.hidden_modes || []).filter(x => x !== m.id && x !== m.name) : [...(c.hidden_modes || []), m.id])}>
                    <ha-icon icon=${m.icon} style=${`color:${m.color}`}></ha-icon>${m.name}</button>`;
                })}</div>`
            : nothing}
          ${this.group('Styles')}
          ${this.iconStyle('mode_icon', 'Secondary text', 'Colour (selected)', "House Mode's colour")}
          ${c.show_mode_labels ? this.textStyle('mode_label') : nothing}`
        : html`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel('alarm', 'mdi:shield-lock-outline', 'Alarm', 'Arm and disarm Alarmo, enter the code, see why it will not arm.', c.show_alarm
        ? html`
          ${this.group('Collapsing')}
          ${this.toggle('Collapsible alarm section (a bar with the state)', c.alarm_collapsible, v => this.set('alarm_collapsible', v))}
          ${c.alarm_collapsible ? this.toggle('Start collapsed', c.alarm_start_collapsed, v => this.set('alarm_start_collapsed', v)) : nothing}
          ${this.group('Status lines')}
          ${this.toggle('Alarm name', c.show_alarm_name, v => this.set('show_alarm_name', v))}
          ${this.toggle('Alarm state', c.show_alarm_state, v => this.set('show_alarm_state', v))}
          ${this.group('Arm buttons')}
          ${this.toggle('Colours from the House Modes', c.alarm_colors_from_modes, v => this.set('alarm_colors_from_modes', v),
            'each arm mode in the colour of the House Mode that sets it')}
          ${this.toggle('Option chips: Skip exit delay, Bypass open sensors', c.show_arm_options, v => this.set('show_arm_options', v))}
          ${this.slider('Arm button scale', Math.round(alarm.button_scale_actions * 10) / 10, 1, 2.5, 0.1, '×', 1, v => this.setAlarm('button_scale_actions', v), false)}
          ${this.group('Code entry and messages')}
          ${ALARM_KEYS.map(k => this.toggle(ALARM_LABELS[k], !!alarm[k], v => this.setAlarm(k, v)))}
          ${this.slider('Code keypad scale', Math.round(alarm.button_scale_keypad * 10) / 10, 1, 2.5, 0.1, '×', 1, v => this.setAlarm('button_scale_keypad', v), false)}
          ${this.group('Styles')}
          ${c.alarm_collapsible ? this.textStyle('alarm_bar') : nothing}
          ${c.show_alarm_name ? this.textStyle('alarm_name') : nothing}
          ${c.show_alarm_state ? this.textStyle('alarm_state') : nothing}
          ${this.iconStyle('alarm_icon', 'Arm mode colour', 'Colour (selected)', 'White')}
          ${this.textStyle('alarm_button')}
          ${c.show_arm_options ? this.textStyle('chip') : nothing}`
        : html`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel('keypad', 'mdi:dialpad', 'Physical panel keypad', 'The panel\'s 12 keys with their functions, sent through Alarmo.', c.show_panel_keypad
        ? html`
          <p class="hint">Who may use the keys is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad on
            dashboards</em>. Other users see the keys disabled.</p>
          ${this.group('Styles')}
          ${this.textStyle('key_digit')}
          ${this.textStyle('key_label')}`
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
      border: 1px solid var(--ltek-c-accent);
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
