// Alarmo Users <-> lock code slots and per-User keypad actions: websocket calls + pure helpers.
// PINs never reach the browser: the backend only reports slot status and sync results.
import type { HomeAssistant } from '../types';

export type KeypadAction = { house_mode: string | null; targets: Record<string, string> };
export type UserActions = { unlock?: KeypadAction; lock?: KeypadAction };
export type LockLink = { user_id: string; entity_id: string; slot: number };
export type LockSettings = {
  links: LockLink[];
  actions: Record<string, UserActions>;
  lock_actions: Record<string, KeypadAction>;
};
export type LockInfo = { entity_id: string; name: string; node_id: number | null };
export type LockUser = {
  user_id: string;
  name: string;
  enabled: boolean;
  can_arm: boolean;
  can_disarm: boolean;
  area_limit: string[];
};
export type SyncStatus = 'in_sync' | 'different' | 'empty' | 'unknown' | 'user_disabled' | 'no_user';
export type SlotRow = {
  slot: number;
  in_use: boolean;
  readable: boolean;
  lock_name: string;
  user_id: string | null;
  match_user_id: string | null;
  status: SyncStatus | null;
};
export type LockRead = { entity_id: string; api: string; readable: boolean; slots: SlotRow[] };
export type WriteResult = LockLink & { result: 'ok' | 'error'; error?: string };
export type ImportResult = { slot: number; result: 'linked' | 'created' | 'error'; user_id?: string; name?: string; error?: string };

export const SYNC_LABELS: Record<SyncStatus, string> = {
  in_sync: 'Slot = User Code',
  different: 'Slot ≠ User Code',
  empty: 'Slot Empty',
  unknown: 'Not readable',
  user_disabled: 'User disabled, code still in slot',
  no_user: 'User removed',
};
export const SYNC_COLORS: Record<SyncStatus, string> = {
  in_sync: 'var(--success-color, #43a047)',
  different: 'var(--warning-color, #ffa600)',
  empty: 'var(--warning-color, #ffa600)',
  unknown: 'var(--secondary-text-color)',
  user_disabled: 'var(--error-color, #f44336)',
  no_user: 'var(--error-color, #f44336)',
};
export const API_LABELS: Record<string, string> = {
  code_slots: 'Code slots (User Code)',
  user_credential: 'Lock users (User Credential)',
  unknown: 'Codes not readable',
};

export const fetchLockSettings = (hass: HomeAssistant) =>
  hass.callWS<{ settings: LockSettings; locks: LockInfo[]; users: LockUser[] }>({ type: 'alarmo/ext/locks/get' });
export const readLock = (hass: HomeAssistant, entity_id: string) =>
  hass.callWS<LockRead>({ type: 'alarmo/ext/locks/read', entity_id });
export const linkSlot = (hass: HomeAssistant, entity_id: string, slot: number, user_id: string | null) =>
  hass.callWS<{ settings: LockSettings }>({ type: 'alarmo/ext/locks/link', entity_id, slot, user_id });
export const importSlots = (hass: HomeAssistant, entity_id: string, slots: { slot: number; name?: string }[]) =>
  hass.callWS<{ results: ImportResult[] }>({ type: 'alarmo/ext/locks/import', entity_id, slots });
export const saveUserActions = (hass: HomeAssistant, user_id: string, actions: UserActions) =>
  hass.callWS<{ settings: LockSettings }>({
    type: 'alarmo/ext/locks/actions',
    user_id,
    unlock: actions.unlock || null,
    lock: actions.lock || null,
  });
export const saveLockAction = (hass: HomeAssistant, entity_id: string, action: KeypadAction | null) =>
  hass.callWS<{ settings: LockSettings }>({ type: 'alarmo/ext/locks/actions', entity_id, lock: action });
export const pushCode = (hass: HomeAssistant, user_id: string, code: string) =>
  hass.callWS<{ results: WriteResult[] }>({ type: 'alarmo/ext/locks/push_code', user_id, code });
export const clearCodes = (hass: HomeAssistant, user_id: string, unlink = false) =>
  hass.callWS<{ results: WriteResult[] }>({ type: 'alarmo/ext/locks/clear', user_id, unlink });
export const fetchUserLocks = (hass: HomeAssistant, user_id: string) =>
  hass.callWS<{ links: (SlotRow & { entity_id: string })[]; actions: UserActions }>({ type: 'alarmo/ext/locks/user', user_id });

/** An action that does nothing. */
export const isEmptyAction = (a?: KeypadAction | null): boolean =>
  !a || (!a.house_mode && !Object.keys(a.targets || {}).length);

/** Copy of an action with one partition target set ('' = unchanged). */
export const withTarget = (a: KeypadAction | undefined, key: string, state: string): KeypadAction => {
  const targets = { ...((a && a.targets) || {}) };
  if (state) targets[key] = state;
  else delete targets[key];
  return { house_mode: (a && a.house_mode) || null, targets };
};

/** Short text for an action, e.g. "Stay · Garage: Away". */
export const describeAction = (
  a: KeypadAction | undefined,
  modeName: (id: string) => string,
  areaName: (id: string) => string,
  stateName: (s: string) => string
): string => {
  if (isEmptyAction(a)) return 'nothing';
  const parts: string[] = [];
  if (a!.house_mode) parts.push(`House Mode ${modeName(a!.house_mode)}`);
  Object.keys(a!.targets).forEach(k => parts.push(`${areaName(k)}: ${stateName(a!.targets[k])}`));
  return parts.join(' · ');
};

/** Slots worth importing: in use, readable, not linked yet. */
export const importable = (rows: SlotRow[]): SlotRow[] => rows.filter(r => r.in_use && r.readable && !r.user_id);

/** Permission problems of an action for a User (mirrors the backend check, for a warning in the UI).
 *  A House Mode only needs an enabled user (the House Mode's own "Lock keypad" source setting decides the rest);
 *  partition targets need Can arm / Can disarm and the partition limit. */
export const actionWarnings = (user: LockUser | undefined, a: KeypadAction | undefined): string[] => {
  if (!user || isEmptyAction(a)) return [];
  if (!user.enabled) return ['The user is disabled: nothing will happen.'];
  const out: string[] = [];
  Object.keys(a!.targets).forEach(k => {
    const st = a!.targets[k];
    if (user.area_limit.length && !user.area_limit.includes(k)) out.push('Partition target: partition not allowed for this user.');
    else if (st === 'disarmed' && !user.can_disarm) out.push('Partition target: the user may not disarm (Can disarm is off).');
    else if (st !== 'disarmed' && !user.can_arm) out.push('Partition target: the user may not arm (Can arm is off).');
  });
  return out.filter((v, i) => out.indexOf(v) === i);
};

export type LegacySlot = { node_id: number; entity_id: string | null; lock_name: string; slot: number; house_mode: string; enabled: boolean };
export const fetchLegacy = (hass: HomeAssistant) => hass.callWS<{ legacy: LegacySlot[] }>({ type: 'alarmo/ext/locks/legacy' });
export const migrateLegacy = (hass: HomeAssistant) =>
  hass.callWS<{ results: (LegacySlot & { result: 'moved' | 'error'; user_id?: string; error?: string })[] }>({ type: 'alarmo/ext/locks/migrate' });

export const revealCode = (hass: HomeAssistant, entity_id: string, slot: number) =>
  hass.callWS<{ code: string | null; readable: boolean }>({ type: 'alarmo/ext/locks/reveal', entity_id, slot });
export const setUserCode = (hass: HomeAssistant, user_id: string, code: string) =>
  hass.callWS<{ ok: boolean }>({ type: 'alarmo/ext/user/set_code', user_id, code });

/** Which permission a warning needs (for the "allow" button). */
export const neededPermission = (w: string): { can_arm?: boolean; can_disarm?: boolean } | null =>
  w.includes('may not disarm') ? { can_disarm: true } : w.includes('may not arm') ? { can_arm: true } : null;

export const syncUser = (hass: HomeAssistant, user_id: string, code?: string) =>
  hass.callWS<{ results: (LockLink & { result: 'ok' | 'already' | 'error'; error?: string })[]; needs_code: boolean }>({
    type: 'alarmo/ext/locks/sync_user',
    user_id,
    ...(code ? { code } : {}),
  });
export const revealUserCode = (hass: HomeAssistant, user_id: string) =>
  hass.callWS<{ code: string | null; readable: boolean }>({ type: 'alarmo/ext/user/reveal', user_id });
