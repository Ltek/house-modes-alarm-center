import { LitElement, html, CSSResultGroup, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { loadHaForm } from './load-ha-elements';

import './views/general/view-general.ts';
import './views/sensors/view-sensors.ts';
import './views/codes/view-codes.ts';
import './views/actions/view-actions.ts';
import './views/ext/view-sensor-table.ts';
import './views/ext/view-backup.ts';
import './views/ext/view-panel.ts';
import './views/ext/view-house.ts';
import './views/ext/view-mirrors.ts';
import './views/ext/view-connections.ts';
import './views/ext/view-ha-zones.ts';
import './views/ext/page-intro.ts';

import { commonStyle } from './styles';
import { VERSION } from './const';
import { fetchUsers } from './data/websockets';
import { AlarmoUser, Dictionary, HomeAssistant } from './types';
import { localize } from '../localize/localize';
import { exportPath, getPath, Path } from './common/navigation';
import { navigate } from './helpers';
import { TABS, TabDef, tabForPath, isEditorPath } from './data/ext-tabs';
import { fetchExtInfo } from './data/ext-websockets';
import './views/ext/status-strip';
import './views/ext/view-why';
import './views/ext/view-activity';
import './views/ext/view-house-actions';

// ext: where the Notifications / Actions editors return to (upstream editors go to /alarmo/actions)
const ACTIONS_RETURN_KEY = 'alarmo-ext-actions-tab';

@customElement('alarm-panel')
export class MyAlarmPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true }) public narrow!: boolean;

  @property({ attribute: false }) userConfig?: Dictionary<AlarmoUser>;

  /** ext: show the Zones (legacy) tab (General → option) */
  @property({ attribute: false }) showLegacy = false;

  private async loadUi() {
    try {
      this.showLegacy = !!(await fetchExtInfo(this.hass)).ui?.show_legacy_zones;
    } catch (_e) {
      this.showLegacy = false;
    }
  }

  async firstUpdated() {
    window.addEventListener('location-changed', () => {
      if (!window.location.pathname.includes('alarmo')) return;
      this.requestUpdate();
    });

    window.addEventListener('alarmo-ext-ui-changed', () => this.loadUi());
    await loadHaForm();
    await this.loadUi();
    this.userConfig = await fetchUsers(this.hass);
    this.requestUpdate();
  }

  render() {
    if (!customElements.get('ha-panel-config') || !this.userConfig)
      return html`
        loading...
      `;

    const path = getPath();
    const tab = tabForPath(path.page, path.subpage, path.params);

    return html`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="main-title">
            ${localize('title', this.hass.language)}
          </div>
          <div class="version">
            v${VERSION}
          </div>
        </div>

        <ha-tab-group
          @wa-tab-show=${this.handlePageSelected}
        >
          ${TABS.filter(t => t.id !== 'zones_legacy' || this.showLegacy || tab?.id === 'zones_legacy').map(t => html`
            <ha-tab-group-tab slot="nav" panel="${t.id}" .active=${tab?.id === t.id}>
              ${localize(t.titleKey, this.hass.language)}
            </ha-tab-group-tab>
          `)}
        </ha-tab-group>
      </div>
      <alarmo-ext-status-strip .hass=${this.hass}></alarmo-ext-status-strip>
      <div class="view">
        ${this.withIntro(path, tab, this.getView(path, tab))}
      </div>
    `;
  }

  /** ext: upstream pages get the same intro card as the ext pages (not on editor sub-pages). */
  withIntro(path: Path, tab: TabDef | undefined, view: unknown) {
    // the upstream pages have their own title and description; only the legacy zones page gets a note
    if (!tab || tab.id !== 'zones_legacy' || isEditorPath(path.subpage, path.params)) return view;
    return html`
      <div class="page">
        <alarmo-ext-page-intro .page=${tab.id} .heading=${localize(tab.titleKey, this.hass.language)}></alarmo-ext-page-intro>
        ${view}
      </div>
    `;
  }

  getView(path: Path, tab: TabDef | undefined) {
    // ext: the URL page picks the tab; the tab picks the (upstream) view and section
    switch (tab?.view) {
      case 'general':
        return html`
          <alarm-view-general
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${path}
            .section=${tab.section}
          ></alarm-view-general>
        `;
      case 'sensors': {
        // upstream links point to /alarmo/sensors/...; keep that page so they keep working
        const p = path.page === 'zones_legacy' ? { ...path, page: 'sensors' } : path;
        return html`
          <alarm-view-sensors .hass=${this.hass} .narrow=${this.narrow} .path=${p}></alarm-view-sensors>
        `;
      }
      case 'codes':
        return html`
          <alarm-view-codes .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-codes>
        `;
      case 'sensor_table':
        return html`
          <alarm-view-sensor-table .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-sensor-table>
        `;
      case 'house_actions':
        return html`
          <alarm-view-house-actions .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-house-actions>
        `;
      case 'activity':
        return html`
          <alarm-view-activity .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-activity>
        `;
      case 'why':
        return html`
          <alarm-view-why .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-why>
        `;
      case 'house':
        return html`
          <alarm-view-house .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-house>
        `;
      case 'ha_zones':
        return html`
          <alarm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-ha-zones>
        `;
      case 'mirrors':
        return html`
          <alarm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-mirrors>
        `;
      case 'connections':
        return html`
          <alarm-view-connections .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-connections>
        `;
      case 'panel':
        return html`
          <alarm-view-panel .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-panel>
        `;
      case 'backup':
        return html`
          <alarm-view-backup .hass=${this.hass} .narrow=${this.narrow} .path=${path}></alarm-view-backup>
        `;
      case 'actions': {
        // Upstream notification/action editors live under /alarmo/actions/... and return to
        // /alarmo/actions when done. Remember which list tab was open, and when an editor
        // returns to the bare /alarmo/actions after the Notifications tab, go back there.
        const editing = isEditorPath(path.subpage, path.params);
        if (path.page === 'notifications') window.sessionStorage.setItem(ACTIONS_RETURN_KEY, 'notifications');
        else if (!editing && !path.filter && path.page === 'actions') {
          if (window.sessionStorage.getItem(ACTIONS_RETURN_KEY) === 'notifications') {
            window.sessionStorage.removeItem(ACTIONS_RETURN_KEY);
            setTimeout(() => navigate(this, exportPath('notifications'), true), 0);
          }
        } else if (editing && tab.id === 'actions') window.sessionStorage.removeItem(ACTIONS_RETURN_KEY);
        const p = path.page === 'notifications' ? { ...path, page: 'actions' } : path;
        const section = editing ? undefined : tab.section;
        return html`
          <alarm-view-actions
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${p}
            .section=${section}
          ></alarm-view-actions>
        `;
      }
      default:
        return html`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a page from the menu above to continue.
            </div>
          </ha-card>
        `;
    }
  }

  handlePageSelected(ev: CustomEvent) {
    const newPage = ev.detail.name;
    const current = getPath();
    if (newPage !== tabForPath(current.page, current.subpage, current.params)?.id) {
      window.sessionStorage.removeItem(ACTIONS_RETURN_KEY);
      // Zones (table) keeps drafts; confirm before leaving it with unsaved changes
      const table = this.shadowRoot?.querySelector('alarm-view-sensor-table') as any;
      if (table && table.hasUnsavedChanges && table.hasUnsavedChanges()) {
        const leave = window.confirm(
          'The Zones page has unsaved changes. They are kept as a draft until you return, but are not saved yet. Leave the page?'
        );
        if (!leave) {
          this.requestUpdate();
          return;
        }
      }
      navigate(this, exportPath(newPage));
      this.requestUpdate();
    } else {
      scrollTo(0, 0);
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle} :host {
        color: var(--primary-text-color);
        --paper-card-header-color: var(--primary-text-color);
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      ha-tab-group {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --ha-tab-active-text-color: var(--app-header-text-color, white);
        --ha-tab-indicator-color: var(--app-header-text-color, white);
        --ha-tab-track-color: transparent;
      }
      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }
      /* ext: pages use the full width and may shrink, so wide tables scroll inside their card */
      .view {
        padding: 0 8px;
        box-sizing: border-box;
      }
      .view > * {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
      }
      .page > * {
        display: block;
      }
      .view > *:last-child {
        margin-bottom: 20px;
      }
      .version {
        font-size: 14px;
        color: var(--primary-text-color);
      }
    `;
  }
}
