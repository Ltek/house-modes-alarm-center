// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { LitElement, html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';

import { fetchConfig, saveConfig, fetchAreas, fetchAutomations, deleteAutomation } from '../../data/websockets';
import { SubscribeMixin } from '../../subscribe-mixin';
import { localize } from '../../../localize/localize';
import { pick, handleError, navigate } from '../../helpers';
import { loadHaForm } from '../../load-ha-elements';
import { HmConfig, Dictionary, HmArea, HmAutomation, HomeAssistant } from '../../types';
import { commonStyle } from '../../styles';
import { exportPath, Path } from '../../common/navigation';
import { fetchExtInfo, setExtUi } from '../../data/ext-websockets';

import './alarm-mode-card';
import './mqtt-config-card.ts';
import './area-config-card.ts';
import '../../components/hm-settings-row';
import '../../dialogs/edit-master-dialog.ts';
import '../../dialogs/confirm-delete-dialog.ts';
import { fireEvent } from '../../fire_event';
import { roleChip, sectionHead, tabCard, tabSection, settingLock, SETTING_LOCKS, isLocked } from '../ext/page-intro';
import { extStyles } from '../ext/ext-styles';

@customElement('hm-view-general')
export class AlarmViewGeneral extends SubscribeMixin(LitElement) {
  hass?: HomeAssistant;
  @property() narrow!: boolean;
  @property() path!: Path;

  /** ext: show one section only (undefined = upstream: all three) */
  @property() section?: 'general' | 'partitions' | 'modes' | 'mqtt';

  @property() data?: Partial<HmConfig>;

  @property() config?: HmConfig;
  @property() areas: Dictionary<HmArea> = {};
  @property() automations: Dictionary<HmAutomation> = {};

  /** ext: show the Zones (legacy) tab */
  @property() showLegacy = false;

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this._fetchData();
    return [this.hass!.connection.subscribeMessage(() => this._fetchData(), { type: 'house_modes_config_updated' })];
  }

  private async _fetchData(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this.config = await fetchConfig(this.hass);
    this.areas = await fetchAreas(this.hass);
    this.automations = await fetchAutomations(this.hass);
    this.data = pick(this.config, ['trigger_time', 'disarm_after_trigger', 'ignore_blocking_sensors_after_trigger', 'mqtt', 'master']);
    try {
      this.showLegacy = !!(await fetchExtInfo(this.hass)).ui?.show_legacy_zones;
    } catch (_e) {
      /* ext settings unavailable */
    }
  }

  firstUpdated() {
    (async () => await loadHaForm())();
  }

  render() {
    if (!this.hass || !this.config || !this.data) return html``;

    if (this.path.subpage == 'mqtt_configuration') {
      return html`
        <hm-mqtt-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-mqtt-config-card>
      `;
    }
    if (this.path.params.edit_area) {
      return html`
        <area-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          item=${this.path.params.edit_area}
        ></area-editor-card>
      `;
    } else {
      // ext: one section per tab
      if (this.section == 'modes')
        return html`<hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>`;
      // ext (v2026.11.05.57): General is now Quick Start; its settings live with what they belong to
      const showAll = this.section === undefined;
      if (this.section == 'partitions') {
        const nAreas = Object.keys(this.areas || {}).length;
        return tabCard('Partitions & Arm Modes', 'settings', html`<p>The parts of the building armed on their own, the Arm
            Modes (Away, Home, Night, …) with their delays, and what the alarm does after it goes off.</p>`, html`
          ${tabSection('partitions', 'Partitions', `${nAreas} partition${nAreas === 1 ? '' : 's'}`,
            html`<hm-area-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-area-config-card>`, { flat: true })}
          ${tabSection('arm-modes', 'Arm Modes', 'exit, entry and alarm times per Arm Mode',
            html`<hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>`, { flat: true })}
          ${this.renderAlarmSettings()}`);
      }
      if (this.section == 'mqtt') return this.renderMqtt();
      return html`
        ${this.renderAlarmSettings()} ${this.renderMqtt()}
        ${showAll
          ? html`
              <hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>
              <hm-area-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-area-config-card>
            `
          : ''}
      `;
    }
  }

  /** After an alarm, and the "All partitions" panel (Partitions & Arm Modes tab). */
  private renderAlarmSettings() {
    if (!this.hass || !this.data) return html``;
    const lang = this.hass.language;
    const locked = isLocked('alarm-behavior');
    const multi = Object.keys(this.areas).length >= 2;
    const row = (key: string, checked: boolean, onChange: (v: boolean, ev: Event) => void, nested = false) => html`
      <label class="ab-row ${nested ? 'nested' : ''}">
        <input type="checkbox" class="cb" ?disabled=${locked} .checked=${checked}
          @change=${(ev: Event) => onChange((ev.target as HTMLInputElement).checked, ev)} />
        <span><strong>${localize(`panels.general.cards.general.fields.${key}.heading`, lang)}</strong>
          <span class="secondary">${localize(`panels.general.cards.general.fields.${key}.description`, lang)}</span></span>
      </label>`;
    const summary = [
      this.data.disarm_after_trigger ? 'disarm after an alarm' : 'back to armed after an alarm',
      multi ? (this.data.master?.enabled ? 'All partitions alarm on' : 'no All partitions alarm') : '',
    ].filter(Boolean).join(' · ');
    return html`
        ${tabSection('alarm-behavior', 'Alarm behavior', summary, html`
          <div class="ab-head">
            <span class="secondary">What the alarm does after it goes off, and whether it has an "All partitions" alarm.</span>
            <span class="grow"></span>
            ${settingLock(locked, () => { SETTING_LOCKS['alarm-behavior'] = !locked; this.requestUpdate(); }, 'these settings')}
          </div>
          <div class="ab-group">After an alarm</div>
          ${row('disarm_after_trigger', !!this.data.disarm_after_trigger, v => this.saveData({ disarm_after_trigger: v }))}
          ${this.data.disarm_after_trigger === false
            ? row('ignore_blocking_sensors_after_trigger', !!this.data.ignore_blocking_sensors_after_trigger,
                v => this.saveData({ ignore_blocking_sensors_after_trigger: v }), true)
            : nothing}
          ${multi
            ? html`<div class="ab-group">All partitions</div>
              ${row('enable_master', !!this.data.master?.enabled, (_v, ev) => this.toggleEnableMaster(ev))}
              ${this.data.master?.enabled
                ? html`<div class="ab-actions"><ha-button appearance="plain" ?disabled=${locked} @click=${this.setupMasterClick}>
                    ${localize('panels.general.cards.general.actions.setup_master', lang)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon></ha-button></div>`
                : nothing}`
            : nothing}
        `)}`;
  }

  /** MQTT (Integrations & Backup tab). */
  private renderMqtt() {
    if (!this.hass || !this.data) return html``;
    return html`
        <ha-card class="flat-in-section">${sectionHead('MQTT', 'settings')}
          <div class="card-content">Publish the alarm's state to MQTT and accept commands from it (e.g. for wall panels).</div>
          <hm-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${localize('panels.general.cards.general.fields.enable_mqtt.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.general.cards.general.fields.enable_mqtt.description', this.hass.language)}
            </span>
            <input type="checkbox" class="cb"
              .checked=${this.data?.mqtt?.enabled}
              @change=${(ev: Event) => {
          this.saveData({ mqtt: { ...this.data!.mqtt!, enabled: (ev.target as HTMLInputElement).checked } });
        }} />
          </hm-settings-row>

          ${this.data?.mqtt?.enabled
          ? html`
                <div style="padding: 0px 0px 16px 16px; margin-top: -8px">
                  <ha-button
                    appearance="filled"
                    @click=${() => navigate(this, exportPath('general', 'mqtt_configuration'), true)}
                  >
                    ${localize('panels.general.cards.general.actions.setup_mqtt', this.hass.language)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
                  </ha-button>
                </div>
              `
          : ''}
        </ha-card>`;
  }

  setupMasterClick(ev: Event) {
    const element = ev.target as HTMLElement;
    fireEvent(element, 'show-dialog', {
      dialogTag: 'hm-edit-master-dialog',
      dialogImport: () => import('../../dialogs/edit-master-dialog'),
      dialogParams: {},
    });
  }

  private async toggleEnableMaster(ev: Event) {
    const target = ev.target as HTMLInputElement;
    let enabled = target.checked;
    if (!enabled) {
      const automations = Object.values(this.automations).filter(e => e.triggers.some(e => !e.area));
      if (automations.length) {
        const result = await new Promise(resolve => {
          fireEvent(target, 'show-dialog', {
            dialogTag: 'hm-confirm-delete-dialog',
            dialogImport: () => import('../../dialogs/confirm-delete-dialog'),
            dialogParams: {
              title: localize('panels.general.dialogs.disable_master.title', this.hass!.language),
              description: localize(
                'panels.general.dialogs.disable_master.description',
                this.hass!.language,
                'automations',
                String(automations.length)
              ),
              cancel: () => resolve(false),
              confirm: () => resolve(true),
            },
          });
        });
        if (!result) {
          enabled = true;
          target.checked = true;
        } else if (!enabled && automations.length) {
          automations.forEach(e => {
            deleteAutomation(this.hass!, e.automation_id!).catch(e => handleError(e, ev));
          });
        }
      }
    }

    this.saveData({ master: { ...this.data!.master!, enabled: enabled } });
  }

  private saveData(changes: Partial<HmConfig>) {
    if (!this.hass || !this.data) return;

    this.data = {
      ...this.data,
      ...changes,
    };

    saveConfig(this.hass, this.data)
      .catch(e => handleError(e, this.shadowRoot!.querySelector('ha-card') as HTMLElement))
      .then();
  }

  static styles = [
    commonStyle,
    extStyles,
    css`
      .ab-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px 4px;
      }
      .ab-head .grow {
        flex: 1;
      }
      .ab-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 10px 4px 2px;
      }
      .ab-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 4px;
        border-bottom: 1px solid var(--divider-color);
        cursor: pointer;
      }
      .ab-row.nested {
        padding-left: 32px;
      }
      .ab-row input {
        margin-top: 2px;
        flex: none;
      }
      .ab-row > span {
        display: flex;
        flex-direction: column;
      }
      .ab-actions {
        padding: 8px 0 0 32px;
      }
    `,
  ];
}
