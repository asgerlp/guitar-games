import { loadJSON, saveJSON } from '../lib/storage.js';
import { LANGUAGES } from './languages.js';
import { en } from './translations/en.js';
import { da } from './translations/da.js';
import { de } from './translations/de.js';
import { fr } from './translations/fr.js';
import { es } from './translations/es.js';
import { sv } from './translations/sv.js';
import { no } from './translations/no.js';

const STORAGE_KEY = 'guitarGames.language';
const CATALOGS = { en, da, de, fr, es, sv, no };

function detectDefault() {
  const codes = new Set(LANGUAGES.map((l) => l.code));
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const code = (tag ?? '').slice(0, 2).toLowerCase();
    if (codes.has(code)) return code;
  }
  return 'en';
}

/**
 * App-wide language state + translation lookup, a singleton like the
 * audio/detector/store instances created in main.js — passed through ctx
 * so every view can call ctx.t(key, vars). Product/brand names (Chord
 * Games, Chord Racer, etc.) are deliberately never translated, matching
 * how most localized products keep their name; everything else — every
 * instruction, button, hint, and label — goes through this.
 */
class I18n extends EventTarget {
  constructor() {
    super();
    const saved = loadJSON(STORAGE_KEY, null);
    this.language = CATALOGS[saved] ? saved : detectDefault();
  }

  setLanguage(code) {
    if (!CATALOGS[code] || code === this.language) return;
    this.language = code;
    saveJSON(STORAGE_KEY, code);
    this.dispatchEvent(new CustomEvent('change', { detail: { language: code } }));
  }

  /** Translate `key`, filling in {name}-style placeholders from `vars`. Falls back to English, then the raw key, if a translation is missing. */
  t(key, vars) {
    const catalog = CATALOGS[this.language] ?? CATALOGS.en;
    let str = catalog[key] ?? CATALOGS.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
    }
    return str;
  }
}

export const i18n = new I18n();
