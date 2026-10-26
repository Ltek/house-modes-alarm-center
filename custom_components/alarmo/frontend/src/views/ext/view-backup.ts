// Backup tab: create / list / download / delete backups, retention setting,
// browser export, and the import/restore dialog.
import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { mdiDeleteOutline, mdiDownload, mdiBackupRestore } from '@mdi/js';
import { HomeAssistant } from '../../types';
import { Path } from '../../common/navigation';
import {
  BackupInfo,
  ExtSettings,
  ImportMode,
  createBackup,
  deleteBackup,
  downloadBackupFile,
  downloadText,
  exportYaml,
  fetchExtInfo,
  formatBytes,
  formatDate,
  listBackups,
  saveBackupSettings,
  toast,
  wsErrorMessage,
} from '../../data/ext-websockets';
import { extStyles } from './ext-styles';
import './slider-field';
import { sectionHead } from './page-intro';
import './import-dialog';

@customElement('alarm-view-backup')
export class AlarmViewBackup extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) path?: Path;

  @state() private backups: BackupInfo[] = [];
  @state() private settings: ExtSettings = { retention_days: 30 };
  @state() private retentionInput = '30';
  @state() private backupDir = '';
  @state() private label = '';
  @state() private busy = false;
  @state() private error = '';
  @state() private loaded = false;
  @state() private dialog: { backupName: string; mode: ImportMode } | null = null;

  firstUpdated() {
    this.refresh();
  }

  private async refresh() {
    try {
      const [info, list] = await Promise.all([fetchExtInfo(this.hass), listBackups(this.hass)]);
      this.backupDir = info.backup_dir;
      this.backups = list.backups;
      this.settings = list.settings;
      this.retentionInput = String(list.settings.retention_days);
      this.loaded = true;
    } catch (err) {
      this.error = wsErrorMessage(err);
    }
  }

  private async run(fn: () => Promise<void>) {
    this.busy = true;
    this.error = '';
    try {
      await fn();
    } catch (err) {
      this.error = wsErrorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  render() {
    if (!this.hass) return nothing;
    const retentionChanged = this.retentionInput !== String(this.settings.retention_days);
    return html`
      <ha-card>${sectionHead('Backup & restore', 'settings')}
        <div class="card-content desc">
          <p>A backup is a copy of the whole Alarmo configuration: partitions, zones, users, notifications, actions and the ext settings.</p>
          <ul>
            <li>One is made automatically before every save on these pages and before every import.</li>
            <li>You can also make one here, download the configuration as YAML, or import / restore one.</li>
            <li>It includes the House Mode, physical panel, mirror and zone rule settings (backups made before ext.11 do not).</li>
          </ul>
        </div>
        <div class="notice warn">
          Backups and exports contain the <strong>hashed user codes</strong>. Keep the files private.
        </div>
        ${this.error ? html`<div class="notice error" style="white-space:pre-line">${this.error}</div>` : nothing}
        <div class="toolbar">
          <input
            type="text"
            placeholder="Optional label"
            aria-label="Backup label"
            maxlength="32"
            .value=${this.label}
            @input=${(e: any) => (this.label = e.target.value)}
          />
          <ha-button ?disabled=${this.busy} @click=${this.create}>Create backup now</ha-button>
          <span class="grow"></span>
          <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.exportNow}>Export (download YAML)</ha-button>
          <ha-button appearance="plain" ?disabled=${this.busy} @click=${() => (this.dialog = { backupName: '', mode: 'merge' })}>
            Import / restore…
          </ha-button>
        </div>
        <div class="toolbar">
          <alarmo-ext-slider
            .label=${'Delete backups older than'}
            .min=${1}
            .max=${365}
            unit="days"
            optional
            offText="keep forever"
            .onValue=${30}
            .value=${parseInt(this.retentionInput, 10) > 0 ? parseInt(this.retentionInput, 10) : null}
            @value-changed=${(e: CustomEvent) => (this.retentionInput = String(e.detail.value || 0))}
          ></alarmo-ext-slider>
          <ha-button appearance="plain" ?disabled=${this.busy || !retentionChanged} @click=${this.saveRetention}>Save</ha-button>
          <span class="secondary" style="display:inline">
            Untick to keep backups forever. The newest backup is always kept.
            ${this.backupDir ? html`Folder: <code>${this.backupDir}</code>` : nothing}
          </span>
        </div>
      </ha-card>

      <ha-card>${sectionHead(`Saved backups (${this.backups.length})`, 'readonly')}
        <div class="card-content desc"><p>Newest first. <em>Restore</em> puts a backup back (Replace); a backup of the current configuration is made first.</p></div>
        ${!this.loaded
          ? html`<div class="empty">Loading…</div>`
          : this.backups.length
            ? html`
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Created</th><th>Label</th><th>Files</th><th></th></tr>
                    </thead>
                    <tbody>
                      ${this.backups.map(b => this.renderRow(b))}
                    </tbody>
                  </table>
                </div>
              `
            : html`<div class="empty">No backups yet. One is made automatically before every save on the Zones page and every import.</div>`}
      </ha-card>

      ${this.dialog
        ? html`
            <alarmo-ext-import-dialog
              .hass=${this.hass}
              .backups=${this.backups}
              .backupName=${this.dialog.backupName}
              .initialMode=${this.dialog.mode}
              @close=${() => (this.dialog = null)}
              @imported=${this.imported}
            ></alarmo-ext-import-dialog>
          `
        : nothing}
    `;
  }

  private renderRow(b: BackupInfo) {
    const file = (kind: 'yaml' | 'storage' | 'extras', label: string) =>
      b.files[kind]
        ? html`
            <ha-button appearance="plain" size="small" @click=${() => this.download(b.files[kind]!.file)}>
              <ha-svg-icon slot="start" .path=${mdiDownload}></ha-svg-icon>
              ${label} (${formatBytes(b.files[kind]!.size)})
            </ha-button>
          `
        : nothing;
    return html`
      <tr>
        <td>${formatDate(b.created, this.hass.language)}</td>
        <td>${b.label || '—'}</td>
        <td>${file('yaml', 'YAML')} ${file('storage', '.storage')} ${file('extras', 'ext settings')}</td>
        <td>
          <ha-icon-button
            .path=${mdiBackupRestore}
            .label=${'Restore this backup'}
            @click=${() => (this.dialog = { backupName: b.name, mode: 'replace' })}
          ></ha-icon-button>
          <ha-icon-button .path=${mdiDeleteOutline} .label=${'Delete backup'} @click=${() => this.removeBackup(b)}></ha-icon-button>
        </td>
      </tr>
    `;
  }

  private create() {
    this.run(async () => {
      const info = await createBackup(this.hass, this.label.trim() || undefined);
      this.label = '';
      await this.refresh();
      toast(this, `Backup created: ${info.name}`);
    });
  }

  private exportNow() {
    this.run(async () => {
      const res = await exportYaml(this.hass);
      downloadText(res.file_name, res.content);
    });
  }

  private download(file: string) {
    this.run(async () => {
      const res = await downloadBackupFile(this.hass, file);
      downloadText(res.file_name, res.content, file.endsWith('.json') ? 'application/json' : 'text/yaml');
    });
  }

  private removeBackup(b: BackupInfo) {
    if (!window.confirm(`Delete the backup from ${formatDate(b.created, this.hass.language)}? Both files are removed.`)) return;
    this.run(async () => {
      await deleteBackup(this.hass, b.name);
      await this.refresh();
    });
  }

  private saveRetention() {
    const days = parseInt(this.retentionInput, 10);
    if (isNaN(days) || days < 0 || days > 3650) {
      this.error = 'Retention must be a number of days between 0 and 3650.';
      return;
    }
    this.run(async () => {
      this.settings = await saveBackupSettings(this.hass, { retention_days: days });
      await this.refresh();
      toast(this, days ? `Backups older than ${days} days will be deleted.` : 'Backups will be kept forever.');
    });
  }

  private async imported(ev: CustomEvent) {
    this.dialog = null;
    const res = ev.detail as { backup: BackupInfo; total_changes: number };
    toast(this, `Applied ${res.total_changes} change(s). Previous configuration saved as ${res.backup.name}.`);
    // Alarmo reloads after an import; give it a moment before refreshing
    setTimeout(() => this.refresh(), 1500);
  }

  static styles = extStyles;
}
