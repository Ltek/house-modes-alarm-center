// ext: "Migrate to scenes and scripts" for Alarm Events created by upstream Alarmo.
// Preview first; on Migrate: integration backup, then per event a native scene (plain states) or
// script (anything else), and the event is saved to run it.
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AlarmoAutomation, HomeAssistant } from '../../types';
import { saveAutomation } from '../../data/websockets';
import { createBackup } from '../../data/ext-websockets';
import { saveScene, sceneEntityFor, newSceneId } from '../../data/scenes';
import {
  MigrationPlan,
  planMigration,
  isLegacyEvent,
  saveScript,
  existingScriptIds,
  nativeActions,
} from '../../data/alarm-events';

type Result = { name: string; ok: boolean; text: string };

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

@customElement('alarmo-ext-event-migrate')
export class ExtEventMigrate extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) events: AlarmoAutomation[] = [];

  @state() private plan: MigrationPlan[] | null = null;
  @state() private busy = false;
  @state() private results: Result[] | null = null;

  private legacy() {
    return this.events.filter(isLegacyEvent);
  }

  private preview() {
    this.results = null;
    this.plan = planMigration(this.legacy(), existingScriptIds(this.hass), newSceneId);
  }

  private async waitFor(find: () => string | null) {
    for (let i = 0; i < 30; i++) {
      const e = find();
      if (e) return e;
      await sleep(300);
    }
    return null;
  }

  private async migrate() {
    if (!this.plan) return;
    this.busy = true;
    const results: Result[] = [];
    try {
      await createBackup(this.hass, 'before Alarm Events migration');
    } catch (e: any) {
      this.busy = false;
      this.results = [{ name: 'Backup', ok: false, text: `Not migrated: the backup failed (${e?.message || e}).` }];
      return;
    }
    for (const p of this.plan) {
      if (p.kind == 'skip') continue;
      const name = p.event.name || 'Alarm Event';
      try {
        let entity: string | null;
        if (p.kind == 'scene') {
          await saveScene(this.hass, p.scene);
          entity = await this.waitFor(() => sceneEntityFor(this.hass, p.scene.id));
        } else {
          await saveScript(this.hass, p.scriptId, p.script);
          entity = await this.waitFor(() => (this.hass.states[`script.${p.scriptId}`] ? `script.${p.scriptId}` : null));
        }
        if (!entity) throw new Error(`the new ${p.kind} did not appear in Home Assistant`);
        await saveAutomation(this.hass, { automation_id: p.event.automation_id, actions: nativeActions([entity]) });
        results.push({ name, ok: true, text: `now runs ${entity}` });
      } catch (e: any) {
        results.push({ name, ok: false, text: `not changed: ${e?.message || e}` });
      }
    }
    this.busy = false;
    this.plan = null;
    this.results = results;
    this.dispatchEvent(new CustomEvent('events-migrated', { bubbles: true, composed: true }));
  }

  render() {
    const n = this.legacy().length;
    if (!n && !this.results) return nothing;
    return html`
      <div class="box">
        ${this.results
          ? html`
              <div class="title">Migration finished</div>
              <ul>
                ${this.results.map(
                  r => html`<li class=${r.ok ? 'ok' : 'bad'}><b>${r.name}</b>: ${r.text}</li>`
                )}
              </ul>
              <ha-button appearance="plain" @click=${() => (this.results = null)}>Close</ha-button>
            `
          : this.plan
            ? this.renderPlan()
            : html`
                <div class="title">${n} Alarm Event${n == 1 ? '' : 's'} still use Alarmo's own list of actions</div>
                <p>
                  Alarm Events now run native Home Assistant scenes and scripts, the same as House Modes. Migrating
                  turns each event's actions into a scene (plain on/off, lock, open/close states) or a script
                  (anything else). The event keeps its trigger and runs the new scene or script. A backup is made
                  first, and you see the plan before anything changes.
                </p>
                <ha-button appearance="filled" @click=${this.preview}>Migrate to scenes and scripts…</ha-button>
              `}
      </div>
    `;
  }

  private renderPlan() {
    const todo = this.plan!.filter(p => p.kind != 'skip') as Exclude<MigrationPlan, { kind: 'skip' }>[];
    return html`
      <div class="title">Migration plan</div>
      <table>
        <thead><tr><th>Alarm Event</th><th>Becomes</th><th>Contents</th></tr></thead>
        <tbody>
          ${todo.map(
            p => html`<tr>
              <td>${p.event.name}</td>
              <td>
                ${p.kind == 'scene'
                  ? html`scene <i>${p.scene.name}</i>`
                  : html`script <code>script.${p.scriptId}</code><div class="why">${p.reason}</div>`}
              </td>
              <td>${p.summary.map(s => html`<div><code>${s}</code></div>`)}</td>
            </tr>`
          )}
        </tbody>
      </table>
      <div class="actions">
        <ha-button appearance="filled" ?disabled=${this.busy || !todo.length} @click=${this.migrate}>
          ${this.busy ? 'Migrating…' : `Migrate ${todo.length}`}
        </ha-button>
        <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.plan = null)}>Cancel</ha-button>
      </div>
    `;
  }

  static styles = css`
    .box {
      margin: 8px 16px 12px;
      padding: 10px 14px;
      border-left: 3px solid var(--primary-color);
      background: rgba(3, 169, 244, 0.06);
    }
    .title {
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }
    p {
      margin: 4px 0 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
    }
    th,
    td {
      text-align: left;
      padding: 6px 8px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    th {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .why {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }
    li.ok b {
      color: var(--success-color, #4caf50);
    }
    li.bad b {
      color: var(--error-color);
    }
  `;
}
