// "What runs on each mode" (Actions tab): per House Mode, the scripts it runs (its actions), its timers,
// and the Home Assistant automations that react when the mode starts or ends (read from their triggers).
// Read-only: actions and timers are edited in the mode (House Modes tab), automations in Home Assistant's editor.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { HouseActionItem, HouseActionsInfo, editorPath, fetchHouseActions, reactingTo, reactingToAny } from '../../data/house-actions';
import { HouseMode, HouseSettings, defaultModeColor, describeStep, describeTimer, fetchHouse } from '../../data/house';
import { extStyles } from './ext-styles';
import { collapsibleCard, entityBadge } from './page-intro';

/** Which mode panels are open (module-level, so they stay open across re-renders and tab changes). */
const OPEN: Record<string, boolean> = {};

@customElement('alarm-view-house-actions')
export class AlarmViewHouseActions extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: HouseActionsInfo;
  @state() private house?: HouseSettings;
  @state() private error = '';

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      const [info, house] = await Promise.all([fetchHouseActions(this.hass), fetchHouse(this.hass)]);
      this.info = info;
      this.house = house.settings;
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private item(eid: string): HouseActionItem | undefined {
    return this.info?.items.find(i => i.entity_id === eid);
  }

  private open(i: HouseActionItem | undefined) {
    const p = i && editorPath(i);
    if (p) navigate(this, p);
  }

  private async run(eid: string) {
    const [domain] = eid.split('.');
    try {
      if (domain === 'automation') await this.hass.callService('automation', 'trigger', { entity_id: eid });
      else if (domain === 'script') await this.hass.callService('script', 'turn_on', { entity_id: eid });
      else await this.hass.callService('scene', 'turn_on', { entity_id: eid });
      toast(this, `Ran ${this.item(eid)?.name || eid}.`);
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async enable(i: HouseActionItem, on: boolean) {
    await this.hass.callService('automation', on ? 'turn_on' : 'turn_off', { entity_id: i.entity_id });
    window.setTimeout(() => this.load(), 800);
  }

  private nameOf = (id: string) => this.house?.modes.find(m => m.id === id)?.name || id;

  /** One line: badge, name (opens HA's editor), a hint, then the action icons. */
  private line(eid: string, hint: string) {
    const i = this.item(eid);
    const name = i?.name || this.hass.states[eid]?.attributes.friendly_name || eid;
    const p = i && editorPath(i);
    return html`<div class="wr-line">
      ${entityBadge(this.hass, eid)}
      <div class="wr-name">
        ${p ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => this.open(i)}>${name}</button>` : html`<span>${name}</span>`}
        <span class="secondary">${hint}</span>
      </div>
      <span class="wr-actions">
        ${i && i.kind === 'automation'
          ? html`<button class="wr-chip ${i.state === 'on' ? 'on' : ''}" title=${i.state === 'on' ? 'Enabled: click to disable' : 'Disabled: click to enable'}
              @click=${() => this.enable(i, i.state !== 'on')}>${i.state === 'on' ? 'Enabled' : 'Disabled'}</button>`
          : nothing}
        <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.run(eid)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
      </span>
    </div>`;
  }

  private group(title: string, rows: unknown[], empty: string) {
    return html`<div class="wr-group">${title}</div>
      ${rows.length ? rows : html`<div class="secondary wr-empty">${empty}</div>`}`;
  }

  private renderMode(m: HouseMode, items: HouseActionItem[]) {
    const steps = m.steps || [];
    const r = reactingTo(items, m.name);
    const counts = [
      `${steps.length} action${steps.length === 1 ? '' : 's'}`,
      `${m.timers.length} timer${m.timers.length === 1 ? '' : 's'}`,
      `${r.enter.length + r.leave.length} automation${r.enter.length + r.leave.length === 1 ? '' : 's'}`,
    ].join(' · ');
    return html`<details class="collapse sub" ?open=${!!OPEN[m.id]} @toggle=${(e: Event) => (OPEN[m.id] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <ha-icon icon=${m.icon} style=${`color:${m.color || defaultModeColor(m.name)}`}></ha-icon>
        <span class="collapse-title">${m.name}</span>
        <span class="secondary" style="display:inline">${counts}</span>
      </summary>
      <div class="collapse-body">
        ${this.group('Actions (run by the mode)', steps.map(st => this.line(st.entity_id, describeStep(st, this.nameOf))),
          'None. Add scripts in the mode on the House Modes tab.')}
        ${this.group('Timers', m.timers.map(t => html`<div class="wr-line"><ha-icon class="wr-ticon" icon="mdi:timer-outline"></ha-icon>
            <div class="wr-name"><span>${describeTimer(t, this.nameOf)}</span></div></div>`), 'None.')}
        ${this.group('Automations that react', [
          ...r.enter.map(i => this.line(i.entity_id, i.reacts!.from.includes(m.name) ? `when ${m.name} starts or ends` : `when ${m.name} starts`)),
          ...r.leave.map(i => this.line(i.entity_id, `when ${m.name} ends`)),
        ], 'None.')}
      </div>
    </details>`;
  }

  render() {
    const info = this.info;
    const house = this.house;
    if (!info || !house) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const items = info.items.filter(i => i.kind === 'automation');
    const any = reactingToAny(items);
    const nSteps = house.modes.reduce((n, m) => n + (m.steps || []).length, 0);
    const nTimers = house.modes.reduce((n, m) => n + m.timers.length, 0);
    const nAuto = items.filter(i => i.reacts).length;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      ${collapsibleCard('house-actions', 'mdi:home-lightning-bolt-outline', 'What runs on each mode',
        `${nSteps} action${nSteps === 1 ? '' : 's'} · ${nTimers} timer${nTimers === 1 ? '' : 's'} · ${nAuto} automation${nAuto === 1 ? '' : 's'} react${nAuto === 1 ? 's' : ''}`, 'readonly', html`
        <div class="card-content desc">
          <p>For each House Mode: the scripts it runs (its <em>actions</em>), its timers, and the Home Assistant
            automations whose triggers react when the mode starts or ends. This is an overview: change actions and timers in
            the mode on the <a href="/alarmo/house">House Modes</a> tab, and automations in Home Assistant's editor (click a name).</p>
          <p class="secondary" style="display:block">Automations that only use the House Mode as a condition are not listed.
            Actions run only in Live.</p>
        </div>
        ${!house.modes.length
          ? html`<div class="notice warn" style="margin:0 16px 12px">No House Modes yet: add them on the House Modes tab.</div>`
          : html`<div class="wr-modes">${house.modes.map(m => this.renderMode(m, items))}</div>`}
        ${any.length
          ? html`<div class="wr-modes"><details class="collapse sub" ?open=${!!OPEN.__any} @toggle=${(e: Event) => (OPEN.__any = (e.target as HTMLDetailsElement).open)}>
              <summary>
                <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
                <ha-icon icon="mdi:swap-horizontal"></ha-icon>
                <span class="collapse-title">Every change</span>
                <span class="secondary" style="display:inline">${any.length} automation${any.length === 1 ? '' : 's'}</span>
              </summary>
              <div class="collapse-body">${any.map(i => this.line(i.entity_id, 'on every House Mode change'))}</div>
            </details></div>`
          : nothing}
      `)}
    `;
  }

  static styles = [
    extStyles,
    css`
      .wr-modes {
        padding: 0 4px;
      }
      details.collapse.sub[open] {
        border-color: var(--accent-color);
      }
      .wr-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 13px;
        margin: 10px 0 2px;
      }
      .wr-line {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .wr-line:last-child {
        border-bottom: none;
      }
      .wr-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .wr-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .wr-ticon {
        color: var(--secondary-text-color);
        margin: 0 8px;
      }
      .wr-empty {
        padding: 2px 0 4px;
      }
      .wr-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 1px 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .wr-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    `,
  ];
}
