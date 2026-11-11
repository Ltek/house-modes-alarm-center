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
      'Options for the whole alarm: what happens after an alarm, MQTT, and the "All partitions" alarm entity.' +
      '\n\nThe "All partitions" entity only exists when there are two or more partitions.',
  },
  partitions: {
    role: 'settings',
    text:
      'Partitions are parts of the building that are armed separately. Each has its own alarm entity: alarm_control_panel.<partition name>.' +
      '\n\nMost homes need one partition. The zone, notification and action counts link to those pages.',
  },
  modes: {
    role: 'settings',
    text:
      "The Arm Modes per partition: which ones the partition offers, and the alarm's exit delay, entry delay and trigger time for each." +
      "\n\nWith a physical panel, the physical panel's own delays still apply to its own zones.",
  },
  zones_legacy: {
    role: 'legacy',
    text:
      "The original zone page, kept for reference." +
      '\n\nZones does the same and more. Changes made here are not backed up first.',
  },
  codes: {
    role: 'settings',
    text: 'Who may arm and disarm the alarm with a code, and when a code is needed.',
  },
  notifications: {
    role: 'settings',
    text: 'Messages sent on alarm events — armed, disarmed, triggered, failed to arm … — per partition.',
  },
  actions: {
    role: 'settings',
    text: 'Scripts that run on alarm events, per partition.',
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

/** Which collapsible cards are open, by id. Module-level so a card stays as it was across re-renders and tab changes. */
const CARD_OPEN: Record<string, boolean> = {};

/**
 * A top-level card that collapses to one line: chevron, icon, title, a short summary of what is inside, role chip.
 * Starts collapsed so a tab shows at a glance what it holds.
 */
export const collapsibleCard = (id: string, icon: string, title: string, summary: unknown, role: IntroRole | undefined, body: unknown) =>
  html`<ha-card class="fold-card">
    <details class="collapse top" ?open=${!!CARD_OPEN[id]} @toggle=${(e: Event) => (CARD_OPEN[id] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <ha-icon class="fold-icon" icon=${icon}></ha-icon>
        <span class="fold-title">${title}</span>
        <span class="secondary" style="display:inline">${summary}</span>
        <span class="grow"></span>
        ${role ? roleChip(role) : nothing}
      </summary>
      <div class="fold-body">${body}</div>
    </details>
  </ha-card>`;

/** Lock/unlock toggle for tables with zone settings. Emits nothing; call onToggle. */
export const lockToggle = (locked: boolean, onToggle: () => void) =>
  html`<ha-button appearance=${locked ? 'plain' : 'filled'} @click=${onToggle}
    title=${locked ? 'Unlock to change the settings in this table' : 'Lock the table again'}>
    <ha-icon slot="start" icon=${locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon>${locked ? 'Unlock to edit' : 'Editing — lock'}
  </ha-button>`;

/** Entity icon (like HA's own tables). Click opens the more-info dialog. status colors the icon. */
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

@customElement('hm-page-intro')
export class HmExtPageIntro extends LitElement {
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

/** Show/hide checkboxes for a list (e.g. Enabled, Disabled). ``shown`` is the set of checked keys. */
export const filterChecks = (
  options: { key: string; label: string; count: number; hint?: string; icon?: string; color?: string }[],
  shown: Set<string>,
  onChange: (next: Set<string>) => void,
  label = 'Show'
) => html`<div class="list-filters">
  <span class="secondary" style="display:inline">${label}</span>
  ${options.filter(o => o.count).map(o => html`<label class="list-filter" title=${o.hint || ''}><input type="checkbox" .checked=${shown.has(o.key)}
      @change=${(e: Event) => {
        const next = new Set(shown);
        if ((e.target as HTMLInputElement).checked) next.add(o.key);
        else next.delete(o.key);
        onChange(next);
      }} />${o.icon ? html`<ha-icon class="list-filter-ic" icon=${o.icon} style=${o.color ? `color:${o.color}` : ''}></ha-icon>` : ''}${o.label} <span class="secondary" style="display:inline">(${o.count})</span></label>`)}
</div>`;

/** Which tab sections are open, by id (module-level: kept across re-renders and tab changes). All start collapsed. */
const TAB_SECTION_OPEN: Record<string, boolean> = {};

/**
 * One collapsible section of a tab (the Activity tab's layout): chevron, UPPERCASE title, a one-line summary.
 * ``flat``: the body is another element with its own card; that card is drawn flat and its title is hidden.
 */
export const tabSection = (id: string, title: unknown, summary: unknown, body: unknown, opts: { flat?: boolean; open?: boolean } = {}) =>
  html`<details class="collapse tab-sec ${opts.flat ? 'flat' : ''}" ?open=${id in TAB_SECTION_OPEN ? TAB_SECTION_OPEN[id] : !!opts.open}
      @toggle=${(e: Event) => (TAB_SECTION_OPEN[id] = (e.target as HTMLDetailsElement).open)}>
    <summary>
      <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      <span class="collapse-title">${title}</span>
      ${summary ? html`<span class="secondary" style="display:inline">${summary}</span>` : nothing}
    </summary>
    <div class="collapse-body">${body}</div>
  </details>`;

/** A tab as one card: title, role chip and intro on top, then its sections (the Activity tab's layout). */
export const tabCard = (title: unknown, role: IntroRole | undefined, intro: unknown, sections: unknown) =>
  html`<ha-card class="tab-card">${sectionHead(title, role)}
    ${intro ? html`<div class="card-content desc">${intro}</div>` : nothing}
    <div class="tab-secs">${sections}</div>
  </ha-card>`;

/** Small lock / unlock button for one risky setting (Current Run State, Remove link …). */
export const settingLock = (locked: boolean, onToggle: () => void, what = 'this setting') =>
  html`<button class="setting-lock ${locked ? '' : 'open'}" title=${locked ? `Unlock to change ${what}` : 'Lock again'}
    aria-pressed=${!locked} @click=${onToggle}><ha-icon icon=${locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon></button>`;

/** Lock state of the risky settings: module-level, so they lock again when the panel is reloaded. */
export const SETTING_LOCKS: Record<string, boolean> = {};
export const isLocked = (key: string) => SETTING_LOCKS[key] !== false;

export type RunState = 'off' | 'shadow' | 'live';
const RUN_LABEL: Record<RunState, string> = { off: 'Off', shadow: 'Shadow', live: 'Live' };

/** A run-state chip: Off red, Shadow yellow, Live green. */
export const runChip = (state: string) =>
  html`<span class="run-chip run-${state}">${RUN_LABEL[state as RunState] || state}</span>`;

/**
 * "Current Run State:" as a chip with a lock beside it; unlocked, the Off / Shadow / Live radio buttons appear.
 * ``key`` names the lock (SETTING_LOCKS), ``name`` the radio group.
 */
export const runStateRow = (key: string, name: string, value: string, onChange: (v: RunState) => void, rerender: () => void) => {
  const locked = isLocked(key);
  return html`<span class="run-state">
    <span>Current Run State:</span>
    ${runChip(value)}
    ${settingLock(locked, () => { SETTING_LOCKS[key] = !locked; rerender(); }, 'the run state')}
    ${locked
      ? nothing
      : (['off', 'shadow', 'live'] as RunState[]).map(v => html`<label><input type="radio" name=${name} .checked=${value === v}
          @change=${() => onChange(v)} />${RUN_LABEL[v]}</label>`)}
  </span>`;
};
