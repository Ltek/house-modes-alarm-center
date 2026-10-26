// Page intro for the upstream pages (General, Partitions, Arm Modes, Codes, Notifications,
// Actions, legacy Zones) so every tab starts the same way as the ext pages: a title, what the
// page is for, and whether it holds settings.
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { extStyles } from './ext-styles';

export type IntroRole = 'settings' | 'picker' | 'readonly' | 'legacy';

export const PAGE_INTROS: Record<string, { role: IntroRole; text: string }> = {
  general: {
    role: 'settings',
    text:
      'Alarmo-wide options: what happens after an alarm, MQTT, and the "All partitions" alarm entity.' +
      '\n\nThe "All partitions" entity only exists when there are two or more partitions.',
  },
  partitions: {
    role: 'settings',
    text:
      'Alarmo partitions are parts of the building that are armed separately. Each has its own alarm entity: alarm_control_panel.<partition name>.' +
      '\n\nMost homes need one partition. The zone, notification and action counts link to those pages.',
  },
  modes: {
    role: 'settings',
    text:
      "Alarmo's arm modes per partition: which ones the partition offers, and Alarmo's exit delay, entry delay and trigger time for each." +
      "\n\nWith a physical panel, the physical panel's own delays still apply to its own zones.",
  },
  zones_legacy: {
    role: 'legacy',
    text:
      "Upstream Alarmo's original zone page, kept for reference." +
      '\n\nZone Assignments does the same and more. Changes made here are not backed up first.',
  },
  codes: {
    role: 'settings',
    text: 'Who may arm and disarm Alarmo with a code, and when a code is needed.',
  },
  notifications: {
    role: 'settings',
    text: 'Messages Alarmo sends on alarm events — armed, disarmed, triggered, failed to arm … — per partition.',
  },
  actions: {
    role: 'settings',
    text: 'Home Assistant actions Alarmo runs on alarm events, per partition.',
  },
};

const ROLE = {
  settings: { icon: 'mdi:cog', label: 'Settings' },
  picker: { icon: 'mdi:playlist-plus', label: 'Picker' },
  readonly: { icon: 'mdi:eye', label: 'Read only' },
  legacy: { icon: 'mdi:history', label: 'Legacy' },
};

/** Role chip (Settings / Picker / Read only / Legacy). */
export const roleChip = (role: IntroRole) =>
  html`<span class="role"><ha-icon icon=${ROLE[role].icon}></ha-icon>${ROLE[role].label}</span>`;

/** Section header: title on the left, role chip on the right. */
export const sectionHead = (title: unknown, role?: IntroRole, extra: unknown = nothing) =>
  html`<div class="sec-head"><h2>${title}</h2><span class="sec-side">${extra}${role ? roleChip(role) : nothing}</span></div>`;

/** Lock/unlock toggle for tables with zone settings. Emits nothing; call onToggle. */
export const lockToggle = (locked: boolean, onToggle: () => void) =>
  html`<ha-button appearance=${locked ? 'plain' : 'filled'} @click=${onToggle}
    title=${locked ? 'Unlock to change the settings in this table' : 'Lock the table again'}>
    <ha-icon slot="start" icon=${locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon>${locked ? 'Unlock to edit' : 'Editing — lock'}
  </ha-button>`;

/** Entity icon (like HA's own tables). Click opens the more-info dialog. status colours the icon. */
export const entityBadge = (
  hass: any,
  entityId: string,
  status: 'new' | 'changed' | 'removed' | 'unchanged' = 'unchanged'
) => {
  const stateObj = hass.states[entityId];
  const color =
    status === 'changed'
      ? 'var(--warning-color, #ffc107)'
      : status === 'new'
        ? 'var(--success-color, #4caf50)'
        : status === 'removed'
          ? 'var(--error-color, #f44336)'
          : '';
  const title =
    (status === 'changed' ? 'Unsaved changes · ' : status === 'new' ? 'New, not saved · ' : status === 'removed' ? 'Will be removed · ' : '') +
    'Show details';
  return html`<button class="badge-btn" title=${title} aria-label=${`Show details of ${entityId}`}
    @click=${(e: Event) => e.target!.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }))}>
    ${stateObj
      ? html`<state-badge .hass=${hass} .stateObj=${stateObj} .stateColor=${!color}
          style=${color ? `--state-icon-color:${color};--state-icon-active-color:${color};color:${color}` : ''}></state-badge>`
      : html`<ha-icon icon="mdi:help-circle-outline" style=${color ? `color:${color}` : ''}></ha-icon>`}
  </button>`;
};

@customElement('alarmo-ext-page-intro')
export class AlarmoExtPageIntro extends LitElement {
  @property() page = '';
  @property() heading = '';

  render() {
    const intro = PAGE_INTROS[this.page];
    if (!intro) return html``;
    return html`
      <div class="notice warn" style="margin:0 0 12px;display:flex;gap:8px;align-items:flex-start">
        ${roleChip(intro.role)}
        <div class="desc" style="padding:0">${intro.text.split('\n\n').map(p => html`<p style="margin:0 0 4px">${p}</p>`)}</div>
      </div>
    `;
  }

  static styles = extStyles;
}
