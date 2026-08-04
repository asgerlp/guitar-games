import { cosineSimilarity, notesToChromaTemplate } from './chromaUtils.js';

const SMOOTHING = 0.35; // EMA factor applied to each incoming chroma frame
const MATCH_THRESHOLD = 0.7; // cosine similarity needed to accept a match
const SILENCE_DB = -75; // peak dB below this reads as "not playing" (analyser floor is -100)
const HOLD_MS = 220; // a candidate match must stay stable this long before firing

/**
 * Matches a live, smoothed chroma vector (see chromaUtils.computeChroma)
 * against the chord library via cosine similarity. Chords recorded from
 * audio carry their own `chroma` template; chords defined by a `notes` list
 * get one derived on the fly from their pitch classes. Emits 'chordchange'
 * with {id,name,score}|null, same shape games listen to regardless of input
 * source.
 */
export class AudioChordDetector extends EventTarget {
  constructor() {
    super();
    this._library = [];
    this._smoothed = new Array(12).fill(0);
    this.current = null;
    this._candidateId = null;
    this._candidateSince = 0;
    // Best candidate + raw level from the most recent frame, kept even when
    // it didn't clear the threshold — lets the UI show *why* nothing is
    // matching (too quiet vs. just not a good enough match) instead of a
    // silent "—".
    this.lastLevel = -Infinity;
    this.lastCandidate = null;
  }

  setLibrary(chordDefs) {
    this._library = chordDefs.map((c) => ({
      id: c.id,
      name: c.name,
      template: c.chroma ?? notesToChromaTemplate(c.notes ?? []),
    }));
  }

  /** Current EMA-smoothed chroma vector, e.g. for a live monitor UI or calibration capture. */
  getSmoothedChroma() {
    return [...this._smoothed];
  }

  feed({ chroma, level }) {
    for (let i = 0; i < 12; i++) {
      this._smoothed[i] = this._smoothed[i] * (1 - SMOOTHING) + chroma[i] * SMOOTHING;
    }
    this.lastLevel = level;

    if (level < SILENCE_DB) {
      this.lastCandidate = null;
      this._candidateId = null;
      this._emit(null);
      return;
    }

    let best = null;
    for (const entry of this._library) {
      const score = cosineSimilarity(this._smoothed, entry.template);
      if (!best || score > best.score) best = { id: entry.id, name: entry.name, score };
    }
    this.lastCandidate = best;

    if (!best || best.score < MATCH_THRESHOLD) {
      this._candidateId = null;
      this._emit(null);
      return;
    }

    const now = performance.now();
    if (best.id !== this._candidateId) {
      this._candidateId = best.id;
      this._candidateSince = now;
    }

    if (now - this._candidateSince >= HOLD_MS) {
      this._emit(best);
    }
  }

  reset() {
    this._smoothed = new Array(12).fill(0);
    this._candidateId = null;
    this.lastLevel = -Infinity;
    this.lastCandidate = null;
    this._emit(null);
  }

  _emit(match) {
    const changed = (match?.id ?? null) !== (this.current?.id ?? null) || match?.score !== this.current?.score;
    this.current = match;
    if (changed) {
      this.dispatchEvent(new CustomEvent('chordchange', { detail: match }));
    }
  }
}
