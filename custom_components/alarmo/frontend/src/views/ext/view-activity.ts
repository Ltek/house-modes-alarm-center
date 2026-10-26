// Activity tab: the sequence recorder (House Mode helpers, locks, Alarmo, the physical panel, bypasses, automations,
// commands, notifications), plus the panel link log and House Mode history that used to live on their own pages.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { downloadText, wsErrorMessage, toast } from '../../data/ext-websockets';
import {
  ActivityInfo,
  ActivitySequence,
  ActivitySummary,
  fetchActivity,
  fetchActivityDay,
  saveActivitySettings,
  sequenceMatches,
} from '../../data/activity';
import { fetchPanelLog, formatTime, LogEntry } from '../../data/panel';
import { fetchHouse, HouseInfo } from '../../data/house';
import { extStyles } from './ext-styles';
import { sectionHead } from './page-intro';
import './slider-field';
import './multi-picker';

const KIND_ICON: Record<string, string> = {
  house: 'mdi:home-switch',
  alarmo: 'mdi:shield-home',
  panel: 'mdi:alarm-panel-outline',
  keypad: 'mdi:dialpad',
  lock: 'mdi:lock-smart',
  bypass: 'mdi:debug-step-over',
  zone: 'mdi:door',
  helper: 'mdi:toggle-switch-outline',
  automation: 'mdi:robot',
  command: 'mdi:send',
  notify: 'mdi:bell-ring-outline',
  link: 'mdi:link-variant',
  event: 'mdi:flash-outline',
};

const clock = (ts: number) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

@customElement('alarm-view-activity')
export class AlarmViewActivity extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: ActivityInfo;
  @state() private day = '';
  @state() private seqs: ActivitySequence[] = [];
  @state() private summary?: ActivitySummary;
  @state() private kinds: string[] = [];
  @state() private onlyProblems = false;
  @state() private search = '';
  @state() private error = '';
  @state() private draft?: ActivityInfo['settings'];
  @state() private panelLog: LogEntry[] = [];
  @state() private house?: HouseInfo;
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.loadOpen(), 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
  }

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      this.info = await fetchActivity(this.hass);
      this.draft = JSON.parse(JSON.stringify(this.info.settings));
      const today = new Date();
      const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (!this.day) this.day = this.info.days[0] || iso;
      await this.loadDay();
      const [log, house] = await Promise.all([fetchPanelLog(this.hass).catch(() => ({ log: [] })), fetchHouse(this.hass).catch(() => undefined)]);
      this.panelLog = [...log.log].reverse();
      this.house = house;
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async loadOpen() {
    if (!this.info) return;
    try {
      const i = await fetchActivity(this.hass);
      const closedNow = this.info.open && (!i.open || i.open.id !== this.info.open.id);
      this.info = { ...i, settings: this.info.settings };
      if (closedNow) await this.loadDay();
    } catch (_e) {
      /* keep the last view */
    }
  }

  private async loadDay() {
    const res = await fetchActivityDay(this.hass, this.day);
    this.seqs = res.sequences;
    this.summary = res.summary;
  }

  private get dirty() {
    return !!this.info && JSON.stringify(this.info.settings) !== JSON.stringify(this.draft);
  }

  private async save() {
    try {
      await saveActivitySettings(this.hass, this.draft!);
      toast(this, 'Activity settings saved.');
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  render() {
    if (!this.info) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    return html`
      ${this.error ? html`<div class="notice error" style="margin:0 0 12px">${this.error}</div>` : nothing}
      ${this.renderSequences()} ${this.renderSettings()} ${this.renderPanelLog()} ${this.renderHouseHistory()}
    `;
  }

  // ------------------------------------------------------------ sequences

  private renderSequences() {
    const i = this.info!;
    const filt = (s: ActivitySequence) => sequenceMatches(s, this.kinds, this.onlyProblems, this.search);
    const shown = this.seqs.filter(filt);
    const kindsSeen = Object.keys(i.kinds);
    return html`
      <ha-card>${sectionHead('Activity', 'readonly')}
        <div class="card-content desc">
          <p>Everything around House Modes, Alarmo, the physical panel, locks and bypasses, grouped into <em>sequences</em>:
            a sequence starts with a House Mode helper change, a lock keypad use, an Alarmo or panel change, the BYPASS
            indicator or an alarm, and collects everything that follows until nothing happens for
            ${i.settings.window_s} s. Each entry shows the time since the start and, where known, what caused it.</p>
          <p>It only records — it never changes anything. Codes are never recorded.</p>
        </div>
        <div class=${`notice ${i.last_error || (i.settings.enabled && !i.running) ? 'error' : ''}`} style="margin:0 16px 8px">
          ${!i.settings.enabled
            ? html`Recording is off (Recording settings below).`
            : i.running
              ? html`Recording · ${Object.keys(i.watched || {}).length} entities watched ·
                  ${i.open ? html`a sequence is open now (started ${clock(i.open.start)})` : 'waiting for the next sequence'} ·
                  ${i.last_write ? html`last saved ${new Date(i.last_write * 1000).toLocaleString()}` : 'nothing saved since Home Assistant started'}`
              : html`<strong>The recorder is not running.</strong> Check Settings → System → Logs for "Alarmo ext" or "Activity recorder".`}
          ${i.last_error ? html`<div><strong>Error:</strong> ${i.last_error}</div>` : nothing}
        </div>
        <div class="toolbar">
          <label>Day
            <select @change=${async (e: any) => { this.day = e.target.value; await this.loadDay(); }}>
              ${(i.days.length ? i.days : [this.day]).map(d => html`<option value=${d} ?selected=${d === this.day}>${d}</option>`)}
            </select>
          </label>
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${(e: any) => (this.search = e.target.value)} />
          <label><input type="checkbox" .checked=${this.onlyProblems} @change=${(e: any) => (this.onlyProblems = e.target.checked)} /> Only problems</label>
          <ha-button appearance="plain" @click=${() => this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
          <ha-button appearance="plain" ?disabled=${!i.days.length} @click=${this.downloadAll}><ha-icon slot="start" icon="mdi:download"></ha-icon>Download all days</ha-button>
        </div>
        <div class="toolbar" style="padding-top:0">
          ${kindsSeen.map(k => {
            const on = this.kinds.includes(k);
            return html`<button class="chip-cell kind-chip ${on ? 'on' : ''}" style="--chip:var(--primary-color)"
              @click=${() => (this.kinds = on ? this.kinds.filter(x => x !== k) : [...this.kinds, k])}>
              <ha-icon icon=${KIND_ICON[k] || 'mdi:circle-small'}></ha-icon>${i.kinds[k]}</button>`;
          })}
          ${this.kinds.length ? html`<button class="link" @click=${() => (this.kinds = [])}>all</button>` : nothing}
        </div>
        ${this.summary && this.summary.sequences
          ? html`<div class="secondary" style="padding:0 16px 8px">
              ${this.summary.sequences} sequence(s) · started by ${Object.keys(this.summary.starters).map(k => `${i.kinds[k] || k} ${this.summary!.starters[k]}`).join(', ')}
              ${this.summary.failures ? html` · <span style="color:var(--error-color,#f44336)">${this.summary.failures} problem(s)</span>` : nothing}
              ${Object.keys(this.summary.panel_latency).length
                ? html`<br />Panel after Alarmo: ${Object.keys(this.summary.panel_latency).map(k => {
                    const l = this.summary!.panel_latency[k];
                    return `${k.replace('armed_', '')} avg ${l.avg} s (max ${l.max} s, ${l.n}×)`;
                  }).join(' · ')}`
                : nothing}
            </div>`
          : nothing}
        ${i.open && filt(i.open) ? this.renderSequence(i.open, true) : nothing}
        ${shown.map(s => this.renderSequence(s, false))}
        ${!shown.length && !i.open ? html`<div class="empty">Nothing recorded${this.seqs.length ? ' that matches the filters' : ' this day yet'}.</div>` : nothing}
      </ha-card>
    `;
  }

  private renderSequence(s: ActivitySequence, live: boolean) {
    const problem = s.entries.some(e => /fail|error|not allowed|differ/i.test(e.text) || e.level === 'error');
    return html`
      <details class="collapse" ?open=${live}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          <span class="seq-time">${clock(s.start)}</span>
          <span class="seq-title">${s.title}</span>
          ${live ? html`<span class="role">recording…</span>` : html`<span class="secondary" style="display:inline">${s.duration ?? 0} s · ${s.entries.length} entries</span>`}
          ${problem ? html`<ha-icon icon="mdi:alert-circle" style="color:var(--error-color,#f44336)" title="Something failed or differs"></ha-icon>` : nothing}
          <span class="seq-kinds">${s.kinds.map(k => html`<ha-icon icon=${KIND_ICON[k] || 'mdi:circle-small'} title=${this.info!.kinds[k] || k}></ha-icon>`)}</span>
        </summary>
        <div class="collapse-body">
          <div class="table-wrap"><table class="full"><tbody>
            ${s.entries.map(e => html`<tr class=${e.level === 'error' ? 'status-removed' : e.level === 'warning' ? 'status-changed' : ''}>
              <td class="c" style="width:1%">+${e.dt.toFixed(1)} s</td>
              <td class="icon"><ha-icon icon=${KIND_ICON[e.kind] || 'mdi:circle-small'} title=${this.info!.kinds[e.kind] || e.kind}></ha-icon></td>
              <td style="white-space:normal">${e.text}${e.cause ? html`<span class="secondary">${e.cause}</span>` : nothing}</td>
            </tr>`)}
          </tbody></table></div>
        </div>
      </details>
    `;
  }

  /** every saved day as one JSONL file (one sequence per line), oldest first */
  private downloadAll = async () => {
    const lines: string[] = [];
    for (const day of [...this.info!.days].reverse()) {
      const res = await fetchActivityDay(this.hass, day);
      [...res.sequences].reverse().forEach(sq => lines.push(JSON.stringify(sq)));
    }
    downloadText(`alarmo_activity_${this.info!.days[this.info!.days.length - 1]}_to_${this.info!.days[0]}.jsonl`, lines.join('\n') + '\n', 'application/x-ndjson');
    toast(this, `${lines.length} sequence(s) downloaded.`);
  };

  // ------------------------------------------------------------ settings

  private renderSettings() {
    const d = this.draft!;
    const watched = this.info!.watched || {};
    const options = Object.keys(this.hass.states)
      .filter(e => !(e in watched))
      .sort()
      .map(e => ({ value: e, label: `${this.hass.states[e].attributes.friendly_name || e} (${e})` }));
    return html`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Recording settings</span>
            <span class="secondary" style="display:inline">${d.enabled ? `on · ${d.window_s} s window · ${d.retention_days} days` : 'off'}</span>
          </summary>
          <div class="collapse-body">
            <div class="field-row"><label><input type="checkbox" .checked=${d.enabled} @change=${(e: any) => (this.draft = { ...d, enabled: e.target.checked })} /> Record activity</label></div>
            <alarmo-ext-slider .label=${'Sequence window (quiet time before a sequence ends)'} .min=${15} .max=${1800} .step=${15} unit="s" .value=${d.window_s}
              @value-changed=${(e: CustomEvent) => (this.draft = { ...d, window_s: e.detail.value })}></alarmo-ext-slider>
            <div class="secondary" style="padding:0 6px 6px">A sequence also stays open while an alarm is arming or in its entry delay.</div>
            <alarmo-ext-slider .label=${'Keep logs for'} .min=${1} .max=${365} unit="days" .value=${d.retention_days}
              @value-changed=${(e: CustomEvent) => (this.draft = { ...d, retention_days: e.detail.value })}></alarmo-ext-slider>
            <alarmo-ext-multi-picker .label=${'Also record'} .placeholder=${'Add an entity…'} .options=${options} .value=${d.entities}
              @value-changed=${(e: CustomEvent) => (this.draft = { ...d, entities: e.detail.value })}></alarmo-ext-multi-picker>
            <div class="secondary" style="padding:6px">
              Recorded automatically (${Object.keys(watched).length}): ${Object.keys(watched).sort().join(', ')}. Alarmo zones and mirrors
              are recorded inside a sequence; automations that ran, commands to the panel/Alarmo/locks and notifications too.
              Files: <code>${this.info!.directory}</code>.
            </div>
            ${this.dirty ? html`<div class="toolbar" style="padding:8px 0 0">
              <ha-button @click=${this.save}>Save</ha-button>
              <ha-button appearance="plain" @click=${() => (this.draft = JSON.parse(JSON.stringify(this.info!.settings)))}>Discard</ha-button></div>` : nothing}
          </div>
        </details>
      </ha-card>
    `;
  }

  // ------------------------------------------------------------ moved from Physical Panel / House Modes

  private renderPanelLog() {
    return html`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Physical panel link log</span>
            <span class="secondary" style="display:inline">${this.panelLog.length} entries since Home Assistant started (these are also in the sequences)</span>
          </summary>
          <div class="collapse-body">
            ${this.panelLog.length
              ? html`<div class="table-wrap" style="max-height:360px"><table class="full"><tbody>
                  ${this.panelLog.map(e => html`<tr class=${e.level === 'error' ? 'status-removed' : e.level === 'warning' ? 'status-changed' : ''}>
                    <td>${formatTime(e.ts)}</td><td>${e.link || ''}</td><td style="white-space:normal">${e.msg}</td></tr>`)}
                </tbody></table></div>`
              : html`<div class="empty">Nothing yet.</div>`}
          </div>
        </details>
      </ha-card>
    `;
  }

  private renderHouseHistory() {
    const h = this.house;
    if (!h || !h.settings.history.length) return nothing;
    const name = (id: string | null) => (id ? h.settings.modes.find(m => m.id === id)?.name || id : 'unknown');
    const rows = [...h.settings.history].reverse();
    return html`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">House Mode history</span>
            <span class="secondary" style="display:inline">last ${rows.length} changes made by the integration's House Modes</span>
          </summary>
          <div class="collapse-body">
            <div class="table-wrap" style="max-height:300px"><table class="full"><tbody>
              ${rows.map(r => html`<tr class=${r.result === 'failed' ? 'status-removed' : ''}><td>${new Date(r.at).toLocaleString()}</td>
                <td>${name(r.from)} → <strong>${name(r.to)}</strong></td><td>${r.source}</td><td>${r.result}</td></tr>`)}
            </tbody></table></div>
          </div>
        </details>
      </ha-card>
    `;
  }

  static styles = extStyles;
}
