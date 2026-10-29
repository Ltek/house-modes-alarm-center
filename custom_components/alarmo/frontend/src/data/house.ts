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
  after_minutes: number;
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
  compare_entity?: string | null;
  modes: HouseMode[];
  input_select?: string | null;
  lock_keypads: LockKeypad[];
  notify_services: string[];
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

export const newMode = (name: string, existing: HouseMode[]): HouseMode => {
  let id = slug(name);
  let n = 2;
  while (existing.some(m => m.id === id)) id = `${slug(name).slice(0, 29)}_${n++}`;
  return {
    id,
    name,
    icon: 'mdi:home',
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
