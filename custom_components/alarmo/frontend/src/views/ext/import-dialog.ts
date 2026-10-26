// Import / restore dialog: upload a file or pick a saved backup, choose
// Merge or Replace, preview the changes, then apply (backend backs up first).
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import {
  BackupInfo,
  ImportMode,
  ImportPreview,
  ImportSource,
  applyImport,
  formatDate,
  previewImport,
  wsErrorMessage,
} from '../../data/ext-websockets';
import { extStyles } from './ext-styles';

const SECTION_LABELS: Record<string, string> = {
  config: 'General settings',
  areas: 'Partitions',
  sensors: 'Zones',
  users: 'Users / codes',
  automations: 'Actions & notifications',
  sensor_groups: 'Cross-zone groups',
};

const show = (v: any) => (v === null || v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v));

@customElement('alarmo-ext-import-dialog')
export class AlarmoExtImportDialog extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) backups: BackupInfo[] = [];
  /** preselect a backup (Restore button) */
  @property() backupName = '';
  @property() initialMode: ImportMode = 'merge';

  @state() private sourceKind: 'file' | 'backup' = 'file';
  @state() private fileName = '';
  @state() private fileContent: string | null = null;
  @state() private selectedBackup = '';
  @state() private mode: ImportMode = 'merge';
  @state() private preview?: ImportPreview;
  @state() private busy = false;
  @state() private error = '';
  @state() private openSections: string[] = [];

  firstUpdated() {
    this.mode = this.initialMode;
    if (this.backupName) {
      this.sourceKind = 'backup';
      this.selectedBackup = this.backupName;
    } else if (this.backups.length) {
      this.selectedBackup = this.backups[0].name;
    }
  }

  private source(): ImportSource | null {
    if (this.sourceKind === 'backup') return this.selectedBackup ? { backup_name: this.selectedBackup } : null;
    return this.fileContent !== null ? { content: this.fileContent } : null;
  }

  private reset() {
    this.preview = undefined;
    this.error = '';
  }

  render() {
    return html`
      <div class="overlay" @click=${(ev: Event) => ev.target === ev.currentTarget && !this.busy && this.close()}>
        <div class="modal" role="dialog" aria-label="Import or restore">
          <h2>Import / restore configuration</h2>
          <div class="body">${this.preview ? this.renderPreview(this.preview) : this.renderSource()}</div>
          <div class="footer">${this.renderFooter()}</div>
        </div>
      </div>
    `;
  }

  private renderSource() {
    return html`
      <p>
        <label>
          <input type="radio" name="src" .checked=${this.sourceKind === 'file'} @change=${() => ((this.sourceKind = 'file'), this.reset())} />
          Upload a file (YAML export or <code>alarmo.storage</code>)
        </label>
      </p>
      ${this.sourceKind === 'file'
        ? html`
            <p style="margin-left:24px">
              <input type="file" accept=".yaml,.yml,.json,.storage,text/yaml,application/json" aria-label="File to import" @change=${this.pickFile} />
              ${this.fileName ? html`<span class="secondary">${this.fileName}</span>` : nothing}
            </p>
          `
        : nothing}
      <p>
        <label>
          <input
            type="radio"
            name="src"
            ?disabled=${!this.backups.length}
            .checked=${this.sourceKind === 'backup'}
            @change=${() => ((this.sourceKind = 'backup'), this.reset())}
          />
          A saved backup ${this.backups.length ? `(${this.backups.length} available)` : '(none yet)'}
        </label>
      </p>
      ${this.sourceKind === 'backup'
        ? html`
            <p style="margin-left:24px">
              <select aria-label="Backup" @change=${(e: any) => ((this.selectedBackup = e.target.value), this.reset())}>
                ${this.backups.map(
                  b => html`
                    <option value=${b.name} ?selected=${b.name === this.selectedBackup}>
                      ${formatDate(b.created, this.hass.language)}${b.label ? ` — ${b.label}` : ''}
                    </option>
                  `
                )}
              </select>
            </p>
          `
        : nothing}
      <h3 style="font-weight:500;margin:16px 0 4px">How to apply it</h3>
      <p>
        <label>
          <input type="radio" name="mode" .checked=${this.mode === 'merge'} @change=${() => ((this.mode = 'merge'), this.reset())} />
          <strong>Merge</strong> — add and update what is in the file; keep everything else.
        </label>
      </p>
      <p>
        <label>
          <input type="radio" name="mode" .checked=${this.mode === 'replace'} @change=${() => ((this.mode = 'replace'), this.reset())} />
          <strong>Replace</strong> — the file becomes the complete configuration; anything not in it is removed.
        </label>
      </p>
      ${this.error ? html`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>` : nothing}
    `;
  }

  private renderPreview(p: ImportPreview) {
    if (!p.ok && !p.sections) {
      return html`
        <div class="notice error" style="margin:8px 0">
          <strong>This file cannot be imported:</strong>
          <ul>${p.errors.map(e => html`<li>${e}</li>`)}</ul>
        </div>
      `;
    }
    const sections = p.sections || {};
    return html`
      <p class="secondary" style="display:block">
        ${p.format === 'storage' ? 'alarmo.storage file' : 'YAML export'} · storage ${p.source_version}
        ${p.exported_at ? html` · exported ${formatDate(p.exported_at, this.hass.language)}` : nothing}
        ${p.alarmo_version ? html` · Alarmo ${p.alarmo_version}` : nothing} · mode <strong>${p.mode}</strong>
      </p>
      ${p.blocked_by && p.blocked_by.length
        ? html`<div class="notice error" style="margin:8px 0">
            <strong>Disarm first.</strong> Import and restore are blocked while armed, arming, pending or triggered:
            ${p.blocked_by.join(', ')}
          </div>`
        : nothing}
      ${p.errors.length
        ? html`<div class="notice error" style="margin:8px 0">
            <strong>Problems that must be fixed first:</strong>
            <ul>${p.errors.map(e => html`<li>${e}</li>`)}</ul>
          </div>`
        : nothing}
      ${p.warnings && p.warnings.length
        ? html`<div class="notice warn" style="margin:8px 0">
            <strong>Warnings:</strong>
            <ul>${p.warnings.map(e => html`<li>${e}</li>`)}</ul>
          </div>`
        : nothing}
      ${p.extras_included
        ? html`<div class="notice" style="margin:8px 0">
            <strong>Also restores Alarmo ext settings:</strong>
            ${p.extras_changes && p.extras_changes.length
              ? html`<ul style="margin:4px 0">${p.extras_changes.map(c => html`<li>${c.label}</li>`)}</ul>`
              : html` unchanged.`}
            <span class="secondary" style="display:block">The current House Mode and its history stay as they are.</span>
          </div>`
        : html`<div class="notice" style="margin:8px 0">This file has no Alarmo ext settings (House Modes, physical panel,
            zone rules, mirrors); those stay as they are.</div>`}
      ${!p.total_changes
        ? html`<div class="notice" style="margin:8px 0">No changes — the file matches the current configuration.</div>`
        : nothing}
      <table>
        <thead>
          <tr><th>Section</th><th class="c">Added</th><th class="c">Changed</th><th class="c">Removed</th><th></th></tr>
        </thead>
        <tbody>
          ${Object.entries(sections).map(([name, sec]) => {
            const total = sec.added.length + sec.changed.length + sec.removed.length;
            const open = this.openSections.includes(name);
            return html`
              <tr>
                <td>${SECTION_LABELS[name] || name}</td>
                <td class="c">${sec.added.length ? html`<span class="badge new">${sec.added.length}</span>` : '0'}</td>
                <td class="c">${sec.changed.length ? html`<span class="badge">${sec.changed.length}</span>` : '0'}</td>
                <td class="c">${sec.removed.length ? html`<span class="badge removed">${sec.removed.length}</span>` : '0'}</td>
                <td>
                  ${total
                    ? html`<button class="link" @click=${() => (this.openSections = open ? this.openSections.filter(s => s !== name) : [...this.openSections, name])}>
                        ${open ? 'Hide' : 'Details'}
                      </button>`
                    : nothing}
                </td>
              </tr>
              ${open
                ? html`<tr class="detail"><td colspan="5">
                    ${sec.added.map(a => html`<div class="status-icon new">+ ${a.label}</div>`)}
                    ${sec.removed.map(a => html`<div class="status-icon removed">− ${a.label}</div>`)}
                    ${sec.changed.map(
                      c => html`<div style="margin:4px 0">
                        <span class="status-icon changed">✎ ${c.label}</span>
                        <ul style="margin:2px 0">
                          ${c.fields.map(f => html`<li><code>${f.field}</code>: ${show(f.old)} → <strong>${show(f.new)}</strong></li>`)}
                        </ul>
                      </div>`
                    )}
                  </td></tr>`
                : nothing}
            `;
          })}
        </tbody>
      </table>
      <p class="secondary" style="display:block;margin-top:12px">
        Applying makes a backup of the current configuration first, then reloads Alarmo (alarm entities are
        unavailable for a few seconds).
      </p>
      ${this.error ? html`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>` : nothing}
    `;
  }

  private renderFooter() {
    const p = this.preview;
    if (!p) {
      return html`
        <ha-button appearance="plain" @click=${this.close}>Cancel</ha-button>
        <ha-button ?disabled=${this.busy || !this.source()} @click=${this.runPreview}>
          ${this.busy ? 'Checking…' : 'Preview changes'}
        </ha-button>
      `;
    }
    const blocked = !!(p.blocked_by && p.blocked_by.length);
    const canApply = p.ok && !blocked && !!p.total_changes && !this.busy;
    return html`
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.reset}>Back</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.runPreview}>Check again</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
      <ha-button ?disabled=${!canApply} variant=${p.mode === 'replace' ? 'danger' : 'brand'} @click=${this.apply}>
        ${this.busy ? 'Applying…' : `${p.mode === 'replace' ? 'Replace' : 'Merge'} ${p.total_changes || 0} change(s)`}
      </ha-button>
    `;
  }

  private async pickFile(ev: any) {
    const file: File | undefined = ev.target.files && ev.target.files[0];
    this.reset();
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'File is too large (over 5 MB) to be an Alarmo configuration.';
      return;
    }
    this.fileName = file.name;
    this.fileContent = await file.text();
  }

  private async runPreview() {
    const src = this.source();
    if (!src) return;
    this.busy = true;
    this.error = '';
    try {
      this.preview = await previewImport(this.hass, src, this.mode);
      this.openSections = [];
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  private async apply() {
    const src = this.source();
    const p = this.preview;
    if (!src || !p || !p.token) return;
    const what = p.mode === 'replace' ? 'REPLACE the whole Alarmo configuration' : 'merge these changes into Alarmo';
    if (!window.confirm(`This will ${what} (${p.total_changes} change(s)). A backup is made first. Continue?`)) return;
    this.busy = true;
    this.error = '';
    try {
      const res = await applyImport(this.hass, src, p.mode!, p.token);
      this.dispatchEvent(new CustomEvent('imported', { detail: res }));
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
