// Quick Start: what is configured, and three guided setups (each previews its steps; Apply makes a backup first).
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { navigate } from '../../helpers';
import { extStyles } from './ext-styles';
import { sectionHead } from './page-intro';

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
    text: 'Home, Away, Sleep, Guest, … to tell your automations what is going on. No alarm: the House Modes do not arm anything (Alarmo keeps one partition in the background).',
  },
  {
    id: 'virtual',
    icon: 'mdi:shield-home-outline',
    title: 'Alarm without a physical panel',
    text: 'Alarmo is the alarm: a partition with Away, Home and Night, your door, window and motion sensors as zones, and a user code.',
  },
  {
    id: 'panel',
    icon: 'mdi:alarm-panel-outline',
    title: 'House Modes and a physical panel',
    text: 'Alarmo and your panel (e.g. a Vista through Envisalink) kept in step, with House Modes. Everything starts in Shadow next to your own automations, so nothing changes until you switch to Live.',
  },
];

const ICON: Record<string, string> = {
  done: 'mdi:check-circle',
  todo: 'mdi:circle-outline',
  manual: 'mdi:hand-pointing-right',
  skip: 'mdi:minus-circle-outline',
};

@customElement('alarm-view-quick-start')
export class AlarmViewQuickStart extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private status?: Status;
  @state() private plans: Record<string, Plan> = {};
  @state() private error = '';
  @state() private busy = '';
  /** virtual setup: the sensors the user unticked */
  @state() private skipZones: string[] = [];

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      const res = await this.hass.callWS<{ status: Status; plans: Record<string, Plan> }>({ type: 'alarmo/ext/quickstart/plan' });
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
      const entities = zones?.candidates ? zones.candidates.map(c => c.entity_id).filter(e => !this.skipZones.includes(e)) : undefined;
      const res = await this.hass.callWS<{ plan: Plan; done: string[]; status: Status }>({
        type: 'alarmo/ext/quickstart/apply',
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
    return html`
      ${this.error ? html`<div class="notice error" style="margin:0 0 12px">${this.error}</div>` : nothing}
      <ha-card>${sectionHead('Quick Start', 'settings')}
        <div class="card-content desc">
          <p>House Modes &amp; Alarm Center can be used three ways. Pick the one that fits, check what it will do, and press
            <strong>Apply</strong>: it makes a backup first and only adds what is missing. You can run it again later.</p>
        </div>
        ${this.renderStatus()}
      </ha-card>
      ${SETUPS.map(s => this.renderSetup(s))}
    `;
  }

  private renderStatus() {
    const s = this.status;
    if (!s) return html`<div class="empty">Loading…</div>`;
    const item = (ok: boolean, icon: string, text: string, link: string) => html`
      <button class="stat ${ok ? 'ok' : ''}" @click=${() => navigate(this, link, true)}>
        <ha-icon icon=${icon}></ha-icon><span>${text}</span></button>`;
    return html`<div class="subhead" style="padding:0 16px">What's configured</div>
      <div class="stats">
        ${item(s.house.enabled, 'mdi:home-switch-outline', s.house.enabled ? `House Modes · ${s.house.modes} · ${s.house.run_mode === 'shadow' ? 'Shadow' : 'Live'}` : 'House Modes off', '/alarmo/house')}
        ${item(s.partitions > 0, 'mdi:shield-home-outline', `${s.partitions} partition(s)`, '/alarmo/partitions')}
        ${item(s.zones > 0, 'mdi:door-open', `${s.zones} zone(s)`, '/alarmo/zones')}
        ${item(s.users > 0, 'mdi:account-key-outline', `${s.users} user(s)`, '/alarmo/codes')}
        ${item(s.panel_links.length > 0, 'mdi:alarm-panel-outline', s.panel_links.length ? `Panel link · ${s.panel_links[0].mode}` : 'No panel link', '/alarmo/panel')}
        ${item(s.recording, 'mdi:record-circle-outline', s.recording ? 'Recording on' : 'Recording off', '/alarmo/activity')}
      </div>`;
  }

  private renderSetup(s: { id: string; icon: string; title: string; text: string }) {
    const plan = this.plans[s.id];
    const done = plan ? plan.steps.filter(x => x.status === 'done').length : 0;
    return html`<ha-card>
      <details class="collapse" style="margin:12px 16px">
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          <ha-icon icon=${s.icon} style="--mdc-icon-size:20px;color:var(--primary-color)"></ha-icon>
          <span class="collapse-title">${s.title}</span>
          ${plan ? html`<span class="secondary" style="display:inline">${done} of ${plan.steps.length} done${plan.todo ? ` · ${plan.todo} to apply` : ''}</span>` : nothing}
        </summary>
        <div class="collapse-body">
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
        </div>
      </details>
    </ha-card>`;
  }

  private renderStep(st: Step) {
    return html`<li class="step ${st.status}">
      <ha-icon icon=${ICON[st.status]}></ha-icon>
      <div class="step-body">
        <div><strong>${st.title}</strong>${st.detail ? html` <span class="secondary" style="display:inline">· ${st.detail}</span>` : nothing}
          ${st.link ? html` <a href=${st.link} @click=${(e: Event) => { e.preventDefault(); navigate(this, st.link!, true); }}>open</a>` : nothing}</div>
        ${st.candidates && st.status === 'todo'
          ? html`<div class="cands">${st.candidates.map(c => html`<label><input type="checkbox" .checked=${!this.skipZones.includes(c.entity_id)}
              @change=${(e: any) => (this.skipZones = e.target.checked ? this.skipZones.filter(x => x !== c.entity_id) : [...this.skipZones, c.entity_id])} />
              ${c.name} <span class="secondary" style="display:inline">${c.device_class}</span></label>`)}</div>`
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
      .cands {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        padding: 6px 0 0;
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
