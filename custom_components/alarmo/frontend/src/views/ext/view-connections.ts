// Users, Codes, Keypads tab (lower part): one collapsible card per Z-Wave lock, one row per code slot
// (Alarmo User, code check, what the code does). Unlinked codes are flagged with a one-click import.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { exportPath } from '../../common/navigation';
import { navigate } from '../../helpers';
import {
  API_LABELS,
  KeypadAction,
  LockRead,
  LockSettings,
  LockUser,
  SYNC_COLORS,
  SYNC_LABELS,
  describeAction,
  fetchLockSettings,
  importSlots,
  importable,
  linkSlot,
  readLock,
  saveLockAction,
  LegacySlot,
  fetchLegacy,
  migrateLegacy,
} from '../../data/locks';
import { KEYPAD_STATE_LABEL } from './keypad-action-editor';
import './keypad-action-editor';
import './reveal-code';
import {
  DetectedLock,
  HouseSettings,
  fetchHouse,
  fetchLocks,
} from '../../data/house';
import { extStyles } from './ext-styles';
import { entityBadge, sectionHead } from './page-intro';
import { HouseInfo } from '../../data/house';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

@customElement('alarm-view-connections')
export class AlarmViewConnections extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private saved?: HouseSettings;
  @state() private draft?: HouseSettings;
  @state() private locks: DetectedLock[] = [];
  @state() private error = '';
  @state() private busy = false;
  @state() private lockSettings?: LockSettings;
  @state() private users: LockUser[] = [];
  @state() private reads: Record<string, LockRead | 'reading' | string> = {};
  @state() private names: Record<string, string> = {};
  @state() private lockActionDraft: Record<string, KeypadAction | undefined> = {};
  @state() private houseInfo?: HouseInfo;
  @state() private openLocks: Record<string, boolean> = {};
  @state() private legacy: LegacySlot[] = [];

  firstUpdated() {
    this.refresh(true);
  }

  private async refresh(reset = false) {
    try {
      const [info, locks, ls] = await Promise.all([fetchHouse(this.hass), fetchLocks(this.hass), fetchLockSettings(this.hass)]);
      this.saved = info.settings;
      this.houseInfo = info;
      this.locks = locks.locks;
      this.lockSettings = ls.settings;
      this.users = ls.users;
      if (reset) this.lockActionDraft = { ...ls.settings.lock_actions };
      if (reset) locks.locks.forEach(l => this.read(l.entity_id));
      this.legacy = (await fetchLegacy(this.hass)).legacy;
      if (reset || !this.draft) this.draft = clone(info.settings);
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }


  render() {
    if (!this.draft) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      ${this.renderCodes()}
    `;
  }

  private async migrate() {
    if (!window.confirm(`Move ${this.legacy.length} old "code slot → House Mode" setting(s) to Alarmo Users? Each slot gets a lock-only user (or the user with the same code) whose unlock action is that House Mode. A backup is in Backup if you need it.`)) return;
    this.busy = true;
    try {
      const res = await migrateLegacy(this.hass);
      const bad = res.results.filter(r => r.result !== 'moved');
      toast(this, `${res.results.length - bad.length} moved to users${bad.length ? `, ${bad.length} failed` : ''}.`);
      if (bad.length) this.error = bad.map(b => `${b.lock_name} slot ${b.slot}: ${b.error}`).join('\n');
      await this.refresh(true);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  // ------------------------------------------------------------ lock codes ↔ users

  private async read(entity_id: string) {
    this.reads = { ...this.reads, [entity_id]: 'reading' };
    try {
      const res = await readLock(this.hass, entity_id);
      this.reads = { ...this.reads, [entity_id]: res };
    } catch (err) {
      this.reads = { ...this.reads, [entity_id]: wsErrorMessage(err) };
    }
  }

  private userName(id: string | null) {
    const u = this.users.find(x => x.user_id === id);
    return u ? u.name : id ? 'removed user' : '';
  }

  private async link(entity_id: string, slot: number, user_id: string | null) {
    try {
      this.lockSettings = (await linkSlot(this.hass, entity_id, slot, user_id)).settings;
      toast(this, user_id ? `Slot ${slot} linked to ${this.userName(user_id)}.` : `Slot ${slot} unlinked.`);
      await this.read(entity_id);
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async doImport(entity_id: string, read: LockRead) {
    const rows = importable(read.slots);
    if (!rows.length) return;
    this.busy = true;
    try {
      const res = await importSlots(
        this.hass,
        entity_id,
        rows.map(r => ({ slot: r.slot, name: this.names[`${entity_id}:${r.slot}`] || r.lock_name || undefined }))
      );
      const created = res.results.filter(r => r.result === 'created').length;
      const linked = res.results.filter(r => r.result === 'linked').length;
      const failed = res.results.filter(r => r.result === 'error');
      toast(this, `${created} user(s) created, ${linked} linked to existing users${failed.length ? `, ${failed.length} failed` : ''}.`);
      if (failed.length) this.error = failed.map(f => `Slot ${f.slot}: ${f.error}`).join('\n');
      await this.refresh();
      await this.read(entity_id);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async saveLockAct(entity_id: string) {
    try {
      this.lockSettings = (await saveLockAction(this.hass, entity_id, this.lockActionDraft[entity_id] || null)).settings;
      toast(this, 'Keypad lock action saved.');
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private renderCodes() {
    const ls = this.lockSettings;
    const modes = this.saved?.modes || [];
    const partitions = (this.houseInfo?.targets || []).filter(t => t.key !== 'master');
    const modeName = (id: string) => (modes.find(m => m.id === id) || { name: id }).name;
    const areaName = (id: string) => (partitions.find(p => p.key === id) || { name: id }).name;
    return html`
      <ha-card>${sectionHead('Keypads', 'settings')}
        <div class="card-content desc">
          <p>Each Z-Wave lock, with one row per code slot. A slot's code belongs to an Alarmo User; that user's keypad
            actions (a House Mode, Alarmo partition targets, or both) run when the code is used at the lock.</p>
          <ul>
            <li><strong>Import</strong> makes a <em>lock-only</em> user for each code that has no user yet: the code works at
              the lock and for its keypad actions, but cannot arm or disarm Alarmo until you allow it. A code that is
              already an Alarmo User's code is linked to that user instead.</li>
            <li><em>Code</em> compares the slot's code with the user's code (<em>Slot = User Code</em>). Alarmo stores codes only hashed. The eye
              shows a lock's code for 30 seconds, read from the lock right then; it is never stored.</li>
            <li>Click a user (above) to change its name, code, permissions, lock slots and keypad actions.</li>
          </ul>
        </div>
        ${this.legacy.length
          ? html`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${this.legacy.length} old "code slot → House Mode" setting(s)</strong> (${this.legacy.map(l => `${l.lock_name} slot ${l.slot}`).join(', ')})
              still work, but now belong on users.
              <div class="toolbar" style="padding:6px 0 0"><ha-button ?disabled=${this.busy} @click=${this.migrate}>Move them to users</ha-button></div>
            </div>`
          : nothing}
        ${!this.locks.length ? html`<div class="empty">No Z-Wave JS locks found.</div>` : nothing}
        ${this.locks.map(lock => {
          const rd = this.reads[lock.entity_id];
          const read = rd && typeof rd === 'object' ? rd : undefined;
          const toImport = read ? importable(read.slots) : [];
          const act = this.lockActionDraft[lock.entity_id];
          const actDirty = JSON.stringify(act || null) !== JSON.stringify((ls && ls.lock_actions[lock.entity_id]) || null);
          const linked = ls ? ls.links.filter(l => l.entity_id === lock.entity_id).length : 0;
          const okey = `codes:${lock.entity_id}`;
          const open = this.openLocks[okey] ?? false;
          return html`
            <details class="collapse" ?open=${open} @toggle=${(e: any) => (this.openLocks = { ...this.openLocks, [okey]: e.target.open })}>
            <summary>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
              ${entityBadge(this.hass, lock.entity_id)}
              <span class="collapse-title">${lock.name}</span>
              ${linked ? html`<span class="role">${linked} linked</span>` : nothing}
              ${toImport.length ? html`<span class="role" style="color:var(--warning-color,#ffa600);border-color:var(--warning-color,#ffa600)">${toImport.length} without user</span>` : nothing}
              <span class="secondary" style="display:inline">${lock.entity_id} · node ${lock.node_id ?? 'unknown'}${read ? ` · ${API_LABELS[read.api] || read.api}` : ''}</span>
            </summary>
            <div class="collapse-body">
            <div class="toolbar" style="padding:4px 0 8px">
              <ha-button appearance="plain" ?disabled=${rd === 'reading'} @click=${() => this.read(lock.entity_id)}>
                <ha-icon slot="start" icon="mdi:refresh"></ha-icon>${rd === 'reading' ? 'Reading…' : 'Read the lock again'}</ha-button>
              <ha-button ?disabled=${!toImport.length || this.busy} @click=${() => this.doImport(lock.entity_id, read!)}>
                <ha-icon slot="start" icon="mdi:account-multiple-plus"></ha-icon>Import ${toImport.length} code(s) as lock-only users</ha-button>
            </div>
            ${toImport.length
              ? html`<div class="notice warn" style="margin:0 0 8px">${toImport.length} code(s) on ${lock.name} have no user: slot
                  ${toImport.map(r => r.slot).join(', ')}. Type a name in the row if you like, then Import.</div>`
              : nothing}
            ${typeof rd === 'string' && rd !== 'reading' ? html`<div class="notice error" style="margin:0 16px 8px">${rd}</div>` : nothing}
            ${read && !read.readable
              ? html`<div class="notice warn" style="margin:0 16px 8px">The codes could not be read from this lock. You can still link slots to users by
                  number; the code check then shows "not readable".</div>`
              : nothing}
            ${read
              ? html`<div class="table-wrap"><table>
                  <thead><tr><th>Slot</th><th>On the lock</th><th>Alarmo User</th><th>Code</th><th>When this code is used</th></tr></thead>
                  <tbody>${read.slots.filter(r => r.in_use || r.user_id).map(r => {
                    const key = `${lock.entity_id}:${r.slot}`;
                    const acts = r.user_id && ls ? ls.actions[r.user_id] : undefined;
                    return html`<tr>
                      <td>${r.slot}</td>
                      <td>${r.in_use ? 'in use' : 'empty'}${r.lock_name ? html`<span class="secondary">${r.lock_name}</span>` : nothing}</td>
                      <td>
                        <select aria-label=${`Alarmo User for slot ${r.slot}`} @change=${(e: any) => this.link(lock.entity_id, r.slot, e.target.value || null)}>
                          <option value="" ?selected=${!r.user_id}>— not linked —</option>
                          ${this.users.map(u => html`<option value=${u.user_id} ?selected=${r.user_id === u.user_id}>${u.name}${u.enabled ? '' : ' (disabled)'}</option>`)}
                        </select>
                        ${!r.user_id && r.match_user_id
                          ? html`<button class="link" @click=${() => this.link(lock.entity_id, r.slot, r.match_user_id)}>Same code as ${this.userName(r.match_user_id)} — link</button>`
                          : nothing}
                        ${!r.user_id && !r.match_user_id && r.readable && r.in_use
                          ? html`<input placeholder="Name for import" aria-label=${`Name for slot ${r.slot}`} style="width:140px" .value=${this.names[key] || r.lock_name}
                              @input=${(e: any) => (this.names = { ...this.names, [key]: e.target.value })} />`
                          : nothing}
                      </td>
                      <td>${r.status ? html`<span style=${`color:${SYNC_COLORS[r.status]}`}>${SYNC_LABELS[r.status]}</span>` : html`<span class="secondary" style="display:inline">—</span>`}
                        ${r.in_use && r.readable ? html`<div><alarmo-ext-reveal-code .hass=${this.hass} .entityId=${lock.entity_id} .slotNo=${r.slot}></alarmo-ext-reveal-code></div>` : nothing}</td>
                      <td>${r.user_id
                        ? html`${describeAction(acts && acts.unlock, modeName, areaName, s => KEYPAD_STATE_LABEL[s] || s)}
                            <button class="link" @click=${() => navigate(this, exportPath('codes', { params: { edit_user: r.user_id! } }), true)}>edit</button>`
                        : html`<span class="secondary" style="display:inline">nothing (no user)</span>`}</td>
                    </tr>`;
                  })}</tbody>
                </table></div>`
              : rd === 'reading'
                ? html`<div class="empty">Reading the lock…</div>`
                : nothing}
            <div style="padding:8px 0 4px;max-width:640px">
              <alarmo-ext-keypad-action
                .label=${'Keypad lock without a code (e.g. Schlage outside button)'}
                .action=${act}
                .modes=${modes}
                .houseEnabled=${!!this.saved?.enabled}
                .partitions=${partitions}
                @value-changed=${(e: CustomEvent) => (this.lockActionDraft = { ...this.lockActionDraft, [lock.entity_id]: e.detail.value })}
              ></alarmo-ext-keypad-action>
              ${actDirty ? html`<div class="toolbar" style="padding:8px 0 0"><ha-button @click=${() => this.saveLockAct(lock.entity_id)}>Save keypad lock action</ha-button></div>` : nothing}
            </div>
            </div>
            </details>
          `;
        })}
      </ha-card>
    `;
  }

  static styles = extStyles;
}
