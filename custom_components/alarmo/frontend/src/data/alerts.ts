// Smart Alerts on the Notifications tab: native automations made from the Smart Alerts blueprint.
import type { HomeAssistant } from '../types';

export type AlertSummary = {
  triggers: string[];
  devices: number;
  services: number;
  repeat: boolean;
  repeat_every: unknown;
  max_repeats: number | null;
  camera: string | null;
  test_mode: boolean;
  tag: string;
  buttons: number;
  critical: boolean;
};
export type AlertItem = {
  entity_id: string;
  name: string;
  state: string;
  last_triggered: string | null;
  edit_id: string | null;
  blueprint: string;
  /** the old blueprint's name when it still uses Repeating Alerts or Smart Camera Notifications */
  old: string | null;
  summary: AlertSummary;
};
export type BlueprintStatus = {
  path: string;
  installed: boolean;
  installed_version: string | null;
  shipped_version: string | null;
  ours: boolean;
  update: boolean;
};
export type AlertsInfo = { blueprint: BlueprintStatus; items: AlertItem[] };

export const fetchAlerts = (hass: HomeAssistant) => hass.callWS<AlertsInfo>({ type: 'alarmo/ext/alerts/get' });
export const installAlertsBlueprint = (hass: HomeAssistant, force = false) =>
  hass.callWS<BlueprintStatus>({ type: 'alarmo/ext/alerts/install', force });

/** "5 min" for a duration input ({hours, minutes, seconds}, "HH:MM:SS" or seconds). */
export const formatDuration = (d: unknown): string => {
  let s = 0;
  if (typeof d === 'number') s = d;
  else if (typeof d === 'string') {
    const p = d.split(':').map(Number);
    s = p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : Number(d) || 0;
  } else if (d && typeof d === 'object') {
    const o = d as Record<string, number>;
    s = (o.days || 0) * 86400 + (o.hours || 0) * 3600 + (o.minutes || 0) * 60 + (o.seconds || 0);
  }
  if (!s) return '';
  if (s % 3600 === 0) return `${s / 3600} h`;
  if (s % 60 === 0) return `${s / 60} min`;
  return `${s} s`;
};

/** "Front Door · 2 phones · repeats every 5 min (max 3) · camera Patio · 2 buttons · critical" */
export const describeAlert = (a: AlertItem, name: (entityId: string) => string): string => {
  const s = a.summary;
  const parts: string[] = [];
  if (s.triggers.length) parts.push(s.triggers.slice(0, 3).map(t => (t.includes('.') ? name(t) : t)).join(', ') + (s.triggers.length > 3 ? ` +${s.triggers.length - 3}` : ''));
  const to = s.devices + s.services;
  parts.push(to ? `${to} target${to === 1 ? '' : 's'}` : 'no targets');
  if (s.repeat) parts.push(`repeats${formatDuration(s.repeat_every) ? ` every ${formatDuration(s.repeat_every)}` : ''}${s.max_repeats ? ` (max ${s.max_repeats})` : ''}`);
  if (s.camera) parts.push(`camera ${name(s.camera)}`);
  if (s.buttons) parts.push(`${s.buttons} button${s.buttons === 1 ? '' : 's'}`);
  if (s.critical) parts.push('critical');
  if (s.test_mode) parts.push('TEST MODE');
  return parts.join(' · ');
};

/** The next free automation config id (milliseconds, like Home Assistant's own editor). */
export const newAutomationId = () => String(Date.now());

export const createAlert = async (hass: HomeAssistant, alias: string, path: string) => {
  const id = newAutomationId();
  await hass.callApi('POST', `config/automation/config/${id}`, {
    alias,
    description: 'Smart Alerts (made on the Notifications tab)',
    use_blueprint: { path, input: {} },
  });
  return id;
};

export const deleteAlert = (hass: HomeAssistant, id: string) => hass.callApi('DELETE', `config/automation/config/${id}`);
