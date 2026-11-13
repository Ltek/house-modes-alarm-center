// Panel tab: link the alarm to a physical alarm panel (shadow / live), add panel zones to
// the alarm, and the activity log.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HmArea, HmSensor, Dictionary, HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { fetchAreas, fetchSensors } from '../../data/websockets';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import {
  DiscoveredPanel,
  PANEL_STATES,
  PanelInfo,
  PanelLinkCfg,
  PanelSettings,
  fetchPanel,
  formatStates,
  formatTime,
  importZones,
  newLink,
  parseStates,
  savePanel,
  settingsWarnings,
  ExitPlan,
  matchExitTimes,
  exitMismatchText,
} from '../../data/panel';
import { extStyles } from './ext-styles';
import './view-mirrors';
import './view-ha-zones';
import './slider-field';
import { entityBadge, sectionHead, tabSection, tabCard, settingLock, SETTING_LOCKS, isLocked, runStateRow, runChip } from './page-intro';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const STATE_LABEL: Record<string, string> = {
  armed_away: 'Away',
  armed_home: 'Home (Stay)',
  armed_night: 'Night',
  armed_vacation: 'Vacation',
  armed_custom_bypass: 'Custom',
  disarmed: 'Disarm',
};

@customElement('hm-view-panel')
export class AlarmViewPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: PanelInfo;
  @state() private draft?: PanelSettings;
  @state() private sensors: Dictionary<HmSensor> = {};
  @state() private areas: Dictionary<HmArea> = {};
  @state() private error = '';
  @state() private busy = false;
  @state() private openLinks: Record<string, boolean> = {};
  @state() private newTarget = '';
  @state() private newPanel = '';
  private usersAsked = false;
  @state() private haUsers: { id: string; name: string; is_admin?: boolean; system_generated?: boolean }[] = [];

  firstUpdated() {
    this.refresh();
  }

  private async refresh() {
    try {
      const [info, sensors, areas] = await Promise.all([fetchPanel(this.hass), fetchSensors(this.hass), fetchAreas(this.hass)]);
      this.info = info;
      this.sensors = sensors;
      this.areas = areas;
      if (!this.draft) this.draft = clone(info.settings);
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private get dirty() {
    return !!this.info && !!this.draft && JSON.stringify(this.info.settings) !== JSON.stringify(this.draft);
  }

  private set(fn: (d: PanelSettings) => void) {
    const d = clone(this.draft!);
    fn(d);
    this.draft = d;
  }

  render() {
    if (!this.info || !this.draft) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const warnings = settingsWarnings(this.draft, this.info.panels);
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      ${tabCard('Physical Panel', 'settings', html`<p>Your alarm panel (e.g. a Vista through Envisalink): the link that keeps it
          and the alarm in step, its keypad on dashboards, its zones and their mirrors, and what zones only Home Assistant
          watches do. The link's log is on the <a href="/house_modes/activity">Activity</a> tab.</p>`, html`
        ${this.renderLinks()} ${this.renderKeypadInput()}
        <hm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} embedded></hm-view-mirrors>
        <hm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} embedded></hm-view-ha-zones>`)}
      ${this.dirty
        ? html`<div class="savebar" role="region" aria-label="Unsaved panel settings">
            <span class="count">
              Unsaved panel settings
              ${warnings.length ? html`<span class="secondary" style="display:block">${warnings.join(' ')}</span>` : nothing}
            </span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.draft = clone(this.info!.settings))}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          </div>`
        : nothing}
    `;
  }

  // ------------------------------------------------------------------ keypad input from dashboards

  private renderKeypadInput() {
    const d = this.draft!;
    if (!Object.values(d.links).some(l => l.panel_type === 'envisalink')) return nothing;
    const k = d.keypad_input || { mode: 'admins', users: [], blocked_keys: '' };
    const set = (fn: (x: NonNullable<PanelSettings['keypad_input']>) => void) => {
      const n = clone(this.draft!);
      n.keypad_input = { ...k, users: [...k.users] };
      fn(n.keypad_input);
      this.draft = n;
    };
    if (!this.usersAsked) {
      this.usersAsked = true;
      this.hass
        .callWS<any[]>({ type: 'config/auth/list' })
        .then(u => (this.haUsers = u.filter(x => !x.system_generated)))
        .catch(() => undefined);
    }
    const labels: Record<string, string> = {
      off: 'Off — ignore every keypress',
      admins: 'Administrators only',
      users: 'Administrators and these users',
      all: 'Everyone',
    };
    return html`
      ${tabSection('panel-keypad', 'Panel keypad on dashboards', `who may press keys: ${labels[k.mode] || k.mode}`, html`
        <div class="card-content desc">
          <p>The House Modes &amp; Alarm Center Card can show your panel's keypad. Its keys go through the integration, which checks
            who is logged in before passing them to the panel. Refused presses are shown on the card and in the Activity log.</p>
          <ul>
            <li>Automations calling <code>house_modes.panel_keypress</code> are not checked.</li>
            <li>This limits the card, not Home Assistant: a logged-in user can still call the Envisalink service directly.
              The panel code remains the real protection.</li>
          </ul>
        </div>
        <div class="toolbar">
          ${(['off', 'admins', 'users', 'all'] as const).map(
            m => html`<label><input type="radio" name="kp-mode" .checked=${k.mode === m} @change=${() => set(x => (x.mode = m))} />${labels[m]}</label>`
          )}
        </div>
        ${k.mode === 'users'
          ? html`<div class="toolbar">
              ${this.haUsers.filter(u => !u.is_admin).map(
                u => html`<label><input type="checkbox" .checked=${k.users.includes(u.id)}
                  @change=${(e: any) => set(x => (x.users = e.target.checked ? [...x.users, u.id] : x.users.filter(i => i !== u.id)))} />${u.name}</label>`
              )}
              ${!this.haUsers.filter(u => !u.is_admin).length ? html`<span class="secondary" style="display:inline">No other users.</span>` : nothing}
            </div>`
          : nothing}
        ${k.mode !== 'off'
          ? html`<div class="field-row" style="padding:0 16px 12px">
              <label>Keys never sent from a dashboard
                <input type="text" placeholder="e.g. 6 (bypass)" .value=${k.blocked_keys}
                  @change=${(e: any) => set(x => (x.blocked_keys = String(e.target.value).toUpperCase().replace(/[^0-9*#A-D]/g, '')))} /></label>
            </div>`
          : nothing}
      `)}
    `;
  }

  // ------------------------------------------------------------------ links

  private renderLinks() {
    const d = this.draft!;
    const free = this.info!.targets.filter(t => !(t.key in d.links));
    return html`
      ${tabSection('panel-link', 'Physical panel link', `${Object.keys(d.links).length} link${Object.keys(d.links).length === 1 ? '' : 's'}${Object.values(d.links).map(l => ` · ${l.mode}`).join('')}`, html`
        <div class="card-content desc">
          <p>Keeps the alarm (a partition, or All partitions) and your physical alarm panel in step:</p>
          <ul>
            <li>Arming or disarming the alarm is sent to the physical panel and checked (with retries).</li>
            <li>Arming or disarming at the physical panel's keypad is followed by the alarm.</li>
          </ul>
          <p><strong>Shadow</strong> sends nothing and changes nothing — it only logs what would have happened, so you
            can compare it with your current automations. Switch to <strong>Live</strong> when the log matches.</p>
        </div>
        ${free.length && this.info!.panels.length
          ? html`<div class="toolbar">
              <select aria-label="Alarm" @change=${(e: any) => (this.newTarget = e.target.value)}>
                <option value="">Link a partition…</option>
                ${free.map(t => html`<option value=${t.key}>${t.name} (${t.entity_id})</option>`)}
              </select>
              to
              <select aria-label="Panel" @change=${(e: any) => (this.newPanel = e.target.value)}>
                <option value="">panel…</option>
                ${this.info!.panels.map(p => html`<option value=${p.entity_id}>${p.name} (${p.entity_id})</option>`)}
              </select>
              <ha-button appearance="plain" ?disabled=${!this.newTarget || !this.newPanel} @click=${this.addLink}>Add link</ha-button>
            </div>`
          : !this.info!.panels.length
            ? html`<div class="empty">No physical alarm panel integration found in Home Assistant.</div>`
            : nothing}
        ${Object.entries(d.links).map(([key, link]) => this.renderLink(key, link, Object.keys(d.links).length === 1))}
      `)}
    `;
  }

  @state() private exitPlan: Record<string, ExitPlan | null> = {};

  private renderExitMatch(key: string, link: PanelLinkCfg) {
    const learned = Object.keys(link.learned_exit_delay || {});
    if (!learned.length)
      return html`<div class="secondary" style="padding:0 6px 6px">Once the panel has armed a few times, its exit delays are learned here and
        the alarm's exit times can be matched to them.</div>`;
    const plan = this.exitPlan[key];
    const rows = plan ? Object.values(plan) : [];
    const bad = this.info?.exit_mismatch?.[key] || [];
    const short = bad.some(b => Object.values(b.modes).some(v => v.kind === 'short'));
    return html`${bad.length
        ? html`<div class="notice warn" style="margin:0 0 8px">The alarm's exit times don't match the panel: ${exitMismatchText(bad)}.
            ${short
              ? 'The alarm shows armed while the panel is still counting down, so House Modes and automations act too early.'
              : 'The alarm keeps counting down after the panel is armed.'}
            Match them below (backup first).</div>`
        : nothing}
      <div class="field-row">
        <span>Panel exit delays: ${learned.map(s => `${STATE_LABEL[s] || s} ${link.learned_exit_delay[s]} s`).join(' · ')}</span>
        <ha-button appearance="plain" ?disabled=${this.dirty} @click=${() => this.checkExit(key)}>Match the alarm's exit times…</ha-button>
        ${this.dirty ? html`<span class="secondary" style="display:inline">Save first.</span>` : nothing}
      </div>
      ${plan
        ? rows.length
          ? html`<div class="notice" style="margin:0 0 8px">${rows.map(r => html`<div><strong>${r.name}</strong>: ${Object.keys(r.changes).map(m => `${STATE_LABEL[m]} ${r.before[m]} → ${r.changes[m]} s`).join(', ')}</div>`)}
              <div class="toolbar" style="padding:6px 0 0"><ha-button @click=${() => this.applyExit(key)}>Apply (backup first)</ha-button>
                <button class="link" @click=${() => (this.exitPlan = { ...this.exitPlan, [key]: null })}>Cancel</button></div></div>`
          : html`<div class="secondary" style="padding:0 6px 6px">The alarm's exit times already match the panel.</div>`
        : nothing}`;
  }

  private async checkExit(key: string) {
    try {
      const res = await matchExitTimes(this.hass, key, true);
      this.exitPlan = { ...this.exitPlan, [key]: res.plan };
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async applyExit(key: string) {
    try {
      const res = await matchExitTimes(this.hass, key);
      toast(this, `Alarm exit times updated. Backup: ${res.backup ? res.backup.name : '-'}`);
      this.exitPlan = { ...this.exitPlan, [key]: null };
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private addLink() {
    const p = this.info!.panels.find(x => x.entity_id === this.newPanel)!;
    this.set(d => (d.links[this.newTarget] = newLink(p.entity_id, p.platform)));
    this.newTarget = this.newPanel = '';
  }

  /** One link's settings: its own sub-section when there are several links, inline when there is only one. */
  private renderLink(key: string, link: PanelLinkCfg, single = false) {
    const target = this.info!.targets.find(t => t.key === key);
    const panel = this.info!.panels.find(p => p.entity_id === link.panel_entity);
    const running = this.info!.running.includes(key);
    const upd = (fn: (l: PanelLinkCfg) => void) => this.set(d => fn(d.links[key]));
    const num = (field: 'retries' | 'retry_delay', label: string, min: number, max: number) => html`
      <hm-slider .label=${label} .min=${min} .max=${max} unit=${field === 'retry_delay' ? 's' : ''} .value=${link[field]}
        @value-changed=${(e: CustomEvent) => upd(l => (l[field] = e.detail.value))}></hm-slider>`;
    const open = this.openLinks[key] ?? false;
    const head = html`<span class="collapse-title">${target?.name || key} ⇄ ${panel?.name || link.panel_entity}</span>
          ${runChip(link.mode)}
          <span class="secondary" style="display:inline">${running ? 'running' : 'not running'}${panel ? ` · panel is ${panel.state}` : ''}</span>`;
    const body = html`
      <div class="collapse-body ${link.mode === 'live' ? 'live' : ''}">
        <div class="toolbar" style="padding:4px 0">
          ${runStateRow(`link-run:${key}`, `link-run-${key}`, link.mode, v => upd(l => (l.mode = v)), () => this.requestUpdate())}
          <span class="grow"></span>
          <span class="run-state">
            <button class="link" ?disabled=${isLocked(`link-remove:${key}`)}
              @click=${() => window.confirm('Remove this link? The alarm and the panel stop following each other.') && this.set(d => delete d.links[key])}>Remove link</button>
            ${settingLock(isLocked(`link-remove:${key}`), () => { SETTING_LOCKS[`link-remove:${key}`] = !isLocked(`link-remove:${key}`); this.requestUpdate(); }, 'Remove link')}
          </span>
        </div>
        <h4 class="subhead" style="margin:8px 0 4px">Arming</h4>
        <div class="field-row">
          <label for=${`order-${key}`}>When the alarm arms</label>
          <select id=${`order-${key}`} @change=${(e: any) => upd(l => (l.arm_order = e.target.value))}>
            <option value="panel_leads" ?selected=${(link.arm_order || 'panel_leads') === 'panel_leads'}>send to the panel at once; the alarm is armed when the panel is (one exit delay)</option>
            <option value="after_alarm" ?selected=${link.arm_order === 'after_alarm'}>send to the panel after the alarm's exit delay (two exit delays)</option>
          </select>
        </div>
        ${(link.arm_order || 'panel_leads') === 'panel_leads'
          ? html`<div class="secondary" style="padding:0 6px 6px">The alarm checks every zone first (panel zones through their mirrors, and the
              zones only Home Assistant watches); nothing is sent if one blocks. If the panel has not finished arming
              ${link.confirm_margin ?? 10} s after the longer of its exit delay and the alarm's, arming counts as failed.</div>
            <hm-slider .label=${'Extra time for the panel to confirm'} .min=${0} .max=${60} unit="s" .value=${link.confirm_margin ?? 10}
              @value-changed=${(e: CustomEvent) => upd(l => (l.confirm_margin = e.detail.value))}></hm-slider>
            ${this.renderExitMatch(key, link)}`
          : nothing}
        <h4 class="subhead" style="margin:10px 0 4px">Arming at the panel (keypad, app)</h4>
        <div class="field-row">
          <label><input type="checkbox" .checked=${link.follow_panel} @change=${(e: any) => upd(l => (l.follow_panel = e.target.checked))} />
            The alarm follows the panel</label>
          <span class="secondary" style="display:inline">The alarm starts arming when the panel does. Open zones the panel does not watch
            are bypassed in the alarm and you are told.</span>
        </div>
        ${link.follow_panel
          ? html`<div class="field-row">${(['armed_away', 'armed_home', 'armed_night'] as string[]).map(ps => html`
              <label>Panel ${STATE_LABEL[ps]} →
                <select aria-label=${`Alarm mode when the panel arms ${STATE_LABEL[ps]}`}
                  @change=${(e: any) => upd(l => {
                    const m = { ...(l.follow_map || {}) };
                    if (e.target.value === ps) delete m[ps];
                    else m[ps] = e.target.value;
                    l.follow_map = m;
                  })}>
                  ${Object.keys(STATE_LABEL).filter(m => m !== 'disarmed').map(m => html`<option value=${m} ?selected=${((link.follow_map || {})[ps] || ps) === m}>${STATE_LABEL[m]}</option>`)}
                </select></label>`)}</div>`
          : nothing}
        <h4 class="subhead" style="margin:10px 0 4px">Commands</h4>
        <div class="detail-grid">
          ${num('retries', 'Retries', 0, 10)} ${num('retry_delay', 'Seconds between tries', 1, 120)}
          <label>If the panel does not follow
            <select @change=${(e: any) => upd(l => (l.failure_policy = e.target.value))}>
              <option value="disarm" ?selected=${link.failure_policy === 'disarm'}>disarm the alarm again + notify</option>
              <option value="keep" ?selected=${link.failure_policy === 'keep'}>keep the alarm armed + notify</option>
            </select>
          </label>
          <label>Panel type
            <select @change=${(e: any) => upd(l => (l.panel_type = e.target.value))}>
              <option value="envisalink" ?selected=${link.panel_type === 'envisalink'}>Envisalink (keypresses)</option>
              <option value="generic" ?selected=${link.panel_type === 'generic'}>Other (HA services only)</option>
            </select>
          </label>
          ${link.panel_type === 'envisalink'
            ? html`<label>Bypass keys <input type="text" .value=${link.bypass_keys} @change=${(e: any) => upd(l => (l.bypass_keys = e.target.value))} /></label>`
            : nothing}
        </div>
        ${panel && !panel.code_set && link.panel_type === 'envisalink'
          ? html`<div class="notice error" style="margin:4px 0">Set a <strong>default code</strong> on ${link.panel_entity} (its entity settings) — keypresses use it as {code}.</div>`
          : nothing}
        <div class="table-wrap">
          <table>
            <thead><tr><th>When the alarm becomes</th><th>Send</th><th>Keys</th><th title="Panel states that count as success">Panel must become</th><th>Wait (s)</th><th>Panel delays (entry / exit s)</th><th>Learned exit</th></tr></thead>
            <tbody>
              ${PANEL_STATES.map(st => {
                const c = link.commands[st];
                if (!c) return nothing;
                const dl = link.delays[st] || {};
                const updc = (fn: (c: any) => void) => upd(l => fn(l.commands[st]));
                const delay = (k: 'entry' | 'exit') => html`<hm-slider compact optional .label=${`${STATE_LABEL[st]}: ${k} delay`}
                  .min=${0} .max=${255} .onValue=${30} unit="s" offText=${k === 'entry' ? 'entry: unknown' : 'exit: unknown'}
                  .value=${dl[k] === null || dl[k] === undefined ? null : dl[k]}
                  @value-changed=${(e: CustomEvent) => upd(l => (l.delays[st] = { ...(l.delays[st] || {}), [k]: e.detail.value }))}></hm-slider>`;
                return html`<tr>
                  <td>${STATE_LABEL[st]}</td>
                  <td><select @change=${(e: any) => updc(x => (x.method = e.target.value))}>
                    <option value="service" ?selected=${c.method === 'service'}>HA service</option>
                    <option value="keypress" ?selected=${c.method === 'keypress'} ?disabled=${link.panel_type !== 'envisalink'}>keypresses</option>
                    <option value="none" ?selected=${c.method === 'none'}>nothing</option>
                  </select></td>
                  <td>${c.method === 'keypress' ? html`<input type="text" style="width:90px" .value=${c.keys} @change=${(e: any) => updc(x => (x.keys = e.target.value))} />` : '—'}</td>
                  <td><input type="text" style="width:220px" .value=${formatStates(c.accept)} @change=${(e: any) => updc(x => (x.accept = parseStates(e.target.value)))} /></td>
                  <td><hm-slider compact .label=${`${STATE_LABEL[st]}: timeout`} .min=${5} .max=${300} unit="s" .value=${c.timeout}
                    @value-changed=${(e: CustomEvent) => updc(x => (x.timeout = e.detail.value || 20))}></hm-slider></td>
                  <td>${st === 'disarmed' ? '—' : html`${delay('entry')}${delay('exit')}`}</td>
                  <td>${link.learned_exit_delay[st] !== undefined ? `${link.learned_exit_delay[st]} s` : '—'}</td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <p class="secondary" style="display:block">
          Keys: <code>{code}</code> is the default code of the panel entity; <code>{zone}</code> the two-digit zone number.
          Vista examples: 3 = Stay, 2 = Away, 33 = Night, 7 = Instant, 4 = Max, 1 = Off. Panel delays are only for reference;
          the panel's own settings decide them.
        </p>
      </div>`;
    if (single) return html`<div class="link-single"><div class="link-head">${head}</div>${body}</div>`;
    return html`
      <details class="collapse" ?open=${open} @toggle=${(e: any) => (this.openLinks = { ...this.openLinks, [key]: e.target.open })}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          ${head}
        </summary>
        ${body}
      </details>
    `;
  }

  // ------------------------------------------------------------------ HA-only zone trips

  // ------------------------------------------------------------------ panel zones


  // ------------------------------------------------------------------ log

  private async save() {
    this.busy = true;
    this.error = '';
    try {
      const saved = await savePanel(this.hass, this.draft!);
      this.draft = clone(saved);
      this.info = { ...this.info!, settings: saved };
      toast(this, 'Panel settings saved.');
      await this.refresh();
      this.draft = clone(this.info!.settings);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  static styles = [
    extStyles,
    css`
      .link-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 12px 0;
        border-top: 1px solid var(--divider-color);
      }
    `,
  ];
}
