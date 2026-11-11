// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
import * as en from './languages/en.json';

// English only (2026-11-11): other languages were dropped with the rebrand.
var languages: any = {
  en: en,
};

export function localize(
  string: string,
  language: string,
  search: string | string[] = '',
  replace: string | string[] = ''
) {
  const lang = language.replace(/['"]+/g, '');

  var translated: string;

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    if (!Array.isArray(search)) search = [search];
    if (!Array.isArray(replace)) replace = [replace];
    for (let i = 0; i < search.length; i++) {
      translated = translated.replace(search[i], replace[i]);
    }
  }
  return translated;
}
