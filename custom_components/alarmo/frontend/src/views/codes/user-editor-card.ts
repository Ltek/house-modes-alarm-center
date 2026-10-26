// User editor (Users, Codes, Keypads tab), ext layout: one card with sections
//   USER (name, code) · ALARMO (what the code can do, partitions, override) · LOCKS and AT THE LOCK (lock slots,
//   keypad actions — the embedded alarmo-ext-user-locks) · one Save at the bottom.
// An admin can set a new code without the old one (alarmo/ext/user/set_code).
import { LitElement, html, CSSResultGroup, css, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { mdiClose } from '@mdi/js';
import { commonStyle } from '../../styles';
import { AlarmoArea, AlarmoUser, Dictionary, HomeAssistant } from '../../types';
import { fetchUsers, saveUser, deleteUser, fetchAreas } from '../../data/websockets';
import { showErrorDialog, handleError, sortAlphabetically, navigate } from '../../helpers';
import { exportPath } from '../../common/navigation';
import { roleChip } from '../ext/page-intro';
import { extStyles } from '../ext/ext-styles';
import '../ext/user-locks-card';
import '../ext/reveal-code';
import type { UserLocksCard } from '../ext/user-locks-card';
import { clearCodes, setUserCode } from '../../data/locks';
import { wsErrorMessage } from '../../data/ext-websockets';

type Access = 'arm_disarm' | 'arm' | 'disarm' | 'none';
const ACCESS: { id: Access; label: string; hint: string }[] = [
  { id: 'arm_disarm', label: 'arm and disarm', hint: 'a household member' },
  { id: 'arm', label: 'arm only', hint: 'can lock up, but not turn the alarm off' },
  { id: 'disarm', label: 'disarm only', hint: 'rarely needed' },
  { id: 'none', label: 'nothing (lock only)', hint: 'the code works at the locks and for their keypad actions only' },
];
const accessOf = (u: Partial<AlarmoUser>): Access =>
  u.can_arm && u.can_disarm ? 'arm_disarm' : u.can_arm ? 'arm' : u.can_disarm ? 'disarm' : 'none';
const flagsOf = (a: Access) => ({ can_arm: a === 'arm_disarm' || a === 'arm', can_disarm: a === 'arm_disarm' || a === 'disarm' });

@customElement('user-editor-card')
export class UserEditorCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property() item?: string;

  @state() private data: Partial<AlarmoUser> = { enabled: true, can_arm: true, can_disarm: true, is_override_code: false, area_limit: [] };
  @state() private code = '';
  @state() private repeatCode = '';
  @state() private changeCode = false;
  @state() private busy = false;
  private users?: Dictionary<AlarmoUser>;
  private areas: Dictionary<AlarmoArea> = {};
  @state() private loaded = false;

  async firstUpdated() {
    this.users = await fetchUsers(this.hass);
    this.areas = await fetchAreas(this.hass);
    if (this.item && this.users[this.item]) {
      const u = this.users[this.item];
      this.data = { ...u, area_limit: (u.area_limit || []).filter(a => a in this.areas) };
      delete (this.data as any).code;
    }
    this.changeCode = !this.item;
    this.loaded = true;
  }

  private get areaOptions() {
    return Object.values(this.areas)
      .map(a => ({ value: a.area_id, name: a.name }))
      .sort(sortAlphabetically);
  }

  private get lockCard(): UserLocksCard | null {
    return this.shadowRoot?.querySelector('alarmo-ext-user-locks') as UserLocksCard | null;
  }

  private set(changes: Partial<AlarmoUser>) {
    this.data = { ...this.data, ...changes };
  }

  render() {
    if (!this.loaded) return html``;
    const access = accessOf(this.data);
    const multi = this.areaOptions.length >= 2;
    const limit = this.data.area_limit || [];
    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">${this.item ? `Edit user '${this.users![this.item]?.name || ''}'` : 'New user'}</div>
          ${roleChip('settings')}
          <ha-icon-button .path=${mdiClose} .label=${'Close'} @click=${this.cancelClick}></ha-icon-button>
        </div>

        <div class="sect">
          <h4 class="subhead">User</h4>
          <div class="field-row">
            <label for="name">Name</label>
            <input id="name" type="text" .value=${this.data.name || ''} @input=${(e: any) => this.set({ name: e.target.value })} />
          </div>
          <div class="field-row">
            <label><input type="checkbox" .checked=${this.data.enabled !== false} @change=${(e: any) => this.set({ enabled: e.target.checked })} />
              Enabled</label>
            <span class="secondary" style="display:inline">a disabled user's code works nowhere (Alarmo or the locks' keypad actions)</span>
          </div>
          ${this.changeCode
            ? html`<div class="field-row">
                  <label for="code">${this.item ? 'New code' : 'Code'}</label>
                  <input id="code" type="password" autocomplete="new-password" .value=${this.code} @input=${(e: any) => (this.code = e.target.value.trim())} />
                  <label for="code2">Repeat</label>
                  <input id="code2" type="password" autocomplete="new-password" .value=${this.repeatCode} @input=${(e: any) => (this.repeatCode = e.target.value.trim())} />
                  ${this.item ? html`<button class="link" @click=${() => { this.changeCode = false; this.code = this.repeatCode = ''; }}>keep the current code</button>` : nothing}
                </div>
                <div class="secondary" style="padding:0 6px">At least 4 characters; digits only for lock keypads. Codes are stored only hashed.</div>`
            : html`<div class="field-row">
                <span>Code</span>
                <alarmo-ext-reveal-code .hass=${this.hass} .userId=${this.item!}></alarmo-ext-reveal-code>
                <ha-button appearance="plain" @click=${() => (this.changeCode = true)}>Change code</ha-button>
              </div>`}
          <div class="field-row">
            <label for="access">In Alarmo, this code can</label>
            <select id="access" @change=${(e: any) => this.set(flagsOf(e.target.value))}>
              ${ACCESS.map(a => html`<option value=${a.id} ?selected=${a.id === access}>${a.label}</option>`)}
            </select>
            <span class="secondary" style="display:inline">${ACCESS.find(a => a.id === access)!.hint}</span>
          </div>
          ${multi && access !== 'none'
            ? html`<div class="field-row">
                <span>Partitions</span>
                ${this.areaOptions.map(a => {
                  const on = !limit.length || limit.includes(a.value);
                  return html`<label><input type="checkbox" .checked=${on} @change=${(e: any) => this.toggleArea(a.value, e.target.checked)} />${a.name}</label>`;
                })}
              </div>`
            : nothing}
          <div class="field-row">
            <label><input type="checkbox" .checked=${!!this.data.is_override_code} @change=${(e: any) => this.set({ is_override_code: e.target.checked })} />
              Override code</label>
            <span class="secondary" style="display:inline">arms even with open zones (force arm)</span>
          </div>
        </div>

        <alarmo-ext-user-locks
          embedded
          .hass=${this.hass}
          .userId=${this.item}
          .permissions=${{ enabled: this.data.enabled !== false, can_arm: !!this.data.can_arm, can_disarm: !!this.data.can_disarm, area_limit: limit }}
          @grant=${(e: CustomEvent) => this.set(e.detail)}
        ></alarmo-ext-user-locks>

        <div class="card-actions">
          <ha-button ?disabled=${this.busy} @click=${this.saveClick}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          <ha-button appearance="plain" @click=${this.cancelClick}>Cancel</ha-button>
          <span style="flex:1"></span>
          ${this.item ? html`<ha-button appearance="plain" variant="danger" @click=${this.deleteClick}>Delete user</ha-button>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private toggleArea(id: string, on: boolean) {
    const all = this.areaOptions.map(a => a.value);
    let limit = this.data.area_limit && this.data.area_limit.length ? [...this.data.area_limit] : [...all];
    limit = on ? [...new Set([...limit, id])] : limit.filter(a => a !== id);
    if (!limit.length) return; // at least one partition
    this.set({ area_limit: limit.length === all.length ? [] : limit });
  }

  private async deleteClick(ev: Event) {
    if (!this.item) return;
    if (!confirm(`Delete ${this.data.name}?`)) return;
    const card = this.lockCard;
    if (card && card.linkCount && confirm(`Also clear this user's code from ${card.linkCount} linked lock slot(s)? Cancel keeps the codes on the locks.`)) {
      try {
        await clearCodes(this.hass, this.item, true);
      } catch (e) {
        handleError(e, ev);
      }
    }
    deleteUser(this.hass, this.item)
      .catch(e => handleError(e, ev))
      .then(() => this.cancelClick());
  }

  private async saveClick(ev: Event) {
    const d = this.data;
    if (!d.name || !d.name.trim()) return showErrorDialog(ev, 'Enter a name.');
    if (this.changeCode) {
      if (this.code.length < 4) return showErrorDialog(ev, 'The code needs at least 4 characters.');
      if (this.code !== this.repeatCode) return showErrorDialog(ev, 'The two codes are different.');
    }
    const wasEnabled = this.item && this.users ? this.users[this.item]?.enabled !== false : false;
    const payload: Partial<AlarmoUser> = {
      name: d.name.trim(),
      enabled: d.enabled !== false,
      can_arm: !!d.can_arm,
      can_disarm: !!d.can_disarm,
      is_override_code: !!d.is_override_code,
      area_limit: d.area_limit || [],
    };
    this.busy = true;
    try {
      let uid = this.item;
      if (uid) {
        const res = await saveUser(this.hass, { ...payload, user_id: uid });
        if (!res || !res.success) throw new Error((res && res.error) || 'unknown error');
        if (this.changeCode) await setUserCode(this.hass, uid, this.code);
      } else {
        const res = await saveUser(this.hass, { ...payload, code: this.code });
        if (!res || !res.success) throw new Error((res && res.error) || 'unknown error');
        const users = await fetchUsers(this.hass);
        uid = Object.values(users).find(u => u.name === payload.name)?.user_id;
      }
      const card = this.lockCard;
      if (uid && card) {
        const disabledNow = wasEnabled && payload.enabled === false;
        if (disabledNow && card.linkCount && confirm(`This user is now disabled. Also clear the code from ${card.linkCount} linked lock slot(s)?`))
          await clearCodes(this.hass, uid);
        const problems = await card.applyAfterSave(uid, !disabledNow && this.changeCode ? this.code : undefined);
        if (problems.length) showErrorDialog(ev, `Saved, but the locks were not all updated: ${problems.join('; ')}`);
      }
      this.cancelClick();
    } catch (err) {
      showErrorDialog(ev, wsErrorMessage(err));
    } finally {
      this.busy = false;
    }
  }

  private cancelClick() {
    navigate(this, exportPath('codes'), true);
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      ${extStyles}
      :host {
        padding: 0;
      }
      .sect {
        padding: 4px 16px 8px;
        border-top: 1px solid var(--divider-color);
      }
      .sect .subhead {
        margin: 10px 0 4px;
      }
      .card-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      input[type='checkbox'] {
        margin-right: 6px;
      }
    `;
  }
}
