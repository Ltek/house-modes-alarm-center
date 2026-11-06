// House Modes tab: current mode, mode editor (partitions, who may change it, readiness,
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
  fetchShadow,
  detectHouse,
  applyDetected,
  DetectResult,
  runState,
  setRunState,
  ShadowEntry,
  ShadowSummary,
  modeErrors,
  newMode,
  removeMode,
  defaultModeColor,
  toHex,
  saveHouse,
  setHouseMode,
  actionChoices,
  describeTimer,
  ActionGroup,
  actionGroups,
  setGroupModes,
  updateGroup,
  removeGroup,
} from '../../data/house';
import { extStyles } from './ext-styles';
import { HouseActionItem, HouseActionsInfo, editorPath, fetchHouseActions, reactingTo, reactingToAny } from '../../data/house-actions';

/** HA editor path for a scene/script entity (scenes need their config id). */
const editorPathFor = (entityId: string, hass: HomeAssistant): string | null => {
  const [domain, obj] = entityId.split('.');
  if (domain === 'script') return `/config/script/edit/${obj}`;
  const id = hass.states[entityId]?.attributes.id;
  return domain === 'scene' && id ? `/config/scene/edit/${id}` : null;
};
import './slider-field';
import { roleChip, sectionHead, entityBadge } from './page-intro';
import { navigate } from '../../helpers';
import './multi-picker';
import './icon-field';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
/** Which editor sections are open, per mode (module-level: kept across re-renders, saves and tab changes). */
const SEC_OPEN: Record<string, boolean> = {};
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

@customElement('alarm-view-house')
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
  @state() private shadow?: { log: ShadowEntry[]; summary: ShadowSummary };
  @state() private shadowAll = false;
  @state() private detect?: DetectResult;
  @state() private detectPick: string[] = [];
  @state() private detecting = false;
  /** script rows added on "House Mode Actions by script" that no mode runs yet */
  @state() private pendingGroups: Omit<ActionGroup, 'modes'>[] = [];

  firstUpdated() {
    this.refresh();
    this.loadActions();
  }

  private async refresh(resetDraft = false) {
    try {
      this.info = await fetchHouse(this.hass);
      if (runState(this.info.settings) === 'shadow') this.shadow = await fetchShadow(this.hass).catch(() => undefined);
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
      ${this.renderCurrent()} ${this.renderShadow()}
      <ha-card><div class="toolbar"><ha-icon icon="mdi:history"></ha-icon>House Mode history and every sequence around it are on the <a href="/alarmo/activity">Activity</a> tab.</div></ha-card>
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
    return html`
      <ha-card>${sectionHead('House Modes', 'settings')}
        <div class="card-content desc">
          <p>A House Mode says what is going on at home — Away, Stay, Guest, Spa, … Each mode:</p>
          <ul>
            <li>sets the partitions to an Arm Mode (or leaves them alone);</li>
            <li>decides <strong>who may change it</strong>: you, schedules, presence, a lock code, the keypad;</li>
            <li>can check that zones are closed, and can change itself back after a while.</li>
          </ul>
          <p>Each mode can run your scripts as its <em>actions</em> (lock up, lights, …). Automations can also
            react to <code>select.alarmo_house_mode</code> or the <code>alarmo_house_mode_changed</code> event, and change
            the mode with <code>alarmo.set_house_mode</code> (mode + source).</p>
        </div>
        <div class="toolbar">
          <span>House Modes</span>
          ${(['off', 'shadow', 'live'] as const).map(
            v => html`<label><input type="radio" name="hm-run" .checked=${runState(this.draft!) === v}
                @change=${() => this.set(d => setRunState(d, v))} />${v === 'off' ? 'Off' : v === 'shadow' ? 'Shadow' : 'Live'}</label>`
          )}
          <span class="grow"></span>
          ${s.enabled
            ? html`<span>${runState(s) === 'shadow' ? 'Would be' : 'Now'}: <strong>${cur ? cur.name : 'unknown'}</strong>
                ${s.changed_at ? html`<span class="secondary" style="display:inline">since ${formatDate(s.changed_at, this.hass.language)} (${s.source})</span>` : nothing}</span>`
            : html`<span class="secondary" style="display:inline">Off — choose Shadow or Live and save to start.</span>`}
        </div>
        ${runState(this.draft!) === 'shadow'
          ? html`<div class="notice" style="margin:0 16px 12px">
              <strong>Shadow:</strong> House Modes run next to your own automations and change nothing. Each request
              (your input_select, the House Mode select, a lock code, a timer) is checked the way Live would handle it,
              then compared with what your automations really did. Nothing is armed or disarmed, no script
              runs, no notification is sent, and the input_select is never written.
            </div>`
          : nothing}
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

  // ------------------------------------------------------------------ shadow

  private renderShadow() {
    if (runState(this.info!.settings) !== 'shadow') return nothing;
    const sh = this.shadow;
    const log = sh ? [...sh.log].reverse() : [];
    const shown = this.shadowAll ? log : log.slice(0, 30);
    const icon = (ok: boolean | null) =>
      ok === true
        ? html`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#4caf50)"></ha-icon>`
        : ok === false
          ? html`<ha-icon icon="mdi:alert-circle" style="color:var(--error-color)"></ha-icon>`
          : html`<ha-icon icon="mdi:information-outline" style="color:var(--secondary-text-color)"></ha-icon>`;
    return html`
      <ha-card>${sectionHead('Shadow comparison', 'settings')}
        <div class="card-content desc">
          <p>What House Modes would have done, next to what your automations did.</p>
          <ul>
            <li><strong>✓</strong> your automations ended where House Modes would have;</li>
            <li><strong>✗</strong> they differ: read the line, then fix the House Mode or your automation;</li>
            <li>the same lines are on the <a href="/alarmo/activity">Activity</a> tab, marked <em>[shadow]</em>. This list
              starts again after a restart.</li>
          </ul>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" @click=${() => this.refresh()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
          ${sh
            ? html`<span>${sh.summary.matched} matched · <strong>${sh.summary.differed} differed</strong>${sh.summary.watching ? ' · watching a change…' : ''}</span>`
            : nothing}
        </div>
        ${shown.length
          ? html`<div class="table-wrap"><table class="full">
              <tbody>
                ${shown.map(
                  e => html`<tr>
                    <td style="width:28px">${icon(e.ok)}</td>
                    <td style="white-space:nowrap" class="secondary">${new Date(e.t * 1000).toLocaleString()}</td>
                    <td>${e.msg}</td>
                  </tr>`
                )}
              </tbody>
            </table></div>
            ${log.length > 30 && !this.shadowAll
              ? html`<div class="toolbar"><button class="link" @click=${() => (this.shadowAll = true)}>Show all ${log.length}</button></div>`
              : nothing}`
          : html`<div class="empty">Nothing yet. Lines appear when the House Mode is requested or the partitions change.</div>`}
      </ha-card>
    `;
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
    return html`
      <div class="hm-sub">Modes (${d.modes.length})</div>
        <div class="card-content desc" style="padding-top:4px">
          <p><ha-icon icon="mdi:play-circle-outline" style="--mdc-icon-size:18px"></ha-icon> switches to a mode now.
            The pencil edits it: which partitions it arms, who may switch into or out of it, readiness checks, what happens
            if arming fails, timers, the scripts it runs (House Mode Actions) and the automations it triggers. Save at the
            bottom of the page.</p>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${this.detecting} @click=${() => this.runDetect()}><ha-icon slot="start" icon="mdi:magnify-scan"></ha-icon>Detect from your input_selects</ha-button>
          <ha-button appearance="plain" @click=${this.addMode}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add House Mode</ha-button>
          ${!d.modes.length ? html`<ha-button appearance="plain" @click=${this.addStarter}><ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>Add starter modes</ha-button>` : nothing}
          ${this.dirty ? html`<span class="secondary" style="display:inline">Save before switching modes.</span>` : nothing}
        </div>
        ${this.detect ? this.renderDetect() : nothing}
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
                      <td class="name">${m.name}${m.id === cur ? html`<span class="secondary">${shadow ? 'current (would be)' : 'current'}</span>` : nothing}</td>
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
                          @click=${() => window.confirm(`Delete ${m.name}?`) && (this.draft = removeMode(this.draft!, m.id))}>
                          <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
                      </td>
                    </tr>
                    ${open ? html`<tr class="detail hm-detail"><td colspan="4">${this.renderEditor(m)}</td></tr>` : nothing}
                  `;
                })}
              </tbody>
            </table></div>`
          : nothing}
        ${this.renderByScript()}
        ${this.renderEveryChange()}
    `;
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
    return html`
      <div class="hm-ed">
        <div class="hm-fields">
          <label class="hm-f">Name <input type="text" .value=${m.name} @change=${(e: any) => upd(x => (x.name = e.target.value))} /></label>
          <div class="hm-f"><alarmo-ext-icon-field .hass=${this.hass} .value=${m.icon} .placeholder=${'home'}
            @value-changed=${(e: CustomEvent) => upd(x => (x.icon = e.detail.value || 'mdi:home'))}></alarmo-ext-icon-field></div>
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
        ${this.sec(m, 'sources', 'Who may change it', `${nIn} of ${SOURCES.length} may switch in · ${nOut} may switch out`, html`
          <div class="table-wrap"><table>
            <thead><tr><th>Source</th><th class="c" title="May switch INTO this mode">Into this mode</th><th class="c" title="May change the mode while this mode is active">Out of this mode</th><th title="Instead of blocking, wait this many minutes">Delay out (min)</th></tr></thead>
            <tbody>${SOURCES.map(src => html`<tr>
              <td>${SOURCE_LABELS[src]}</td>
              <td class="c"><input type="checkbox" .checked=${m.enter_sources.includes(src)} @change=${(e: any) => upd(x => (x.enter_sources = e.target.checked ? [...x.enter_sources, src] : x.enter_sources.filter(s => s !== src)))} /></td>
              <td class="c"><input type="checkbox" .checked=${m.leave_sources.includes(src)} @change=${(e: any) => upd(x => (x.leave_sources = e.target.checked ? [...x.leave_sources, src] : x.leave_sources.filter(s => s !== src)))} /></td>
              <td><alarmo-ext-slider compact optional .label=${`${SOURCE_LABELS[src]}: delay out`} .min=${1} .max=${120} .onValue=${10}
                unit="min" offText="no delay" .value=${m.delay_sources[src] || null}
                @value-changed=${(e: CustomEvent) => upd(x => {
                  if (e.detail.value) x.delay_sources[src] = e.detail.value;
                  else delete x.delay_sources[src];
                })}></alarmo-ext-slider></td>
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
        ${this.sec(m, 'timers', 'Timers', m.timers.length ? m.timers.map(t => describeTimer(t, this.nameOf)).join(' · ') : 'none', this.renderTimers(m, other))}
        ${this.sec(m, 'actions', 'House Mode Actions', plural((m.steps || []).length, 'script'), this.renderSteps(m, other))}
        ${this.sec(m, 'automations', 'Automations this mode triggers', this.actions ? plural(nAuto, 'automation') : 'loading…', this.renderRelated(m))}
      </div>
    `;
  }

  private nameOf = (id: string) => this.draft?.modes.find(m => m.id === id)?.name || id;

  private renderTimers(m: HouseMode, other: HouseMode[]) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    return html`
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
            : html`<alarmo-ext-slider .label=${''} .min=${1} .max=${720} unit="min" .value=${t.after_minutes || 10}
                @value-changed=${(e: CustomEvent) => upd(x => (x.timers[i].after_minutes = Math.max(1, e.detail.value || 1)))}></alarmo-ext-slider>`}
          <label>go to <select @change=${(e: any) => upd(x => (x.timers[i].then = e.target.value))}>
            <option value="previous" ?selected=${t.then === 'previous'}>the previous mode</option>
            ${other.map(o => html`<option value=${o.id} ?selected=${t.then === o.id}>${o.name}</option>`)}
          </select></label>
          <alarmo-ext-multi-picker .label=${'only when coming from'} .placeholder=${'any mode'}
            .options=${other.map(o => ({ value: o.id, label: o.name }))} .value=${t.from_modes}
            @value-changed=${(e: CustomEvent) => upd(x => (x.timers[i].from_modes = e.detail.value))}></alarmo-ext-multi-picker>
          <label>between <input type="time" .value=${t.window_start || ''} @change=${(e: any) => upd(x => (x.timers[i].window_start = e.target.value || null))} />
            and <input type="time" .value=${t.window_end || ''} @change=${(e: any) => upd(x => (x.timers[i].window_end = e.target.value || null))} /></label>
          <label><input type="checkbox" .checked=${t.notify} @change=${(e: any) => upd(x => (x.timers[i].notify = e.target.checked))} /> notify</label>
        </div>
        <span class="hm-item-actions">
          <ha-icon-button class="hm-del" .label=${'Delete timer'} title="Delete timer" @click=${() => upd(x => x.timers.splice(i, 1))}>
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
          <alarmo-ext-multi-picker
            .label=${st.when === 'enter' ? 'only when coming from' : 'only when going to'}
            .placeholder=${'any mode'}
            .options=${other.map(o => ({ value: o.id, label: o.name }))}
            .value=${st.modes}
            @value-changed=${(e: CustomEvent) => upd(x => (x.steps![i].modes = e.detail.value))}
          ></alarmo-ext-multi-picker>
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
          <ha-icon-button class="hm-del" .label=${'Delete action'} title="Delete action" @click=${() => upd(x => x.steps!.splice(i, 1))}>
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

  /** House Mode Actions grouped by script: one row per script and timing, with a chip per mode. */
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
      this.pendingGroups = this.pendingGroups.filter(p => !(p.entity_id === g.entity_id && p.when === g.when && p.phase === g.phase));
      if (!isPending(g)) this.draft = removeGroup(d, g);
    };
    const add = () => {
      const used = new Set(rows.map(g => g.entity_id));
      const eid = choices.find(c => !used.has(c)) || choices[0];
      if (eid) this.pendingGroups = [...this.pendingGroups, { entity_id: eid, when: 'enter', phase: 'after' }];
    };
    return html`<details class="collapse sub hm-sec hm-every" ?open=${!!SEC_OPEN['*:byscript']}
        @toggle=${(e: Event) => (SEC_OPEN['*:byscript'] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">House Mode Actions by script</span>
        <span class="secondary" style="display:inline">${nScripts} script${nScripts === 1 ? '' : 's'} · used ${nActions} time${nActions === 1 ? '' : 's'}</span>
      </summary>
      <div class="collapse-body">
        <button class="hm-add" ?disabled=${!choices.length} @click=${add}><ha-icon icon="mdi:plus"></ha-icon>Script</button>
        ${rows.map(g => html`<div class="hm-item">
          ${entityBadge(this.hass, g.entity_id)}
          <div class="hm-item-body">
            <label>Run
              <select @change=${(e: any) => change(g, { entity_id: e.target.value })}>
                ${choices.includes(g.entity_id) ? nothing : html`<option value=${g.entity_id} selected>${g.entity_id} (${g.entity_id.startsWith('scene.') ? 'a scene: replace it with a script' : 'missing'})</option>`}
                ${choices.map(c => html`<option value=${c} ?selected=${c === g.entity_id}>${name(c)}</option>`)}
              </select></label>
            <label>
              <select aria-label="When" @change=${(e: any) => change(g, { when: e.target.value })}>
                <option value="enter" ?selected=${g.when === 'enter'}>entering</option>
                <option value="leave" ?selected=${g.when === 'leave'}>leaving</option>
              </select></label>
            <label>
              <select aria-label="Phase" @change=${(e: any) => change(g, { phase: e.target.value })}>
                <option value="before" ?selected=${g.phase === 'before'}>before arming</option>
                <option value="after" ?selected=${g.phase === 'after'}>after the change</option>
              </select></label>
            <span class="hm-modes">
              ${d.modes.map(m => {
                const on = g.modes.includes(m.id);
                return html`<button class="hm-chip ${on ? 'en' : ''}" aria-pressed=${on}
                  title=${on ? `Runs ${g.when === 'enter' ? 'entering' : 'leaving'} ${m.name}: click to remove` : `Click to run it ${g.when === 'enter' ? 'entering' : 'leaving'} ${m.name}`}
                  @click=${() => tick(g, m.id)}>${m.name}</button>`;
              })}
            </span>
          </div>
          <span class="hm-item-actions">
            ${editorPathFor(g.entity_id, this.hass)
              ? html`<ha-icon-button .label=${'Open in Home Assistant'} title="Open in Home Assistant's editor"
                  @click=${() => navigate(this, editorPathFor(g.entity_id, this.hass)!)}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`
              : nothing}
            <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.runEntity(g.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
            <ha-icon-button class="hm-del" .label=${'Remove from every mode'} title="Remove from every mode" @click=${() => remove(g)}>
              <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
          </span>
        </div>`)}
        ${!rows.length ? html`<div class="secondary hm-hint">None yet. Add a script, then tick the modes that run it.</div>` : nothing}
        <div class="secondary hm-hint">One row per script and timing: tick every mode that runs it, and set entering or leaving
          and before arming or after the change once. A script that runs differently in some modes has a row for each timing.
          "Only when coming from" and "wait for it" are set per mode, in the mode's <em>House Mode Actions</em>. Save at the
          bottom of the page.</div>
      </div>
    </details>`;
  }

  /** Automations that run on every House Mode change (any mode). */
  private renderEveryChange() {
    const any = this.actions ? reactingToAny(this.actions.items) : [];
    if (!any.length) return nothing;
    return html`<details class="collapse sub hm-sec hm-every" ?open=${!!SEC_OPEN['*:every']}
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
    const pick = (value: string | null | undefined, list: string[], set: (v: string | null) => void, label: string) =>
      html`<select aria-label=${label} @change=${(e: any) => set(e.target.value || null)}>
        <option value="" ?selected=${!value}>none</option>
        ${list.map(x => html`<option value=${x} ?selected=${value === x}>${this.hass.states[x].attributes.friendly_name || x} (${x})</option>`)}
      </select>`;
    const row = (icon: string, title: string, hint: unknown, control: unknown) =>
      html`<div class="hm-row">
        <ha-icon class="hm-row-icon" icon=${icon}></ha-icon>
        <div class="hm-row-label"><strong>${title}</strong><span class="secondary">${hint}</span></div>
        <div class="hm-row-ctl">${control}</div>
      </div>`;
    return html`
      <div class="hm-sub">Helpers and notifications</div>
      <div class="hm-rows">
        ${row('mdi:form-dropdown', 'House Mode selector',
          'Your input_select that people and automations change. Kept in step both ways; its options must match the mode names.',
          html`${pick(d.input_select, selects, v => this.set(x => (x.input_select = v)), 'House Mode selector')}
            ${d.input_select && d.modes.length
              ? missing.length
                ? html`<div class="notice warn" style="margin:6px 0 0">Missing options on ${d.input_select}: ${missing.join(', ')}.</div>`
                : html`<div class="secondary hm-ok"><ha-icon icon="mdi:check-circle"></ha-icon>Its options match the ${d.modes.length} modes.</div>`
              : nothing}`)}
        ${row('mdi:home-outline', 'Current House Mode',
          'Optional. Live writes the mode name here after each change; Shadow compares it with what House Modes would have set.',
          pick(d.current_entity, compares, v => this.set(x => (x.current_entity = v)), 'Current House Mode'))}
        ${row('mdi:history', 'Previous House Mode', 'Optional. Live writes the mode it changed from here.',
          pick(d.previous_entity, compares, v => this.set(x => (x.previous_entity = v)), 'Previous House Mode'))}
        ${row('mdi:bell-outline', 'Notifications', 'Where House Mode messages go: blocked, failed to arm, timers, and every change if you tick it.',
          html`<alarmo-ext-multi-picker
            .placeholder=${'Add a notify service…'}
            .options=${notifies}
            .value=${d.notify_services || []}
            @value-changed=${(e: CustomEvent) => this.set(x => (x.notify_services = e.detail.value))}
          ></alarmo-ext-multi-picker>
          <label class="hm-check"><input type="checkbox" .checked=${!!d.notify_changes}
              @change=${(e: any) => this.set(x => (x.notify_changes = e.target.checked))} />
            Notify on every change <span class="secondary" style="display:inline">e.g. "House Mode: Stay — from Disarmed · timer"</span></label>
          ${d.notify_changes
            ? html`<div class="hm-skip"><span class="secondary" style="display:inline">Not for changes by:</span>
                ${[...SOURCES, 'external'].map(src => {
                  const on = (d.notify_skip_sources || []).includes(src);
                  return html`<button class="hm-chip ${on ? 'on' : ''}" aria-pressed=${on} title=${on ? 'Not notified' : 'Notified'}
                    @click=${() => this.set(x => (x.notify_skip_sources = on ? (x.notify_skip_sources || []).filter(v => v !== src) : [...(x.notify_skip_sources || []), src]))}>
                    ${src === 'external' ? 'Outside House Modes' : SOURCE_LABELS[src]}</button>`;
                })}</div>`
            : nothing}
          ${(d.notify_changes || false) && !(d.notify_services || []).length
            ? html`<div class="notice warn" style="margin:6px 0 0">Add a notify service, or nothing is sent.</div>`
            : nothing}`)}
      </div>
      <div class="secondary" style="margin:0 16px 12px">Lock keypads and per-user keypad actions are on the
        <a href="/alarmo/codes">Users, Codes, Keypads</a> tab.</div>
    `;
  }

  private async save() {
    this.busy = true;
    this.error = '';
    try {
      await saveHouse(this.hass, this.draft!);
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
