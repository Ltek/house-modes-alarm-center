// Activity recorder: websocket calls + pure helpers (unit-tested).
import type { HomeAssistant } from '../types';

export type ActivityEntry = { t: number; dt: number; kind: string; text: string; entity?: string; cause?: string; level?: string };
export type ActivitySequence = { id: string; start: number; end?: number; duration?: number; title: string; kinds: string[]; entries: ActivityEntry[] };
export type ActivitySettings = { enabled: boolean; window_s: number; retention_days: number; entities: string[] };
export type ActivityInfo = {
  settings: ActivitySettings;
  days: string[];
  open: ActivitySequence | null;
  kinds: Record<string, string>;
  watched: Record<string, string>;
  directory: string;
  running?: boolean;
  last_write?: number | null;
  last_error?: string | null;
};
export type ActivitySummary = {
  sequences: number;
  starters: Record<string, number>;
  failures: number;
  panel_latency: Record<string, { n: number; avg: number; max: number }>;
};

export const fetchActivity = (hass: HomeAssistant) => hass.callWS<ActivityInfo>({ type: 'alarmo/ext/activity/get' });
export const fetchActivityDay = (hass: HomeAssistant, day: string) =>
  hass.callWS<{ sequences: ActivitySequence[]; summary: ActivitySummary }>({ type: 'alarmo/ext/activity/day', day });
export const saveActivitySettings = (hass: HomeAssistant, settings: ActivitySettings) =>
  hass.callWS<{ settings: ActivitySettings }>({ type: 'alarmo/ext/activity/settings', settings });

const PROBLEM = /fail|error|not allowed|differ|could not/i;

/** Filter: any of the chosen kinds (none chosen = all), problems only, text search over entries. */
export const sequenceMatches = (s: ActivitySequence, kinds: string[], onlyProblems: boolean, search: string): boolean => {
  if (kinds.length && !s.kinds.some(k => kinds.includes(k))) return false;
  if (onlyProblems && !s.entries.some(e => PROBLEM.test(e.text) || e.level === 'error')) return false;
  const q = search.trim().toLowerCase();
  if (q && !(s.title.toLowerCase().includes(q) || s.entries.some(e => e.text.toLowerCase().includes(q) || (e.cause || '').toLowerCase().includes(q))))
    return false;
  return true;
};
