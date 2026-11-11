// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { mdiClose } from '@mdi/js';
import {
  HmAutomation,
  EAlarmEvent,
  EArmModes,
  HmArea,
  Dictionary,
  AutomationAction,
  HmConfig,
  HomeAssistant,
} from '../../types';
import { handleError, isDefined, Unique, omit, showErrorDialog, navigate, computeEntity } from '../../helpers';
import { saveAutomation, fetchAreas, fetchConfig, deleteAutomation } from '../../data/websockets';
import { localize } from '../../../localize/localize';
import {
  computeEventDisplay,
  computeAreaDisplay,
  computeArmModeDisplay,
  getAreaOptions,
  getArmModeOptions,
  getAutomationEntities,
  computeEntityDisplay,
  isValidString,
  isValidEntity,
  isValidService,
  isObject,
  isString,
  isArray,
  computeActions,
  computeActionDisplay,
  computeMergedActions,
  findMatchingAction,
} from '../../data/actions';
import { EAutomationTypes } from '../../const';
import { exportPath } from '../../common/navigation';
import { loadHaYamlEditor } from '../../load-ha-elements';
import { isLegacyEvent, eventTargets, nativeActions } from '../../data/alarm-events';

import '../../components/hm-selector';
import '../../components/hm-select';

enum ViewMode {
  Yaml,
  UI,
}

@customElement('hm-automation-editor-card')
export class AutomationEditorCard extends LitElement {
  @property({ attribute: false })
  public hass!: HomeAssistant;

  @property()
  narrow!: boolean;

  @property()
  config: HmAutomation = {
    type: EAutomationTypes.Action,
    triggers: [{}],
    actions: [{}],
  };

  @property()
  item?: HmAutomation;

  /** ext: a new event that runs this script */
  @property()
  preset?: string;

  @property()
  areas!: Dictionary<HmArea>;

  @property()
  hmConfig?: HmConfig;

  @property()
  viewMode = ViewMode.UI;

  @property()
  errors: Dictionary<boolean> = {};

  /** ext: an upstream-style event (own list of service calls), edited with the old controls until migrated */
  @property()
  legacy = false;

  async firstUpdated() {
    await loadHaYamlEditor();

    this.areas = await fetchAreas(this.hass);
    this.hmConfig = await fetchConfig(this.hass);

    if (this.item) {
      let actions = this.item.actions.map(e => (e.entity_id ? e : omit(e, 'entity_id')));
      this.config = { ...this.item, actions: [actions[0], ...actions.slice(1)] };
      if (this.config.triggers.length > 1) this.config = { ...this.config, triggers: [this.config.triggers[0]] };

      let area = this.config.triggers[0].area;
      if (isDefined(area) && !getAreaOptions(this.areas, this.hmConfig).includes(area)) area = undefined;
      else if (area === null) area = 0;
      this._setArea(new CustomEvent('value-changed', { detail: { value: area } }));

      this.legacy = isLegacyEvent(this.item);
      if (this.legacy && this._hasCustomEntities()) this.viewMode = ViewMode.Yaml;
    }

    if (!this.item && this.preset) this.config = { ...this.config, actions: nativeActions([this.preset]) };

    //automatically set area if there is only 1 option
    if (!isDefined(this.config.triggers[0].area)) {
      const areaOptions = getAreaOptions(this.areas, this.hmConfig);
      if (areaOptions.length == 1)
        this._setArea(new CustomEvent('value-changed', { detail: { value: areaOptions[0] } }));
      else if (areaOptions.includes(0)) this._setArea(new CustomEvent('value-changed', { detail: { value: 0 } }));
    }

    if (this.item && !this.config.triggers[0].area && !this.hmConfig.master.enabled)
      this.errors = { ...this.errors, area: true };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.areas || !this.hmConfig) return html``;
    return html`
      <div class="heading">
        <div class="header">${this.item?.automation_id ? this.item.name || localize('panels.actions.cards.new_action.title', this.hass.language) : localize('panels.actions.cards.new_action.title', this.hass.language)}</div>
        <ha-button appearance="plain" @click=${this._toggleYamlMode}>
          <ha-icon slot="start" icon="mdi:code-braces"></ha-icon>
          ${this.viewMode == ViewMode.Yaml
            ? localize('components.editor.ui_mode', this.hass.language)
            : localize('components.editor.yaml_mode', this.hass.language)}
        </ha-button>
        <ha-icon-button .path=${mdiClose} @click=${this._cancelClick} class="icon" .label=${'Close'}></ha-icon-button>
      </div>
      <div class="description">${localize('panels.actions.cards.new_action.description', this.hass.language)}</div>
      <div class="section-header">${localize('panels.actions.cards.new_notification.trigger', this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${localize('panels.actions.cards.new_action.fields.event.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.actions.cards.new_action.fields.event.description', this.hass.language)}
            </span>

            <hm-select
              .hass=${this.hass}
              .items=${Object.values(EAlarmEvent).map(e => computeEventDisplay(e, this.hass))}
              label=${localize('panels.actions.cards.new_action.fields.event.heading', this.hass.language)}
              icons=${true}
              .value=${this.config.triggers[0].event}
              @value-changed=${this._setEvent}
              ?invalid=${this.errors.event}
              showSearch
            ></hm-select>
          </hm-settings-row>

          ${Object.keys(this.areas).length > 1
        ? html`
                <hm-settings-row .narrow=${this.narrow} compact>
                  <span slot="heading">
                    ${localize('panels.actions.cards.new_action.fields.area.heading', this.hass.language)}
                  </span>
                  <span slot="description">
                    ${localize('panels.actions.cards.new_action.fields.area.description', this.hass.language)}
                  </span>

                  <hm-select
                    .hass=${this.hass}
                    .items=${getAreaOptions(this.areas, this.hmConfig!).map(e =>
          computeAreaDisplay(e, this.areas, this.hmConfig!)
        )}
                    label=${localize('panels.actions.cards.new_action.fields.area.heading', this.hass.language)}
                    .value=${String(this.config.triggers[0].area)}
                    @value-changed=${this._setArea}
                    ?invalid=${this.errors.area}
                  ></hm-select>
                </hm-settings-row>
              `
        : ''}

          <hm-settings-row .narrow=${this.narrow} compact last>
            <span slot="heading">
              ${localize('panels.actions.cards.new_notification.fields.mode.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.actions.cards.new_action.fields.mode.description', this.hass.language)}
            </span>

            <hm-selector
              .hass=${this.hass}
              .items=${getArmModeOptions(this.config.triggers[0].area, this.areas).map(e =>
          computeArmModeDisplay(e, this.hass)
        )}
              label=${localize('panels.actions.cards.new_action.fields.mode.heading', this.hass.language)}
              .value=${this.config.triggers[0].modes || []}
              @value-changed=${this._setModes}
              ?invalid=${this.errors.modes}
            ></hm-selector>
          </hm-settings-row>
        </div>
      </div>

      <div class="section-header">${'Runs'}</div>
      <div class="box">
        <div class="card-content">
          ${this.viewMode == ViewMode.UI && !this.legacy
        ? this.renderRun()
        : this.viewMode == ViewMode.UI
        ? html`
                <div class="legacy-note">
                  This event uses the old built-in list of actions. Use <b>Migrate to scripts</b> above the
                  Alarm Events list to turn it into a native script.
                </div>
                <hm-settings-row .narrow=${this.narrow} compact first>
                  <span slot="heading">
                    ${localize('panels.actions.cards.new_action.fields.entity.heading', this.hass.language)}
                  </span>
                  <span slot="description">
                    ${localize('panels.actions.cards.new_action.fields.entity.description', this.hass.language)}
                  </span>

                  <hm-selector
                    .hass=${this.hass}
                    .items=${computeEntityDisplay(getAutomationEntities(this.hass, this._getEntities()), this.hass)}
                    ?disabled=${!getAutomationEntities(this.hass, this._getEntities()).length}
                    label=${localize('panels.actions.cards.new_action.fields.entity.heading', this.hass.language)}
                    .value=${this._getEntities()}
                    @value-changed=${this._setEntity}
                    ?invalid=${this.errors.entity_id}
                    showSearch
                  ></hm-selector>
                </hm-settings-row>

                ${this._getEntities().length
            ? html`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${localize('panels.actions.cards.new_action.fields.action.heading', this.hass.language)}
                        </span>
                        <span slot="description">
                          ${localize('panels.actions.cards.new_action.fields.action.description', this.hass.language)}
                        </span>

                        <div>
                          ${this.renderActions() ||
              localize(
                'panels.actions.cards.new_action.fields.action.no_common_actions',
                this.hass.language
              )}
                        </div>
                        ${this.errors.service
                ? html`
                              <span class="error-message">
                                ${this.hass.localize('ui.common.error_required', this.hass.language)}
                              </span>
                            `
                : ''}
                      </hm-settings-row>
                    `
            : ''}
              `
        : html`
                <h2>${localize('components.editor.edit_in_yaml', this.hass.language)}</h2>

                <ha-yaml-editor
                  .defaultValue=${this.config.actions || ''}
                  @value-changed=${this._setYaml}
                ></ha-yaml-editor>

                ${this.errors.service || this.errors.entity_id
            ? html`
                      <span class="error-message">
                        ${this.hass.localize(
              'ui.errors.config.key_missing',
              'key',
              Object.entries(this.errors).find(([k, v]) => v && ['service', 'entity_id'].includes(k))![0]
            )}
                      </span>
                    `
            : ''}
              `}
        </div>

        <div class="card-actions">
          <ha-button appearance="plain" ?disabled=${!this._validAction()} @click=${this._testClick}>
            ${localize('panels.actions.cards.new_notification.actions.test', this.hass.language)}
            <ha-icon slot="end" icon="hass:arrow-right"></ha-icon>
          </ha-button>
        </div>
      </div>

      <div class="section-header">${localize('panels.actions.cards.new_notification.options', this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${localize('panels.actions.cards.new_action.fields.name.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.actions.cards.new_action.fields.name.description', this.hass.language)}
            </span>

            <ha-input
              label="${localize('panels.actions.cards.new_action.fields.name.heading', this.hass.language)}"
              .placeholder=${this._namePlaceholder()}
              .value=${this.config.name || ''}
              @input=${this._setName}
              ?invalid=${this.errors.name}
            ></ha-input>
          </hm-settings-row>

        </div>
      </div>

      <div class="actions">
        <ha-button appearance="filled" @click=${this._saveClick}>
          <ha-icon slot="start" icon="hass:content-save-outline"></ha-icon>
          ${this.hass.localize('ui.common.save')}
        </ha-button>
        <ha-button appearance="plain" @click=${this._cancelClick}>${this.hass.localize('ui.common.cancel')}</ha-button>
        <span style="flex:1"></span>
        ${this.item?.automation_id
          ? html`<ha-icon-button .label=${this.hass.localize('ui.common.delete')} title=${this.hass.localize('ui.common.delete')}
              @click=${this._deleteClick}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`
          : ''}
      </div>
    `;
  }

  /** ext: the one method, run native scripts */
  private renderRun() {
    const all = Object.keys(this.hass.states)
      .filter(e => e.startsWith('script.'))
      .sort((a, b) =>
        String(this.hass.states[a].attributes.friendly_name || a).localeCompare(
          String(this.hass.states[b].attributes.friendly_name || b)
        )
      );
    const value = eventTargets(this.config);
    return html`
      <hm-settings-row .narrow=${this.narrow} compact first>
        <span slot="heading">Scripts</span>
        <span slot="description">
          Run these Home Assistant scripts, in this order. Scripts get the variables <code>event</code>,
          <code>area</code> and <code>arm_mode</code>. Create them in Home Assistant.
        </span>
        <hm-selector
          .hass=${this.hass}
          .items=${computeEntityDisplay([...new Set([...all, ...value])], this.hass)}
          ?disabled=${!all.length && !value.length}
          label="Scripts"
          .value=${value}
          @value-changed=${this._setRun}
          ?invalid=${this.errors.entity_id || this.errors.service}
          showSearch
        ></hm-selector>
      </hm-settings-row>
    `;
  }

  private _setRun(ev: CustomEvent) {
    ev.stopPropagation();
    const ids = (ev.detail.value || []) as string[];
    this.config = { ...this.config, actions: ids.length ? nativeActions(ids) : [{}] };
    if (Object.keys(this.errors).length) this._validateConfig();
  }

  private renderActions() {
    let selectedEntities = this.config.actions.map(e => e.entity_id);
    let actions = computeActions(selectedEntities, this.hass);

    if (!actions.length) return;

    const isMatchingAction = (...actions: (string | null)[]) => {
      if (!actions.every(isDefined)) return false;
      return Unique(computeMergedActions(actions.filter(isDefined))).length == 1;
    };

    return actions.map(action => {
      return html`
        <ha-button
          appearance="${isMatchingAction(this._selectedAction(), action) ? 'filled' : 'plain'}"
          variant="${isMatchingAction(this._selectedAction(), action) ? 'brand' : 'neutral'}"
          @click=${() => this._setAction(action)}
        >
          ${computeActionDisplay(action, this.hass)}
        </ha-button>
      `;
    });
  }

  private _selectedAction() {
    let selectedActions = this.config.actions.map(e => e.service);
    if (!selectedActions.every(isDefined)) return null;
    selectedActions = Unique(computeMergedActions(selectedActions.filter(isDefined)));
    if (selectedActions.length == 1) return selectedActions[0]!;
    else return null;
  }

  private _setEvent(ev: CustomEvent) {
    ev.stopPropagation();
    const value = ev.detail.value as EAlarmEvent;
    let triggerConfig = this.config.triggers;
    Object.assign(triggerConfig, { [0]: { ...triggerConfig[0], event: value } });
    this.config = { ...this.config, triggers: triggerConfig };
    if (Object.keys(this.errors).includes('event')) this._validateConfig();
  }

  private _setArea(ev: CustomEvent) {
    ev.stopPropagation();
    let value = ev.detail.value;
    if (value === '0') value = 0;
    let triggerConfig = this.config.triggers;
    Object.assign(triggerConfig, { [0]: { ...triggerConfig[0], area: value } });
    const armModes = getArmModeOptions(value, this.areas!);

    if (triggerConfig[0].modes?.length)
      this._setModes(
        new CustomEvent('value-changed', {
          detail: { value: triggerConfig[0].modes.filter(e => armModes.includes(e)) },
        })
      );

    this.config = { ...this.config, triggers: triggerConfig };
    if (Object.keys(this.errors).includes('area')) this._validateConfig();
  }

  private _setModes(ev: CustomEvent) {
    ev.stopPropagation();
    const value = ev.detail.value as EArmModes[];
    const triggerConfig = this.config.triggers;
    Object.assign(triggerConfig, { [0]: { ...triggerConfig[0], modes: value } });
    this.config = { ...this.config, triggers: triggerConfig };
    if (Object.keys(this.errors).includes('service')) this._validateConfig();
  }

  private _setEntity(ev: CustomEvent) {
    ev.stopPropagation();
    const selectedEntities = ev.detail.value as string[];
    let actionConfig = this.config.actions;

    //assign service for added entity if it is in common
    let serviceSetting: string | null = null;
    if (selectedEntities.length > actionConfig.length && this._selectedAction())
      serviceSetting = this._selectedAction();

    if (actionConfig.length > selectedEntities.length) {
      let removedAction = actionConfig.findIndex(e => !selectedEntities.includes(e.entity_id || ''));
      if (removedAction < 0) removedAction = actionConfig.length - 1;
      actionConfig.splice(removedAction, 1);
    }

    if (!selectedEntities.length) Object.assign(actionConfig, { [0]: omit(actionConfig[0], 'entity_id') });

    selectedEntities.forEach((entity, i) => {
      let action = actionConfig.length > i ? { ...actionConfig[i] } : {};
      action = action.entity_id == entity ? { ...action } : { entity_id: entity };
      Object.assign(actionConfig, { [i]: action });
    });

    this.config = { ...this.config, actions: actionConfig };
    if (serviceSetting) this._setAction(serviceSetting);
    if (Object.keys(this.errors).includes('entity_id')) this._validateConfig();
  }

  private _setAction(selectedAction: string) {
    let actionConfig = this.config.actions;

    let selectedEntities = this.config.actions.map(e => e.entity_id);
    let availableActions = computeActions(selectedEntities, this.hass);
    if (!availableActions.length) return;

    actionConfig.forEach((e, i) => {
      let actions = computeActions(e.entity_id, this.hass);
      let service = findMatchingAction(actions, selectedAction);
      Object.assign(actionConfig, { [i]: { service: service, ...omit(e, 'service') } });
    });
    this.config = { ...this.config, actions: actionConfig };
    if (Object.keys(this.errors).includes('service')) this._validateConfig();
  }

  private _setName(ev: Event) {
    ev.stopPropagation();
    const value = (ev.target as HTMLInputElement).value;
    this.config = { ...this.config, name: value };
  }

  private _setYaml(ev: CustomEvent): void {
    let value = ev.detail.value;

    let actionConfig: [AutomationAction, ...AutomationAction[]] = [{}];

    if (isObject(value)) value = [value];

    if (isArray(value)) {
      value.forEach((entry, i) => {
        let output: Partial<AutomationAction> = {};

        if (isObject(entry) && isString(entry.service)) output = { ...output, service: entry.service };
        if (isObject(entry) && isString(entry.entity_id)) output = { ...output, entity_id: entry.entity_id };
        if (isObject(entry) && isObject(entry.data)) output = { ...output, data: entry.data };

        Object.assign(actionConfig, { [i]: output });
      });
      this.config = { ...this.config, actions: actionConfig };
    }
  }

  private _validateConfig() {
    this.errors = {};
    const data = this._parseAutomation();

    const triggerConfig = data.triggers[0];
    if (!triggerConfig.event || !Object.values(EAlarmEvent).includes(triggerConfig.event))
      this.errors = { ...this.errors, event: true };
    if (!isDefined(triggerConfig.area) || !getAreaOptions(this.areas, this.hmConfig!).includes(triggerConfig.area))
      this.errors = { ...this.errors, area: true };
    if (!(triggerConfig.modes || []).every(e => getArmModeOptions(triggerConfig.area, this.areas!).includes(e)))
      this.errors = { ...this.errors, modes: true };

    let entities = data.actions.map(e => e.entity_id);
    if (this.viewMode == ViewMode.Yaml) entities = entities.filter(isDefined);
    if (!data.actions.length || !entities.every(e => isValidEntity(e, this.hass)))
      this.errors = { ...this.errors, entity_id: true };

    const services = data.actions.map(e => e.service).filter(isDefined);
    if (!services.length || !services.every(e => isValidService(e, this.hass))) {
      this.errors = { ...this.errors, service: true };
      let availableActions = computeActions(entities, this.hass);
      if (!availableActions.length && services.length) this.viewMode = ViewMode.Yaml;
    }

    if (!isValidString(data.name)) this.errors = { ...this.errors, name: true };

    return !Object.values(this.errors).length;
  }

  private _validAction() {
    const data = this._parseAutomation();
    const services = data.actions.map(e => e.service);
    let entities = data.actions.map(e => e.entity_id);
    if (this.viewMode == ViewMode.Yaml) entities = entities.filter(isDefined);

    return (
      services.length &&
      services.every(e => isValidService(e, this.hass)) &&
      entities.every(e => isValidEntity(e, this.hass))
    );
  }

  private _toggleYamlMode() {
    this.viewMode = this.viewMode == ViewMode.UI ? ViewMode.Yaml : ViewMode.UI;

    if (this.viewMode == ViewMode.Yaml)
      this.config = {
        ...this.config,
        actions: Object.assign(this.config.actions, {
          [0]: {
            ...this.config.actions[0],
            service: this.config.actions[0].service || '',
            data: {
              ...(this.config.actions[0].data || {}),
            },
          },
        }),
      };
  }

  private _namePlaceholder() {
    if (!this.legacy && this.viewMode == ViewMode.UI) {
      const names = computeEntityDisplay(eventTargets(this.config), this.hass).map(e => e.name);
      const event = this.config.triggers[0].event;
      return event && names.length ? `${computeEventDisplay(event, this.hass).name}: ${names.join(', ')}` : '';
    }
    if (!this._validAction) return '';
    const event = this.config.triggers[0].event;
    const entities = this.config.actions.map(e => e.entity_id).filter(isDefined) as string[];
    const entity = computeEntityDisplay(entities, this.hass)
      .map(e => e.name)
      .join(', ');
    const services = Unique(
      this.config.actions
        .map(e => e.service)
        .filter(isDefined)
        .map(e => computeEntity(e))
    );
    let state: string | undefined = undefined;
    if (services.length == 1 && services[0]?.includes('turn_on')) state = this.hass.localize('state.default.on');
    if (services.length == 1 && services[0]?.includes('turn_off')) state = this.hass.localize('state.default.off');
    if (services.length == 1 && services[0]?.includes('lock'))
      state = this.hass.localize('component.lock.state._.locked');
    if (services.length == 1 && services[0]?.includes('unlock'))
      state = this.hass.localize('component.lock.state._.unlocked');
    if (!event || !entity || !state) return '';
    else
      return localize(
        `panels.actions.cards.new_action.fields.name.placeholders.${event}`,
        this.hass.language,
        'entity',
        entity,
        'state',
        state
      );
  }

  private _getEntities() {
    return Unique(this.config.actions.map(e => e.entity_id).filter(isDefined)) || [];
  }

  private _hasCustomEntities() {
    return this._getEntities().some(e => !getAutomationEntities(this.hass).includes(e));
  }

  private _parseAutomation() {
    let data = { ...this.config };

    //fill in name placeholder
    if (!isValidString(data.name) && this._namePlaceholder()) data = { ...data, name: this._namePlaceholder() };

    return data;
  }

  private _saveClick(ev: Event) {
    if (!this._validateConfig()) return;
    let data = this._parseAutomation();

    //keep modes array empty if all modes are selected
    if (getArmModeOptions(data.triggers[0].area, this.areas!).every(e => data.triggers[0].modes?.includes(e))) {
      data = { ...data, triggers: Object.assign(data.triggers, { [0]: { ...data.triggers[0], modes: [] } }) };
    }

    saveAutomation(this.hass, data)
      .catch(e => handleError(e, ev))
      .then(() => this._cancelClick());
  }

  private _deleteClick(ev: Event) {
    if (!this.item?.automation_id) return;
    if (!window.confirm(`Delete the Alarm Event "${this.item.name}"?`)) return;
    deleteAutomation(this.hass, this.item.automation_id)
      .catch(e => handleError(e, ev))
      .then(() => this._cancelClick());
  }

  private _testClick(ev: Event) {
    const data = this._parseAutomation();
    data.actions.forEach(action => {
      const [domain, service] = action.service!.split('.');
      let serviceData = { ...action.data };
      if (action.entity_id) serviceData = { ...serviceData, entity_id: action.entity_id };
      this.hass
        .callService(domain, service, serviceData)
        .then()
        .catch(e => {
          showErrorDialog(ev, e.message);
          return;
        });
    });
  }

  private _cancelClick() {
    navigate(this, exportPath('actions'), true);
  }

  static get styles(): CSSResultGroup {
    return css`
      /* ext: one compact panel (CARD_DESIGN_SYSTEM), the same as the notification editor */
      :host {
        display: block;
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 4px 12px 8px;
      }
      div.heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0 0;
      }
      div.header {
        flex: 1 1 auto;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        font-size: 13px;
      }
      div.description {
        color: var(--secondary-text-color);
        font-size: 13px;
      }
      div.section-header {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 12px 0 0;
      }
      div.box {
        border-bottom: 1px solid var(--divider-color);
      }
      div.box .card-content {
        padding: 0;
      }
      div.box .card-actions {
        border: none;
        padding: 4px 0 8px;
      }
      div.actions {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 0 4px;
      }
      h2 {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 400;
      }
      div.legacy-note {
        margin: 8px 0;
        padding: 8px 12px;
        border: 1px solid var(--warning-color, #ff9800);
        border-radius: 8px;
      }
      span.error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        display: flex;
        margin-top: 10px;
      }
    `;
  }
}
