// Live zone state as a coloured icon with the state text underneath (Zone Assignments, Panel zones).
import { html, nothing } from 'lit';
import { LiveState } from '../../data/status';

export const LIVE_ICON: Record<LiveState, string> = {
  open: 'mdi:alert-circle-outline',
  closed: 'mdi:check-circle-outline',
  unavailable: 'mdi:help-circle-outline',
  unknown: 'mdi:help-circle-outline',
};

export const liveColor = (live: LiveState, blocks = false) =>
  blocks
    ? 'var(--error-color, #f44336)'
    : live === 'open'
      ? 'var(--warning-color, #ffa600)'
      : live === 'closed'
        ? 'var(--success-color, #43a047)'
        : 'var(--error-color, #f44336)';

/** icon on top, small text under it; `label` overrides the text (e.g. "held"), `title` is the tooltip */
export const stateCell = (live: LiveState | null, opts: { blocks?: boolean; label?: string; title?: string } = {}) =>
  live === null
    ? html`<span class="state-cell muted"><ha-icon icon="mdi:minus"></ha-icon><span>—</span></span>`
    : html`<span class="state-cell" style=${`color:${liveColor(live, opts.blocks)}`} title=${opts.title || live}>
        <ha-icon icon=${LIVE_ICON[live]}></ha-icon><span>${opts.label || live}</span>${opts.blocks ? html`<span class="blocks">blocks</span>` : nothing}
      </span>`;
