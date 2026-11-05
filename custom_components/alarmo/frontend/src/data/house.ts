// House Modes: websocket calls + pure helpers (unit-tested with node --test).
import type { HomeAssistant } from '../types';

export const SOURCES = ['manual', 'automation', 'schedule', 'presence_away', 'presence_home', 'lock', 'panel_keypad', 'timer'];
export const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual (dashboard / you)',
  automation: 'Automations (other)',
  schedule: 'Schedule',
  presence_away: 'Presence: everyone left',
  presence_home: 'Presence: someone home',
  lock: 'Lock keypad',
  panel_keypad: 'Alarm panel keypad',
  timer: 'House Mode timers',
};
export const TARGET_STATES = ['armed_away', 'armed_home', 'armed_night', 'armed_vacation', 'armed_custom_bypass', 'disarmed'];

export type HouseTimer = {
  /** after N minutes, or `at` a clock time (HH:MM) — exactly one */
  after_minutes?: number | null;
  at?: string | null;
  then: string;
  from_modes: string[];
  window_start?: string | null;
  window_end?: string | null;
  notify: boolean;
};
export type HouseMode = {
  id: string;
  name: string;
  icon: string;
  /** '' = from the name */
  color?: string;
  targets: Record<string, string>;
  enter_sources: string[];
  leave_sources: string[];
  delay_sources: Record<string, number>;
  readiness: { entities: string[]; labels: string[]; action: 'block' | 'warn' };
  on_failure: 'undo' | 'keep' | 'previous';
  timers: HouseTimer[];
  steps?: HouseStep[];
};
/** A native scene or script the House Mode runs when entering / leaving it, before arming or after the change. */
export type HouseStep = {
  entity_id: string;
  when: 'enter' | 'leave';
  phase: 'before' | 'after';
  modes: string[];
  wait: boolean;
};
export type HouseSettings = {
  enabled: boolean;
  run_mode?: 'shadow' | 'live';
  current_entity?: string | null;
  previous_entity?: string | null;
  modes: HouseMode[];
  input_select?: string | null;
  lock_keypads: LockKeypad[];
  notify_services: string[];
  notify_changes?: boolean;
  notify_skip_sources?: string[];
  current: string | null;
  previous: string | null;
  source: string | null;
  changed_at: string | null;
  history: { at: string; from: string | null; to: string | null; source: string; result: string }[];
  pending: { id: string; kind: string; due: number; target: string; context: string | null }[];
};
export type LockKeypad = { node_id: number; name: string; entity_id?: string | null; enabled: boolean; slots: Record<string, string> };
export type DetectedLock = {
  entity_id: string;
  name: string;
  node_id: number | null;
  slots: { slot: number; status: string }[] | null;
  configured: boolean;
};
export type ShadowEntry = { t: number; kind: string; msg: string; ok: boolean | null };
export type ShadowSummary = { matched: number; differed: number; since: number | null; watching: boolean };
export type HouseInfo = {
  settings: HouseSettings;
  targets: { key: string; entity_id: string; name: string }[];
  shadow?: ShadowSummary;
};
export type DetectSuggestion = {
  name: string;
  icon: string;
  targets: Record<string, string>;
  basis: 'activity' | 'name' | 'none';
  seen: number;
  share: Record<string, number>;
  note: string;
};
export type DetectEntities = { selector: string | null; current: string | null; previous: string | null };
export type DetectResult = {
  entities: DetectEntities;
  selects: { entity_id: string; name: string | null }[];
  suggestions: DetectSuggestion[];
  changes: number;
  span: number[];
  targets: { key: string; entity_id: string; name: string }[];
};
export const detectHouse = (hass: HomeAssistant, entities?: Partial<DetectEntities>) =>
  hass.callWS<DetectResult>({ type: 'alarmo/ext/house/detect', ...(entities || {}) });

/** Put the chosen suggestions and the three entities into the settings draft (nothing is saved). */
export const applyDetected = (d: HouseSettings, picked: DetectSuggestion[], ents: DetectEntities): string[] => {
  const changes: string[] = [];
  if (ents.selector && d.input_select !== ents.selector) {
    d.input_select = ents.selector;
    changes.push(`input_select: ${ents.selector}`);
  }
  if (ents.current && d.current_entity !== ents.current) d.current_entity = ents.current;
  if (ents.previous && d.previous_entity !== ents.previous) d.previous_entity = ents.previous;
  for (const sug of picked) {
    const have = d.modes.find(m => m.name.toLowerCase() === sug.name.toLowerCase());
    if (have) {
      if (sug.basis !== 'none' && JSON.stringify(have.targets) !== JSON.stringify(sug.targets)) {
        have.targets = { ...sug.targets };
        changes.push(`${have.name}: partitions updated`);
      }
      if (have.icon === 'mdi:home' && sug.icon !== 'mdi:home') have.icon = sug.icon;
    } else {
      const m = newMode(sug.name, d.modes);
      m.icon = sug.icon;
      m.targets = { ...sug.targets };
      d.modes.push(m);
      changes.push(`${m.name}: added`);
    }
  }
  if (!d.enabled) {
    d.enabled = true;
    d.run_mode = 'shadow';
    changes.push('House Modes: Shadow');
  }
  return changes;
};

export const fetchShadow = (hass: HomeAssistant) =>
  hass.callWS<{ log: ShadowEntry[]; summary: ShadowSummary }>({ type: 'alarmo/ext/house/shadow' });
/** 'off' | 'shadow' | 'live' from the two settings. */
export const runState = (s: HouseSettings) => (!s.enabled ? 'off' : s.run_mode === 'shadow' ? 'shadow' : 'live');
export const setRunState = (s: HouseSettings, v: 'off' | 'shadow' | 'live') => {
  s.enabled = v !== 'off';
  if (v !== 'off') s.run_mode = v;
};

export const fetchHouse = (hass: HomeAssistant) => hass.callWS<HouseInfo>({ type: 'alarmo/ext/house/get' });
export const saveHouse = (hass: HomeAssistant, settings: HouseSettings) =>
  hass.callWS<HouseSettings>({ type: 'alarmo/ext/house/save', settings });
export const fetchLocks = (hass: HomeAssistant) => hass.callWS<{ locks: DetectedLock[] }>({ type: 'alarmo/ext/house/locks' });

/** Keypad entry for a detected lock (kept if already configured). */
export const keypadFor = (s: HouseSettings, lock: DetectedLock): LockKeypad | undefined =>
  s.lock_keypads.find(k => (lock.node_id !== null && k.node_id === lock.node_id) || (k.entity_id && k.entity_id === lock.entity_id));

/** Slot numbers to show: detected used slots + already-mapped slots, sorted. */
export const slotList = (lock: DetectedLock, kp: LockKeypad | undefined): number[] => {
  const nums = new Set<number>();
  (lock.slots || []).forEach(s => nums.add(s.slot));
  Object.keys(kp?.slots || {}).forEach(k => nums.add(parseInt(k, 10)));
  return [...nums].filter(n => !isNaN(n)).sort((a, b) => a - b);
};

export const setHouseMode = (hass: HomeAssistant, mode: string, force = false) =>
  hass.callWS<{ result: string; would?: string; reason?: string; open?: string[]; minutes?: number; failed?: string[] }>({
    type: 'alarmo/ext/house/set',
    mode,
    force,
  });

// ------------------------------------------------------------------ pure helpers

export const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32) || 'mode';

/** Default icon for a House Mode name (same rules as the backend's auto-detect). */
export const defaultModeIcon = (name: string): string => {
  const n = name.trim().toLowerCase();
  const rules: [RegExp, string][] = [
    [/vacation|holiday|travel/, 'mdi:shield-airplane'],
    [/disarm|^off$|wake|^day/, 'mdi:shield-lock-open-outline'],
    [/away|out|leave/, 'mdi:shield-lock'],
    [/sleep|night|bed/, 'mdi:bed'],
    [/stay|home/, 'mdi:shield-home'],
    [/spa|bypass|custom|pool|hot.?tub/, 'mdi:hot-tub'],
    [/guest|party|visitor|clean/, 'mdi:account-group'],
    [/local/, 'mdi:map-marker-radius'],
  ];
  return rules.find(([re]) => re.test(n))?.[1] || 'mdi:home';
};

/** Default card color for a House Mode name (same rules as the backend's mode_color). */
export const defaultModeColor = (name: string): string => {
  const n = name.trim().toLowerCase();
  // the colors of the original button-card setup (CSS green, red, orange, …), as hex
  const rules: [RegExp, string][] = [
    [/late.?night/, '#00bfff'],
    [/vacation|holiday|travel/, '#dc143c'],
    [/disarm|^off$|wake|^day/, '#008000'],
    [/away|out|leave/, '#ff0000'],
    [/sleep|night|bed/, '#5d5df4'],
    [/stay|home/, '#ffa500'],
    [/spa|bypass|custom|pool|hot.?tub/, '#00a8a8'],
    [/guest|party|visitor|clean/, '#990099'],
    [/local/, '#7bb314'],
  ];
  return rules.find(([re]) => re.test(n))?.[1] || '#808080';
};

const NAMED: Record<string, string> = {
  green: '#008000', red: '#ff0000', orange: '#ffa500', magenta: '#ff00ff', purple: '#800080', cyan: '#00ffff',
  midnightblue: '#191970', deepskyblue: '#00bfff', crimson: '#dc143c', blue: '#0000ff', yellow: '#ffff00',
  gray: '#808080', grey: '#808080', white: '#ffffff', black: '#000000', pink: '#ffc0cb',
};
/** #rrggbb for an <input type=color> (CSS names and #rgb converted; anything else → grey). */
export const toHex = (c: string): string => {
  const s = (c || '').trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  if (/^#[0-9a-f]{3}$/.test(s)) return '#' + [...s.slice(1)].map(x => x + x).join('');
  return NAMED[s] || '#9e9e9e';
};

export const newMode = (name: string, existing: HouseMode[]): HouseMode => {
  let id = slug(name);
  let n = 2;
  while (existing.some(m => m.id === id)) id = `${slug(name).slice(0, 29)}_${n++}`;
  return {
    id,
    name,
    icon: defaultModeIcon(name),
    targets: {},
    enter_sources: [...SOURCES],
    leave_sources: [...SOURCES],
    delay_sources: {},
    readiness: { entities: [], labels: [], action: 'warn' },
    on_failure: 'undo',
    timers: [],
    steps: [],
  };
};

/** Problems that block saving (the backend checks the same). */
export const modeErrors = (modes: HouseMode[]): string[] => {
  const out: string[] = [];
  const names = modes.map(m => m.name.trim().toLowerCase());
  if (names.some(n => !n)) out.push('Every House Mode needs a name.');
  if (new Set(names).size !== names.length) out.push('House Mode names must be unique.');
  const ids = new Set(modes.map(m => m.id));
  for (const m of modes)
    for (const t of m.timers)
      if (t.then !== 'previous' && !ids.has(t.then)) out.push(`${m.name}: a timer goes to a mode that no longer exists.`);
  return out;
};

/** "Ground Floor: Away · Garage: Disarm" */
export const describeTargets = (m: HouseMode, names: Record<string, string>, label: (s: string) => string) => {
  const parts = Object.entries(m.targets).map(([k, v]) => `${names[k] || k}: ${label(v)}`);
  return parts.length ? parts.join(' · ') : 'no partition changes';
};

/** Remove references to a deleted mode (timers, keypad slots). */
export const removeMode = (s: HouseSettings, id: string): HouseSettings => ({
  ...s,
  modes: s.modes
    .filter(m => m.id !== id)
    .map(m => ({ ...m, timers: m.timers.filter(t => t.then !== id) })),
  lock_keypads: s.lock_keypads.map(k => {
    const slots: Record<string, string> = {};
    Object.keys(k.slots).forEach(sl => {
      if (k.slots[sl] !== id) slots[sl] = k.slots[sl];
    });
    return { ...k, slots };
  }),
  current: s.current === id ? null : s.current,
});

/** Short description of a step, e.g. "Entering · after the change · only from Away". */
export const describeStep = (st: HouseStep, modeName: (id: string) => string): string =>
  [
    st.when === 'enter' ? 'Entering' : 'Leaving',
    st.phase === 'before' ? 'before arming' : 'after the change',
    st.modes.length ? `${st.when === 'enter' ? 'only from' : 'only to'} ${st.modes.map(modeName).join(', ')}` : '',
    st.wait && st.entity_id.startsWith('script.') ? 'waits for it' : '',
  ]
    .filter(Boolean)
    .join(' · ');

/** Short description of a timer, e.g. "after 10 min → Stay · only from Away, Stay · 20:30–05:00". */
export const describeTimer = (t: HouseTimer, modeName: (id: string) => string): string =>
  [
    `${t.at ? `at ${t.at}` : `after ${t.after_minutes} min`} → ${t.then === 'previous' ? 'the previous mode' : modeName(t.then)}`,
    t.from_modes.length ? `only from ${t.from_modes.map(modeName).join(', ')}` : '',
    t.window_start || t.window_end ? `${t.window_start || '00:00'}–${t.window_end || '24:00'}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

/** Names of the modes that run ``entityId`` (a scene or script) as an "entering" step. */
export const enterStepModes = (s: HouseSettings, entityId: string): string[] =>
  s.modes.filter(m => (m.steps || []).some(st => st.entity_id === entityId && st.when === 'enter')).map(m => m.name);

/**
 * Make ``entityId`` an "entering, after the change" step of exactly the modes in ``names``. Other steps are kept; a
 * mode that already runs it on entering keeps that step as it is. Returns the new settings.
 */
export const setEnterSteps = (s: HouseSettings, entityId: string, names: string[]): HouseSettings => ({
  ...s,
  modes: s.modes.map(m => {
    const steps = m.steps || [];
    const has = steps.some(st => st.entity_id === entityId && st.when === 'enter');
    const want = names.includes(m.name);
    if (want && !has) return { ...m, steps: [...steps, { entity_id: entityId, when: 'enter', phase: 'after', modes: [], wait: false }] };
    if (!want && has) return { ...m, steps: steps.filter(st => !(st.entity_id === entityId && st.when === 'enter')) };
    return m;
  }),
});
