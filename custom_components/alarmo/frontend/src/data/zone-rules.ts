// Zone rules: websocket calls + pure helpers (no Lit/DOM, unit-tested with node --test).
// Keep this file free of enums / TS-only runtime syntax so Node can strip types.
import type { HomeAssistant } from '../types';

/** Object.fromEntries without needing lib es2019 (upstream tsconfig targets es2017). */
export const fromPairs = <V>(pairs: [string, V][]): Record<string, V> => {
  const out: Record<string, V> = {};
  pairs.forEach(([k, v]) => (out[k] = v));
  return out;
};

export type RuleMatch = { labels: string[]; areas: string[]; floors: string[] };
export type ZoneRule = {
  id?: string;
  name: string;
  enabled: boolean;
  order: number;
  match: RuleMatch;
  set: Record<string, any>;
};
export type FieldSource = { kind: 'rule' | 'override' | 'manual'; rules: string[] };
export type ZoneConflict = { field: string; rules: string[]; values: any[]; reason?: string };
export type RulesPreview = {
  create: Record<string, any>[];
  update: { entity_id: string; changes: Record<string, any> }[];
  unmanaged: string[];
  conflicts: (ZoneConflict & { entity_id: string })[];
  needs_partition: string[];
  stale: { rule: string; name: string; kind: string; ref: string }[];
  zones: Record<string, { sources: Record<string, FieldSource>; conflicts: ZoneConflict[]; rules: string[]; managed: boolean }>;
  rule_names: Record<string, string>;
  total_changes: number;
  token: string;
};
export type RegistryNames = {
  labels: Record<string, string>;
  areas: Record<string, string>;
  floors: Record<string, string>;
};

export const listRules = (hass: HomeAssistant) =>
  hass.callWS<{ rules: ZoneRule[]; overrides: Record<string, Record<string, any>>; pending: number }>({
    type: 'alarmo/ext/rules/list',
  });
export const saveRule = (hass: HomeAssistant, rule: ZoneRule) =>
  hass.callWS<ZoneRule>({ type: 'alarmo/ext/rules/save', rule });
export const deleteRule = (hass: HomeAssistant, ruleId: string) =>
  hass.callWS({ type: 'alarmo/ext/rules/delete', rule_id: ruleId });
export const previewRules = (hass: HomeAssistant) =>
  hass.callWS<RulesPreview>({ type: 'alarmo/ext/rules/preview' });
export const applyRules = (hass: HomeAssistant, token: string) =>
  hass.callWS<{ backup: { name: string }; created: number; updated: number }>({
    type: 'alarmo/ext/rules/apply',
    token,
  });
export const clearOverride = (hass: HomeAssistant, entityId: string, field?: string) =>
  hass.callWS({ type: 'alarmo/ext/overrides/clear', entity_id: entityId, ...(field ? { field } : {}) });

/** Names of HA labels, areas and floors (for pickers and summaries). */
export const fetchRegistryNames = async (hass: HomeAssistant): Promise<RegistryNames> => {
  const [labels, areas, floors] = await Promise.all([
    hass.callWS<{ label_id: string; name: string }[]>({ type: 'config/label_registry/list' }),
    hass.callWS<{ area_id: string; name: string }[]>({ type: 'config/area_registry/list' }),
    hass.callWS<{ floor_id: string; name: string }[]>({ type: 'config/floor_registry/list' }),
  ]);
  const toMap = <T>(list: T[], id: keyof T) =>
    fromPairs(list.map(x => [String(x[id]), String((x as any).name)] as [string, string]));
  return { labels: toMap(labels, 'label_id'), areas: toMap(areas, 'area_id'), floors: toMap(floors, 'floor_id') };
};

// ------------------------------------------------------------------ pure helpers

export const SET_FIELD_LABELS: Record<string, string> = {
  partition: 'Partition',
  modes: 'Arm modes',
  type: 'Zone type',
  enabled: 'Enabled',
  always_on: 'Always on',
  use_entry_delay: 'Entry delay',
  use_exit_delay: 'Exit delay',
  allow_open: 'Allow open initially',
  arm_on_close: 'Arm after closing',
  trigger_unavailable: 'Trigger when unavailable',
  auto_bypass: 'Bypass automatically',
  auto_bypass_modes: 'Bypass in modes',
  entry_delay: 'Entry delay override (s)',
  delay_on: 'Delay on (s)',
};

/** rule field -> zone (sensor) field */
export const sensorField = (f: string) => (f === 'partition' ? 'area' : f);

export const specificity = (rule: Pick<ZoneRule, 'match'>) =>
  rule.match.labels.length + (rule.match.areas.length ? 1 : 0) + (rule.match.floors.length ? 1 : 0);

export const emptyRule = (): ZoneRule => ({
  name: '',
  enabled: true,
  order: 0,
  match: { labels: [], areas: [], floors: [] },
  set: {},
});

/** Problems that block saving (same checks the backend does, minus references). */
export const ruleErrors = (rule: ZoneRule): string[] => {
  const errors: string[] = [];
  if (!rule.name.trim()) errors.push('Give the rule a name.');
  if (!specificity(rule)) errors.push('Choose at least one label, area or floor to match.');
  if (!Object.keys(rule.set).length) errors.push('Choose at least one thing for the rule to set.');
  return errors;
};

const names = (ids: string[], map: Record<string, string>) => ids.map(id => map[id] || `${id} (missing)`);

/** "Label Perimeter and Interior · Area Kitchen or Garage · Floor Ground" */
export const describeMatch = (m: RuleMatch, reg: RegistryNames): string => {
  const parts: string[] = [];
  if (m.labels.length) parts.push(`Label ${names(m.labels, reg.labels).join(' and ')}`);
  if (m.areas.length) parts.push(`Area ${names(m.areas, reg.areas).join(' or ')}`);
  if (m.floors.length) parts.push(`Floor ${names(m.floors, reg.floors).join(' or ')}`);
  return parts.join(' · ');
};

/** "Partition Ground Floor · Modes Away, Home · Zone type door · Entry delay off" */
export const describeSet = (
  set: Record<string, any>,
  partitions: Record<string, string>,
  modeLabel: (m: string) => string = m => m
): string =>
  Object.entries(set)
    .map(([k, v]) => {
      const label = SET_FIELD_LABELS[k] || k;
      if (k === 'partition') return `${label} ${partitions[v] || v}`;
      if (Array.isArray(v)) return `${label} ${v.length ? v.map(modeLabel).join(', ') : 'none'}`;
      if (typeof v === 'boolean') return `${label} ${v ? 'on' : 'off'}`;
      return `${label} ${v === null ? 'default' : v}`;
    })
    .join(' · ');

/** Number of zones each rule currently matches (from a preview). */
export const matchCounts = (preview: Pick<RulesPreview, 'zones' | 'needs_partition'> | undefined) => {
  const counts: Record<string, number> = {};
  if (!preview) return counts;
  for (const z of Object.values(preview.zones)) for (const id of z.rules) counts[id] = (counts[id] || 0) + 1;
  return counts;
};

/** Toggle a value in a list (immutable). */
export const toggle = (list: string[], value: string, on: boolean) =>
  on ? (list.includes(value) ? list : [...list, value]) : list.filter(v => v !== value);

/** Starter templates. ids are filled in from the registries where possible. */
export const ruleTemplates = (
  reg: RegistryNames,
  firstPartition: string | undefined
): { name: string; rule: ZoneRule }[] => {
  const byName = (map: Record<string, string>, want: string) =>
    Object.keys(map).find(id => map[id].toLowerCase() === want) || '';
  const perimeter = byName(reg.labels, 'perimeter');
  const interior = byName(reg.labels, 'interior');
  const t = (name: string, match: Partial<RuleMatch>, set: Record<string, any>) => ({
    name,
    rule: { ...emptyRule(), name, match: { labels: [], areas: [], floors: [], ...match }, set },
  });
  return [
    t('Area → Partition', {}, firstPartition ? { partition: firstPartition } : {}),
    t(
      'Perimeter label → Stay/Night/Away/Vacation',
      { labels: perimeter ? [perimeter] : [] },
      { modes: ['armed_away', 'armed_home', 'armed_night', 'armed_vacation'] }
    ),
    t('Interior label → Away/Vacation', { labels: interior ? [interior] : [] }, { modes: ['armed_away', 'armed_vacation'] }),
  ];
};
