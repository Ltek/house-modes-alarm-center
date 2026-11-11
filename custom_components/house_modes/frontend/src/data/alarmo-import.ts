// The one-time import from Alarmo (Quick Start's first question, and the Backup tab), and the rewrite of Alarmo names
// in the user's own automations, scripts, templates, blueprints and dashboards. Backend: alarmo_import.py,
// references.py. Nothing is imported or rewritten until the user presses the button and confirms.
import { HomeAssistant } from '../types';

export type ImportCounts = {
  partitions: number;
  zones: number;
  users: number;
  alarm_events: number;
  sensor_groups: number;
  house_modes: number;
  panel_links: number;
  mirrors: number;
  zone_rules: number;
  lock_links: number;
};

export type ImportStatus = {
  found: boolean;
  kind: 'fork' | 'alarmo' | null;
  counts: ImportCounts;
  folders: { activity: number; backups: number };
  old_entries: { entry_id: string; title: string; state: string; disabled: boolean }[];
  old_active: boolean;
  choice: 'imported' | 'fresh' | null;
  at: string | null;
  imported: { kind: string; counts: ImportCounts; copied: { activity: number; backups: number }; backup: string } | null;
  ask: boolean;
};

export type RefHit = { line: number; old: string; new: string; kind: string; text: string };
export type RefScan = {
  files: { file: string; hits: RefHit[]; other: { line: number; text: string }[]; cards: number[] }[];
  dashboards: { url_path: string | null; mode: string; hits: { old: string; new: string; kind: string }[]; cards: number }[];
  total: number;
  token: string;
  last: { at: string; backup: string; files: string[]; dashboards: (string | null)[]; restart: string[] } | null;
};

export const fetchImportStatus = (hass: HomeAssistant) =>
  hass.callWS<ImportStatus>({ type: 'house_modes/ext/alarmo_import/status' });
export const runImport = (hass: HomeAssistant) => hass.callWS<any>({ type: 'house_modes/ext/alarmo_import/run' });
export const startFresh = (hass: HomeAssistant) => hass.callWS<any>({ type: 'house_modes/ext/alarmo_import/fresh' });
export const scanReferences = (hass: HomeAssistant) => hass.callWS<RefScan>({ type: 'house_modes/ext/references/scan' });
export const applyReferences = (hass: HomeAssistant, token: string) =>
  hass.callWS<{ files: string[]; dashboards: (string | null)[]; restart: string[]; backup: string }>({
    type: 'house_modes/ext/references/apply',
    token,
  });
export const undoReferences = (hass: HomeAssistant) =>
  hass.callWS<{ files: string[]; dashboards: (string | null)[]; restart: string[] }>({ type: 'house_modes/ext/references/undo' });

/** "3 partitions · 43 zones · …" (only what is there). */
export function countsText(c: ImportCounts): string {
  const parts: [number, string][] = [
    [c.partitions, 'partition'],
    [c.zones, 'zone'],
    [c.users, 'user'],
    [c.alarm_events, 'Alarm Event'],
    [c.sensor_groups, 'cross-zone group'],
    [c.house_modes, 'House Mode'],
    [c.panel_links, 'panel link'],
    [c.mirrors, 'mirror'],
    [c.zone_rules, 'zone rule'],
    [c.lock_links, 'lock code slot'],
  ];
  return parts
    .filter(([n]) => n > 0)
    .map(([n, w]) => `${n} ${w}${n === 1 ? '' : 's'}`)
    .join(' · ');
}
