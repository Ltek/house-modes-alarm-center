// House Modes & Alarm Center Card: data from the integration + pure helpers (unit-tested with node --test).

export type CardMode = { id: string; name: string; icon: string; color: string; targets?: Record<string, string> };
export type LastResult = {
  result: string;
  requested?: string;
  reason?: string;
  minutes?: number;
  open?: string[];
  failed?: string[];
  would?: string;
  source?: string;
  at?: string;
};
export type CardLink = {
  key: string;
  alarm_entity: string | null;
  panel_entity: string;
  panel_type: string;
  keypad_entity: string | null;
  ready_entity: string | null;
  mode: 'shadow' | 'live';
};
export type CardData = {
  house: {
    enabled: boolean;
    shadow: boolean;
    select_entity: string;
    current: string | null;
    previous: string | null;
    changed_at: string | null;
    source: string | null;
    last_result: LastResult | null;
    /** name of the House Mode a change is under way to (being applied, delayed, or watched in Shadow) */
    changing_to?: string | null;
    modes: CardMode[];
  };
  alarms: { key: string; entity_id: string; name: string }[];
  links: CardLink[];
  keypad: { allowed: boolean; reason: string; blocked_keys: string };
};

/** A text style; every key optional (unset = the card's default). */
export type TextStyle = {
  size?: number; // px
  weight?: number; // 300–800
  color?: string; // #hex, var(--…) or any CSS color
  font?: 'monospace' | 'sans' | 'serif';
  italic?: boolean;
  caps?: boolean; // UPPERCASE
};
export type IconStyle = { size?: number; color?: string; active_color?: string };
/**
 * A set of buttons (House Mode buttons, arm buttons). Colors may also be the keywords 'mode' (the button's own House
 * Mode / arm mode color), 'transparent' and, for borders, 'none'.
 */
export type ButtonStyle = {
  background?: string;
  active_background?: string;
  border?: string;
  active_border?: string;
  /** arm buttons: the bar behind them */
  track?: string;
  text_follows_icon?: boolean;
};
export const BUTTON_SETS = {
  mode_button: { label: 'House Mode buttons' },
  arm_button: { label: 'Arm buttons' },
} as const;
export type ButtonSet = keyof typeof BUTTON_SETS;

/** A color option's keyword resolved for one button ('mode' = that button's own color). */
export const resolveColor = (v: string | undefined, own: string): string | undefined => {
  if (v === undefined || v === '') return undefined;
  if (v === 'mode') return own;
  if (v === 'none') return 'transparent';
  return String(v).replace(/[;{}<>]/g, '');
};

/** Inline variables for one button: --b-bg, --b-abg, --b-bd, --b-abd (background / border), --b-ic, --b-aic (icon). */
export const buttonVars = (b: ButtonStyle | undefined, icon: IconStyle | undefined, own: string): string => {
  const pairs: [string, string | undefined][] = [
    ['--b-bg', resolveColor(b?.background, own)],
    ['--b-abg', resolveColor(b?.active_background, own)],
    ['--b-bd', resolveColor(b?.border, own)],
    ['--b-abd', resolveColor(b?.active_border, own)],
    ['--b-ic', resolveColor(icon?.color, own)],
    ['--b-aic', resolveColor(icon?.active_color, own)],
  ];
  return pairs.filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(';');
};

/** Every styled element of the card, with its defaults (shown in the editor as "Card default (…)"). */
export const TEXT_ELEMENTS = {
  mode_name: { label: 'House Mode name', size: 22, weight: 400, font: 'monospace', caps: true },
  line1: { label: 'Panel display, line 1', size: 14, weight: 400, font: 'monospace', caps: false },
  line2: { label: 'Panel display, line 2', size: 14, weight: 400, font: 'monospace', caps: false },
  mode_label: { label: 'House Mode button text', size: 10, weight: 400, font: 'sans', caps: false },
  alarm_bar: { label: 'Section bars (collapsible sections)', size: 14, weight: 500, font: 'sans', caps: false },
  alarm_name: { label: 'Alarm name', size: 24, weight: 400, font: 'sans', caps: false },
  alarm_state: { label: 'Alarm state', size: 14, weight: 400, font: 'sans', caps: false },
  alarm_button: { label: 'Arm button text', size: 14, weight: 400, font: 'sans', caps: false },
  chip: { label: 'Option chips', size: 12, weight: 500, font: 'sans', caps: false },
  key_digit: { label: 'Keypad digit', size: 16, weight: 400, font: 'sans', caps: false },
  key_label: { label: 'Keypad function', size: 10, weight: 400, font: 'sans', caps: false },
} as const;
export type TextElement = keyof typeof TEXT_ELEMENTS;

export const ICON_ELEMENTS = {
  header_icon: { label: 'House Mode icon (header)', size: 48 },
  mode_icon: { label: 'House Mode button icons', size: 36 },
  alarm_icon: { label: 'Arm button icons', size: 22 },
} as const;
export type IconElement = keyof typeof ICON_ELEMENTS;

export type CardStyles = Partial<Record<TextElement, TextStyle>> &
  Partial<Record<IconElement, IconStyle>> &
  Partial<Record<ButtonSet, ButtonStyle>> &
  Partial<Record<SectionKey, { background?: string }>> & { card?: { border_width?: number; radius?: number; background?: string } };

/** Sections with their own background (unset = the card background shows through). */
export const SECTIONS = {
  header_section: 'Header',
  modes_section: 'House Mode buttons',
  alarm_section: 'Alarm',
  keypad_section: 'Physical panel keypad',
} as const;
export type SectionKey = keyof typeof SECTIONS;

export type CardConfig = {
  type: string;
  entity?: string;
  name?: string;
  show_header?: boolean;
  show_house_modes?: boolean;
  show_alarm?: boolean;
  show_panel_keypad?: boolean;
  collapsible?: boolean;
  start_collapsed?: boolean;
  /** chevron at the right of the header when collapsible (tapping the header works without it) */
  show_chevron?: boolean;
  columns?: number;
  hidden_modes?: string[];
  /** 'grid' = fixed columns, last row left-aligned (standard); 'center' = rows centered across the width */
  modes_align?: 'grid' | 'center';
  show_mode_labels?: boolean;
  show_mode_name?: boolean;
  show_line1?: boolean;
  show_line2?: boolean;
  modes_collapsible?: boolean;
  modes_start_collapsed?: boolean;
  alarm_collapsible?: boolean;
  alarm_start_collapsed?: boolean;
  keypad_collapsible?: boolean;
  keypad_start_collapsed?: boolean;
  show_header_icon?: boolean;
  show_mode_icons?: boolean;
  show_alarm_icon?: boolean;
  show_arm_icons?: boolean;
  show_arm_labels?: boolean;
  show_key_labels?: boolean;
  show_alarm_name?: boolean;
  show_alarm_state?: boolean;
  show_arm_options?: boolean;
  /**
   * Arm mode colors (arm buttons, the alarm bar, the 'mode' color keyword): 'modes' = the House Mode that sets each
   * arm mode; 'standard' = green disarmed, red away, orange home, …; 'theme' = Home Assistant's alarm state colors.
   */
  alarm_colors?: 'modes' | 'standard' | 'theme';
  /** @deprecated v2026.11.04.42–.44; false → alarm_colors: standard */
  alarm_colors_from_modes?: boolean;
  styles?: CardStyles;
  /** 'rounded' = rounded rectangles (standard); 'round' = a circle around each icon, the text below */
  modes_shape?: 'rounded' | 'round';
  arm_shape?: 'rounded' | 'round';
  /** space between the buttons, px */
  modes_gap?: number;
  arm_gap?: number;
  /** characters stripped from both ends of each panel display line, e.g. "*" */
  display_strip?: string;
  /** text replaced in the panel display lines, in order (after stripping) */
  display_replace?: { from: string; to?: string }[];
  effects?: EffectsConfig;
  keypad_labels?: Record<string, string>;
  alarm?: Record<string, any>;
};

export const DEFAULTS: Required<Pick<CardConfig,
  'show_header' | 'show_house_modes' | 'show_alarm' | 'show_panel_keypad' | 'collapsible' | 'start_collapsed' | 'show_chevron' | 'columns'
  | 'modes_align' | 'show_mode_labels' | 'show_mode_name' | 'show_line1' | 'show_line2' | 'alarm_collapsible' | 'alarm_start_collapsed'
  | 'show_alarm_name' | 'show_alarm_state' | 'show_arm_options' | 'alarm_colors' | 'modes_collapsible'
  | 'modes_start_collapsed' | 'keypad_collapsible' | 'keypad_start_collapsed' | 'show_header_icon' | 'show_mode_icons'
  | 'show_alarm_icon' | 'show_arm_icons' | 'show_arm_labels' | 'show_key_labels' | 'modes_shape' | 'arm_shape'>> = {
  show_header: true,
  show_house_modes: true,
  show_alarm: true,
  show_panel_keypad: false,
  collapsible: false,
  start_collapsed: true,
  show_chevron: false,
  columns: 5,
  modes_align: 'grid',
  show_mode_labels: true,
  show_mode_name: true,
  show_line1: true,
  show_line2: true,
  alarm_collapsible: false,
  alarm_start_collapsed: true,
  show_alarm_name: true,
  show_alarm_state: true,
  show_arm_options: true,
  alarm_colors: 'modes',
  modes_collapsible: false,
  modes_start_collapsed: true,
  keypad_collapsible: false,
  keypad_start_collapsed: true,
  show_header_icon: true,
  show_mode_icons: true,
  show_alarm_icon: true,
  show_arm_icons: true,
  show_arm_labels: true,
  show_key_labels: true,
  modes_shape: 'rounded',
  arm_shape: 'rounded',
};

/** Header icon for an alarm state, used when House Modes are off. */
export const ALARM_STATE_ICONS: Record<string, string> = {
  disarmed: 'mdi:lock-open-variant',
  armed_away: 'mdi:shield-lock',
  armed_home: 'mdi:shield-home',
  armed_night: 'mdi:shield-moon',
  armed_vacation: 'mdi:shield-airplane',
  armed_custom_bypass: 'mdi:lock-percent-open',
  arming: 'mdi:shield-sync-outline',
  pending: 'mdi:shield-alert-outline',
  triggered: 'mdi:bell-ring',
};

const FONTS: Record<string, string> = {
  monospace: 'var(--code-font-family, monospace)',
  sans: 'var(--ha-font-family-body, Roboto, "Noto Sans", sans-serif)',
  serif: 'Georgia, "Times New Roman", serif',
};

/** Object.fromEntries for the es2017 target. */
export const fromPairs = <T>(pairs: [string, T][]): Record<string, T> => {
  const o: Record<string, T> = {};
  for (const [k, v] of pairs) o[k] = v;
  return o;
};

const safe = (v: unknown) => String(v).replace(/[;{}<>]/g, '');

/**
 * Inline custom properties for the card root (shadow DOM: they reach every section, the alarm section too).
 * Only set styles produce a variable; the stylesheet's fallbacks are the defaults.
 */
export const styleVars = (styles: CardStyles | undefined): string => {
  const out: string[] = [];
  const set = (name: string, v: unknown) => v !== undefined && v !== null && v !== '' && out.push(`--hmac-${name}:${safe(v)}`);
  for (const key of Object.keys(TEXT_ELEMENTS) as TextElement[]) {
    const t = (styles || {})[key] as TextStyle | undefined;
    if (!t) continue;
    const n = key.replace(/_/g, '-');
    if (t.size) set(`${n}-size`, `${Number(t.size)}px`);
    if (t.weight) set(`${n}-weight`, Number(t.weight));
    set(`${n}-color`, t.color);
    if (t.font && FONTS[t.font]) set(`${n}-font`, FONTS[t.font]);
    if (t.italic !== undefined) set(`${n}-style`, t.italic ? 'italic' : 'normal');
    if (t.caps !== undefined) set(`${n}-transform`, t.caps ? 'uppercase' : 'none');
  }
  for (const key of Object.keys(ICON_ELEMENTS) as IconElement[]) {
    const i = (styles || {})[key] as IconStyle | undefined;
    if (!i) continue;
    const n = key.replace(/_/g, '-');
    if (i.size) set(`${n}-size`, `${Number(i.size)}px`);
  }
  const c = (styles || {}).card;
  if (c?.border_width !== undefined) set('border-width', `${Number(c.border_width)}px`);
  if (c?.radius !== undefined) set('radius', `${Number(c.radius)}px`);
  set('card-bg', c?.background);
  for (const k of Object.keys(SECTIONS) as SectionKey[]) set(`${k.replace('_section', '')}-bg`, (styles || {})[k]?.background);
  return out.join(';');
};

/** Remove empty style objects and undefined keys (byte-stable YAML). */
export const pruneStyles = (styles: CardStyles | undefined): CardStyles | undefined => {
  if (!styles) return undefined;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(styles)) {
    if (!v || typeof v !== 'object') continue;
    // a size of 0 means "card default" — except the frame, where 0 px is a real value
    const clean = fromPairs(
      Object.entries(v).filter(([, x]) => x !== undefined && x !== '' && x !== null && (k === 'card' || x !== 0))
    );
    if (Object.keys(clean).length) out[k] = clean;
  }
  return Object.keys(out).length ? (out as CardStyles) : undefined;
};

export const ARM_DEFAULT_COLORS: Record<string, string> = {
  disarmed: '#4caf50',
  armed_away: '#f44336',
  armed_home: '#ff9800',
  armed_night: '#5c6bc0',
  armed_vacation: '#dc143c',
  armed_custom_bypass: '#00bcd4',
};

/**
 * Color per arm mode from the House Modes: the mode that sets this partition (alarm key) to that arm mode, else any
 * mode that sets some partition to it, else a default.
 */
export const armColors = (data: CardData, alarmEntity?: string, source: 'modes' | 'standard' | 'theme' = 'modes'): Record<string, string> => {
  if (source === 'standard') return { ...ARM_DEFAULT_COLORS };
  if (source === 'theme') return {};
  const key = data.alarms.find(a => a.entity_id === alarmEntity)?.key;
  const out: Record<string, string> = {};
  for (const st of Object.keys(ARM_DEFAULT_COLORS)) {
    const direct = data.house.modes.find(m => key && m.targets?.[key] === st);
    const any = data.house.modes.find(m => Object.values(m.targets || {}).includes(st));
    out[st] = (direct || any)?.color || ARM_DEFAULT_COLORS[st];
  }
  return out;
};

/** Vista keypad keys, in keypad order, with the function printed under each key. */
export const VISTA_KEYS: [string, string][] = [
  ['1', 'OFF'], ['2', 'AWAY'], ['3', 'STAY'],
  ['4', 'MAX'], ['5', 'TEST'], ['6', 'BYPASS'],
  ['7', 'INSTANT'], ['8', 'CODE'], ['9', 'CHIME'],
  ['*', 'READY'], ['0', ''], ['#', ''],
];

export const keypadKeys = (labels?: Record<string, string>): [string, string][] =>
  VISTA_KEYS.map(([k, l]) => [k, labels && k in labels ? labels[k] : l]);

/** One panel display line: strip the given characters from both ends, then the replacements, in order. */
export const cleanLine = (line: string, strip?: string, replace?: { from: string; to?: string }[]): string => {
  let out = line.trim();
  if (strip) {
    const set = new Set([...strip, ' ']);
    let a = 0;
    let b = out.length;
    while (a < b && set.has(out[a])) a++;
    while (b > a && set.has(out[b - 1])) b--;
    out = out.slice(a, b);
  }
  for (const r of replace || []) if (r && r.from) out = out.split(r.from).join(r.to ?? '');
  return out.trim();
};

/** The panel's 2×16 keypad text as two lines (optionally stripped / replaced). */
export const lcdLines = (alpha: string | null | undefined, strip?: string, replace?: { from: string; to?: string }[]): [string, string] => {
  const a = String(alpha || '');
  return [cleanLine(a.slice(0, 16), strip, replace), cleanLine(a.slice(16, 32), strip, replace)];
};

// ------------------------------------------------------------ effects (glow / pulse while something is under way)

export type FxValue = 'none' | 'glow' | 'pulse' | 'both';
export const FX_TARGETS = ['border', 'status_icon', 'mode_button'] as const;
export type FxTarget = (typeof FX_TARGETS)[number];
export const FX_LABELS: Record<FxTarget, string> = {
  border: 'Card border',
  status_icon: 'Status icon (House Mode icon in the header)',
  mode_button: 'House Mode button (the mode being changed to)',
};
export const FX_TRIGGERS = ['arming', 'entry', 'changing', 'triggered'] as const;
export type FxTrigger = (typeof FX_TRIGGERS)[number];
export const FX_TRIGGER_LABELS: Record<FxTrigger, string> = {
  arming: 'Arming (exit delay: Alarmo or the physical panel)',
  entry: 'Entry delay (pending)',
  changing: 'House Mode changing (being applied, delayed or, in Shadow, watched)',
  triggered: 'Alarm triggered',
};
export type EffectsConfig = Partial<Record<FxTarget, FxValue>> & {
  when?: FxTrigger[];
  size?: number; // glow size px
  speed?: number; // pulse period s
  color?: string; // default: the border's state color
};
export const FX_DEFAULTS = { size: 16, speed: 1.6, when: [...FX_TRIGGERS] as FxTrigger[] };

/** Which triggers are true right now. */
export const fxTriggers = (alarm: string | undefined, panel: string | undefined, changingTo: string | null | undefined): FxTrigger[] => {
  const out: FxTrigger[] = [];
  if (alarm === 'arming' || panel === 'arming') out.push('arming');
  if (alarm === 'pending' || panel === 'pending') out.push('entry');
  if (changingTo) out.push('changing');
  if (alarm === 'triggered' || panel === 'triggered') out.push('triggered');
  return out;
};

/** Classes for <ha-card>: fx-on and fx-<target>-glow / -pulse while one of the chosen triggers is true. */
export const fxClasses = (fx: EffectsConfig | undefined, active: FxTrigger[]): string[] => {
  if (!fx) return [];
  const when = fx.when || FX_DEFAULTS.when;
  if (!active.some(t => when.includes(t))) return [];
  const out = ['fx-on'];
  for (const t of FX_TARGETS) {
    const m = fx[t];
    if (m === 'glow' || m === 'both') out.push(`fx-${t}-glow`);
    if (m === 'pulse' || m === 'both') out.push(`fx-${t}-pulse`);
  }
  return out.length > 1 ? out : [];
};

export const fxVars = (fx: EffectsConfig | undefined): string => {
  const out: string[] = [];
  if (fx?.size) out.push(`--fx-size:${Number(fx.size)}px`);
  if (fx?.speed) out.push(`--fx-speed:${Number(fx.speed)}s`);
  if (fx?.color) out.push(`--fx-color:${String(fx.color).replace(/[;{}<>]/g, '')}`);
  return out.join(';');
};

/** Editor-only "preview the effects" switch (never saved). Card instances listen and repaint. */
export const FX_PREVIEW = {
  on: false,
  listeners: new Set<() => void>(),
  set(v: boolean) {
    this.on = v;
    this.listeners.forEach(f => f());
  },
};
// for the screenshot tooling and debugging in the browser console
(globalThis as any).__hmacFxPreview = FX_PREVIEW;

/** The link that belongs to the card's Alarmo entity (or the first one). */
export const linkFor = (data: CardData, entity?: string): CardLink | undefined =>
  data.links.find(l => l.alarm_entity === entity) || data.links[0];

/** Old configs: alarm_colors_from_modes false → standard colors (that is what people expected it to mean). */
export const migrateConfig = (config: CardConfig): CardConfig => {
  if (config.alarm_colors_from_modes === undefined) return config;
  const { alarm_colors_from_modes, ...rest } = config;
  return { ...rest, ...(config.alarm_colors ? {} : alarm_colors_from_modes === false ? { alarm_colors: 'standard' } : {}) } as CardConfig;
};

/** One-click looks for a set of buttons (the editor's "Style" choice). */
export const BUTTON_PRESETS: Record<string, { label: string; button: ButtonStyle; icon: IconStyle }> = {
  filled: { label: 'Filled (selected button in its color)', button: {}, icon: {} },
  outline_selected: {
    label: 'Outline when selected',
    button: { background: 'transparent', active_background: 'transparent', border: 'none', active_border: 'mode', text_follows_icon: true },
    icon: { color: 'var(--secondary-text-color)', active_color: 'mode' },
  },
  outline: {
    label: 'Outline, all in color',
    button: { background: 'transparent', active_background: 'transparent', border: 'mode', active_border: 'mode', text_follows_icon: true },
    icon: { color: 'mode', active_color: 'mode' },
  },
  icon_only: {
    label: 'Colored icon when selected',
    button: { background: 'transparent', active_background: 'transparent', border: 'none', active_border: 'none', text_follows_icon: true },
    icon: { color: 'var(--secondary-text-color)', active_color: 'mode' },
  },
};

/** Which preset the current styles match ('' = custom). */
export const presetOf = (b: ButtonStyle | undefined, i: IconStyle | undefined): string => {
  const colors = (x: Record<string, any> | undefined) => JSON.stringify(Object.keys(x || {}).filter(k => k !== 'size').sort().map(k => [k, (x as any)[k]]));
  return Object.keys(BUTTON_PRESETS).find(k => colors(BUTTON_PRESETS[k].button) === colors(b) && colors(BUTTON_PRESETS[k].icon) === colors(i)) || '';
};

export const visibleModes = (data: CardData, hidden?: string[]): CardMode[] =>
  data.house.modes.filter(m => !(hidden || []).includes(m.id) && !(hidden || []).includes(m.name));

const ARMED = ['armed_away', 'armed_home', 'armed_night', 'armed_vacation', 'armed_custom_bypass'];

/**
 * Card border color: alarm → red; arming / entry delay → orange; armed → the House Mode's color (red without one);
 * disarmed → green when the panel is ready, orange when not, the divider color when unknown.
 */
export const borderColor = (alarm: string | undefined, panel: string | undefined, ready: string | undefined, modeColor?: string): string => {
  if (alarm === 'triggered' || panel === 'triggered') return '#f44336';
  if (alarm === 'arming' || alarm === 'pending' || panel === 'arming' || panel === 'pending') return '#ff9800';
  if ((alarm && ARMED.includes(alarm)) || (panel && ARMED.includes(panel))) return modeColor || '#f44336';
  if (ready === 'on') return '#4caf50';
  if (ready === 'off') return '#ff9800';
  return 'var(--divider-color)';
};

/** What to tell the user after pressing a House Mode button (null = nothing to say). */
export const resultMessage = (r: LastResult | null | undefined, name: (eid: string) => string): string | null => {
  if (!r) return null;
  const what = r.requested || 'House Mode';
  switch (r.result) {
    case 'blocked':
      return `${what} not set: ${r.reason || 'not allowed now'}`;
    case 'not_ready':
      return `${what} not set: open ${(r.open || []).map(name).join(', ') || 'zones'}`;
    case 'delayed':
      return `${what} in ${r.minutes} min`;
    case 'failed':
      return `${what} failed: ${(r.failed || []).join(', ')} did not arm`;
    case 'error':
      return `${what}: ${r.reason || 'error'}`;
    case 'shadow':
      return r.would && r.would !== 'changed'
        ? `Shadow: ${what} would be ${r.would.replace('_', ' ')}`
        : `Shadow: House Modes would set ${what}; nothing was changed`;
    default:
      return null;
  }
};
