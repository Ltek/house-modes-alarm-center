// Alarm & panel alerts: ready-made Smart Repeating Alerts, created in one click. Shown on the Notifications tab and as
// a Quick Start step. Backend: alert_offers.py builds the automation configs; they are saved here through Home
// Assistant's automation config API (as if made in the editor). Nothing is created until Create is pressed.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { navigate } from '../../helpers';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import { newAutomationId } from '../../data/alerts';
import { extStyles } from './ext-styles';

type Offer = {
  id: string;
  title: string;
  text: string;
  critical: boolean;
  disarm: boolean;
  status: 'created' | 'covered' | 'available';
  automation: { entity_id: string; edit_id: string | null; name: string; state: string } | null;
  covered_by: string[];
  notified_once_by: string[];
};
type Phone = { device_id: string; name: string; service: string };
type Payload = { offers: Offer[]; phones: Phone[]; default_phones: string[] };

@customElement('hm-alert-offers')
export class HmAlertOffers extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  /** compact: inside a Quick Start step */
  @property({ type: Boolean }) compact = false;

  @state() private data?: Payload;
  @state() private pick: Record<string, boolean> = {};
  @state() private phones: string[] = [];
  @state() private disarm = true;
  @state() private busy = false;
  @state() private error = '';

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      const d = await this.hass.callWS<Payload>({ type: 'house_modes/ext/alert_offers/get' });
      this.data = d;
      // ticked: recommended and not covered by the user's own automation
      const pick: Record<string, boolean> = {};
      for (const o of d.offers) if (o.status !== 'created') pick[o.id] = o.status === 'available';
      this.pick = pick;
      this.phones = this.phones.length ? this.phones : d.default_phones;
      this.error = '';
      this.dispatchEvent(new CustomEvent('offers-changed', { bubbles: true, composed: true }));
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async create() {
    const ids = Object.entries(this.pick).filter(([, on]) => on).map(([id]) => id);
    if (!ids.length) return;
    if (!this.phones.length) {
      this.error = 'Choose at least one phone.';
      return;
    }
    const names = this.data!.phones.filter(p => this.phones.includes(p.device_id)).map(p => p.name);
    const titles = this.data!.offers.filter(o => ids.includes(o.id)).map(o => o.title);
    if (!window.confirm(`Create ${ids.length} repeating alert(s)?\n\n• ${titles.join('\n• ')}\n\nSent to: ${names.join(', ')}.\nThey are normal Smart Repeating Alerts automations: change or delete them like any other.`)) return;
    this.busy = true;
    try {
      const res = await this.hass.callWS<{ configs: { offer: string; config: Record<string, unknown> }[] }>({
        type: 'house_modes/ext/alert_offers/build',
        offers: ids,
        devices: this.phones,
        disarm_button: this.disarm,
      });
      let n = 0;
      for (const c of res.configs) {
        // distinct ids when several are saved in the same millisecond
        const id = `${newAutomationId()}${n}`;
        await this.hass.callApi('POST', `config/automation/config/${id}`, c.config);
        n += 1;
      }
      toast(this, `Created ${n} repeating alert(s).`);
      await new Promise(r => setTimeout(r, 800)); // the automations reload
      await this.load();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  render() {
    const d = this.data;
    if (!d) return this.error ? html`<div class="notice error">${this.error}</div>` : html`<div class="empty">Loading…</div>`;
    if (!d.offers.length) return html`<p class="secondary">No alarm or panel to alert on yet.</p>`;
    const open = d.offers.filter(o => o.status !== 'created');
    const n = Object.values(this.pick).filter(Boolean).length;
    return html`
      ${this.error ? html`<div class="notice error">${this.error}</div>` : nothing}
      ${this.compact
        ? nothing
        : html`<p class="secondary intro">Alerts for real problems, repeated until the problem ends or someone presses
            <em>Stop alerts</em>. Each is a <em>Smart Repeating Alerts</em> automation, made for this system in one click.</p>`}
      <div class="rows">${d.offers.map(o => this.row(o))}</div>
      ${open.length
        ? html`<div class="opts">
            <div class="field"><strong>Send to</strong>
              <div class="chips">${d.phones.length
                ? d.phones.map(p => {
                    const on = this.phones.includes(p.device_id);
                    return html`<button class="chip ${on ? 'on' : ''}" aria-pressed=${on}
                      @click=${() => (this.phones = on ? this.phones.filter(x => x !== p.device_id) : [...this.phones, p.device_id])}>${p.name}</button>`;
                  })
                : html`<span class="secondary">No phone with the Home Assistant app found.</span>`}</div></div>
            ${open.some(o => o.disarm)
              ? html`<label class="check"><input type="checkbox" .checked=${this.disarm} @change=${(e: any) => (this.disarm = e.target.checked)} />
                  <span><span><strong>Disarm / Silence</strong> button on Alarm, Fire and Panic</span>
                    <span class="secondary">Disarms the physical panel. On Android anyone holding the phone can press it; on iPhone
                      it asks for Face ID or the passcode.</span></span></label>`
              : nothing}
            <div class="toolbar"><ha-button ?disabled=${!n || this.busy || !this.phones.length} @click=${this.create}>
              <ha-icon slot="start" icon="mdi:bell-plus-outline"></ha-icon>${this.busy ? 'Creating…' : `Create ${n} alert${n === 1 ? '' : 's'}`}</ha-button></div>
          </div>`
        : nothing}`;
  }

  private row(o: Offer) {
    const edit = o.automation?.edit_id ? `/config/automation/edit/${o.automation.edit_id}` : null;
    return html`<div class="row ${o.status}">
      ${o.status === 'created'
        ? html`<ha-icon class="ok" icon="mdi:check-circle"></ha-icon>`
        : html`<input type="checkbox" aria-label=${o.title} .checked=${!!this.pick[o.id]}
            @change=${(e: any) => (this.pick = { ...this.pick, [o.id]: e.target.checked })} />`}
      <div class="body">
        <div><strong>${o.title}</strong>${o.critical ? html` <span class="crit">critical</span>` : nothing}
          ${o.status === 'created' && edit
            ? html` · <a href=${edit} @click=${(e: Event) => { e.preventDefault(); navigate(this, edit); }}>Open</a>
                ${o.automation!.state !== 'on' ? html`<span class="secondary"> (turned off)</span>` : nothing}`
            : nothing}</div>
        ${this.compact && o.status === 'created' ? nothing : html`<div class="secondary">${o.text}</div>`}
        ${o.status === 'covered'
          ? html`<div class="note">Already covered by your automation ${o.covered_by.join(', ')}: tick it to create one anyway
              (then turn yours off, or you get both).</div>`
          : nothing}
        ${o.status === 'available' && o.notified_once_by.length
          ? html`<div class="secondary">Your notification ${o.notified_once_by.join(', ')} tells you once; this repeats until you act.</div>`
          : nothing}
      </div>
    </div>`;
  }

  static styles = [
    extStyles,
    css`
      :host { display: block; }
      .intro { display: block; margin: 0 0 8px; }
      .row { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; border-top: 1px solid var(--divider-color); }
      .row input { margin-top: 3px; }
      .row ha-icon.ok { color: var(--success-color, #43a047); --mdc-icon-size: 18px; }
      .body { flex: 1; min-width: 0; }
      .crit { font-size: 0.8em; color: var(--error-color, #f44336); border: 1px solid currentColor; border-radius: 8px; padding: 0 6px; }
      .note { color: var(--warning-color, #ffa600); font-size: 0.9em; }
      .opts { border-top: 1px solid var(--divider-color); padding-top: 8px; margin-top: 4px; }
      .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .chip { border: 1px solid var(--divider-color); border-radius: 14px; padding: 3px 10px; background: none;
        color: var(--secondary-text-color); font: inherit; cursor: pointer; }
      .chip.on { border-color: var(--primary-color); color: var(--primary-text-color); background: rgba(var(--rgb-primary-color), 0.15); }
      .check { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; }
      .check > span { display: flex; flex-direction: column; }
    `,
  ];
}
