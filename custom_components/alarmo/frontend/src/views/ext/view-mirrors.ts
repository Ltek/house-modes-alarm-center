// Physical Panel page, "Panel zones" card (was the Zone Mirrors tab): every physical panel zone with its live
// state, mirror, how it is used in Alarmo, and "Ignore". Panel zones not in Alarmo are flagged and can be added
// with suggested settings as drafts on Zone Assignments (reviewed there before saving).
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AlarmoArea, AlarmoSensor, Dictionary, HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { fetchAreas, fetchSensors } from '../../data/websockets';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { MIRROR_TYPES, mirrorId, PanelInfo, PanelSettings, fetchPanel, importZones, repointZones, savePanel, zoneKind } from '../../data/panel';
import { ZONE_DRAFT_KEY, liveState } from '../../data/status';
import { navigate } from '../../helpers';
import { extStyles } from './ext-styles';
import { stateCell } from './state-cell';
import { entityBadge, lockToggle, sectionHead } from './page-intro';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

// defaults for fields the panel import does not set (same as a new zone on Zone Assignments)
const ZONE_DEFAULTS = {
  enabled: true,
  use_exit_delay: true,
  use_entry_delay: true,
  always_on: false,
  arm_on_close: false,
  allow_open: false,
  trigger_unavailable: false,
  auto_bypass: false,
  auto_bypass_modes: [],
  entry_delay: null,
  delay_on: null,
  group: null,
};

type Row = { source: string; name: string; zone: number | null; panel: string | null; panelZone: boolean; dc: string | null };


@customElement('alarm-view-mirrors')
export class AlarmViewMirrors extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private info?: PanelInfo;
  @state() private mirrors: PanelSettings['mirrors'] = {};
  @state() private ignored: string[] = [];
  @state() private bypassEntity: string | null = null;
  @state() private sensors: Dictionary<AlarmoSensor> = {};
  @state() private areas: Dictionary<AlarmoArea> = {};
  @state() private extra = '';
  @state() private search = '';
  @state() private error = '';
  @state() private busy = false;
  @state() private locked = true;
  @state() private selection: string[] = [];
  @state() private addTo = '';
  @state() private showIgnored = false;
  @state() private mirrorType = '';
  @state() private useMirrors = true;

  firstUpdated() {
    this.refresh();
  }

  private async refresh() {
    try {
      const [info, sensors, areas] = await Promise.all([fetchPanel(this.hass), fetchSensors(this.hass), fetchAreas(this.hass)]);
      this.info = info;
      this.sensors = sensors;
      this.areas = areas;
      if (!this.addTo || !areas[this.addTo]) this.addTo = Object.keys(areas)[0] || '';
      this.mirrors = clone(info.settings.mirrors);
      this.ignored = [...(info.settings.ignored_zones || [])];
      this.bypassEntity = info.settings.bypass_entity || null;
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private get dirty() {
    const s = this.info?.settings;
    return (
      !!s &&
      (JSON.stringify(s.mirrors) !== JSON.stringify(this.mirrors) ||
        JSON.stringify([...(s.ignored_zones || [])].sort()) !== JSON.stringify([...this.ignored].sort()) ||
        (s.bypass_entity || null) !== this.bypassEntity)
    );
  }

  private name(id: string) {
    return (this.hass.states[id]?.attributes.friendly_name as string) || id;
  }

  private allRows(): Row[] {
    const out: Row[] = [];
    const seen = new Set<string>();
    for (const p of this.info!.panels)
      for (const z of p.zones) {
        out.push({ source: z.entity_id, name: z.name, zone: z.zone, panel: p.name, panelZone: true, dc: z.device_class });
        seen.add(z.entity_id);
      }
    for (const src of Object.keys(this.mirrors))
      if (!seen.has(src)) out.push({ source: src, name: this.name(src), zone: null, panel: null, panelZone: false, dc: (this.hass.states[src]?.attributes.device_class as string) || null });
    return out;
  }

  /** 'zone' | 'mirror' | null: how the zone is in Alarmo now */
  private inAlarmo(src: string) {
    return this.sensors[mirrorId(src)] ? 'mirror' : this.sensors[src] ? 'zone' : null;
  }

  render() {
    if (!this.info) return html`<ha-card><div class="empty">${this.error || 'Loading…'}</div></ha-card>`;
    const all = this.allRows();
    const q = this.search.trim().toLowerCase();
    const rows = all.filter(
      r => (this.showIgnored || !this.ignored.includes(r.source)) && (!q || r.source.includes(q) || r.name.toLowerCase().includes(q))
    );
    const notIn = all.filter(r => r.panelZone && !this.inAlarmo(r.source) && !this.ignored.includes(r.source));
    const repointable = all.filter(r => this.info!.settings.mirrors[r.source] && this.sensors[r.source] && this.hass.states[mirrorId(r.source)] && !this.sensors[mirrorId(r.source)]);
    const candidates = Object.keys(this.hass.states)
      .filter(e => e.startsWith('binary_sensor.') && !e.endsWith('_mirror') && !all.some(r => r.source === e))
      .sort();
    const sel = this.selection.filter(s => rows.some(r => r.source === s));
    const allSel = rows.length > 0 && rows.every(r => sel.includes(r.source));
    const multiPanel = this.info.panels.filter(p => p.zones.length).length > 1;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>` : nothing}
      <ha-card>${sectionHead('Panel zones', 'settings')}
        <div class="card-content desc">
          <p>Every zone your physical panel reports to Home Assistant: its live state, its mirror, and which entity Alarmo uses.</p>
          <p><strong>Why mirrors exist — a Vista limitation.</strong> A Honeywell/Ademco Vista panel stops reporting a zone
            while it is bypassed, so the zone falsely shows "closed". A mirror (<code>binary_sensor.&lt;zone&gt;_mirror</code>)
            follows the zone live and keeps its last known state while bypassed (or shows unknown). DSC panels keep
            reporting bypassed zones, so they do not need mirrors.</p>
          <ul>
            <li>Unlock to edit, then tick <em>Mirror</em> to create a mirror, untick to remove it, and Save.</li>
            <li>Select rows to add them to Alarmo as zones or as their mirrors (a backup is made first), or to ignore them.</li>
            <li><em>Ignore</em> hides a zone that is not a real sensor (keyfob button, RF supervision, unused number) from
              "not in Alarmo".</li>
            <li>A window opened <em>after</em> it was bypassed can't be seen by any software.</li>
          </ul>
        </div>
        ${notIn.length
          ? html`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${notIn.length} panel zone(s) are not in Alarmo:</strong> ${notIn.map(r => r.name).join(', ')}.
              <div class="toolbar" style="padding:6px 0 0">
                ${Object.keys(this.areas).length > 1
                  ? html`<label>Partition
                      <select @change=${(e: any) => (this.addTo = e.target.value)}>
                        ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${a.area_id === this.addTo}>${a.name}</option>`)}
                      </select></label>`
                  : nothing}
                <ha-button ?disabled=${this.busy || !this.addTo} @click=${() => this.addAllAsDrafts(notIn.map(r => r.source))}>
                  <ha-icon slot="start" icon="mdi:playlist-plus"></ha-icon>Add all with suggested settings…</ha-button>
                <span class="secondary" style="display:inline">They become unsaved drafts on Zone Assignments (type and Arm Modes
                  guessed from the device class) for you to review and Save. Ignore the ones you don't want first.</span>
              </div>
            </div>`
          : nothing}
        <div class="toolbar">
          ${lockToggle(this.locked, () => (this.locked = !this.locked))}
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${(e: any) => (this.search = e.target.value)} />
          <label><input type="checkbox" .checked=${this.showIgnored} @change=${(e: any) => (this.showIgnored = e.target.checked)} />
            Show ignored (${this.ignored.length})</label>
          ${repointable.length
            ? html`<ha-button appearance="plain" ?disabled=${this.busy || this.dirty} @click=${() => this.repoint(repointable.map(r => r.source))}>
                Use mirrors in Alarmo for ${repointable.length} zone(s)</ha-button>`
            : nothing}
        </div>
        ${this.renderBypassHelper()}
        ${this.renderMirrorTools(all)}
        ${sel.length && !this.locked
          ? html`<div class="bulkbar" role="toolbar" aria-label="Selected zones">
              <strong>${sel.length} selected</strong>
              <label>Partition
                <select @change=${(e: any) => (this.addTo = e.target.value)}>
                  ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${a.area_id === this.addTo}>${a.name}</option>`)}
                </select>
              </label>
              <ha-button appearance="plain" ?disabled=${this.busy || this.dirty} @click=${() => this.addNow(sel, false)}>Add as zones</ha-button>
              <ha-button appearance="plain" ?disabled=${this.busy || this.dirty} @click=${() => this.addNow(sel, true)}>Add their mirrors</ha-button>
              <ha-button appearance="plain" @click=${() => sel.forEach(s => this.toggle(s, true))}>Mirror on</ha-button>
              <ha-button appearance="plain" @click=${() => sel.forEach(s => this.toggle(s, false))}>Mirror off</ha-button>
              <ha-button appearance="plain" @click=${() => (this.ignored = [...new Set([...this.ignored, ...sel])])}>Ignore</ha-button>
              <ha-button appearance="plain" @click=${() => (this.ignored = this.ignored.filter(i => !sel.includes(i)))}>Stop ignoring</ha-button>
              <button class="link" @click=${() => (this.selection = [])}>Clear selection</button>
            </div>`
          : nothing}
        <div class="table-wrap"><table>
          <thead><tr>
            <th class="c"><input type="checkbox" aria-label="Select all shown" ?disabled=${this.locked} .checked=${allSel}
              @change=${(e: any) => (this.selection = e.target.checked ? rows.map(r => r.source) : [])} /></th>
            <th class="icon"></th><th>Zone</th><th>Panel zone</th><th class="c">State: Zone / Mirror</th><th class="c">Mirror</th><th>While bypassed</th><th>Entity in use</th>
          </tr></thead>
          <tbody>${rows.map(r => {
            const saved = this.info!.settings.mirrors[r.source];
            const m = this.mirrors[r.source];
            const mid = mirrorId(r.source);
            const mst = this.hass.states[mid];
            const status = m && !saved ? 'new' : !m && saved ? 'removed' : m && saved && m.hold !== saved.hold ? 'changed' : 'unchanged';
            const ign = this.ignored.includes(r.source);
            const live = liveState(this.hass.states[r.source]?.state);
            const used = this.inAlarmo(r.source);
            return html`<tr class=${ign ? 'zone-disabled' : ''}>
              <td class="c"><input type="checkbox" aria-label=${`Select ${r.name}`} ?disabled=${this.locked} .checked=${sel.includes(r.source)}
                @change=${(e: any) => (this.selection = e.target.checked ? [...sel, r.source] : sel.filter(x => x !== r.source))} /></td>
              <td class="icon">${entityBadge(this.hass, r.source, status)}</td>
              <td class="name">${r.name}<span class="secondary">${r.source}${ign ? ' · ignored' : ''}</span></td>
              <td>${r.zone !== null ? `${r.zone}${r.panel && multiPanel ? ` · ${r.panel}` : ''}` : html`<span class="secondary" style="display:inline">not a panel zone</span>`}</td>
              <td class="c"><span class="state-pair">
                ${stateCell(live, { label: this.info!.bypassed.includes(r.source) ? 'bypassed' : undefined, title: `Zone: ${live}` })}
                <span class="sep">/</span>
                ${mst
                  ? stateCell(liveState(mst.state), { label: mst.attributes.bypass_held ? 'held' : undefined, title: `Mirror: ${mst.state}${mst.attributes.bypass_held ? ' (holding the last state while bypassed)' : ''}` })
                  : stateCell(null)}
              </span></td>
              <td class="c"><input type="checkbox" aria-label=${`Mirror ${r.name}`} ?disabled=${this.locked} .checked=${!!m} @change=${(e: any) => this.toggle(r.source, e.target.checked)} />
                ${!mst && m ? html`<span class="secondary">created on Save</span>` : nothing}</td>
              <td>${m
                ? html`<select aria-label="While bypassed" ?disabled=${this.locked} @change=${(e: any) => (this.mirrors = { ...this.mirrors, [r.source]: { hold: e.target.value } })}>
                    <option value="last" ?selected=${m.hold === 'last'}>hold last state</option>
                    <option value="unknown" ?selected=${m.hold === 'unknown'}>unknown</option>
                  </select>`
                : '—'}</td>
              <td>${used === 'mirror' ? html`<code>${mid}</code>` : used === 'zone' ? 'same' : html`<span class="secondary" style="display:inline">not in Alarmo</span>`}</td>
            </tr>`;
          })}</tbody>
        </table></div>
        ${!rows.length ? html`<div class="empty">No physical panel zones found. Add the physical panel's integration to Home Assistant, or mirror another entity below.</div>` : nothing}
      </ha-card>
      <ha-card>${sectionHead('Mirror another entity', 'settings')}
        <div class="card-content desc">
          <p>Any binary_sensor can have a mirror. Entities that are not panel zones only know they are bypassed if they report a
            <code>bypassed</code> attribute.</p>
        </div>
        <div class="toolbar">
          <label>Entity
            <input list="alarmo-mirror-candidates" placeholder="binary_sensor.…" .value=${this.extra} @input=${(e: any) => (this.extra = e.target.value)} />
            <datalist id="alarmo-mirror-candidates">${candidates.map(c => html`<option value=${c}>${this.hass.states[c].attributes.friendly_name || ''}</option>`)}</datalist>
          </label>
          <ha-button appearance="plain" ?disabled=${!this.extra.startsWith('binary_sensor.') || !this.hass.states[this.extra]} @click=${this.addExtra}>Add mirror</ha-button>
        </div>
      </ha-card>
      ${this.dirty
        ? html`<div class="savebar" role="region" aria-label="Unsaved panel zone changes">
            <span class="count">Unsaved mirror / ignore changes</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => { this.mirrors = clone(this.info!.settings.mirrors); this.ignored = [...(this.info!.settings.ignored_zones || [])]; }}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy ? 'Saving…' : 'Save'}</ha-button>
          </div>`
        : nothing}
    `;
  }

  /** Optional helper meaning "zones are bypassed" (e.g. the one your bypass automations turn on). */
  private renderBypassHelper() {
    const cands = Object.keys(this.hass.states)
      .filter(e => /^(input_boolean|switch|binary_sensor)\./.test(e) && !e.endsWith('_mirror') && !(e in this.sensors))
      .filter(e => !this.info!.panels.some(p => p.zones.some(z => z.entity_id === e)))
      .sort();
    const st = this.bypassEntity ? this.hass.states[this.bypassEntity] : undefined;
    const unreported = this.info!.bypass_unreported || [];
    return html`
      ${unreported.length && !this.bypassEntity
        ? html`<div class="notice warn" style="margin:0 16px 8px">
            <strong>${unreported.length} mirrored zone(s) can't learn about bypasses.</strong> Their panel (Honeywell/Vista via
            envisalink_new) reports bypasses only on its keypad sensor, and no keypad sensor with <code>armed_bypass</code> was
            found for them. Choose a bypass helper below, or check the envisalink_new keypad sensor.</div>`
        : nothing}
      <div class="toolbar" style="padding-top:0">
        <label>Bypass helper
          <select ?disabled=${this.locked} @change=${(e: any) => (this.bypassEntity = e.target.value || null)}>
            <option value="" ?selected=${!this.bypassEntity}>none (detect bypasses from the panel only)</option>
            ${cands.map(c => html`<option value=${c} ?selected=${c === this.bypassEntity}>${this.name(c)} (${c})</option>`)}
          </select>
        </label>
        ${st ? html`<span class="secondary" style="display:inline">now ${st.state}${st.state === 'on' ? ' — mirrors are holding' : ''}</span>` : nothing}
        <span class="secondary" style="display:block;flex-basis:100%">Usually not needed: bypasses are read from the panel (on a Vista,
          its keypad sensor's BYPASS indicator and "BYPAS zz" messages; a window open when the panel was Quick-Bypassed keeps
          showing "open"). Only choose a helper that is <em>on exactly while zones are bypassed on the panel</em> — not one that
          only asks your automations to bypass when arming.</span>
      </div>
    `;
  }

  /** "Create mirror for <type>" + "use mirrors in Alarmo": always shown, enabled when unlocked. */
  private renderMirrorTools(all: Row[]) {
    const typed = this.mirrorType ? all.filter(r => r.panelZone && zoneKind(r.dc) === this.mirrorType && !this.ignored.includes(r.source)) : [];
    const n = typed.length;
    const area = this.areas[this.addTo];
    return html`
      <div class="toolbar" style="padding-top:0">
        <label>Create mirror for
          <select ?disabled=${this.locked} @change=${(e: any) => this.chooseType(e.target.value, all)}>
            <option value="" ?selected=${!this.mirrorType}>choose a zone type…</option>
            ${MIRROR_TYPES.map(t => {
              const c = all.filter(r => r.panelZone && zoneKind(r.dc) === t.id).length;
              return html`<option value=${t.id} ?selected=${this.mirrorType === t.id}>${t.label} (${c})</option>`;
            })}
          </select>
        </label>
        <label><input type="checkbox" ?disabled=${this.locked} .checked=${this.useMirrors} @change=${(e: any) => (this.useMirrors = e.target.checked)} />
          Use the mirrors in Alarmo, remove the panel's real zones</label>
        ${Object.keys(this.areas).length > 1
          ? html`<label>Partition
              <select ?disabled=${this.locked} @change=${(e: any) => (this.addTo = e.target.value)}>
                ${Object.values(this.areas).map(a => html`<option value=${a.area_id} ?selected=${a.area_id === this.addTo}>${a.name}</option>`)}
              </select></label>`
          : nothing}
      </div>
      ${this.mirrorType
        ? html`<div class="toolbar" style="padding-top:0">
            <ha-button ?disabled=${this.locked || this.busy || !n} @click=${() => this.applyMirrors(typed.map(r => r.source))}>
              <ha-icon slot="start" icon="mdi:content-duplicate"></ha-icon>${this.useMirrors
                ? `Save ${n} mirror(s), use them in ${area ? area.name : 'Alarmo'} instead of the real zones`
                : `Save ${n} mirror(s)`}
            </ha-button>
            <button class="link" @click=${() => { this.mirrorType = ''; this.mirrors = clone(this.info!.settings.mirrors); }}>Cancel</button>
            ${!n ? html`<span class="secondary" style="display:inline">No ${this.mirrorType} zones found.</span>` : nothing}
          </div>`
        : nothing}
    `;
  }

  private chooseType(type: string, all: Row[]) {
    this.mirrorType = type;
    if (!type) return;
    all.filter(r => r.panelZone && zoneKind(r.dc) === type && !this.ignored.includes(r.source)).forEach(r => this.toggle(r.source, true));
  }

  /** Save mirrors; then (optionally) point Alarmo zones at them / add them, removing the real zones from Alarmo. */
  private async applyMirrors(sources: string[]) {
    const inAlarmo = sources.filter(s => this.sensors[s] && !this.sensors[mirrorId(s)]);
    const notIn = sources.filter(s => !this.sensors[s] && !this.sensors[mirrorId(s)]);
    if (
      this.useMirrors &&
      !window.confirm(
        `Create ${sources.length} mirror(s)` +
          (inAlarmo.length ? `, switch ${inAlarmo.length} Alarmo zone(s) to their mirror (settings kept, the real zone is removed from Alarmo)` : '') +
          (notIn.length ? `, add ${notIn.length} mirror(s) to ${this.areas[this.addTo]?.name} with suggested settings` : '') +
          '? A backup is made first.'
      )
    )
      return;
    this.busy = true;
    this.error = '';
    try {
      const latest = (await fetchPanel(this.hass)).settings;
      await savePanel(this.hass, { ...latest, mirrors: this.mirrors, ignored_zones: this.ignored, bypass_entity: this.bypassEntity });
      if (this.useMirrors) {
        // the mirror entities appear a moment after saving
        const ids = sources.map(mirrorId);
        for (let i = 0; i < 30 && ids.some(id => !this.hass.states[id]); i++) await new Promise(res => setTimeout(res, 500));
        const missing = ids.filter(id => !this.hass.states[id]);
        if (missing.length) throw new Error(`Mirrors not created yet: ${missing.join(', ')} — try again in a moment.`);
        const parts: string[] = [];
        if (inAlarmo.length) {
          const res = await repointZones(this.hass, inAlarmo.map(s => ({ from: s, to: mirrorId(s) })));
          parts.push(`${res.changed} zone(s) now use their mirror`);
        }
        if (notIn.length) {
          const res = await importZones(this.hass, this.addTo, notIn.map(mirrorId));
          parts.push(`${res.create.length} mirror(s) added to ${this.areas[this.addTo]?.name}`);
        }
        toast(this, `Mirrors saved${parts.length ? `; ${parts.join(', ')}` : ''}.`);
      } else toast(this, 'Mirrors saved.');
      this.locked = true;
      this.mirrorType = '';
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
      await this.refresh();
    } finally {
      this.busy = false;
    }
  }

  private toggle(src: string, on: boolean) {
    const m = { ...this.mirrors };
    if (on) m[src] = this.info!.settings.mirrors[src] || { hold: 'last' };
    else delete m[src];
    this.mirrors = m;
  }

  private addExtra() {
    this.toggle(this.extra.trim(), true);
    this.extra = '';
  }

  private async save() {
    const removedInUse = Object.keys(this.info!.settings.mirrors).filter(s => !this.mirrors[s] && this.sensors[mirrorId(s)]);
    if (removedInUse.length && !window.confirm(`These mirrors are Alarmo zones; removing them makes those zones unavailable:\n${removedInUse.map(mirrorId).join('\n')}\n\nContinue?`))
      return;
    this.busy = true;
    this.error = '';
    try {
      const latest = (await fetchPanel(this.hass)).settings;
      await savePanel(this.hass, { ...latest, mirrors: this.mirrors, ignored_zones: this.ignored, bypass_entity: this.bypassEntity });
      toast(this, 'Panel zones saved.');
      this.locked = true;
      this.selection = [];
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  /** Add selected zones (or their mirrors) to Alarmo right away (backend makes a backup first). */
  private async addNow(sources: string[], asMirror: boolean) {
    const ids = sources.map(s => (asMirror ? mirrorId(s) : s)).filter(id => !this.sensors[id]);
    const missing = asMirror ? ids.filter(id => !this.hass.states[id]) : [];
    if (missing.length) {
      this.error = `Turn the mirror on and Save first for: ${missing.join(', ')}`;
      return;
    }
    if (!ids.length) return;
    this.busy = true;
    try {
      const res = await importZones(this.hass, this.addTo, ids);
      toast(this, `${res.create.length} zone(s) added to ${this.areas[this.addTo]?.name}. Set their Arm Modes on Zone Assignments.${res.backup ? ` Backup: ${res.backup.name}` : ''}`);
      this.selection = [];
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  /** Suggested settings for every flagged zone → unsaved drafts on Zone Assignments. */
  private async addAllAsDrafts(sources: string[]) {
    const area = this.areas[this.addTo];
    if (!area) return;
    // a zone with a mirror is added as the mirror
    const ids = sources.map(s => (this.mirrors[s] && this.hass.states[mirrorId(s)] ? mirrorId(s) : s));
    if (!window.confirm(`Add ${ids.length} zone(s) to ${area.name} as drafts? Nothing is saved until you click Save on Zone Assignments.`)) return;
    this.busy = true;
    try {
      const res = await importZones(this.hass, this.addTo, ids, true);
      let snap: any = { edits: {}, added: {}, removed: [] };
      try {
        snap = JSON.parse(window.sessionStorage.getItem(ZONE_DRAFT_KEY) || '') || snap;
      } catch (_e) {
        /* no draft yet */
      }
      res.create.forEach(rec => (snap.added[rec.entity_id] = { ...ZONE_DEFAULTS, ...rec }));
      window.sessionStorage.setItem(ZONE_DRAFT_KEY, JSON.stringify(snap));
      navigate(this, '/alarmo/zones');
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async repoint(sources: string[]) {
    if (!window.confirm(`Point ${sources.length} Alarmo zone(s) at their mirror? Their settings are kept. A backup is made first.`)) return;
    this.busy = true;
    try {
      const res = await repointZones(this.hass, sources.map(s => ({ from: s, to: mirrorId(s) })));
      toast(this, `${res.changed} zone(s) now use mirrors. Backup: ${res.backup.name}`);
      await this.refresh();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  static styles = extStyles;
}
