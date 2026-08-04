import { DEFAULT_CHORDS } from './defaultChords.js';

const STORAGE_KEY = 'guitarGames.chordLibrary';
const ENABLED_KEY = 'guitarGames.enabledChordIds';

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(DEFAULT_CHORDS);
  try {
    const stored = JSON.parse(raw);
    // Merge: stored entries win over builtins with the same id (re-recorded),
    // builtins not present in storage are still offered, custom entries kept.
    const byId = new Map(DEFAULT_CHORDS.map((c) => [c.id, c]));
    for (const c of stored) byId.set(c.id, c);
    return [...byId.values()];
  } catch {
    return structuredClone(DEFAULT_CHORDS);
  }
}

function save(chords) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chords));
}

/**
 * CRUD + enabled-set management for the chord library, backed by
 * localStorage. This is the single source of truth the app reads chord
 * definitions from.
 */
export class ChordStore extends EventTarget {
  constructor() {
    super();
    this.chords = load();
    this.enabledIds = new Set(
      JSON.parse(localStorage.getItem(ENABLED_KEY) || 'null') ?? this.chords.map((c) => c.id)
    );
  }

  list() {
    return this.chords;
  }

  get(id) {
    return this.chords.find((c) => c.id === id);
  }

  enabled() {
    return this.chords.filter((c) => this.enabledIds.has(c.id));
  }

  isEnabled(id) {
    return this.enabledIds.has(id);
  }

  setEnabled(id, enabled) {
    if (enabled) this.enabledIds.add(id);
    else this.enabledIds.delete(id);
    localStorage.setItem(ENABLED_KEY, JSON.stringify([...this.enabledIds]));
    this._emitChange();
  }

  upsert({ id, name, notes, source = 'custom', frets, chroma }) {
    const existing = this.chords.find((c) => c.id === id);
    if (existing) {
      existing.name = name;
      if (notes !== undefined) existing.notes = notes;
      existing.source = existing.source === 'builtin' ? 'builtin' : source;
      // Re-recording only replaces the captured notes/chroma; keep whatever
      // reference data (fretboard shape, chroma template) isn't being
      // updated by this particular capture.
      existing.frets = frets ?? existing.frets;
      existing.chroma = chroma ?? existing.chroma;
    } else {
      this.chords.push({
        id,
        name,
        notes: notes ?? [],
        source,
        ...(frets ? { frets } : {}),
        ...(chroma ? { chroma } : {}),
      });
      this.enabledIds.add(id);
      localStorage.setItem(ENABLED_KEY, JSON.stringify([...this.enabledIds]));
    }
    save(this.chords);
    this._emitChange();
  }

  remove(id) {
    this.chords = this.chords.filter((c) => c.id !== id);
    this.enabledIds.delete(id);
    save(this.chords);
    localStorage.setItem(ENABLED_KEY, JSON.stringify([...this.enabledIds]));
    this._emitChange();
  }

  resetToDefault(id) {
    const def = DEFAULT_CHORDS.find((c) => c.id === id);
    if (!def) return;
    this.upsert({ ...def });
  }

  makeCustomId(name) {
    const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'chord';
    let id = base;
    let n = 1;
    while (this.chords.some((c) => c.id === id)) {
      id = `${base}-${++n}`;
    }
    return id;
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('change'));
  }
}
