// Zone table: every zone x partition x arm mode in one grid. Edits are drafts
// (marked per cell) until Save, which backs up first and then applies the batch.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';
import {
  mdiChevronDown,
  mdiChevronRight,
  mdiMinusCircle,
  mdiPencilCircle,
  mdiPlusCircle,
  mdiRestore,
  mdiAutoFix,
  mdiAccountEdit,
} from '@mdi/js';
import { SubscribeMixin } from '../../subscribe-mixin';
import { AlarmoArea, Dictionary, EArmModes, HomeAssistant, SensorGroup } from '../../types';
import { Path } from '../../common/navigation';
import { ESensorTypes } from '../../const';
import { computeName } from '../../helpers';
import { localize } from '../../../localize/localize';
import { fetchAreas, fetchSensorGroups, fetchSensors } from '../../data/websockets';
import { defaultSensorConfig, sensorConfigByType } from '../../data/sensors';
import { DraftStore, SensorRecord } from '../../data/draft-store';
import { applySensorChanges, toast, wsErrorMessage } from '../../data/ext-websockets';
import { extStyles } from './ext-styles';
import './slider-field';
import { blocksModes, liveState } from '../../data/status';
import { stateCell } from './state-cell';
import { PanelInfo, PanelSettings, fetchPanel, mirrorId, savePanel } from '../../data/panel';
import { entityBadge, lockToggle, sectionHead } from './page-intro';
import { ZONE_HELP, helpText } from '../../data/zone-help';
import './add-sensors-dialog';
import './rules-card';
import './rules-preview-dialog';
import {
  RegistryNames,
  RulesPreview,
  ZoneRule,
  clearOverride,
  fetchRegistryNames,
  fromPairs,
  listRules,
  previewRules,
} from '../../data/zone-rules';

const DRAFT_KEY = 'alarmo-ext-sensor-table-draft';
const ALL_MODES: EArmModes[] = [
  EArmModes.ArmedAway,
  EArmModes.ArmedHome,
  EArmModes.ArmedNight,
  EArmModes.ArmedVacation,
  EArmModes.ArmedCustom,
];
const SENSOR_TYPES = Object.values(ESensorTypes) as string[];
// options edited in the expanded row (two-column zone editor)
const DETAIL_BOOLS: [string, string][] = [
  ['enabled', 'Enabled'],
  ['always_on', 'Always on'],
  ['use_entry_delay', 'Use entry delay'],
  ['use_exit_delay', 'Use exit delay'],
  ['allow_open', 'Allow open initially'],
  ['arm_on_close', 'Arm after closing'],
  ['trigger_unavailable', 'Trigger when unavailable'],
  ['auto_bypass', 'Auto-bypass'],
];
// icons in the compact "Options" column
const OPTION_ICONS: [string, string, string][] = [
  ['always_on', 'mdi:shield-alert', 'Always on'],
  ['auto_bypass', 'mdi:debug-step-over', 'Auto-bypass'],
  ['allow_open', 'mdi:door-open', 'Allow open initially'],
  ['arm_on_close', 'mdi:door-closed-lock', 'Arm after closing'],
  ['trigger_unavailable', 'mdi:lan-disconnect', 'Trigger when unavailable'],
];
const TRIP_LABEL: Record<string, string> = { panel: 'set off the alarm', notify: 'notify only', none: 'nothing extra' };
const TRIP_ICON: Record<string, string> = { panel: 'mdi:bullhorn', notify: 'mdi:bell-outline', none: 'mdi:bell-off-outline' };
const NO_DELAY_ICON: [string, string] = ['mdi:timer-off-outline', 'No entry delay (instant)'];
const MODE_ICONS: Record<string, string> = {
  armed_away: 'mdi:lock',
  armed_home: 'mdi:home',
  armed_night: 'mdi:weather-night',
  armed_vacation: 'mdi:airplane',
  armed_custom_bypass: 'mdi:shield',
};
const TYPE_COLORS: Record<string, string> = {
  door: '#1e88e5',
  window: '#00897b',
  motion: '#8e24aa',
  tamper: '#6d4c41',
  environmental: '#e53935',
  other: '#757575',
};
// groups of settings for "Copy settings to…"
const COPY_GROUPS: { id: string; label: string; fields: string[] }[] = [
  { id: 'modes', label: 'Arm Modes', fields: ['modes'] },
  { id: 'type', label: 'Zone type', fields: ['type'] },
  { id: 'area', label: 'Partition', fields: ['area'] },
  {
    id: 'options',
    label: 'Options and delays',
    fields: ['always_on', 'use_entry_delay', 'use_exit_delay', 'allow_open', 'arm_on_close', 'trigger_unavailable', 'auto_bypass', 'auto_bypass_modes', 'entry_delay', 'delay_on'],
  },
];

type Filters = { search: string; area: string; mode: string; type: string; status: string };

@customElement('alarm-view-sensor-table')
export class AlarmViewSensorTable extends SubscribeMixin(LitElement) {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private areas: Dictionary<AlarmoArea> = {};
  @state() private groups: Dictionary<SensorGroup> = {};
  @state() private loaded = false;
  @state() private selection: string[] = [];
  @state() private expanded: string[] = [];
  @state() private filters: Filters = { search: '', area: '', mode: '', type: '', status: '' };
  @state() private saving = false;
  @state() private error = '';
  @state() private restoredCount = 0;
  @state() private showAdd = false;
  /** zone whose settings are being copied, and which setting groups */
  @state() private copyFrom: string | null = null;
  /** physical panel settings: which zones the panel watches, and the per-zone trip action (zone_trip) */
  @state() private panel?: PanelInfo;
  @state() private tripDraft: Record<string, string> = {};
  @state() private copyGroups: string[] = ['modes', 'options'];
  @state() private rev = 0;
  @state() private rules: ZoneRule[] = [];
  @state() private rulesPreview?: RulesPreview;
  @state() private registry: RegistryNames = { labels: {}, areas: {}, floors: {} };
  @state() private showRulesPreview = false;
  @state() private showHelp = false;
  /** settings can only be changed after Unlock (prevents accidental edits) */
  @state() private locked = true;

  private draft = new DraftStore();
  private bulkMode = EArmModes.ArmedAway as string;

  private beforeUnload = (ev: BeforeUnloadEvent) => {
    if (!this.draft.isDirty()) return;
    ev.preventDefault();
    ev.returnValue = '';
  };

  /** Used by the panel to warn before switching tabs. */
  public hasUnsavedChanges(): boolean {
    return this.draft.isDirty();
  }

  firstUpdated() {
    // links from the Partitions / Arm Modes cards: /alarmo/zones/filter/area/<id>/mode/<mode>
    const f = this.path?.filter || {};
    if (f.area || f.mode) this.filters = { ...this.filters, area: f.area || '', mode: f.mode || '' };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeunload', this.beforeUnload);
  }

  disconnectedCallback() {
    window.removeEventListener('beforeunload', this.beforeUnload);
    super.disconnectedCallback();
  }

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this.fetchData();
    return [this.hass.connection.subscribeMessage(() => this.fetchData(), { type: 'alarmo_config_updated' })];
  }

  private async fetchData() {
    if (!this.hass) return;
    try {
      const [sensors, areas, groups] = await Promise.all([
        fetchSensors(this.hass),
        fetchAreas(this.hass),
        fetchSensorGroups(this.hass),
      ]);
      this.areas = areas;
      this.groups = groups;
      this.draft.setSaved(sensors as unknown as Record<string, SensorRecord>);
      await this.fetchRules();
      await this.fetchPanelInfo();
      if (!this.loaded) {
        this.loaded = true;
        this.restoreDraft();
      }
      this.rev++;
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async fetchPanelInfo() {
    try {
      const keepEdits = this.panel ? this.tripChanges() : 0;
      this.panel = await fetchPanel(this.hass);
      if (!keepEdits) this.tripDraft = { ...this.panel.settings.zone_trip };
    } catch (_e) {
      this.panel = undefined; // panel link features unavailable
    }
  }

  /** zones the physical panel watches itself (its zones and their mirrors) */
  private panelWatched(id: string) {
    return !!this.panel && this.panel.panels.some(p => p.zones.some(z => z.entity_id === id || mirrorId(z.entity_id) === id));
  }

  private tripChanges() {
    if (!this.panel) return 0;
    const a = this.panel.settings.zone_trip;
    const keys = new Set([...Object.keys(a), ...Object.keys(this.tripDraft)]);
    return [...keys].filter(k => (a[k] || null) !== (this.tripDraft[k] || null)).length;
  }

  private tripDefault() {
    return this.panel && this.panel.settings.monitored ? 'notify' : 'panel';
  }

  private setTrip(id: string, value: string) {
    const d = { ...this.tripDraft };
    if (value === 'default') delete d[id];
    else d[id] = value;
    this.tripDraft = d;
  }

  private async fetchRules() {
    try {
      const [list, preview, registry] = await Promise.all([
        listRules(this.hass),
        previewRules(this.hass),
        fetchRegistryNames(this.hass),
      ]);
      this.rules = list.rules;
      this.rulesPreview = preview;
      this.registry = registry;
    } catch (err) {
      // rules are optional: the table still works without them
      this.rulesPreview = undefined;
      this.error = `Zone rules unavailable: ${wsErrorMessage(err)}`;
    }
  }

  // ------------------------------------------------------------ rule sources

  private source(id: string, field: string) {
    return this.rulesPreview?.zones[id]?.sources[field];
  }

  private conflict(id: string, field: string) {
    return (this.rulesPreview?.zones[id]?.conflicts || []).find(c => c.field === field);
  }

  private ruleNames(ids: string[]) {
    return ids.map(i => this.rulesPreview?.rule_names[i] || i).join(', ');
  }

  /** Small icon: set by rule / manual override (click to clear) / conflict outline. */
  private sourceMark(id: string, field: string) {
    const src = this.source(id, field);
    if (!src || this.draft.rowStatus(id) === 'new') return nothing;
    if (src.kind === 'override')
      return html`<ha-svg-icon
        class="src override"
        role="button"
        tabindex="0"
        .path=${mdiAccountEdit}
        title=${`Manual override${src.rules.length ? ` of rule ${this.ruleNames(src.rules)}` : ''} — click to clear (the rule value comes back on the next Apply)`}
        @click=${() => this.clearOverride(id, field)}
        @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.clearOverride(id, field)}
      ></ha-svg-icon>`;
    return html`<ha-svg-icon class="src rule" .path=${mdiAutoFix} title=${`Set by rule: ${this.ruleNames(src.rules)}`}></ha-svg-icon>`;
  }

  private srcClass(id: string, field: string) {
    return this.conflict(id, field) ? 'conflict' : '';
  }

  private async clearOverride(id: string, field: string) {
    if (!window.confirm(`Clear the manual override of "${field}" for ${this.name(id)}? The rule value is applied on the next Apply.`))
      return;
    try {
      await clearOverride(this.hass, id, field);
      await this.fetchRules();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private renderRulesBar() {
    const p = this.rulesPreview;
    if (!p || (!p.total_changes && !p.conflicts.length && !p.needs_partition.length)) return nothing;
    const parts = [
      p.total_changes ? `${p.total_changes} pending rule change${p.total_changes === 1 ? '' : 's'}` : '',
      p.conflicts.length ? `${p.conflicts.length} conflict${p.conflicts.length === 1 ? '' : 's'}` : '',
      p.needs_partition.length ? `${p.needs_partition.length} matched without a partition` : '',
    ].filter(Boolean);
    return html`
      <div class="notice ${p.conflicts.length ? 'error' : 'warn'}" role="region" aria-label="Pending rule changes">
        <ha-svg-icon .path=${mdiAutoFix} style="width:18px;height:18px;vertical-align:middle"></ha-svg-icon>
        Zone rules: ${parts.join(' · ')}.
        <button class="link" @click=${() => (this.showRulesPreview = true)}>Preview${p.total_changes ? ' & apply' : ''}</button>
        ${p.conflicts.length
          ? html`<div style="margin-top:4px">
              ${p.conflicts.map(c => html`<div>⚠ ${this.name(c.entity_id)} — <code>${c.field}</code>: ${c.reason || `rules ${this.ruleNames(c.rules)} disagree`}</div>`)}
            </div>`
          : nothing}
      </div>
    `;
  }

  // ------------------------------------------------------------ draft persistence

  private restoreDraft() {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      this.draft.loadSnapshot(JSON.parse(raw));
      this.restoredCount = this.draft.changeCount();
      if (!this.restoredCount) window.sessionStorage.removeItem(DRAFT_KEY);
    } catch (_e) {
      window.sessionStorage.removeItem(DRAFT_KEY);
    }
  }

  private persist() {
    try {
      if (this.draft.isDirty()) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(this.draft.snapshot()));
      else window.sessionStorage.removeItem(DRAFT_KEY);
    } catch (_e) {
      /* storage unavailable: drafts just won't survive navigation */
    }
  }

  private edit(fn: () => void) {
    fn();
    this.persist();
    this.rev++;
  }

  // ------------------------------------------------------------ helpers

  private visibleModes(): EArmModes[] {
    const used = new Set<string>();
    Object.values(this.areas).forEach(a =>
      Object.entries(a.modes || {}).forEach(([m, c]) => c && c.enabled && used.add(m))
    );
    this.draft.ids().forEach(id => (this.draft.get(id)?.modes || []).forEach((m: string) => used.add(m)));
    return ALL_MODES.filter(m => used.has(m));
  }

  private modeEnabledInArea(area: string | undefined, mode: string) {
    const a = area ? this.areas[area] : undefined;
    return !!a && !!a.modes && !!a.modes[mode] && a.modes[mode].enabled;
  }

  private name(id: string) {
    const st = this.hass.states[id];
    return st ? computeName(st) : id;
  }

  private modeLabel(mode: string) {
    const base = localize(`common.modes_short.${mode}`, this.hass.language) || mode;
    // industry name for Home is "Stay" (Vista, DSC, ...)
    return mode === EArmModes.ArmedHome && base === 'Home' ? 'Home (Stay)' : base;
  }

  private typeLabel(type: string) {
    return (
      localize(`panels.sensors.cards.editor.fields.device_type.choose.${type}.name`, this.hass.language) || type
    );
  }

  private rows(): string[] {
    const f = this.filters;
    const q = f.search.trim().toLowerCase();
    return this.draft
      .ids()
      .filter(id => {
        const s = this.draft.get(id)!;
        if (q && !id.toLowerCase().includes(q) && !this.name(id).toLowerCase().includes(q)) return false;
        if (f.area === '__none__') {
          if (s.area && this.areas[s.area]) return false;
        } else if (f.area && s.area !== f.area) return false;
        if (f.mode === '__none__') {
          if ((s.modes || []).length || s.always_on) return false;
        } else if (f.mode && !(s.modes || []).includes(f.mode)) return false;
        if (f.type && s.type !== f.type) return false;
        if (f.status === 'unsaved' && this.draft.rowStatus(id) === 'unchanged') return false;
        if (f.status === 'disabled' && s.enabled !== false) return false;
        if (f.status === 'missing' && this.hass.states[id]) return false;
        return true;
      })
      .sort((a, b) => {
        const aa = this.areas[this.draft.get(a)!.area]?.name || '~';
        const bb = this.areas[this.draft.get(b)!.area]?.name || '~';
        return aa.localeCompare(bb) || this.name(a).localeCompare(this.name(b));
      });
  }

  // ------------------------------------------------------------ render

  render() {
    if (!this.hass) return nothing;
    if (!this.loaded)
      return html`
        <ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>
      `;
    void this.rev;
    const rows = this.rows();
    const modes = this.visibleModes();
    const count = this.draft.changeCount() + this.tripChanges();
    const allSelected = rows.length > 0 && rows.every(r => this.selection.includes(r));

    const partitionNames = fromPairs(Object.values(this.areas).map(a => [a.area_id, a.name] as [string, string]));
    return html`
      <alarmo-ext-rules-card
        .hass=${this.hass}
        .rules=${this.rules}
        .preview=${this.rulesPreview}
        .registry=${this.registry}
        .partitions=${this.areas}
        @rules-changed=${() => this.fetchRules()}
      ></alarmo-ext-rules-card>
      ${this.showRulesPreview && this.rulesPreview
        ? html`
            <alarmo-ext-rules-preview
              .hass=${this.hass}
              .preview=${this.rulesPreview}
              .current=${fromPairs(this.draft.ids().filter(i => this.draft.isSaved(i)).map(i => [i, this.draft.get(i)!] as [string, SensorRecord]))}
              .partitionNames=${partitionNames}
              .blockedReason=${count ? 'Save or discard your unsaved changes on this page first.' : ''}
              @close=${() => (this.showRulesPreview = false)}
              @applied=${this.rulesApplied}
            ></alarmo-ext-rules-preview>
          `
        : nothing}
      <ha-card>
        ${sectionHead('Zone Assignments', 'settings')}
        <div class="card-content desc">
          <p><strong>The main place for zones.</strong> Every zone Alarmo watches, with its partition, the Arm Modes it
            is active in, its zone type and its options. Hover a column title for help; click a zone's icon for its details.</p>
          <p><strong>Unlock to edit</strong> (button above the table). Changes stay drafts until you click Save — a
            backup is made first. Edited zones get a yellow icon, new ones green, removed ones red.</p>
          <ul>
            <li>Add zones with <em>Add zones</em>, or from your physical panel on the Physical Panel tab.</li>
            <li>What a zone that only Home Assistant watches does when it trips: open the zone (›) → <em>When tripped</em>; the default is on <a href="/alarmo/panel">Physical Panel</a>.</li>
            <li>Mirrors of physical panel zones: <a href="/alarmo/panel">Physical Panel → Panel zones</a>.</li>
          </ul>
        </div>
        ${this.renderRulesBar()}
        ${this.restoredCount
          ? html`
              <div class="notice warn">
                Restored ${this.restoredCount} unsaved change${this.restoredCount === 1 ? '' : 's'} from your last
                visit. Save or discard them below.
                <button class="link" @click=${() => (this.restoredCount = 0)}>Dismiss</button>
              </div>
            `
          : nothing}
        ${this.error
          ? html`
              <div class="notice error" style="white-space:pre-line">
                ${this.error}
                <button class="link" @click=${() => (this.error = '')}>Dismiss</button>
              </div>
            `
          : nothing}
        <div class="toolbar">
          ${lockToggle(this.locked, () => {
            this.locked = !this.locked;
            if (this.locked) this.selection = [];
          })}
          <ha-button @click=${() => (this.showAdd = true)}>
            <ha-svg-icon slot="start" .path=${mdiPlusCircle}></ha-svg-icon>Add zones
          </ha-button>
          <span class="grow"></span>
          <span class="secondary" style="display:inline">${rows.length} of ${this.draft.ids().length} zones shown</span>
        </div>
        ${this.renderFilters()} ${this.showHelp ? this.renderHelp() : nothing}
        ${this.selection.length && !this.locked ? this.renderBulkBar() : nothing}
        <div class="table-wrap">
          <table class="full">
            <thead>
              <tr>
                <th class="c">
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    ?disabled=${this.locked}
                    .checked=${allSelected}
                    @change=${(e: any) => this.selectRows(rows, e.target.checked)}
                  />
                </th>
                <th class="icon"></th>
                <th class="help" title=${helpText('zone')}>Zone</th>
                <th class="help c" title="Live state of the zone; red when it blocks arming">State</th>
                <th class="help" title=${helpText('type')}>Type</th>
                ${this.multiPartition ? html`<th class="help" title=${helpText('area')}>Partition</th>` : nothing}
                ${modes.map(m => html`<th class="c mode help" title=${`${this.modeLabel(m)} — ${helpText('modes')}`}><ha-icon icon=${MODE_ICONS[m]}></ha-icon></th>`)}
                <th class="help" title="Options: hover an icon; edit them in the expanded row (›)">Options</th>
                <th></th>
                <th class="fill" aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(id => this.renderRow(id, modes))}
            </tbody>
          </table>
          ${rows.length
            ? nothing
            : html`<div class="empty">${this.draft.ids().length ? 'No zones match the filters.' : 'No zones configured yet.'}</div>`}
        </div>

      </ha-card>
      ${count ? this.renderSaveBar(count) : nothing}
      ${this.showAdd
        ? html`
            <alarmo-ext-add-sensors
              .hass=${this.hass}
              .areas=${this.areas}
              .exclude=${this.draft.ids()}
              .defaultArea=${this.filters.area && this.areas[this.filters.area] ? this.filters.area : ''}
              @close=${() => (this.showAdd = false)}
              @sensors-picked=${this.addPicked}
            ></alarmo-ext-add-sensors>
          `
        : nothing}
    `;
  }

  private renderFilters() {
    const f = this.filters;
    const set = (key: keyof Filters) => (e: any) => (this.filters = { ...this.filters, [key]: e.target.value });
    return html`
      <div class="toolbar">
        <input type="search" placeholder="Search zones" aria-label="Search zones" .value=${f.search} @input=${set('search')} />
        <select aria-label="Filter by partition" @change=${set('area')}>
          <option value="" ?selected=${!f.area}>All partitions</option>
          ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${f.area === a.area_id}>${a.name}</option>`)}
          <option value="__none__" ?selected=${f.area === '__none__'}>No / unknown partition</option>
        </select>
        <select aria-label="Filter by arm mode" @change=${set('mode')}>
          <option value="" ?selected=${!f.mode}>All arm modes</option>
          ${ALL_MODES.map(m => html`<option value=${m} ?selected=${f.mode === m}>${this.modeLabel(m)}</option>`)}
          <option value="__none__" ?selected=${f.mode === '__none__'}>No arm mode (inactive)</option>
        </select>
        <select aria-label="Filter by zone type" @change=${set('type')}>
          <option value="" ?selected=${!f.type}>All zone types</option>
          ${SENSOR_TYPES.map(t => html`<option value=${t} ?selected=${f.type === t}>${this.typeLabel(t)}</option>`)}
        </select>
        <select aria-label="Filter by status" @change=${set('status')}>
          <option value="" ?selected=${!f.status}>Any status</option>
          <option value="unsaved" ?selected=${f.status === 'unsaved'}>Unsaved changes</option>
          <option value="disabled" ?selected=${f.status === 'disabled'}>Disabled</option>
          <option value="missing" ?selected=${f.status === 'missing'}>Entity missing in HA</option>
        </select>
        <span class="grow"></span>
        <button class="link" aria-expanded=${this.showHelp} @click=${() => (this.showHelp = !this.showHelp)}>
          ⓘ ${this.showHelp ? 'Hide help' : 'What do these columns mean?'}
        </button>
        ${f.search || f.area || f.mode || f.type || f.status
          ? html`<button class="link" @click=${() => (this.filters = { search: '', area: '', mode: '', type: '', status: '' })}>Clear filters</button>`
          : nothing}
      </div>
    `;
  }

  private renderHelp() {
    const order = [
      'modes',
      'area',
      'type',
      'enabled',
      'always_on',
      'use_entry_delay',
      'use_exit_delay',
      'auto_bypass',
      'auto_bypass_modes',
      'allow_open',
      'arm_on_close',
      'trigger_unavailable',
      'entry_delay',
      'delay_on',
      'group',
    ];
    return html`
      <div class="notice help-panel" role="region" aria-label="Help">
        <p style="margin:0 0 6px">
          Hover over a column title, checkbox or option to see this text. Options without a column are in the
          expanded row: click › at the end of a zone's row.
        </p>
        <dl class="help-rows">
          ${order.map(k => html`<div><dt>${ZONE_HELP[k].title}</dt><dd>${ZONE_HELP[k].text}</dd></div>`)}
        </dl>
      </div>
    `;
  }

  private renderBulkBar() {
    const sel = this.selection;
    return html`
      <div class="bulkbar" role="toolbar" aria-label="Bulk actions">
        <strong>${sel.length} selected</strong>
        <select aria-label="Set partition for selected" @change=${(e: any) => this.bulkSet('area', e)}>
          <option value="">Set partition…</option>
          ${Object.values(this.areas).map(a => html`<option value=${a.area_id}>${a.name}</option>`)}
        </select>
        <select aria-label="Set zone type for selected" @change=${(e: any) => this.bulkSet('type', e)}>
          <option value="">Set zone type…</option>
          ${SENSOR_TYPES.map(t => html`<option value=${t}>${this.typeLabel(t)}</option>`)}
        </select>
        <select aria-label="Arm mode for selected" @change=${(e: any) => (this.bulkMode = e.target.value)}>
          ${ALL_MODES.map(m => html`<option value=${m} ?selected=${this.bulkMode === m}>${this.modeLabel(m)}</option>`)}
        </select>
        <ha-button appearance="plain" @click=${() => this.edit(() => this.draft.toggleModeMany(sel, this.bulkMode, true))}>
          Add mode
        </ha-button>
        <ha-button appearance="plain" @click=${() => this.edit(() => this.draft.toggleModeMany(sel, this.bulkMode, false))}>
          Remove mode
        </ha-button>
        <ha-button appearance="plain" @click=${() => this.edit(() => this.draft.setFieldMany(sel, 'enabled', true))}>
          Enable
        </ha-button>
        <ha-button appearance="plain" @click=${() => this.edit(() => this.draft.setFieldMany(sel, 'enabled', false))}>
          Disable
        </ha-button>
        <ha-button appearance="plain" variant="danger" @click=${() => this.edit(() => this.draft.removeMany(sel))}>
          Delete from Alarmo
        </ha-button>
        <button class="link" @click=${() => (this.selection = [])}>Clear selection</button>
      </div>
    `;
  }

  private cellClass(id: string, field: string, extra = '') {
    return `${extra} ${this.draft.isFieldChanged(id, field) ? 'changed' : ''}`;
  }

  private mark(changed: boolean) {
    return changed
      ? html`<ha-svg-icon class="mark" .path=${mdiPencilCircle} title="Unsaved change"></ha-svg-icon>`
      : nothing;
  }

  /** more than one partition → show the Partition column */
  private get multiPartition() {
    return Object.keys(this.areas).length > 1;
  }

  private chip(label: string, color: string, changed = false) {
    return html`<span class="chip-cell ${changed ? 'changed' : ''}" style=${`--chip:${color}`}>${label}</span>`;
  }

  /** Live state; open zones that block arming show the Arm Modes they block (Alarmo's readiness rules). */
  private liveCell(id: string, s: SensorRecord) {
    const live = liveState(this.hass.states[id]?.state);
    const areaModes = ALL_MODES.filter(m => this.modeEnabledInArea(s.area, m));
    const blocks = blocksModes(s as any, live, areaModes);
    return stateCell(live, {
      blocks: blocks.length > 0,
      title: blocks.length ? `Open: blocks arming ${blocks.map(m => this.modeLabel(m)).join(', ')} (see Arm Check)` : live,
    });
  }

  private renderRow(id: string, modes: EArmModes[]) {
    const s = this.draft.get(id)!;
    const status = this.draft.rowStatus(id);
    const removed = status === 'removed' || this.locked;
    const open = this.expanded.includes(id);
    const areaKnown = s.area && this.areas[s.area];
    const disabled = s.enabled === false;
    const typeChanged = this.draft.isFieldChanged(id, 'type');
    const areaChanged = this.draft.isFieldChanged(id, 'area');
    const optionIcons = OPTION_ICONS.filter(([f]) => s[f]);
    const instant = !s.always_on && s.use_entry_delay === false;
    const tripChanged = !!this.panel && (this.panel.settings.zone_trip[id] || null) !== (this.tripDraft[id] || null);
    const optsChanged = tripChanged || [...OPTION_ICONS.map(o => o[0]), 'use_entry_delay', 'use_exit_delay', 'entry_delay', 'delay_on', 'auto_bypass_modes', 'group', 'enabled'].some(f =>
      this.draft.isFieldChanged(id, f)
    );
    const colspan = modes.length + (this.multiPartition ? 9 : 8);

    return html`
      <tr class="status-${status} ${disabled ? 'zone-disabled' : ''}">
        <td class="c">
          <input
            type="checkbox"
            aria-label=${`Select ${this.name(id)}`}
            ?disabled=${this.locked}
            .checked=${this.selection.includes(id)}
            @change=${(e: any) => this.selectRows([id], e.target.checked)}
          />
        </td>
        <td class="icon">
          <span class="icon-stack">
            ${entityBadge(this.hass, id, status)}
            ${disabled || !this.locked
              ? html`<button
                  class="eye ${disabled ? 'off' : ''}"
                  ?disabled=${removed}
                  title=${disabled ? 'Disabled — click to enable (unlock first)' : 'Enabled — click to disable'}
                  aria-label=${disabled ? `Enable ${this.name(id)}` : `Disable ${this.name(id)}`}
                  @click=${() => this.setField(id, 'enabled', disabled)}
                ><ha-icon icon=${disabled ? 'mdi:eye-off' : 'mdi:eye-outline'}></ha-icon></button>`
              : nothing}
          </span>
        </td>
        <td class="name">
          ${this.name(id)}
          ${this.source(id, 'modes') ? html`<span class="modes-src" title=${this.modesTitle(id)}>modes ${this.sourceMark(id, 'modes')}</span>` : nothing}
          <span class="secondary">${id}${this.hass.states[id] ? '' : ' · not found in Home Assistant'}</span>
        </td>
        <td class="c">${this.liveCell(id, s)}</td>
        <td class="${this.srcClass(id, 'type')}">
          ${this.locked
            ? this.chip(this.typeLabel(s.type), TYPE_COLORS[s.type] || TYPE_COLORS.other, typeChanged)
            : html`<select aria-label="Zone type" class=${typeChanged ? 'changed-inline' : ''} ?disabled=${removed} @change=${(e: any) => this.setField(id, 'type', e.target.value)}>
                ${SENSOR_TYPES.map(t => html`<option value=${t} ?selected=${s.type === t}>${this.typeLabel(t)}</option>`)}
              </select>`}
          ${this.sourceMark(id, 'type')}
        </td>
        ${this.multiPartition
          ? html`<td class="${this.srcClass(id, 'area')}">
              ${this.locked
                ? this.chip(areaKnown ? this.areas[s.area].name : '— none —', areaKnown ? 'var(--primary-color)' : 'var(--error-color, #f44336)', areaChanged)
                : html`<select aria-label="Partition" class=${areaChanged ? 'changed-inline' : ''} ?disabled=${removed} @change=${(e: any) => this.setField(id, 'area', e.target.value)}>
                    ${areaKnown ? nothing : html`<option value="" selected>— choose —</option>`}
                    ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${s.area === a.area_id}>${a.name}</option>`)}
                  </select>`}
              ${this.sourceMark(id, 'area')}
            </td>`
          : nothing}
        ${modes.map(m => {
          const on = (s.modes || []).includes(m);
          const allowed = this.modeEnabledInArea(s.area, m);
          const changed = status === 'changed' && this.draft.isModeChanged(id, m);
          return html`
            <td
              class="c mode ${changed ? 'changed' : ''} ${this.srcClass(id, 'modes')} ${this.source(id, 'modes')?.kind === 'override' ? 'override-cell' : ''}"
              title=${`${this.modeLabel(m)}: ${on ? 'active' : 'not active'}${allowed ? '' : ' — this arm mode is not enabled in the zone’s partition'}`}
            >
              ${this.locked
                ? html`<ha-icon class="mode-dot ${on ? 'on' : ''}" icon=${on ? 'mdi:check-circle' : 'mdi:circle-small'}></ha-icon>`
                : html`<ha-checkbox
                    aria-label=${`${this.modeLabel(m)} mode`}
                    .checked=${on}
                    ?disabled=${removed || (!allowed && !on)}
                    @change=${(e: any) => this.edit(() => this.draft.toggleMode(id, m, e.target.checked))}
                  ></ha-checkbox>`}
            </td>
          `;
        })}
        <td class="opts ${optsChanged ? 'changed' : ''}">
          ${optionIcons.map(([f, icon, label]) => html`<ha-icon icon=${icon} title=${`${label}: ${helpText(f)}`}></ha-icon>`)}
          ${instant ? html`<ha-icon icon=${NO_DELAY_ICON[0]} title=${NO_DELAY_ICON[1]}></ha-icon>` : nothing}
          ${s.entry_delay !== null && s.entry_delay !== undefined ? html`<span class="opt-num" title="Entry delay override">${s.entry_delay}s</span>` : nothing}
          ${this.tripDraft[id] && !this.panelWatched(id)
            ? html`<ha-icon icon=${TRIP_ICON[this.tripDraft[id]]} title=${`When tripped: ${TRIP_LABEL[this.tripDraft[id]]}`}></ha-icon>`
            : nothing}
        </td>
        <td class="row-actions">
          <ha-icon-button
            .path=${open ? mdiChevronDown : mdiChevronRight}
            .label=${open ? 'Hide zone settings' : 'Zone settings'}
            @click=${() => (this.expanded = open ? this.expanded.filter(e => e !== id) : [...this.expanded, id])}
          ></ha-icon-button>
          ${status !== 'unchanged' && !this.locked
            ? html`<ha-icon-button .path=${mdiRestore} .label=${status === 'new' ? 'Cancel adding' : 'Undo changes'} @click=${() => this.edit(() => this.draft.revertRow(id))}></ha-icon-button>`
            : nothing}
        </td>
        <td class="fill"></td>
      </tr>
      ${open ? this.renderDetail(id, s, colspan) : nothing}
    `;
  }

  private renderDetail(id: string, s: SensorRecord, colspan: number) {
    const removed = this.draft.rowStatus(id) === 'removed' || this.locked;
    const changed = (field: string) => (this.draft.isFieldChanged(id, field) ? 'changed-inline' : '');
    const numberField = (field: string, label: string, max: number) => html`
      <div class="field ${changed(field)}" title=${helpText(field)}>
        <alarmo-ext-slider
          .label=${label}
          .value=${s[field] === undefined ? null : s[field]}
          .min=${0}
          .max=${max}
          .unit=${'s'}
          .onValue=${30}
          optional
          offText="partition default"
          ?disabled=${removed}
          @value-changed=${(e: CustomEvent) => this.setField(id, field, e.detail.value)}
        ></alarmo-ext-slider>
      </div>
    `;
    const copying = this.copyFrom === id;
    const targets = this.selection.filter(x => x !== id && this.draft.rowStatus(x) !== 'removed');
    return html`
      <tr class="detail">
        <td colspan=${colspan}>
          ${this.locked ? html`<div class="locked-note">Unlock the table to change these settings.</div>` : nothing}
          <div class="zone-editor">
            <div class="col">
              <h4 class="subhead">Options</h4>
              ${DETAIL_BOOLS.map(
                ([field, label]) => html`
                  <label class="field ${changed(field)}" title=${helpText(field)}>
                    <span>${label}</span>
                    <ha-switch .checked=${field === 'enabled' ? s.enabled !== false : !!s[field]} ?disabled=${removed}
                      @change=${(e: any) => this.setField(id, field, e.target.checked)}></ha-switch>
                  </label>
                `
              )}
            </div>
            <div class="col">
              <h4 class="subhead">Delays and grouping</h4>
              ${numberField('entry_delay', 'Entry delay override', 300)} ${numberField('delay_on', 'Delay on', 600)}
              <label class="field ${changed('group')}" title=${helpText('group')}>
                <span>Cross-zone group</span>
                <select aria-label="Cross-zone group" ?disabled=${removed} @change=${(e: any) => this.setField(id, 'group', e.target.value || null)}>
                  <option value="" ?selected=${!s.group}>None</option>
                  ${Object.values(this.groups).map(g => html`<option value=${g.group_id!} ?selected=${s.group === g.group_id}>${g.name}</option>`)}
                </select>
              </label>
              ${s.auto_bypass
                ? html`<div class="field ${changed('auto_bypass_modes')}" title=${helpText('auto_bypass_modes')}>
                    <span>Bypass in</span>
                    <span class="mode-picks">
                      ${ALL_MODES.filter(m => this.modeEnabledInArea(s.area, m) || (s.auto_bypass_modes || []).includes(m)).map(
                        m => html`<label><ha-checkbox .checked=${(s.auto_bypass_modes || []).includes(m)} ?disabled=${removed}
                          @change=${(e: any) => this.edit(() => this.draft.toggleMode(id, m, e.target.checked, 'auto_bypass_modes'))}></ha-checkbox>${this.modeLabel(m)}</label>`
                      )}
                    </span>
                  </div>`
                : nothing}
              ${this.renderTripField(id, removed)}
              ${!this.multiPartition
                ? html`<div class="field"><span>Partition</span><span>${s.area && this.areas[s.area] ? this.areas[s.area].name : '— none —'}</span></div>`
                : nothing}
              <div class="copy">
                ${!copying
                  ? html`<ha-button appearance="plain" ?disabled=${removed} @click=${() => (this.copyFrom = id)}>
                      <ha-icon slot="start" icon="mdi:content-copy"></ha-icon>Copy settings to…</ha-button>`
                  : html`<div class="notice" style="margin:0">
                      <strong>Copy settings of this zone</strong>
                      <div class="mode-picks">
                        ${COPY_GROUPS.map(g => html`<label><ha-checkbox .checked=${this.copyGroups.includes(g.id)}
                          @change=${(e: any) => (this.copyGroups = e.target.checked ? [...this.copyGroups, g.id] : this.copyGroups.filter(x => x !== g.id))}></ha-checkbox>${g.label}</label>`)}
                      </div>
                      <p style="margin:6px 0">${targets.length
                        ? html`to the <strong>${targets.length}</strong> zone(s) selected with the row checkboxes.`
                        : html`Select the target zones with the row checkboxes.`}</p>
                      <ha-button ?disabled=${!targets.length || !this.copyGroups.length} @click=${() => this.copySettings(id, targets)}>Copy</ha-button>
                      <ha-button appearance="plain" @click=${() => (this.copyFrom = null)}>Cancel</ha-button>
                    </div>`}
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  /** "When tripped" (was Zone Actions → Per Zone Custom Actions): only for zones the physical panel does not watch */
  private renderTripField(id: string, disabled: boolean) {
    if (!this.panel || !Object.keys(this.panel.settings.links).length) return nothing;
    if (this.panelWatched(id))
      return html`<div class="field"><span>When tripped</span><span class="secondary" style="display:inline">the physical panel handles this zone</span></div>`;
    const v = this.tripDraft[id] || 'default';
    const changed = (this.panel.settings.zone_trip[id] || null) !== (this.tripDraft[id] || null);
    return html`<label class="field ${changed ? 'changed-inline' : ''}"
      title="This zone is watched only by Home Assistant. What happens when it triggers the alarm: the default is set on Physical Panel → How HA-only zones raise the alarm.">
      <span>When tripped</span>
      <select aria-label="When tripped" ?disabled=${disabled} @change=${(e: any) => this.setTrip(id, e.target.value)}>
        <option value="default" ?selected=${v === 'default'}>default (${TRIP_LABEL[this.tripDefault()]})</option>
        <option value="panel" ?selected=${v === 'panel'}>${TRIP_LABEL.panel}</option>
        <option value="notify" ?selected=${v === 'notify'}>${TRIP_LABEL.notify}</option>
        <option value="none" ?selected=${v === 'none'}>${TRIP_LABEL.none}</option>
      </select>
    </label>`;
  }

  private copySettings(from: string, targets: string[]) {
    const src = this.draft.get(from)!;
    const fields = COPY_GROUPS.filter(g => this.copyGroups.includes(g.id)).reduce((a, g) => [...a, ...g.fields], [] as string[]);
    this.edit(() => targets.forEach(t => fields.forEach(f => this.draft.setField(t, f, JSON.parse(JSON.stringify(src[f] ?? null))))));
    this.copyFrom = null;
    toast(this, `Copied to ${targets.length} zone(s) as unsaved changes — review and Save.`);
  }

  private renderSaveBar(count: number) {
    const b = this.draft.toBatch();
    const trips = this.tripChanges();
    const parts = [
      b.create.length ? `${b.create.length} new` : '',
      b.update.length ? `${b.update.length} changed` : '',
      b.delete.length ? `${b.delete.length} to remove` : '',
      trips ? `${trips} trip action(s)` : '',
    ].filter(Boolean);
    return html`
      <div class="savebar" role="region" aria-label="Unsaved changes">
        <ha-svg-icon class="mark" style="width:22px;height:22px" .path=${mdiPencilCircle}></ha-svg-icon>
        <span class="count">
          ${count} unsaved change${count === 1 ? '' : 's'}
          <span class="secondary" style="display:inline">(${parts.join(', ')}) — a backup is made before saving</span>
        </span>
        <ha-button appearance="plain" ?disabled=${this.saving} @click=${this.discard}>Discard</ha-button>
        <ha-button ?disabled=${this.saving} @click=${this.save}>${this.saving ? 'Saving…' : 'Save'}</ha-button>
      </div>
    `;
  }

  // ------------------------------------------------------------ actions

  private setField(id: string, field: string, value: any) {
    this.edit(() => this.draft.setField(id, field, value));
  }

  private selectRows(ids: string[], on: boolean) {
    const rest = this.selection.filter(id => !ids.includes(id));
    this.selection = on ? [...rest, ...ids] : rest;
  }

  private bulkSet(field: string, e: any) {
    const value = e.target.value;
    e.target.value = '';
    if (!value) return;
    this.edit(() => this.draft.setFieldMany(this.selection, field, value));
  }

  private addPicked(ev: CustomEvent) {
    this.locked = false; // adding is deliberate; the new rows can be edited right away
    const { entity_ids, area } = ev.detail as { entity_ids: string[]; area: string };
    const a = this.areas[area];
    const modeList = ALL_MODES.filter(m => a && a.modes && a.modes[m] && a.modes[m].enabled);
    this.edit(() => {
      entity_ids.forEach(id => {
        let rec: any = defaultSensorConfig(this.hass.states[id], modeList);
        if (!rec) return;
        // covers (garage doors, gates) and locks are entry points: default to a Door zone
        if (['cover', 'lock'].includes(id.split('.')[0]))
          rec = { ...rec, type: ESensorTypes.Door, ...sensorConfigByType(modeList)[ESensorTypes.Door] };
        this.draft.add({ ...rec, area, group: null } as unknown as SensorRecord);
      });
    });
    this.showAdd = false;
    toast(this, `${entity_ids.length} zone(s) added to the draft. Click Save to apply.`);
  }

  private discard() {
    if (!window.confirm(`Discard ${this.draft.changeCount() + this.tripChanges()} unsaved change(s)?`)) return;
    this.edit(() => this.draft.discardAll());
    if (this.panel) this.tripDraft = { ...this.panel.settings.zone_trip };
    this.restoredCount = 0;
  }

  private modesTitle(id: string) {
    const src = this.source(id, 'modes');
    if (!src) return '';
    return src.kind === 'override'
      ? 'Arm modes: manual override (clear it from the Modes icon next to the zone name)'
      : `Arm modes set by rule: ${this.ruleNames(src.rules)}`;
  }

  private async rulesApplied(ev: CustomEvent) {
    this.showRulesPreview = false;
    const res = ev.detail as { backup: { name: string }; created: number; updated: number };
    toast(this, `Rules applied: ${res.created} new, ${res.updated} changed zone(s). Backup: ${res.backup.name}`);
    await this.fetchData();
  }

  private async save() {
    const batch = this.draft.toBatch();
    const missingArea = batch.create.filter(r => !r.area || !this.areas[r.area]).map(r => r.entity_id);
    if (missingArea.length) {
      this.error = `Choose a partition for: ${missingArea.join(', ')}`;
      return;
    }
    this.saving = true;
    this.error = '';
    try {
      const empty = !batch.create.length && !batch.update.length && !batch.delete.length;
      const res = empty ? null : await applySensorChanges(this.hass, batch);
      if (this.panel && this.tripChanges()) {
        // drop actions of zones that are gone
        const zt: Record<string, string> = {};
        Object.keys(this.tripDraft).forEach(k => {
          if (!batch.delete.includes(k)) zt[k] = this.tripDraft[k];
        });
        const latest = (await fetchPanel(this.hass)).settings;
        await savePanel(this.hass, { ...latest, zone_trip: zt as PanelSettings['zone_trip'] });
        this.panel = undefined;
      }
      this.edit(() => this.draft.discardAll());
      this.restoredCount = 0;
      this.selection = [];
      this.locked = true;
      await this.fetchData();
      toast(this, res ? `Saved ${res.created + res.updated + res.deleted} zone(s). Backup: ${res.backup.name}` : 'Saved.');
    } catch (err) {
      this.error = `Nothing was saved:\n${wsErrorMessage(err)}`;
    } finally {
      this.saving = false;
    }
  }

  static styles = extStyles;
}
