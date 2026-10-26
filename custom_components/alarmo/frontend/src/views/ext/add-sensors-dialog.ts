// "Add sensors" picker for the sensor table. Emits `sensors-picked` with
// { entity_ids, area } and `close`. Adding only creates draft rows.
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AlarmoArea, Dictionary, HomeAssistant } from '../../types';
import { computeName } from '../../helpers';
import { isValidSensor } from '../../data/sensors';
import { HassEntity } from 'home-assistant-js-websocket';

const COVER_CLASSES = ['garage', 'gate', 'door', undefined, null, ''];

/** Entities that can be zones: binary sensors, plus garage/gate/door covers and locks. */
export const isZoneCandidate = (e: HassEntity, showAll: boolean) => {
  const domain = e.entity_id.split('.')[0];
  if (domain === 'cover') return showAll || COVER_CLASSES.includes(e.attributes.device_class as any);
  if (domain === 'lock') return true;
  return isValidSensor(e, showAll);
};
import { extStyles } from './ext-styles';
import { entityBadge } from './page-intro';

@customElement('alarmo-ext-add-sensors')
export class AlarmoExtAddSensors extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) areas: Dictionary<AlarmoArea> = {};
  @property({ attribute: false }) exclude: string[] = [];
  @property() defaultArea = '';

  @state() private search = '';
  @state() private deviceClass = '';
  @state() private showAll = false;
  @state() private picked: string[] = [];
  @state() private area = '';

  firstUpdated() {
    this.area = this.defaultArea || Object.keys(this.areas)[0] || '';
  }

  private candidates() {
    const q = this.search.trim().toLowerCase();
    return Object.values(this.hass.states)
      .filter(e => isZoneCandidate(e, this.showAll))
      .filter(e => !this.exclude.includes(e.entity_id))
      .filter(e => !this.deviceClass || e.attributes.device_class === this.deviceClass)
      .filter(e => !q || e.entity_id.includes(q) || computeName(e).toLowerCase().includes(q))
      .sort((a, b) => computeName(a).localeCompare(computeName(b)));
  }

  render() {
    const all = Object.values(this.hass.states)
      .filter(e => isZoneCandidate(e, true))
      .filter(e => !this.exclude.includes(e.entity_id));
    const classes = [...new Set(all.map(e => e.attributes.device_class).filter(Boolean))].sort() as string[];
    const list = this.candidates();
    const allPicked = list.length > 0 && list.every(e => this.picked.includes(e.entity_id));

    return html`
      <div class="overlay" @click=${(ev: Event) => ev.target === ev.currentTarget && this.close()}>
        <div class="modal" role="dialog" aria-label="Add zones">
          <h2>Add zones</h2>
          <div class="body">
            <div class="toolbar" style="padding:8px 0">
              <input
                type="search"
                placeholder="Search name or entity ID"
                aria-label="Search"
                .value=${this.search}
                @input=${(e: any) => (this.search = e.target.value)}
              />
              <select aria-label="Device class" @change=${(e: any) => (this.deviceClass = e.target.value)}>
                <option value="">All device classes</option>
                ${classes.map(c => html`<option value=${c} ?selected=${c === this.deviceClass}>${c}</option>`)}
              </select>
              <label>
                <input type="checkbox" .checked=${this.showAll} @change=${(e: any) => (this.showAll = e.target.checked)} />
                Show all binary sensors and covers
              </label>
            </div>
            <div class="table-wrap" style="max-height:50vh">
              <table>
                <thead>
                  <tr>
                    <th class="c">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        .checked=${allPicked}
                        @change=${(e: any) => this.pickAll(list.map(s => s.entity_id), e.target.checked)}
                      />
                    </th>
                    <th class="icon"></th>
                    <th>Entity</th>
                    <th>Device class</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map(
                    e => html`
                      <tr>
                        <td class="c">
                          <input
                            type="checkbox"
                            aria-label=${`Select ${computeName(e)}`}
                            .checked=${this.picked.includes(e.entity_id)}
                            @change=${(ev: any) => this.pickAll([e.entity_id], ev.target.checked)}
                          />
                        </td>
                        <td class="icon">${entityBadge(this.hass, e.entity_id)}</td>
                        <td class="name">${computeName(e)}<span class="secondary">${e.entity_id}</span></td>
                        <td>${e.attributes.device_class || '—'}</td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
              ${list.length ? '' : html`<div class="empty">No unconfigured entities match.</div>`}
            </div>
          </div>
          <div class="footer">
            <label style="margin-right:auto">
              Add to partition
              <select aria-label="Partition" @change=${(e: any) => (this.area = e.target.value)}>
                ${Object.values(this.areas).map(
                  a => html`<option value=${a.area_id} ?selected=${a.area_id === this.area}>${a.name}</option>`
                )}
              </select>
            </label>
            <ha-button appearance="plain" @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${!this.picked.length || !this.area} @click=${this.confirm}>
              Add ${this.picked.length || ''} zone${this.picked.length === 1 ? '' : 's'}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }

  private pickAll(ids: string[], on: boolean) {
    const rest = this.picked.filter(id => !ids.includes(id));
    this.picked = on ? [...rest, ...ids] : rest;
  }

  private confirm() {
    this.dispatchEvent(new CustomEvent('sensors-picked', { detail: { entity_ids: this.picked, area: this.area } }));
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  static styles = extStyles;
}
