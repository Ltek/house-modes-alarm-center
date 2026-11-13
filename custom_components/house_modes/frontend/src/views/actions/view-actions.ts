// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { LitElement, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { loadHaForm } from '../../load-ha-elements';

import { EAlarmEvent, AlarmEntity, HmAutomation, Dictionary, HmArea, HmConfig, HomeAssistant } from '../../types';
import { SubscribeMixin } from '../../subscribe-mixin';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';

import { commonStyle } from '../../styles';
import { fetchAutomations, saveAutomation, fetchAreas, fetchConfig, deleteAutomation } from '../../data/websockets';
import { TableColumn, TableFilterConfig } from '../../components/hm-table';
import { handleError, Unique, isDefined, flatten, sortAlphabetically, navigate } from '../../helpers';
import { localize } from '../../../localize/localize';

import './notification-editor-card.ts';
import './automation-editor-card.ts';
import '../../components/hm-settings-row';

import { EAutomationTypes } from '../../const';
import { getAreaOptions, computeAreaDisplay, computeEventDisplay, computeArmModeDisplay } from '../../data/actions';
import { css } from 'lit';
import { extStyles } from '../ext/ext-styles';
import { exportPath, Path } from '../../common/navigation';
import { roleChip, sectionHead, filterChecks, tabCard, tabSection } from '../ext/page-intro';

/** Which notifications / Alarm Events are shown (module-level: kept across re-renders and tab changes). */
const SHOWN: Record<string, Set<string>> = { notifications: new Set(['on', 'off', 'warning']), events: new Set(['on', 'off', 'warning', 'legacy']) };
import { isLegacyEvent, eventTargets } from '../../data/alarm-events';
import '../ext/event-migrate';
import '../ext/smart-alerts';
import '../ext/house-notifications';

const noArea = 'no_area';

@customElement('hm-view-actions')
export class AlarmViewActions extends SubscribeMixin(LitElement) {
  @property()
  hass?: HomeAssistant;

  @property()
  narrow!: boolean;

  @property()
  path!: Path;

  @property()
  alarmEntity?: AlarmEntity;

  @property()
  automations?: HmAutomation[];

  @property()
  areas: Dictionary<HmArea> = {};

  @property()
  config!: HmConfig;

  @property()
  selectedArea?: string;

  /** ext: show one list only (undefined = upstream: both) */
  @property()
  section?: 'notifications' | 'actions';

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this._fetchData();
    return [this.hass!.connection.subscribeMessage(() => this._fetchData(), { type: 'house_modes_config_updated' })];
  }

  private async _fetchData(): Promise<void> {
    if (!this.hass) {
      return;
    }
    const automations = await fetchAutomations(this.hass);
    this.automations = Object.values(automations);
    this.areas = await fetchAreas(this.hass);
    this.config = await fetchConfig(this.hass);
  }

  firstUpdated() {
    if (this.path.filter) {
      this.selectedArea = this.path.filter?.area;
    }
    (async () => await loadHaForm())();
  }

  render() {
    if (!this.hass || !this.automations || !this.config) return html``;

    // ext: editors open in place, under their section header (not instead of the page)
    const editor = (() => {
      if (this.path.subpage == 'new_notification')
        return html`<hm-notification-editor-card .hass=${this.hass} .narrow=${this.narrow}></hm-notification-editor-card>`;
      if (this.path.params.edit_notification) {
        const config = this.automations!.find(
          e => e.automation_id == this.path.params.edit_notification && e.type == EAutomationTypes.Notification
        );
        return html`<hm-notification-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${config}></hm-notification-editor-card>`;
      }
      if (this.path.subpage == 'new_action')
        return html`<hm-automation-editor-card .hass=${this.hass} .narrow=${this.narrow} .preset=${this.path.params.scene}></hm-automation-editor-card>`;
      if (this.path.params.edit_action) {
        const config = this.automations!.find(
          e => e.automation_id == this.path.params.edit_action && e.type == EAutomationTypes.Action
        );
        return html`<hm-automation-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${config}></hm-automation-editor-card>`;
      }
      return null;
    })();
    {
      const notificationData = this.automations
        .filter(e => e.type == EAutomationTypes.Notification)
        .map(e =>
          Object({
            ...e,
            id: e.automation_id,
            warning: !this.config.master.enabled && !this.getAreaForAutomation(e),
            area: this.getAreaForAutomation(e) || noArea,
          })
        );

      const automationData = this.automations
        .filter(e => e.type == EAutomationTypes.Action)
        .map(e =>
          Object({
            ...e,
            id: e.automation_id,
            warning: !this.config.master.enabled && !this.getAreaForAutomation(e),
            area: this.getAreaForAutomation(e) || noArea,
          })
        );

      const showNotifications = this.section !== 'actions';
      const showActions = this.section !== 'notifications';
      return html`
        ${showNotifications && editor ? this.renderNotifications(editor, notificationData) : ''}
        ${showNotifications && !editor
          ? tabCard('Notifications', 'settings', html`<p>Alerts and messages sent to your phones. <em>Smart Repeating Alerts</em> are Home
              Assistant automations (doors, windows, leaks, cameras …); <em>House Mode</em> messages are sent when the House Mode
              changes, is blocked, fails to arm or sets a timer; <em>Alarm notifications</em> are sent on alarm events.</p>`, html`
              ${tabSection('house', 'House Mode', this.houseSummary,
                html`<hm-house-notifications .hass=${this.hass}
                  @notify-summary=${(e: CustomEvent) => { this.houseSummary = e.detail; this.requestUpdate(); }}></hm-house-notifications>`,
                { open: this.path?.params?.open === 'house' })}
              ${tabSection('smart-alerts', 'Smart Repeating Alerts', this.alertsSummary,
                html`<hm-smart-alerts embedded .hass=${this.hass}
                  @alerts-summary=${(e: CustomEvent) => { this.alertsSummary = e.detail; this.requestUpdate(); }}></hm-smart-alerts>`)}
              ${tabSection('alarm-notifications', 'Alarm notifications',
                `${notificationData.length} notification${notificationData.length === 1 ? '' : 's'} · ${notificationData.filter(n => n.enabled).length} enabled`,
                this.renderNotifications(editor, notificationData, true))}`)
          : ''}

        ${showActions ? this.renderAlarmEvents(editor, automationData) : ''}
      `;
    }
  }

  // ext: the Alarm Events tab as rows (CARD_DESIGN_SYSTEM), like Notifications: grouped by event; icon, name,
  // where and what it runs, on/off chip, edit and delete. Old-style events get a "migrate" hint and the Migrate box.
  private renderAlarmEvents(editor: unknown, data: (HmAutomation & { area: string | number; warning: boolean })[]) {
    const all = data;
    const tagsOf = (n: HmAutomation & { warning: boolean }) =>
      [n.enabled ? 'on' : 'off', n.warning ? 'warning' : '', isLegacyEvent(n) ? 'legacy' : ''].filter(Boolean);
    const cnt = (t: string) => all.filter(n => tagsOf(n).includes(t)).length;
    data = all.filter(n => tagsOf(n).every(t => SHOWN.events.has(t)));
    const hiddenN = all.length - data.length;
    const filters = all.length
      ? filterChecks(
          [
            { key: 'on', label: 'Enabled', count: cnt('on') },
            { key: 'off', label: 'Disabled', count: cnt('off') },
            { key: 'warning', label: 'No partition (warning)', count: cnt('warning') }, { key: 'legacy', label: 'Old list of actions', count: cnt('legacy') },
          ],
          SHOWN.events,
          next => {
            SHOWN.events = next;
            this.requestUpdate();
          }
        )
      : nothing;
    const hass = this.hass!;
    const lang = hass.language;
    const events = Object.values(EAlarmEvent) as string[];
    const groups = events
      .map(ev => ({ ev, items: data.filter(n => n.triggers[0].event === ev).sort((a, b) => (a.name || '').localeCompare(b.name || '')) }))
      .filter(g => g.items.length);
    const other = data.filter(n => !events.includes(n.triggers[0].event as string));
    const areaName = (n: { area: string | number }) =>
      n.area === noArea ? (this.config.master.enabled ? this.config.master.name : '—') : computeAreaDisplay(n.area, this.areas, this.config).name;
    const runs = (n: HmAutomation) => {
      if (isLegacyEvent(n)) return 'old list of actions: migrate it to a script';
      const t = eventTargets(n).map(e => hass.states[e]?.attributes.friendly_name || e);
      return t.length ? t.join(', ') : 'runs nothing yet';
    };
    const edit = (n: HmAutomation) => navigate(this, exportPath('actions', { params: { edit_action: n.automation_id! } }), true);
    const row = (n: HmAutomation & { area: string | number; warning: boolean }) => {
      const t = n.triggers[0];
      const ev = computeEventDisplay(t.event as EAlarmEvent, hass);
      const modes = (t.modes || []).map(m => computeArmModeDisplay(m, hass)?.name || m).join(', ');
      const legacy = isLegacyEvent(n);
      return html`<div class="nt-row ${n.enabled ? '' : 'off'}">
        <ha-icon class="nt-icon" icon=${n.warning ? 'mdi:alert' : ev?.icon || 'mdi:flash'}
          style=${n.warning ? 'color:var(--error-color)' : ''}
          title=${n.warning ? localize('panels.actions.cards.notifications.table.no_area_warning', lang) : ''}></ha-icon>
        <div class="nt-name">
          <button class="link" @click=${() => edit(n)}>${n.name}</button>
          <span class="secondary" style=${legacy ? 'color:var(--warning-color,#ff9800)' : ''}>${areaName(n)}${modes ? ` · ${modes}` : ''} → ${runs(n)}</span>
        </div>
        <button class="nt-chip ${n.enabled ? 'on' : ''}" title=${n.enabled ? 'Enabled: click to disable' : 'Disabled: click to enable'}
          @click=${() => this.setEnabled(n.automation_id!, !n.enabled)}>${n.enabled ? 'Enabled' : 'Disabled'}</button>
        <ha-icon-button .label=${'Edit'} title="Edit" @click=${() => edit(n)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
        <ha-icon-button .label=${'Delete'} title="Delete" @click=${() => this.deleteEvent(n)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
      </div>`;
    };
    return html`
      <ha-card>${sectionHead('Alarm Events', 'settings')}
        <div class="card-content desc">
          <p>Scripts that run when the alarm arms, disarms, triggers, fails to arm and more, per partition. Scripts get the
            variables <code>event</code>, <code>area</code> and <code>arm_mode</code>. What runs when the House Mode changes
            is set on the <a href="/house_modes/house">House Modes</a> tab.</p>
        </div>
        <div class="toolbar">
          <ha-button ?disabled=${!!editor} @click=${this.addActionClick}>
            <ha-icon slot="start" icon="mdi:plus"></ha-icon>${localize('panels.actions.cards.actions.actions.new_action', lang)}</ha-button>
          <span class="secondary" style="display:inline">${all.length} Alarm Event${all.length === 1 ? '' : 's'} ·
            ${cnt('on')} enabled</span>
        </div>
        ${editor ? nothing : filters}
        ${editor
          ? html`<div class="nt-editor">${editor}</div>`
          : html`<hm-event-migrate
                .hass=${this.hass}
                .events=${(this.automations || []).filter(e => e.type == EAutomationTypes.Action)}
                @events-migrated=${() => this._fetchData()}
              ></hm-event-migrate>
              ${data.length
                ? html`<div class="nt-list">
                    ${groups.map(g => html`<div class="nt-group">${computeEventDisplay(g.ev as EAlarmEvent, hass)?.name || g.ev}</div>${g.items.map(row)}`)}
                    ${other.length ? html`<div class="nt-group">Other</div>${other.map(row)}` : nothing}
                  </div>`
                : html`<div class="empty">${hiddenN ? `All ${hiddenN} hidden by the filters above.` : localize('panels.actions.cards.actions.table.no_items', lang)}</div>`}`}
      </ha-card>
    `;
  }

  private deleteEvent(n: HmAutomation) {
    if (!window.confirm(`Delete the Alarm Event "${n.name}"?`)) return;
    deleteAutomation(this.hass!, n.automation_id!)
      .then(() => this._fetchData())
      .catch(e => handleError(e, this));
  }

  // ext: the Notifications tab as rows (CARD_DESIGN_SYSTEM): icon, name, what it does, on/off chip, edit and delete
  /** set by the Smart Repeating Alerts section, for its summary line */
  private alertsSummary = '';
  private houseSummary = 'loading…';

  private renderNotifications(editor: unknown, data: (HmAutomation & { area: string | number; warning: boolean })[], inSection = false) {
    const all = data;
    const tagsOf = (n: HmAutomation & { warning: boolean }) =>
      [n.enabled ? 'on' : 'off', n.warning ? 'warning' : ''].filter(Boolean);
    const cnt = (t: string) => all.filter(n => tagsOf(n).includes(t)).length;
    data = all.filter(n => tagsOf(n).every(t => SHOWN.notifications.has(t)));
    const hiddenN = all.length - data.length;
    const filters = all.length
      ? filterChecks(
          [
            { key: 'on', label: 'Enabled', count: cnt('on') },
            { key: 'off', label: 'Disabled', count: cnt('off') },
            { key: 'warning', label: 'No partition (warning)', count: cnt('warning') },
          ],
          SHOWN.notifications,
          next => {
            SHOWN.notifications = next;
            this.requestUpdate();
          }
        )
      : nothing;
    const hass = this.hass!;
    const lang = hass.language;
    const events = Object.values(EAlarmEvent) as string[];
    const groups = events
      .map(ev => ({ ev, items: data.filter(n => n.triggers[0].event === ev).sort((a, b) => (a.name || '').localeCompare(b.name || '')) }))
      .filter(g => g.items.length);
    const other = data.filter(n => !events.includes(n.triggers[0].event as string));
    const areaName = (n: { area: string | number }) =>
      n.area === noArea ? (this.config.master.enabled ? this.config.master.name : '—') : computeAreaDisplay(n.area, this.areas, this.config).name;
    const target = (n: HmAutomation) => {
      const a = (n.actions[0] || {}) as any;
      const eid = a.entity_id as string | undefined;
      return eid ? hass.states[eid]?.attributes.friendly_name || eid : a.service || '—';
    };
    const edit = (n: HmAutomation) => navigate(this, exportPath('actions', { params: { edit_notification: n.automation_id! } }), true);
    const row = (n: HmAutomation & { area: string | number; warning: boolean }) => {
      const t = n.triggers[0];
      const ev = computeEventDisplay(t.event as EAlarmEvent, hass);
      const modes = (t.modes || []).map(m => computeArmModeDisplay(m, hass)?.name || m).join(', ');
      return html`<div class="nt-row ${n.enabled ? '' : 'off'}">
        <ha-icon class="nt-icon" icon=${n.warning ? 'mdi:alert' : ev?.icon || 'mdi:message-text-outline'}
          style=${n.warning ? 'color:var(--error-color)' : ''}
          title=${n.warning ? localize('panels.actions.cards.notifications.table.no_area_warning', lang) : ''}></ha-icon>
        <div class="nt-name">
          <button class="link" @click=${() => edit(n)}>${n.name}</button>
          <span class="secondary">${areaName(n)}${modes ? ` · ${modes}` : ''} → ${target(n)}</span>
        </div>
        <button class="nt-chip ${n.enabled ? 'on' : ''}" title=${n.enabled ? 'Enabled: click to disable' : 'Disabled: click to enable'}
          @click=${() => this.setEnabled(n.automation_id!, !n.enabled)}>${n.enabled ? 'Enabled' : 'Disabled'}</button>
        <ha-icon-button .label=${'Edit'} title="Edit" @click=${() => edit(n)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
        <ha-icon-button .label=${'Delete'} title="Delete" @click=${() => this.deleteNotification(n)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
      </div>`;
    };
    return html`
      <ha-card class=${inSection ? 'in-section' : ''}>${inSection ? nothing : sectionHead('Alarm notifications', 'settings')}
        <div class="card-content desc">
          <p>Messages sent on alarm events (armed, disarmed, triggered, failed to arm and more), per partition. Each one goes
            to a notify service: a phone, a speaker.</p>
        </div>
        <div class="toolbar">
          <ha-button ?disabled=${!!editor} @click=${this.addNotificationClick}>
            <ha-icon slot="start" icon="mdi:plus"></ha-icon>${localize('panels.actions.cards.notifications.actions.new_notification', lang)}</ha-button>
          <span class="secondary" style="display:inline">${all.length} notification${all.length === 1 ? '' : 's'} ·
            ${cnt('on')} enabled</span>
        </div>
        ${editor ? nothing : filters}
        ${editor ? html`<div class="nt-editor">${editor}</div>` : nothing}
        ${editor
          ? nothing
          : data.length
            ? html`<div class="nt-list">
                ${groups.map(g => html`<div class="nt-group">${computeEventDisplay(g.ev as EAlarmEvent, hass)?.name || g.ev}</div>${g.items.map(row)}`)}
                ${other.length ? html`<div class="nt-group">Other</div>${other.map(row)}` : nothing}
              </div>`
            : html`<div class="empty">${hiddenN ? `All ${hiddenN} hidden by the filters above.` : localize('panels.actions.cards.notifications.table.no_items', lang)}</div>`}
      </ha-card>
    `;
  }

  private setEnabled(id: string, enabled: boolean) {
    saveAutomation(this.hass!, { automation_id: id, enabled })
      .then(() => this._fetchData())
      .catch(e => handleError(e, this));
  }

  private deleteNotification(n: HmAutomation) {
    if (!window.confirm(`Delete the notification "${n.name}"?`)) return;
    deleteAutomation(this.hass!, n.automation_id!)
      .then(() => this._fetchData())
      .catch(e => handleError(e, this));
  }

  private getAreaForAutomation = (automation: HmAutomation) => {
    if (!this.config) return;
    const areaOptions = getAreaOptions(this.areas, this.config);
    let area = automation.triggers[0].area;
    return isDefined(area) && areaOptions.includes(area) ? area : undefined;
  };

  private toggleEnable(ev: Event, item_id: string) {
    saveAutomation(this.hass!, { automation_id: item_id, enabled: (ev.target as HTMLInputElement).checked })
      .catch(e => handleError(e, ev))
      .then();
  }

  private getTableFilterOptions() {
    if (!this.hass) return;
    let areaFilterOptions = Object.values(this.areas)
      .map(e =>
        Object({
          value: e.area_id,
          name: e.name,
          badge: (list: any[]) => list.filter(item => item.area == e.area_id).length,
        })
      )
      .sort(sortAlphabetically);

    if (Object.values(this.automations || []).filter(e => !this.getAreaForAutomation(e)).length)
      areaFilterOptions = [
        {
          value: noArea,
          name: this.config.master.enabled
            ? this.config.master.name
            : this.hass.localize('state_attributes.climate.preset_mode.none'),
          badge: (list: any[]) => list.filter(item => item.area == noArea).length,
        },
        ...areaFilterOptions,
      ];

    const filterConfig: TableFilterConfig = {
      area: {
        name: localize(
          'components.table.filter.item',
          this.hass.language,
          'name',
          localize('panels.actions.cards.new_action.fields.area.heading', this.hass.language)
        ),
        items: areaFilterOptions,
        value: this.selectedArea ? [this.selectedArea] : [],
      },
    };
    return filterConfig;
  }

  addNotificationClick() {
    navigate(this, exportPath('actions', 'new_notification'), true);
  }

  addActionClick() {
    navigate(this, exportPath('actions', 'new_action'), true);
  }

  static styles = [
    commonStyle,
    extStyles,
    css`
      :host {
        padding: 0;
      }
      .nt-list {
        padding: 0 16px 12px;
      }
      .nt-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 13px;
        margin: 12px 0 2px;
      }
      .nt-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .nt-row.off .nt-name button,
      .nt-row.off .nt-icon {
        opacity: 0.55;
      }
      .nt-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .nt-name {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-width: 0;
        align-items: flex-start;
      }
      .nt-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 1px 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .nt-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      ha-card.in-section {
        box-shadow: none;
        border: none;
        background: none;
      }
      .nt-editor {
        padding: 0 16px 12px;
      }
    `,
  ];
}
