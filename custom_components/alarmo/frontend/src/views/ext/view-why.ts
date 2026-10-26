// Arm Check tab: "Why won't it arm?" (Alarmo's own readiness check, live) and a walk test.
import { LitElement, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AlarmoArea, AlarmoSensor, Dictionary, HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { fetchAreas, fetchSensors } from '../../data/websockets';
import { WalkState, WhyInfo, fetchWhy, liveState, walkPassed, walkSummary, walkUpdate } from '../../data/status';
import { wsErrorMessage } from '../../data/ext-websockets';
import { extStyles } from './ext-styles';
import { entityBadge, sectionHead } from './page-intro';

const MODE_LABEL: Record<string, string> = {
  armed_away: 'Away',
  armed_home: 'Home (Stay)',
  armed_night: 'Night',
  armed_vacation: 'Vacation',
  armed_custom_bypass: 'Custom',
};
const LIVE_COLOR: Record<string, string> = {
  open: 'var(--warning-color, #ffa600)',
  closed: 'var(--success-color, #43a047)',
  unavailable: 'var(--error-color, #f44336)',
  unknown: 'var(--secondary-text-color)',
};

@customElement('alarm-view-why')
export class AlarmViewWhy extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private why?: WhyInfo;
  @state() private error = '';
  @state() private sensors: Dictionary<AlarmoSensor> = {};
  @state() private areas: Dictionary<AlarmoArea> = {};
  @state() private walkArea = '';
  @state() private walking = false;
  @state() private walk: WalkState = {};
  @state() private walkOpen = false;
  private refreshTimer?: number;
  private lastStates: Record<string, string> = {};

  firstUpdated() {
    this.load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this.refreshTimer);
  }

  private async load() {
    try {
      const [why, sensors, areas] = await Promise.all([fetchWhy(this.hass), fetchSensors(this.hass), fetchAreas(this.hass)]);
      this.why = why;
      this.sensors = sensors;
      this.areas = areas;
      if (!this.walkArea) this.walkArea = Object.keys(areas)[0] || '';
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private name(id: string) {
    return (this.hass.states[id]?.attributes.friendly_name as string) || id;
  }

  /** Zone (and alarm / panel) states drive both cards: re-check when one of them changes. */
  protected updated(changed: PropertyValues) {
    if (!changed.has('hass') || !this.hass) return;
    const watch = [...Object.keys(this.sensors), ...(this.why?.areas.map(a => a.entity_id) || []), ...(this.why?.panels.map(p => p.ready_entity || '') || [])];
    let any = false;
    for (const e of watch) {
      const s = this.hass.states[e]?.state;
      if (s !== this.lastStates[e]) {
        if (this.walking && e in this.sensors) this.walk = walkUpdate(this.walk, e, s);
        this.lastStates[e] = s;
        any = true;
      }
    }
    if (any && this.why) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = window.setTimeout(() => this.load(), 800);
    }
  }

  render() {
    return html`
      ${this.error ? html`<div class="notice error" style="margin:0 0 12px">${this.error}</div>` : nothing}
      ${this.renderWhy()} ${this.renderWalk()}
    `;
  }

  // ------------------------------------------------------------ why won't it arm

  private renderWhy() {
    const w = this.why;
    return html`
      <ha-card>${sectionHead("Why won't it arm?", 'readonly')}
        <div class="card-content desc">
          <p>Alarmo's own check, live: for each partition and Arm Mode, the zones that would stop it from arming now.</p>
          <ul>
            <li>Zones with <em>Use exit delay</em> may be open when you start arming, but must be closed when the exit delay
              ends.</li>
            <li>Open motion zones do not count while disarmed (Alarmo ignores them for "ready").</li>
            <li>Auto-bypassed zones are listed separately: they are skipped, not blocking.</li>
          </ul>
        </div>
        <div class="toolbar"><ha-button appearance="plain" @click=${() => this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Check again</ha-button></div>
        ${!w
          ? html`<div class="empty">Checking…</div>`
          : html`
              ${w.panels.map(
                p => html`<div class="notice ${p.ready === false ? 'warn' : ''}" style="margin:0 16px 12px">
                  <strong>Physical panel</strong> ${this.name(p.panel_entity)} (${p.mode}):
                  ${p.ready === null
                    ? html`no "Ready" sensor found, so its readiness is unknown.`
                    : p.ready
                      ? html`ready to arm.`
                      : html`<strong>not ready</strong>. A zone is faulted on the panel itself (${this.name(p.ready_entity!)}); check its keypad.`}
                </div>`
              )}
              ${w.areas.map(
                a => html`
                  <h4 class="subhead" style="margin:8px 16px 4px">${a.name} — ${(a.state || 'unknown').replace(/_/g, ' ')}</h4>
                  <div class="table-wrap"><table>
                    <thead><tr><th>Arm Mode</th><th>Ready</th><th>What blocks it</th><th>Auto-bypassed</th></tr></thead>
                    <tbody>${a.modes.map(
                      m => html`<tr>
                        <td>${MODE_LABEL[m.mode] || m.mode}</td>
                        <td>${m.ready
                          ? html`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)" title="Ready"></ha-icon>`
                          : html`<ha-icon icon="mdi:close-circle" style="color:var(--error-color,#f44336)" title="Not ready"></ha-icon>`}</td>
                        <td style="white-space:normal">${m.blocking.length
                          ? m.blocking.map(
                              b => html`<div class="blk">${entityBadge(this.hass, b.entity_id)} ${this.name(b.entity_id)}
                                <span class="secondary" style="display:inline">— ${b.reason}${b.motion ? ' (motion: ignored while disarmed)' : ''}${b.exit_delay && m.exit_time ? ` · may be open for the ${m.exit_time} s exit delay` : ''}</span></div>`
                            )
                          : html`<span class="secondary" style="display:inline">nothing</span>`}</td>
                        <td style="white-space:normal">${m.bypassed.length ? m.bypassed.map(b => html`<div>${this.name(b)}</div>`) : '—'}</td>
                      </tr>`
                    )}</tbody>
                  </table></div>
                `
              )}
              ${w.house_modes.length
                ? html`<h4 class="subhead" style="margin:8px 16px 4px">House Mode readiness</h4>
                    <div class="table-wrap"><table>
                      <thead><tr><th>House Mode</th><th>Open now</th><th>If open</th></tr></thead>
                      <tbody>${w.house_modes.map(h => html`<tr>
                        <td>${h.name}</td>
                        <td style="white-space:normal">${h.open.length ? h.open.map(e => html`<div>${this.name(e)}</div>`) : html`<span class="secondary" style="display:inline">nothing</span>`}</td>
                        <td>${h.action === 'block' ? 'blocks the change' : 'warns only'}</td>
                      </tr>`)}</tbody>
                    </table></div>`
                : nothing}
            `}
      </ha-card>
    `;
  }

  // ------------------------------------------------------------ walk test

  private walkZones() {
    return Object.values(this.sensors)
      .filter(s => s.area === this.walkArea && s.enabled)
      .map(s => s.entity_id)
      .sort((a, b) => this.name(a).localeCompare(this.name(b)));
  }

  private startWalk() {
    this.walk = {};
    this.walkZones().forEach(e => (this.walk = { ...this.walk, [e]: { opened: false, closed: false, last: this.hass.states[e]?.state } }));
    this.walking = true;
  }

  private renderWalk() {
    const zones = this.walkZones();
    const testable = zones.filter(e => !this.sensors[e].always_on);
    const alwaysOn = zones.filter(e => this.sensors[e].always_on);
    const area = this.why?.areas.find(a => a.area_id === this.walkArea);
    const disarmed = !area || area.state === 'disarmed';
    const sum = walkSummary(this.walk, testable);
    return html`
      <ha-card>${sectionHead('Walk test', 'readonly')}
        <details class="collapse" ?open=${this.walking || this.walkOpen} @toggle=${(e: any) => (this.walkOpen = e.target.open)}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Run a walk test</span>
            ${this.walking || sum.passed ? html`<span class="role">${sum.passed} of ${sum.total} passed</span>` : nothing}
            <span class="secondary" style="display:inline">open and close each zone to check it reports</span>
          </summary>
          <div class="collapse-body">
        <div class="card-content desc">
          <p>Checks that every zone reports to Home Assistant: open and close each one (walk past each motion zone), and
            it ticks off. Nothing is armed and nothing is changed.</p>
          <ul>
            <li>Run it with the partition <strong>disarmed</strong>. <em>Always on</em> zones (fire, 24-hour) would raise the
              Alarmo alarm even then, so they are left out.</li>
            <li>The physical panel still reacts to its own zones. If it would sound, put it in its own test mode first
              (Vista: usually code + 5 at the keypad — check your panel's manual).</li>
          </ul>
        </div>
        <div class="toolbar">
          ${this.walking
            ? html`<ha-button @click=${() => (this.walking = false)}><ha-icon slot="start" icon="mdi:stop"></ha-icon>Stop</ha-button>
                <ha-button appearance="plain" @click=${this.startWalk}>Start over</ha-button>`
            : html`<ha-button ?disabled=${!testable.length || !disarmed} @click=${this.startWalk}><ha-icon slot="start" icon="mdi:walk"></ha-icon>Start walk test</ha-button>`}
          <label>Partition
            <select ?disabled=${this.walking} @change=${(e: any) => (this.walkArea = e.target.value)}>
              ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${a.area_id === this.walkArea}>${a.name}</option>`)}
            </select>
          </label>
          ${!disarmed ? html`<span class="secondary" style="display:inline;color:var(--warning-color,#ffa600)">Disarm the partition first.</span>` : nothing}
          ${this.walking || sum.passed
            ? html`<strong>${sum.passed} of ${sum.total} passed</strong>${sum.open ? html`<span class="secondary" style="display:inline">· ${sum.open} open now</span>` : nothing}`
            : nothing}
        </div>
        ${testable.length
          ? html`<div class="table-wrap"><table>
              <thead><tr><th class="icon"></th><th>Zone</th><th>Now</th><th class="c">Opened</th><th class="c">Closed again</th></tr></thead>
              <tbody>${testable.map(e => {
                const w = this.walk[e];
                const live = liveState(this.hass.states[e]?.state);
                const tick = (on?: boolean) =>
                  on ? html`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)"></ha-icon>` : html`<ha-icon icon="mdi:circle-outline" style="color:var(--disabled-text-color,#9e9e9e)"></ha-icon>`;
                return html`<tr class=${walkPassed(w) ? 'passed' : ''}>
                  <td class="icon">${entityBadge(this.hass, e)}</td>
                  <td class="name">${this.name(e)}<span class="secondary">${e}</span></td>
                  <td><span style=${`color:${LIVE_COLOR[live]}`}>${live}</span></td>
                  <td class="c">${tick(w?.opened)}</td>
                  <td class="c">${tick(w?.closed)}</td>
                </tr>`;
              })}</tbody>
            </table></div>`
          : html`<div class="empty">No enabled zones in this partition.</div>`}
        ${alwaysOn.length
          ? html`<div class="secondary" style="padding:0 16px 12px">Left out (always on): ${alwaysOn.map(e => this.name(e)).join(', ')}.</div>`
          : nothing}
          </div>
        </details>
      </ha-card>
    `;
  }

  static styles = extStyles;
}
