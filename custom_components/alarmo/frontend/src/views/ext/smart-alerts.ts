// Notifications tab → Smart Repeating Alerts: native Home Assistant automations made from the Smart Repeating Alerts blueprint
// (repeating, actionable alerts with camera snapshots). Listed here; created, edited and deleted through Home
// Assistant's automation editor and config API, so they stay ordinary automations with traces and backups.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { AlertItem, AlertsInfo, createAlert, deleteAlert, describeAlert, fetchAlerts, installAlertsBlueprint } from '../../data/alerts';
import { extStyles } from './ext-styles';
import { collapsibleCard } from './page-intro';

@customElement('alarmo-ext-smart-alerts')
export class ExtSmartAlerts extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private info?: AlertsInfo;
  @state() private error = '';
  @state() private busy = false;

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      this.info = await fetchAlerts(this.hass);
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private later() {
    window.setTimeout(() => this.load(), 900);
  }

  private name = (eid: string) => (this.hass.states[eid]?.attributes.friendly_name as string) || eid;

  private async install(force = false) {
    this.busy = true;
    try {
      await installAlertsBlueprint(this.hass, force);
      toast(this, 'Smart Repeating Alerts blueprint installed.');
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async add() {
    const alias = window.prompt('Name of the new alert', 'Smart Repeating Alert - ');
    if (!alias) return;
    this.busy = true;
    try {
      const id = await createAlert(this.hass, alias.trim(), this.info!.blueprint.path);
      navigate(this, `/config/automation/edit/${id}`);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async deleteOne(a: AlertItem) {
    if (!a.edit_id || !window.confirm(`Delete the automation "${a.name}"?`)) return;
    try {
      await deleteAlert(this.hass, a.edit_id);
      toast(this, `${a.name} deleted.`);
      this.later();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async setEnabled(a: AlertItem, on: boolean) {
    await this.hass.callService('automation', on ? 'turn_on' : 'turn_off', { entity_id: a.entity_id });
    this.later();
  }

  private async run(a: AlertItem) {
    await this.hass.callService('automation', 'trigger', { entity_id: a.entity_id, skip_condition: false });
    toast(this, `Ran ${a.name}.`);
  }

  private row(a: AlertItem) {
    const edit = a.edit_id ? `/config/automation/edit/${a.edit_id}` : null;
    const on = a.state === 'on';
    return html`<div class="sa-row ${on ? '' : 'off'}">
      <ha-icon class="sa-icon" icon=${a.summary.camera ? 'mdi:cctv' : a.summary.critical ? 'mdi:alarm-light-outline' : 'mdi:bell-ring-outline'}></ha-icon>
      <div class="sa-name">
        ${edit ? html`<button class="link" title="Open in Home Assistant's editor" @click=${() => navigate(this, edit)}>${a.name}</button>` : html`<span>${a.name}</span>`}
        <span class="secondary">${describeAlert(a, this.name)}</span>
        ${a.old ? html`<span class="sa-old"><ha-icon icon="mdi:alert"></ha-icon>Uses ${a.old}: change its blueprint to Smart Repeating Alerts (the converted YAML is ready).</span>` : nothing}
      </div>
      <button class="sa-chip ${on ? 'on' : ''}" title=${on ? 'Enabled: click to disable' : 'Disabled: click to enable'} @click=${() => this.setEnabled(a, !on)}>${on ? 'Enabled' : 'Disabled'}</button>
      <ha-icon-button .label=${'Run now'} title="Run now (as if triggered)" @click=${() => this.run(a)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
      ${edit ? html`<ha-icon-button .label=${'Edit'} title="Edit in Home Assistant" @click=${() => navigate(this, edit)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>` : nothing}
      ${a.edit_id ? html`<ha-icon-button class="sa-del" .label=${'Delete'} title="Delete" @click=${() => this.deleteOne(a)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>` : nothing}
    </div>`;
  }

  render() {
    const i = this.info;
    const items = i?.items || [];
    const current = items.filter(a => !a.old);
    const old = items.filter(a => a.old);
    const bp = i?.blueprint;
    const summary = i
      ? `${current.length} alert${current.length === 1 ? '' : 's'}${old.length ? ` · ${old.length} on old blueprints` : ''} · ${current.filter(a => a.state === 'on').length} enabled`
      : 'loading…';
    return collapsibleCard('smart-alerts', 'mdi:bell-ring-outline', 'Smart Repeating Alerts', summary, 'settings', html`
      <div class="card-content desc">
        <p>Repeating, actionable alerts for doors, windows, leaks, smoke, cameras and anything else with a trigger: each one
          a Home Assistant automation made from the <em>Smart Repeating Alerts</em> blueprint, with repeats until cleared, buttons,
          camera snapshots, critical alerts and a test mode. They are listed here and edited in Home Assistant's editor,
          so they keep traces and are in every backup.</p>
        <p class="secondary">Alarm messages (armed, triggered, failed to arm) are set up under <em>Alarm notifications</em> below.</p>
      </div>
      ${this.error ? html`<div class="notice error" style="margin:0 16px 12px">${this.error}</div>` : nothing}
      ${bp
        ? html`<div class="sa-bp">
            <ha-icon icon=${bp.installed ? 'mdi:check-circle' : 'mdi:alert-circle-outline'} class=${bp.installed ? 'ok' : 'warn'}></ha-icon>
            ${bp.installed
              ? html`<span>Blueprint <code>${bp.path}</code> ${bp.installed_version ? `v${bp.installed_version}` : ''}
                  ${bp.update ? html`· <strong>v${bp.shipped_version} is available</strong>` : nothing}
                  ${!bp.ours ? html`· <span class="secondary" style="display:inline">not the copy that ships with this integration</span>` : nothing}</span>`
              : html`<span>The Smart Repeating Alerts blueprint is not installed yet.</span>`}
            ${!bp.installed || bp.update
              ? html`<ha-button ?disabled=${this.busy} @click=${() => this.install()}>${bp.installed ? 'Update' : 'Install'} blueprint</ha-button>`
              : nothing}
          </div>`
        : nothing}
      <div class="toolbar">
        <ha-button ?disabled=${this.busy || !bp?.installed} @click=${this.add}><ha-icon slot="start" icon="mdi:plus"></ha-icon>New alert</ha-button>
        <ha-button appearance="plain" @click=${() => navigate(this, '/config/blueprint/dashboard')}><ha-icon slot="start" icon="mdi:file-document-outline"></ha-icon>Blueprints</ha-button>
        <ha-button appearance="plain" @click=${() => this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
      </div>
      <div class="sa-list">
        ${current.map(a => this.row(a))}
        ${old.length ? html`<div class="sa-group">Still on the old blueprints</div>${old.map(a => this.row(a))}` : nothing}
        ${i && !items.length ? html`<div class="empty">No Smart Repeating Alerts yet. <em>New alert</em> makes one and opens it in Home Assistant's editor.</div>` : nothing}
      </div>
    `);
  }

  static styles = [
    extStyles,
    css`
      :host {
        display: block;
        margin-bottom: 16px;
      }
      .sa-bp {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0 16px 8px;
      }
      .sa-bp ha-icon.ok {
        color: var(--success-color, #4caf50);
      }
      .sa-bp ha-icon.warn {
        color: var(--warning-color, #ff9800);
      }
      .sa-list {
        padding: 0 16px 12px;
      }
      .sa-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 12px 0 2px;
      }
      .sa-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-top: 1px solid var(--divider-color);
      }
      .sa-row.off .sa-name button,
      .sa-row.off .sa-icon {
        opacity: 0.55;
      }
      .sa-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .sa-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .sa-old {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--warning-color, #ff9800);
        font-size: 13px;
        --mdc-icon-size: 16px;
      }
      .sa-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 1px 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .sa-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .sa-del:hover {
        color: var(--error-color);
      }
    `,
  ];
}
