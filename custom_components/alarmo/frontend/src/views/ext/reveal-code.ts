// "Show code" button for one lock slot: reads the code from the lock on click (admin only), shows it for 30 s.
// The code is never stored: it lives only in this element until it is hidden again.
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { revealCode, revealUserCode } from '../../data/locks';
import { wsErrorMessage } from '../../data/ext-websockets';

const SHOW_SECONDS = 30;

@customElement('alarmo-ext-reveal-code')
export class RevealCode extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() entityId = '';
  @property({ type: Number }) slotNo = 0;
  /** set: show an Alarmo User's code (read from a linked lock slot that holds it) */
  @property() userId = '';
  @state() private code: string | null = null;
  @state() private msg = '';
  private timer?: number;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.hide();
  }

  private hide() {
    window.clearTimeout(this.timer);
    this.code = null;
    this.msg = '';
  }

  private async show() {
    if (this.code) return this.hide();
    this.msg = '…';
    try {
      const r = this.userId ? await revealUserCode(this.hass, this.userId) : await revealCode(this.hass, this.entityId, this.slotNo);
      if (r.code) {
        this.code = r.code;
        this.msg = '';
        this.timer = window.setTimeout(() => this.hide(), SHOW_SECONDS * 1000);
      } else this.msg = this.userId ? 'only shown when a linked lock slot holds it' : 'not readable';
    } catch (err) {
      this.msg = wsErrorMessage(err);
    }
  }

  render() {
    return html`<button
        title=${this.code ? 'Hide the code' : `Show the code (${SHOW_SECONDS} s)`}
        aria-label=${this.code ? 'Hide code' : this.userId ? 'Show the user code' : `Show code of slot ${this.slotNo}`}
        @click=${this.show}
      ><ha-icon icon=${this.code ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}></ha-icon></button
      ><span class=${this.code ? 'code' : 'msg'}>${this.code ? this.code : this.msg || '••••'}</span>`;
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .code {
      font-family: var(--code-font-family, monospace);
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    .msg {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
  `;
}
