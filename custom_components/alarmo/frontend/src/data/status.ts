// Status strip, live zone state, "Why won't it arm?" and walk test: websocket calls + pure helpers.
import type { HomeAssistant } from '../types';

export type StatusInfo = {
  house: { enabled: boolean; current: string | null; name: string | null; icon: string | null; source: string | null };
  alarms: { key: string; entity_id: string; name: string }[];
  links: { key: string; panel_entity: string; mode: 'off' | 'shadow' | 'live'; running: boolean; ready_entity: string | null }[];
  rules_pending: number;
};
export type WhyBlocker = { entity_id: string; state: string; reason: string; motion: boolean; exit_delay: boolean };
export type WhyMode = { mode: string; ready: boolean; blocking: WhyBlocker[]; bypassed: string[]; exit_time: number };
export type WhyInfo = {
  areas: { area_id: string; entity_id: string; name: string; state: string | null; modes: WhyMode[] }[];
  panels: { key: string; panel_entity: string; mode: string; ready_entity: string | null; ready: boolean | null }[];
  house_modes: { id: string; name: string; action: 'block' | 'warn'; open: string[] }[];
};

export const fetchStatus = (hass: HomeAssistant) => hass.callWS<StatusInfo>({ type: 'alarmo/ext/status' });
export const fetchWhy = (hass: HomeAssistant) => hass.callWS<WhyInfo>({ type: 'alarmo/ext/why' });

export const ZONE_DRAFT_KEY = 'alarmo-ext-sensor-table-draft';

// same lists as Alarmo's sensors.py (plus covers/locks)
const OPEN = ['on', 'open', 'opening', 'closing', 'unlocked', 'tilted', 'true', 'detected'];
const CLOSED = ['off', 'closed', 'locked', 'false', 'clear'];
export type LiveState = 'open' | 'closed' | 'unavailable' | 'unknown';

/** Live state of a zone entity. */
export const liveState = (state: string | undefined | null): LiveState => {
  if (!state || state === 'unavailable') return 'unavailable';
  if (OPEN.includes(state)) return 'open';
  if (CLOSED.includes(state)) return 'closed';
  return 'unknown';
};

/** Arm Modes an open (or unavailable) zone blocks, mirroring Alarmo's readiness check. */
export const blocksModes = (
  cfg: { enabled?: boolean; modes?: string[]; always_on?: boolean; allow_open?: boolean; auto_bypass?: boolean; auto_bypass_modes?: string[]; trigger_unavailable?: boolean; type?: string },
  live: LiveState,
  areaModes: string[]
): string[] => {
  if (cfg.enabled === false) return [];
  if (!(live === 'open' || (live === 'unavailable' && cfg.trigger_unavailable))) return [];
  if (cfg.type === 'motion') return []; // Alarmo ignores open motion zones for readiness while disarmed
  return areaModes.filter(
    m =>
      ((cfg.modes || []).includes(m) || cfg.always_on) &&
      !(cfg.auto_bypass && (cfg.auto_bypass_modes || []).includes(m)) &&
      !(cfg.allow_open && live === 'open')
  );
};

// ------------------------------------------------------------------ walk test

export type WalkEntry = { opened: boolean; closed: boolean; last?: string };
export type WalkState = Record<string, WalkEntry>;

/** Record a state change during the walk test: a zone passes once it was seen open and closed again. */
export const walkUpdate = (w: WalkState, entity: string, state: string | undefined): WalkState => {
  const e = w[entity] || { opened: false, closed: false };
  const live = liveState(state);
  if (e.last === state) return w;
  const next = { ...e, last: state };
  if (live === 'open') next.opened = true;
  if (live === 'closed' && e.opened) next.closed = true;
  return { ...w, [entity]: next };
};

export const walkPassed = (e?: WalkEntry) => !!e && e.opened && e.closed;

export const walkSummary = (w: WalkState, entities: string[]) => {
  const passed = entities.filter(e => walkPassed(w[e])).length;
  const open = entities.filter(e => w[e] && w[e].opened && !w[e].closed).length;
  return { passed, open, left: entities.length - passed, total: entities.length };
};
