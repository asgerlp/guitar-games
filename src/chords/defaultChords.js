// Absolute MIDI note numbers for common open-position chords in standard
// tuning (E2 A2 D3 G3 B3 E4). These assume the GP-50 is reporting true
// pitch (no transpose) from the GK pickup — if your rig reports differently,
// just re-record each chord from the Chord Library screen and it'll override
// these numbers with what your gear actually sends.
export const DEFAULT_CHORDS = [
  { id: 'E', name: 'E major', notes: [40, 47, 52, 56, 59, 64] },
  { id: 'Em', name: 'E minor', notes: [40, 47, 52, 55, 59, 64] },
  { id: 'A', name: 'A major', notes: [45, 52, 57, 61, 64] },
  { id: 'Am', name: 'A minor', notes: [45, 52, 57, 60, 64] },
  { id: 'D', name: 'D major', notes: [50, 57, 62, 66] },
  { id: 'Dm', name: 'D minor', notes: [50, 57, 62, 65] },
  { id: 'G', name: 'G major', notes: [43, 47, 50, 55, 59, 67] },
  { id: 'C', name: 'C major', notes: [48, 52, 55, 60, 64] },
].map((c) => ({ ...c, source: 'builtin' }));
