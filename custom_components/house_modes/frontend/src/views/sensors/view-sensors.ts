// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { loadHaForm } from '../../load-ha-elements';

import './sensor-editor-card.ts';
import './sensors-overview-card.ts';
import './add-sensors-card.ts';
import { EArmModes, HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';

@customElement('hm-view-sensors')
export class AlarmViewSensors extends LitElement {
  @property()
  hass?: HomeAssistant;

  @property()
  narrow!: boolean;

  @property()
  path!: Path;

  firstUpdated() {
    (async () => await loadHaForm())();

    // if (this.path && this.path.length == 3 && this.path[0] == 'filter') {
    //   const filterOption = this.path[1];
    //   const filterValue = this.path[2];

    //   if (filterOption == 'area') this.selectedArea = this.path[2];
    //   else if (filterOption == 'mode') {
    //     const res = Object.keys(EArmModes).find(e => EArmModes[e] == filterValue);
    //     if (res) this.selectedMode = res as EArmModes;
    //   }
    // }
  }

  render() {
    if (!this.hass) return html``;
    if (this.path.params.edit) {
      return html`
        <hm-sensor-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .item=${this.path.params.edit}
        ></hm-sensor-editor-card>
      `;
    } else {
      const selectedArea = this.path.filter?.area;
      const selectedMode = this.path.filter?.mode;

      return html`
        <hm-sensors-overview-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .selectedArea=${selectedArea}
          .selectedMode=${selectedMode}
        ></hm-sensors-overview-card>
        <hm-add-sensors-card .hass=${this.hass} .narrow=${this.narrow}></hm-add-sensors-card>
      `;
    }
  }
}
