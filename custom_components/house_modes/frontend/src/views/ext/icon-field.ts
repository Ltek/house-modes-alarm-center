// <hm-icon-field>: Home Assistant's searchable icon picker when it is loaded, otherwise a text box with a
// preview. "mdi:" is never needed: "bed" becomes mdi:bed. Fires value-changed with the full name.
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { loadHaForm } from '../../load-ha-elements';
import { normalizeIcon, shortIcon } from '../../data/icons';

@customElement('hm-icon-field')
export class ExtIconField extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() label = 'Icon';
  @property() value = '';
  @property() placeholder = 'home';

  firstUpdated() {
    if (!customElements.get('ha-icon-picker'))
      loadHaForm()
        .then(() => this.requestUpdate())
        .catch(() => undefined);
  }

  private emit(v: string) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: normalizeIcon(v) }, bubbles: true, composed: true }));
  }

  render() {
    if (customElements.get('ha-icon-picker'))
      return html`<span class="lab">${this.label}</span>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this.value || ''}
          .placeholder=${normalizeIcon(this.placeholder)}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this.emit(e.detail.value);
          }}
        ></ha-icon-picker>`;
    return html`<span class="lab">${this.label}</span>
      <ha-icon icon=${normalizeIcon(this.value) || normalizeIcon(this.placeholder)}></ha-icon>
      <input
        type="text"
        aria-label=${this.label}
        placeholder=${shortIcon(this.placeholder)}
        .value=${shortIcon(this.value)}
        @change=${(e: any) => this.emit(e.target.value)}
      />`;
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    ha-icon-picker {
      min-width: 220px;
    }
    input {
      font: inherit;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      width: 160px;
    }
  `;
}
