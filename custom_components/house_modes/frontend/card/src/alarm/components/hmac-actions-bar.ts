// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
import { LitElement, html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { ActionToIcon, ActionToState, AlarmStates, ArmActions } from '../const';
import { HomeAssistant } from '../lib/types';
import { fireEvent } from '../lib/fire-event';
import { isDefined, isEmpty } from '../helpers';
import { CardConfig } from '../types';
import { calcSupportedActions, computeStateColor } from '../data/entity';
import { calcStateConfig } from '../data/config';


@customElement("hmac-actions-bar")
export class HmActionsBar extends LitElement {

  @property({ attribute: false })
  public hass!: HomeAssistant;

  @property({ attribute: false })
  public config?: CardConfig;

  @property({ attribute: false })
  public readyForArmModes?: AlarmStates[];

  render() {
    if (!this.hass || !this.config) return nothing;

    const stateObj = this.hass.states[this.config.entity];
    let state = stateObj.state as AlarmStates;
    const ArmModes = Object.values(ArmActions).map(e => ActionToState[e]);
    if (!ArmModes.includes(state)) {
      const armMode = stateObj.attributes.arm_mode;
      if (armMode) state = armMode;
    }

    const bs = (this.config as any).button_style || {};
    return html`
      <div class="container ${bs.text_follows_icon ? 'follow' : ''} ${(this.config as any).shape === 'round' ? 'round' : ''} ${(this.config as any).fit ? 'fit' : ''}"
        style=${[bs.track ? `--b-track:${String(bs.track === 'none' ? 'transparent' : bs.track).replace(/[;{}<>]/g, '')};--b-track-opacity:1` : '',
          (this.config as any).gap !== undefined ? `--b-gap:${Number((this.config as any).gap)}px` : '',
          (this.config as any).padding !== undefined ? `--b-pad:${Number((this.config as any).padding)}px` : ''].filter(Boolean).join(';')}>
        ${this._renderOptions(state)}
      </div>
    `;
  }

  private _renderOptions(selectedOption: AlarmStates) {
    const stateObj = this.hass.states[this.config!.entity];

    const calcButtonVisible = (action: ArmActions) => {
      const hideCfg = calcStateConfig(ActionToState[action], this.config!).hide;
      if (typeof hideCfg === 'boolean' || !isDefined(hideCfg)) return !hideCfg;

      switch (hideCfg) {
        case 'always':
          return false;
        case 'never':
          return true;
        case 'armed':
          return stateObj.state == 'disarmed';
        case 'disarmed':
          return stateObj.state !== 'disarmed';
      }
    }

    const options = [ArmActions.Disarm, ...calcSupportedActions(stateObj)]
      .filter(calcButtonVisible);
    const hasTextLabel = options.map(e => calcStateConfig(ActionToState[e], this.config!)).some(e => !isDefined(e.button_label) || e.button_label.length);

    options.sort((a, b) => {
      const orderA = calcStateConfig(ActionToState[a], this.config!).button_order;
      const orderB = calcStateConfig(ActionToState[b], this.config!).button_order;
      if (!isDefined(orderA) && !isDefined(orderB)) return 0;
      else if (isDefined(orderA) && !isDefined(orderB)) return -1;
      else if (!isDefined(orderA) && isDefined(orderB)) return 1;
      else return orderA! - orderB!;
    });

    return options.map(e => {
      const isDisabled = isDefined(this.readyForArmModes) && !this.readyForArmModes.includes(ActionToState[e]) && e != ArmActions.Disarm;
      const stateConfig = calcStateConfig(ActionToState[e], this.config!);

      return html`
        <div class="button ${ActionToState[e] == selectedOption ? `selected ${((this.config as any).fx_classes || []).join(' ')}` : ''}"
          style="${this._buttonStyle(computeStateColor({ ...stateObj, state: ActionToState[e] } as any, this.config!))}"
          @click=${(ev: Event) => this._handleClick(ev, e)}>
          <div class="content ${hasTextLabel && (this.config as any).show_labels !== false ? 'has-text' : ''}">
            ${(this.config as any).show_icons === false ? nothing : html`<ha-icon icon="${isEmpty(stateConfig.button_icon) ? ActionToIcon[e] : stateConfig.button_icon}"></ha-icon>`}
            ${ActionToState[e] != selectedOption && isDefined(this.readyForArmModes) && isDisabled  /* ext: only "cannot arm" */
          ? html`
              <ha-icon
                icon="${isDisabled ? 'mdi:circle-medium' : 'mdi:circle-medium'}"
                class="badge ${isDisabled ? 'error' : 'success'}"
              ></ha-icon>
            ` : nothing}
            ${(this.config as any).show_labels === false ? nothing : html`<span>
              ${!isDefined(stateConfig.button_label)
          ? e == ArmActions.Disarm && stateObj.state !== AlarmStates.Disarmed
            ? this.hass!.localize(`ui.card.alarm_control_panel.${e}`)
            : this.hass!.localize(`ui.card.alarm_control_panel.modes.${ActionToState[e]}`)
          : stateConfig.button_label
        }
            </span>`}
          </div>
        </div>
      `;
    })
  }

  /** ext: the button's own arm color + the card's button style ('mode' = this button's arm color) */
  private _buttonStyle(own: string) {
    const bs = (this.config as any).button_style || {};
    const icon = (this.config as any).icon_style || {};
    const res = (v: string | undefined) =>
      v === undefined || v === '' ? undefined : v === 'mode' ? own : v === 'none' ? 'transparent' : String(v).replace(/[;{}<>]/g, '');
    const vars: [string, string | undefined][] = [
      ['--btn-color', own],
      ['--b-bg', res(bs.background)],
      ['--b-abg', res(bs.active_background)],
      ['--b-bd', res(bs.border)],
      ['--b-abd', res(bs.active_border)],
      ['--b-ic', res(icon.color)],
      ['--b-aic', res(icon.active_color)],
    ];
    return vars.filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(';');
  }

  private _handleClick(ev: Event, action: ArmActions) {
    fireEvent(this, 'button-clicked', { ev: ev, action: action });
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        display: inline-block;
        padding: 0px 10px;
        box-sizing: border-box;
      }
      div.container {
        position: relative;
        display: flex;
        width: 100%;
        gap: 0px;
        flex-wrap: wrap;
        gap: var(--b-gap, 0px);
        padding: 4px;
        box-sizing: border-box;
        --selected-color: var(--alarm-state-color);
      }
      div.container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: var(--b-track, var(--primary-text-color));
        opacity: var(--b-track-opacity, 0.05);
        border-radius: calc(var(--content-scale, 1) * 18px);
      }
      div.button {
        cursor: pointer;
        position: relative;
        flex: 1;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        /* For safari border-radius overflow */
        z-index: 0;
      }
      div.content {
        display: flex;
        position: relative;
        inline-size: calc(100% - 4px);
        border-radius: calc(var(--content-scale, 1) * 6px);
        height: calc(var(--content-scale, 1) * 26px);
        color: var(--primary-text-color);
        --mdc-icon-size: calc(var(--content-scale, 1) * var(--hmac-alarm-icon-size, 22px));
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-direction: column;
        padding: var(--b-pad, 8px) 2px;
        overflow: hidden;
        flex: 1;
        gap: 4px;
        background: var(--b-bg, none);
        /* an inset outline, not a border: the buttons have a fixed height */
        box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
        transition:
          color ease-in-out 180ms;
      }
      div.content.has-text {
        height: calc(var(--content-scale, 1) * 40px);
      }
      div.content::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: var(--b-abg, var(--btn-color, var(--selected-color)));
        opacity: 0;
        border-radius: calc(var(--content-scale, 1) * 14px);
        transition:
          background-color ease-in-out 180ms,
          opacity ease-in-out 80ms;
      }
      div.content.focused::before,
      div.content:hover::before {
        opacity: 0.24;
      }
      div.button.selected .content::before {
        opacity: 1;
      }
      div.button.selected .content {
        box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
      }
      div.content ha-icon {
        display: flex;
        color: var(--b-ic, var(--btn-color, inherit));
      }
      div.content span {
        display: flex;
        max-width: calc(100% - 4px);
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        overflow-wrap: break-word;
        text-overflow: clip;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        hyphens: auto;
        word-break: break-word;
        font-weight: var(--hmac-alarm-button-weight, 400);
        font-size: calc(var(--content-scale, 1) * var(--hmac-alarm-button-size, 14px));
        font-family: var(--hmac-alarm-button-font, inherit);
        font-style: var(--hmac-alarm-button-style, normal);
        text-transform: var(--hmac-alarm-button-transform, none);
        color: var(--hmac-alarm-button-color, inherit);
      }
      div.button.selected div.content ha-icon, div.button.selected div.content,
      div.button.selected div.content span {
        color: var(--b-aic, white);
      }
      /* text follows the icon color */
      div.container.follow div.content span {
        color: var(--b-ic, var(--btn-color, inherit));
      }
      div.container.follow div.button.selected div.content span {
        color: var(--b-aic, white);
      }
      /* round: a circle around the icon (selected: filled), the text below */
      div.container.round {
        --disc: calc(var(--content-scale, 1) * var(--hmac-alarm-icon-size, 22px) * 1.8);
      }
      div.container.round div.content,
      div.container.round div.content.has-text {
        height: auto;
        background: none;
        box-shadow: none;
        padding: 4px 2px;
        justify-content: flex-start;
      }
      div.container.round div.content ha-icon {
        width: var(--disc);
        height: var(--disc);
        align-items: center;
        justify-content: center;
      }
      div.container.round div.content::before,
      div.container.round div.content::after {
        width: var(--disc);
        height: var(--disc);
        left: 50%;
        top: 4px;
        transform: translateX(-50%);
        border-radius: 50%;
      }
      div.container.round div.content::after {
        content: "";
        position: absolute;
        z-index: -2;
        background: var(--b-bg, transparent);
        box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      }
      div.container.round div.button.selected div.content::after {
        box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
      }
      div.container.round div.content ha-icon.badge {
        width: auto;
        height: auto;
      }
      /* fit: as wide as their content, centered; the space between them is the gap */
      div.container.fit {
        justify-content: center;
      }
      div.container.fit div.button {
        flex: 0 0 auto;
        width: auto;
      }
      div.container.fit div.content {
        flex: 0 0 auto;
        inline-size: auto;
        padding-left: 10px;
        padding-right: 10px;
      }
      /* effects on the selected (or arming) button, in its own color */
      div.button {
        --fx-own: var(--btn-color, var(--fx-c));
      }
      div.button::after {
        content: "";
        position: absolute;
        inset: 0;
        margin: auto;
        inline-size: calc(100% - 4px);
        border-radius: calc(var(--content-scale, 1) * 14px);
        background: var(--fx-own);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
      }
      div.button.fx-background-glow::after { opacity: 0.22; }
      div.button.fx-background-pulse::after { animation: hmac-ab-tint var(--fx-speed, 1.6s) ease-in-out infinite; }
      div.button.fx-background-glow.fx-background-pulse::after { animation-name: hmac-ab-tint-strong; }
      div.button.fx-border-glow div.content {
        box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent);
      }
      div.button.fx-border-pulse div.content { animation: hmac-ab-ring var(--fx-speed, 1.6s) ease-out infinite; }
      div.button.fx-border-glow.fx-border-pulse div.content { animation-name: hmac-ab-ring-glow; }
      /* the glow shows outside the button; min-width 0 keeps one row (it shrank by overflow: hidden before) */
      div.button { overflow: visible; min-width: 0; }
      div.container.fit div.button { min-width: auto; }
      div.button.fx-icon-glow div.content ha-icon:not(.badge) {
        filter: drop-shadow(0 0 calc(var(--fx-size, 16px) / 3) var(--fx-own)) drop-shadow(0 0 calc(var(--fx-size, 16px) / 6) var(--fx-own));
      }
      div.button.fx-icon-pulse div.content ha-icon:not(.badge) { animation: hmac-ab-icon var(--fx-speed, 1.6s) ease-in-out infinite; }
      @keyframes hmac-ab-tint { 0%, 100% { opacity: 0; } 50% { opacity: 0.3; } }
      @keyframes hmac-ab-tint-strong { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.4; } }
      @keyframes hmac-ab-ring {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--fx-own) 60%, transparent); }
        70%, 100% { box-shadow: 0 0 0 calc(var(--fx-size, 16px) / 2) color-mix(in srgb, var(--fx-own) 0%, transparent); }
      }
      @keyframes hmac-ab-ring-glow {
        0% { box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent), 0 0 0 0 color-mix(in srgb, var(--fx-own) 60%, transparent); }
        70%, 100% { box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent), 0 0 0 calc(var(--fx-size, 16px) / 2) color-mix(in srgb, var(--fx-own) 0%, transparent); }
      }
      @keyframes hmac-ab-icon { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.18); opacity: 0.75; } }
      @media (prefers-reduced-motion: reduce) {
        div.button, div.button * { animation: none !important; }
      }
      @media (max-width: 280px) {
        div.container {
          flex-direction: column;
        }
      }
      div.content ha-icon.badge {
        position: absolute;
        top: 0px;
        margin-left: calc(var(--content-scale, 1) * 28px);
      }
      div.content ha-icon.success {
        color: var(--green-color);
      }
      div.content ha-icon.error {
        color: var(--red-color);
      }
    `
  }
}