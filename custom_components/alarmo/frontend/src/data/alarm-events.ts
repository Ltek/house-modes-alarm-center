// ext: Alarm Events run native scripts (one method, like House Mode actions). Events that run a scene (made by
// earlier builds) keep working. Upstream Alarmo events hold their own list of service calls; `planMigration` turns
// each such event into a native script, and `nativeActions` is what the event runs afterwards.
import type { AlarmoAutomation, AutomationAction, HomeAssistant } from '../types';

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
  | { kind: 'script'; event: AlarmoAutomation; scriptId: string; script: ScriptConfig; summary: string[]; reason: string }
  | { kind: 'skip'; event: AlarmoAutomation; reason: string };

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

/** What "Migrate" will do for each Alarm Event: each old-style event becomes one script. */
export const planMigration = (events: AlarmoAutomation[], takenScripts: Set<string>): MigrationPlan[] =>
  events
    .filter(e => e.type == ACTION)
    .map(event => {
      const name = event.name || 'Alarm Event';
      if (!isLegacyEvent(event)) return { kind: 'skip', event, reason: 'already runs scripts' } as MigrationPlan;
      return {
        kind: 'script',
        event,
        reason: '',
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
