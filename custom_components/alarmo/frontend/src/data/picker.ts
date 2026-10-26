// Pure helpers for pickers (unit-tested with node --test).
export type PickerOption = { value: string; label: string };

/** Options not chosen yet, matching the filter (label or value, case-insensitive), sorted by label. */
export const filterOptions = (options: PickerOption[], chosen: string[], filter: string): PickerOption[] => {
  const q = filter.trim().toLowerCase();
  return options
    .filter(o => !chosen.includes(o.value))
    .filter(o => !q || o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/** Record<id, name> -> options. */
export const toOptions = (map: Record<string, string>): PickerOption[] =>
  Object.keys(map).map(k => ({ value: k, label: map[k] }));
