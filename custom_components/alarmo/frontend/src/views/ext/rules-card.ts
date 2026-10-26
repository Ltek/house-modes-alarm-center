// "Zone rules" card shown above the zone table: list, add/edit/delete, enable toggle,
// matched-zone counts, stale-reference warnings. Emits `rules-changed`.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { mdiDeleteOutline, mdiPencil, mdiPlus } from '@mdi/js';
import { AlarmoArea, Dictionary, EArmModes, HomeAssistant } from '../../types';
import { localize } from '../../../localize/localize';
import { wsErrorMessage } from '../../data/ext-websockets';
import {
  RegistryNames,
  RulesPreview,
  ZoneRule,
  deleteRule,
  describeMatch,
  describeSet,
  fromPairs,
  matchCounts,
  saveRule,
} from '../../data/zone-rules';
import { extStyles } from './ext-styles';
import { sectionHead } from './page-intro';
import './rule-editor-dialog';

@customElement('alarmo-ext-rules-card')
export class AlarmoExtRulesCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) rules: ZoneRule[] = [];
  @property({ attribute: false }) preview?: RulesPreview;
  @property({ attribute: false }) registry: RegistryNames = { labels: {}, areas: {}, floors: {} };
  @property({ attribute: false }) partitions: Dictionary<AlarmoArea> = {};

  @state() private editing: ZoneRule | null | undefined = undefined; // undefined = closed, null = new
  @state() private open = true;
  @state() private error = '';

  private modeLabel = (m: string) => {
    const base = localize(`common.modes_short.${m}`, this.hass.language) || m;
    return m === EArmModes.ArmedHome && base === 'Home' ? 'Home (Stay)' : base;
  };

  render() {
    const counts = matchCounts(this.preview);
    const partNames = fromPairs(Object.values(this.partitions).map(p => [p.area_id, p.name] as [string, string]));
    const stale = this.preview?.stale || [];
    const sorted = [...this.rules].sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name));
    return html`
      <ha-card>
        ${sectionHead(
          html`<button class="link" style="font-size:inherit;padding:0" aria-expanded=${this.open} @click=${() => (this.open = !this.open)}>
            ${this.open ? '▾' : '▸'} Zone rules (${this.rules.length})</button>`,
          'settings'
        )}
        <div class="card-content desc"><p>Optional: assign zones automatically from Home Assistant labels, areas and floors.</p></div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${this.editing !== undefined} @click=${() => (this.editing = null)}>
            <ha-svg-icon slot="start" .path=${mdiPlus}></ha-svg-icon>
            New rule
          </ha-button>
        </div>
        ${this.editing !== undefined
        ? html`
            <alarmo-ext-rule-editor
              .hass=${this.hass}
              .registry=${this.registry}
              .partitions=${this.partitions}
              .rule=${this.editing || undefined}
              @close=${() => (this.editing = undefined)}
              @saved=${() => {
                this.editing = undefined;
                this.changed();
              }}
            ></alarmo-ext-rule-editor>
          `
        : nothing}
        ${this.open
          ? html`
              <div class="card-content desc">
                <p>A rule says: <em>zones with label X (and/or in area Y, on floor Z) get partition P, these Arm Modes and
                  these options</em>.</p>
                <ul>
                  <li>Rules never change anything by themselves: the results show as pending changes in the zone
                    assignments below, and you Apply them.</li>
                  <li>A value you change by hand becomes an override that the rules leave alone.</li>
                  <li>Rules are optional — zones you set up by hand keep working.</li>
                </ul>
              </div>
              ${this.error ? html`<div class="notice error">${this.error}</div>` : nothing}
              ${stale.length
                ? html`<div class="notice warn">
                    Some rules refer to labels, areas or floors that no longer exist (those conditions are ignored):
                    ${stale.map(s => html`<div>${s.name}: ${s.kind.slice(0, -1)} <code>${s.ref}</code></div>`)}
                  </div>`
                : nothing}
              ${sorted.length
                ? html`
                    <div class="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th class="c">On</th>
                            <th>Rule</th>
                            <th>Matches</th>
                            <th>Sets</th>
                            <th class="c">Zones</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${sorted.map(
                            r => html`
                              <tr class=${r.enabled ? '' : 'status-removed'}>
                                <td class="c">
                                  <ha-switch
                                    aria-label=${`Enable ${r.name}`}
                                    .checked=${r.enabled}
                                    @change=${(e: any) => this.toggleRule(r, e.target.checked)}
                                  ></ha-switch>
                                </td>
                                <td class="name">${r.name}</td>
                                <td style="white-space:normal">${describeMatch(r.match, this.registry)}</td>
                                <td style="white-space:normal">${describeSet(r.set, partNames, this.modeLabel)}</td>
                                <td class="c">${r.enabled ? counts[r.id!] || 0 : '—'}</td>
                                <td>
                                  <ha-icon-button .path=${mdiPencil} .label=${'Edit rule'} @click=${() => (this.editing = r)}></ha-icon-button>
                                  <ha-icon-button .path=${mdiDeleteOutline} .label=${'Delete rule'} @click=${() => this.removeRule(r)}></ha-icon-button>
                                </td>
                              </tr>
                            `
                          )}
                        </tbody>
                      </table>
                    </div>
                  `
                : html`<div class="empty">
                    No rules yet. Rules are optional: zones you set up by hand keep working as before.
                  </div>`}
            `
          : nothing}
      </ha-card>
    `;
  }

  private changed() {
    this.dispatchEvent(new CustomEvent('rules-changed'));
  }

  private async toggleRule(rule: ZoneRule, enabled: boolean) {
    this.error = '';
    try {
      await saveRule(this.hass, { ...rule, enabled });
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async removeRule(rule: ZoneRule) {
    if (!window.confirm(`Delete the rule "${rule.name}"? Zones keep their current settings.`)) return;
    this.error = '';
    try {
      await deleteRule(this.hass, rule.id!);
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  static styles = extStyles;
}
