// Panel tabs (ext layout): which view + section each tab shows, and which tab to
// highlight for a URL. Pure (no Lit/DOM) so it can be unit-tested with node --test.

export type TabId =
  | 'general'
  | 'house'
  | 'why'
  | 'activity'
  | 'house_actions'
  | 'partitions'
  | 'modes'
  | 'zones'
  | 'ha_zones'
  | 'zones_legacy'
  | 'codes'
  | 'notifications'
  | 'actions'
  | 'panel'
  | 'mirrors'
  | 'connections'
  | 'backup';

export type TabView = 'general' | 'house' | 'house_actions' | 'why' | 'activity' | 'sensor_table' | 'ha_zones' | 'sensors' | 'codes' | 'actions' | 'panel' | 'mirrors' | 'connections' | 'backup';

export type TabDef = { id: TabId; view: TabView; section?: string; titleKey: string };

export const TABS: TabDef[] = [
  { id: 'general', view: 'general', section: 'general', titleKey: 'panels.general.title' },
  { id: 'house', view: 'house', titleKey: 'panels.house.title' },
  { id: 'house_actions', view: 'house_actions', titleKey: 'panels.house_actions.title' },
  { id: 'why', view: 'why', titleKey: 'panels.why.title' },
  { id: 'partitions', view: 'general', section: 'partitions', titleKey: 'panels.partitions.title' },
  { id: 'zones', view: 'sensor_table', titleKey: 'panels.zones.title' },
  { id: 'zones_legacy', view: 'sensors', titleKey: 'panels.zones_legacy.title' },
  { id: 'codes', view: 'codes', titleKey: 'panels.users_codes.title' },
  { id: 'notifications', view: 'actions', section: 'notifications', titleKey: 'panels.notifications.title' },
  { id: 'actions', view: 'actions', section: 'actions', titleKey: 'panels.actions.title' },
  { id: 'panel', view: 'panel', titleKey: 'panels.panel.title' },
  { id: 'activity', view: 'activity', titleKey: 'panels.activity.title' },
  { id: 'backup', view: 'backup', titleKey: 'panels.backup.title' },
];

/** URL page segments kept from upstream / ext.1–3 that now belong to another tab. */
const ALIASES: Record<string, TabId> = {
  sensors: 'zones_legacy',
  sensor_table: 'zones',
  // ext.14: Zone Mirrors merged into the Physical Panel page
  mirrors: 'panel',
  // ext.16: Keypads merged into Users, Codes, Keypads
  connections: 'codes',
  // ext.18: Zone Actions → Zone Assignments (per zone) + Physical Panel (defaults)
  ha_zones: 'panel',
  // ext.20: Arm Modes merged into Partitions & Arm Modes
  modes: 'partitions',
};

/**
 * Tab to highlight (and render) for a URL like /alarmo/<page>/<subpage>/<params>.
 * Upstream editors keep their upstream URLs (e.g. general/edit_area/..., actions/new_notification).
 */
export const tabForPath = (
  page: string | undefined,
  subpage?: string,
  params: Record<string, string | undefined> = {}
): TabDef | undefined => {
  const p = page || 'general';
  if (p in ALIASES) return TABS.find(t => t.id === ALIASES[p]);
  if (p === 'general' && params.edit_area) return TABS.find(t => t.id === 'partitions');
  if (p === 'actions') {
    if (subpage === 'new_notification' || params.edit_notification) return TABS.find(t => t.id === 'notifications');
    return TABS.find(t => t.id === 'actions');
  }
  return TABS.find(t => t.id === p);
};

/** True when the URL is an editor/sub page rather than the tab's list page. */
export const isEditorPath = (subpage?: string, params: Record<string, string | undefined> = {}) =>
  !!subpage || Object.values(params).some(v => v !== undefined);
