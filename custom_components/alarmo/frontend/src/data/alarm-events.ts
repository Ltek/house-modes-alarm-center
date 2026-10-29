// ext: Alarm Events run native scenes and scripts (one method, like House Mode steps).
// Upstream Alarmo events hold their own list of service calls; `planMigration` turns each such event into
// a native scene (fixed on/off-style states) or a native script (anything else), and `nativeActions`
// is what the event runs afterwards.
import type { AlarmoAutomation, AutomationAction, HomeAssistant } from '../types';
import type { SceneConfig } from './scenes';

const ACTION = 'action';

export const domainOf = (id: string | undefined) => String(id || '').split('.')[0];

/** The one action an Alarm Event uses to run a scene or a script. */
export const runAction = (entityId: string): AutomationAction => ({
  service: domainOf(entityId) == 'scene' ? 'scene.turn_on' : 'script.turn_on',
  entity_id: entityId,
});

export const nativeActions = (entityIds: string[]) => entityIds.map(runAction) as [AutomationAction, ...AutomationAction[]];

const isEmpty = (d: any) => !d || (typeof d == 'object' && !Object.keys(d).length);

/** True when the action runs a scene or a script (the new form). */
export const isNativeAction = (a: AutomationAction) => {
  const d = domainOf(a.entity_id);
  if (a.service == 'scene.turn_on') return d == 'scene' && isEmpty(a.data);
  if (a.service == 'script.turn_on') return d == 'script';
  return false;
};

export const isLegacyEvent = (a: AlarmoAutomation) =>
  a.type == ACTION && (a.actions || []).some(x => Object.keys(x || {}).length && !isNativeAction(x));

/** Entities (scene.*, script.*) a native event runs. */
export const eventTargets = (a: AlarmoAutomation) =>
  (a.actions || []).filter(isNativeAction).map(x => x.entity_id as string);

// state a scene stores for "<domain>.<service>" with no extra data
const SCENE_STATE: Record<string, Record<string, string>> = {
  light: { turn_on: 'on', turn_off: 'off' },
  switch: { turn_on: 'on', turn_off: 'off' },
  input_boolean: { turn_on: 'on', turn_off: 'off' },
  fan: { turn_on: 'on', turn_off: 'off' },
  humidifier: { turn_on: 'on', turn_off: 'off' },
  media_player: { turn_off: 'off' },
  climate: { turn_off: 'off' },
  lock: { lock: 'locked', unlock: 'unlocked' },
  cover: { open_cover: 'open', close_cover: 'closed' },
};

const entityList = (e: any): string[] =>
  (Array.isArray(e) ? e : String(e || '').split(',')).map((x: string) => String(x).trim()).filter(Boolean);

export type ScriptConfig = {
  alias: string;
  icon?: string;
  description?: string;
  mode: string;
  sequence: Record<string, any>[];
};

export type MigrationPlan =
  | { kind: 'scene'; event: AlarmoAutomation; scene: SceneConfig; summary: string[] }
  | { kind: 'script'; event: AlarmoAutomation; scriptId: string; script: ScriptConfig; summary: string[]; reason: string }
  | { kind: 'skip'; event: AlarmoAutomation; reason: string };

/** The scene's entity states when every action is a plain state change, else the reason it isn't. */
export const sceneEntities = (actions: AutomationAction[]): { entities?: Record<string, any>; reason?: string } => {
  const out: Record<string, any> = {};
  for (const a of actions) {
    if (!a || !Object.keys(a).length) continue;
    const [domain, service] = String(a.service || '').split('.');
    const ids = entityList(a.entity_id);
    if (!ids.length) return { reason: `${a.service || 'an action'} has no entity` };
    if (!isEmpty(a.data)) return { reason: `${a.service} has extra data` };
    for (const id of ids) {
      const state = SCENE_STATE[domainOf(id)]?.[service];
      if (domainOf(id) != domain || !state) return { reason: `${a.service} on ${id} is not a fixed state` };
      if (id in out) return { reason: `${id} is changed twice` };
      out[id] = state;
    }
  }
  if (!Object.keys(out).length) return { reason: 'no actions' };
  return { entities: out };
};

export const scriptSequence = (actions: AutomationAction[]) =>
  actions
    .filter(a => a && a.service)
    .map(a => {
      const step: Record<string, any> = { action: a.service };
      const ids = entityList(a.entity_id);
      if (ids.length) step.target = { entity_id: ids.length == 1 ? ids[0] : ids };
      if (!isEmpty(a.data)) step.data = a.data;
      return step;
    });

export const slug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'event';

/** A script object id that is not taken yet (`taken` = existing script object ids). */
export const freeScriptId = (name: string, taken: Set<string>) => {
  const base = `alarm_event_${slug(name)}`.slice(0, 60);
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}_${i}`;
  taken.add(id);
  return id;
};

const describe = (actions: AutomationAction[]) =>
  actions
    .filter(a => a && a.service)
    .map(a =>
      `${a.service} ${entityList(a.entity_id).join(', ')}${isEmpty(a.data) ? '' : ' ' + JSON.stringify(a.data)}`.trim()
    );

/** What "Migrate" will do for each Alarm Event. `newId` makes scene config ids. */
export const planMigration = (
  events: AlarmoAutomation[],
  takenScripts: Set<string>,
  newId: () => string
): MigrationPlan[] =>
  events
    .filter(e => e.type == ACTION)
    .map(event => {
      const name = event.name || 'Alarm Event';
      if (!isLegacyEvent(event)) return { kind: 'skip', event, reason: 'already runs scenes or scripts' } as MigrationPlan;
      const legacy = event.actions.filter(a => a && Object.keys(a).length && !isNativeAction(a));
      const keep = event.actions.filter(a => a && isNativeAction(a));
      const scene = keep.length ? { reason: 'mixes scenes or scripts with other actions' } : sceneEntities(legacy);
      if (scene.entities)
        return {
          kind: 'scene',
          event,
          scene: { id: newId(), name, icon: 'mdi:shield-home-outline', entities: scene.entities },
          summary: Object.entries(scene.entities).map(([k, v]) => `${k}: ${v}`),
        } as MigrationPlan;
      return {
        kind: 'script',
        event,
        reason: scene.reason || '',
        scriptId: freeScriptId(name, takenScripts),
        script: {
          alias: name,
          icon: 'mdi:shield-home-outline',
          description: `Migrated from the Alarm Event "${name}". Variables: event, area, arm_mode.`,
          mode: 'queued',
          sequence: scriptSequence(event.actions),
        },
        summary: describe(event.actions),
      } as MigrationPlan;
    });

// ------------------------------------------------------------------ HA script config API

export const saveScript = async (hass: HomeAssistant, id: string, cfg: ScriptConfig) => {
  await hass.callApi('POST', `config/script/config/${id}`, cfg);
  await hass.callService('script', 'reload', {}).catch(() => undefined);
};

export const existingScriptIds = (hass: HomeAssistant) =>
  new Set(Object.keys(hass.states).filter(e => e.startsWith('script.')).map(e => e.slice(7)));
