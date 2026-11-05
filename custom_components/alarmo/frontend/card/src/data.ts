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
    /** Shadow: the user's own House Mode helper, whose state the card shows as the current mode */
    display_entity?: string | null;
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
  key_button: { label: 'Panel keypad keys' },
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
  changing: { label: 'Changing to …', size: 13, weight: 500, font: 'sans', caps: false },
  since: { label: 'Since (last change)', size: 12, weight: 400, font: 'sans', caps: false },
  line1: { label: 'Panel display, line 1', size: 14, weight: 400, font: 'monospace', caps: false },
  line2: { label: 'Panel display, line 2', size: 14, weight: 400, font: 'monospace', caps: false },
  mode_label: { label: 'House Mode button text', size: 10, weight: 400, font: 'sans', caps: false },
  alarm_bar: { label: 'Section bars (collapsible sections)', size: 14, weight: 500, font: 'sans', caps: false },
  alarm_name: { label: 'Alarm name', size: 18, weight: 400, font: 'sans', caps: false },
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
  header_section: 'House Mode Status',
  modes_section: 'House Mode buttons',
  alarm_status_section: 'Alarm Panel Status',
  alarm_section: 'Alarm Panel buttons',
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
  /** the order of the sections (missing ones are added at the end) */
  section_order?: SectionId[];
  show_alarm_status?: boolean;
  house_status_collapsible?: boolean;
  house_status_start_collapsed?: boolean;
  alarm_status_collapsible?: boolean;
  alarm_status_start_collapsed?: boolean;
  /** the physical panel's display lines in the Alarm Panel Status section */
  show_alarm_line1?: boolean;
  show_alarm_line2?: boolean;
  /** card-only House Mode colors (id → color), over the House Modes tab's */
  mode_colors?: Record<string, string>;
  /** arm mode colors (state → color); 'house:<mode id>' = that House Mode's color */
  arm_colors?: Record<string, string>;
  keypad_shape?: 'rounded' | 'round';
  /** 'fill' = the buttons share the width (standard); 'fit' = as wide as their content, centered */
  modes_width?: 'fill' | 'fit';
  arm_width?: 'fill' | 'fit';
  /** 'mode' = the House Mode's color, always (as the original sensor.alarm_border_color); 'state' = alarm red,
   * arming / not ready orange, armed the mode's color, ready green */
  border_color?: 'mode' | 'state';
  /** during an exit or entry delay the header shows the countdown circle instead of the House Mode icon */
  header_countdown?: boolean;
  /** a key's border / background flashes in these colors for 500 ms when pressed */
  key_flash?: { border?: string; background?: string };
  /** inner padding of the buttons, px */
  modes_padding?: number;
  arm_padding?: number;
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
  | 'show_alarm_icon' | 'show_arm_icons' | 'show_arm_labels' | 'show_key_labels' | 'modes_shape' | 'arm_shape' | 'keypad_shape'
  | 'modes_width' | 'arm_width' | 'header_countdown' | 'border_color' | 'show_alarm_status' | 'house_status_collapsible'
  | 'house_status_start_collapsed' | 'alarm_status_collapsible' | 'alarm_status_start_collapsed' | 'show_alarm_line1' | 'show_alarm_line2'>> = {
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
  keypad_shape: 'rounded',
  modes_width: 'fill',
  arm_width: 'fill',
  header_countdown: false,
  border_color: 'mode',
  show_alarm_status: true,
  house_status_collapsible: false,
  house_status_start_collapsed: true,
  alarm_status_collapsible: false,
  alarm_status_start_collapsed: true,
  show_alarm_line1: false,
  show_alarm_line2: false,
};

// ------------------------------------------------------------ Status sections (any number, each built from parts)

export const STATUS_LINES = ['house_mode', 'alarm_name', 'alarm_state', 'panel_line1', 'panel_line2', 'changing', 'since'] as const;
export type StatusLine = (typeof STATUS_LINES)[number];
export const STATUS_LINE_INFO: Record<StatusLine, { label: string; style: TextElement }> = {
  house_mode: { label: 'House Mode name', style: 'mode_name' },
  alarm_name: { label: 'Alarm name', style: 'alarm_name' },
  alarm_state: { label: 'Alarm state', style: 'alarm_state' },
  panel_line1: { label: 'Panel display, line 1', style: 'line1' },
  panel_line2: { label: 'Panel display, line 2', style: 'line2' },
  changing: { label: 'Changing to … (while a House Mode change is under way)', style: 'changing' },
  since: { label: 'Since (when the House Mode last changed)', style: 'since' },
};
export type StatusSection = {
  id: string;
  name?: string;
  show?: boolean; // default true
  /** the icon: the House Mode's (the alarm's when House Modes are off), the alarm state's, or none */
  icon?: 'house' | 'alarm' | 'none';
  /** the countdown circle in place of the icon during an exit or entry delay */
  countdown?: boolean;
  lines?: StatusLine[];
  collapsible?: boolean;
  start_collapsed?: boolean; // default true
  background?: string;
  /** this section's text and icon styles, over the card-wide ones */
  styles?: Partial<Record<TextElement, TextStyle>> & { header_icon?: IconStyle };
};

/** The ids in section_order: the fixed sections and one 'status:<id>' per Status section. */
export const FIXED_SECTIONS = ['house_modes', 'alarm', 'keypad'] as const;
export type FixedSection = (typeof FIXED_SECTIONS)[number];

/**
 * The card's Status sections and section order. Configs from before Status sections (v2026.11.05.50 and older) are
 * read as two: "House Mode Status" (the old header) and "Alarm Panel Status", with the same parts.
 */
export const statusLayout = (c: any): { sections: StatusSection[]; order: string[] } => {
  if (Array.isArray(c.status_sections)) {
    const sections = c.status_sections.filter((x: any) => x && x.id) as StatusSection[];
    const ids = sections.map(x => `status:${x.id}`);
    const all = [...ids, ...FIXED_SECTIONS];
    const known = (c.section_order || []).filter((x: string) => all.includes(x));
    const uniq = known.filter((x: string, i: number) => known.indexOf(x) === i);
    return { sections, order: [...uniq, ...all.filter(x => !uniq.includes(x))] };
  }
  const d = { ...DEFAULTS, ...c };
  const house: StatusSection = {
    id: 'house',
    name: 'House Mode Status',
    show: d.show_header !== false,
    icon: d.show_header_icon === false ? 'none' : 'house',
    countdown: !!d.header_countdown,
    lines: [
      ...(d.show_mode_name !== false ? ['house_mode' as StatusLine] : []),
      ...(d.show_line1 !== false ? ['panel_line1' as StatusLine] : []),
      ...(d.show_line2 !== false ? ['panel_line2' as StatusLine] : []),
    ],
    collapsible: !!d.house_status_collapsible,
    start_collapsed: d.house_status_start_collapsed !== false,
    background: d.styles?.header_section?.background,
  };
  const alarm: StatusSection = {
    id: 'alarm',
    name: 'Alarm Panel Status',
    show: d.show_alarm_status !== false && !(c.show_alarm === false && c.show_alarm_status === undefined),
    icon: d.show_alarm_icon === false ? 'none' : 'alarm',
    countdown: d.show_alarm_icon !== false,
    lines: [
      ...(d.show_alarm_name !== false ? ['alarm_name' as StatusLine] : []),
      ...(d.show_alarm_state !== false ? ['alarm_state' as StatusLine] : []),
      ...(d.show_alarm_line1 ? ['panel_line1' as StatusLine] : []),
      ...(d.show_alarm_line2 ? ['panel_line2' as StatusLine] : []),
    ],
    collapsible: !!d.alarm_status_collapsible,
    start_collapsed: d.alarm_status_start_collapsed !== false,
    background: d.styles?.alarm_status_section?.background,
  };
  for (const x of [house, alarm]) if (!x.background) delete x.background;
  const map: Record<string, string> = { house_status: 'status:house', alarm_status: 'status:alarm', house_modes: 'house_modes', alarm: 'alarm', keypad: 'keypad' };
  const old = sectionOrder(c.section_order).map(x => map[x]);
  return { sections: [house, alarm], order: old };
};

/** Old status keys, dropped once the editor writes status_sections. */
export const OLD_STATUS_KEYS = [
  'show_header', 'show_header_icon', 'header_countdown', 'show_mode_name', 'show_line1', 'show_line2',
  'house_status_collapsible', 'house_status_start_collapsed', 'show_alarm_status', 'show_alarm_icon', 'show_alarm_name',
  'show_alarm_state', 'show_alarm_line1', 'show_alarm_line2', 'alarm_status_collapsible', 'alarm_status_start_collapsed',
];

/** A new Status section id: s1, s2, … (not taken). */
export const newStatusId = (sections: StatusSection[]): string => {
  let n = 1;
  while (sections.some(x => x.id === `s${n}`)) n++;
  return `s${n}`;
};

/** The card's sections, in their default order. */
export const SECTION_IDS = ['house_status', 'house_modes', 'alarm_status', 'alarm', 'keypad'] as const;
export type SectionId = (typeof SECTION_IDS)[number];
/** Per section: its title, and the config keys that show it and make it collapsible. */
export const SECTION_INFO: Record<SectionId, { title: string; hint: string; show: string; collapse: string; start: string }> = {
  house_status: { title: 'House Mode Status', hint: 'icon, name, panel display', show: 'show_header', collapse: 'house_status_collapsible', start: 'house_status_start_collapsed' },
  house_modes: { title: 'House Mode buttons', hint: '', show: 'show_house_modes', collapse: 'modes_collapsible', start: 'modes_start_collapsed' },
  alarm_status: { title: 'Alarm Panel Status', hint: 'state, countdown', show: 'show_alarm_status', collapse: 'alarm_status_collapsible', start: 'alarm_status_start_collapsed' },
  alarm: { title: 'Alarm Panel buttons', hint: 'arm / disarm, code, messages', show: 'show_alarm', collapse: 'alarm_collapsible', start: 'alarm_start_collapsed' },
  keypad: { title: 'Physical panel keypad', hint: '', show: 'show_panel_keypad', collapse: 'keypad_collapsible', start: 'keypad_start_collapsed' },
};

/** The section order: the configured one, unknown ids dropped, missing ones appended in the default order. */
export const sectionOrder = (order?: string[]): SectionId[] => {
  const known = (order || []).filter((x): x is SectionId => (SECTION_IDS as readonly string[]).includes(x));
  const uniq = known.filter((x, i) => known.indexOf(x) === i);
  return [...uniq, ...SECTION_IDS.filter(x => !uniq.includes(x))];
};

/** The card's view of the House Modes: the card-only color overrides applied. */
export const withModeColors = (data: CardData, overrides?: Record<string, string>): CardData => {
  if (!overrides || !Object.keys(overrides).length) return data;
  return {
    ...data,
    house: { ...data.house, modes: data.house.modes.map(m => (overrides[m.id] ? { ...m, color: overrides[m.id] } : m)) },
  };
};

/** Arm mode colors: the chosen source, then per-arm-mode overrides ('house:<id>' = that House Mode's color). */
export const armColorsFor = (data: CardData, alarmEntity: string | undefined, source: 'modes' | 'standard' | 'theme' | undefined,
  overrides?: Record<string, string>): Record<string, string> => {
  const out = { ...armColors(data, alarmEntity, source) };
  for (const [st, v] of Object.entries(overrides || {})) {
    if (!v) continue;
    if (v.startsWith('house:')) {
      const m = data.house.modes.find(x => x.id === v.slice(6));
      if (m) out[st] = m.color;
    } else out[st] = String(v).replace(/[;{}<>]/g, '');
  }
  return out;
};

export const ARM_STATE_LABELS: Record<string, string> = {
  disarmed: 'Disarmed',
  armed_away: 'Armed away',
  armed_home: 'Armed home',
  armed_night: 'Armed night',
  armed_vacation: 'Armed vacation',
  armed_custom_bypass: 'Armed custom bypass',
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
  // the House Mode defaults for the matching modes (Disarmed, Away, Stay, Sleep, Vacation, Spa)
  disarmed: '#008000',
  armed_away: '#ff0000',
  armed_home: '#ffa500',
  armed_night: '#5d5df4',
  armed_vacation: '#dc143c',
  armed_custom_bypass: '#00a8a8',
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
/** Parts of something that can glow / pulse. */
export const FX_PARTS = ['background', 'border', 'icon'] as const;
export type FxPart = (typeof FX_PARTS)[number];
export type FxParts = Partial<Record<FxPart, FxValue>>;
/** What can have effects, and which parts each has. */
export const FX_TARGETS = {
  card: { label: 'Card', parts: ['background', 'border'] as FxPart[] },
  status_icon: { label: 'Status icons', parts: ['icon'] as FxPart[] },
  mode_button: { label: 'House Mode buttons (the mode being changed to)', parts: ['background', 'border', 'icon'] as FxPart[] },
  arm_button: { label: 'Arm buttons (the arm mode being set)', parts: ['background', 'border', 'icon'] as FxPart[] },
} as const;
export type FxTarget = keyof typeof FX_TARGETS;
export const FX_TRIGGERS = ['arming', 'entry', 'changing', 'triggered'] as const;
export type FxTrigger = (typeof FX_TRIGGERS)[number];
export const FX_TRIGGER_LABELS: Record<FxTrigger, string> = {
  arming: 'Arming (exit delay: Alarmo or the physical panel)',
  entry: 'Entry delay (pending)',
  changing: 'House Mode changing (being applied, delayed or, in Shadow, watched)',
  triggered: 'Alarm triggered',
};
export type EffectsConfig = Partial<Record<FxTarget, FxParts>> & {
  when?: FxTrigger[];
  size?: number; // glow size px
  speed?: number; // pulse period s
  color?: string; // default: the border's state color
};
/** By default only while something is changing: an exit delay (Alarmo or the panel arming) or a House Mode change. */
export const FX_DEFAULTS = { size: 16, speed: 1.6, when: ['arming', 'changing'] as FxTrigger[] };

/** Which triggers are true right now. */
export const fxTriggers = (alarm: string | undefined, panel: string | undefined, changingTo: string | null | undefined): FxTrigger[] => {
  const out: FxTrigger[] = [];
  if (alarm === 'arming' || panel === 'arming') out.push('arming');
  if (alarm === 'pending' || panel === 'pending') out.push('entry');
  if (changingTo) out.push('changing');
  if (alarm === 'triggered' || panel === 'triggered') out.push('triggered');
  return out;
};

/** v2026.11.05.46–.47 stored one value per target: border / status_icon / mode_button. */
export const migrateEffects = (fx: any): EffectsConfig | undefined => {
  if (!fx || typeof fx !== 'object') return fx;
  const out: any = { ...fx };
  if (typeof fx.border === 'string') {
    out.card = { ...(fx.card || {}), border: fx.border };
    delete out.border;
  }
  if (typeof fx.status_icon === 'string') out.status_icon = { icon: fx.status_icon };
  if (typeof fx.mode_button === 'string') {
    const v = fx.mode_button;
    out.mode_button = {
      ...(v === 'glow' || v === 'both' ? { border: 'glow' } : {}),
      ...(v === 'pulse' || v === 'both' ? { icon: 'pulse' } : {}),
    };
  }
  return out;
};

/** Is any effect configured at all, and is one of the chosen triggers true now? */
export const fxRunning = (fx: EffectsConfig | undefined, active: FxTrigger[]): boolean => {
  if (!fx) return false;
  const when = fx.when || FX_DEFAULTS.when;
  return active.some(t => when.includes(t));
};

/** Classes for one target: fx-<part>-glow / fx-<part>-pulse ('' when it is not running). */
export const fxPartClasses = (parts: FxParts | undefined, running: boolean, prefix = 'fx'): string[] => {
  if (!running || !parts) return [];
  const out: string[] = [];
  for (const p of FX_PARTS) {
    const m = parts[p];
    if (m === 'glow' || m === 'both') out.push(`${prefix}-${p}-glow`);
    if (m === 'pulse' || m === 'both') out.push(`${prefix}-${p}-pulse`);
  }
  return out;
};

/** Classes for <ha-card>: the card's own parts (fx-card-…) and the status icon (fx-status-…). */
export const fxClasses = (fx: EffectsConfig | undefined, active: FxTrigger[]): string[] => {
  const run = fxRunning(fx, active);
  const out = [...fxPartClasses(fx?.card, run, 'fx-card'), ...fxPartClasses(fx?.status_icon, run, 'fx-status')];
  return out.length ? ['fx-on', ...out] : [];
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
  timer: 0 as any,
  /** on for 20 s at most, so a preview can never keep running */
  set(v: boolean) {
    this.on = v;
    clearTimeout(this.timer);
    if (v) this.timer = setTimeout(() => this.set(false), 20000);
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
  if (config.effects) config = { ...config, effects: migrateEffects(config.effects) };
  // v2026.11.05.46–.49 had a separate "strip" field: each character becomes a replacement that removes it
  if (config.display_strip) {
    const { display_strip, ...rest } = config;
    const extra = [...new Set([...display_strip])].filter(ch => ch.trim()).map(ch => ({ from: ch }));
    config = { ...rest, display_replace: [...extra, ...(config.display_replace || [])] } as CardConfig;
  }
  // before v2026.11.05.50 the alarm's status (name, state) was part of the alarm section
  if (config.show_alarm === false && config.show_alarm_status === undefined) config = { ...config, show_alarm_status: false };
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
  if (alarm === 'triggered' || panel === 'triggered') return '#ff0000';
  if (alarm === 'arming' || alarm === 'pending' || panel === 'arming' || panel === 'pending') return '#ffa500';
  if ((alarm && ARMED.includes(alarm)) || (panel && ARMED.includes(panel))) return modeColor || '#ff0000';
  if (ready === 'on') return '#008000';
  if (ready === 'off') return '#ffa500';
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
