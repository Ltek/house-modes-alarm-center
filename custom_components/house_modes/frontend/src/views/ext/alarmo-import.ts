// "Import from Alarmo?" (Quick Start, first start after install) and the same choice on the Backup tab, plus the
// rewrite of Alarmo names in automations, scripts and dashboards. See data/alarmo-import.ts.
import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { toast, wsErrorMessage } from '../../data/ext-websockets';
import {
  ImportStatus,
  RefScan,
  applyReferences,
  countsText,
  fetchImportStatus,
  runImport,
  scanReferences,
  startFresh,
  undoReferences,
} from '../../data/alarmo-import';
import { extStyles } from './ext-styles';

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '');

@customElement('hm-alarmo-import')
export class HmAlarmoImport extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  /** 'ask': Quick Start (only shown while the question is open or right after the import); 'backup': always */
  @property() mode: 'ask' | 'backup' = 'ask';

  @state() private status?: ImportStatus;
  @state() private scan?: RefScan;
  @state() private busy = '';
  @state() private error = '';
  /** the import ran in this view: Quick Start keeps showing the result and the next step */
  @state() private justImported = false;

  firstUpdated() {
    this.load();
  }

  private async load() {
    try {
      this.status = await fetchImportStatus(this.hass);
      this.error = '';
      this.dispatchEvent(new CustomEvent('import-status', { detail: this.status, bubbles: true, composed: true }));
      // after the import the scan runs by itself (it only reads); Rewrite still needs a click and a confirm
      if (this.mode === 'backup' && this.status.choice === 'imported' && !this.scan && !this.busy) await this.doScan();
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  /** Quick Start re-reads its steps */
  private changed() {
    this.dispatchEvent(new CustomEvent('alarmo-import-changed', { bubbles: true, composed: true }));
  }

  private async doImport() {
    const s = this.status!;
    const replace = s.choice === 'fresh';
    const msg =
      `Import from ${s.kind === 'fork' ? 'the Alarmo-based House Modes build' : 'Alarmo'}?\n\n` +
      `${countsText(s.counts)}\n\n` +
      (replace ? 'This replaces the current configuration of this integration (a backup is made first).\n\n' : '') +
      'The Alarmo files are only read: they are not changed, moved or deleted. Activity and backups are copied to ' +
      '/config/house_modes/.';
    if (!window.confirm(msg)) return;
    this.busy = 'import';
    try {
      await runImport(this.hass);
      this.justImported = true;
      toast(this, 'Imported from Alarmo. Check the House Mode, then disarm and arm once.');
      // the integration reloads after the import
      await new Promise(r => setTimeout(r, 1500));
      this.busy = '';
      await this.load();
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async doFresh() {
    if (!window.confirm('Start fresh, without the Alarmo configuration?\n\nYou can still import it later from the Backup tab while the Alarmo files exist.')) return;
    this.busy = 'fresh';
    try {
      await startFresh(this.hass);
      await this.load();
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async doScan() {
    this.busy = 'scan';
    try {
      this.scan = await scanReferences(this.hass);
      this.error = '';
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async doRewrite() {
    const s = this.scan!;
    const files = s.files.filter(f => f.hits.length).map(f => f.file);
    const boards = s.dashboards.filter(d => d.hits.length && d.mode === 'storage').map(d => d.url_path || 'Overview');
    if (!window.confirm(`Rewrite ${s.total} Alarmo name(s)?\n\nFiles: ${files.join(', ') || 'none'}\nDashboards: ${boards.join(', ') || 'none'}\n\nA copy of each is kept; Undo puts them back.`)) return;
    this.busy = 'rewrite';
    try {
      const res = await applyReferences(this.hass, s.token);
      toast(this, res.restart.length ? `Rewritten. Restart Home Assistant for: ${res.restart.join(', ')}` : 'Rewritten and reloaded.');
      this.busy = '';
      await this.doScan();
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  private async doUndo() {
    if (!window.confirm('Put the automations, scripts and dashboards back as they were before the rewrite?\n\nDo this before going back to Alarmo.')) return;
    this.busy = 'undo';
    try {
      const res = await undoReferences(this.hass);
      toast(this, res.restart.length ? `Put back. Restart Home Assistant for: ${res.restart.join(', ')}` : 'Put back and reloaded.');
      this.busy = '';
      await this.doScan();
      this.changed();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = '';
    }
  }

  render() {
    const s = this.status;
    if (!s) return this.error ? html`<div class="notice error">${this.error}</div>` : nothing;
    if (this.mode === 'ask' && !s.ask && !this.justImported) return nothing;
    if (!s.found && s.choice !== 'imported') return this.mode === 'backup' ? html`<p class="secondary">No Alarmo files found (.storage/alarmo.storage, .storage/alarmo_extras).</p>` : nothing;
    return html`
      ${this.error ? html`<div class="notice error" style="white-space:pre-line">${this.error}</div>` : nothing}
      ${s.choice === 'imported' ? this.renderImported(s) : this.renderQuestion(s)}
      ${s.choice === 'imported' ? this.renderReferences() : nothing}
    `;
  }

  private renderOldEntry(s: ImportStatus) {
    if (!s.old_entries.length) return nothing;
    return s.old_active
      ? html`<div class="notice warn">The <strong>Alarmo</strong> integration is still enabled. Disable it first: Settings →
          Devices &amp; services → Alarmo → ⋮ → <strong>Disable</strong>. The two must never run at the same time (double
          arming, double keypresses to the panel); until then this integration's panel link stays in Shadow.</div>`
      : html`<p class="secondary">The Alarmo integration is disabled. To go back: disable this integration, then enable Alarmo again.</p>`;
  }

  private renderQuestion(s: ImportStatus) {
    const what = s.kind === 'fork' ? 'the Alarmo-based House Modes build (with House Modes)' : 'Alarmo (no House Modes)';
    return html`
      <div class="import ${this.mode}">
        <h3><ha-icon icon="mdi:database-import-outline"></ha-icon>Import from Alarmo?</h3>
        <p>Found a configuration from ${what}:</p>
        <p class="counts">${countsText(s.counts) || 'no partitions or zones'}</p>
        ${s.folders.activity || s.folders.backups
          ? html`<p class="secondary">Also ${s.folders.activity} Activity day(s) and ${s.folders.backups} backup file(s) in /config/alarmo/: they are copied.</p>`
          : nothing}
        <p class="secondary">Import copies it into this integration: user codes stay as they are (hashed), service and event
          names are updated. The Alarmo files are only read and stay as they are, so going back to Alarmo is always possible.</p>
        ${this.renderOldEntry(s)}
        ${s.choice === 'fresh' ? html`<p class="secondary">You chose <em>Start fresh</em> on ${when(s.at)}. Importing now replaces the current configuration (a backup is made first).</p>` : nothing}
        <div class="toolbar">
          <ha-button ?disabled=${!!this.busy || s.old_active} @click=${this.doImport}>
            <ha-icon slot="start" icon="mdi:database-import-outline"></ha-icon>${this.busy === 'import' ? 'Importing…' : 'Import'}
          </ha-button>
          ${s.choice !== 'fresh'
            ? html`<ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doFresh}>Start fresh</ha-button>`
            : nothing}
        </div>
      </div>`;
  }

  private renderImported(s: ImportStatus) {
    const imp = s.imported;
    return html`
      <div class="import done">
        <h3><ha-icon icon="mdi:check-circle"></ha-icon>Imported from Alarmo</h3>
        <p>On ${when(s.at)}${imp ? html`, from ${imp.kind === 'fork' ? 'the Alarmo-based House Modes build' : 'Alarmo'}:` : ''}</p>
        ${imp ? html`<p class="counts">${countsText(imp.counts)}</p>
          <p class="secondary">Copied ${imp.copied.activity} Activity day(s) and ${imp.copied.backups} backup file(s) to /config/house_modes/.
            Backup before the import: ${imp.backup}.</p>` : nothing}
        ${this.renderOldEntry(s)}
      </div>`;
  }

  private renderReferences() {
    const s = this.scan;
    return html`
      <div class="import refs">
        <h4>Alarmo names in your automations, scripts and dashboards</h4>
        <p class="secondary">Automations may still call <code>alarmo.set_house_mode</code>, listen for
          <code>alarmo_house_mode_changed</code> or read <code>select.alarmo_house_mode</code>. They are scanned right after the
          import and listed below; nothing changes until you press Rewrite. A copy of every file and dashboard is kept, and
          Undo puts them back.</p>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doScan}>${this.busy === 'scan' ? 'Scanning…' : s ? 'Scan again' : 'Scan'}</ha-button>
          ${s && s.total ? html`<ha-button ?disabled=${!!this.busy} @click=${this.doRewrite}>${this.busy === 'rewrite' ? 'Rewriting…' : `Rewrite ${s.total}`}</ha-button>` : nothing}
          ${s?.last ? html`<span class="grow"></span><ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doUndo}>Undo the rewrite of ${when(s.last.at)}</ha-button>` : nothing}
        </div>
        ${s ? this.renderScan(s) : nothing}
      </div>`;
  }

  private renderScan(s: RefScan) {
    if (!s.files.length && !s.dashboards.length) return html`<p class="secondary">No Alarmo names found.</p>`;
    return html`
      ${s.files.map(f => html`<details class="ref">
        <summary><code>${f.file}</code> <span class="secondary" style="display:inline">· ${f.hits.length} to rewrite${f.other.length ? ` · ${f.other.length} other mention(s), left as they are` : ''}</span></summary>
        <table>
          ${f.hits.map(h => html`<tr><td class="num">${h.line}</td><td>${h.kind}</td><td><code>${h.old}</code> → <code>${h.new}</code></td></tr>`)}
          ${f.other.map(o => html`<tr class="other"><td class="num">${o.line}</td><td>left as is</td><td><code>${o.text}</code></td></tr>`)}
          ${f.cards.map(n => html`<tr class="other"><td class="num">${n}</td><td>by hand</td><td>custom:alarmo-card is not part of this integration: use custom:house-modes-alarm-center-card</td></tr>`)}
        </table>
      </details>`)}
      ${s.dashboards.map(d => html`<details class="ref">
        <summary>Dashboard <code>${d.url_path || 'Overview'}</code> <span class="secondary" style="display:inline">· ${d.hits.length} to rewrite${d.mode !== 'storage' ? ' (YAML mode: change it by hand)' : ''}${d.cards ? ` · ${d.cards} custom:alarmo-card (by hand)` : ''}</span></summary>
        <table>${d.hits.map(h => html`<tr><td>${h.kind}</td><td><code>${h.old}</code> → <code>${h.new}</code></td></tr>`)}</table>
      </details>`)}`;
  }

  static styles = [
    extStyles,
    css`
      :host {
        display: block;
      }
      .import {
        padding: 4px 16px 12px;
      }
      .import.ask {
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        margin: 0 0 12px;
        padding: 4px 16px 12px;
        background: var(--card-background-color);
      }
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0 4px;
        font-size: 1.1em;
      }
      .import.done h3 ha-icon {
        color: var(--success-color, #43a047);
      }
      h4 {
        margin: 12px 0 4px;
      }
      .counts {
        font-weight: 500;
      }
      .ref summary {
        cursor: pointer;
        padding: 4px 0;
      }
      .ref table {
        border-collapse: collapse;
        width: 100%;
        font-size: 0.9em;
      }
      .ref td {
        padding: 2px 6px;
        border-top: 1px solid var(--divider-color);
        vertical-align: top;
        word-break: break-word;
      }
      .ref td.num {
        width: 3em;
        text-align: right;
        color: var(--secondary-text-color);
      }
      .ref tr.other {
        color: var(--secondary-text-color);
      }
    `,
  ];
}
