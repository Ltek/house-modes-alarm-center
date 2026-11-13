// Notifications tab → House Mode: the Simple notifications (sent by the integration: wording, priority, buttons per
// event) and the Advanced ones (automations from the House Mode Notifications blueprint). See data/house-notify.ts.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { fetchHouse, HouseMode, SOURCE_LABELS } from '../../data/house';
import {
  EVENT_INFO,
  NOTIFY_EVENTS,
  NotifyEvent,
  NotifyInfo,
  NotifySettings,
  PLACEHOLDER_HELP,
  PRIORITY_LABELS,
  createAdvanced,
  fetchHouseNotify,
  notifySummary,
  saveHouseNotify,
  testHouseNotify,
} from '../../data/house-notify';
import { extStyles } from './ext-styles';
import './multi-picker';

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
type HaUser = { id: string; name: string; is_admin: boolean; system_generated: boolean };

@customElement('hm-house-notifications')
export class HmHouseNotifications extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private info?: NotifyInfo;
  @state() private draft?: NotifySettings;
  @state() private modes: HouseMode[] = [];
  @state() private users: HaUser[] = [];
  @state() private busy = '';
  @state() private error = '';

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      this.info = await fetchHouseNotify(this.hass);
      this.draft = clone(this.info.settings);
      this.error = '';
      this.summary();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
    try {
      this.modes = (await fetchHouse(this.hass)).settings.modes;
    } catch (_e) {
      this.modes = [];
    }
    try {
      this.users = (await this.hass.callWS<HaUser[]>({ type: 'config/auth/list' })).filter(u => !u.system_generated);
    } catch (_e) {
      this.users = [];
    }
  }

  private summary() {
    this.dispatchEvent(new CustomEvent('notify-summary', { detail: notifySummary(this.info), bubbles: true, composed: true }));
  }

  private get dirty() {
    return !!this.info && JSON.stringify(this.draft) !== JSON.stringify(this.info.settings);
  }

  private set(fn: (d: NotifySettings) => void) {
    const d = clone(this.draft!);
    fn(d);
    this.draft = d;
  }

  private async save() {
    this.busy = 'save';
    try {
      this.info = await saveHouseNotify(this.hass, this.draft!);
      this.draft = clone(this.info.settings);
      this.error = '';
      toast(this, 'House Mode notifications saved.');
      this.summary();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async test(ev: NotifyEvent) {
    if (!this.draft!.services.length) {
      this.error = 'Choose a notify service first (Send to).';
      return;
    }
    this.busy = `test-${ev}`;
    try {
      const res = await testHouseNotify(this.hass, ev, this.draft!);
      toast(this, `Test sent to ${res.sent} service(s), with sample values.`);
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async addAdvanced() {
    this.busy = 'add';
    try {
      const id = await createAdvanced(this.hass, this.info!.blueprint, this.draft!.services);
      navigate(this, `/config/automation/edit/${id}`);
    } catch (err) {
      this.error = `Could not create the automation: ${wsErrorMessage(err)}. Is the blueprint installed (blueprints/automation/${this.info!.blueprint})?`;
    } finally {
      this.busy = '';
    }
  }

  private async toggleAdvanced(entity: string, on: boolean) {
    await this.hass.callService('automation', on ? 'turn_on' : 'turn_off', { entity_id: entity });
    setTimeout(() => this.load(), 500);
  }

  render() {
    if (!this.info || !this.draft) return this.error ? html`<div class="notice error">${this.error}</div>` : html`<div class="empty">Loading…</div>`;
    const d = this.draft;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line">${this.error}</div>` : nothing}
      <p class="secondary intro">Messages about House Mode changes. <strong>Simple</strong>: sent by the integration, with your wording,
        priority and buttons. <strong>Advanced</strong>: your own automations from the <em>🔔 House Mode Notifications</em> blueprint,
        for conditions, templates and anything else the phone app can do.</p>
      ${this.renderShared(d)}
      ${NOTIFY_EVENTS.map(ev => this.renderEvent(ev, d))}
      <div class="toolbar savebar">
        <ha-button ?disabled=${!this.dirty || !!this.busy} @click=${this.save}>${this.busy === 'save' ? 'Saving…' : 'Save'}</ha-button>
        <ha-button appearance="plain" ?disabled=${!this.dirty || !!this.busy} @click=${() => (this.draft = clone(this.info!.settings))}>Revert</ha-button>
        ${this.dirty ? html`<span class="secondary" style="display:inline">Unsaved changes</span>` : nothing}
      </div>
      ${this.renderAdvanced()}
    `;
  }

  private renderShared(d: NotifySettings) {
    const notifies = Object.keys(this.hass.services.notify || {}).map(s => ({ value: `notify.${s}`, label: `notify.${s}` }));
    const sources = [...Object.keys(SOURCE_LABELS), 'external'];
    const chip = (on: boolean, label: string, toggle: () => void, title = '') =>
      html`<button class="chip ${on ? 'on' : ''}" aria-pressed=${on} title=${title} @click=${toggle}>${label}</button>`;
    return html`<div class="shared">
      <div class="row">
        <ha-icon icon="mdi:send-outline"></ha-icon>
        <div class="label"><strong>Send to</strong><span class="secondary">Notify services. Priority, Replace and buttons work with the Home
          Assistant phone app (<code>notify.mobile_app_…</code> or a group of them); other services get the text only.</span></div>
        <div class="ctl"><hm-multi-picker .placeholder=${'Add a notify service…'} .options=${notifies} .value=${d.services}
          @value-changed=${(e: CustomEvent) => this.set(x => (x.services = e.detail.value))}></hm-multi-picker></div>
      </div>
      <div class="row">
        <ha-icon icon="mdi:filter-outline"></ha-icon>
        <div class="label"><strong>Not for changes by</strong><span class="secondary">Ticked sources send nothing (every event).</span></div>
        <div class="ctl chips">${sources.map(src => chip(d.skip_sources.includes(src), src === 'external' ? 'Outside House Modes' : SOURCE_LABELS[src],
          () => this.set(x => (x.skip_sources = x.skip_sources.includes(src) ? x.skip_sources.filter(v => v !== src) : [...x.skip_sources, src]))))}</div>
      </div>
      <div class="row">
        <ha-icon icon="mdi:home-search-outline"></ha-icon>
        <div class="label"><strong>Only for these modes</strong><span class="secondary">The mode it changes to (or would have). None ticked: every mode.</span></div>
        <div class="ctl chips">${this.modes.map(m => chip(d.only_modes.includes(m.id), m.name,
          () => this.set(x => (x.only_modes = x.only_modes.includes(m.id) ? x.only_modes.filter(v => v !== m.id) : [...x.only_modes, m.id]))))}</div>
      </div>
      <div class="row">
        <ha-icon icon="mdi:layers-outline"></ha-icon>
        <div class="label"><strong>Replace the previous message</strong><span class="secondary">A new message of the same event replaces the last one on the phone.</span></div>
        <div class="ctl"><ha-switch .checked=${d.replace} @change=${(e: any) => this.set(x => (x.replace = e.target.checked))}></ha-switch></div>
      </div>
      <div class="row">
        <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
        <div class="label"><strong>Who may use the buttons</strong><span class="secondary">Checked against the phone's Home Assistant user.</span></div>
        <div class="ctl">
          <select aria-label="Who may use the buttons" @change=${(e: any) => this.set(x => (x.button_users = e.target.value === 'admins' ? 'admins' : []))}>
            <option value="admins" ?selected=${d.button_users === 'admins'}>Administrators</option>
            <option value="users" ?selected=${d.button_users !== 'admins'}>These users</option>
          </select>
          ${d.button_users !== 'admins'
            ? html`<div class="chips" style="margin-top:6px">${this.users.map(u => chip((d.button_users as string[]).includes(u.id), u.name,
                () => this.set(x => {
                  const list = x.button_users as string[];
                  x.button_users = list.includes(u.id) ? list.filter(v => v !== u.id) : [...list, u.id];
                })))}</div>`
            : nothing}
        </div>
      </div>
    </div>`;
  }

  private renderEvent(ev: NotifyEvent, d: NotifySettings) {
    const e = d[ev];
    const info = EVENT_INFO[ev];
    const def = this.info!.defaults[ev];
    const covered = this.info!.covered[ev] || [];
    const changedText = e.title !== def.title || e.message !== def.message;
    return html`<details class="event ${e.enabled ? 'on' : ''}">
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <ha-icon icon=${info.icon}></ha-icon>
        <span class="ev-title">${info.title}</span>
        <span class="secondary" style="display:inline">${e.enabled ? `${PRIORITY_LABELS[e.priority].split(' ')[0]}${e.buttons.length ? ` · ${e.buttons.length} button${e.buttons.length === 1 ? '' : 's'}` : ''}` : 'off'}</span>
        ${covered.length && e.enabled ? html`<span class="warn-chip" title="Also sent by an Advanced notification">also sent by ${covered.join(', ')}</span>` : nothing}
        <span class="grow"></span>
        <ha-switch .checked=${e.enabled} @click=${(x: Event) => x.stopPropagation()}
          @change=${(x: any) => this.set(s => (s[ev].enabled = x.target.checked))}></ha-switch>
      </summary>
      <div class="ev-body">
        <p class="secondary">${info.hint}</p>
        ${covered.length && e.enabled
          ? html`<div class="notice warn">Also sent by ${covered.join(', ')} (Advanced): you get it twice.
              <button class="link" @click=${() => this.set(s => (s[ev].enabled = false))}>Turn the Simple one off</button></div>`
          : nothing}
        <label class="field">Title
          <input type="text" .value=${e.title} maxlength="200" @input=${(x: any) => this.set(s => (s[ev].title = x.target.value))} /></label>
        <label class="field">Message
          <textarea rows="2" maxlength="1000" .value=${e.message} @input=${(x: any) => this.set(s => (s[ev].message = x.target.value))}></textarea></label>
        <div class="secondary placeholders">Placeholders: ${this.info!.placeholders.map(p => html`<code title=${PLACEHOLDER_HELP[p] || ''}>{${p}}</code> `)}
          ${changedText ? html`· <button class="link" @click=${() => this.set(s => { s[ev].title = def.title; s[ev].message = def.message; })}>Reset the wording</button>` : nothing}</div>
        <label class="field inline">Priority
          <select @change=${(x: any) => this.set(s => (s[ev].priority = x.target.value))}>
            ${Object.entries(PRIORITY_LABELS).map(([k, v]) => html`<option value=${k} ?selected=${e.priority === k}>${v}</option>`)}
          </select></label>
        <div class="field">Buttons
          <div class="chips">${this.info!.buttons[ev].map(b => {
            const on = e.buttons.includes(b);
            return html`<button class="chip ${on ? 'on' : ''}" aria-pressed=${on}
              @click=${() => this.set(s => (s[ev].buttons = on ? s[ev].buttons.filter(v => v !== b) : [...s[ev].buttons, b]))}>${this.info!.button_titles[b]}</button>`;
          })}</div></div>
        <div class="toolbar"><ha-button appearance="plain" ?disabled=${!!this.busy} @click=${() => this.test(ev)}>
          <ha-icon slot="start" icon="mdi:send"></ha-icon>${this.busy === `test-${ev}` ? 'Sending…' : 'Send a test'}</ha-button>
          <span class="secondary" style="display:inline">with sample values, without buttons</span></div>
      </div>
    </details>`;
  }

  private renderAdvanced() {
    const items = this.info!.advanced;
    return html`<div class="advanced">
      <h4><ha-icon icon="mdi:robot-outline"></ha-icon>Advanced notifications</h4>
      <p class="secondary">Automations made from <code>${this.info!.blueprint}</code>: conditions (e.g. only when someone is home), Home
        Assistant templates, phones, priority, tag and any phone-app data. They are normal automations, with traces.</p>
      ${items.length
        ? items.map(i => html`<div class="adv-row">
            <ha-icon icon="mdi:bell-cog-outline"></ha-icon>
            <button class="link" @click=${() => i.edit_id && navigate(this, `/config/automation/edit/${i.edit_id}`)}>${i.name}</button>
            <span class="secondary" style="display:inline">${i.events.map(e => EVENT_INFO[e].title).join(', ') || 'no events'}
              · ${i.devices} phone${i.devices === 1 ? '' : 's'}, ${i.services} service${i.services === 1 ? '' : 's'}</span>
            <span class="grow"></span>
            <ha-switch .checked=${i.state === 'on'} @change=${(e: any) => this.toggleAdvanced(i.entity_id, e.target.checked)}></ha-switch>
          </div>`)
        : html`<div class="empty">None yet.</div>`}
      <div class="toolbar"><ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.addAdvanced}>
        <ha-icon slot="start" icon="mdi:plus"></ha-icon>Add an advanced notification</ha-button></div>
    </div>`;
  }

  static styles = [
    extStyles,
    css`
      :host { display: block; }
      .intro { display: block; margin: 4px 0 8px; }
      .shared { border-bottom: 1px solid var(--divider-color); margin-bottom: 4px; }
      .row { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-top: 1px solid var(--divider-color); }
      .row > ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 20px; margin-top: 2px; }
      .row .label { flex: 0 0 260px; display: flex; flex-direction: column; gap: 2px; }
      .row .ctl { flex: 1; min-width: 0; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .chip { border: 1px solid var(--divider-color); border-radius: 14px; padding: 3px 10px; background: none;
        color: var(--secondary-text-color); font: inherit; cursor: pointer; }
      .chip.on { border-color: var(--primary-color); color: var(--primary-text-color); background: rgba(var(--rgb-primary-color), 0.15); }
      details.event { border-top: 1px solid var(--divider-color); }
      details.event > summary { display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer; list-style: none; --mdc-icon-size: 20px; }
      details.event > summary::-webkit-details-marker { display: none; }
      details.event .chev { transition: transform 0.15s; color: var(--secondary-text-color); }
      details.event[open] .chev { transform: rotate(90deg); }
      details.event.on > summary > ha-icon:not(.chev) { color: var(--primary-color); }
      .ev-title { font-weight: 500; }
      .grow { flex: 1; }
      .warn-chip { font-size: 0.85em; color: var(--warning-color, #ffa600); border: 1px solid currentColor; border-radius: 10px; padding: 0 8px; }
      .ev-body { padding: 0 0 12px 30px; }
      .field { display: flex; flex-direction: column; gap: 4px; margin: 8px 0; }
      .field.inline { flex-direction: row; align-items: center; gap: 8px; }
      .field input, .field textarea { font: inherit; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--divider-color);
        background: var(--input-fill-color, var(--secondary-background-color)); color: var(--primary-text-color); }
      .placeholders code { cursor: help; }
      .savebar { padding: 10px 0; border-top: 1px solid var(--divider-color); }
      .advanced { border-top: 1px solid var(--divider-color); padding-top: 4px; }
      .advanced h4 { display: flex; align-items: center; gap: 6px; margin: 10px 0 4px; }
      .adv-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-top: 1px solid var(--divider-color); --mdc-icon-size: 20px; }
      @media (max-width: 700px) { .row { flex-direction: column; } .row .label { flex: none; } .ev-body { padding-left: 0; } }
    `,
  ];
}
