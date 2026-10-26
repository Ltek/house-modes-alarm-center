// Preview of pending rule changes. Apply backs up first. Emits `applied` / `close`.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { wsErrorMessage } from '../../data/ext-websockets';
import { RulesPreview, applyRules } from '../../data/zone-rules';
import { extStyles } from './ext-styles';

const show = (v: any) => (v === null || v === undefined ? '—' : Array.isArray(v) ? v.join(', ') || 'none' : String(v));

@customElement('alarmo-ext-rules-preview')
export class AlarmoExtRulesPreview extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) preview!: RulesPreview;
  @property({ attribute: false }) current: Record<string, Record<string, any>> = {};
  @property({ attribute: false }) partitionNames: Record<string, string> = {};
  /** reason Apply is not allowed right now (e.g. unsaved zone-table drafts) */
  @property() blockedReason = '';

  @state() private busy = false;
  @state() private error = '';

  private name(id: string) {
    const st = this.hass.states[id];
    return (st && st.attributes.friendly_name) || id;
  }

  private value(field: string, v: any) {
    return field === 'area' ? this.partitionNames[v] || v : show(v);
  }

  render() {
    const p = this.preview;
    const rn = (ids: string[]) => ids.map(id => p.rule_names[id] || id).join(', ');
    return html`
      <div class="overlay" @click=${(ev: Event) => ev.target === ev.currentTarget && !this.busy && this.close()}>
        <div class="modal" role="dialog" aria-label="Pending rule changes">
          <h2>Pending rule changes (${p.total_changes})</h2>
          <div class="body">
            ${p.create.length
              ? html`<h3 style="font-weight:500">New zones (${p.create.length})</h3>
                  ${p.create.map(
                    c => html`<div class="status-icon new">
                      + ${this.name(c.entity_id)} <span class="secondary" style="display:inline">${c.entity_id}</span>
                      — ${Object.entries(c)
                        .filter(([k]) => k !== 'entity_id')
                        .map(([k, v]) => `${k}: ${this.value(k, v)}`)
                        .join(' · ')}
                    </div>`
                  )}`
              : nothing}
            ${p.update.length
              ? html`<h3 style="font-weight:500">Changed zones (${p.update.length})</h3>
                  ${p.update.map(
                    u => html`<div style="margin:4px 0">
                      <span class="status-icon changed">✎ ${this.name(u.entity_id)}</span>
                      <span class="secondary" style="display:inline">${u.entity_id} · ${rn(p.zones[u.entity_id]?.rules || [])}</span>
                      <ul style="margin:2px 0">
                        ${Object.entries(u.changes).map(
                          ([k, v]) =>
                            html`<li><code>${k}</code>: ${this.value(k, (this.current[u.entity_id] || {})[k])} →
                              <strong>${this.value(k, v)}</strong></li>`
                        )}
                      </ul>
                    </div>`
                  )}`
              : nothing}
            ${!p.total_changes ? html`<div class="notice">Zones already match the rules.</div>` : nothing}
            ${p.conflicts.length
              ? html`<div class="notice error" style="margin:8px 0">
                  <strong>Conflicts (not applied):</strong>
                  ${p.conflicts.map(
                    c => html`<div>${this.name(c.entity_id)} — <code>${c.field}</code>:
                      ${c.reason || `rules ${rn(c.rules)} disagree (${c.values.map(v => this.value(c.field, v)).join(' vs ')})`}</div>`
                  )}
                  <div class="secondary" style="display:block">Make one rule more specific, or set the value by hand in the table (an override).</div>
                </div>`
              : nothing}
            ${p.needs_partition.length
              ? html`<div class="notice warn" style="margin:8px 0">
                  Matched but not added — no rule sets their partition:
                  ${p.needs_partition.map(id => html`<div>${this.name(id)} <code>${id}</code></div>`)}
                </div>`
              : nothing}
            <p class="secondary" style="display:block">
              Rules never remove zones. ${p.unmanaged.length} configured zone(s) are not matched by any rule and are left as they are.
              Applying makes a backup first.
            </p>
            ${this.blockedReason ? html`<div class="notice warn" style="margin:8px 0">${this.blockedReason}</div>` : nothing}
            ${this.error ? html`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>` : nothing}
          </div>
          <div class="footer">
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Close</ha-button>
            <ha-button ?disabled=${this.busy || !p.total_changes || !!this.blockedReason} @click=${this.apply}>
              ${this.busy ? 'Applying…' : `Apply ${p.total_changes} change(s)`}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }

  private async apply() {
    this.busy = true;
    this.error = '';
    try {
      const res = await applyRules(this.hass, this.preview.token);
      this.dispatchEvent(new CustomEvent('applied', { detail: res }));
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  static styles = extStyles;
}
