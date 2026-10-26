// Multi-picker: chosen items as removable chips, plus a filter box, a dropdown of the
// remaining options and a "+" button. Emits `value-changed` with { value: string[] }.
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { mdiClose, mdiPlus } from '@mdi/js';
import { PickerOption, filterOptions } from '../../data/picker';

@customElement('alarmo-ext-multi-picker')
export class AlarmoExtMultiPicker extends LitElement {
  @property({ attribute: false }) options: PickerOption[] = [];
  @property({ attribute: false }) value: string[] = [];
  @property() label = '';
  @property() placeholder = 'Choose…';
  /** show the filter box when there are more options than this */
  @property({ type: Number }) filterFrom = 8;

  @state() private filter = '';
  @state() private choice = '';

  render() {
    const label = (v: string) => this.options.find(o => o.value === v)?.label || `${v} (missing)`;
    const rest = filterOptions(this.options, this.value, this.filter);
    return html`
      <div class="wrap">
        ${this.label ? html`<span class="lbl">${this.label}</span>` : nothing}
        <div class="row">
          ${this.options.length > this.filterFrom
            ? html`<input type="search" placeholder="Filter" aria-label=${`Filter ${this.label}`} .value=${this.filter}
                @input=${(e: any) => (this.filter = e.target.value)} />`
            : nothing}
          <select aria-label=${this.label || this.placeholder} @change=${(e: any) => (this.choice = e.target.value)}>
            <option value="" ?selected=${!this.choice}>${rest.length ? this.placeholder : 'nothing left to add'}</option>
            ${rest.map(o => html`<option value=${o.value} ?selected=${o.value === this.choice}>${o.label}</option>`)}
          </select>
          <ha-icon-button .path=${mdiPlus} .label=${`Add to ${this.label}`} ?disabled=${!this.choice} @click=${this.add}></ha-icon-button>
        </div>
        ${this.value.length
          ? html`<div class="chips">
              ${this.value.map(v => html`<span class="chip ${this.options.some(o => o.value === v) ? '' : 'missing'}">
                ${label(v)}
                <ha-icon-button .path=${mdiClose} .label=${`Remove ${label(v)}`} @click=${() => this.emit(this.value.filter(x => x !== v))}></ha-icon-button>
              </span>`)}
            </div>`
          : nothing}
      </div>
    `;
  }

  private add() {
    if (!this.choice || this.value.includes(this.choice)) return;
    this.emit([...this.value, this.choice]);
    this.choice = '';
  }

  private emit(value: string[]) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
  }

  static styles = css`
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 4px 0 8px;
    }
    .lbl {
      font-weight: 500;
    }
    .row {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    select,
    input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--primary-background-color));
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 8px;
      min-height: 34px;
      box-sizing: border-box;
      max-width: 100%;
    }
    select {
      min-width: 220px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 0 0 0 10px;
      border-radius: 16px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      --mdc-icon-button-size: 28px;
      --mdc-icon-size: 16px;
    }
    .chip.missing {
      border-color: var(--error-color, #f44336);
      color: var(--error-color, #f44336);
    }
  `;
}
