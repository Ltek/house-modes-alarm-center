// Actions tab: everything that runs native scenes and scripts, in one place.
// - Scenes (with the Alarm Events that run each scene) and the House Mode Actions grid
// - Other Alarm Events (collapsed): events that run a script, or still use Alarmo's own action list (Migrate)
// Editing an Alarm Event (new_action / edit_action) opens the editor in place.
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { extStyles } from './ext-styles';
import './view-house-actions';
import '../actions/view-actions';

@customElement('alarm-view-actions-tab')
export class AlarmViewActionsTab extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path!: Path;

  render() {
    const editing = this.path.subpage === 'new_action' || !!this.path.params.edit_action;
    if (editing)
      return html`<alarm-view-actions .hass=${this.hass} .narrow=${this.narrow} .path=${this.path} .section=${'actions'}></alarm-view-actions>`;
    return html`
      <alarm-view-house-actions .hass=${this.hass} .narrow=${this.narrow} .path=${this.path}></alarm-view-house-actions>
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Other Alarm Events</span>
            <span class="secondary" style="display:inline">scripts and legacy events (migrate here)</span>
          </summary>
          <div class="collapse-body">
            <alarm-view-actions .hass=${this.hass} .narrow=${this.narrow} .path=${this.path} .section=${'actions'} .only=${'other'}></alarm-view-actions>
          </div>
        </details>
      </ha-card>
    `;
  }

  static styles = extStyles;
}
