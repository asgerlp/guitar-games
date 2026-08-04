import { pitchClass } from './noteUtils.js';

const SETTLE_MS = 120; // wait for a strum to finish before matching
const MATCH_THRESHOLD = 0.7; // minimum Jaccard score to accept a match

/**
 * Feed this note on/off events; it debounces strums and matches the held
 * note set against a chord library, emitting 'chordchange' with the best
 * match (or null when nothing recognizable is held).
 */
export class ChordDetector extends EventTarget {
  constructor() {
    super();
    /** @type {Map<number, true>} currently held MIDI notes */
    this.activeNotes = new Map();
    this._settleTimer = null;
    this._library = [];
    this.current = null; // last emitted match: { id, name, score } | null
  }

  setLibrary(chordDefs) {
    this._library = chordDefs;
  }

  noteOn(note) {
    this.activeNotes.set(note, true);
    this._scheduleMatch();
  }

  noteOff(note) {
    this.activeNotes.delete(note);
    this._scheduleMatch();
  }

  reset() {
    this.activeNotes.clear();
    clearTimeout(this._settleTimer);
    this._emit(null);
  }

  _scheduleMatch() {
    clearTimeout(this._settleTimer);
    this._settleTimer = setTimeout(() => this._match(), SETTLE_MS);
  }

  _match() {
    if (this.activeNotes.size === 0) {
      this._emit(null);
      return;
    }

    const heldClasses = new Set([...this.activeNotes.keys()].map(pitchClass));
    let best = null;

    for (const def of this._library) {
      const defClasses = new Set(def.notes.map(pitchClass));
      const intersection = [...heldClasses].filter((pc) => defClasses.has(pc)).length;
      const union = new Set([...heldClasses, ...defClasses]).size;
      const score = union === 0 ? 0 : intersection / union;
      if (!best || score > best.score) {
        best = { id: def.id, name: def.name, score };
      }
    }

    if (best && best.score >= MATCH_THRESHOLD) {
      this._emit(best);
    } else {
      this._emit(null);
    }
  }

  _emit(match) {
    const changed =
      (match?.id ?? null) !== (this.current?.id ?? null) ||
      match?.score !== this.current?.score;
    this.current = match;
    if (changed) {
      this.dispatchEvent(new CustomEvent('chordchange', { detail: match }));
    }
  }
}
