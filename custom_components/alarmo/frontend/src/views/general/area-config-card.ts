import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { mdiPencil } from '@mdi/js';

import { prettyPrint, sortAlphabetically } from '../../helpers';
import { AlarmoConfig, Dictionary, AlarmoArea, AlarmoSensor, AlarmoAutomation, HomeAssistant } from '../../types';

import '../../components/alarmo-settings-row';
import '../../components/alarmo-table.ts';
import '../../dialogs/create-area-dialog';

import { commonStyle } from '../../styles';
import { localize } from '../../../localize/localize';
import { SubscribeMixin } from '../../subscribe-mixin';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';
import { fetchAreas, fetchSensors, fetchAutomations } from '../../data/websockets';
import { TableData, TableColumn } from '../../components/alarmo-table';
import { exportPath } from '../../common/navigation';
import { fireEvent } from '../../fire_event';
import { roleChip, sectionHead } from '../ext/page-intro';

@customElement('area-config-card')
export class AreaConfigCard extends SubscribeMixin(LitElement) {
  hass?: HomeAssistant;
  @property() narrow!: boolean;
  @property() path!: string[] | null;

  @property() config?: AlarmoConfig;
  @property() areas: Dictionary<AlarmoArea> = {};
  @property() sensors: Dictionary<AlarmoSensor> = {};
  @property() automations: Dictionary<AlarmoAutomation> = {};

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this._fetchData();
    return [this.hass!.connection.subscribeMessage(() => this._fetchData(), { type: 'alarmo_config_updated' })];
  }

  private async _fetchData(): Promise<void> {
    if (!this.hass) return;
    this.areas = await fetchAreas(this.hass);
    this.sensors = await fetchSensors(this.hass);
    this.automations = await fetchAutomations(this.hass);
  }

  render() {
    if (!this.hass) return html``;

    const areas = Object.values(this.areas);
    areas.sort(sortAlphabetically);

    const columns: Dictionary<TableColumn> = {
      actions: {
        width: '48px',
      },
      name: {
        title: this.hass.localize('ui.common.name'),
        width: '40%',
        grow: true,
        text: true,
      },
      remarks: {
        title: localize('panels.general.cards.areas.table.remarks', this.hass.language),
        width: '60%',
        hide: this.narrow,
        text: true,
      },
    };

    const data = Object.values(areas).map(item => {
      const sensors = Object.values(this.sensors).filter(e => e.area == item.area_id).length;
      const automations =
        Object.values(areas).length == 1
          ? Object.values(this.automations).filter(
            e => e.triggers?.map(e => e.area).includes(item.area_id) || !e.triggers?.map(e => e.area).length
          ).length
          : Object.values(this.automations).filter(e => e.triggers?.map(e => e.area).includes(item.area_id)).length;
      // ext: link to the Zones / Notifications / Actions tabs (not the legacy pages)
      const summary_sensors = `<a href="${exportPath('zones', { filter: { area: item.area_id } })}">${localize(
        'panels.general.cards.areas.table.summary_sensors',
        this.hass!.language,
        'number',
        sensors
      )}</a>`;
      const ofArea = (type: string) =>
        Object.values(this.automations).filter(
          e =>
            e.type == type &&
            (e.triggers?.map(e => e.area).includes(item.area_id) ||
              (Object.values(areas).length == 1 && !e.triggers?.map(e => e.area).length))
        ).length;
      const plural = (n: number, word: string) => `${n} ${word}${n == 1 ? '' : 's'}`;
      const summary_automations = automations
        ? `<a href="${exportPath('notifications', { filter: { area: item.area_id } })}">${plural(ofArea('notification'), 'notification')}</a>` +
          ` and <a href="${exportPath('actions', { filter: { area: item.area_id } })}">${plural(ofArea('action'), 'action')}</a>`
        : localize('panels.general.cards.areas.table.summary_automations', this.hass!.language, 'number', 0);
      const output: TableData = {
        id: item.area_id,
        actions: html`
          <ha-icon-button @click=${(ev: Event) => this.editClick(ev, item.area_id)} .path=${mdiPencil}></ha-icon-button>
        `,
        name: prettyPrint(item.name),
        remarks: (unsafeHTML(
          localize(
            'panels.general.cards.areas.table.summary',
            this.hass!.language,
            'summary_sensors',
            summary_sensors,
            'summary_automations',
            summary_automations
          )
        ) as unknown) as string,
      };
      return output;
    });

    return html`
      <ha-card>${sectionHead(localize('panels.general.cards.areas.title', this.hass.language), 'settings')}
        <div class="card-content">
          ${localize('panels.general.cards.areas.description', this.hass.language)}
        </div>
        <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
          <ha-button appearance="plain" @click=${this.addClick}>
            ${localize('panels.general.cards.areas.actions.add', this.hass.language)}
          </ha-button>
        </div>

        <alarmo-table .columns=${columns} .data=${data}>
          ${localize('panels.general.cards.areas.no_items', this.hass.language)}
        </alarmo-table>
      </ha-card>
    `;
  }

  addClick(ev: Event) {
    const element = ev.target as HTMLElement;
    fireEvent(element, 'show-dialog', {
      dialogTag: 'create-area-dialog',
      dialogImport: () => import('../../dialogs/create-area-dialog'),
      dialogParams: {},
    });
  }

  editClick(ev: Event, area_id: string) {
    const element = ev.target as HTMLElement;
    fireEvent(element, 'show-dialog', {
      dialogTag: 'create-area-dialog',
      dialogImport: () => import('../../dialogs/create-area-dialog'),
      dialogParams: { area_id: area_id },
    });
  }

  static styles = commonStyle;
}
