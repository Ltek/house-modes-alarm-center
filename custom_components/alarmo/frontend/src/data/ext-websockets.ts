// Websocket calls for the alarmo "ext" backend (ext_websockets.py). All admin-only.
import { HomeAssistant } from '../types';
import { SensorBatch } from './draft-store';

export type BackupFile = { file: string; size: number };
export type BackupInfo = {
  name: string;
  label: string | null;
  created: string | null;
  files: { storage?: BackupFile; yaml?: BackupFile; extras?: BackupFile };
};
export type ExtSettings = { retention_days: number };

export type FieldChange = { field: string; old: any; new: any };
export type SectionDiff = {
  added: { id: string; label: string }[];
  changed: { id: string; label: string; fields: FieldChange[] }[];
  removed: { id: string; label: string }[];
};
export type ImportMode = 'merge' | 'replace';
export type ImportPreview = {
  ok: boolean;
  errors: string[];
  warnings?: string[];
  format?: 'yaml' | 'storage';
  source_version?: string;
  exported_at?: string | null;
  alarmo_version?: string | null;
  mode?: ImportMode;
  sections?: Record<string, SectionDiff>;
  summary?: Record<string, { added: number; changed: number; removed: number }>;
  total_changes?: number;
  token?: string;
  blocked_by?: string[];
  extras_included?: boolean;
  extras_changes?: { key: string; label: string }[];
};
export type ImportSource = { content: string } | { backup_name: string };

export type ExtUi = { show_legacy_zones?: boolean };
export const setExtUi = (hass: HomeAssistant, ui: ExtUi) => hass.callWS<{ ui: ExtUi }>({ type: 'alarmo/ext/ui/set', ui });
export const fetchExtInfo = (hass: HomeAssistant) =>
  hass.callWS<{ version: string; backup_dir: string; settings: ExtSettings; blocked_by: string[]; ui: ExtUi }>({
    type: 'alarmo/ext/info',
  });

export const exportYaml = (hass: HomeAssistant) =>
  hass.callWS<{ file_name: string; content: string }>({ type: 'alarmo/ext/export' });

export const listBackups = (hass: HomeAssistant) =>
  hass.callWS<{ backups: BackupInfo[]; settings: ExtSettings }>({ type: 'alarmo/ext/backup/list' });

export const createBackup = (hass: HomeAssistant, label?: string) =>
  hass.callWS<BackupInfo>({ type: 'alarmo/ext/backup/create', ...(label ? { label } : {}) });

export const deleteBackup = (hass: HomeAssistant, name: string) =>
  hass.callWS<{ deleted: string }>({ type: 'alarmo/ext/backup/delete', name });

export const downloadBackupFile = (hass: HomeAssistant, file: string) =>
  hass.callWS<{ file_name: string; content: string }>({ type: 'alarmo/ext/backup/download', file });

export const saveBackupSettings = (hass: HomeAssistant, settings: Partial<ExtSettings>) =>
  hass.callWS<ExtSettings>({ type: 'alarmo/ext/backup/settings', ...settings });

export const previewImport = (hass: HomeAssistant, source: ImportSource, mode: ImportMode) =>
  hass.callWS<ImportPreview>({ type: 'alarmo/ext/import/preview', ...source, mode });

export const applyImport = (hass: HomeAssistant, source: ImportSource, mode: ImportMode, token: string) =>
  hass.callWS<{ backup: BackupInfo; total_changes: number }>({
    type: 'alarmo/ext/import/apply',
    ...source,
    mode,
    token,
  });

export const applySensorChanges = (hass: HomeAssistant, batch: SensorBatch) =>
  hass.callWS<{ backup: BackupInfo; created: number; updated: number; deleted: number }>({
    type: 'alarmo/ext/sensors/apply_changes',
    ...batch,
  });

/** Readable message from a rejected callWS promise. */
export const wsErrorMessage = (err: any): string =>
  (err && (err.message || (err.body && err.body.message) || err.error || err.code)) || String(err);

/** Save text as a file through the browser. */
export const downloadText = (fileName: string, content: string, mime = 'text/yaml') => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
};

export const formatBytes = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

export const formatDate = (iso: string | null, language: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (_e) {
    return iso;
  }
};

/** Show a Home Assistant toast. */
export const toast = (el: HTMLElement, message: string) => {
  el.dispatchEvent(
    new CustomEvent('hass-notification', { detail: { message }, bubbles: true, composed: true })
  );
};
