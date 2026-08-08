// Absolute MIDI note numbers for common open-position chords in standard
// tuning (E2 A2 D3 G3 B3 E4). These assume the GP-50 is reporting true
// pitch (no transpose) from the GK pickup — if your rig reports differently,
// just re-record each chord from the Chord Library section in Settings and it'll override
// these numbers with what your gear actually sends (the fretboard shape
// stays as-is, so the diagram keeps showing how to play it).
//
// `frets` is one entry per string, low E to high e: -1 = muted (x), 0 = open,
// n = fretted at n. Names use standard shorthand (E, Em, F#m, ...) rather
// than spelling out "major"/"minor"/"sharp".
export const DEFAULT_CHORDS = [
  { id: 'E', name: 'E', notes: [40, 47, 52, 56, 59, 64], frets: [0, 2, 2, 1, 0, 0] },
  { id: 'Em', name: 'Em', notes: [40, 47, 52, 55, 59, 64], frets: [0, 2, 2, 0, 0, 0] },
  { id: 'A', name: 'A', notes: [45, 52, 57, 61, 64], frets: [-1, 0, 2, 2, 2, 0] },
  { id: 'Am', name: 'Am', notes: [45, 52, 57, 60, 64], frets: [-1, 0, 2, 2, 1, 0] },
  { id: 'D', name: 'D', notes: [50, 57, 62, 66], frets: [-1, -1, 0, 2, 3, 2] },
  { id: 'Dm', name: 'Dm', notes: [50, 57, 62, 65], frets: [-1, -1, 0, 2, 3, 1] },
  { id: 'G', name: 'G', notes: [43, 47, 50, 55, 59, 67], frets: [3, 2, 0, 0, 0, 3] },
  { id: 'C', name: 'C', notes: [48, 52, 55, 60, 64], frets: [-1, 3, 2, 0, 1, 0] },
].map((c) => ({ ...c, source: 'builtin' }));
