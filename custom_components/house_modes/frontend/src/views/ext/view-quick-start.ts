// Quick Start: what is configured, and three guided setups (each previews its steps; Apply makes a backup first).
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { navigate } from '../../helpers';
import { extStyles } from './ext-styles';
import { sectionHead, tabCard, tabSection } from './page-intro';
import './alarmo-import';

type Step = {
  id: string;
  title: string;
  status: 'done' | 'todo' | 'manual' | 'optional' | 'skip';
  detail: string;
  link: string | null;
  yaml?: string;
  candidates?: { entity_id: string; name: string; device_class: string }[];
  automations?: { entity_id: string; name: string; edit_id: string | null; reasons: string[] }[];
  can_mark?: boolean;
  cleanup?: boolean;
};
type Plan = { setup: string; steps: Step[]; todo: number };
type Status = {
  partitions: number;
  zones: number;
  users: number;
  house: { enabled: boolean; modes: number; run_mode: string };
  panel_links: { panel: string; mode: string }[];
  recording: boolean;
  alarms: string[];
};

const ALARMO_TEXT =
  "Your Alarmo configuration was found. These are the steps to move it over, in order. Alarmo's own files are only read until you clean it up, so going back stays possible: disable this integration and enable Alarmo again (MIGRATION.md).";

// "What do you use?": the parts a user ticks; Quick Start shows one checklist for them
const PARTS: { id: 'house' | 'alarm' | 'panel'; icon: string; title: string; text: string }[] = [
  { id: 'house', icon: 'mdi:home-switch-outline', title: 'House Modes', text: 'Home, Away, Sleep, Guest, … to tell your automations what is going on, and to arm the alarm.' },
  { id: 'alarm', icon: 'mdi:shield-home-outline', title: 'Built-in alarm (no physical panel)', text: 'A partition with Away, Home and Night; your door, window and motion sensors as zones; user codes.' },
  { id: 'panel', icon: 'mdi:alarm-panel-outline', title: 'Physical alarm panel', text: 'A panel (e.g. a Vista through Envisalink) kept in step with the alarm, starting in Shadow.' },
];

/** Steps that count toward "N of M done": optional and skipped ones do not. */
const counts = (steps: Step[]) => {
  const counted = steps.filter(x => x.status !== 'skip' && x.status !== 'optional');
  return {
    done: counted.filter(x => x.status === 'done').length,
    total: counted.length,
    todo: steps.filter(x => x.status === 'todo').length,
    manual: steps.filter(x => x.status === 'manual').length,
    optional: steps.filter(x => x.status === 'optional').length,
  };
};

const ICON: Record<string, string> = {
  done: 'mdi:check-circle',
  todo: 'mdi:circle-outline',
  manual: 'mdi:hand-pointing-right',
  optional: 'mdi:circle-half-full',
  skip: 'mdi:minus-circle-outline',
};

@customElement('hm-view-quick-start')
export class AlarmViewQuickStart extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private status?: Status;
  @state() private plans: Record<string, Plan> = {};
  @state() private error = '';
  @state() private busy = '';
  /** virtual setup: the sensors the user picked (null = the defaults: doors and windows) */
  @state() private pickZones: string[] | null = null;
  /** dashboards that already have the card (null = not checked yet) */
  @state() private cardOn: string[] | null = null;
  /** Alarmo files found and no choice yet: the import question comes before anything else */
  @state() private askImport = false;
  /** the parts ticked under "What do you use?" */
  @state() private parts: string[] = [];
  @state() private partsGuessed = false;

  firstUpdated() {
    this.load();
    this.findCard();
  }

  /** Is the card on a dashboard? Only that it exists matters, not how it is set up. */
  private async findCard() {
    const found: string[] = [];
    try {
      const boards = await this.hass.callWS<{ url_path: string; title: string; mode: string }[]>({ type: 'lovelace/dashboards/list' });
      const all: { url_path: string | null; title: string }[] = [{ url_path: null, title: 'Overview' }, ...boards];
      for (const b of all) {
        try {
          const cfg = await this.hass.callWS<any>({ type: 'lovelace/config', url_path: b.url_path });
          if (JSON.stringify(cfg).includes('custom:house-modes-alarm-center-card')) found.push(b.title || b.url_path || 'Overview');
        } catch (_e) {
          /* a dashboard without a stored config (auto-generated): no card */
        }
      }
    } catch (_e) {
      /* dashboards cannot be listed: leave the step as it is */
      this.cardOn = null;
      return;
    }
    this.cardOn = found;
  }

  private static GROUPS: { id: string; title: string; icon: string; classes: string[]; on: boolean }[] = [
    { id: 'door', title: 'Doors', icon: 'mdi:door', classes: ['door', 'garage_door', 'opening'], on: true },
    { id: 'window', title: 'Windows', icon: 'mdi:window-closed-variant', classes: ['window'], on: true },
    { id: 'motion', title: 'Motion', icon: 'mdi:motion-sensor', classes: ['motion'], on: false },
    { id: 'occupancy', title: 'Occupancy and presence', icon: 'mdi:account-search-outline', classes: ['occupancy', 'presence'], on: false },
  ];

  private picked(cands: { entity_id: string; device_class: string }[]): string[] {
    if (this.pickZones) return this.pickZones;
    const on = ([] as string[]).concat(...AlarmViewQuickStart.GROUPS.filter(g => g.on).map(g => g.classes));
    return cands.filter(c => on.includes(c.device_class)).map(c => c.entity_id);
  }

  private async load(parts?: string[]) {
    try {
      const res = await this.hass.callWS<{ status: Status; plans: Record<string, Plan>; parts: string[]; parts_guessed: boolean }>({
        type: 'house_modes/ext/quickstart/plan',
        ...(parts ? { parts } : {}),
      });
      this.status = res.status;
      this.plans = res.plans;
      this.parts = res.parts;
      this.partsGuessed = res.parts_guessed;
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async mark(step: string) {
    try {
      await this.hass.callWS({ type: 'house_modes/ext/quickstart/mark', step, done: true });
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  /** Tick or untick a part; Built-in alarm and Physical panel exclude each other. */
  private togglePart(id: string, on: boolean) {
    let next = on ? [...this.parts, id] : this.parts.filter(p => p !== id);
    if (on && id === 'alarm') next = next.filter(p => p !== 'panel');
    if (on && id === 'panel') next = next.filter(p => p !== 'alarm');
    if (!next.length) return;
    this.load(PARTS.map(p => p.id).filter(p => next.includes(p)));
  }

  /** Clean up Alarmo: shows what goes, then removes it (copies first). */
  private async cleanup() {
    try {
      const info = await this.hass.callWS<{ paths: string[]; entries: { title: string }[]; blocked: string | null }>({
        type: 'house_modes/ext/alarmo_import/cleanup_info',
      });
      if (info.blocked) {
        this.error = info.blocked;
        return;
      }
      const what = [...info.entries.map(e => `the Alarmo integration entry (${e.title})`), ...info.paths.map(p => `/config/${p}`)];
      if (!window.confirm(`Remove Alarmo for good?\n\n• ${what.join('\n• ')}\n\nA copy of every file goes to /config/house_modes/backups/alarmo-final_<date>/ first. After this, going back to Alarmo means restoring that copy.`)) return;
      this.busy = 'cleanup';
      const res = await this.hass.callWS<{ removed: string[]; backup: string }>({ type: 'house_modes/ext/alarmo_import/cleanup' });
      toast(this, `Alarmo removed (${res.removed.length} item(s)). Copies in /config/${res.backup}. If HACS lists Alarmo, remove it there too.`);
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async apply(id: string) {
    const plan = this.plans[id];
    const todo = plan.steps.filter(s => s.status === 'todo').map(s => s.title);
    if (!window.confirm(`Quick Start will make a backup, then:\n\n• ${todo.join('\n• ')}\n\nGo ahead?`)) return;
    this.busy = id;
    try {
      const zones = plan.steps.find(s => s.id === 'zones');
      const entities = zones?.candidates ? this.picked(zones.candidates) : undefined;
      const res = await this.hass.callWS<{ plan: Plan; done: string[]; status: Status }>({
        type: 'house_modes/ext/quickstart/apply',
        setup: id === 'use' ? this.parts.join('+') : id,
        ...(entities ? { entities } : {}),
      });
      this.plans = { ...this.plans, [id]: res.plan };
      this.status = res.status;
      toast(this, res.done.length ? `Done: ${res.done.length} step(s). A backup was made first.` : 'Nothing to do.');
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  render() {
    if (this.askImport)
      return html`<hm-alarmo-import .hass=${this.hass} mode="ask"
        @import-status=${(e: CustomEvent) => (this.askImport = !!e.detail?.ask)}
        @alarmo-import-changed=${() => this.load()}></hm-alarmo-import>`;
    return html`
      ${this.error ? html`<div class="notice error" style="margin:0 0 12px">${this.error}</div>` : nothing}
      <hm-alarmo-import style="display:none" .hass=${this.hass} mode="ask"
        @import-status=${(e: CustomEvent) => (this.askImport = !!e.detail?.ask)}></hm-alarmo-import>
      ${tabCard('Quick Start', 'settings', html`<p>Tick what you use: Quick Start shows the steps for it. <strong>Apply</strong>
          does the automatic ones (a backup first; it only adds what is missing), and the others say what to do. You can
          come back any time.</p>`, html`
        ${this.renderStatus()}
        ${this.plans.alarmo ? this.renderAlarmo(this.plans.alarmo) : nothing}
        ${this.renderUse()}`)}
    `;
  }

  /** What is configured: always shown, as chips (each opens its tab). */
  private renderStatus() {
    const s = this.status;
    if (!s) return nothing;
    const item = (ok: boolean, icon: string, text: string, link: string) => html`
      <button class="stat ${ok ? 'ok' : ''}" @click=${() => navigate(this, link, true)}>
        <ha-icon icon=${icon}></ha-icon><span>${text}</span></button>`;
    return html`<div class="stats" aria-label="What's configured">
        ${item(s.house.enabled, 'mdi:home-switch-outline', s.house.enabled ? `House Modes · ${s.house.modes} · ${s.house.run_mode === 'shadow' ? 'Shadow' : 'Live'}` : 'House Modes off', '/house_modes/house')}
        ${item(s.partitions > 0, 'mdi:shield-home-outline', `${s.partitions} partition${s.partitions === 1 ? '' : 's'}`, '/house_modes/partitions')}
        ${item(s.zones > 0, 'mdi:door-open', `${s.zones} zone${s.zones === 1 ? '' : 's'}`, '/house_modes/zones')}
        ${item(s.users > 0, 'mdi:account-key-outline', `${s.users} user${s.users === 1 ? '' : 's'}`, '/house_modes/codes')}
        ${item(s.panel_links.length > 0, 'mdi:alarm-panel-outline', s.panel_links.length ? `Panel link · ${s.panel_links[0].mode}` : 'No panel link', '/house_modes/panel')}
        ${item(s.recording, 'mdi:record-circle-outline', s.recording ? 'Recording on' : 'Recording off', '/house_modes/activity')}
      </div>`;
  }

  private summaryText(steps: Step[]) {
    const c = counts(steps);
    const head = c.done === c.total ? 'All done' : `${c.done} of ${c.total} done`;
    return [head, c.todo ? `${c.todo} to apply` : '', c.manual ? `${c.manual} for you` : '', c.optional ? `${c.optional} optional` : '']
      .filter(Boolean)
      .join(' · ');
  }

  private renderAlarmo(plan: Plan) {
    const steps = plan.steps;
    const c = counts(steps);
    const all = c.done === c.total && !c.optional;
    const title = html`<ha-icon icon=${all ? 'mdi:check-circle' : 'mdi:database-import-outline'} style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:4px"></ha-icon>${all ? 'Moved from Alarmo' : 'Moving from Alarmo'}`;
    if (all) {
      const imp = steps.find(s => s.id === 'import');
      const clean = steps.find(s => s.id === 'retire');
      return tabSection('qs-alarmo', title, [imp?.detail.split(' · ')[0], clean?.detail].filter(Boolean).join(' · '), html`
        <ol class="steps">${steps.map(st => this.renderStep(st))}</ol>`);
    }
    return tabSection('qs-alarmo', title, this.summaryText(steps), html`
      <p class="secondary" style="display:block;margin:4px 0 8px">${ALARMO_TEXT}</p>
      <ol class="steps">${steps.map(st => this.renderStep(st))}</ol>
      <hm-alarmo-import .hass=${this.hass} mode="backup" @alarmo-import-changed=${() => this.load()}></hm-alarmo-import>`,
      { open: c.manual > 0 });
  }

  private renderUse() {
    const plan = this.plans.use;
    return html`<div class="use">
        <h3>What do you use?</h3>
        ${this.partsGuessed ? html`<p class="secondary" style="display:block;margin:0 0 6px">Ticked from what is set up now. Change it if it's not right.</p>` : nothing}
        <div class="parts">${PARTS.map(p => {
          const on = this.parts.includes(p.id);
          return html`<label class="part ${on ? 'on' : ''}">
            <input type="checkbox" .checked=${on} ?disabled=${on && this.parts.length === 1}
              @change=${(e: any) => this.togglePart(p.id, e.target.checked)} />
            <ha-icon icon=${p.icon}></ha-icon>
            <span><strong>${p.title}</strong><span class="secondary">${p.text}</span></span>
          </label>`;
        })}</div>
      </div>
      ${plan
        ? tabSection('qs-use', html`<ha-icon icon="mdi:format-list-checks" style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:4px"></ha-icon>Your setup`,
            this.summaryText(plan.steps.map(st => this.effective(st))), html`
            <ol class="steps">${plan.steps.map(st => this.renderStep(st))}</ol>
            <div class="toolbar" style="padding:8px 0 0">
              <ha-button ?disabled=${!plan.todo || !!this.busy} @click=${() => this.apply('use')}>
                <ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>${this.busy === 'use' ? 'Applying…' : plan.todo ? `Apply ${plan.todo} step(s)` : 'All automatic steps done'}
              </ha-button>
              <span class="secondary" style="display:inline">A backup is made first; nothing that exists is changed.</span>
            </div>`, { open: true })
        : nothing}`;
  }

  private renderZoneGroups(cands: NonNullable<Step['candidates']>) {
    const picked = this.picked(cands);
    const set = (ids: string[]) => (this.pickZones = ids);
    return html`<div class="zgroups">
      <p class="secondary" style="display:block;margin:2px 0 6px">${picked.length} of ${cands.length} picked. Doors and windows are
        picked to start with; motion sensors (cameras often have several) only if you tick them.</p>
      ${AlarmViewQuickStart.GROUPS.map(g => {
        const list = cands.filter(c => g.classes.includes(c.device_class));
        if (!list.length) return nothing;
        const n = list.filter(c => picked.includes(c.entity_id)).length;
        const ids = list.map(c => c.entity_id);
        return html`<details class="zgroup">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon=${g.icon}></ha-icon>
            <span class="zg-title">${g.title}</span>
            <span class="secondary" style="display:inline">${n} of ${list.length}</span>
            <span class="grow"></span>
            <button class="link" @click=${(e: Event) => { e.preventDefault(); set([...new Set([...picked, ...ids])]); }}>all</button>
            <button class="link" @click=${(e: Event) => { e.preventDefault(); set(picked.filter(x => !ids.includes(x))); }}>none</button>
          </summary>
          <div class="cands">${list.map(c => html`<label><input type="checkbox" .checked=${picked.includes(c.entity_id)}
              @change=${(e: any) => set(e.target.checked ? [...picked, c.entity_id] : picked.filter(x => x !== c.entity_id))} />${c.name}</label>`)}</div>
        </details>`;
      })}
    </div>`;
  }

  /** A step as shown: the card step is done when the card is on a dashboard (checked here, in the browser). */
  private effective(st0: Step): Step {
    if (st0.id !== 'card') return st0;
    return this.cardOn?.length
      ? { ...st0, status: 'done', detail: `on ${this.cardOn.join(', ')}`, yaml: undefined }
      : { ...st0, detail: 'not on a dashboard yet — add it:' };
  }

  private renderStep(st0: Step) {
    const st = this.effective(st0);
    return html`<li class="step ${st.status}">
      <ha-icon icon=${ICON[st.status]}></ha-icon>
      <div class="step-body">
        <div><strong>${st.title}</strong>${st.detail ? html` <span class="secondary" style="display:inline">· ${st.detail}</span>` : nothing}
          ${st.link ? html` <a href=${st.link} @click=${(e: Event) => { e.preventDefault(); navigate(this, st.link!, true); }}>open</a>` : nothing}</div>
        ${st.candidates && st.status === 'todo' ? this.renderZoneGroups(st.candidates) : nothing}
        ${st.automations?.length
          ? html`<ul class="autos">${st.automations.map(a => html`<li>
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>${a.edit_id
                ? html`<a href=${`/config/automation/edit/${a.edit_id}`} @click=${(e: Event) => { e.preventDefault(); navigate(this, `/config/automation/edit/${a.edit_id}`); }}>${a.name}</a>`
                : html`<strong>${a.name}</strong>`}
                ${a.reasons.map(r => html`<div class="secondary">${r}</div>`)}</div></li>`)}</ul>`
          : nothing}
        ${st.can_mark ? html`<button class="link" @click=${() => this.mark(st.id)}>Mark as done</button>` : nothing}
        ${st.cleanup
          ? html`<ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.cleanup}>
              <ha-icon slot="start" icon="mdi:broom"></ha-icon>${this.busy === 'cleanup' ? 'Cleaning up…' : 'Clean up Alarmo…'}</ha-button>`
          : nothing}
        ${st.yaml
          ? html`<pre class="yaml">${st.yaml}</pre>
              <button class="link" @click=${() => navigator.clipboard?.writeText(st.yaml!).then(() => toast(this, 'Copied'), () => toast(this, 'Select the text and copy it'))}>Copy</button>
              <span class="secondary" style="display:inline">· or Edit dashboard → Add card → House Modes &amp; Alarm Center Card</span>`
          : nothing}
      </div>
    </li>`;
  }

  static styles = [
    extStyles,
    css`
      .stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 16px 12px;
      }
      .use {
        padding: 4px 16px 4px;
      }
      .use h3 {
        margin: 8px 0 4px;
        font-size: 1em;
      }
      .parts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 8px;
        margin-bottom: 8px;
      }
      .part {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        padding: 8px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .part.on {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color), 0.08);
      }
      .part > span {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stat {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 8px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        cursor: pointer;
        --mdc-icon-size: 18px;
      }
      .stat.ok {
        color: var(--primary-text-color);
        border-color: var(--success-color, #43a047);
      }
      .stat.ok ha-icon {
        color: var(--success-color, #43a047);
      }
      .steps {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .step {
        display: flex;
        gap: 8px;
        padding: 6px 0;
        border-top: 1px solid var(--divider-color);
        --mdc-icon-size: 20px;
      }
      .step.done > ha-icon {
        color: var(--success-color, #43a047);
      }
      .step.todo > ha-icon {
        color: var(--primary-color);
      }
      .step.manual > ha-icon {
        color: var(--warning-color, #ffa600);
      }
      .step.optional > ha-icon,
      .step.skip > ha-icon {
        color: var(--secondary-text-color);
      }
      .step-body {
        flex: 1;
        min-width: 0;
      }
      .autos {
        list-style: none;
        padding: 0;
        margin: 6px 0 4px;
      }
      .autos li {
        display: flex;
        gap: 6px;
        padding: 3px 0;
        --mdc-icon-size: 16px;
      }
      .autos li > ha-icon {
        color: var(--warning-color, #ffa600);
        margin-top: 2px;
      }
      .zgroup {
        border-top: 1px solid var(--divider-color);
      }
      .zgroup[open] {
        border: 1px solid var(--accent-color, var(--primary-color));
        border-radius: 6px;
        margin: 4px 0;
      }
      .zgroup summary {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 6px;
        cursor: pointer;
        list-style: none;
        --mdc-icon-size: 18px;
      }
      .zgroup summary::-webkit-details-marker {
        display: none;
      }
      .zgroup .chev {
        transition: transform 0.15s;
      }
      .zgroup[open] .chev {
        transform: rotate(90deg);
      }
      .zg-title {
        font-weight: 600;
      }
      .grow {
        flex: 1;
      }
      .cands {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 2px 16px;
        padding: 4px 10px 8px 30px;
      }
      .cands label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .yaml {
        margin: 6px 0 4px;
        padding: 8px 10px;
        border-radius: 6px;
        background: var(--secondary-background-color, #202020);
        font-family: var(--code-font-family, monospace);
        font-size: 0.9em;
        white-space: pre-wrap;
      }
    `,
  ];
}
