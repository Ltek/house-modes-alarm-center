import { LitElement, html, nothing, css } from 'lit';
import { extStyles } from '../ext/ext-styles';

/** Which sections of the tab are open (module-level: kept across re-renders and tab changes). */
const SEC_OPEN: Record<string, boolean> = {};
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
import { fetchConfig, fetchUsers, saveConfig, saveUser, deleteUser } from '../../data/websockets';
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
    const lang = this.hass.language;
    const d = this.data;
    const codesInUse = d.code_arm_required || d.code_disarm_required || d.code_mode_change_required;
    const req = [d.code_arm_required ? 'arming' : '', d.code_disarm_required ? 'disarming' : '', d.code_mode_change_required ? 'mode change' : '']
      .filter(Boolean)
      .join(', ');
    const fmt = d.code_format === 'text'
      ? localize('panels.codes.cards.codes.fields.code_format.code_format_text', lang)
      : localize('panels.codes.cards.codes.fields.code_format.code_format_number', lang);
    const check = (key: 'code_arm_required' | 'code_disarm_required' | 'code_mode_change_required') => html`
      <label class="uc-check"><input type="checkbox" class="cb" .checked=${!!d[key]}
          @change=${(ev: Event) => this.saveData({ [key]: (ev.target as HTMLInputElement).checked } as Partial<AlarmoConfig>)} />
        <span><strong>${localize(`panels.codes.cards.codes.fields.${key}.heading`, lang)}</strong>
          <span class="secondary">${localize(`panels.codes.cards.codes.fields.${key}.description`, lang)}</span></span></label>`;
    return html`
      <ha-card>${sectionHead(localize('panels.users_codes.title', lang), 'settings')}
        <div class="card-content desc">
          <p>The people who may use the alarm, their codes, and the Z-Wave lock keypads. A user's code can arm and disarm
            the alarm, and, used at a lock, run that user's keypad actions (a House Mode, partition targets, or both).</p>
        </div>
        ${this.sec('codes', 'Codes', `${req ? `required for ${req}` : 'not required'} · ${fmt}`, false, html`
          ${check('code_arm_required')} ${check('code_disarm_required')} ${check('code_mode_change_required')}
          <div class="uc-row">
            <span><strong>${localize('panels.codes.cards.codes.fields.code_format.heading', lang)}</strong>
              <span class="secondary">${localize('panels.codes.cards.codes.fields.code_format.description', lang)}</span></span>
            <span class="uc-chips">
              ${(['number', 'text'] as const).map(f => html`<button class="uc-chip ${d.code_format === f ? 'on' : ''}" ?disabled=${!codesInUse}
                aria-pressed=${d.code_format === f} @click=${() => this.saveData({ code_format: f })}>
                ${localize(`panels.codes.cards.codes.fields.code_format.code_format_${f}`, lang)}</button>`)}
            </span>
          </div>`)}
        ${this.sec('users', 'Users', this.usersSummary(), false, this.usersPanel())}
        ${this.editing
          ? nothing
          : this.sec('keypads', 'Keypads', 'Z-Wave lock code slots and keypad actions', false,
              html`<alarm-view-connections .hass=${this.hass} .narrow=${this.narrow} embedded></alarm-view-connections>`)}
      </ha-card>
    `;
  }

  /** A collapsible section of the tab (open state kept across re-renders). */
  private sec(key: string, title: string, summary: string, defOpen: boolean, body: unknown) {
    const open = key in SEC_OPEN ? SEC_OPEN[key] : defOpen || (key === 'users' && this.editing);
    return html`<details class="collapse uc-sec" ?open=${open || (key === 'users' && this.editing)}
        @toggle=${(e: Event) => (SEC_OPEN[key] = (e.target as HTMLDetailsElement).open)}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${title}</span>
        <span class="secondary" style="display:inline">${summary}</span>
      </summary>
      <div class="collapse-body">${body}</div>
    </details>`;
  }

  private usersSummary() {
    const users = Object.values(this.users);
    const on = users.filter(u => u.enabled).length;
    return `${users.length} user${users.length === 1 ? '' : 's'} · ${on} enabled`;
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
    const lang = this.hass.language;
    const fmt = (u: AlarmoUser) =>
      u.code_format === 'number'
        ? localize('panels.codes.cards.codes.fields.code_format.code_format_number', lang)
        : u.code_format === 'text'
          ? localize('panels.codes.cards.codes.fields.code_format.code_format_text', lang)
          : '';
    const access = (u: AlarmoUser) =>
      u.can_arm && u.can_disarm ? 'arms and disarms' : u.can_arm ? 'arms only' : u.can_disarm ? 'disarms only' : 'lock-only';
    const slots = (u: AlarmoUser) =>
      this.lockLinks
        .filter(l => l.user_id === u.user_id)
        .map(l => `${(this.hass!.states[l.entity_id]?.attributes.friendly_name as string) || l.entity_id} ${l.slot}`)
        .join(', ');
    const keypad = (u: AlarmoUser) => {
      const a = this.lockActions[u.user_id!] || {};
      const brief = (x?: { house_mode: string | null; targets: Record<string, string> }) =>
        [x && x.house_mode ? `House Mode ${x.house_mode}` : '', x && Object.keys(x.targets).length ? `${Object.keys(x.targets).length} partition target(s)` : '']
          .filter(Boolean)
          .join(' + ');
      return [!isEmptyAction(a.unlock) ? `unlock → ${brief(a.unlock)}` : '', !isEmptyAction(a.lock) ? `lock → ${brief(a.lock)}` : ''].filter(Boolean).join(' · ');
    };
    const edit = (u: AlarmoUser) => navigate(this, exportPath('codes', { params: { edit_user: u.user_id! } }), true);
    return html`
      <div class="uc-intro secondary">${localize('panels.codes.cards.user_management.description', lang)}</div>
      <ha-button ?disabled=${this.editing} @click=${this.addUserClick}>
        <ha-icon slot="start" icon="mdi:plus"></ha-icon>${localize('panels.codes.cards.user_management.actions.new_user', lang)}</ha-button>
      ${this.editing ? html`<div class="uc-editor">${this.renderEditor()}</div>` : nothing}
      ${this.editing
        ? nothing
        : users.length
          ? html`<div class="uc-list">${users.map(u => html`<div class="uc-user ${u.enabled ? '' : 'off'}">
              <ha-icon class="uc-icon" icon=${u.can_arm || u.can_disarm ? 'mdi:account-key-outline' : 'mdi:account-lock-outline'}></ha-icon>
              <div class="uc-name">
                <button class="link" @click=${() => edit(u)}>${prettyPrint(u.name)}</button>
                <span class="secondary">${[access(u), fmt(u), u.is_override_code ? 'override code' : '', slots(u) ? `lock slots ${slots(u)}` : '', keypad(u)]
                  .filter(Boolean)
                  .join(' · ')}</span>
              </div>
              <button class="uc-chip ${u.enabled ? 'on' : ''}" title=${u.enabled ? 'Enabled: click to disable' : 'Disabled: click to enable'}
                @click=${() => this.setUserEnabled(u.user_id!, !u.enabled)}>${u.enabled ? 'Enabled' : 'Disabled'}</button>
              <ha-icon-button .label=${'Edit'} title="Edit" @click=${() => edit(u)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
              <ha-icon-button class="uc-del" .label=${'Delete'} title="Delete" @click=${() => this.removeUser(u)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
            </div>`)}</div>`
          : html`<div class="empty">${localize('panels.codes.cards.user_management.no_items', lang)}</div>`}
    `;
  }

  private removeUser(u: AlarmoUser) {
    if (!window.confirm(`Delete the user "${u.name}"?`)) return;
    deleteUser(this.hass!, u.user_id!)
      .then(async () => (this.users = await fetchUsers(this.hass!)))
      .catch(e => handleError(e, this.shadowRoot!.querySelector('ha-card') as HTMLElement));
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

  setUserEnabled(id: string, enabled: boolean) {
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

  static styles = [
    commonStyle,
    extStyles,
    css`
      details.collapse.uc-sec {
        margin: 0 16px 12px;
      }
      .uc-check,
      .uc-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .uc-row {
        align-items: center;
        flex-wrap: wrap;
        border-bottom: none;
      }
      .uc-check input {
        margin-top: 2px;
        flex: none;
      }
      .uc-check > span,
      .uc-row > span:first-child {
        display: flex;
        flex-direction: column;
        flex: 1 1 260px;
      }
      .uc-chips {
        display: flex;
        gap: 6px;
      }
      .uc-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 2px 12px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }
      .uc-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .uc-chip[disabled] {
        opacity: 0.5;
        cursor: default;
      }
      .uc-intro {
        display: block;
        margin: 0 0 8px;
      }
      .uc-list {
        margin-top: 8px;
      }
      .uc-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-top: 1px solid var(--divider-color);
      }
      .uc-user.off .uc-name button,
      .uc-user.off .uc-icon {
        opacity: 0.55;
      }
      .uc-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .uc-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .uc-del:hover {
        color: var(--error-color);
      }
      .uc-editor {
        margin-top: 8px;
      }
    `,
  ];
}
