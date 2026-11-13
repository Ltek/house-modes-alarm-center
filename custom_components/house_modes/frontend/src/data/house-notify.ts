// House Mode notifications (Notifications tab → House Mode). Backend: house_notify.py, settings in house_config.py.
import { HomeAssistant } from '../types';
import { newAutomationId } from './alerts';

export type NotifyEvent = 'changed' | 'blocked' | 'failed' | 'timer';
export const NOTIFY_EVENTS: NotifyEvent[] = ['changed', 'blocked', 'failed', 'timer'];
export const EVENT_INFO: Record<NotifyEvent, { title: string; icon: string; hint: string }> = {
  changed: { title: 'Changed', icon: 'mdi:home-switch-outline', hint: 'Every House Mode change.' },
  blocked: {
    title: 'Blocked',
    icon: 'mdi:cancel',
    hint: 'A change refused by Allowed Sources or open zones, a "not ready" warning, a keypad action not allowed.',
  },
  failed: { title: 'Failed to arm', icon: 'mdi:shield-alert-outline', hint: 'Arming did not work, or a Script Action failed.' },
  timer: { title: 'Timer set', icon: 'mdi:timer-outline', hint: 'A timer, or a request waiting before it may change the mode.' },
};
export const PRIORITY_LABELS: Record<string, string> = {
  normal: 'Normal',
  high: 'High (time sensitive)',
  critical: 'Critical (through Do Not Disturb)',
};
export const PLACEHOLDER_HELP: Record<string, string> = {
  mode: 'the House Mode it changes to (or would have)',
  previous: 'the mode before',
  current: 'the mode now',
  source: 'where the change came from, e.g. "by hand"',
  reason: 'why it was blocked or failed',
  what: '"not set" or "not ready" (Blocked)',
  when: '"in 10 min" or "at 01:00" (Timer set)',
  minutes: 'the timer in minutes',
  duration: 'how long the previous mode lasted',
  change: '"from Disarmed · by hand"',
};

export type NotifyEventSettings = { enabled: boolean; title: string; message: string; priority: string; buttons: string[] };
export type NotifySettings = {
  services: string[];
  skip_sources: string[];
  only_modes: string[];
  replace: boolean;
  button_users: 'admins' | string[];
} & Record<NotifyEvent, NotifyEventSettings>;

export type AdvancedItem = {
  entity_id: string;
  name: string;
  state: string;
  last_triggered: string | null;
  edit_id: string | null;
  events: NotifyEvent[];
  devices: number;
  services: number;
};

export type NotifyInfo = {
  settings: NotifySettings;
  defaults: Record<NotifyEvent, { title: string; message: string; priority: string }>;
  buttons: Record<NotifyEvent, string[]>;
  button_titles: Record<string, string>;
  placeholders: string[];
  advanced: AdvancedItem[];
  covered: Record<NotifyEvent, string[]>;
  blueprint: string;
};

export const fetchHouseNotify = (hass: HomeAssistant) => hass.callWS<NotifyInfo>({ type: 'house_modes/ext/house_notify/get' });
export const saveHouseNotify = (hass: HomeAssistant, settings: NotifySettings) =>
  hass.callWS<NotifyInfo>({ type: 'house_modes/ext/house_notify/save', settings });
export const testHouseNotify = (hass: HomeAssistant, event: NotifyEvent, settings: NotifySettings) =>
  hass.callWS<{ sent: number }>({ type: 'house_modes/ext/house_notify/test', event, settings });

/** A new automation from the House Mode Notifications blueprint, with the Simple services filled in. */
export const createAdvanced = async (hass: HomeAssistant, path: string, services: string[]) => {
  const id = newAutomationId();
  await hass.callApi('POST', `config/automation/config/${id}`, {
    alias: 'House Mode notification',
    description: 'House Mode Notifications (made on the Notifications tab)',
    use_blueprint: { path, input: { events: ['changed'], notify_services: services } },
  });
  return id;
};

/** "3 of 4 on · 2 services" */
export const notifySummary = (info?: NotifyInfo): string => {
  if (!info) return 'loading…';
  const s = info.settings;
  const on = NOTIFY_EVENTS.filter(e => s[e].enabled).length;
  const adv = info.advanced.length;
  return [
    s.services.length ? `${on} of 4 on · ${s.services.length} service${s.services.length === 1 ? '' : 's'}` : 'no notify service chosen',
    adv ? `${adv} advanced` : '',
  ]
    .filter(Boolean)
    .join(' · ');
};
