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
  /** House Mode notifications: edited on the Notifications tab (data/house-notify.ts) */
  notifications?: unknown;
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
  hass.callWS<DetectResult>({ type: 'house_modes/ext/house/detect', ...(entities || {}) });

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
  hass.callWS<{ log: ShadowEntry[]; summary: ShadowSummary }>({ type: 'house_modes/ext/house/shadow' });
/** 'off' | 'shadow' | 'live' from the two settings. */
export const runState = (s: HouseSettings) => (!s.enabled ? 'off' : s.run_mode === 'shadow' ? 'shadow' : 'live');
export const setRunState = (s: HouseSettings, v: 'off' | 'shadow' | 'live') => {
  s.enabled = v !== 'off';
  if (v !== 'off') s.run_mode = v;
};

export const fetchHouse = (hass: HomeAssistant) => hass.callWS<HouseInfo>({ type: 'house_modes/ext/house/get' });
export const saveHouse = (hass: HomeAssistant, settings: HouseSettings) =>
  hass.callWS<HouseSettings>({ type: 'house_modes/ext/house/save', settings });
export const fetchLocks = (hass: HomeAssistant) => hass.callWS<{ locks: DetectedLock[] }>({ type: 'house_modes/ext/house/locks' });

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
    type: 'house_modes/ext/house/set',
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

/** Short description of an action (a step), e.g. "Entering · after the change · only from Away". */
export const describeStep = (st: HouseStep, modeName: (id: string) => string): string =>
  [
    st.when === 'enter' ? 'Entering' : 'Leaving',
    st.phase === 'before' ? 'before arming' : 'after the change',
    st.modes.length ? `${st.when === 'enter' ? 'only from' : 'only to'} ${st.modes.map(modeName).join(', ')}` : '',
    st.wait && st.entity_id.startsWith('script.') ? 'waits for it' : '',
  ]
    .filter(Boolean)
    .join(' · ');

/** True for a House Modes script by name: its object id starts with ``hm_`` (e.g. script.hm_lock_up). */
export const isHmEntity = (entityId: string): boolean => entityId.split('.', 2)[1]?.startsWith('hm_') || false;

/** The scripts a House Mode can run as an action, ``hm_…`` ones first, each group sorted. */
export const actionChoices = (hass: { states: Record<string, unknown> }): string[] =>
  Object.keys(hass.states)
    .filter(e => e.startsWith('script.'))
    .sort((a, b) => Number(isHmEntity(b)) - Number(isHmEntity(a)) || a.localeCompare(b));

/** Short description of a timer, e.g. "after 10 min → Stay · only from Away, Stay · 20:30–05:00". */
export const describeTimer = (t: HouseTimer, modeName: (id: string) => string): string =>
  [
    `${t.at ? `at ${t.at}` : `after ${t.after_minutes} min`} → ${t.then === 'previous' ? 'the previous mode' : modeName(t.then)}`,
    t.from_modes.length ? `only from ${t.from_modes.map(modeName).join(', ')}` : '',
    t.window_start || t.window_end ? `${t.window_start || '00:00'}–${t.window_end || '24:00'}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

// ------------------------------------------------------------------ House Mode Actions by script
// The actions are stored per mode (mode.steps). This view groups them by script and timing, so one script used by
// several modes is one row: tick the modes, set the timing once.

export type ActionGroup = { entity_id: string; when: HouseStep['when']; phase: HouseStep['phase']; modes: string[] };

type ActionKey = { entity_id: string; when: string; phase: string };
const sameKey = (st: ActionKey, g: ActionKey) =>
  st.entity_id === g.entity_id && st.when === g.when && st.phase === g.phase;

/** One group per script + timing, with the ids of the modes that run it that way (in mode order). */
export const actionGroups = (s: HouseSettings): ActionGroup[] => {
  const out: ActionGroup[] = [];
  for (const m of s.modes)
    for (const st of m.steps || []) {
      let g = out.find(x => sameKey(st, x));
      if (!g) out.push((g = { entity_id: st.entity_id, when: st.when, phase: st.phase, modes: [] }));
      if (!g.modes.includes(m.id)) g.modes.push(m.id);
    }
  return out;
};

const mapSteps = (s: HouseSettings, fn: (m: HouseMode, steps: HouseStep[]) => HouseStep[]): HouseSettings => ({
  ...s,
  modes: s.modes.map(m => ({ ...m, steps: fn(m, (m.steps || []).map(st => ({ ...st, modes: [...st.modes] }))) })),
});

/** Run the group in exactly the modes ``modeIds``: adds the action where missing, removes it elsewhere. */
export const setGroupModes = (s: HouseSettings, g: Omit<ActionGroup, 'modes'>, modeIds: string[]): HouseSettings =>
  mapSteps(s, (m, steps) => {
    const has = steps.some(st => sameKey(st, g));
    if (modeIds.includes(m.id) && !has) return [...steps, { entity_id: g.entity_id, when: g.when, phase: g.phase, modes: [], wait: false }];
    if (!modeIds.includes(m.id) && has) return steps.filter(st => !sameKey(st, g));
    return steps;
  });

/** Change the script or timing of every action in the group (a mode that already has the new one keeps just one). */
export const updateGroup = (s: HouseSettings, g: Omit<ActionGroup, 'modes'>, to: Partial<Omit<ActionGroup, 'modes'>>): HouseSettings => {
  const next = { ...g, ...to };
  return mapSteps(s, (_m, steps) => {
    if (!steps.some(st => sameKey(st, g))) return steps;
    const dup = steps.some(st => sameKey(st, next)) && !sameKey(g, next);
    return dup ? steps.filter(st => !sameKey(st, g)) : steps.map(st => (sameKey(st, g) ? { ...st, ...to } : st));
  });
};

/** Remove the group's action from every mode. */
export const removeGroup = (s: HouseSettings, g: Omit<ActionGroup, 'modes'>): HouseSettings => setGroupModes(s, g, []);

// ------------------------------------------------------------------ timer checks (warnings, never block saving)

/** Timers that can never fire, or bounce: one warning per problem, with the mode that owns the timer. */
export const timerWarnings = (modes: HouseMode[]): { mode: string; text: string }[] => {
  const out: { mode: string; text: string }[] = [];
  const byId = new Map(modes.map(m => [m.id, m]));
  for (const m of modes) {
    if (m.timers.length && !m.leave_sources.includes('timer'))
      out.push({ mode: m.id, text: `${m.name}: its timers never fire, because ${m.name} doesn't allow House Mode timers to exit (Allowed Sources, May Exit).` });
    for (const t of m.timers) {
      const to = t.then === 'previous' ? null : byId.get(t.then);
      if (t.then === m.id) out.push({ mode: m.id, text: `${m.name}: a timer goes to ${m.name} itself.` });
      else if (to && !to.enter_sources.includes('timer'))
        out.push({ mode: m.id, text: `${m.name}: the timer to ${to.name} is blocked, because ${to.name} doesn't allow House Mode timers to enter (Allowed Sources, May Enter).` });
      for (const f of t.from_modes) {
        if (!byId.has(f)) out.push({ mode: m.id, text: `${m.name}: a timer's "only when coming from" names a mode that no longer exists (${f}).` });
        else if (f === m.id) out.push({ mode: m.id, text: `${m.name}: a timer's "only when coming from" names ${m.name} itself, which can never come first.` });
      }
      if (to && to.id !== m.id && !t.window_start && !t.window_end) {
        const back = to.timers.some(b => b.then === m.id && !b.window_start && !b.window_end);
        if (back && m.id < to.id)
          out.push({ mode: m.id, text: `${m.name} and ${to.name} have timers that go to each other, so the mode can keep switching between them.` });
      }
    }
  }
  return out;
};
