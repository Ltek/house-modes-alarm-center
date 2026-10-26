import { LitElement, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { prettyPrint, handleError, sortAlphabetically, pick, navigate } from '../../helpers';
import { AlarmoConfig, Dictionary, AlarmoUser, HomeAssistant } from '../../types';

import './user-editor-card.ts';
import '../../components/alarmo-settings-row';
import '../../components/alarmo-table.ts';

import { commonStyle } from '../../styles';
import { localize } from '../../../localize/localize';
import { SubscribeMixin } from '../../subscribe-mixin';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';
import { fetchConfig, fetchUsers, saveConfig, saveUser } from '../../data/websockets';
import { LockLink, UserActions, clearCodes, fetchLockSettings, isEmptyAction } from '../../data/locks';
import '../ext/view-connections';
import { TableData, TableColumn } from '../../components/alarmo-table';
import { exportPath, Path } from '../../common/navigation';
import { roleChip, sectionHead } from '../ext/page-intro';

@customElement('alarm-view-codes')
export class AlarmViewCodes extends SubscribeMixin(LitElement) {
  @property()
  hass?: HomeAssistant;

  @property()
  narrow!: boolean;

  @property()
  path!: Path;

  @property()
  data?: Partial<AlarmoConfig>;

  @property()
  users: Dictionary<AlarmoUser> = {};

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this._fetchData();
    return [this.hass!.connection.subscribeMessage(() => this._fetchData(), { type: 'alarmo_config_updated' })];
  }

  /** ext: lock code slots linked to users */
  lockLinks: LockLink[] = [];
  lockActions: Record<string, UserActions> = {};

  private async _fetchData(): Promise<void> {
    if (!this.hass) {
      return;
    }
    const config = await fetchConfig(this.hass);
    this.data = pick(config, ['code_arm_required', 'code_disarm_required', 'code_mode_change_required', 'code_format']);

    const users = await fetchUsers(this.hass);
    try {
      const ls = await fetchLockSettings(this.hass);
      this.lockLinks = ls.settings.links;
      this.lockActions = ls.settings.actions;
    } catch (_e) {
      this.lockLinks = [];
    }
    this.users = users;
  }

  render() {
    if (!this.hass || !this.data) return html``;

    {
      const codesInUse = this.data.code_arm_required || this.data.code_disarm_required || this.data.code_mode_change_required;

      return html`
        <ha-card>${sectionHead(localize('panels.codes.title', this.hass.language), 'settings')}
          <div class="card-content">${localize('panels.codes.cards.codes.description', this.hass.language)}</div>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${localize('panels.codes.cards.codes.fields.code_arm_required.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.codes.cards.codes.fields.code_arm_required.description', this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_arm_required}
              @change=${(ev: Event) => {
          this.saveData({ code_arm_required: (ev.target as HTMLInputElement).checked });
        }}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${localize('panels.codes.cards.codes.fields.code_disarm_required.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.codes.cards.codes.fields.code_disarm_required.description', this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_disarm_required}
              @change=${(ev: Event) => {
          this.saveData({ code_disarm_required: (ev.target as HTMLInputElement).checked });
        }}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${localize('panels.codes.cards.codes.fields.code_mode_change_required.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.codes.cards.codes.fields.code_mode_change_required.description', this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_mode_change_required}
              @change=${(ev: Event) => {
          this.saveData({ code_mode_change_required: (ev.target as HTMLInputElement).checked });
        }}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${localize('panels.codes.cards.codes.fields.code_format.heading', this.hass.language)}
            </span>
            <span slot="description">
              ${localize('panels.codes.cards.codes.fields.code_format.description', this.hass.language)}
            </span>
            <ha-button
              appearance="${this.data.code_format == 'number' ? 'filled' : 'plain'}"
              variant="${this.data.code_format == 'number' ? 'brand' : 'neutral'}"
          : ''}"
              @click=${() => {
          this.saveData({ code_format: 'number' });
        }}
              ?disabled=${!codesInUse}
            >
              ${localize('panels.codes.cards.codes.fields.code_format.code_format_number', this.hass.language)}
            </ha-button>
            <ha-button
              appearance="${this.data.code_format == 'text' ? 'filled' : 'plain'}"
              variant="${this.data.code_format == 'text' ? 'brand' : 'neutral'}"
          : ''
        }"
              @click=${() => {
          this.saveData({ code_format: 'text' });
        }}
              ?disabled=${!codesInUse}
            >
              ${localize('panels.codes.cards.codes.fields.code_format.code_format_text', this.hass.language)}
            </ha-button>
          </alarmo-settings-row>
        </ha-card>

        ${this.usersPanel()}
        ${this.editing
          ? nothing
          : html`<alarm-view-connections .hass=${this.hass} .narrow=${this.narrow} embedded></alarm-view-connections>`}
      `;
    }
  }

  /** ext: the user editor opens in place, under the Users header (not above the page) */
  private get editing() {
    return this.path.subpage == 'new_user' || !!this.path.params.edit_user;
  }

  private renderEditor() {
    if (this.path.subpage == 'new_user')
      return html`<user-editor-card .hass=${this.hass} .narrow=${this.narrow}></user-editor-card>`;
    return html`<user-editor-card .hass=${this.hass} .narrow=${this.narrow} item=${this.path.params.edit_user!}></user-editor-card>`;
  }

  protected updated() {
    // bring the editor into view when it opens
    const ed = this.shadowRoot?.querySelector('user-editor-card') as HTMLElement | null;
    if (ed && !ed.dataset.scrolled) {
      ed.dataset.scrolled = '1';
      ed.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  usersPanel() {
    if (!this.hass) return html``;

    const users = Object.values(this.users);
    users.sort(sortAlphabetically);

    const columns: Dictionary<TableColumn> = {
      icon: {
        width: '40px',
      },
      name: {
        title: this.hass.localize('ui.common.name'),
        width: '40%',
        grow: true,
        text: true,
      },
      code_format: {
        title: localize('panels.codes.cards.codes.fields.code_format.heading', this.hass.language),
        width: '120px',
        hide: this.narrow,
        text: true,
      },
      locks: {
        title: 'Lock slots',
        width: '22%',
        hide: this.narrow,
        text: true,
      },
      keypad: {
        title: 'At the lock',
        width: '28%',
        hide: this.narrow,
        text: true,
      },
      enabled: {
        title: localize('common.enabled', this.hass.language),
        width: '68px',
        align: 'center',
      },
    };

    const data = users.map(item => {
      const output: TableData = {
        id: item.user_id!,
        icon: html`
          <ha-icon icon="mdi:account-outline" class="${item.enabled ? '' : 'disabled'}"></ha-icon>
        `,
        name: html`
          <span class="${item.enabled ? '' : 'disabled'}">
            ${prettyPrint(item.name)}
          </span>
        `,
        code_format: html`
          <span class="${item.enabled ? '' : 'disabled'}">
          ${item.code_format == 'number'
            ? prettyPrint(
              localize('panels.codes.cards.codes.fields.code_format.code_format_number', this.hass!.language)
            )
            : item.code_format == 'text'
              ? prettyPrint(localize('panels.codes.cards.codes.fields.code_format.code_format_text', this.hass!.language))
              : this.hass!.localize('state.default.unknown')
          }
          </span>
        `,
        locks: html`${this.lockLinks
          .filter(l => l.user_id === item.user_id)
          .map(l => `${(this.hass!.states[l.entity_id]?.attributes.friendly_name as string) || l.entity_id} ${l.slot}`)
          .join(', ')}`,
        keypad: html`${(() => {
          const a = this.lockActions[item.user_id!] || {};
          const lockOnly = !item.can_arm && !item.can_disarm;
          const brief = (x?: { house_mode: string | null; targets: Record<string, string> }) =>
            [x && x.house_mode ? `House Mode ${x.house_mode}` : '', x && Object.keys(x.targets).length ? `${Object.keys(x.targets).length} partition target(s)` : '']
              .filter(Boolean)
              .join(' + ');
          const parts = [
            !isEmptyAction(a.unlock) ? `unlock → ${brief(a.unlock)}` : '',
            !isEmptyAction(a.lock) ? `lock → ${brief(a.lock)}` : '',
          ].filter(Boolean);
          return `${lockOnly ? 'lock-only' : ''}${lockOnly && parts.length ? ' · ' : ''}${parts.join(' · ')}`;
        })()}`,
        enabled: html`
          <ha-switch
            @click=${(ev: Event) => ev.stopPropagation()}
            ?checked=${item.enabled}
            @change=${(ev: Event) => this.toggleEnabled(ev, item.user_id!)}
          ></ha-switch>
        `,
      };
      return output;
    });

    return html`
      <ha-card>${sectionHead(localize('panels.codes.cards.user_management.title', this.hass.language), 'settings')}
        <div class="card-content">
          ${localize('panels.codes.cards.user_management.description', this.hass.language)}
        </div>
        <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
          <ha-button appearance="plain" ?disabled=${this.editing} @click=${this.addUserClick}>
            ${localize('panels.codes.cards.user_management.actions.new_user', this.hass.language)}
          </ha-button>
        </div>
        ${this.editing ? html`<div style="padding:0 8px 8px">${this.renderEditor()}</div>` : nothing}

        <alarmo-table
          style=${this.editing ? 'display:none' : ''}
          ?selectable=${true}
          .columns=${columns}
          .data=${data}
          @row-click=${(ev: CustomEvent) => {
        const id = String(ev.detail.id);
        navigate(this, exportPath('codes', { params: { edit_user: id } }), true);
      }}
        >
          ${localize('panels.codes.cards.user_management.no_items', this.hass.language)}
        </alarmo-table>
      </ha-card>
    `;
  }

  addUserClick() {
    navigate(this, exportPath('codes', 'new_user'), true);
  }

  saveData(changes: Partial<AlarmoConfig>) {
    if (!this.hass) return;

    this.data = {
      ...this.data,
      ...changes,
    };

    saveConfig(this.hass, this.data)
      .catch(e => handleError(e, this.shadowRoot!.querySelector('ha-card') as HTMLElement))
      .then();
  }

  toggleEnabled(ev: Event, id: string) {
    const enabled = (ev.target as HTMLInputElement).checked;
    const card = this.shadowRoot!.querySelector('ha-card') as HTMLElement;
    const linked = this.lockLinks.filter(l => l.user_id === id).length;
    saveUser(this.hass!, { user_id: id, enabled: enabled })
      .catch(e => handleError(e, card))
      .then(() => {
        // ext: a disabled user's code can stay on the locks, or be cleared
        if (!enabled && linked && confirm(`Also clear this user's code from ${linked} linked lock slot(s)?`))
          clearCodes(this.hass!, id).catch(e => handleError(e, card));
      });
  }

  static styles = commonStyle;
}
