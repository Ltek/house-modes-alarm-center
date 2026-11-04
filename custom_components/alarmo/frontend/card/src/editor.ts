// Visual editor for the House Modes & Alarm Center Card (Home Assistant's ha-form).
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from './alarm/lib/types';
import { CardConfig, CardData, DEFAULTS } from './data';

const ALARM_FIELDS = [
  'keep_keypad_visible',
  'use_code_dialog',
  'hide_keypad',
  'show_messages',
  'show_ready_indicator',
  'show_bypassed_sensors',
  'button_scale_actions',
  'button_scale_keypad',
];

const LABELS: Record<string, string> = {
  entity: 'Alarmo alarm (partition)',
  name: 'Name (when House Modes are off)',
  show_header: 'Header: House Mode and panel display',
  show_house_modes: 'House Mode buttons',
  show_alarm: 'Alarm: arm / disarm, code, messages',
  show_panel_keypad: 'Physical panel keypad',
  collapsible: 'Collapsible (tap the header)',
  start_collapsed: 'Start collapsed',
  show_chevron: 'Show the open / close arrow',
  columns: 'House Mode buttons per row',
  hidden_modes: 'Hide these House Modes',
  alarm: 'Alarm options',
  keep_keypad_visible: 'Always show the code keypad',
  use_code_dialog: 'Ask for the code in a dialog',
  hide_keypad: 'Hide the code keypad',
  show_messages: 'Show messages (not ready, triggered)',
  show_ready_indicator: 'Ready indicator on the arm buttons',
  show_bypassed_sensors: 'Warn about bypassed zones',
  button_scale_actions: 'Arm button size',
  button_scale_keypad: 'Code keypad size',
};

@customElement('house-modes-alarm-center-card-editor')
export class HouseModesAlarmCenterCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private data?: CardData;

  setConfig(config: CardConfig) {
    this.config = config;
  }

  protected firstUpdated() {
    this.hass
      ?.callWS<CardData>({ type: 'alarmo/ext/card/get' })
      .then(d => (this.data = d))
      .catch(() => undefined);
  }

  private schema() {
    const modes = (this.data?.house.modes || []).map(m => ({ value: m.id, label: m.name }));
    return [
      { name: 'entity', selector: { entity: { domain: 'alarm_control_panel', integration: 'alarmo' } } },
      { name: 'name', selector: { text: {} } },
      {
        type: 'grid',
        name: '',
        schema: ['show_header', 'show_house_modes', 'show_alarm', 'show_panel_keypad', 'collapsible', 'start_collapsed', 'show_chevron'].map(n => ({
          name: n,
          selector: { boolean: {} },
        })),
      },
      { name: 'columns', selector: { number: { min: 2, max: 9, mode: 'slider' } } },
      ...(modes.length ? [{ name: 'hidden_modes', selector: { select: { multiple: true, mode: 'dropdown', options: modes } } }] : []),
      {
        type: 'expandable',
        name: 'alarm',
        title: LABELS.alarm,
        schema: ALARM_FIELDS.map(n =>
          n.startsWith('button_scale')
            ? { name: n, selector: { number: { min: 1, max: 2.5, step: 0.1, mode: 'slider' } } }
            : { name: n, selector: { boolean: {} } }
        ),
      },
    ];
  }

  render() {
    if (!this.hass || !this.config) return nothing;
    const data = { ...DEFAULTS, ...this.config };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this.schema()}
        .computeLabel=${(s: any) => LABELS[s.name] || s.name}
        @value-changed=${this.changed}
      ></ha-form>
      <p style="color:var(--secondary-text-color);font-size:0.9em">
        Who may use the physical panel keypad is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad
        on dashboards</em>. House Mode icons and colours are set on the House Modes tab.
      </p>
    `;
  }

  private changed(ev: CustomEvent) {
    ev.stopPropagation();
    const v = { ...ev.detail.value };
    // keep the YAML short: drop values equal to the defaults
    for (const [k, d] of Object.entries(DEFAULTS)) if (v[k] === d) delete v[k];
    if (Array.isArray(v.hidden_modes) && !v.hidden_modes.length) delete v.hidden_modes;
    if (v.alarm && !Object.keys(v.alarm).length) delete v.alarm;
    if (!v.name) delete v.name;
    this.config = v;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: v }, bubbles: true, composed: true }));
  }
}
