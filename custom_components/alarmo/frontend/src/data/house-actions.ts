// House Mode Actions: native automations/scripts/scenes related to House Modes with HA labels "House Mode: <mode>".
import type { HomeAssistant } from '../types';

export type HaKind = 'automation' | 'script' | 'scene';
export type HouseActionItem = {
  entity_id: string;
  kind: HaKind;
  name: string;
  state: string;
  last_triggered: string | null;
  edit_id: string | null;
  editable: boolean;
  labels: string[];
  detected: { modes: string[]; any: boolean } | null;
};
export type HouseActionsInfo = { modes: string[]; modes_source: string; label_prefix: string; items: HouseActionItem[] };

export const fetchHouseActions = (hass: HomeAssistant) => hass.callWS<HouseActionsInfo>({ type: 'alarmo/ext/house_actions/get' });
export const setHouseActionModes = (hass: HomeAssistant, changes: { entity_id: string; modes: string[] }[]) =>
  hass.callWS<HouseActionsInfo & { done: string[]; errors: string[] }>({ type: 'alarmo/ext/house_actions/set', changes });

/** HA editor path for an item, or null when it cannot be edited there (e.g. YAML-only without an id). */
export const editorPath = (i: HouseActionItem): string | null =>
  i.edit_id ? `/config/${i.kind}/edit/${encodeURIComponent(i.edit_id)}` : null;

/** Labels the auto-detect suggests that are not applied yet. */
export const suggestedModes = (i: HouseActionItem): string[] =>
  i.detected ? i.detected.modes.filter(m => !i.labels.includes(m)) : [];

/** Items related to a mode: labelled with it (and, optionally, only suggested for it). */
export const itemsForMode = (items: HouseActionItem[], mode: string, withSuggested = false) =>
  items.filter(i => i.labels.includes(mode) || (withSuggested && suggestedModes(i).includes(mode)));

/** Filter for the overview. */
export const matchesFilter = (
  i: HouseActionItem,
  f: { search: string; kind: string; mode: string; show: 'related' | 'suggested' | 'all' }
): boolean => {
  if (f.kind && i.kind !== f.kind) return false;
  if (f.mode && !i.labels.includes(f.mode) && !suggestedModes(i).includes(f.mode)) return false;
  if (f.show === 'related' && !i.labels.length && !i.detected) return false;
  if (f.show === 'suggested' && !suggestedModes(i).length && !(i.detected && i.detected.any && !i.labels.length)) return false;
  const q = f.search.trim().toLowerCase();
  return !q || i.name.toLowerCase().includes(q) || i.entity_id.includes(q);
};
