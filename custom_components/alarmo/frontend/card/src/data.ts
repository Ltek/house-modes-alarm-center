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
  Partial<Record<ButtonSet, ButtonStyle>> & { card?: { border_width?: number; radius?: number } };

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
  /** arm buttons take their color from the House Mode that sets that arm mode */
  alarm_colors_from_modes?: boolean;
  styles?: CardStyles;
  keypad_labels?: Record<string, string>;
  alarm?: Record<string, any>;
};

export const DEFAULTS: Required<Pick<CardConfig,
  'show_header' | 'show_house_modes' | 'show_alarm' | 'show_panel_keypad' | 'collapsible' | 'start_collapsed' | 'show_chevron' | 'columns'
  | 'modes_align' | 'show_mode_labels' | 'show_mode_name' | 'show_line1' | 'show_line2' | 'alarm_collapsible' | 'alarm_start_collapsed'
  | 'show_alarm_name' | 'show_alarm_state' | 'show_arm_options' | 'alarm_colors_from_modes' | 'modes_collapsible'
  | 'modes_start_collapsed' | 'keypad_collapsible' | 'keypad_start_collapsed' | 'show_header_icon' | 'show_mode_icons'
  | 'show_alarm_icon' | 'show_arm_icons' | 'show_arm_labels' | 'show_key_labels'>> = {
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
  alarm_colors_from_modes: true,
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

const ARM_DEFAULT_COLORS: Record<string, string> = {
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
export const armColors = (data: CardData, alarmEntity?: string): Record<string, string> => {
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

/** The panel's 2×16 keypad text as two lines. */
export const lcdLines = (alpha: string | null | undefined): [string, string] => {
  const a = String(alpha || '');
  return [a.slice(0, 16).trim(), a.slice(16, 32).trim()];
};

/** The link that belongs to the card's Alarmo entity (or the first one). */
export const linkFor = (data: CardData, entity?: string): CardLink | undefined =>
  data.links.find(l => l.alarm_entity === entity) || data.links[0];

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
      return r.would && r.would !== 'changed' ? `Shadow: ${what} would be ${r.would.replace('_', ' ')}` : null;
    default:
      return null;
  }
};
