// Activity tab: the sequence recorder (House Mode helpers, locks, Alarmo, the physical panel, bypasses, automations,
// commands, notifications), plus the panel link log and House Mode history that used to live on their own pages.
import { LitElement, html, nothing, css } from 'lit';
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
import { fetchHouse, fetchShadow, HouseInfo, runState, ShadowEntry, ShadowSummary } from '../../data/house';
import { extStyles } from './ext-styles';
import { sectionHead } from './page-intro';
import './slider-field';
import './view-why';
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
  @state() private shadow?: { log: ShadowEntry[]; summary: ShadowSummary };
  @state() private shadowAll = false;
  @state() private shadowOpen = false;
  @state() private seqOpen = true;
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
      if (house && runState(house.settings) === 'shadow') this.loadShadow();
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
      <ha-card>
        ${this.renderHeader()}
        ${this.renderSequences()} ${this.renderArmCheck()} ${this.renderShadow()} ${this.renderSettings()} ${this.renderPanelLog()} ${this.renderHouseHistory()}
      </ha-card>
    `;
  }

  // ------------------------------------------------------------ Shadow comparison (was on the House Modes tab)

  private renderShadow() {
    if (!this.house || runState(this.house.settings) !== 'shadow') return nothing;
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
        <details class="collapse act-sec" ?open=${this.shadowOpen}
          @toggle=${(e: Event) => (this.shadowOpen = (e.target as HTMLDetailsElement).open)}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Shadow comparison</span>
            <span class="secondary" style="display:inline">${sh ? `${sh.summary.matched} matched · ${sh.summary.differed} differed${sh.summary.watching ? ' · watching a change…' : ''}` : 'loading…'}</span>
          </summary>
          <div class="collapse-body">
            <p>What House Modes would have done, next to what your automations did:</p>
            <ul>
              <li><strong>✓</strong> your automations ended where House Modes would have;</li>
              <li><strong>✗</strong> they differ: read the line, then fix the House Mode or your automation.</li>
            </ul>
            <p class="secondary">The same lines are in the sequences below, marked <em>[shadow]</em>. This list starts again after a restart.</p>
            <div class="toolbar" style="padding-left:0">
              <ha-button appearance="plain" @click=${() => this.loadShadow()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
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
          </div>
        </details>
    `;
  }

  private async loadShadow() {
    this.shadow = await fetchShadow(this.hass).catch(() => undefined);
  }

  // ------------------------------------------------------------ Arm Check (was its own tab)

  private renderArmCheck() {
    const open = this.path?.subpage === 'arm_check' || this.path?.page === 'why';
    return html`
        <details class="collapse act-sec" ?open=${open}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Arm Check</span>
            <span class="secondary" style="display:inline">why won't it arm · walk test</span>
          </summary>
          <div class="collapse-body arm-check">
            <alarm-view-why .hass=${this.hass} .narrow=${this.narrow} .path=${this.path}></alarm-view-why>
          </div>
        </details>
    `;
  }

  // ------------------------------------------------------------ header: what it is and whether it records

  private renderHeader() {
    const i = this.info!;
    return html`${sectionHead('Activity', 'readonly')}
        <div class="card-content desc">
          <p>Everything around House Modes, the alarm, the physical panel, locks and bypasses, grouped into <em>sequences</em>:
            a sequence starts with a House Mode helper change, a lock keypad use, an alarm or panel change, the BYPASS
            indicator or an alarm, and collects everything that follows until nothing happens for
            ${i.settings.window_s} s. Each entry shows the time since the start and, where known, what caused it.</p>
          <p>It only records — it never changes anything. Codes are never recorded.</p>
        </div>
        <div class=${`notice ${i.last_error || (i.settings.enabled && !i.running) ? 'error' : ''}`} style="margin:0 16px 12px">
          ${!i.settings.enabled
            ? html`<span class="rec off"><ha-icon icon="mdi:record-circle-outline"></ha-icon>RECORDING OFF</span>
                <span class="secondary" style="display:inline">· turn it on under Recording settings below</span>`
            : i.running
              ? html`<span class="rec on"><ha-icon icon="mdi:record-circle"></ha-icon>RECORDING ENABLED</span> · ${Object.keys(i.watched || {}).length} entities watched ·
                  ${i.open ? html`a sequence is open now (started ${clock(i.open.start)})` : 'waiting for the next sequence'} ·
                  ${i.last_write ? html`last saved ${new Date(i.last_write * 1000).toLocaleString()}` : 'nothing saved since Home Assistant started'}`
              : html`<strong>The recorder is not running.</strong> Check Settings → System → Logs for "alarmo" or "Activity recorder".`}
          ${i.last_error ? html`<div><strong>Error:</strong> ${i.last_error}</div>` : nothing}
        </div>
    `;
  }

  // ------------------------------------------------------------ sequences

  private renderSequences() {
    const i = this.info!;
    const filt = (s: ActivitySequence) => sequenceMatches(s, this.kinds, this.onlyProblems, this.search);
    const shown = this.seqs.filter(filt);
    const kindsSeen = Object.keys(i.kinds);
    return html`
        <details class="collapse act-sec" ?open=${this.seqOpen} @toggle=${(e: Event) => (this.seqOpen = (e.target as HTMLDetailsElement).open)}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Sequences</span>
            <span class="secondary" style="display:inline">${this.day} · ${shown.length} sequence${shown.length === 1 ? '' : 's'}${i.open ? ' · one open now' : ''}</span>
          </summary>
          <div class="collapse-body">
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
                ? html`<br />Panel after the alarm: ${Object.keys(this.summary.panel_latency).map(k => {
                    const l = this.summary!.panel_latency[k];
                    return `${k.replace('armed_', '')} avg ${l.avg} s (max ${l.max} s, ${l.n}×)`;
                  }).join(' · ')}`
                : nothing}
            </div>`
          : nothing}
        ${i.open && filt(i.open) ? this.renderSequence(i.open, true) : nothing}
        ${shown.map(s => this.renderSequence(s, false))}
        ${!shown.length && !i.open ? html`<div class="empty">Nothing recorded${this.seqs.length ? ' that matches the filters' : ' this day yet'}.</div>` : nothing}
          </div>
        </details>
    `;
  }

  private renderSequence(s: ActivitySequence, live: boolean) {
    const problem = s.entries.some(e => /fail|error|not allowed|differ/i.test(e.text) || e.level === 'error');
    return html`
      <details class="collapse sub seq" ?open=${live}>
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
        <details class="collapse act-sec">
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
              Recorded automatically (${Object.keys(watched).length}): ${Object.keys(watched).sort().join(', ')}. Zones and mirrors
              are recorded inside a sequence; automations that ran, commands to the panel, alarm and locks and notifications too.
              Files: <code>${this.info!.directory}</code>.
            </div>
            ${this.dirty ? html`<div class="toolbar" style="padding:8px 0 0">
              <ha-button @click=${this.save}>Save</ha-button>
              <ha-button appearance="plain" @click=${() => (this.draft = JSON.parse(JSON.stringify(this.info!.settings)))}>Discard</ha-button></div>` : nothing}
          </div>
        </details>
    `;
  }

  // ------------------------------------------------------------ moved from Physical Panel / House Modes

  private renderPanelLog() {
    return html`
        <details class="collapse act-sec">
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
    `;
  }

  private renderHouseHistory() {
    const h = this.house;
    if (!h || !h.settings.history.length) return nothing;
    const name = (id: string | null) => (id ? h.settings.modes.find(m => m.id === id)?.name || id : 'unknown');
    const rows = [...h.settings.history].reverse();
    return html`
        <details class="collapse act-sec">
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
    `;
  }

  static styles = [
    extStyles,
    css`
      /* the recording status stands out in the theme's accent color */
      .rec {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 700;
        letter-spacing: 0.04em;
        --mdc-icon-size: 16px;
      }
      details.collapse.act-sec {
        margin: 0 16px 12px;
      }
      details.collapse.act-sec > .collapse-body > .toolbar {
        padding-left: 0;
        padding-right: 0;
      }
      details.collapse.seq {
        margin: 0 0 8px;
      }
      details.collapse.sub[open] {
        border-color: var(--accent-color);
      }
      .rec.on {
        color: var(--accent-color, var(--primary-color));
      }
      .rec.off {
        color: var(--secondary-text-color);
      }
      /* Arm Check's own cards sit flat inside the panel */
      .arm-check alarm-view-why {
        display: block;
        --ha-card-box-shadow: none;
      }
    `,
  ];
}
