// House Mode Actions tab: one overview of every native automation, script and scene related to a House Mode
// (HA labels "House Mode: <mode>"), as a grid — rows = items, columns = House Modes — so overlaps show.
// Auto-detect suggests labels for automations/scripts that use the House Mode. Clicking a name opens HA's editor.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import {
  HouseActionItem,
  HouseActionsInfo,
  editorPath,
  fetchHouseActions,
  matchesFilter,
  setHouseActionModes,
  suggestedModes,
} from '../../data/house-actions';
import { extStyles } from './ext-styles';
import './scene-editor';
import { entityBadge, lockToggle, sectionHead } from './page-intro';

const KIND_LABEL: Record<string, string> = { automation: 'Automation', script: 'Script', scene: 'Scene' };
const KIND_COLOR: Record<string, string> = { automation: '#1e88e5', script: '#8e24aa', scene: '#00897b' };

@customElement('alarm-view-house-actions')
export class AlarmViewHouseActions extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: HouseActionsInfo;
  @state() private draft: Record<string, string[]> = {};
  @state() private locked = true;
  @state() private busy = false;
  @state() private error = '';
  @state() private search = '';
  @state() private kind = '';
  @state() private mode = '';
  @state() private show: 'related' | 'suggested' | 'all' = 'related';

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      this.info = await fetchHouseActions(this.hass);
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private sceneLabels(info: HouseActionsInfo) {
    const out: Record<string, string[]> = {};
    info.items.filter(i => i.kind === 'scene').forEach(i => (out[i.entity_id] = i.labels));
    return out;
  }

  private modesOf(i: HouseActionItem) {
    return this.draft[i.entity_id] ?? i.labels;
  }

  private toggle(i: HouseActionItem, mode: string) {
    if (this.locked) return;
    const cur = this.modesOf(i);
    const next = cur.includes(mode) ? cur.filter(m => m !== mode) : [...cur, mode];
    const d = { ...this.draft };
    if (JSON.stringify([...next].sort()) === JSON.stringify([...i.labels].sort())) delete d[i.entity_id];
    else d[i.entity_id] = next;
    this.draft = d;
  }

  private acceptSuggestions(items: HouseActionItem[]) {
    const d = { ...this.draft };
    items.forEach(i => {
      const add = suggestedModes(i);
      if (add.length) d[i.entity_id] = [...new Set([...this.modesOf(i), ...add])];
    });
    this.draft = d;
    this.locked = false;
  }

  private async save() {
    this.busy = true;
    try {
      const changes = Object.keys(this.draft).map(entity_id => ({ entity_id, modes: this.draft[entity_id] }));
      const res = await setHouseActionModes(this.hass, changes);
      this.info = res;
      this.draft = {};
      this.locked = true;
      toast(this, `Labels saved on ${res.done.length} item(s).`);
      this.error = res.errors.join('\n');
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private open(i: HouseActionItem) {
    const p = editorPath(i);
    if (p) navigate(this, p);
  }

  private async run(i: HouseActionItem) {
    const svc = i.kind === 'automation' ? ['automation', 'trigger'] : [i.kind, 'turn_on'];
    if (i.kind === 'automation' && !window.confirm(`Run "${i.name}" now (its actions, skipping its conditions)?`)) return;
    await this.hass.callService(svc[0], svc[1], { entity_id: i.entity_id });
    toast(this, `${KIND_LABEL[i.kind]} "${i.name}" started.`);
  }

  private async enable(i: HouseActionItem, on: boolean) {
    await this.hass.callService('automation', on ? 'turn_on' : 'turn_off', { entity_id: i.entity_id });
    window.setTimeout(() => this.load(), 800);
  }

  render() {
    const info = this.info;
    if (!info) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const f = { search: this.search, kind: this.kind, mode: this.mode, show: this.show };
    const rows = info.items.filter(i => matchesFilter(i, f));
    const suggestions = info.items.filter(i => suggestedModes(i).length);
    const dirty = Object.keys(this.draft).length;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      <ha-card>${sectionHead('House Mode Actions', 'settings')}
        <div class="card-content desc">
          <p>Every native Home Assistant automation, script and scene that belongs to a House Mode, in one place. A tick
            means it carries the Home Assistant label <em>${info.label_prefix}&lt;mode&gt;</em>; one item can belong to several
            modes.</p>
          <ul>
            <li>Click a name to open it in Home Assistant's editor.</li>
            <li><ha-icon icon="mdi:lightbulb-on-outline" style="--mdc-icon-size:16px;color:var(--accent-color)"></ha-icon>
              marks a suggestion: it uses the House Mode and names that mode, but has no label yet.</li>
            <li>Labels are ordinary Home Assistant labels, so you can filter Home Assistant's own automation, script and scene
              lists by them too.</li>
          </ul>
          ${!info.modes.length
            ? html`<div class="notice warn">No House Modes found: define them on the House Modes tab, or choose the House Mode
                input_select there.</div>`
            : html`<p class="secondary" style="display:block">Modes from ${info.modes_source === 'house_modes' ? 'the House Modes tab' : html`<code>${info.modes_source}</code>`}.</p>`}
        </div>
        <div class="toolbar">
          ${lockToggle(this.locked, () => (this.locked = !this.locked))}
          ${suggestions.length
            ? html`<ha-button @click=${() => this.acceptSuggestions(suggestions)}>
                <ha-icon slot="start" icon="mdi:lightbulb-on-outline"></ha-icon>Use ${suggestions.length} suggestion(s)</ha-button>`
            : nothing}
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${(e: any) => (this.search = e.target.value)} />
          <select aria-label="Kind" @change=${(e: any) => (this.kind = e.target.value)}>
            <option value="">All kinds</option>
            ${['automation', 'script', 'scene'].map(k => html`<option value=${k} ?selected=${this.kind === k}>${KIND_LABEL[k]}s</option>`)}
          </select>
          <select aria-label="House Mode" @change=${(e: any) => (this.mode = e.target.value)}>
            <option value="">All House Modes</option>
            ${info.modes.map(m => html`<option value=${m} ?selected=${this.mode === m}>${m}</option>`)}
          </select>
          <select aria-label="Show" @change=${(e: any) => (this.show = e.target.value)}>
            <option value="related" ?selected=${this.show === 'related'}>Related to a House Mode</option>
            <option value="suggested" ?selected=${this.show === 'suggested'}>Only suggestions</option>
            <option value="all" ?selected=${this.show === 'all'}>Everything</option>
          </select>
          <span class="secondary" style="display:inline">${rows.length} of ${info.items.length}</span>
        </div>
        <div class="table-wrap"><table>
          <thead><tr>
            <th class="icon"></th><th>Name</th><th>Kind</th>
            ${info.modes.map(m => html`<th class="c">${m}</th>`)}
            <th>Last run</th><th></th>
          </tr></thead>
          <tbody>${rows.map(i => this.renderRow(i, info.modes))}</tbody>
        </table></div>
        ${!rows.length ? html`<div class="empty">Nothing matches. Choose "Everything" to label any automation, script or scene.</div>` : nothing}
      </ha-card>
      <alarmo-ext-scene-editor .hass=${this.hass} .modes=${info.modes}
        .labels=${this.sceneLabels(info)}
        @scenes-changed=${() => window.setTimeout(() => this.load(), 800)}></alarmo-ext-scene-editor>
      ${dirty
        ? html`<div class="savebar" role="region" aria-label="Unsaved labels">
            <span class="count">${dirty} item(s) with unsaved House Mode labels</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.draft = {})}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          </div>`
        : nothing}
    `;
  }

  private renderRow(i: HouseActionItem, modes: string[]) {
    const cur = this.modesOf(i);
    const changed = i.entity_id in this.draft;
    const sugg = suggestedModes(i);
    const p = editorPath(i);
    return html`<tr>
      <td class="icon">${entityBadge(this.hass, i.entity_id, changed ? 'changed' : 'unchanged')}</td>
      <td class="name">
        ${p ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => this.open(i)}>${i.name}</button>` : i.name}
        <span class="secondary">${i.entity_id}${!i.editable ? ' · has no id, cannot be labelled' : ''}${i.detected && i.detected.any && !i.labels.length ? ' · uses the House Mode (no specific mode)' : ''}</span>
      </td>
      <td><span class="chip-cell" style=${`--chip:${KIND_COLOR[i.kind]}`}>${KIND_LABEL[i.kind]}</span></td>
      ${modes.map(m => {
        const on = cur.includes(m);
        const was = i.labels.includes(m);
        const sug = !on && sugg.includes(m);
        return html`<td class="c mode ${on !== was ? 'changed' : ''}">
          <button class="eye" ?disabled=${this.locked || !i.editable} aria-pressed=${on}
            title=${on ? `${m}: related (label)` : sug ? `${m}: suggested — it uses the House Mode and names ${m}` : `${m}: not related`}
            @click=${() => this.toggle(i, m)}>
            <ha-icon class="mode-dot ${on ? 'on' : ''}" style=${sug ? 'color:var(--accent-color)' : ''}
              icon=${on ? 'mdi:check-circle' : sug ? 'mdi:lightbulb-on-outline' : 'mdi:circle-small'}></ha-icon>
          </button></td>`;
      })}
      <td>${i.last_triggered ? html`<span class="secondary" style="display:inline">${new Date(i.last_triggered).toLocaleString()}</span>` : '—'}</td>
      <td class="row-actions">
        ${i.kind === 'automation'
          ? html`<ha-switch .checked=${i.state === 'on'} title=${i.state === 'on' ? 'Enabled' : 'Disabled'}
              @change=${(e: any) => this.enable(i, e.target.checked)}></ha-switch>`
          : nothing}
        <ha-icon-button .label=${'Run now'} title="Run now" @click=${() => this.run(i)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
      </td>
    </tr>`;
  }

  static styles = extStyles;
}
