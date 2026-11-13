// House Modes tab: current mode, mode editor (partitions, allowed sources, readiness,
// failure handling, timers), input_select mirror, lock keypads, history.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { toast, wsErrorMessage, formatDate } from '../../data/ext-websockets';
import {
  HouseInfo,
  HouseMode,
  HouseSettings,
  SOURCES,
  SOURCE_LABELS,
  TARGET_STATES,
  describeTargets,
  fetchHouse,
  detectHouse,
  applyDetected,
  DetectResult,
  runState,
  setRunState,
  modeErrors,
  newMode,
  removeMode,
  defaultModeColor,
  toHex,
  saveHouse,
  setHouseMode,
  actionChoices,
  describeTimer,
  timerWarnings,
  ActionGroup,
  actionGroups,
  setGroupModes,
  updateGroup,
  removeGroup,
} from '../../data/house';
import { extStyles } from './ext-styles';
import {
  HouseActionItem,
  HouseActionsInfo,
  editorPath,
  fetchHouseActions,
  reactingTo,
  reactingToAny,
  settingMode,
  settingFromTemplate,
  setterWarnings,
  sourceTriggerWarnings,
  describeSetter,
} from '../../data/house-actions';

/** HA editor path for a scene/script entity (scenes need their config id). */
const editorPathFor = (entityId: string, hass: HomeAssistant): string | null => {
  const [domain, obj] = entityId.split('.');
  if (domain === 'script') return `/config/script/edit/${obj}`;
  const id = hass.states[entityId]?.attributes.id;
  return domain === 'scene' && id ? `/config/scene/edit/${id}` : null;
};
import './slider-field';
import { roleChip, sectionHead, entityBadge, lockToggle, settingLock, SETTING_LOCKS, isLocked, runStateRow } from './page-intro';
import { navigate } from '../../helpers';
import './multi-picker';
import './icon-field';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
/** Which editor sections are open, per mode (module-level: kept across re-renders, saves and tab changes). */
const SEC_OPEN: Record<string, boolean> = {};
/** Script Actions - All Modes is read-only until unlocked (like Zones). */
const BYSCRIPT_LOCK = { locked: true };
/** The All Modes grids: the mode columns hidden by their filter, per grid (module-level: kept across re-renders). */
const MODE_HIDDEN: Record<'byscript' | 'byauto', Set<string>> = { byscript: new Set(), byauto: new Set() };
/** One row of Automations - All Modes: an automation as a trigger (sets modes) or as an action (runs on them). */
type AutoRow = { item: HouseActionItem; role: 'trigger' | 'action'; modes: Record<string, 'sets' | 'enter' | 'leave' | 'both'> };
const STATE_LABEL: Record<string, string> = {
  armed_away: 'Away',
  armed_home: 'Home (Stay)',
  armed_night: 'Night',
  armed_vacation: 'Vacation',
  armed_custom_bypass: 'Custom',
  disarmed: 'Disarm',
};
const list = (text: string) =>
  text
    .split(/[\s,]+/)
    .map(s => s.trim())
    .filter(Boolean);

@customElement('hm-view-house')
export class AlarmViewHouse extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private actions?: HouseActionsInfo;
  @state() private info?: HouseInfo;
  @state() private draft?: HouseSettings;
  @state() private open: string[] = [];
  @state() private error = '';
  @state() private busy = false;
  @state() private lastBlocked: { mode: string; reason: string } | null = null;
  @state() private detect?: DetectResult;
  @state() private detectPick: string[] = [];
  @state() private detecting = false;
  /** script rows added on "Script Actions by script" that no mode runs yet */
  @state() private pendingGroups: Omit<ActionGroup, 'modes'>[] = [];

  firstUpdated() {
    // /house_modes/house/open/<section>: open that section (links from Quick Start)
    const open = this.path?.params?.open;
    if (open) SEC_OPEN[`*:tab:${open}`] = true;
    this.refresh();
    this.loadActions();
    if (open)
      setTimeout(() => this.shadowRoot?.querySelector(`details[data-sec="${open}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 400);
  }

  /** Make a House Mode helper (input_select with the mode names) and use it. Saved with the rest (Save bar). */
  private async createHelper(key: 'input_select' | 'current_entity' | 'previous_entity') {
    const d = this.draft!;
    const names = d.modes.map(m => m.name);
    if (!names.length) return;
    const name = { input_select: 'House Mode Selector', current_entity: 'House Mode Current', previous_entity: 'House Mode Previous' }[key];
    const icon = { input_select: 'mdi:home-switch', current_entity: 'mdi:home-outline', previous_entity: 'mdi:history' }[key];
    if (!window.confirm(`Create the helper "${name}" (an input_select with the options ${names.join(', ')}) and use it?\n\nIt is a normal Home Assistant helper: Settings → Devices & services → Helpers. Press Save to keep the choice.`)) return;
    try {
      const item = await this.hass.callWS<{ id: string }>({ type: 'input_select/create', name, icon, options: names });
      const eid = `input_select.${item.id}`;
      this.set(x => (x[key] = eid));
      toast(this, `Created ${eid}. Press Save to use it.`);
    } catch (err) {
      this.error = `Could not create the helper: ${wsErrorMessage(err)}`;
    }
  }

  /** Add the mode names an input_select is missing (keeps its own options). */
  private async addMissingOptions(entity: string, missing: string[]) {
    const have = (this.hass.states[entity]?.attributes.options as string[]) || [];
    if (!window.confirm(`Add ${missing.join(', ')} to ${entity}?\n\nIf the helper is defined in YAML, change it there too: a reload would undo this.`)) return;
    try {
      await this.hass.callService('input_select', 'set_options', { entity_id: entity, options: [...have, ...missing] });
      toast(this, `Added ${missing.length} option(s) to ${entity}.`);
    } catch (err) {
      this.error = `Could not change ${entity}: ${wsErrorMessage(err)}`;
    }
  }

  private async refresh(resetDraft = false) {
    try {
      this.info = await fetchHouse(this.hass);
      if (!this.draft || resetDraft) this.draft = clone(this.info.settings);
      else {
        // runtime state always comes from the server
        const s = this.info.settings;
        this.draft = { ...this.draft, current: s.current, previous: s.previous, source: s.source, changed_at: s.changed_at, history: s.history, pending: s.pending };
      }
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private editable(s: HouseSettings) {
    const { current, previous, source, changed_at, history, pending, ...rest } = s;
    return JSON.stringify(rest);
  }

  private get dirty() {
    return !!this.info && !!this.draft && this.editable(this.info.settings) !== this.editable(this.draft);
  }

  private set(fn: (d: HouseSettings) => void) {
    const d = clone(this.draft!);
    fn(d);
    this.draft = d;
  }

  private setMode(id: string, fn: (m: HouseMode) => void) {
    this.set(d => fn(d.modes.find(m => m.id === id)!));
  }

  render() {
    if (!this.info || !this.draft) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const errors = modeErrors(this.draft.modes);
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      ${this.renderCurrent()}
      <ha-card><div class="toolbar"><ha-icon icon="mdi:history"></ha-icon>House Mode history and every sequence around it are on the <a href="/house_modes/activity">Activity</a> tab.</div></ha-card>
      ${this.dirty
        ? html`<div class="savebar" role="region" aria-label="Unsaved House Mode settings">
            <span class="count">Unsaved House Mode settings
              ${errors.length ? html`<span class="secondary" style="display:block">${errors.join(' ')}</span>` : nothing}</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.draft = clone(this.info!.settings))}>Discard</ha-button>
            <ha-button ?disabled=${this.busy || errors.length > 0} @click=${this.save}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          </div>`
        : nothing}
    `;
  }

  // ------------------------------------------------------------------ current

  private renderCurrent() {
    const s = this.info!.settings;
    const cur = s.modes.find(m => m.id === s.current);
    const status = s.enabled
      ? html`<div class="hm-status">${runState(s) === 'shadow' ? 'Would be' : 'Now'}: <strong>${cur ? cur.name : 'unknown'}</strong>
          ${s.changed_at ? html`<span class="secondary" style="display:inline">since ${formatDate(s.changed_at, this.hass.language)} (${s.source})</span>` : nothing}</div>`
      : html`<div class="hm-status secondary">Off — choose Shadow or Live and save to start.</div>`;
    return html`
      <ha-card>${sectionHead('House Modes', 'settings')}
        <div class="card-content desc">
          <p>A House Mode says what is going on at home — Away, Stay, Guest, Spa, … Each mode:</p>
          <ul>
            <li>sets the partitions to an Arm Mode (or leaves them alone);</li>
            <li>has <strong>Allowed Sources</strong>: whether you, schedules, presence, a lock code or the keypad may enter or exit it;</li>
            <li>can check that zones are closed, and can change itself back after a while.</li>
          </ul>
          <p>Each mode can run your scripts as its <em>actions</em> (lock up, lights, …). Automations can also
            react to <code>select.house_mode</code> or the <code>house_modes_house_mode_changed</code> event, and change
            the mode with <code>house_modes.set_house_mode</code> (mode + source).</p>
        </div>
        <div class="toolbar">
          ${runStateRow('house-run', 'hm-run', runState(this.draft!), v => this.set(d => setRunState(d, v)), () => this.requestUpdate())}
        </div>
        ${runState(this.draft!) === 'shadow'
          ? html`<div class="notice" style="margin:0 16px 12px">
              <strong>Shadow:</strong> House Modes run next to your own automations and change nothing. Each request
              (your input_select, the House Mode select, a lock code, a timer) is checked the way Live would handle it,
              then compared with what your automations really did. Nothing is armed or disarmed, no script
              runs, no notification is sent, and the input_select is never written. The comparison is on the
              <a href="/house_modes/activity">Activity</a> tab.
              ${status}
            </div>`
          : html`<div class="hm-status-line">${status}</div>`}
        ${this.lastBlocked
          ? html`<div class="notice warn">${this.lastBlocked.reason}
              <button class="link" @click=${() => this.choose(this.lastBlocked!.mode, true)}>Change anyway</button></div>`
          : nothing}
        ${s.pending.length
          ? html`<div class="notice">${s.pending.map(p => {
              const t = s.modes.find(m => m.id === p.target);
              return html`<div>${p.kind === 'delayed' ? 'Delayed request' : 'Timer'}: ${t ? t.name : p.target} at ${new Date(p.due * 1000).toLocaleTimeString()}</div>`;
            })}</div>`
          : nothing}
        ${this.renderModes()}
        ${this.renderByScript()}
        ${this.renderByAutomation()}
        ${this.renderEveryChange()}
        ${this.renderTemplated()}
        ${this.renderSettingsRow()}
      </ha-card>
    `;
  }

  private async choose(id: string, force = false) {
    this.busy = true;
    this.error = '';
    this.lastBlocked = null;
    try {
      const res = await setHouseMode(this.hass, id, force);
      const name = this.info!.settings.modes.find(m => m.id === id)?.name || id;
      if (res.result === 'blocked') this.lastBlocked = { mode: id, reason: res.reason || 'Not allowed now.' };
      else if (res.result === 'not_ready') this.lastBlocked = { mode: id, reason: `Not ready, open: ${(res.open || []).join(', ')}` };
      else if (res.result === 'failed') this.error = `${name} failed: ${(res.failed || []).join(', ')} did not arm.`;
      else if (res.result === 'delayed') toast(this, `${name} in ${res.minutes} min.`);
      else if (res.result === 'shadow') toast(this, `Shadow: ${name} ${res.would === 'changed' ? 'would be set' : `would be ${res.would}`} (nothing changed)`);
      else toast(this, `House Mode: ${name}`);
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  // ------------------------------------------------------------------ modes

  private renderModes() {
    const d = this.draft!;
    const names: Record<string, string> = {};
    this.info!.targets.forEach(t => (names[t.key] = t.name));
    const st = this.info!.settings;
    const cur = st.current;
    const enabled = st.enabled;
    const shadow = runState(st) === 'shadow';
    const saved = new Set(st.modes.map(m => m.id));
    return this.tabSec('modes', `Modes (${d.modes.length})`, '', false, html`
        <div class="card-content desc hm-desc">
          <p><ha-icon icon="mdi:play-circle-outline" style="--mdc-icon-size:18px"></ha-icon> switches to a mode now.
            The pencil edits it: which partitions it arms, its Allowed Sources, readiness checks, what happens
            if arming fails, what starts it (Triggers), timers, the scripts it runs (Script Actions) and the automations it
            starts (Automation Actions). Save at the
            bottom of the page.</p>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${this.detecting} @click=${() => this.runDetect()}><ha-icon slot="start" icon="mdi:magnify-scan"></ha-icon>Detect from your input_selects</ha-button>
          <ha-button appearance="plain" @click=${this.addMode}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add House Mode</ha-button>
          ${!d.modes.length ? html`<ha-button appearance="plain" @click=${this.addStarter}><ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>Add starter modes</ha-button>` : nothing}
          ${this.dirty ? html`<span class="secondary" style="display:inline">Save before switching modes.</span>` : nothing}
        </div>
        ${this.detect ? this.renderDetect() : nothing}
        ${timerWarnings(d.modes).length
          ? html`<div class="notice warn" style="margin:0 16px 12px"><strong>Timers that can't work:</strong>
              ${timerWarnings(d.modes).map(w => html`<div>${w.text}</div>`)}</div>`
          : nothing}
        ${d.modes.length
          ? html`<div class="table-wrap"><table class="full">
              <thead><tr><th class="icon"></th><th>House Mode</th><th>Partitions</th><th></th></tr></thead>
              <tbody>
                ${d.modes.map(m => {
                  const open = this.open.includes(m.id);
                  const toggle = () => (this.open = open ? this.open.filter(x => x !== m.id) : [...this.open, m.id]);
                  return html`
                    <tr>
                      <td class="icon"><ha-icon icon=${m.icon} style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon></td>
                      <td class="name">${m.name}${m.id === cur ? html`<span class="secondary">${shadow ? 'current (would be)' : 'current'}</span>` : nothing}
                        <span class="secondary hm-counts">${timerWarnings(d.modes).some(w => w.mode === m.id) ? html`<ha-icon class="hm-warn-icon" icon="mdi:alert" title="A timer can't work: open Timers"></ha-icon>` : nothing}${this.modeCounts(m)}</span></td>
                      <td>${describeTargets(m, names, s => STATE_LABEL[s] || s) || html`<span class="secondary" style="display:inline">leaves the partitions alone</span>`}</td>
                      <td class="row-actions">
                        ${m.id === cur || !enabled
                          ? html`<ha-icon-button class="hm-noswitch" aria-hidden="true" tabindex="-1"><ha-icon icon="mdi:play-circle-outline"></ha-icon></ha-icon-button>`
                          : html`<ha-icon-button .label=${`Switch to ${m.name}`} title=${shadow ? `Switch to ${m.name} (Shadow: only logged)` : `Switch to ${m.name}`}
                              ?disabled=${this.busy || this.dirty || !saved.has(m.id)} @click=${() => this.choose(m.id)}>
                              <ha-icon icon="mdi:play-circle-outline"></ha-icon></ha-icon-button>`}
                        <ha-icon-button .label=${open ? 'Close' : 'Edit'} title=${open ? 'Close' : 'Edit'} @click=${toggle}>
                          <ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:pencil'}></ha-icon></ha-icon-button>
                        <ha-icon-button .label=${'Delete'} title="Delete"
                          @click=${() => window.confirm(`Delete the House Mode "${m.name}" with its Script Actions and timers? Timers in other modes that go to it are removed too. It is gone once you Save; a backup is made first.`) && (this.draft = removeMode(this.draft!, m.id))}>
                          <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
                      </td>
                    </tr>
                    ${open ? html`<tr class="detail hm-detail"><td colspan="4">${this.renderEditor(m)}</td></tr>` : nothing}
                  `;
                })}
              </tbody>
            </table></div>`
          : nothing}
    `);
  }

  /** "2 scripts · 1 timer · 3 automations" for a mode's row. */
  private modeCounts(m: HouseMode) {
    const r = this.actions ? reactingTo(this.actions.items, m.name) : { enter: [], leave: [] };
    const n = (k: number, w: string) => `${k} ${w}${k === 1 ? '' : 's'}`;
    return [n((m.steps || []).length, 'script'), n(m.timers.length, 'timer'), this.actions ? n(r.enter.length + r.leave.length, 'automation') : '']
      .filter(Boolean)
      .join(' · ');
  }

  /** A top-level section of the House Modes card, collapsible (open state kept across re-renders). */
  private tabSec(key: string, title: string, summary: unknown, defOpen: boolean, body: unknown) {
    const k = `*:tab:${key}`;
    const open = k in SEC_OPEN ? SEC_OPEN[k] : defOpen;
    return html`<details class="collapse hm-tabsec" data-sec=${key} ?open=${open} @toggle=${(e: Event) => (SEC_OPEN[k] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${title}</span>
        ${summary ? html`<span class="secondary" style="display:inline">${summary}</span>` : nothing}
      </summary>
      <div class="hm-tabsec-body">${body}</div>
    </details>`;
  }

  private async runDetect(ents?: Partial<DetectResult['entities']>) {
    this.detecting = true;
    this.error = '';
    try {
      const prev = this.detect?.entities;
      this.detect = await detectHouse(this.hass, ents ? { ...prev, ...ents } : undefined);
      this.detectPick = this.detect.suggestions.filter(s => s.basis !== 'none').map(s => s.name);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.detecting = false;
    }
  }

  private renderDetect() {
    const r = this.detect!;
    const names: Record<string, string> = {};
    r.targets.forEach(t => (names[t.key] = t.name));
    const have = (n: string) => this.draft!.modes.some(m => m.name.toLowerCase() === n.toLowerCase());
    const ent = (key: 'selector' | 'current' | 'previous', label: string) => html`<label>${label}
        <select @change=${(e: any) => this.runDetect({ [key]: e.target.value || null })}>
          <option value="" ?selected=${!r.entities[key]}>none</option>
          ${r.selects.map(s => html`<option value=${s.entity_id} ?selected=${r.entities[key] === s.entity_id}>${s.name || s.entity_id} (${s.entity_id})</option>`)}
        </select></label>`;
    const days = r.span.length ? Math.max(1, Math.round((r.span[1] - r.span[0]) / 86400)) : 0;
    return html`
      <div class="editor" style="margin:0 16px 12px;padding:8px 12px;border-left:3px solid var(--primary-color)">
        <div class="subhead">Detected House Modes</div>
        <p class="secondary">One House Mode per option of your input_selects. Partitions come from the Activity log (what
          the partitions were set to each time your current-mode entity changed: ${r.changes} changes over ${days} days), or from the
          name when a mode never appears there. Nothing is saved until you press Save.</p>
        <div class="detail-grid">
          ${ent('selector', 'Selector (manual choice)')} ${ent('current', 'Current House Mode')} ${ent('previous', 'Previous House Mode')}
        </div>
        <div class="table-wrap"><table class="full">
          <thead><tr><th></th><th>House Mode</th><th>Partitions</th><th>Based on</th><th>Note</th></tr></thead>
          <tbody>
            ${r.suggestions.map(sug => {
              const on = this.detectPick.includes(sug.name);
              const parts = Object.entries(sug.targets).map(([k, v]) => `${names[k] || k}: ${STATE_LABEL[v] || v}`).join(', ');
              const basis =
                sug.basis === 'activity'
                  ? `seen ${sug.seen}× (${Object.values(sug.share).map(x => Math.round(x * 100) + '%').join(', ') || '—'})`
                  : sug.basis === 'name' ? 'the name' : '—';
              return html`<tr>
                <td><input type="checkbox" .checked=${on} @change=${(e: any) =>
                  (this.detectPick = e.target.checked ? [...this.detectPick, sug.name] : this.detectPick.filter(n => n !== sug.name))} /></td>
                <td><ha-icon icon=${sug.icon}></ha-icon> ${sug.name}${have(sug.name) ? html` <span class="secondary" style="display:inline">(updates yours)</span>` : nothing}</td>
                <td>${parts || html`<span class="secondary">leaves them alone</span>`}</td>
                <td>${basis}</td>
                <td><span class="secondary" style="display:inline">${sug.note}</span></td>
              </tr>`;
            })}
          </tbody>
        </table></div>
        <div class="toolbar">
          <ha-button ?disabled=${!this.detectPick.length} @click=${this.useDetected}>Use ${this.detectPick.length} House Mode${this.detectPick.length === 1 ? '' : 's'}</ha-button>
          <ha-button appearance="plain" @click=${() => (this.detect = undefined)}>Cancel</ha-button>
        </div>
      </div>
    `;
  }

  private useDetected() {
    const r = this.detect!;
    const picked = r.suggestions.filter(s => this.detectPick.includes(s.name));
    let changes: string[] = [];
    this.set(d => (changes = applyDetected(d, picked, r.entities)));
    this.detect = undefined;
    toast(this, `Detected House Modes added to the draft (${changes.length} changes). Check them, then Save.`);
  }

  private addMode() {
    const name = window.prompt('Name of the new House Mode');
    if (!name) return;
    const m = newMode(name.trim(), this.draft!.modes);
    this.set(d => d.modes.push(m));
    this.open = [...this.open, m.id];
  }

  private addStarter() {
    const key = (this.info!.targets.find(t => t.key === 'master') || this.info!.targets[0])?.key;
    const mk = (name: string, target?: string, extra: Partial<HouseMode> = {}) => {
      const m = { ...newMode(name, []), ...extra };
      if (key && target) m.targets = { [key]: target };
      return m;
    };
    const all = [...SOURCES];
    this.set(d => {
      d.modes = [
        mk('Disarmed', 'disarmed'),
        mk('Stay', 'armed_home'),
        mk('Sleep', 'armed_night'),
        mk('Away', 'armed_away'),
        mk('Vacation', 'armed_vacation', { leave_sources: ['manual', 'presence_home', 'lock', 'panel_keypad'] }),
        mk('Guest', 'disarmed', { leave_sources: all.filter(s => s !== 'presence_away') }),
        mk('Local', 'disarmed', { enter_sources: ['manual'], leave_sources: all.filter(s => s !== 'presence_away') }),
        mk('Spa', 'armed_custom_bypass', {
          enter_sources: ['manual'],
          delay_sources: { schedule: 30 },
          timers: [{ after_minutes: 45, then: 'previous', from_modes: [], notify: true }],
        }),
      ];
    });
  }

  /** One collapsible section of a mode's editor (CARD_DESIGN_SYSTEM: UPPERCASE primary title, accent border when open). */
  private sec(m: HouseMode, key: string, title: string, summary: unknown, body: unknown) {
    const k = `${m.id}:${key}`;
    return html`<details class="collapse sub hm-sec" ?open=${!!SEC_OPEN[k]}
        @toggle=${(e: Event) => (SEC_OPEN[k] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${title}</span>
        <span class="secondary" style="display:inline">${summary}</span>
      </summary>
      <div class="collapse-body">${body}</div>
    </details>`;
  }

  private renderEditor(m: HouseMode) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    const other = this.draft!.modes.filter(x => x.id !== m.id);
    const names: Record<string, string> = {};
    this.info!.targets.forEach(t => (names[t.key] = t.name));
    const parts = describeTargets(m, names, s => STATE_LABEL[s] || s);
    const nIn = m.enter_sources.length;
    const nOut = m.leave_sources.length;
    const nReady = m.readiness.entities.length + m.readiness.labels.length;
    const r = this.actions ? reactingTo(this.actions.items, m.name) : { enter: [], leave: [] };
    const nAuto = r.enter.length + r.leave.length;
    const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
    const tWarn = timerWarnings(this.draft!.modes).filter(w => w.mode === m.id);
    return html`
      <div class="hm-ed">
        <div class="hm-fields">
          <label class="hm-f">Name <input type="text" .value=${m.name} @change=${(e: any) => upd(x => (x.name = e.target.value))} /></label>
          <div class="hm-f"><hm-icon-field .hass=${this.hass} .value=${m.icon} .placeholder=${'home'}
            @value-changed=${(e: CustomEvent) => upd(x => (x.icon = e.detail.value || 'mdi:home'))}></hm-icon-field></div>
          <label class="hm-f">Color
            <input type="color" .value=${toHex(m.color || defaultModeColor(m.name))} @input=${(e: any) => upd(x => (x.color = e.target.value))} />
            ${m.color ? html`<button class="link" @click=${() => upd(x => (x.color = ''))}>automatic</button>` : html`<span class="secondary" style="display:inline">automatic</span>`}
          </label>
          <label class="hm-f" title="What happens when a partition does not arm">If arming fails
            <select @change=${(e: any) => upd(x => (x.on_failure = e.target.value))}>
              <option value="undo" ?selected=${m.on_failure === 'undo'}>undo (back to how it was)</option>
              <option value="keep" ?selected=${m.on_failure === 'keep'}>keep what armed (mode unknown)</option>
              <option value="previous" ?selected=${m.on_failure === 'previous'}>go to the previous mode</option>
            </select>
          </label>
        </div>
        ${this.sec(m, 'partitions', 'Partitions', parts || 'leaves the partitions alone', html`
          <div class="hm-fields">
            ${this.info!.targets.map(t => html`<label class="hm-f">${t.name}
              <select @change=${(e: any) => upd(x => {
                if (e.target.value === '') delete x.targets[t.key];
                else x.targets[t.key] = e.target.value;
              })}>
                <option value="" ?selected=${!m.targets[t.key]}>leave unchanged</option>
                ${TARGET_STATES.map(s => html`<option value=${s} ?selected=${m.targets[t.key] === s}>${STATE_LABEL[s]}</option>`)}
              </select></label>`)}
          </div>
          <div class="secondary hm-hint">Leave everything unchanged for a mode that only tells your automations what is going on.</div>`)}
        ${this.sec(m, 'sources', 'Allowed Sources', `${nIn} of ${SOURCES.length} may enter · ${nOut} may exit`, html`
          <div class="table-wrap"><table>
            <thead><tr><th>Source</th><th class="c" title="This source may switch into this mode">May Enter</th><th class="c" title="This source may change the mode while this mode is on">May Exit</th><th title="Instead of blocking an exit, wait this many minutes">Wait Before Exit (min)</th></tr></thead>
            <tbody>${SOURCES.map(src => html`<tr>
              <td>${SOURCE_LABELS[src]}</td>
              <td class="c"><input type="checkbox" .checked=${m.enter_sources.includes(src)} @change=${(e: any) => upd(x => (x.enter_sources = e.target.checked ? [...x.enter_sources, src] : x.enter_sources.filter(s => s !== src)))} /></td>
              <td class="c"><input type="checkbox" .checked=${m.leave_sources.includes(src)} @change=${(e: any) => upd(x => (x.leave_sources = e.target.checked ? [...x.leave_sources, src] : x.leave_sources.filter(s => s !== src)))} /></td>
              <td><hm-slider compact optional .label=${`${SOURCE_LABELS[src]}: wait before exit`} .min=${1} .max=${120} .onValue=${10}
                unit="min" offText="no wait" .value=${m.delay_sources[src] || null}
                @value-changed=${(e: CustomEvent) => upd(x => {
                  if (e.detail.value) x.delay_sources[src] = e.detail.value;
                  else delete x.delay_sources[src];
                })}></hm-slider></td>
            </tr>`)}</tbody>
          </table></div>`)}
        ${this.sec(m, 'readiness', 'Readiness', nReady ? `${plural(nReady, 'check')} · ${m.readiness.action === 'block' ? 'blocks' : 'warns'} if open` : 'no checks', html`
          <div class="hm-fields">
            <label class="hm-f">Entities that should be closed <input type="text" placeholder="binary_sensor.patio_door, …" .value=${m.readiness.entities.join(', ')}
              @change=${(e: any) => upd(x => (x.readiness.entities = list(e.target.value)))} /></label>
            <label class="hm-f">…or with label (ids) <input type="text" placeholder="windows" .value=${m.readiness.labels.join(', ')}
              @change=${(e: any) => upd(x => (x.readiness.labels = list(e.target.value)))} /></label>
            <label class="hm-f">If open
              <select @change=${(e: any) => upd(x => (x.readiness.action = e.target.value))}>
                <option value="warn" ?selected=${m.readiness.action === 'warn'}>warn and continue</option>
                <option value="block" ?selected=${m.readiness.action === 'block'}>do not change the mode</option>
              </select></label>
          </div>`)}
        ${this.sec(m, 'triggers', 'Triggers', this.triggerSummary(m), this.renderTriggers(m))}
        ${this.sec(m, 'timers', 'Timers', html`${tWarn.length ? html`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>` : nothing}${m.timers.length ? m.timers.map(t => describeTimer(t, this.nameOf)).join(' · ') : 'none'}`, this.renderTimers(m, other))}
        ${this.sec(m, 'actions', 'Script Actions', plural((m.steps || []).length, 'script'), this.renderSteps(m, other))}
        ${this.sec(m, 'automations', 'Automation Actions', this.actions ? plural(nAuto, 'automation') : 'loading…', this.renderRelated(m))}
      </div>
    `;
  }

  /** "2 automations · 1 timer · lock code" for the closed Triggers section. */
  private triggerSummary(m: HouseMode) {
    const d = this.draft!;
    const autos = this.actions ? settingMode(this.actions.items, m.name) : [];
    const timers = d.modes.filter(o => o.id !== m.id && o.timers.some(t => t.then === m.id)).length;
    const codes = d.lock_keypads.reduce((n, k) => n + Object.values(k.slots).filter(v => v === m.id).length, 0);
    const warn = autos.some(a => a.sets.some(x => setterWarnings(x, m.name, m.enter_sources).length || sourceTriggerWarnings(a.item, x).length));
    const n = (k: number, w: string) => `${k} ${w}${k === 1 ? '' : 's'}`;
    const parts = [this.actions ? n(autos.length, 'automation') : 'loading…', timers ? n(timers, 'timer') : '', codes ? n(codes, 'lock code') : '', 'manual'];
    return html`${warn ? html`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>` : nothing}${parts.filter(Boolean).join(' · ')}`;
  }

  /** What can start this mode: automations that set it, timers in other modes, lock codes, the panel, manual. */
  private renderTriggers(m: HouseMode) {
    const d = this.draft!;
    const autos = this.actions ? settingMode(this.actions.items, m.name) : [];
    const timers = d.modes.reduce((acc, o) => (o.id === m.id ? acc : acc.concat(o.timers.filter(t => t.then === m.id).map(t => ({ o, t })))), [] as { o: HouseMode; t: HouseMode['timers'][number] }[]);
    const codes = d.lock_keypads
      .map(k => ({ k, slots: Object.entries(k.slots).filter(([, v]) => v === m.id).map(([sl]) => sl) }))
      .filter(x => x.slots.length);
    return html`
      <div class="hm-group">Automations that set ${m.name}</div>
      ${!this.actions
        ? html`<div class="secondary hm-hint">Loading…</div>`
        : autos.length
          ? autos.map(({ item, sets }) => html`${this.autoLine(item, sets.map(x => describeSetter(item, x)).join('; '))}
              ${sets.reduce((acc, x) => acc.concat(setterWarnings(x, m.name, m.enter_sources), sourceTriggerWarnings(item, x)), [] as string[]).map(w => html`<div class="hm-line-warn"><ha-icon icon="mdi:alert"></ha-icon>${w}</div>`)}`)
          : html`<div class="secondary hm-hint">None: no automation's actions set ${m.name}.</div>`}
      <div class="hm-group">Built in</div>
      ${timers.map(({ o, t }) => html`<div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:timer-outline"></ha-icon>
        <div class="hm-line-name"><span>Timer in ${o.name}</span><span class="secondary">${describeTimer(t, this.nameOf)}</span></div></div>`)}
      ${codes.map(({ k, slots }) => html`<div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:lock-smart"></ha-icon>
        <div class="hm-line-name"><span>${k.name || (k.entity_id ? this.hass.states[k.entity_id]?.attributes.friendly_name || k.entity_id : `Lock ${k.node_id}`)}</span>
          <span class="secondary">code slot${slots.length === 1 ? '' : 's'} ${slots.join(', ')}</span></div></div>`)}
      <div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:gesture-tap"></ha-icon>
        <div class="hm-line-name"><span>Manual</span><span class="secondary">the mode buttons, the dashboard card, ${d.input_select ? d.input_select : 'your selector'}</span></div></div>
      <div class="secondary hm-hint">Read from the automations' actions. Each one's request still has to pass this mode's
        Allowed Sources. Partitions armed from the panel keypad or another alarm card also set the House Mode whose
        partitions match.</div>
    `;
  }

  private nameOf = (id: string) => this.draft?.modes.find(m => m.id === id)?.name || id;

  private renderTimers(m: HouseMode, other: HouseMode[]) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    const warn = timerWarnings(this.draft!.modes).filter(w => w.mode === m.id);
    return html`
      ${warn.length ? html`<div class="notice warn hm-warn">${warn.map(w => html`<div>${w.text}</div>`)}</div>` : nothing}
      <button class="hm-add" @click=${() => upd(x => x.timers.push({ after_minutes: 10, then: 'previous', from_modes: [], window_start: null, window_end: null, notify: true }))}>
        <ha-icon icon="mdi:plus"></ha-icon>Timer</button>
      ${m.timers.map((t, i) => html`<div class="hm-item">
        <ha-icon class="hm-item-icon" icon="mdi:timer-outline"></ha-icon>
        <div class="hm-item-body">
          <label><select aria-label="When" @change=${(e: any) => upd(x => {
              const tm = x.timers[i];
              if (e.target.value === 'at') { tm.at = tm.at || '01:00'; tm.after_minutes = null; }
              else { tm.after_minutes = tm.after_minutes || 10; tm.at = null; }
            })}>
              <option value="after" ?selected=${!t.at}>after</option>
              <option value="at" ?selected=${!!t.at}>at</option>
            </select></label>
          ${t.at
            ? html`<label><input type="time" aria-label="At" .value=${t.at} @change=${(e: any) => upd(x => (x.timers[i].at = e.target.value || '01:00'))} /></label>`
            : html`<hm-slider .label=${''} .min=${1} .max=${720} unit="min" .value=${t.after_minutes || 10}
                @value-changed=${(e: CustomEvent) => upd(x => (x.timers[i].after_minutes = Math.max(1, e.detail.value || 1)))}></hm-slider>`}
          <label>go to <select @change=${(e: any) => upd(x => (x.timers[i].then = e.target.value))}>
            <option value="previous" ?selected=${t.then === 'previous'}>the previous mode</option>
            ${other.map(o => html`<option value=${o.id} ?selected=${t.then === o.id}>${o.name}</option>`)}
          </select></label>
          <hm-multi-picker .label=${'only when coming from'} .placeholder=${'any mode'}
            .options=${other.map(o => ({ value: o.id, label: o.name }))} .value=${t.from_modes}
            @value-changed=${(e: CustomEvent) => upd(x => (x.timers[i].from_modes = e.detail.value))}></hm-multi-picker>
          <label>between <input type="time" .value=${t.window_start || ''} @change=${(e: any) => upd(x => (x.timers[i].window_start = e.target.value || null))} />
            and <input type="time" .value=${t.window_end || ''} @change=${(e: any) => upd(x => (x.timers[i].window_end = e.target.value || null))} /></label>
          <label><input type="checkbox" .checked=${t.notify} @change=${(e: any) => upd(x => (x.timers[i].notify = e.target.checked))} /> notify</label>
        </div>
        <span class="hm-item-actions">
          <ha-icon-button class="hm-del" .label=${'Delete timer'} title="Delete timer" @click=${() => window.confirm(`Delete this timer of ${m.name}?`) && upd(x => x.timers.splice(i, 1))}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
        </span>
      </div>`)}
      ${!m.timers.length ? html`<div class="secondary hm-hint">None.</div>` : nothing}
      <div class="secondary hm-hint">"At" is the next time that clock time comes round after the mode began (e.g. Late Night → Sleep at 01:00).
        Timers start when this mode begins, survive restarts, and are cancelled when the mode changes. The time window is
        checked when the mode begins. A timer only switches if the target mode allows the "House Mode timers" source.</div>
    `;
  }

  /** The native scripts this mode runs (when entering / leaving, before arming / after the change). */
  private renderSteps(m: HouseMode, other: HouseMode[]) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    const steps = m.steps || [];
    const choices = actionChoices(this.hass);
    const name = (e: string) => (this.hass.states[e]?.attributes.friendly_name as string) || e;
    return html`
      <button class="hm-add" ?disabled=${!choices.length}
        @click=${() => upd(x => (x.steps = [...(x.steps || []), { entity_id: choices[0], when: 'enter', phase: 'after', modes: [], wait: false }]))}>
        <ha-icon icon="mdi:plus"></ha-icon>Script</button>
      ${steps.map((st, i) => html`<div class="hm-item">
        ${entityBadge(this.hass, st.entity_id)}
        <div class="hm-item-body">
          <label>Run
            <select @change=${(e: any) => upd(x => (x.steps![i].entity_id = e.target.value))}>
              ${choices.includes(st.entity_id) ? nothing : html`<option value=${st.entity_id} selected>${st.entity_id} (${st.entity_id.startsWith('scene.') ? 'a scene: replace it with a script' : 'missing'})</option>`}
              ${choices.map(c => html`<option value=${c} ?selected=${c === st.entity_id}>${name(c)}</option>`)}
            </select></label>
          <label>when
            <select @change=${(e: any) => upd(x => (x.steps![i].when = e.target.value))}>
              <option value="enter" ?selected=${st.when === 'enter'}>entering ${m.name}</option>
              <option value="leave" ?selected=${st.when === 'leave'}>leaving ${m.name}</option>
            </select></label>
          <label>
            <select aria-label="Phase" @change=${(e: any) => upd(x => (x.steps![i].phase = e.target.value))}>
              <option value="before" ?selected=${st.phase === 'before'}>before arming</option>
              <option value="after" ?selected=${st.phase === 'after'}>after the change</option>
            </select></label>
          <hm-multi-picker
            .label=${st.when === 'enter' ? 'only when coming from' : 'only when going to'}
            .placeholder=${'any mode'}
            .options=${other.map(o => ({ value: o.id, label: o.name }))}
            .value=${st.modes}
            @value-changed=${(e: CustomEvent) => upd(x => (x.steps![i].modes = e.detail.value))}
          ></hm-multi-picker>
          ${st.entity_id.startsWith('script.')
            ? html`<label title="Wait until the script has finished before the next action (at most 5 minutes)"><input type="checkbox" .checked=${st.wait}
                @change=${(e: any) => upd(x => (x.steps![i].wait = e.target.checked))} /> wait for it</label>`
            : nothing}
        </div>
        <span class="hm-item-actions">
          ${editorPathFor(st.entity_id, this.hass)
            ? html`<ha-icon-button .label=${'Open in Home Assistant'} title="Open in Home Assistant's editor"
                @click=${() => navigate(this, editorPathFor(st.entity_id, this.hass)!)}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`
            : nothing}
          <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.runEntity(st.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
          <ha-icon-button class="hm-del" .label=${'Delete action'} title="Delete action" @click=${() => window.confirm(`Remove ${name(st.entity_id)} from ${m.name}'s Script Actions?`) && upd(x => x.steps!.splice(i, 1))}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
        </span>
      </div>`)}
      ${!steps.length ? html`<div class="secondary hm-hint">None. Actions are Home Assistant scripts; build them in Home Assistant
        (Settings → Automations &amp; scenes → Scripts). A script can turn on a scene if you want one.</div>` : nothing}
      <div class="secondary hm-hint">Order: the old mode's "leaving" actions, then the new mode's "entering" actions.
        <em>Before arming</em> runs before the partitions change (e.g. lock up); <em>after the change</em> once it succeeded.
        Scripts get <code>from_mode</code>, <code>to_mode</code> and <code>source</code>. Actions run only in Live; a failing
        action is logged on the Activity tab and does not stop the change. Scripts named <code>hm_…</code> are listed first.
        When you save, each script gets a "House Mode: &lt;mode&gt;" label, and each script in <code>scripts.yaml</code> a first
        description line such as "House Mode action: Sleep · entering, before arming"; both are written from this list,
        never read back.</div>
    `;
  }

  private item(eid: string): HouseActionItem | undefined {
    return this.actions?.items.find(i => i.entity_id === eid);
  }

  private async runEntity(eid: string) {
    const [domain] = eid.split('.');
    try {
      if (domain === 'automation') await this.hass.callService('automation', 'trigger', { entity_id: eid });
      else if (domain === 'script') await this.hass.callService('script', 'turn_on', { entity_id: eid });
      else await this.hass.callService('scene', 'turn_on', { entity_id: eid });
      toast(this, `Ran ${this.item(eid)?.name || this.hass.states[eid]?.attributes.friendly_name || eid}.`);
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async enableAutomation(i: HouseActionItem, on: boolean) {
    await this.hass.callService('automation', on ? 'turn_on' : 'turn_off', { entity_id: i.entity_id });
    window.setTimeout(() => this.loadActions(), 800);
  }

  private loadActions() {
    fetchHouseActions(this.hass)
      .then(a => (this.actions = a))
      .catch(() => (this.actions = { modes: [], modes_source: 'none', label_prefix: '', items: [] }));
  }

  /** One automation: badge, name (opens HA's editor), when it runs, the Enabled chip and a run button. */
  private autoLine(i: HouseActionItem, hint: string) {
    const p = editorPath(i);
    return html`<div class="hm-line">
      ${entityBadge(this.hass, i.entity_id)}
      <div class="hm-line-name">
        ${p ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => navigate(this, p)}>${i.name}</button>` : html`<span>${i.name}</span>`}
        <span class="secondary">${hint}</span>
      </div>
      <button class="hm-chip ${i.state === 'on' ? 'en' : ''}" title=${i.state === 'on' ? 'Enabled: click to disable' : 'Disabled: click to enable'}
        @click=${() => this.enableAutomation(i, i.state !== 'on')}>${i.state === 'on' ? 'Enabled' : 'Disabled'}</button>
      <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.runEntity(i.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
    </div>`;
  }

  /** Home Assistant automations whose triggers react when this mode starts or ends. */
  private renderRelated(m: HouseMode) {
    if (!this.actions) return html`<div class="secondary hm-hint">Loading…</div>`;
    const r = reactingTo(this.actions.items, m.name);
    const rows = [
      ...r.enter.map(i => this.autoLine(i, i.reacts!.from.includes(m.name) ? `when ${m.name} starts or ends` : `when ${m.name} starts`)),
      ...r.leave.map(i => this.autoLine(i, `when ${m.name} ends`)),
    ];
    return html`
      ${rows.length ? rows : html`<div class="secondary hm-hint">None: no automation has a trigger on this mode.</div>`}
      <div class="secondary hm-hint">Read from the automations' triggers; automations that only use the House Mode as a
        condition are not listed. Change them in Home Assistant's editor (click a name).</div>
    `;
  }

  /** Script Actions - All Modes: one row per script and timing, a column per mode (locked until Unlock to edit). */
  private renderByScript() {
    const d = this.draft!;
    if (!d.modes.length) return nothing;
    const groups = actionGroups(d);
    const pending = this.pendingGroups.filter(p => !groups.some(g => g.entity_id === p.entity_id && g.when === p.when && g.phase === p.phase));
    const rows: ActionGroup[] = [...groups, ...pending.map(p => ({ ...p, modes: [] as string[] }))];
    const choices = actionChoices(this.hass);
    const name = (e: string) => (this.hass.states[e]?.attributes.friendly_name as string) || e;
    const nScripts = new Set(groups.map(g => g.entity_id)).size;
    const nActions = groups.reduce((n, g) => n + g.modes.length, 0);
    const isPending = (g: ActionGroup) => !g.modes.length;
    const change = (g: ActionGroup, to: Partial<Omit<ActionGroup, 'modes'>>) => {
      if (isPending(g)) this.pendingGroups = this.pendingGroups.map(p => (p.entity_id === g.entity_id && p.when === g.when && p.phase === g.phase ? { ...p, ...to } : p));
      else this.draft = updateGroup(d, g, to);
    };
    const tick = (g: ActionGroup, id: string) => {
      const modes = g.modes.includes(id) ? g.modes.filter(x => x !== id) : [...g.modes, id];
      this.draft = setGroupModes(d, g, modes);
      if (!modes.length) this.pendingGroups = [...this.pendingGroups, { entity_id: g.entity_id, when: g.when, phase: g.phase }];
    };
    const remove = (g: ActionGroup) => {
      if (!isPending(g) && !window.confirm(`Remove ${name(g.entity_id)} from every House Mode (${g.modes.length})?`)) return;
      this.pendingGroups = this.pendingGroups.filter(p => !(p.entity_id === g.entity_id && p.when === g.when && p.phase === g.phase));
      if (!isPending(g)) this.draft = removeGroup(d, g);
    };
    const add = () => {
      const used = new Set(rows.map(g => g.entity_id));
      const eid = choices.find(c => !used.has(c)) || choices[0];
      if (eid) this.pendingGroups = [...this.pendingGroups, { entity_id: eid, when: 'enter', phase: 'after' }];
    };
    const locked = BYSCRIPT_LOCK.locked;
    const timing = (g: ActionGroup) => `${g.when === 'enter' ? 'entering' : 'leaving'} · ${g.phase === 'before' ? 'before arming' : 'after the change'}`;
    // the mode filter hides columns; locked, a row no shown mode runs is hidden too (unlocked, every row stays editable)
    const cols = d.modes.filter(m => !MODE_HIDDEN.byscript.has(m.id));
    const shownRows = locked && cols.length < d.modes.length ? rows.filter(g => !g.modes.length || g.modes.some(id => cols.some(m => m.id === id))) : rows;
    return html`<details class="collapse hm-tabsec" ?open=${!!SEC_OPEN['*:byscript']}
        @toggle=${(e: Event) => (SEC_OPEN['*:byscript'] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Script Actions - All Modes</span>
        <span class="secondary" style="display:inline">${nScripts} script${nScripts === 1 ? '' : 's'} · used ${nActions} time${nActions === 1 ? '' : 's'}</span>
      </summary>
      <div class="collapse-body">
        <div class="secondary hm-hint" style="margin-top:0">Every script the House Modes run, one row per script and timing, with a column
          per mode. <strong>Unlock to edit</strong>: tick the modes that run it, change the script or its timing, add or remove
          rows. "Only when coming from" and "wait for it" are set per mode, in the mode's <em>Script Actions</em>. Changes are
          drafts until you Save at the bottom of the page.</div>
        ${this.modeFilter('byscript', d.modes)}
        <div class="toolbar" style="padding-left:0">
          ${lockToggle(locked, () => {
            BYSCRIPT_LOCK.locked = !locked;
            this.requestUpdate();
          })}
          <ha-button ?disabled=${locked || !choices.length} @click=${add}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add script</ha-button>
        </div>
        ${rows.length
          ? html`<div class="table-wrap"><table class="full sa-table">
              <thead><tr>
                <th class="icon"></th><th>Script</th><th>When</th>
                ${cols.map(m => html`<th class="c mode" title=${m.name}><ha-icon icon=${m.icon}
                  style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon></th>`)}
                <th></th>
              </tr></thead>
              <tbody>${shownRows.map(g => html`<tr>
                <td class="icon">${entityBadge(this.hass, g.entity_id)}</td>
                <td class="name">${locked
                  ? html`${name(g.entity_id)}<span class="secondary">${g.entity_id}</span>`
                  : html`<select aria-label="Script" @change=${(e: any) => change(g, { entity_id: e.target.value })}>
                      ${choices.includes(g.entity_id) ? nothing : html`<option value=${g.entity_id} selected>${g.entity_id} (${g.entity_id.startsWith('scene.') ? 'a scene: replace it with a script' : 'missing'})</option>`}
                      ${choices.map(c => html`<option value=${c} ?selected=${c === g.entity_id}>${name(c)}</option>`)}
                    </select>`}</td>
                <td>${locked
                  ? html`<span class="sa-when">${timing(g)}</span>`
                  : html`<select aria-label="When" @change=${(e: any) => change(g, { when: e.target.value })}>
                        <option value="enter" ?selected=${g.when === 'enter'}>entering</option>
                        <option value="leave" ?selected=${g.when === 'leave'}>leaving</option>
                      </select>
                      <select aria-label="Phase" @change=${(e: any) => change(g, { phase: e.target.value })}>
                        <option value="before" ?selected=${g.phase === 'before'}>before arming</option>
                        <option value="after" ?selected=${g.phase === 'after'}>after the change</option>
                      </select>`}</td>
                ${cols.map(m => {
                  const on = g.modes.includes(m.id);
                  const title = `${m.name}: ${on ? `runs ${g.when === 'enter' ? 'entering' : 'leaving'}` : 'not run'}`;
                  return html`<td class="c mode" title=${title}>${locked
                    ? this.modeCell(m, on)
                    : html`<input type="checkbox" class="cb" aria-label=${title} .checked=${on} @change=${() => tick(g, m.id)} />`}</td>`;
                })}
                <td class="row-actions">
                  ${editorPathFor(g.entity_id, this.hass)
                    ? html`<ha-icon-button .label=${'Open in Home Assistant'} title="Open in Home Assistant's editor"
                        @click=${() => navigate(this, editorPathFor(g.entity_id, this.hass)!)}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`
                    : nothing}
                  <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.runEntity(g.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
                  ${locked
                    ? nothing
                    : html`<ha-icon-button class="hm-del" .label=${'Remove from every mode'} title="Remove from every mode" @click=${() => remove(g)}>
                        <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`}
                </td>
              </tr>`)}</tbody>
            </table></div>
            ${rows.length - shownRows.length ? html`<div class="secondary hm-hint">${rows.length - shownRows.length} row${rows.length - shownRows.length === 1 ? '' : 's'} hidden: no shown mode runs ${rows.length - shownRows.length === 1 ? 'it' : 'them'}.</div>` : nothing}`
          : html`<div class="secondary hm-hint">None yet. Unlock to edit, then <em>Add script</em> and tick the modes that run it.</div>`}
      </div>
    </details>`;
  }

  /** A grid cell: the mode's own icon in its color where it applies (easy to follow down a long list), else a dot. */
  private modeCell(m: HouseMode, on: boolean, dim = false) {
    return on
      ? html`<ha-icon class="mode-ic ${dim ? 'dim' : ''}" icon=${m.icon} style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon>`
      : html`<span class="mode-off" aria-hidden="true">·</span>`;
  }

  /** Show / hide the mode columns of an All Modes grid: a checkbox per mode, with its icon. */
  private modeFilter(key: 'byscript' | 'byauto', modes: HouseMode[]) {
    const hidden = MODE_HIDDEN[key];
    const set = (next: Set<string>) => {
      MODE_HIDDEN[key] = next;
      this.requestUpdate();
    };
    return html`<div class="list-filters" style="padding-left:0">
      <span class="secondary" style="display:inline">Modes</span>
      ${modes.map(m => html`<label class="list-filter" title=${m.name}>
        <input type="checkbox" .checked=${!hidden.has(m.id)} @change=${(e: Event) => {
          const next = new Set(hidden);
          if ((e.target as HTMLInputElement).checked) next.delete(m.id);
          else next.add(m.id);
          set(next);
        }} /><ha-icon class="list-filter-ic" icon=${m.icon} style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon>${m.name}</label>`)}
      ${hidden.size
        ? html`<button class="link" @click=${() => set(new Set())}>Show all</button>`
        : html`<button class="link" @click=${() => set(new Set(modes.map(m => m.id)))}>Hide all</button>`}
    </div>`;
  }

  /** The automations that set a House Mode (triggers) or run when one starts or ends (actions), one column per mode. */
  private autoRows(): AutoRow[] {
    const d = this.draft!;
    const byName = (n: string) => d.modes.find(m => m.name.toLowerCase() === n.toLowerCase());
    const out: AutoRow[] = [];
    for (const i of this.actions?.items || []) {
      if (i.kind !== 'automation') continue;
      const sets: AutoRow['modes'] = {};
      for (const x of i.sets || []) {
        const m = x.mode && !x.template ? byName(x.mode) : undefined;
        if (m) sets[m.id] = 'sets';
      }
      if (Object.keys(sets).length) out.push({ item: i, role: 'trigger', modes: sets });
      const r = i.reacts;
      if (!r) continue;
      const acts: AutoRow['modes'] = {};
      for (const m of d.modes) {
        const to = r.any || r.to.some(n => n.toLowerCase() === m.name.toLowerCase());
        const from = r.any || r.from.some(n => n.toLowerCase() === m.name.toLowerCase());
        if (to || from) acts[m.id] = to && from ? 'both' : to ? 'enter' : 'leave';
      }
      if (Object.keys(acts).length) out.push({ item: i, role: 'action', modes: acts });
    }
    return out.sort((a, b) => (a.role === b.role ? a.item.name.localeCompare(b.item.name) : a.role === 'trigger' ? -1 : 1));
  }

  /** Automations - All Modes: every automation that sets a House Mode or runs on one, with a column per mode (read-only). */
  private renderByAutomation() {
    const d = this.draft!;
    if (!d.modes.length) return nothing;
    const rows = this.actions ? this.autoRows() : [];
    const cols = d.modes.filter(m => !MODE_HIDDEN.byauto.has(m.id));
    const shownRows = rows.filter(r => Object.keys(r.modes).some(id => cols.some(m => m.id === id)));
    const nAuto = new Set(rows.map(r => r.item.entity_id)).size;
    const nTrig = rows.filter(r => r.role === 'trigger').length;
    const role = (r: AutoRow) => {
      if (r.role === 'trigger') return 'Trigger · sets the mode';
      if (r.item.reacts?.any) return 'Action · every change';
      const v = Object.values(r.modes);
      return `Action · when it ${v.every(x => x === 'leave') ? 'ends' : v.every(x => x === 'enter') ? 'starts' : 'starts or ends'}`;
    };
    const cellTitle = (r: AutoRow, m: HouseMode) => {
      const v = r.modes[m.id];
      if (!v) return `${m.name}: not used`;
      if (v === 'sets') return `${m.name}: sets it`;
      return `${m.name}: runs when it ${v === 'enter' ? 'starts' : v === 'leave' ? 'ends' : 'starts or ends'}`;
    };
    return html`<details class="collapse hm-tabsec" ?open=${!!SEC_OPEN['*:byauto']}
        @toggle=${(e: Event) => (SEC_OPEN['*:byauto'] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations - All Modes</span>
        <span class="secondary" style="display:inline">${this.actions
          ? `${nAuto} automation${nAuto === 1 ? '' : 's'} · ${nTrig} trigger${nTrig === 1 ? '' : 's'} · ${rows.length - nTrig} action${rows.length - nTrig === 1 ? '' : 's'}`
          : 'loading…'}</span>
      </summary>
      <div class="collapse-body">
        <div class="secondary hm-hint" style="margin-top:0">Every Home Assistant automation that sets a House Mode (<em>Trigger</em>,
          from its actions) or runs when one starts or ends (<em>Action</em>, from its triggers), with a column per mode. A
          faded icon: it runs only when that mode ends. Read from the automations; change them in Home Assistant's editor
          (click a name). Automations that set the mode from a template are listed further down.</div>
        ${this.modeFilter('byauto', d.modes)}
        ${!this.actions
          ? html`<div class="secondary hm-hint">Loading…</div>`
          : rows.length
            ? html`<div class="table-wrap"><table class="full sa-table">
                <thead><tr>
                  <th class="icon"></th><th>Automation</th><th>Role</th>
                  ${cols.map(m => html`<th class="c mode" title=${m.name}><ha-icon icon=${m.icon}
                    style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon></th>`)}
                  <th></th>
                </tr></thead>
                <tbody>${shownRows.map(r => {
                  const p = editorPath(r.item);
                  return html`<tr>
                    <td class="icon">${entityBadge(this.hass, r.item.entity_id)}</td>
                    <td class="name">${p
                      ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => navigate(this, p)}>${r.item.name}</button>`
                      : r.item.name}<span class="secondary">${r.item.entity_id}</span></td>
                    <td><span class="sa-when">${role(r)}</span></td>
                    ${cols.map(m => html`<td class="c mode" title=${cellTitle(r, m)}>${this.modeCell(m, !!r.modes[m.id], r.modes[m.id] === 'leave')}</td>`)}
                    <td class="row-actions">
                      <button class="hm-chip ${r.item.state === 'on' ? 'en' : ''}" title=${r.item.state === 'on' ? 'Enabled: click to disable' : 'Disabled: click to enable'}
                        @click=${() => this.enableAutomation(r.item, r.item.state !== 'on')}>${r.item.state === 'on' ? 'Enabled' : 'Disabled'}</button>
                      <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.runEntity(r.item.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
                    </td>
                  </tr>`;
                })}</tbody>
              </table></div>
              ${rows.length - shownRows.length ? html`<div class="secondary hm-hint">${rows.length - shownRows.length} row${rows.length - shownRows.length === 1 ? '' : 's'} hidden: no shown mode uses ${rows.length - shownRows.length === 1 ? 'it' : 'them'}.</div>` : nothing}`
            : html`<div class="secondary hm-hint">None: no automation sets a House Mode or has a trigger on one.</div>`}
      </div>
    </details>`;
  }

  /** Automations that set the House Mode from a template: which mode is only known when they run. */
  private renderTemplated() {
    const list = this.actions ? settingFromTemplate(this.actions.items) : [];
    if (!list.length) return nothing;
    const warnOf = (i: HouseActionItem) =>
      (i.sets || []).filter(x => x.template).reduce((acc, x) => acc.concat(setterWarnings(x, 'the mode', [...SOURCES])), [] as string[]);
    const nWarn = list.filter(i => warnOf(i).length).length;
    return html`<details class="collapse hm-tabsec" ?open=${!!SEC_OPEN['*:templated']}
        @toggle=${(e: Event) => (SEC_OPEN['*:templated'] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations that set the mode from a template</span>
        <span class="secondary" style="display:inline">${nWarn
          ? html`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>${nWarn} of ${list.length} need a look`
          : `${list.length} automation${list.length === 1 ? '' : 's'} · no problems found`}</span>
      </summary>
      <div class="collapse-body">
        ${list.map(i => {
          const sets = (i.sets || []).filter(x => x.template);
          return html`${this.autoLine(i, sets.map(x => describeSetter(i, x)).join('; '))}
            ${warnOf(i).map(w => html`<div class="hm-line-warn"><ha-icon icon="mdi:alert"></ha-icon>${w}</div>`)}`;
        })}
        <div class="secondary hm-hint">Which mode these set is only known when they run, so they are not listed under a mode's
          Triggers and their mode's Allowed Sources can't be checked here. A warning means the request bypasses House Modes or
          arrives without its source.</div>
      </div>
    </details>`;
  }

  /** Automations that run on every House Mode change (any mode). */
  private renderEveryChange() {
    const any = this.actions ? reactingToAny(this.actions.items) : [];
    if (!any.length) return nothing;
    return html`<details class="collapse hm-tabsec" ?open=${!!SEC_OPEN['*:every']}
        @toggle=${(e: Event) => (SEC_OPEN['*:every'] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations every change triggers</span>
        <span class="secondary" style="display:inline">${any.length} automation${any.length === 1 ? '' : 's'}</span>
      </summary>
      <div class="collapse-body">${any.map(i => this.autoLine(i, 'on every House Mode change'))}</div>
    </details>`;
  }

  // ------------------------------------------------------------------ settings & history

  private renderSettingsRow() {
    const d = this.draft!;
    const selects = Object.keys(this.hass.states).filter(e => e.startsWith('input_select.')).sort();
    const compares = Object.keys(this.hass.states)
      .filter(e => /^(input_select|input_text)\./.test(e))
      .sort();
    const notifies = Object.keys(this.hass.services.notify || {}).map(s => ({ value: `notify.${s}`, label: `notify.${s}` }));
    const opts: string[] = d.input_select ? (this.hass.states[d.input_select]?.attributes.options as string[]) || [] : [];
    const missing = d.modes.map(m => m.name).filter(n => !opts.some(o => o.toLowerCase() === n.toLowerCase()));
    const pick = (value: string | null | undefined, list0: string[], set: (v: string | null) => void, label: string,
      key: 'input_select' | 'current_entity' | 'previous_entity') => {
      // a helper just created may not have a state yet
      const list = value && !list0.includes(value) ? [value, ...list0] : list0;
      return html`<select aria-label=${label} @change=${(e: any) => set(e.target.value || null)}>
          <option value="" ?selected=${!value}>none</option>
          ${list.map(x => html`<option value=${x} ?selected=${value === x}>${this.hass.states[x]?.attributes.friendly_name || x} (${x})</option>`)}
        </select>
        ${!value
          ? html`<button class="link" ?disabled=${!d.modes.length} title=${d.modes.length ? '' : 'Add House Modes first'}
              @click=${() => this.createHelper(key)}>Create a helper</button>`
          : nothing}`;
    };
    const row = (icon: string, title: string, hint: unknown, control: unknown) =>
      html`<div class="hm-row">
        <ha-icon class="hm-row-icon" icon=${icon}></ha-icon>
        <div class="hm-row-label"><strong>${title}</strong><span class="secondary">${hint}</span></div>
        <div class="hm-row-ctl">${control}</div>
      </div>`;
    const nHelpers = [d.input_select, d.current_entity, d.previous_entity].filter(Boolean).length;
    return this.tabSec('helpers', 'Helpers', `${nHelpers} of 3 helpers`, false, html`
      <div class="hm-rows">
        ${row('mdi:form-dropdown', 'House Mode selector',
          'Your input_select that people and automations change. Kept in step both ways; its options must match the mode names.',
          html`${pick(d.input_select, selects, v => this.set(x => (x.input_select = v)), 'House Mode selector', 'input_select')}
            ${d.input_select && d.modes.length && this.hass.states[d.input_select]
              ? missing.length
                ? html`<div class="notice warn" style="margin:6px 0 0">Missing options on ${d.input_select}: ${missing.join(', ')}.
                    <button class="link" @click=${() => this.addMissingOptions(d.input_select!, missing)}>Add them</button></div>`
                : html`<div class="secondary hm-ok"><ha-icon icon="mdi:check-circle"></ha-icon>Its options match the ${d.modes.length} modes.</div>`
              : nothing}`)}
        ${row('mdi:home-outline', 'Current House Mode',
          'Optional. Live writes the mode name here after each change; Shadow compares it with what House Modes would have set.',
          pick(d.current_entity, compares, v => this.set(x => (x.current_entity = v)), 'Current House Mode', 'current_entity'))}
        ${row('mdi:history', 'Previous House Mode', 'Optional. Live writes the mode it changed from here.',
          pick(d.previous_entity, compares, v => this.set(x => (x.previous_entity = v)), 'Previous House Mode', 'previous_entity'))}
      </div>
      <div class="secondary" style="margin:0 16px 12px">House Mode notifications are on the
        <a href="/house_modes/notifications/open/house" @click=${(e: Event) => { e.preventDefault(); navigate(this, '/house_modes/notifications/open/house'); }}>Notifications</a>
        tab. Lock keypads and per-user keypad actions are on the <a href="/house_modes/codes">Users, Codes, Keypads</a> tab.</div>
    `);
  }

  private async save() {
    this.busy = true;
    this.error = '';
    try {
      // the notifications are saved on the Notifications tab
      const { notifications: _n, ...settings } = this.draft as any;
      await saveHouse(this.hass, settings);
      toast(this, 'House Modes saved.');
      await this.refresh(true);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  static styles = [
    extStyles,
    css`
      .hm-sub {
        padding: 12px 16px 0;
        border-top: 1px solid var(--divider-color);
        margin-top: 8px;
        color: var(--accent-color);
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .hm-rows {
        padding: 4px 16px 8px;
      }
      .hm-row {
        display: grid;
        grid-template-columns: 28px minmax(200px, 340px) minmax(240px, 520px);
        gap: 6px 14px;
        align-items: start;
        padding: 10px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .hm-row:last-child {
        border-bottom: none;
      }
      .hm-row-icon {
        color: var(--primary-color);
        --mdc-icon-size: 22px;
        padding-top: 2px;
      }
      .hm-row-label {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .hm-row-ctl select {
        width: 100%;
      }
      .hm-ok {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 6px;
      }
      .hm-ok ha-icon {
        --mdc-icon-size: 16px;
        color: var(--success-color, #4caf50);
      }
      .hm-check {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .hm-skip {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 8px;
      }
      .hm-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 2px 10px;
        background: none;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }
      .hm-chip.on {
        border-color: var(--accent-color);
        color: var(--accent-color);
        text-decoration: line-through;
      }
      details.collapse.hm-tabsec {
        margin: 8px 16px 12px;
      }
      .hm-tabsec-body {
        padding: 0 0 8px;
      }
      .hm-desc {
        padding-top: 8px;
      }
      .hm-tabsec-body .hm-rows {
        padding: 4px 12px 8px;
      }
      .hm-status-line {
        padding: 0 16px 12px;
      }
      .hm-status {
        margin-top: 10px;
      }
      .notice .hm-status {
        margin-top: 12px;
      }
      .hm-counts {
        display: block;
      }
      .hm-noswitch {
        visibility: hidden;
      }
      /* the open mode: an accent outline, not an indent (CARD_DESIGN_SYSTEM) */
      tr.hm-detail td {
        background: none;
        padding: 0 8px 12px;
      }
      .hm-ed {
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 8px 4px 4px;
      }
      .hm-ed details.collapse.sub {
        margin: 0 8px 8px;
      }
      details.collapse.sub[open] {
        border-color: var(--accent-color);
      }
      .hm-every {
        margin: 4px 16px 12px !important;
      }
      .hm-fields {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 8px 8px;
      }
      .hm-sec .hm-fields {
        padding: 0 0 4px;
      }
      .hm-f {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 2px 0;
      }
      .hm-f input[type='text'] {
        flex: 1 1 220px;
        max-width: 420px;
        min-width: 0;
      }
      .hm-hint {
        display: block;
        margin: 6px 0 2px;
      }
      .hm-add {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px dashed var(--primary-color);
        border-radius: 6px;
        background: none;
        color: var(--primary-color);
        font: inherit;
        font-size: 13px;
        padding: 3px 10px;
        margin: 0 0 6px;
        cursor: pointer;
      }
      .hm-add[disabled] {
        opacity: 0.5;
        cursor: default;
      }
      .hm-add ha-icon {
        --mdc-icon-size: 16px;
      }
      .hm-item,
      .hm-line {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 0;
        border-top: 1px solid var(--divider-color);
      }
      .hm-item-icon {
        color: var(--primary-color);
        margin: 0 8px;
      }
      .hm-item-body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 16px;
        flex: 1 1 auto;
        min-width: 0;
      }
      .hm-item-body label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .hm-item-actions {
        display: flex;
        align-items: center;
        flex: none;
      }
      .hm-del:hover {
        color: var(--error-color);
      }
      .hm-line-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .hm-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 8px 0 2px;
      }
      .hm-group:first-child {
        margin-top: 0;
      }
      .hm-warn-icon {
        --mdc-icon-size: 16px;
        color: var(--warning-color, #ff9800);
        margin-right: 4px;
        vertical-align: -2px;
      }
      .hm-line-warn {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        color: var(--warning-color, #ff9800);
        font-size: 13px;
        padding: 0 0 6px 44px;
      }
      .hm-line-warn ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
      }
      .hm-warn {
        margin: 0 0 8px !important;
      }
      .sa-table th.mode,
      .sa-table td.mode {
        width: 34px;
        padding-left: 2px;
        padding-right: 2px;
      }
      .sa-table th.mode ha-icon {
        --mdc-icon-size: 20px;
      }
      .sa-table td select {
        max-width: 240px;
      }
      .sa-when {
        white-space: nowrap;
      }
      .hm-modes {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .hm-chip.en {
        border-color: var(--primary-color);
        color: var(--primary-color);
        text-decoration: none;
      }
      @media (max-width: 760px) {
        .hm-row {
          grid-template-columns: 28px 1fr;
        }
        .hm-row-ctl {
          grid-column: 2;
        }
      }
    `,
  ];
}
