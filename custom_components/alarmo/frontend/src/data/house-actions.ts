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
  /** from the automation's actions: how it changes the House Mode (null: it never does) */
  sets?: HouseSetter[] | null;
  /** its trigger kinds: time, presence, house_mode, alarm, event, sun, template, state, numeric_state, other */
  trigger_kinds?: string[];
};
export type HouseSetter = { mode: string | null; template: boolean; via: 'service' | 'select' | 'selector' | 'current'; source: string | null };
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

/** Automations whose actions set this House Mode (by name), with the setters that do. */
export const settingMode = (items: HouseActionItem[], mode: string) =>
  items
    .map(i => ({ item: i, sets: (i.sets || []).filter(x => x.mode && x.mode.toLowerCase() === mode.toLowerCase()) }))
    .filter(x => x.sets.length);

/** Automations that set the House Mode from a template (which mode is only known when they run). */
export const settingFromTemplate = (items: HouseActionItem[]) => items.filter(i => (i.sets || []).some(x => x.template));

/** The source a setter's request arrives with ("" when it bypasses House Modes). */
export const setterSource = (x: HouseSetter): string =>
  x.via === 'current' ? '' : x.via === 'service' && x.source ? x.source : 'automation';

const TRIGGER_TEXT: Record<string, string> = {
  time: 'a time', presence: 'presence', house_mode: 'a House Mode change', alarm: 'the alarm', event: 'an event',
  sun: 'the sun', template: 'a template', state: 'a state', numeric_state: 'a value', other: 'another trigger',
};

/** "on a time, presence · via alarmo.set_house_mode (schedule)" */
export const describeSetter = (i: HouseActionItem, x: HouseSetter): string => {
  const on = (i.trigger_kinds || []).map(k => TRIGGER_TEXT[k] || k).join(', ');
  const via =
    x.via === 'service' ? `alarmo.set_house_mode${x.source ? ` (${x.source})` : ''}`
    : x.via === 'select' ? 'the House Mode select'
    : x.via === 'selector' ? 'your selector'
    : 'the current-mode helper';
  return [on ? `on ${on}` : '', `via ${via}`].filter(Boolean).join(' · ');
};

/** Warnings for one setter of a mode (``enterSources``: the mode's Allowed Sources, May Enter). */
export const setterWarnings = (x: HouseSetter, modeName: string, enterSources: string[]): string[] => {
  const out: string[] = [];
  if (x.via === 'current')
    return [`It writes the current-mode helper directly, so House Modes never sees a request: nothing is armed and no
      script runs. Call alarmo.set_house_mode instead.`.replace(/\s+/g, ' ')];
  if (x.via === 'selector' || x.via === 'select')
    out.push('Its request arrives as "automation" (it writes the selector). Call alarmo.set_house_mode with a source.');
  else if (!x.source) out.push('It calls alarmo.set_house_mode without a source, so it arrives as "automation".');
  const src = setterSource(x);
  if (src && !enterSources.includes(src)) out.push(`${modeName} doesn't allow "${src}" to enter (Allowed Sources, May Enter).`);
  return out;
};
