// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { LitElement, html, CSSResultGroup, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';

import { commonStyle } from '../../styles';
import { extStyles } from '../ext/ext-styles';
import { settingLock, SETTING_LOCKS, isLocked } from '../ext/page-intro';
import { localize } from '../../../localize/localize';
import { HmModeConfig, HmConfig, EArmModes, Dictionary, HmArea, HmSensor, HomeAssistant } from '../../types';
import { fetchAreas, fetchSensors, saveArea } from '../../data/websockets';
import { handleError, isDefined } from '../../helpers';
import { SubscribeMixin } from '../../subscribe-mixin';
import { EArmModeIcons } from '../../const';

import '../../components/hm-duration-picker';
import '../../components/hm-select';
import '../../components/hm-collapsible';

import { exportPath } from '../../common/navigation';
import { roleChip, sectionHead } from '../ext/page-intro';

@customElement('hm-alarm-mode-card')
export class AlarmModeCard extends SubscribeMixin(LitElement) {
  @property()
  hass!: HomeAssistant;

  @property({ type: Boolean })
  narrow!: boolean;

  @property()
  config!: HmConfig;

  @property()
  areas!: Dictionary<HmArea>;

  @property()
  sensors!: Dictionary<HmSensor>;

  @property()
  data!: Record<EArmModes, HmModeConfig>;

  @property()
  selectedArea!: string;

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this._fetchData();
    return [
      this.hass!.connection.subscribeMessage(() => this._fetchData(), {
        type: 'house_modes_config_updated',
      }),
    ];
  }

  private async _fetchData(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this.areas = await fetchAreas(this.hass);
    this.sensors = await fetchSensors(this.hass);
  }

  async firstUpdated() {
    await this._fetchData();
    this.selectedArea = Object.keys(this.areas)[0];
    this.data = { ...this.areas[this.selectedArea].modes };
  }

  render() {
    if (!this.data) return html``;
    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">
            ${localize('panels.general.cards.modes.title', this.hass.language)}
          </div>
          ${roleChip('settings')}

          ${Object.keys(this.areas).length > 1
        ? html`
          <hm-select
            .hass=${this.hass}
            .items=${Object.values(this.areas).map(e => Object({ value: e.area_id, name: e.name }))}
            value=${this.selectedArea}
            label=${this.hass.localize('ui.components.area-picker.area')}
            @value-changed=${(ev: Event) => this.selectArea((ev.target as HTMLInputElement).value)}
          ></hm-select>
        ` : ''}
        </div>
        <div class="card-content mode-intro">
          <span>${localize('panels.general.cards.modes.description', this.hass.language)}</span>
          ${settingLock(isLocked('arm-modes'), () => { SETTING_LOCKS['arm-modes'] = !isLocked('arm-modes'); this.requestUpdate(); }, 'the Arm Modes and their delays')}
        </div>

        <hm-collapsible-group>
          ${Object.entries(EArmModes).map(
          ([k, mode]) =>
            html`
                <hm-collapsible-item>
                  <hm-collapsible-header>
                    <ha-svg-icon slot="icon" .path=${EArmModeIcons[k]}></ha-svg-icon>
                    <span slot="title">
                      ${this.hass.localize(`component.alarm_control_panel.entity_component._.state.${mode}`)}
                    </span>
                    <span slot="description">
                      ${this.data[mode]?.enabled
                ? html`
                            ${localize('common.enabled', this.hass.language)},
                            <a href="${exportPath('zones', { filter: { area: this.selectedArea, mode: mode } })}">
                              ${localize(
                  'panels.general.cards.modes.number_sensors_active',
                  this.hass!.language,
                  'number',
                  this.getSensorsByMode(mode)
                )}
                            </a>
                          `
                : localize('common.disabled', this.hass.language)}
                    </span>
                  </hm-collapsible-header>
                  <hm-collapsible-body>
                    ${this.renderModeConfig(mode)}
                  </hm-collapsible-body>
                </hm-collapsible-item>
              `
        )}
        </hm-collapsible-group>
      </ha-card>
    `;
  }

  getSensorsByMode(mode: EArmModes) {
    return Object.values(this.sensors).filter(e => e.area == this.selectedArea && (e.modes.includes(mode) || e.always_on)).length;
  }

  renderModeConfig(mode: EArmModes) {
    const config = mode in this.data ? this.data[mode] : undefined;

    return html`<div class="mode-cfg ${isLocked('arm-modes') ? 'locked' : ''}" title=${isLocked('arm-modes') ? 'Locked: click the lock above to change' : ''}>
      <div class="description">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        ${localize(`panels.general.cards.modes.modes.${mode}`, this.hass.language)}
      </div>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${localize('panels.general.cards.modes.fields.status.heading', this.hass.language)}
        </span>
        <span slot="description">
          ${localize('panels.general.cards.modes.fields.status.description', this.hass.language)}
        </span>
        <div>
          <ha-button
            appearance="${config?.enabled ? 'filled' : 'plain'}"
            variant="${config?.enabled ? 'brand' : 'neutral'}"
            @click=${(ev: Event) => this.saveData(ev, mode, { enabled: true })}
          >
            <ha-icon slot="start" icon="mdi:check"></ha-icon>
            ${localize('common.enabled', this.hass.language)}
          </ha-button>
          <ha-button
            appearance="${config?.enabled ? 'plain' : 'filled'}"
            variant="${config?.enabled ? 'neutral' : 'brand'}"
            @click=${(ev: Event) => this.saveData(ev, mode, { enabled: false })}
          >
            <ha-icon slot="start" icon="mdi:close"></ha-icon>
            ${localize('common.disabled', this.hass.language)}
          </ha-button>
        </div>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${localize('panels.general.cards.modes.fields.exit_delay.heading', this.hass.language)}
        </span>
        <span slot="description">
          ${localize('panels.general.cards.modes.fields.exit_delay.description', this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${config?.exit_time || 0}
          @value-changed=${(ev: CustomEvent) => {
        this.saveData(ev, mode, {
          exit_time: ev.detail.value,
        })
      }}
          ?disabled=${!config?.enabled || !isDefined(config?.exit_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${localize('panels.general.cards.modes.fields.entry_delay.heading', this.hass.language)}
        </span>
        <span slot="description">
          ${localize('panels.general.cards.modes.fields.entry_delay.description', this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${config?.entry_time || 0}
          @value-changed=${(ev: CustomEvent) =>
        this.saveData(ev, mode, {
          entry_time: ev.detail.value,
        })}
          ?disabled=${!config?.enabled || !isDefined(config?.entry_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${localize('panels.general.cards.modes.fields.trigger_time.heading', this.hass.language)}
        </span>
        <span slot="description">
          ${localize('panels.general.cards.modes.fields.trigger_time.description', this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="3600"
          step="60"
          placeholder="&#8734;"
          value=${config?.trigger_time || 0}
          @value-changed=${(ev: CustomEvent) =>
        this.saveData(ev, mode, {
          trigger_time: ev.detail.value,
        })}
          ?disabled=${!config?.enabled || !isDefined(config?.trigger_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      </div>
    `;
  }

  selectArea(area_id: string) {
    if (area_id == this.selectedArea) return;
    this.selectedArea = area_id;
    this.data = { ...this.areas[area_id].modes };
  }

  saveClick(ev: Event) {
    saveArea(this.hass, { area_id: this.selectedArea, modes: this.data })
      .catch(e => handleError(e, ev))
      .then();
  }

  private saveData(ev: Event, mode: EArmModes, update: Partial<HmModeConfig>) {
    if (isLocked('arm-modes')) return;
    const DefaultMode: HmModeConfig = {
      enabled: false,
      exit_time: 0,
      entry_time: 0,
      trigger_time: 0,
    };
    this.data = {
      ...this.data,
      [mode]: {
        ...(this.data[mode] || DefaultMode),
        ...update,
      },
    };

    saveArea(this.hass, { area_id: this.selectedArea, modes: this.data })
      .catch(e => handleError(e, ev.target as HTMLElement))
      .then();
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      ${extStyles}
      .mode-intro {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .mode-intro > span {
        flex: 1;
      }
      .mode-cfg.locked {
        opacity: 0.6;
      }
      .mode-cfg.locked > *:not(.description) {
        pointer-events: none;
      }
      hm-collapsible-header:first-of-type {
        border-top: 1px solid var(--divider-color);
      }
      .description {
        margin: 8px;
        padding: 12px;
        color: var(--primary-color);
        filter: brightness(0.85);
        font-size: 14px;
        line-height: 1.5em;
        min-height: 36px;
        display: flex;
        align-items: center;
        position: relative;
      }
      .description::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        content: '';
        background: rgba(var(--rgb-primary-color), 0.12);
        border-radius: 5px;
      }
      .description ha-icon {
        --mdc-icon-size: 36px;
        display: inline;
        float: left;
        margin-right: 12px;
        align-self: flex-start;
      }
      hm-select {
        display: flex;
        min-width: 180px;
      }
    `;
  }
}
