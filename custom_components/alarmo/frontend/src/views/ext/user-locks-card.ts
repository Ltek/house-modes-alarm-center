// User editor (Users, Codes, Keypads tab): the User's lock code slots and keypad actions.
// Works for new and existing users; everything here is applied by the editor's Save (applyAfterSave).
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { HouseInfo, fetchHouse } from '../../data/house';
import {
  LockInfo,
  LockRead,
  LockUser,
  SYNC_COLORS,
  SYNC_LABELS,
  UserActions,
  actionWarnings,
  fetchLockSettings,
  fetchUserLocks,
  linkSlot,
  syncUser,
  readLock,
  saveUserActions,
  neededPermission,
} from '../../data/locks';
import './reveal-code';
import { wsErrorMessage } from '../../data/ext-websockets';
import { extStyles } from './ext-styles';
import { entityBadge, sectionHead } from './page-intro';
import './keypad-action-editor';

type LinkRow = { entity_id: string; slot: number; status?: string | null; pending?: 'add' | 'remove' };

@customElement('alarmo-ext-user-locks')
export class UserLocksCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  /** Alarmo user_id; undefined while creating a user */
  @property() userId?: string;
  /** read by the user editor on save */
  @property({ type: Boolean }) pushOnSave = true;
  /** inside the user editor's card (no own card, subheads instead) */
  @property({ type: Boolean, reflect: true }) embedded = false;
  /** the editor's current (unsaved) permissions, for the warnings */
  @property({ attribute: false }) permissions?: Pick<LockUser, 'enabled' | 'can_arm' | 'can_disarm' | 'area_limit'>;

  @state() private links: LinkRow[] = [];
  @state() private draft: UserActions = {};
  @state() private house?: HouseInfo;
  @state() private user?: LockUser;
  @state() private locks: LockInfo[] = [];
  @state() private reads: Record<string, LockRead> = {};
  @state() private taken: Record<string, string> = {};
  @state() private users: LockUser[] = [];
  @state() private pickLock = '';
  @state() private pickSlot = '';
  @state() private error = '';
  @state() private loading = true;
  @state() private writing = false;

  /** linked slots after Save (existing + pending adds - pending removes) */
  /** write the code now (copied from a linked slot that has it), then check the locks again */
  private async writeNow() {
    if (!this.userId) return;
    this.writing = true;
    this.error = '';
    try {
      const res = await syncUser(this.hass, this.userId);
      if (res.needs_code) this.error = "No linked slot holds this user's code yet. Use Change code above; the new code is written to the slots on Save.";
      else {
        const bad = res.results.filter(r => r.result === 'error');
        if (bad.length) this.error = bad.map(b => `${b.entity_id} slot ${b.slot}: ${b.error}`).join('; ');
      }
      // locks confirm a new code a few seconds later
      await new Promise(res2 => setTimeout(res2, 4000));
      await this.recheck();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.writing = false;
    }
  }

  private async recheck() {
    if (!this.userId) return;
    const res = await fetchUserLocks(this.hass, this.userId);
    const pending = this.links.filter(l => l.pending);
    this.links = [...res.links.map(l => ({ entity_id: l.entity_id, slot: l.slot, status: l.status })), ...pending.filter(p => p.pending === 'add')]
      .map(l => (pending.some(p => p.pending === 'remove' && p.entity_id === l.entity_id && p.slot === l.slot) ? { ...l, pending: 'remove' as const } : l));
    this.reads = {};
    if (this.pickLock) this.readSlots(this.pickLock);
  }

  get linkCount() {
    return this.links.filter(l => l.pending !== 'remove').length;
  }

  firstUpdated() {
    this.load();
  }

  private async load() {
    this.loading = true;
    try {
      const [house, all] = await Promise.all([fetchHouse(this.hass), fetchLockSettings(this.hass)]);
      this.house = house;
      this.locks = all.locks;
      this.users = all.users;
      this.taken = {};
      all.settings.links.forEach(l => (this.taken[`${l.entity_id}:${l.slot}`] = l.user_id));
      if (!this.pickLock) this.pickLock = all.locks[0]?.entity_id || '';
      if (this.userId) {
        const res = await fetchUserLocks(this.hass, this.userId);
        this.links = res.links.map(l => ({ entity_id: l.entity_id, slot: l.slot, status: l.status }));
        this.draft = JSON.parse(JSON.stringify(res.actions || {}));
        this.user = all.users.find(u => u.user_id === this.userId);
      }
      if (this.pickLock) this.readSlots(this.pickLock);
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  private async readSlots(entity_id: string) {
    if (this.reads[entity_id]) return;
    try {
      const r = await readLock(this.hass, entity_id);
      this.reads = { ...this.reads, [entity_id]: r };
    } catch (_e) {
      /* slot list stays a number box */
    }
  }

  private userName(id?: string) {
    return this.users.find(u => u.user_id === id)?.name || 'another user';
  }

  private addLink() {
    const slot = parseInt(this.pickSlot, 10);
    if (!this.pickLock || !(slot > 0)) return;
    const existing = this.links.find(l => l.entity_id === this.pickLock && l.slot === slot);
    if (existing) {
      this.links = this.links.map(l => (l === existing ? { ...l, pending: undefined } : l));
    } else this.links = [...this.links, { entity_id: this.pickLock, slot, pending: 'add' }];
    this.pickSlot = '';
  }

  private removeLink(row: LinkRow) {
    this.links = row.pending === 'add' ? this.links.filter(l => l !== row) : this.links.map(l => (l === row ? { ...l, pending: 'remove' } : l));
  }

  /** Called by the user editor after the user was saved: links, keypad actions, code on the locks. */
  async applyAfterSave(userId: string, newCode?: string): Promise<string[]> {
    const problems: string[] = [];
    try {
      for (const l of this.links.filter(x => x.pending === 'remove')) await linkSlot(this.hass, l.entity_id, l.slot, null);
      for (const l of this.links.filter(x => x.pending === 'add')) await linkSlot(this.hass, l.entity_id, l.slot, userId);
      await saveUserActions(this.hass, userId, this.draft);
      if (this.pushOnSave && this.linkCount) {
        // new code typed → write it; otherwise copy the code from a linked slot that already holds it
        const res = await syncUser(this.hass, userId, newCode);
        if (res.needs_code)
          problems.push("no linked slot holds this user's code yet, so it could not be copied: use Change code (the new code is written on Save)");
        res.results.filter(r => r.result === 'error').forEach(r => problems.push(`${r.entity_id} slot ${r.slot}: ${r.error}`));
      }
    } catch (err) {
      problems.push(wsErrorMessage(err));
    }
    return problems;
  }

  render() {
    const partitions = (this.house?.targets || []).filter(t => t.key !== 'master');
    const modes = this.house?.settings.modes || [];
    const houseOn = !!this.house?.settings.enabled;
    const lockName = (eid: string) => this.locks.find(l => l.entity_id === eid)?.name || (this.hass.states[eid]?.attributes.friendly_name as string) || eid;
    const read = this.reads[this.pickLock];
    const mine = (eid: string, slot: number) => this.links.some(l => l.entity_id === eid && l.slot === slot && l.pending !== 'remove');
    const slotOptions = read
      ? read.slots.filter(s => !mine(this.pickLock, s.slot))
      : [];
    const who = this.permissions
      ? ({ user_id: this.userId || '', name: '', ...this.permissions } as LockUser)
      : this.user;
    const warnings = [...actionWarnings(who, this.draft.unlock), ...actionWarnings(who, this.draft.lock)];
    const body = html`
        ${this.error ? html`<div class="notice error" style="margin:0 16px 12px">${this.error}</div>` : nothing}
        ${this.embedded ? html`<h4 class="subhead">Locks</h4>` : nothing}
        ${this.loading
          ? html`<div class="empty">Reading the locks…</div>`
          : html`
              ${this.locks.length
                ? html`<div class="toolbar">
                    <label>Lock
                      <select @change=${(e: any) => { this.pickLock = e.target.value; this.pickSlot = ''; this.readSlots(this.pickLock); }}>
                        ${this.locks.map(l => html`<option value=${l.entity_id} ?selected=${l.entity_id === this.pickLock}>${l.name}</option>`)}
                      </select>
                    </label>
                    <label>Slot
                      ${read && read.slots.length
                        ? html`<select @change=${(e: any) => (this.pickSlot = e.target.value)}>
                            <option value="" ?selected=${!this.pickSlot}>choose…</option>
                            ${slotOptions.map(s => {
                              const owner = this.taken[`${this.pickLock}:${s.slot}`];
                              const what = owner && owner !== this.userId ? `linked to ${this.userName(owner)}` : s.in_use ? 'in use, no user' : 'empty';
                              return html`<option value=${s.slot} ?selected=${String(s.slot) === this.pickSlot}>${s.slot} (${what})</option>`;
                            })}
                          </select>`
                        : html`<input type="number" min="1" max="250" style="width:80px" aria-label="Slot number" .value=${this.pickSlot}
                            @input=${(e: any) => (this.pickSlot = e.target.value)} />`}
                    </label>
                    <ha-button appearance="plain" ?disabled=${!this.pickSlot} @click=${this.addLink}>
                      <ha-icon slot="start" icon="mdi:plus"></ha-icon>Add lock slot</ha-button>
                    <label><input type="checkbox" .checked=${this.pushOnSave} @change=${(e: any) => (this.pushOnSave = e.target.checked)} />
                      On Save, write this user's code to the linked slots</label>
                    ${this.userId
                      ? html`<ha-button appearance="plain" ?disabled=${this.writing} @click=${() => this.recheck()}>
                          <ha-icon slot="start" icon="mdi:refresh"></ha-icon>Check the locks again</ha-button>`
                      : nothing}
                  </div>`
                : html`<div class="empty">No Z-Wave JS locks found.</div>`}
              ${this.links.length
                ? html`<div class="table-wrap"><table>
                    <thead><tr><th class="icon"></th><th>Lock</th><th>Slot</th><th>Code</th><th></th></tr></thead>
                    <tbody>${this.links.map(l => {
                      const owner = this.taken[`${l.entity_id}:${l.slot}`];
                      const status = l.pending === 'add' ? 'new' : l.pending === 'remove' ? 'removed' : 'unchanged';
                      return html`<tr class=${l.pending === 'remove' ? 'status-removed' : ''}>
                        <td class="icon">${entityBadge(this.hass, l.entity_id, status)}</td>
                        <td>${lockName(l.entity_id)}<span class="secondary">${l.entity_id}</span></td>
                        <td>${l.slot}</td>
                        <td>${l.pending === 'add'
                          ? html`<span class="secondary" style="display:inline">linked on Save${owner && owner !== this.userId ? ` (moves it from ${this.userName(owner)})` : ''}</span>`
                          : l.pending === 'remove'
                            ? html`<span class="secondary" style="display:inline">unlinked on Save (the code stays on the lock)</span>`
                            : html`<span style=${`color:${SYNC_COLORS[(l.status || 'unknown') as keyof typeof SYNC_COLORS]}`}>${SYNC_LABELS[(l.status || 'unknown') as keyof typeof SYNC_LABELS]}</span>
                                <div><alarmo-ext-reveal-code .hass=${this.hass} .entityId=${l.entity_id} .slotNo=${l.slot}></alarmo-ext-reveal-code></div>
                                ${l.status && l.status !== 'in_sync' && l.status !== 'no_user'
                                  ? html`<button class="link" ?disabled=${this.writing} @click=${this.writeNow}>${this.writing ? 'Writing…' : 'Write the user code'}</button>`
                                  : nothing}`}</td>
                        <td>${l.pending === 'remove'
                          ? html`<button class="link" @click=${() => (this.links = this.links.map(x => (x === l ? { ...x, pending: undefined } : x)))}>undo</button>`
                          : html`<ha-icon-button .label=${'Unlink slot'} @click=${() => this.removeLink(l)}><ha-icon icon="mdi:link-off"></ha-icon></ha-icon-button>`}</td>
                      </tr>`;
                    })}</tbody>
                  </table></div>`
                : nothing}
              <div class="action-stack">
                <alarmo-ext-keypad-action
                  .label=${'When this code unlocks a lock'}
                  .action=${this.draft.unlock}
                  .modes=${modes}
                  .houseEnabled=${houseOn}
                  .partitions=${partitions}
                  @value-changed=${(e: CustomEvent) => (this.draft = { ...this.draft, unlock: e.detail.value })}
                ></alarmo-ext-keypad-action>
                <alarmo-ext-keypad-action
                  .label=${'When this code locks a lock (keypad lock)'}
                  .action=${this.draft.lock}
                  .modes=${modes}
                  .houseEnabled=${houseOn}
                  .partitions=${partitions}
                  @value-changed=${(e: CustomEvent) => (this.draft = { ...this.draft, lock: e.detail.value })}
                ></alarmo-ext-keypad-action>
              </div>
              ${warnings.map(w => {
                const need = neededPermission(w);
                return html`<div class="notice warn" style="margin:0 16px 8px">${w} That part will be skipped.
                  ${need && this.permissions
                    ? html`<button class="link" @click=${() => this.dispatchEvent(new CustomEvent('grant', { detail: { ...this.permissions, ...need } }))}>
                        Allow it (${need.can_arm ? 'arm' : 'disarm'} in Alarmo)</button>`
                    : nothing}
                </div>`;
              })}
              <div class="secondary" style="padding:0 16px 12px">Saved with the user (Save below). Most locks only report the
                code for an unlock; Schlage's outside button locks without a code (set that per lock below the users).</div>
            `}
    `;
    if (this.embedded) return html`<div class="sect">${body}</div>`;
    return html`<ha-card>${sectionHead('Lock codes and keypad actions', 'settings')}${body}</ha-card>`;
  }

  static styles = [
    extStyles,
    css`
      :host([embedded]) {
        padding: 0;
      }
      :host([embedded]) .sect {
        border-top: 1px solid var(--divider-color);
        padding: 4px 0 4px;
      }
      :host([embedded]) .subhead {
        margin: 10px 16px 4px;
      }
      :host([embedded]) .card-content.desc {
        display: none;
      }
      .action-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 16px 12px;
        max-width: 640px;
      }
    `,
  ];
}
