// Actions tab: what runs on each House Mode, and the Alarm Events (with Migrate for old ones).
// Every section is a collapsible card, collapsed to start with.
// Editing an Alarm Event (new_action / edit_action) opens the editor in place.
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { extStyles } from './ext-styles';
import { collapsibleCard } from './page-intro';
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
      <alarm-view-house-actions embedded .hass=${this.hass} .narrow=${this.narrow} .path=${this.path}></alarm-view-house-actions>
      ${collapsibleCard('other-events', 'mdi:shield-alert-outline', 'Alarm Events', 'what runs when the alarm arms, disarms or triggers', 'settings',
        html`<alarm-view-actions .hass=${this.hass} .narrow=${this.narrow} .path=${this.path} .section=${'actions'} .only=${'other'}></alarm-view-actions>`)}
    `;
  }

  static styles = extStyles;
}
