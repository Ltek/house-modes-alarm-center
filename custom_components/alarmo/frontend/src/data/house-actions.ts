// What runs on each House Mode: native automations that react to a House Mode change (read from their triggers).
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
  /** from the automation's triggers: entering these modes, leaving these, or any change */
  reacts: { to: string[]; from: string[]; any: boolean } | null;
};
export type HouseActionsInfo = { modes: string[]; modes_source: string; label_prefix: string; items: HouseActionItem[] };

export const fetchHouseActions = (hass: HomeAssistant) => hass.callWS<HouseActionsInfo>({ type: 'alarmo/ext/house_actions/get' });
export const setHouseActionModes = (hass: HomeAssistant, changes: { entity_id: string; modes: string[] }[]) =>
  hass.callWS<HouseActionsInfo & { done: string[]; errors: string[] }>({ type: 'alarmo/ext/house_actions/set', changes });

/** HA editor path for an item, or null when it cannot be edited there (e.g. YAML-only without an id). */
export const editorPath = (i: HouseActionItem): string | null =>
  i.edit_id ? `/config/${i.kind}/edit/${encodeURIComponent(i.edit_id)}` : null;

/** Automations that react to a House Mode change, from their triggers: entering the mode, leaving it, or any change. */
export const reactingTo = (items: HouseActionItem[], mode: string) => ({
  enter: items.filter(i => i.reacts && i.reacts.to.includes(mode)),
  leave: items.filter(i => i.reacts && i.reacts.from.includes(mode) && !i.reacts.to.includes(mode)),
});

/** Automations that react to every House Mode change (no specific mode in the trigger). */
export const reactingToAny = (items: HouseActionItem[]) => items.filter(i => i.reacts && i.reacts.any);
