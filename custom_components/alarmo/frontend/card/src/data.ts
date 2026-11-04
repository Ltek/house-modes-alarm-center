// House Modes & Alarm Center Card: data from the integration + pure helpers (unit-tested with node --test).

export type CardMode = { id: string; name: string; icon: string; color: string };
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
  columns?: number;
  hidden_modes?: string[];
  keypad_labels?: Record<string, string>;
  alarm?: Record<string, any>;
};

export const DEFAULTS: Required<Pick<CardConfig,
  'show_header' | 'show_house_modes' | 'show_alarm' | 'show_panel_keypad' | 'collapsible' | 'start_collapsed' | 'columns'>> = {
  show_header: true,
  show_house_modes: true,
  show_alarm: true,
  show_panel_keypad: false,
  collapsible: false,
  start_collapsed: true,
  columns: 5,
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
 * Card border colour: alarm → red; arming / entry delay → orange; armed → the House Mode's colour (red without one);
 * disarmed → green when the panel is ready, orange when not, the divider colour when unknown.
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
