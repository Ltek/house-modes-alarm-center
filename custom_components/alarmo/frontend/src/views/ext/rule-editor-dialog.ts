// Zone rule editor, shown in the page (not a popup). Emits `saved` (with the stored rule) and `close`.
// Saving a rule changes no zones: the results show up as pending rule changes.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AlarmoArea, Dictionary, EArmModes, HomeAssistant } from '../../types';
import { ESensorTypes } from '../../const';
import { localize } from '../../../localize/localize';
import { wsErrorMessage } from '../../data/ext-websockets';
import {
  RegistryNames,
  SET_FIELD_LABELS,
  ZoneRule,
  emptyRule,
  ruleErrors,
  ruleTemplates,
  saveRule,
  specificity,
  toggle,
} from '../../data/zone-rules';
import { extStyles } from './ext-styles';
import './slider-field';
import { sectionHead } from './page-intro';
import './multi-picker';
import { toOptions } from '../../data/picker';
import { helpText } from '../../data/zone-help';

const MODES: EArmModes[] = [
  EArmModes.ArmedAway,
  EArmModes.ArmedHome,
  EArmModes.ArmedNight,
  EArmModes.ArmedVacation,
  EArmModes.ArmedCustom,
];
const BOOL_FIELDS = [
  'enabled',
  'always_on',
  'use_entry_delay',
  'use_exit_delay',
  'allow_open',
  'arm_on_close',
  'trigger_unavailable',
  'auto_bypass',
];
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

@customElement('alarmo-ext-rule-editor')
export class AlarmoExtRuleEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) registry: RegistryNames = { labels: {}, areas: {}, floors: {} };
  @property({ attribute: false }) partitions: Dictionary<AlarmoArea> = {};
  @property({ attribute: false }) rule?: ZoneRule;

  @state() private draft: ZoneRule = emptyRule();
  @state() private busy = false;
  @state() private error = '';

  firstUpdated() {
    this.draft = this.rule ? clone(this.rule) : emptyRule();
  }

  private modeLabel(m: string) {
    const base = localize(`common.modes_short.${m}`, this.hass.language) || m;
    return m === EArmModes.ArmedHome && base === 'Home' ? 'Home (Stay)' : base;
  }

  private setMatch(kind: 'labels' | 'areas' | 'floors', id: string, on: boolean) {
    this.draft = { ...this.draft, match: { ...this.draft.match, [kind]: toggle(this.draft.match[kind], id, on) } };
  }

  /** Turn a "set" field on (with a default) or off. */
  private useField(field: string, on: boolean, value: any) {
    const set = { ...this.draft.set };
    if (on) set[field] = value;
    else delete set[field];
    this.draft = { ...this.draft, set };
  }

  private setValue(field: string, value: any) {
    this.draft = { ...this.draft, set: { ...this.draft.set, [field]: value } };
  }

  render() {
    const d = this.draft;
    const errors = ruleErrors(d);
    const firstPartition = Object.keys(this.partitions)[0];
    return html`
      <ha-card class="editor">
          ${sectionHead(d.id ? `Edit zone rule: ${d.name}` : 'New zone rule', 'settings')}
          <div class="toolbar">
            <span class="grow secondary" style="display:inline">Saving a rule changes no zones; the results show as pending changes below.</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy || errors.length > 0} @click=${this.save}>${this.busy ? 'Saving…' : 'Save rule'}</ha-button>
          </div>
          <div class="card-content">
            ${d.id
              ? nothing
              : html`
                  <p>
                    Start from a template:
                    ${ruleTemplates(this.registry, firstPartition).map(
                      t => html`<button class="link" @click=${() => (this.draft = clone(t.rule))}>${t.name}</button>`
                    )}
                  </p>
                `}
            <p>
              <label>
                Name
                <input
                  type="text"
                  maxlength="80"
                  aria-label="Rule name"
                  .value=${d.name}
                  @input=${(e: any) => (this.draft = { ...this.draft, name: e.target.value })}
                />
              </label>
              <label style="margin-left:16px">
                <input
                  type="checkbox"
                  .checked=${d.enabled}
                  @change=${(e: any) => (this.draft = { ...this.draft, enabled: e.target.checked })}
                />
                Enabled
              </label>
            </p>

            <h3 style="font-weight:500;margin:12px 0 4px">Match zones that have…</h3>
            <div class="desc" style="padding:0">
              <ul>
                <li>All chosen labels must be present (on the entity or on its device).</li>
                <li>Any chosen area or floor matches.</li>
                <li>More conditions = more specific; the more specific rule wins for single values.</li>
              </ul>
            </div>
            ${this.renderPicker('labels', 'Labels (all of)', this.registry.labels)}
            ${this.renderPicker('areas', 'Areas (any of)', this.registry.areas)}
            ${this.renderPicker('floors', 'Floors (any of)', this.registry.floors)}

            <h3 style="font-weight:500;margin:12px 0 4px">…and set</h3>
            ${this.renderSetRow(
              'partition',
              firstPartition,
              html`
                <select aria-label="Partition" @change=${(e: any) => this.setValue('partition', e.target.value)}>
                  ${Object.values(this.partitions).map(
                    p => html`<option value=${p.area_id} ?selected=${d.set.partition === p.area_id}>${p.name}</option>`
                  )}
                </select>
              `
            )}
            ${this.renderSetRow(
              'modes',
              [],
              html`${MODES.map(
                m => html`
                  <label style="margin-right:8px">
                    <input
                      type="checkbox"
                      .checked=${(d.set.modes || []).includes(m)}
                      @change=${(e: any) => this.setValue('modes', toggle(d.set.modes || [], m, e.target.checked))}
                    />
                    ${this.modeLabel(m)}
                  </label>
                `
              )}<span class="secondary" style="display:block">Modes from all matching rules are added together.</span>`
            )}
            ${this.renderSetRow(
              'type',
              ESensorTypes.Door,
              html`
                <select aria-label="Zone type" @change=${(e: any) => this.setValue('type', e.target.value)}>
                  ${Object.values(ESensorTypes).map(
                    t => html`<option value=${t} ?selected=${d.set.type === t}>
                      ${localize(`panels.sensors.cards.editor.fields.device_type.choose.${t}.name`, this.hass.language) || t}
                    </option>`
                  )}
                </select>
              `
            )}
            ${BOOL_FIELDS.map(f =>
              this.renderSetRow(
                f,
                true,
                html`
                  <select aria-label=${SET_FIELD_LABELS[f]} @change=${(e: any) => this.setValue(f, e.target.value === 'on')}>
                    <option value="on" ?selected=${d.set[f] === true}>On</option>
                    <option value="off" ?selected=${d.set[f] === false}>Off</option>
                  </select>
                `
              )
            )}
            ${['entry_delay', 'delay_on'].map(f =>
              this.renderSetRow(
                f,
                null,
                html`
                  <alarmo-ext-slider
                    compact
                    optional
                    .label=${SET_FIELD_LABELS[f]}
                    .min=${0}
                    .max=${f === 'entry_delay' ? 300 : 600}
                    .onValue=${30}
                    unit="s"
                    offText="partition default"
                    .value=${d.set[f] === null || d.set[f] === undefined ? null : d.set[f]}
                    @value-changed=${(e: CustomEvent) => this.setValue(f, e.detail.value)}
                  ></alarmo-ext-slider>
                `
              )
            )}
            <p class="secondary" style="display:block">
              Specificity: ${specificity(d)}. Saving a rule changes no zones — the results appear as pending rule
              changes on the Zones page, to preview and apply.
            </p>
            ${errors.length && d.name
              ? html`<div class="notice warn" style="margin:8px 0">${errors.map(e => html`<div>${e}</div>`)}</div>`
              : nothing}
            ${this.error ? html`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>` : nothing}
          </div>
          <div class="toolbar">
            <span class="grow"></span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy || errors.length > 0} @click=${this.save}>${this.busy ? 'Saving…' : 'Save rule'}</ha-button>
          </div>
      </ha-card>
    `;
  }

  private renderPicker(kind: 'labels' | 'areas' | 'floors', title: string, options: Record<string, string>) {
    return html`
      <alarmo-ext-multi-picker
        .label=${title}
        .placeholder=${`Add a ${kind.slice(0, -1)}…`}
        .options=${toOptions(options)}
        .value=${this.draft.match[kind]}
        @value-changed=${(e: CustomEvent) => (this.draft = { ...this.draft, match: { ...this.draft.match, [kind]: e.detail.value } })}
      ></alarmo-ext-multi-picker>
    `;
  }

  private renderSetRow(field: string, defaultValue: any, control: unknown) {
    const on = field in this.draft.set;
    return html`
      <div class="detail-grid" style="padding:2px 0;align-items:center">
        <label style="min-width:220px;cursor:help" title=${helpText(field)}>
          <input type="checkbox" .checked=${on} @change=${(e: any) => this.useField(field, e.target.checked, defaultValue)} />
          ${SET_FIELD_LABELS[field]}
        </label>
        ${on ? control : nothing}
      </div>
    `;
  }

  private async save() {
    this.busy = true;
    this.error = '';
    try {
      const saved = await saveRule(this.hass, this.draft);
      this.dispatchEvent(new CustomEvent('saved', { detail: saved }));
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  static styles = extStyles;
}
