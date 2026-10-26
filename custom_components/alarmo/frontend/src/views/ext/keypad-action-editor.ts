// Editor for one keypad action: House Mode and/or per-partition targets (targets win for their partitions).
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HouseMode, TARGET_STATES } from '../../data/house';
import { KeypadAction, withTarget } from '../../data/locks';

export const KEYPAD_STATE_LABEL: Record<string, string> = {
  armed_away: 'Away',
  armed_home: 'Home (Stay)',
  armed_night: 'Night',
  armed_vacation: 'Vacation',
  armed_custom_bypass: 'Custom',
  disarmed: 'Disarm',
};

@customElement('alarmo-ext-keypad-action')
export class KeypadActionEditor extends LitElement {
  @property({ attribute: false }) action?: KeypadAction;
  @property({ attribute: false }) modes: HouseMode[] = [];
  @property({ type: Boolean }) houseEnabled = false;
  @property({ attribute: false }) partitions: { key: string; name: string }[] = [];
  @property() label = '';
  @property({ type: Boolean }) disabled = false;

  private emit(a: KeypadAction) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: a } }));
  }

  render() {
    const a = this.action || { house_mode: null, targets: {} };
    return html`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <label
          >House Mode
          <select
            aria-label=${`${this.label}: House Mode`}
            @change=${(e: any) => this.emit({ ...a, house_mode: e.target.value || null })}
          >
            <option value="" ?selected=${!a.house_mode}>leave unchanged</option>
            ${this.modes.map(m => html`<option value=${m.id} ?selected=${a.house_mode === m.id}>${m.name}</option>`)}
          </select>
        </label>
        ${a.house_mode && !this.houseEnabled ? html`<span class="warn">House Modes are off, so this part does nothing.</span>` : nothing}
        ${this.partitions.map(
          p => html`<label
            >${p.name}
            <select
              aria-label=${`${this.label}: ${p.name}`}
              @change=${(e: any) => this.emit(withTarget(a, p.key, e.target.value))}
            >
              <option value="" ?selected=${!a.targets[p.key]}>${a.house_mode ? 'as the House Mode sets it' : 'leave unchanged'}</option>
              ${TARGET_STATES.map(s => html`<option value=${s} ?selected=${a.targets[p.key] === s}>${KEYPAD_STATE_LABEL[s]}</option>`)}
            </select>
          </label>`
        )}
      </fieldset>
    `;
  }

  static styles = css`
    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 12px 12px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    legend {
      padding: 0 4px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--accent-color, var(--primary-color));
    }
    label {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    select {
      min-width: 160px;
      max-width: 100%;
    }
    .warn {
      color: var(--warning-color, #ffa600);
      font-size: 12px;
    }
  `;
}
