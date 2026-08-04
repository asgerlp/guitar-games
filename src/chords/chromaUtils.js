// Guitar fundamentals + a little headroom either side (low E ~82Hz, high
// frets on the top string can reach a few kHz once harmonics are included).
const MIN_FREQ = 70;
const MAX_FREQ = 4200;

/**
 * Fold FFT bin energy (in dB, from AnalyserNode.getFloatFrequencyData) into
 * a 12-element chroma vector — one bucket per pitch class, octave-collapsed.
 * This is the same trick chord-recognition/tuner software uses: you don't
 * need to resolve exact octaves to know "this sounds like a G major".
 */
export function computeChroma(freqDataDb, sampleRate, fftSize) {
  const chroma = new Array(12).fill(0);
  const binHz = sampleRate / fftSize;
  const minBin = Math.max(1, Math.floor(MIN_FREQ / binHz));
  const maxBin = Math.min(freqDataDb.length - 1, Math.ceil(MAX_FREQ / binHz));

  let totalEnergy = 0;

  for (let i = minBin; i <= maxBin; i++) {
    const db = freqDataDb[i];
    if (!Number.isFinite(db)) continue;
    const amplitude = 10 ** (db / 20);
    if (amplitude < 1e-6) continue;

    const freq = i * binHz;
    const midiFloat = 69 + 12 * Math.log2(freq / 440);
    const pitchClass = ((Math.round(midiFloat) % 12) + 12) % 12;
    chroma[pitchClass] += amplitude;
    totalEnergy += amplitude;
  }

  const max = Math.max(...chroma);
  if (max > 0) {
    for (let i = 0; i < 12; i++) chroma[i] /= max;
  }

  return { chroma, level: totalEnergy };
}

/** Derive a binary chroma template from a set of absolute MIDI notes. */
export function notesToChromaTemplate(notes) {
  const template = new Array(12).fill(0);
  for (const n of notes) {
    const pc = ((n % 12) + 12) % 12;
    template[pc] = 1;
  }
  return template;
}

export function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
