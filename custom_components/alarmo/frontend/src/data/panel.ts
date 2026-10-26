// Panel link: websocket calls + pure helpers (unit-tested with node --test).
import type { HomeAssistant } from '../types';

export const PANEL_STATES = [
  'armed_away',
  'armed_home',
  'armed_night',
  'armed_vacation',
  'armed_custom_bypass',
  'disarmed',
];

export type PanelCommand = { method: 'service' | 'keypress' | 'none'; keys: string; accept: string[]; timeout: number };
export type PanelLinkCfg = {
  panel_entity: string;
  mode: 'off' | 'shadow' | 'live';
  panel_type: 'generic' | 'envisalink';
  follow_panel: boolean;
  retries: number;
  retry_delay: number;
  failure_policy: 'disarm' | 'keep';
  bypass_keys: string;
  commands: Record<string, PanelCommand>;
  delays: Record<string, { entry?: number | null; exit?: number | null }>;
  learned_exit_delay: Record<string, number>;
  arm_order?: 'panel_leads' | 'after_alarmo';
  confirm_margin?: number;
  follow_map?: Record<string, string>;
};
export type PanelSettings = {
  links: Record<string, PanelLinkCfg>;
  monitored: boolean;
  notify_service?: string | null;
  trip: { method: 'siren' | 'relay' | 'panic' | 'none'; entity?: string | null; panic_method: 'service' | 'keypress'; panic_keys: string };
  zone_trip: Record<string, 'panel' | 'notify' | 'none'>;
  mirrors: Record<string, { hold: 'last' | 'unknown' }>;
  ignored_zones?: string[];
  bypass_entity?: string | null;
};
export type PanelZone = {
  entity_id: string;
  zone: number | null;
  partition: number | null;
  name: string;
  device_class: string | null;
  state: string | null;
  configured: boolean;
  mirror: string | null;
  mirror_configured: boolean;
};
export type DiscoveredPanel = { entity_id: string; platform: string; name: string; state: string | null; code_set: boolean; zones: PanelZone[] };
export type LogEntry = { ts: number; link: string | null; level: string; msg: string };
export type PanelInfo = {
  settings: PanelSettings;
  panels: DiscoveredPanel[];
  targets: { key: string; entity_id: string; name: string }[];
  running: string[];
  bypassed: string[];
  bypass_unreported?: string[];
  log: LogEntry[];
};

export const fetchPanel = (hass: HomeAssistant) => hass.callWS<PanelInfo>({ type: 'alarmo/ext/panel/get' });
export const savePanel = (hass: HomeAssistant, settings: PanelSettings) =>
  hass.callWS<PanelSettings>({ type: 'alarmo/ext/panel/save', settings });
export const fetchPanelLog = (hass: HomeAssistant) => hass.callWS<{ log: LogEntry[] }>({ type: 'alarmo/ext/panel/log' });
export const importZones = (hass: HomeAssistant, partition: string, entities: string[], dryRun = false) =>
  hass.callWS<{ create: Record<string, any>[]; applied: boolean; backup?: { name: string } }>({
    type: 'alarmo/ext/panel/import',
    partition,
    entities,
    dry_run: dryRun,
  });
export const repointZones = (hass: HomeAssistant, pairs: { from: string; to: string }[]) =>
  hass.callWS<{ backup: { name: string }; changed: number }>({ type: 'alarmo/ext/panel/repoint', pairs });

// ------------------------------------------------------------------ pure helpers

/** A new link with the defaults the backend would fill in. */
export const newLink = (panel: string, platform: string): PanelLinkCfg => ({
  panel_entity: panel,
  mode: 'shadow',
  panel_type: platform === 'envisalink_new' ? 'envisalink' : 'generic',
  follow_panel: true,
  retries: 3,
  retry_delay: 5,
  failure_policy: 'disarm',
  bypass_keys: '{code}6{zone}',
  commands: {},
  delays: {},
  learned_exit_delay: {},
  arm_order: 'panel_leads',
  confirm_margin: 10,
  follow_map: {},
});

/** "armed_home, armed_night" <-> list */
export const parseStates = (text: string) =>
  text
    .split(/[\s,]+/)
    .map(s => s.trim())
    .filter(s => s && (PANEL_STATES.includes(s) || s === 'triggered'));
export const formatStates = (list: string[]) => list.join(', ');

/** Problems to show before saving. */
export const settingsWarnings = (s: PanelSettings, panels: DiscoveredPanel[]): string[] => {
  const out: string[] = [];
  for (const [key, link] of Object.entries(s.links)) {
    const p = panels.find(x => x.entity_id === link.panel_entity);
    const usesCode =
      Object.values(link.commands).some(c => c.method === 'keypress' && c.keys.includes('{code}')) ||
      link.panel_type === 'envisalink';
    if (!p) out.push(`${key}: panel ${link.panel_entity} was not found.`);
    else if (usesCode && !p.code_set)
      out.push(`${key}: set a default code on ${link.panel_entity} (entity settings) so keypresses can be sent.`);
  }
  if ((s.trip.method === 'siren' || s.trip.method === 'relay') && !s.trip.entity)
    out.push(`Choose the ${s.trip.method} entity used to set off the alarm.`);
  return out;
};

/** Effective trip policy for a zone (mirrors the backend). */
export const tripPolicy = (s: PanelSettings, entityId: string) =>
  s.zone_trip[entityId] || (s.monitored ? 'notify' : 'panel');

export const formatTime = (ts: number) => {
  const d = new Date(ts * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// zone types for "Create mirror for", by device class
export const MIRROR_TYPES: { id: string; label: string; classes: string[] }[] = [
  { id: 'door', label: 'Doors', classes: ['door', 'garage_door', 'opening'] },
  { id: 'window', label: 'Windows', classes: ['window'] },
  { id: 'motion', label: 'Motion', classes: ['motion', 'occupancy', 'presence', 'moving'] },
];
export const zoneKind = (dc: string | null | undefined) => (MIRROR_TYPES.find(t => t.classes.includes(dc || '')) || { id: '' }).id;

/** binary_sensor.alarm_zone_9 -> binary_sensor.alarm_zone_9_mirror (same as the backend). */
export const mirrorId = (src: string) => `binary_sensor.${src.replace(/^binary_sensor\./, '')}_mirror`;

export type ExitPlan = Record<string, { name: string; changes: Record<string, number>; before: Record<string, number> }>;
export const matchExitTimes = (hass: HomeAssistant, link: string, dryRun = false) =>
  hass.callWS<{ plan: ExitPlan; applied: boolean; backup?: { name: string } }>({ type: 'alarmo/ext/panel/match_exit', link, dry_run: dryRun });
