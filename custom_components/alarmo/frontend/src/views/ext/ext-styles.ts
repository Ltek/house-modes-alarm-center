// Styles shared by the ext pages (sensor table, backup). Uses HA theme variables only.
import { css } from 'lit';

export const extStyles = css`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    padding: 8px 12px 0;
    box-sizing: border-box;
    --ext-changed-bg: rgba(255, 152, 0, 0.18);
    --ext-changed-color: var(--warning-color, #ff9800);
    --ext-new-bg: rgba(76, 175, 80, 0.14);
    --ext-new-color: var(--success-color, #4caf50);
    --ext-removed-bg: rgba(244, 67, 54, 0.1);
    --ext-removed-color: var(--error-color, #f44336);
  }
  :host([embedded]) {
    padding: 0;
  }
  ha-card {
    margin-bottom: 12px;
    max-width: 100%;
    min-width: 0;
    overflow: hidden; /* the table inside scrolls, not the card */
  }
  .toolbar,
  .detail-grid {
    min-width: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 12px 16px;
  }
  .toolbar .grow {
    flex: 1 1 auto;
  }
  select,
  input[type='text'],
  input[type='number'],
  input[type='search'] {
    font: inherit;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--primary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    padding: 6px 8px;
    min-height: 34px;
    box-sizing: border-box;
  }
  input[type='number'] {
    width: 80px;
  }
  input[type='search'] {
    min-width: 200px;
  }
  .table-wrap {
    overflow-x: auto;
    max-width: 100%;
    padding: 0 8px 8px;
    -webkit-overflow-scrolling: touch;
  }
  /* tables hug their content (columns stay close together); wide ones scroll in .table-wrap.
     Activity/history logs and tables with expandable rows use class="full". */
  table {
    border-collapse: collapse;
    width: auto;
    font-size: 14px;
  }
  table.full {
    width: 100%;
  }
  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--divider-color);
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
  }
  th {
    position: sticky;
    top: 0;
    background: var(--card-background-color, var(--primary-background-color));
    font-weight: 500;
    color: var(--secondary-text-color);
    z-index: 1;
  }
  th.c,
  td.c {
    text-align: center;
  }
  td.name {
    white-space: normal;
    min-width: 180px;
    max-width: 420px;
  }
  /* spacer column: other columns hug their content, the rest of the width goes here */
  th.fill,
  td.fill {
    width: 100%;
    padding: 0;
  }
  .secondary {
    display: block;
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  td.changed,
  .changed-inline {
    background: var(--ext-changed-bg);
  }
  .mark {
    --mdc-icon-size: 14px;
    width: 14px;
    height: 14px;
    color: var(--ext-changed-color);
    vertical-align: middle;
  }
  tr.status-new td {
    background: var(--ext-new-bg);
  }
  tr.status-new td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-new-color);
  }
  tr.status-changed td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-changed-color);
  }
  tr.status-removed td {
    background: var(--ext-removed-bg);
    color: var(--secondary-text-color);
  }
  tr.status-removed td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-removed-color);
  }
  tr.status-removed td.name {
    text-decoration: line-through;
  }
  .badge {
    display: inline-block;
    min-width: 18px;
    padding: 0 5px;
    border-radius: 9px;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    background: var(--ext-changed-color);
  }
  .badge.new {
    background: var(--ext-new-color);
  }
  .badge.removed {
    background: var(--ext-removed-color);
  }
  .status-icon.new {
    color: var(--ext-new-color);
  }
  .status-icon.changed {
    color: var(--ext-changed-color);
  }
  .status-icon.removed {
    color: var(--ext-removed-color);
  }
  tr.detail td {
    background: var(--secondary-background-color);
    white-space: normal;
  }
  .detail-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    padding: 8px 4px;
  }
  .detail-grid label {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .savebar {
    position: sticky;
    bottom: 0;
    z-index: 3;
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 16px;
    margin: 0 -12px;
    background: var(--card-background-color, var(--primary-background-color));
    border-top: 3px solid var(--ext-changed-color);
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.15);
  }
  .savebar .count {
    flex: 1 1 auto;
    font-weight: 500;
  }
  .bulkbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;
    background: var(--secondary-background-color);
  }
  .notice {
    padding: 8px 16px;
    border-left: 4px solid var(--info-color, #039be5);
    background: var(--secondary-background-color);
    margin: 0 16px 12px;
  }
  .notice.warn {
    border-color: var(--warning-color, #ff9800);
  }
  .notice.error {
    border-color: var(--error-color, #f44336);
  }
  .empty {
    padding: 24px;
    text-align: center;
    color: var(--secondary-text-color);
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    border-radius: 12px;
    width: min(900px, calc(100vw - 24px));
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  }
  .modal h2 {
    margin: 0;
    padding: 16px 20px 8px;
    font-size: 20px;
    font-weight: 400;
  }
  .modal .body {
    padding: 0 20px 12px;
    overflow: auto;
  }
  .modal .footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 12px 20px;
    border-top: 1px solid var(--divider-color);
  }
  .src {
    --mdc-icon-size: 14px;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-left: 2px;
    color: var(--secondary-text-color);
  }
  .src.rule {
    color: var(--info-color, #039be5);
  }
  .src.override {
    color: var(--accent-color, #ff9800);
    cursor: pointer;
  }
  .modes-src {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-left: 6px;
  }
  td.conflict {
    outline: 2px solid var(--ext-removed-color);
    outline-offset: -2px;
  }
  td.override-cell {
    box-shadow: inset 0 -2px 0 var(--accent-color, #ff9800);
  }
  th.help,
  span.help,
  label.help {
    cursor: help;
  }
  th.help {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
  .help-panel {
    margin: 0 16px 12px;
  }
  .help-panel dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 16px;
    margin: 0;
  }
  .help-panel dt {
    font-weight: 500;
  }
  .help-panel dd {
    margin: 0;
  }
  .sec-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 16px 8px;
  }
  .sec-head h2 {
    margin: 0;
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: 400;
    line-height: 32px;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .sec-side {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .role {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    --mdc-icon-size: 14px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    white-space: nowrap;
  }
  .card-content.desc,
  .desc {
    padding: 0 16px 8px;
    line-height: 1.5;
  }
  .desc p {
    margin: 0 0 10px;
  }
  .desc ul {
    margin: 0 0 10px;
    padding-left: 22px;
  }
  .desc li {
    margin: 2px 0;
  }
  .badge-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    display: inline-flex;
    align-items: center;
  }
  td.icon,
  th.icon {
    width: 44px;
    text-align: center;
    padding-left: 8px;
    padding-right: 0;
  }
  .locked-note {
    color: var(--secondary-text-color);
    font-size: 13px;
  }
  .icon-stack {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  .eye {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
  .eye.off {
    color: var(--error-color, #f44336);
  }
  .eye:disabled {
    cursor: default;
  }
  tr.zone-disabled td:not(.icon) {
    opacity: 0.5;
  }
  th.mode,
  td.mode {
    width: 34px;
    padding-left: 2px;
    padding-right: 2px;
    --mdc-icon-size: 18px;
  }
  .mode-dot {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .mode-dot.on {
    color: var(--primary-color);
  }
  .chip-cell {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    color: var(--chip);
    border: 1px solid var(--chip);
  }
  .chip-cell.changed {
    background: var(--ext-changed-bg);
  }
  td.opts {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  td.opts ha-icon {
    margin-right: 2px;
  }
  .opt-num {
    font-size: 12px;
    margin-left: 2px;
  }
  td.row-actions {
    white-space: nowrap;
    width: 1%;
  }
  .zone-editor {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 8px 32px;
    padding: 8px 8px 12px;
  }
  .zone-editor h4,
  .subhead {
    margin: 4px 0 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent-color, var(--primary-color));
  }
  /* canonical field row: label content-width, control right beside it (CARD_DESIGN_SYSTEM §2) */
  .zone-editor .field,
  .field-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 40px;
    padding: 0 6px;
    border-radius: 6px;
  }
  .mode-picks {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    align-items: center;
  }
  .copy {
    margin-top: 8px;
  }
  button.link {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font: inherit;
    padding: 2px 4px;
  }
  /* collapsible section (CARD_DESIGN_SYSTEM §2: accent border when open, rotating chevron, uppercase head) */
  details.collapse {
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    margin: 0 16px 12px;
  }
  details.collapse[open] {
    border-color: var(--primary-color);
  }
  details.collapse > summary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    list-style: none;
  }
  details.collapse > summary::-webkit-details-marker {
    display: none;
  }
  details.collapse > summary .chev {
    --mdc-icon-size: 20px;
    color: var(--primary-color);
    transition: transform 0.2s;
  }
  details.collapse[open] > summary .chev {
    transform: rotate(90deg);
  }
  .collapse-title {
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
    font-size: 13px;
  }
  .collapse-body {
    padding: 0 12px 12px;
  }
  .blk {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 2px 0;
  }
  tr.passed td {
    background: var(--ext-new-bg);
  }
  .live-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    --mdc-icon-size: 14px;
    white-space: nowrap;
  }
  /* live state: icon with the text under it */
  .state-cell {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    min-width: 44px;
    font-size: 11px;
    line-height: 13px;
    --mdc-icon-size: 20px;
    white-space: nowrap;
  }
  .state-cell.muted {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .state-cell .blocks {
    font-weight: 600;
  }
  .state-pair {
    display: inline-flex;
    gap: 10px;
    align-items: flex-start;
  }
  .state-pair .sep {
    color: var(--divider-color);
    align-self: center;
  }
  /* help: one row per entry, zebra striped */
  .help-panel .help-rows {
    display: grid;
    grid-template-columns: max-content 1fr;
    margin: 0;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--divider-color);
  }
  .help-panel .help-rows > div {
    display: contents;
  }
  .help-panel .help-rows dt,
  .help-panel .help-rows dd {
    padding: 8px 12px;
    margin: 0;
    color: var(--primary-text-color);
    line-height: 1.45;
  }
  .help-panel .help-rows dt {
    font-weight: 600;
    white-space: nowrap;
  }
  .help-panel .help-rows > div:nth-child(odd) dt,
  .help-panel .help-rows > div:nth-child(odd) dd {
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.05);
  }
  .kind-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    background: none;
    font: inherit;
    font-size: 12px;
    opacity: 0.6;
    --mdc-icon-size: 14px;
  }
  .kind-chip.on {
    opacity: 1;
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
  }
  .seq-time {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  .seq-title {
    font-weight: 500;
  }
  .seq-kinds {
    margin-left: auto;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
  .related-list .field-row {
    min-height: 32px;
  }
`;
