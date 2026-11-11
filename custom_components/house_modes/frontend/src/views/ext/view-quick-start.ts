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
  status: 'done' | 'todo' | 'manual' | 'skip';
  detail: string;
  link: string | null;
  yaml?: string;
  candidates?: { entity_id: string; name: string; device_class: string }[];
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

const SETUPS: { id: string; icon: string; title: string; text: string }[] = [
  {
    id: 'house',
    icon: 'mdi:home-switch-outline',
    title: 'House Modes only',
    text: 'Home, Away, Sleep, Guest, … to tell your automations what is going on. No alarm: the House Modes do not arm anything (one partition is kept in the background).',
  },
  {
    id: 'virtual',
    icon: 'mdi:shield-home-outline',
    title: 'Alarm without a physical panel',
    text: 'The built-in alarm: a partition with Away, Home and Night, your door, window and motion sensors as zones, and a user code.',
  },
  {
    id: 'panel',
    icon: 'mdi:alarm-panel-outline',
    title: 'House Modes and a physical panel',
    text: 'The alarm and your panel (e.g. a Vista through Envisalink) kept in step, with House Modes. Everything starts in Shadow next to your own automations, so nothing changes until you switch to Live.',
  },
];

const ICON: Record<string, string> = {
  done: 'mdi:check-circle',
  todo: 'mdi:circle-outline',
  manual: 'mdi:hand-pointing-right',
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

  private async load() {
    try {
      const res = await this.hass.callWS<{ status: Status; plans: Record<string, Plan> }>({ type: 'house_modes/ext/quickstart/plan' });
      this.status = res.status;
      this.plans = res.plans;
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
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
        setup: id,
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
    const importer = html`<hm-alarmo-import .hass=${this.hass} mode="ask"
        @import-status=${(e: CustomEvent) => (this.askImport = !!e.detail?.ask)}></hm-alarmo-import>`;
    if (this.askImport) return importer;
    return html`
      ${this.error ? html`<div class="notice error" style="margin:0 0 12px">${this.error}</div>` : nothing}
      ${importer}
      ${tabCard('Quick Start', 'settings', html`<p>House Modes &amp; Alarm Center can be used three ways. Pick the one that fits, check
          what it will do, and press <strong>Apply</strong>: it makes a backup first and only adds what is missing. You can run
          it again later.</p>`, html`
        ${tabSection('qs-status', "What's configured", this.statusSummary(), this.renderStatus())}
        ${SETUPS.map(s => this.renderSetup(s))}`)}
    `;
  }

  private statusSummary() {
    const s = this.status;
    if (!s) return 'loading…';
    return [s.house.enabled ? `House Modes ${s.house.run_mode === 'shadow' ? 'Shadow' : 'Live'}` : 'House Modes off',
      `${s.partitions} partition${s.partitions === 1 ? '' : 's'}`, `${s.zones} zones`, `${s.users} users`,
      s.panel_links.length ? `panel link ${s.panel_links[0].mode}` : 'no panel link'].join(' · ');
  }

  private renderStatus() {
    const s = this.status;
    if (!s) return html`<div class="empty">Loading…</div>`;
    const item = (ok: boolean, icon: string, text: string, link: string) => html`
      <button class="stat ${ok ? 'ok' : ''}" @click=${() => navigate(this, link, true)}>
        <ha-icon icon=${icon}></ha-icon><span>${text}</span></button>`;
    return html`<div class="stats">
        ${item(s.house.enabled, 'mdi:home-switch-outline', s.house.enabled ? `House Modes · ${s.house.modes} · ${s.house.run_mode === 'shadow' ? 'Shadow' : 'Live'}` : 'House Modes off', '/house_modes/house')}
        ${item(s.partitions > 0, 'mdi:shield-home-outline', `${s.partitions} partition(s)`, '/house_modes/partitions')}
        ${item(s.zones > 0, 'mdi:door-open', `${s.zones} zone(s)`, '/house_modes/zones')}
        ${item(s.users > 0, 'mdi:account-key-outline', `${s.users} user(s)`, '/house_modes/codes')}
        ${item(s.panel_links.length > 0, 'mdi:alarm-panel-outline', s.panel_links.length ? `Panel link · ${s.panel_links[0].mode}` : 'No panel link', '/house_modes/panel')}
        ${item(s.recording, 'mdi:record-circle-outline', s.recording ? 'Recording on' : 'Recording off', '/house_modes/activity')}
      </div>`;
  }

  private renderSetup(s: { id: string; icon: string; title: string; text: string }) {
    const plan = this.plans[s.id];
    const done = plan ? plan.steps.filter(x => x.status === 'done').length : 0;
    return tabSection(`qs-${s.id}`, html`<ha-icon icon=${s.icon} style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:4px"></ha-icon>${s.title}`,
      plan ? `${done} of ${plan.steps.length} done${plan.todo ? ` · ${plan.todo} to apply` : ''}` : '', html`
          <p class="secondary" style="display:block;margin:4px 0 8px">${s.text}</p>
          ${plan ? html`<ol class="steps">${plan.steps.map(st => this.renderStep(st))}</ol>` : html`<div class="empty">Loading…</div>`}
          ${plan
            ? html`<div class="toolbar" style="padding:8px 0 0">
                <ha-button ?disabled=${!plan.todo || !!this.busy} @click=${() => this.apply(s.id)}>
                  <ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>${this.busy === s.id ? 'Applying…' : plan.todo ? `Apply ${plan.todo} step(s)` : 'All automatic steps done'}
                </ha-button>
                <span class="secondary" style="display:inline">A backup is made first; nothing that exists is changed.</span>
              </div>`
            : nothing}
    `);
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

  private renderStep(st0: Step) {
    // the card: done when it is on a dashboard (however it is set up)
    const st: Step = st0.id === 'card' && this.cardOn?.length
      ? { ...st0, status: 'done', detail: `on ${this.cardOn.join(', ')}`, yaml: undefined }
      : st0.id === 'card' ? { ...st0, detail: 'not on a dashboard yet — add it:' } : st0;
    return html`<li class="step ${st.status}">
      <ha-icon icon=${ICON[st.status]}></ha-icon>
      <div class="step-body">
        <div><strong>${st.title}</strong>${st.detail ? html` <span class="secondary" style="display:inline">· ${st.detail}</span>` : nothing}
          ${st.link ? html` <a href=${st.link} @click=${(e: Event) => { e.preventDefault(); navigate(this, st.link!, true); }}>open</a>` : nothing}</div>
        ${st.candidates && st.status === 'todo' ? this.renderZoneGroups(st.candidates) : nothing}
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
        padding: 4px 16px 16px;
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
      .step-body {
        flex: 1;
        min-width: 0;
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
