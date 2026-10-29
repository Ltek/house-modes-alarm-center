// House Modes tab: current mode, mode editor (partitions, who may change it, readiness,
// failure handling, timers), input_select mirror, lock keypads, history.
import { LitElement, html, nothing } from 'lit';
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
  runState,
  setRunState,
  ShadowEntry,
  ShadowSummary,
  modeErrors,
  newMode,
  removeMode,
  saveHouse,
  setHouseMode,
} from '../../data/house';
import { extStyles } from './ext-styles';
import { HouseActionsInfo, editorPath, fetchHouseActions, itemsForMode } from '../../data/house-actions';

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

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
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

  firstUpdated() {
    this.refresh();
    fetchHouseActions(this.hass)
      .then(a => (this.actions = a))
      .catch(() => (this.actions = { modes: [], modes_source: 'none', label_prefix: '', items: [] }));
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
      ${this.renderCurrent()} ${this.renderShadow()} ${this.renderModes()}
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
      <ha-card>${sectionHead('House Mode', 'settings')}
        <div class="card-content desc">
          <p>A House Mode says what is going on at home — Away, Stay, Guest, Spa, … Each mode:</p>
          <ul>
            <li>sets the partitions to an Arm Mode (or leaves them alone);</li>
            <li>decides <strong>who may change it</strong>: you, schedules, presence, a lock code, the keypad;</li>
            <li>can check that zones are closed, and can change itself back after a while.</li>
          </ul>
          <p>Lights, locks and other actions stay in your automations: trigger them on
            <code>select.alarmo_house_mode</code> or the <code>alarmo_house_mode_changed</code> event. Automations change
            the mode with <code>alarmo.set_house_mode</code> (mode + source).</p>
          <p><em>House Mode input_select entity</em> — an existing input_select kept in step both ways; its options must
            match the mode names. <em>Notifications</em> — where House Mode messages go. Lock keypads and per-user keypad
            actions are on the <a href="/alarmo/codes">Users, Codes, Keypads</a> tab.</p>
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
              then compared with what your automations really did. Nothing is armed or disarmed, no scene or script
              runs, no notification is sent, and the input_select is never written.
            </div>`
          : nothing}
        ${s.enabled && s.modes.length
          ? html`<div class="toolbar">
              ${s.modes.map(m => html`<ha-button appearance=${m.id === s.current ? 'filled' : 'plain'} ?disabled=${this.busy || this.dirty} @click=${() => this.choose(m.id)}>
                <ha-icon slot="start" icon=${m.icon}></ha-icon>${m.name}</ha-button>`)}
              ${this.dirty ? html`<span class="secondary" style="display:inline">Save first.</span>` : nothing}
            </div>`
          : nothing}
        ${this.renderSettingsRow()}
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
    return html`
      <ha-card>${sectionHead(`Modes (${d.modes.length})`, 'settings')}
        <div class="card-content desc">
          <p>Open a mode (▸) to set which partitions it arms, who may switch into or out of it, readiness checks, what
            happens if arming fails, and timers. Save at the bottom of the page.</p>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" @click=${this.addMode}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add House Mode</ha-button>
          ${!d.modes.length ? html`<ha-button appearance="plain" @click=${this.addStarter}><ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>Add starter modes</ha-button>` : nothing}
        </div>
        ${d.modes.map(m => {
          const open = this.open.includes(m.id);
          return html`
            <div class="toolbar" style="border-top:1px solid var(--divider-color)">
              <button class="link" @click=${() => (this.open = open ? this.open.filter(x => x !== m.id) : [...this.open, m.id])}>${open ? '▾' : '▸'}</button>
              <ha-icon icon=${m.icon}></ha-icon><strong>${m.name}</strong>
              <span class="secondary grow" style="display:inline">${describeTargets(m, names, s => STATE_LABEL[s] || s)}</span>
              <button class="link" @click=${() => window.confirm(`Delete ${m.name}?`) && (this.draft = removeMode(this.draft!, m.id))}>Delete</button>
            </div>
            ${open ? this.renderEditor(m) : nothing}
          `;
        })}
      </ha-card>
    `;
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

  private renderEditor(m: HouseMode) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    const other = this.draft!.modes.filter(x => x.id !== m.id);
    return html`
      <div class="notice" style="margin:0 16px 12px">
        <div class="detail-grid">
          <label>Name <input type="text" .value=${m.name} @change=${(e: any) => upd(x => (x.name = e.target.value))} /></label>
          <label>Icon <input type="text" .value=${m.icon} @change=${(e: any) => upd(x => (x.icon = e.target.value || 'mdi:home'))} /></label>
          <label title="What happens when a partition does not arm">If arming fails
            <select @change=${(e: any) => upd(x => (x.on_failure = e.target.value))}>
              <option value="undo" ?selected=${m.on_failure === 'undo'}>undo (back to how it was)</option>
              <option value="keep" ?selected=${m.on_failure === 'keep'}>keep what armed (mode unknown)</option>
              <option value="previous" ?selected=${m.on_failure === 'previous'}>go to the previous mode</option>
            </select>
          </label>
        </div>
        <h4 style="margin:8px 0 4px">Partitions</h4>
        <div class="detail-grid">
          ${this.info!.targets.map(t => html`<label>${t.name}
            <select @change=${(e: any) => upd(x => {
              if (e.target.value === '') delete x.targets[t.key];
              else x.targets[t.key] = e.target.value;
            })}>
              <option value="" ?selected=${!m.targets[t.key]}>leave unchanged</option>
              ${TARGET_STATES.map(s => html`<option value=${s} ?selected=${m.targets[t.key] === s}>${STATE_LABEL[s]}</option>`)}
            </select></label>`)}
        </div>
        <span class="secondary" style="display:block">Leave everything unchanged for a mode that only tells your automations what is going on.</span>
        <h4 class="subhead" style="margin:8px 0 4px">Who may change it</h4>
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
        </table></div>
        <h4 style="margin:8px 0 4px">Readiness</h4>
        <div class="detail-grid">
          <label>Entities that should be closed <input type="text" style="width:320px" placeholder="binary_sensor.patio_door, …" .value=${m.readiness.entities.join(', ')}
            @change=${(e: any) => upd(x => (x.readiness.entities = list(e.target.value)))} /></label>
          <label>…or with label (ids) <input type="text" placeholder="windows" .value=${m.readiness.labels.join(', ')}
            @change=${(e: any) => upd(x => (x.readiness.labels = list(e.target.value)))} /></label>
          <label>If open
            <select @change=${(e: any) => upd(x => (x.readiness.action = e.target.value))}>
              <option value="warn" ?selected=${m.readiness.action === 'warn'}>warn and continue</option>
              <option value="block" ?selected=${m.readiness.action === 'block'}>do not change the mode</option>
            </select></label>
        </div>
        <h4 class="subhead" style="margin:8px 0 4px">Timers</h4>
        <button class="link" @click=${() => upd(x => x.timers.push({ after_minutes: 10, then: 'previous', from_modes: [], window_start: null, window_end: null, notify: true }))}>+ Add timer</button>
        ${m.timers.map((t, i) => html`<div class="detail-grid">
          <alarmo-ext-slider .label=${'After'} .min=${1} .max=${720} unit="min" .value=${t.after_minutes}
            @value-changed=${(e: CustomEvent) => upd(x => (x.timers[i].after_minutes = Math.max(1, e.detail.value || 1)))}></alarmo-ext-slider>
          <label>go to <select @change=${(e: any) => upd(x => (x.timers[i].then = e.target.value))}>
            <option value="previous" ?selected=${t.then === 'previous'}>the previous mode</option>
            ${other.map(o => html`<option value=${o.id} ?selected=${t.then === o.id}>${o.name}</option>`)}
          </select></label>
          <label>only when coming from <input type="text" placeholder="any mode (ids)" .value=${t.from_modes.join(', ')} @change=${(e: any) => upd(x => (x.timers[i].from_modes = list(e.target.value)))} /></label>
          <label>between <input type="time" .value=${t.window_start || ''} @change=${(e: any) => upd(x => (x.timers[i].window_start = e.target.value || null))} />
            and <input type="time" .value=${t.window_end || ''} @change=${(e: any) => upd(x => (x.timers[i].window_end = e.target.value || null))} /></label>
          <label><input type="checkbox" .checked=${t.notify} @change=${(e: any) => upd(x => (x.timers[i].notify = e.target.checked))} /> notify</label>
          <button class="link" @click=${() => upd(x => x.timers.splice(i, 1))}>Remove</button>
        </div>`)}
        <span class="secondary" style="display:block">Timers start when this mode begins, survive restarts, and are cancelled when the mode changes. A timer only switches if the target mode allows the "House Mode timers" source.</span>
        ${this.renderSteps(m, other)}
        ${this.renderRelated(m)}
      </div>
    `;
  }

  /** The native scenes and scripts this mode runs (when entering / leaving, before arming / after the change). */
  private renderSteps(m: HouseMode, other: HouseMode[]) {
    const upd = (fn: (x: HouseMode) => void) => this.setMode(m.id, fn);
    const steps = m.steps || [];
    const choices = Object.keys(this.hass.states).filter(e => e.startsWith('scene.') || e.startsWith('script.')).sort();
    const name = (e: string) => (this.hass.states[e]?.attributes.friendly_name as string) || e;
    return html`
      <h4 class="subhead" style="margin:10px 0 4px">Scenes and scripts</h4>
      <button class="link" ?disabled=${!choices.length}
        @click=${() => upd(x => (x.steps = [...(x.steps || []), { entity_id: choices[0], when: 'enter', phase: 'after', modes: [], wait: false }]))}>
        + Add scene or script</button>
      ${steps.map((st, i) => html`<div class="detail-grid step-row">
        <label>Run
          <select @change=${(e: any) => upd(x => (x.steps![i].entity_id = e.target.value))}>
            ${choices.includes(st.entity_id) ? nothing : html`<option value=${st.entity_id} selected>${st.entity_id} (missing)</option>`}
            ${choices.map(c => html`<option value=${c} ?selected=${c === st.entity_id}>${c.startsWith('scene.') ? 'Scene' : 'Script'}: ${name(c)}</option>`)}
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
          ? html`<label title="Wait until the script has finished before the next step (at most 5 minutes)"><input type="checkbox" .checked=${st.wait}
              @change=${(e: any) => upd(x => (x.steps![i].wait = e.target.checked))} /> wait for it</label>`
          : nothing}
        ${editorPathFor(st.entity_id, this.hass)
          ? html`<button class="link" @click=${() => navigate(this, editorPathFor(st.entity_id, this.hass)!)}>open</button>`
          : nothing}
        <button class="link" @click=${() => upd(x => x.steps!.splice(i, 1))}>Remove</button>
      </div>`)}
      ${!steps.length ? html`<span class="secondary" style="display:block">None. Scenes and scripts stay native Home Assistant scenes and
        scripts; build them in Home Assistant (or on the Scenes card below the modes).</span>` : nothing}
      <span class="secondary" style="display:block">Order: the old mode's "leaving" steps, then the new mode's "entering" steps.
        <em>Before arming</em> runs before the partitions change (e.g. lock up); <em>after the change</em> once it succeeded.
        Scripts get <code>from_mode</code>, <code>to_mode</code> and <code>source</code>. A failing step is logged on the Activity
        tab and does not stop the change.</span>
    `;
  }

  /** Native automations / scripts / scenes labelled with this mode (and suggestions), linking to HA's editor. */
  private renderRelated(m: HouseMode) {
    const items = this.actions ? itemsForMode(this.actions.items, m.name, true) : [];
    return html`
      <h4 class="subhead" style="margin:10px 0 4px">Automations, scripts and scenes</h4>
      ${!this.actions
        ? html`<span class="secondary" style="display:block">Loading…</span>`
        : items.length
          ? html`<div class="related-list">${items.map(i => {
              const p = editorPath(i);
              const sug = !i.labels.includes(m.name);
              return html`<div class="field-row">
                ${entityBadge(this.hass, i.entity_id)}
                ${p ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => navigate(this, p)}>${i.name}</button>` : html`<span>${i.name}</span>`}
                <span class="secondary" style="display:inline">${i.kind}${sug ? ' · suggested (no label yet)' : ''}${i.labels.length > 1 ? ` · also ${i.labels.filter(x => x !== m.name).join(', ')}` : ''}</span>
              </div>`;
            })}</div>`
          : html`<span class="secondary" style="display:block">None yet.</span>`}
      <span class="secondary" style="display:block">Relate them on the <a href="/alarmo/house_actions">House Mode Actions</a> tab (Home Assistant label <em>House Mode: ${m.name}</em>).</span>
    `;
  }

  // ------------------------------------------------------------------ settings & history

  private renderSettingsRow() {
    const d = this.draft!;
    const selects = Object.keys(this.hass.states).filter(e => e.startsWith('input_select.')).sort();
    const compares = Object.keys(this.hass.states)
      .filter(e => /^(input_select|select|sensor|input_text)\./.test(e) && e !== 'select.alarmo_house_mode')
      .filter(e => e.startsWith('input_select.') || /house.?mode/i.test(e) || e === d.compare_entity)
      .sort();
    const notifies = Object.keys(this.hass.services.notify || {}).map(s => ({ value: `notify.${s}`, label: `notify.${s}` }));
    return html`
      <div class="detail-grid" style="padding:4px 16px 12px;align-items:flex-start">
        <label>House Mode input_select entity
          <select @change=${(e: any) => this.set(x => (x.input_select = e.target.value || null))}>
            <option value="" ?selected=${!d.input_select}>none</option>
            ${selects.map(s => html`<option value=${s} ?selected=${d.input_select === s}>${this.hass.states[s].attributes.friendly_name || s} (${s})</option>`)}
          </select>
        </label>
        ${runState(d) === 'shadow'
          ? html`<label>Compare with (your own House Mode entity)
              <select @change=${(e: any) => this.set(x => (x.compare_entity = e.target.value || null))}>
                <option value="" ?selected=${!d.compare_entity}>none</option>
                ${compares.map(s => html`<option value=${s} ?selected=${d.compare_entity === s}>${this.hass.states[s].attributes.friendly_name || s} (${s})</option>`)}
              </select>
            </label>`
          : nothing}
        <alarmo-ext-multi-picker
          .label=${'Notifications'}
          .placeholder=${'Add a notify service…'}
          .options=${notifies}
          .value=${d.notify_services || []}
          @value-changed=${(e: CustomEvent) => this.set(x => (x.notify_services = e.detail.value))}
        ></alarmo-ext-multi-picker>
      </div>
      ${d.input_select && d.modes.length
        ? html`<div class="notice" style="margin:0 16px 12px">Options needed on ${d.input_select}: ${d.modes.map(m => m.name).join(', ')}.</div>`
        : nothing}
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

  static styles = extStyles;
}
