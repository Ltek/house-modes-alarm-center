// Scenes card (House Mode Actions tab): create and edit native Home Assistant scenes inside Alarmo, ported from the
// Color Light & Scene Manager card. Scenes stay ordinary scene.* entities (HA's scene config API), and can be tied to
// House Modes with the same "House Mode: <mode>" labels.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { setHouseActionModes } from '../../data/house-actions';
import {
  SceneConfig,
  SceneMember,
  captureMember,
  captureMembers,
  deleteScene,
  describeMember,
  domainOf,
  hexToRgb,
  loadScene,
  newSceneId,
  patchMember,
  rgbToHex,
  saveScene,
  sceneEntityFor,
  sceneSupported,
} from '../../data/scenes';
import { extStyles } from './ext-styles';
import { entityBadge, sectionHead } from './page-intro';
import './multi-picker';
import './slider-field';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

@customElement('alarmo-ext-scene-editor')
export class SceneEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  /** House Mode names (columns of the House Mode Actions grid) */
  @property({ attribute: false }) modes: string[] = [];
  /** scene entity_id -> House Modes it is labelled with */
  @property({ attribute: false }) labels: Record<string, string[]> = {};

  @state() private open: string | null = null; // scene config id being edited ('new' = new scene)
  @state() private draft?: SceneConfig;
  @state() private saved?: SceneConfig;
  @state() private draftModes: string[] = [];
  @state() private pick: string[] = [];
  @state() private transition = 0;
  @state() private busy = false;
  @state() private error = '';
  @state() private search = '';

  private scenes() {
    const q = this.search.trim().toLowerCase();
    return Object.keys(this.hass.states)
      .filter(e => e.startsWith('scene.'))
      .map(e => ({ entity_id: e, name: (this.hass.states[e].attributes.friendly_name as string) || e, id: this.hass.states[e].attributes.id as string | undefined }))
      .filter(s => !q || s.name.toLowerCase().includes(q) || s.entity_id.includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private async edit(id: string, entityId: string) {
    this.error = '';
    try {
      const cfg = await loadScene(this.hass, id);
      this.saved = cfg;
      this.draft = clone(cfg);
      this.draftModes = [...(this.labels[entityId] || [])];
      this.open = id;
      this.pick = [];
    } catch (err) {
      this.error = `Could not load the scene: ${wsErrorMessage(err)}`;
    }
  }

  private startNew() {
    this.saved = undefined;
    this.draft = { id: newSceneId(), name: '', icon: '', entities: {} };
    this.draftModes = [];
    this.pick = [];
    this.open = 'new';
  }

  private set(fn: (d: SceneConfig) => void) {
    const d = clone(this.draft!);
    fn(d);
    this.draft = d;
  }

  private setMember(id: string, patch: Record<string, any>) {
    this.set(d => (d.entities[id] = patchMember(d.entities[id] || {}, patch)));
  }

  private addPicked() {
    const add = captureMembers(this.pick, this.hass.states as any, this.transition);
    this.set(d => Object.assign(d.entities, add));
    this.pick = [];
  }

  private async save() {
    const d = this.draft!;
    if (!d.name.trim()) return void (this.error = 'Give the scene a name.');
    this.busy = true;
    this.error = '';
    try {
      await saveScene(this.hass, { ...d, name: d.name.trim() });
      const before = this.open === 'new' ? [] : this.labels[sceneEntityFor(this.hass, d.id) || ''] || [];
      if (JSON.stringify([...before].sort()) !== JSON.stringify([...this.draftModes].sort())) {
        // the scene entity appears after the reload: wait for it, then set its House Mode labels
        let eid: string | null = null;
        for (let i = 0; i < 20 && !(eid = sceneEntityFor(this.hass, d.id)); i++) await new Promise(r => setTimeout(r, 300));
        if (eid) await setHouseActionModes(this.hass, [{ entity_id: eid, modes: this.draftModes }]);
        else this.error = 'Scene saved, but its House Mode labels could not be set yet: reload the page and tick them in the grid.';
      }
      toast(this, `Scene "${d.name}" saved.`);
      this.open = null;
      this.dispatchEvent(new CustomEvent('scenes-changed'));
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async deleteSceneClick(id: string, name: string) {
    if (!window.confirm(`Delete the scene "${name}" from Home Assistant? Automations or House Modes that use it will stop finding it.`)) return;
    try {
      await deleteScene(this.hass, id);
      toast(this, `Scene "${name}" deleted.`);
      this.open = null;
      this.dispatchEvent(new CustomEvent('scenes-changed'));
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  render() {
    const scenes = this.scenes();
    return html`
      <ha-card>${sectionHead('Scenes', 'settings')}
        <div class="card-content desc">
          <p>Native Home Assistant scenes, created and edited here. They are ordinary <code>scene.*</code> entities: use them in
            House Modes (House Modes tab → a mode → <em>Scenes and scripts</em>), automations, dashboards or voice.</p>
          <ul>
            <li><strong>New scene</strong>: choose entities, capture how they are now, then fine-tune each one.</li>
            <li>Tick House Modes to label the scene <em>House Mode: &lt;mode&gt;</em>, so it shows in the grid above.</li>
            <li>Scenes written in YAML (no id) can be activated but not edited here.</li>
          </ul>
        </div>
        ${this.error ? html`<div class="notice error" style="margin:0 16px 12px;white-space:pre-line">${this.error}</div>` : nothing}
        <div class="toolbar">
          <ha-button ?disabled=${this.open === 'new'} @click=${this.startNew}><ha-icon slot="start" icon="mdi:plus"></ha-icon>New scene</ha-button>
          <input type="search" placeholder="Search scenes" aria-label="Search scenes" .value=${this.search} @input=${(e: any) => (this.search = e.target.value)} />
          <span class="secondary" style="display:inline">${scenes.length} scene(s)</span>
        </div>
        ${this.open === 'new' ? this.renderEditor() : nothing}
        <div class="table-wrap"><table class="full">
          <thead><tr><th class="icon"></th><th>Scene</th><th>House Modes</th><th></th></tr></thead>
          <tbody>${scenes.map(s => html`
            <tr>
              <td class="icon">${entityBadge(this.hass, s.entity_id)}</td>
              <td class="name">${s.name}<span class="secondary">${s.entity_id}${s.id ? '' : ' · YAML, not editable here'}</span></td>
              <td>${(this.labels[s.entity_id] || []).join(', ') || html`<span class="secondary" style="display:inline">—</span>`}</td>
              <td class="row-actions">
                <ha-icon-button .label=${'Activate'} title="Activate" @click=${() => this.hass.callService('scene', 'turn_on', { entity_id: s.entity_id })}>
                  <ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
                ${s.id
                  ? html`<ha-icon-button .label=${'Edit'} title="Edit here" @click=${() => (this.open === s.id ? (this.open = null) : this.edit(s.id!, s.entity_id))}>
                        <ha-icon icon=${this.open === s.id ? 'mdi:chevron-down' : 'mdi:pencil'}></ha-icon></ha-icon-button>
                      <ha-icon-button .label=${"Open in Home Assistant's editor"} title="Open in Home Assistant's scene editor"
                        @click=${() => navigate(this, `/config/scene/edit/${s.id}`)}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`
                  : nothing}
              </td>
            </tr>
            ${this.open === s.id ? html`<tr class="detail"><td colspan="4">${this.renderEditor()}</td></tr>` : nothing}`)}
          </tbody>
        </table></div>
        ${!scenes.length ? html`<div class="empty">No scenes yet.</div>` : nothing}
      </ha-card>
    `;
  }

  private renderEditor() {
    const d = this.draft!;
    const members = Object.keys(d.entities).sort();
    const dirty = !this.saved || JSON.stringify(this.saved) !== JSON.stringify(d) ||
      JSON.stringify([...(this.labels[sceneEntityFor(this.hass, d.id) || ''] || [])].sort()) !== JSON.stringify([...this.draftModes].sort());
    const candidates = Object.keys(this.hass.states)
      .filter(e => sceneSupported(e) && !(e in d.entities))
      .sort()
      .map(e => ({ value: e, label: `${this.hass.states[e].attributes.friendly_name || e} (${e})` }));
    return html`<div class="notice" style="margin:0 16px 12px">
      <h4 class="subhead">${this.open === 'new' ? 'New scene' : `Edit ${d.name}`}</h4>
      <div class="field-row">
        <label>Name <input type="text" .value=${d.name} @input=${(e: any) => this.set(x => (x.name = e.target.value))} /></label>
        <label>Icon <input type="text" placeholder="mdi:…" .value=${d.icon || ''} @input=${(e: any) => this.set(x => (x.icon = e.target.value))} /></label>
      </div>
      ${this.modes.length
        ? html`<alarmo-ext-multi-picker .label=${'House Modes'} .placeholder=${'Add a House Mode…'} .options=${this.modes.map(m => ({ value: m, label: m }))}
            .value=${this.draftModes} @value-changed=${(e: CustomEvent) => (this.draftModes = e.detail.value)}></alarmo-ext-multi-picker>`
        : nothing}
      <h4 class="subhead" style="margin-top:10px">Entities</h4>
      <div class="field-row" style="align-items:flex-start">
        <alarmo-ext-multi-picker .label=${'Add entities (captured as they are now)'} .placeholder=${'Add an entity…'} .options=${candidates}
          .value=${this.pick} @value-changed=${(e: CustomEvent) => (this.pick = e.detail.value)}></alarmo-ext-multi-picker>
        <alarmo-ext-slider optional .label=${'Light fade-in'} .min=${0} .max=${30} unit="s" offText="no fade" .onValue=${2}
          .value=${this.transition || null} @value-changed=${(e: CustomEvent) => (this.transition = e.detail.value || 0)}></alarmo-ext-slider>
        <ha-button ?disabled=${!this.pick.length} @click=${this.addPicked}>Capture and add</ha-button>
      </div>
      ${members.length
        ? html`<div class="table-wrap"><table class="full"><tbody>${members.map(id => this.renderMember(id, d.entities[id]))}</tbody></table></div>`
        : html`<div class="empty">No entities yet: add some above.</div>`}
      <div class="toolbar" style="padding:8px 0 0">
        <ha-button ?disabled=${this.busy || !dirty || !members.length} @click=${this.save}>${this.busy ? 'Saving…' : 'Save scene'}</ha-button>
        <ha-button appearance="plain" ?disabled=${!members.length} title="Replace every value with how the entities are now"
          @click=${() => this.set(x => Object.assign(x.entities, captureMembers(members, this.hass.states as any, this.transition)))}>Capture all again</ha-button>
        <ha-button appearance="plain" @click=${() => (this.open = null)}>Cancel</ha-button>
        <span class="grow"></span>
        ${this.open !== 'new' ? html`<ha-button appearance="plain" variant="danger" @click=${() => this.deleteSceneClick(d.id, d.name)}>Delete scene</ha-button>` : nothing}
      </div>
    </div>`;
  }

  /** Per-domain controls for one member (the Color card's Scene Manager fields). */
  private renderMember(id: string, m: SceneMember) {
    const st = this.hass.states[id];
    const a = (st && st.attributes) || {};
    const dom = domainOf(id);
    const name = (a.friendly_name as string) || id;
    const stateSel = (on: string, off: string) => html`<select aria-label=${`${name} state`} @change=${(e: any) => this.setMember(id, { state: e.target.value })}>
      <option value=${on} ?selected=${m.state === on}>${on}</option><option value=${off} ?selected=${m.state === off}>${off}</option></select>`;
    const sel = (label: string, key: string, options: any[] | undefined) =>
      options && options.length
        ? html`<label>${label} <select @change=${(e: any) => this.setMember(id, { [key]: e.target.value || undefined })}>
            <option value="" ?selected=${m[key] == null}>(unset)</option>
            ${options.map(o => html`<option value=${String(o)} ?selected=${String(m[key]) === String(o)}>${String(o)}</option>`)}</select></label>`
        : nothing;
    const slider = (label: string, key: string, min: number, max: number, unit: string, toUi = (v: any) => v, fromUi = (v: any) => v) =>
      html`<alarmo-ext-slider optional .label=${label} .min=${min} .max=${max} unit=${unit} offText=${`${label}: unset`}
        .onValue=${Math.round((min + max) / 2)} .value=${m[key] == null ? null : Math.round(toUi(m[key]))}
        @value-changed=${(e: CustomEvent) => this.setMember(id, { [key]: e.detail.value == null ? undefined : fromUi(e.detail.value) })}></alarmo-ext-slider>`;
    let controls: unknown;
    if (dom === 'light') {
      const on = m.state !== 'off';
      controls = html`${stateSel('on', 'off')}
        ${on ? html`
          ${slider('Brightness', 'brightness', 1, 100, '%', v => (v / 255) * 100, v => Math.round((v / 100) * 255))}
          ${m.color_temp_kelvin != null
            ? slider('Colour temp', 'color_temp_kelvin', a.min_color_temp_kelvin || 2000, a.max_color_temp_kelvin || 6500, 'K')
            : html`<label>Colour <input type="color" .value=${rgbToHex(m.rgb_color)} @change=${(e: any) => this.setMember(id, { rgb_color: hexToRgb(e.target.value) })} /></label>`}
          ${sel('Effect', 'effect', a.effect_list)}
          ${slider('Fade', 'transition', 0, 30, 's')}` : nothing}`;
    } else if (dom === 'switch' || dom === 'input_boolean') controls = stateSel('on', 'off');
    else if (dom === 'lock') controls = stateSel('locked', 'unlocked');
    else if (dom === 'fan') controls = html`${stateSel('on', 'off')} ${m.state !== 'off' ? slider('Speed', 'percentage', 0, 100, '%') : nothing} ${sel('Preset', 'preset_mode', a.preset_modes)}`;
    else if (dom === 'cover') controls = html`${slider('Position', 'current_position', 0, 100, '% open')}
      ${a.current_tilt_position != null || m.current_tilt_position != null ? slider('Tilt', 'current_tilt_position', 0, 100, '%') : nothing}`;
    else if (dom === 'climate') controls = html`${sel('Mode', 'hvac_mode', a.hvac_modes)}
      <label>Target <input type="number" step="0.5" style="width:80px" .value=${m.temperature ?? ''} @change=${(e: any) => this.setMember(id, { temperature: e.target.value === '' ? undefined : Number(e.target.value) })} />°</label>
      ${sel('Fan', 'fan_mode', a.fan_modes)} ${sel('Preset', 'preset_mode', a.preset_modes)}`;
    else if (dom === 'media_player') controls = html`${stateSel('on', 'off')} ${slider('Volume', 'volume_level', 0, 100, '%', v => v * 100, v => v / 100)} ${sel('Source', 'source', a.source_list)}`;
    else if (dom === 'humidifier') controls = html`${stateSel('on', 'off')} ${slider('Humidity', 'humidity', 0, 100, '%')} ${sel('Mode', 'mode', a.available_modes)}`;
    else if (dom === 'input_select' || dom === 'select') controls = sel('Option', 'state', a.options);
    else if (dom === 'input_number') controls = html`<label>Value <input type="number" style="width:90px" .value=${m.state ?? ''} @change=${(e: any) => this.setMember(id, { state: e.target.value })} /></label>`;
    else controls = html`<span class="secondary" style="display:inline">${describeMember(m)}</span>`;
    const changed = this.saved && JSON.stringify(this.saved.entities[id]) !== JSON.stringify(m);
    return html`<tr>
      <td class="icon">${entityBadge(this.hass, id, !this.saved || !(id in this.saved.entities) ? 'new' : changed ? 'changed' : 'unchanged')}</td>
      <td class="name">${name}<span class="secondary">${id} · ${describeMember(m)}</span></td>
      <td style="white-space:normal"><div class="field-row">${controls}</div></td>
      <td class="row-actions">
        <ha-icon-button .label=${'Capture again'} title="Take how it is now" @click=${() => this.set(x => (x.entities[id] = captureMember(id, this.hass.states[id] as any, this.transition) || x.entities[id]))}>
          <ha-icon icon="mdi:camera-outline"></ha-icon></ha-icon-button>
        <ha-icon-button .label=${'Remove'} title="Remove from the scene" @click=${() => this.set(x => delete x.entities[id])}>
          <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
      </td>
    </tr>`;
  }

  static styles = extStyles;
}
