// ext: icon names without typing "mdi:" — "bed" and "mdi:bed" both mean mdi:bed.

/** Full icon name from what the user typed: no prefix → mdi:, spaces → dashes, lower case. '' stays ''. */
export const normalizeIcon = (v: string | null | undefined): string => {
  const s = String(v || '').trim();
  if (!s) return '';
  if (s.includes(':')) return s;
  return `mdi:${s.toLowerCase().replace(/[\s_]+/g, '-')}`;
};

/** What to show in a text box: mdi icons without the prefix. */
export const shortIcon = (v: string | null | undefined): string => String(v || '').replace(/^mdi:/, '');
