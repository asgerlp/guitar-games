const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Convert a MIDI note number (0-127) to a name like "E2" or "G#3". */
export function midiToName(note) {
  const name = NOTE_NAMES[note % 12];
  const octave = Math.floor(note / 12) - 1;
  return `${name}${octave}`;
}

/** Format a set/array of MIDI note numbers as a readable, low-to-high note list. */
export function formatNoteSet(notes) {
  return [...notes]
    .sort((a, b) => a - b)
    .map(midiToName)
    .join(' ');
}

/** Reduce a MIDI note to its pitch class (0-11), used for octave-independent chord matching. */
export function pitchClass(note) {
  return ((note % 12) + 12) % 12;
}
