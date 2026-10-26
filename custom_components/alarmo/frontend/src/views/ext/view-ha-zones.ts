// Physical Panel page, "How HA-only zones raise the alarm": what happens when a zone that only Home Assistant watches
// (not the physical panel) triggers the alarm. The per-zone choice is on Zone Assignments (zone editor → When tripped).
// Settings are stored with the panel settings.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AlarmoSensor, Dictionary, HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { fetchSensors } from '../../data/websockets';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { PanelInfo, PanelSettings, fetchPanel, savePanel, tripPolicy } from '../../data/panel';
import { extStyles } from './ext-styles';
import { sectionHead } from './page-intro';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
type TripPart = Pick<PanelSettings, 'monitored' | 'notify_service' | 'trip'>;
const pick = (s: PanelSettings): TripPart => ({
  monitored: s.monitored,
  notify_service: s.notify_service || null,
  trip: s.trip,
});

@customElement('alarm-view-ha-zones')
export class AlarmViewHaZones extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: PanelInfo;
  @state() private draft?: TripPart;
  @state() private sensors: Dictionary<AlarmoSensor> = {};
  @state() private error = '';
  @state() private busy = false;

  firstUpdated() {
    this.refresh();
  }

  private async refresh() {
    try {
      const [info, sensors] = await Promise.all([fetchPanel(this.hass), fetchSensors(this.hass)]);
      this.info = info;
      this.sensors = sensors;
      this.draft = clone(pick(info.settings));
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private get dirty() {
    return !!this.info && !!this.draft && JSON.stringify(pick(this.info.settings)) !== JSON.stringify(this.draft);
  }

  private set(fn: (d: TripPart) => void) {
    const d = clone(this.draft!);
    fn(d);
    this.draft = d;
  }

  /** Alarmo zones the physical panel does not watch (not a panel zone or its mirror). */
  private haZones(): string[] {
    const panel = new Set<string>();
    this.info!.panels.forEach(p =>
      p.zones.forEach(z => {
        panel.add(z.entity_id);
        panel.add(`binary_sensor.${z.entity_id.replace(/^binary_sensor\./, '')}_mirror`);
      })
    );
    return Object.keys(this.sensors)
      .filter(e => !panel.has(e))
      .sort();
  }

  render() {
    if (!this.info || !this.draft) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const d = this.draft;
    const zones = this.haZones();
    const custom = zones.filter(e => this.info!.settings.zone_trip[e]).length;
    const linked = Object.keys(this.info.settings.links).length > 0;
    const defLabel = tripPolicy({ ...this.info.settings, ...d, zone_trip: {} } as PanelSettings, '_') === 'panel' ? 'set off the alarm' : 'notify only';
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      <ha-card>${sectionHead('How HA-only zones raise the alarm', 'settings')}
        <div class="card-content desc">
          <p>Some Alarmo zones are watched only by Home Assistant — Zigbee/Z-Wave motion, garage covers, smoke detectors
            — not by your physical panel. When one of them triggers the alarm while armed, the physical panel knows
            nothing about it.</p>
          <p>Choose here what Alarmo does then, by default. Each zone can do something else: Zone Assignments → open the
            zone (›) → <em>When tripped</em>. Now: ${zones.length} HA-only zone(s)${custom ? `, ${custom} with their own choice` : ''}; default
            <em>${defLabel}</em>. Use <em>notify only</em> for zones that give false alarms, like outdoor motion.</p>
          ${!linked
            ? html`<div class="notice warn" style="margin:0 0 8px">No physical panel is linked (Physical Panel tab), so these settings are not used yet — Alarmo only uses its own notifications.</div>`
            : nothing}
        </div>
        <div class="detail-grid" style="padding:0 16px 12px">
          <label title="If on, HA-only zones default to notify only, to avoid a false police/fire dispatch">
            <input type="checkbox" .checked=${d.monitored} @change=${(e: any) => this.set(x => (x.monitored = e.target.checked))} />
            The physical panel is professionally monitored</label>
          <label>Set off the alarm with
            <select @change=${(e: any) => this.set(x => (x.trip.method = e.target.value))}>
              <option value="siren" ?selected=${d.trip.method === 'siren'}>a siren entity</option>
              <option value="relay" ?selected=${d.trip.method === 'relay'}>a relay (switch) wired into a 24-hour zone of the physical panel</option>
              <option value="panic" ?selected=${d.trip.method === 'panic'}>a programmed panic key on the physical panel</option>
              <option value="none" ?selected=${d.trip.method === 'none'}>nothing (notify only)</option>
            </select>
          </label>
          ${d.trip.method === 'siren' || d.trip.method === 'relay'
            ? html`<label>Entity <input type="text" placeholder=${d.trip.method === 'siren' ? 'siren.…' : 'switch.…'} .value=${d.trip.entity || ''}
                @change=${(e: any) => this.set(x => (x.trip.entity = e.target.value.trim() || null))} /></label>`
            : nothing}
          ${d.trip.method === 'panic'
            ? html`<label>Panic
                <select @change=${(e: any) => this.set(x => (x.trip.panic_method = e.target.value))}>
                  <option value="service" ?selected=${d.trip.panic_method === 'service'}>the physical panel's alarm trigger</option>
                  <option value="keypress" ?selected=${d.trip.panic_method === 'keypress'}>keypresses</option>
                </select></label>
              ${d.trip.panic_method === 'keypress'
                ? html`<label>Keys (e.g. A) <input type="text" style="width:70px" .value=${d.trip.panic_keys} @change=${(e: any) => this.set(x => (x.trip.panic_keys = e.target.value))} /></label>`
                : nothing}
              <span class="secondary" style="display:block">Only works if the key is programmed on the physical panel (Vista: field *57).</span>`
            : nothing}
          <label>Notify service <input type="text" placeholder="notify.mobile_app_…" .value=${d.notify_service || ''}
            @change=${(e: any) => this.set(x => (x.notify_service = e.target.value.trim() || null))} /></label>
        </div>
      </ha-card>

      ${this.dirty
        ? html`<div class="savebar" role="region" aria-label="Unsaved settings">
            <span class="count">Unsaved settings</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.draft = clone(pick(this.info!.settings)))}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          </div>`
        : nothing}
    `;
  }

  private async save() {
    if ((this.draft!.trip.method === 'siren' || this.draft!.trip.method === 'relay') && !this.draft!.trip.entity) {
      this.error = `Choose the ${this.draft!.trip.method} entity.`;
      return;
    }
    this.busy = true;
    this.error = '';
    try {
      const latest = (await fetchPanel(this.hass)).settings;
      await savePanel(this.hass, { ...latest, ...this.draft! });
      toast(this, 'Saved.');
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  static styles = extStyles;
}
