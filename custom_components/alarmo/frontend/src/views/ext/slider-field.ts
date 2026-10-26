// Numeric setting as a slider (CARD_DESIGN_SYSTEM §2): label, range, bold tabular readout.
// optional=true: a checkbox on the label turns the value on/off (off = null = "default"), slider hidden when off.
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('alarmo-ext-slider')
export class ExtSlider extends LitElement {
  @property() label = '';
  @property({ attribute: false }) value: number | null = null;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property() unit = '';
  @property({ type: Boolean }) optional = false;
  /** text shown when an optional value is off */
  @property() offText = 'default';
  /** value used when an optional value is switched on */
  @property({ type: Number }) onValue?: number;
  @property({ type: Boolean }) disabled = false;
  /** compact: no label text (table cells); the label is still used for aria */
  @property({ type: Boolean }) compact = false;

  private emit(v: number | null) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: v }, bubbles: false }));
  }

  private clamp(v: number) {
    return Math.min(this.max, Math.max(this.min, v));
  }

  render() {
    const on = this.value !== null && this.value !== undefined;
    const v = on ? this.clamp(Number(this.value)) : this.clamp(this.onValue ?? this.min);
    return html`
      <div class="row">
        ${this.optional
          ? html`<label class="lbl">
              <input
                type="checkbox"
                .checked=${on}
                ?disabled=${this.disabled}
                aria-label=${this.compact ? this.label : nothing}
                @change=${(e: any) => this.emit(e.target.checked ? v : null)}
              />${this.compact ? nothing : html`<span>${this.label}</span>`}
            </label>`
          : this.compact
            ? nothing
            : html`<span class="lbl">${this.label}</span>`}
        ${on || !this.optional
          ? html`<span class="grp">
              <input
                type="range"
                min=${this.min}
                max=${this.max}
                step=${this.step}
                .value=${String(v)}
                ?disabled=${this.disabled}
                aria-label=${this.label}
                @input=${(e: any) => (this.shadowRoot!.querySelector('.val')!.textContent = `${e.target.value}${this.unit ? ' ' + this.unit : ''}`)}
                @change=${(e: any) => this.emit(this.clamp(parseInt(e.target.value, 10) || 0))}
              />
              <span class="val">${v}${this.unit ? ` ${this.unit}` : ''}</span>
            </span>`
          : html`<span class="off">${this.offText}</span>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      min-height: 36px;
    }
    .lbl {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .grp {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      flex: 1 1 140px;
      min-width: 120px;
      max-width: 320px;
    }
    input[type='range'] {
      flex: 1 1 auto;
      min-width: 80px;
      accent-color: var(--primary-color);
    }
    .val {
      min-width: 44px;
      padding-left: 2px;
      text-align: right;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .off {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    :host([compact]) .grp {
      flex: 0 0 auto;
      width: 170px;
    }
  `;
}
