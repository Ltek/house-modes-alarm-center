// Draft edits for the sensor table.
//
// Pure TypeScript (no Lit / DOM), so it can be unit-tested directly with
// `node --test` (Node strips the type annotations). Keep it free of enums,
// parameter properties and other TS-only runtime syntax.
//
// Model: `saved` is what the backend currently has. Edits are kept per
// sensor and per field; a field edited back to its saved value is no longer
// an edit. New rows live in `added`, rows marked for removal in `removed`.

export type SensorRecord = { entity_id: string; [field: string]: any };

export type RowStatus = 'new' | 'removed' | 'changed' | 'unchanged';

export type SensorBatch = {
  create: SensorRecord[];
  update: { entity_id: string; changes: Record<string, any> }[];
  delete: string[];
};

export type DraftSnapshot = {
  edits: Record<string, Record<string, any>>;
  added: Record<string, SensorRecord>;
  removed: string[];
};

// Fields the table can change. Anything else in a saved record is passed through untouched.
export const EDITABLE_FIELDS = [
  'type',
  'area',
  'modes',
  'enabled',
  'always_on',
  'use_entry_delay',
  'use_exit_delay',
  'allow_open',
  'arm_on_close',
  'trigger_unavailable',
  'auto_bypass',
  'auto_bypass_modes',
  'entry_delay',
  'delay_on',
  'group',
];

// Lists whose order is irrelevant (compared as sets).
const SET_FIELDS = ['modes', 'auto_bypass_modes'];

const clone = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

export function valuesEqual(field: string, a: any, b: any): boolean {
  if (SET_FIELDS.includes(field)) {
    const sa = [...(a || [])].sort();
    const sb = [...(b || [])].sort();
    return JSON.stringify(sa) === JSON.stringify(sb);
  }
  // treat undefined/null as equal (e.g. group: null vs missing)
  if ((a === undefined || a === null) && (b === undefined || b === null)) return true;
  return JSON.stringify(a) === JSON.stringify(b);
}

export class DraftStore {
  private saved: Record<string, SensorRecord> = {};
  private edits: Record<string, Record<string, any>> = {};
  private added: Record<string, SensorRecord> = {};
  private removed: Set<string> = new Set();
  private order: string[] = [];

  constructor(saved: Record<string, SensorRecord> = {}) {
    this.setSaved(saved);
  }

  /** Replace the saved baseline (after a reload). Edits that now match are dropped. */
  setSaved(saved: Record<string, SensorRecord>) {
    this.saved = clone(saved) || {};
    for (const id of Object.keys(this.edits)) {
      if (!(id in this.saved)) {
        delete this.edits[id];
        continue;
      }
      for (const field of Object.keys(this.edits[id])) {
        if (valuesEqual(field, this.edits[id][field], this.saved[id][field])) delete this.edits[id][field];
      }
      if (!Object.keys(this.edits[id]).length) delete this.edits[id];
    }
    for (const id of Object.keys(this.added)) if (id in this.saved) delete this.added[id];
    for (const id of [...this.removed]) if (!(id in this.saved)) this.removed.delete(id);
    const known = new Set([...Object.keys(this.saved), ...Object.keys(this.added)]);
    this.order = [...this.order.filter(id => known.has(id))];
    for (const id of known) if (!this.order.includes(id)) this.order.push(id);
  }

  /** All row ids: saved rows, then rows added in this draft (in insertion order). */
  ids(): string[] {
    return [...this.order];
  }

  has(id: string): boolean {
    return id in this.saved || id in this.added;
  }

  isSaved(id: string): boolean {
    return id in this.saved;
  }

  /** Current (draft) view of a row. */
  get(id: string): SensorRecord | undefined {
    if (id in this.added) return clone(this.added[id]);
    if (!(id in this.saved)) return undefined;
    return { ...clone(this.saved[id]), ...clone(this.edits[id] || {}) };
  }

  savedValue(id: string, field: string): any {
    return this.saved[id] ? clone(this.saved[id][field]) : undefined;
  }

  setField(id: string, field: string, value: any) {
    if (id in this.added) {
      this.added[id] = { ...this.added[id], [field]: clone(value) };
      return;
    }
    if (!(id in this.saved)) throw new Error(`unknown sensor ${id}`);
    const edits = { ...(this.edits[id] || {}) };
    if (valuesEqual(field, value, this.saved[id][field])) delete edits[field];
    else edits[field] = clone(value);
    if (Object.keys(edits).length) this.edits[id] = edits;
    else delete this.edits[id];
  }

  setFieldMany(ids: string[], field: string, value: any) {
    ids.filter(id => !this.removed.has(id)).forEach(id => this.setField(id, field, value));
  }

  /** Turn one mode on/off in a list field ('modes' or 'auto_bypass_modes'). */
  toggleMode(id: string, mode: string, on: boolean, field = 'modes') {
    const row = this.get(id);
    if (!row) return;
    const list: string[] = [...(row[field] || [])].filter(m => m !== mode);
    if (on) list.push(mode);
    this.setField(id, field, list);
  }

  toggleModeMany(ids: string[], mode: string, on: boolean, field = 'modes') {
    ids.filter(id => !this.removed.has(id)).forEach(id => this.toggleMode(id, mode, on, field));
  }

  isFieldChanged(id: string, field: string): boolean {
    if (id in this.added) return false; // whole row is new
    return !!this.edits[id] && field in this.edits[id];
  }

  /** For list fields: is this single mode different from the saved value? */
  isModeChanged(id: string, mode: string, field = 'modes'): boolean {
    if (!this.isFieldChanged(id, field)) return false;
    const now = (this.get(id)![field] || []).includes(mode);
    const was = (this.saved[id][field] || []).includes(mode);
    return now !== was;
  }

  rowStatus(id: string): RowStatus {
    if (id in this.added) return 'new';
    if (this.removed.has(id)) return 'removed';
    if (this.edits[id]) return 'changed';
    return 'unchanged';
  }

  rowChangeCount(id: string): number {
    const status = this.rowStatus(id);
    if (status === 'new' || status === 'removed') return 1;
    return Object.keys(this.edits[id] || {}).length;
  }

  add(record: SensorRecord) {
    const id = record.entity_id;
    if (id in this.saved) {
      // re-adding a sensor that was marked for removal just restores it
      this.removed.delete(id);
      return;
    }
    this.added[id] = clone(record);
    if (!this.order.includes(id)) this.order.push(id);
  }

  remove(id: string) {
    if (id in this.added) {
      delete this.added[id];
      this.order = this.order.filter(e => e !== id);
    } else if (id in this.saved) {
      this.removed.add(id);
    }
  }

  removeMany(ids: string[]) {
    ids.forEach(id => this.remove(id));
  }

  restore(id: string) {
    this.removed.delete(id);
  }

  revertRow(id: string) {
    if (id in this.added) this.remove(id);
    delete this.edits[id];
    this.removed.delete(id);
  }

  discardAll() {
    this.edits = {};
    this.added = {};
    this.removed = new Set();
    this.order = this.order.filter(id => id in this.saved);
  }

  changeCount(): number {
    return this.order.reduce((sum, id) => sum + this.rowChangeCount(id), 0);
  }

  isDirty(): boolean {
    return this.changeCount() > 0;
  }

  /** The batch for `alarmo/ext/sensors/apply_changes`. */
  toBatch(): SensorBatch {
    const create = Object.values(this.added).map(rec => {
      const out: SensorRecord = { entity_id: rec.entity_id };
      for (const field of EDITABLE_FIELDS) {
        if (rec[field] === undefined) continue;
        if (field === 'group' && !rec[field]) continue;
        out[field] = clone(rec[field]);
      }
      return out;
    });
    const update = Object.entries(this.edits)
      .filter(([id]) => !this.removed.has(id))
      .map(([entity_id, changes]) => ({ entity_id, changes: clone(changes) }));
    return { create, update, delete: [...this.removed] };
  }

  snapshot(): DraftSnapshot {
    return { edits: clone(this.edits), added: clone(this.added), removed: [...this.removed] };
  }

  /** Re-apply a snapshot (e.g. from sessionStorage) on top of the current saved data. */
  loadSnapshot(snap: DraftSnapshot | null | undefined) {
    if (!snap) return;
    this.discardAll();
    for (const [id, rec] of Object.entries(snap.added || {})) if (!(id in this.saved)) this.add(rec);
    for (const [id, fields] of Object.entries(snap.edits || {})) {
      if (!(id in this.saved)) continue;
      for (const [field, value] of Object.entries(fields)) this.setField(id, field, value);
    }
    for (const id of snap.removed || []) if (id in this.saved) this.removed.add(id);
  }
}
