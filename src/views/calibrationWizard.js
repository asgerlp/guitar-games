import { renderChordDiagram } from '../chords/chordDiagram.js';

/**
 * Guided calibration: walk through the chords you have enabled, one at a
 * time, capturing each one's live sound. This is what actually drives
 * recognition — defaults derived from theoretical note lists rarely
 * cosine-match real guitar audio closely enough on their own.
 *
 * Used standalone on the Settings page (shows a "restart" panel once every
 * chord's been visited) and inside the onboarding wizard, where passing
 * `onDone` skips that panel and advances to the next step instead.
 */
export function renderCalibrationWizard(hostEl, ctx, { onDone } = {}) {
  const { store, audio, audioDetector } = ctx;
  let index = 0;

  function render() {
    const chords = store.enabled();
    const hasInput = !!audio.currentDeviceId;

    if (chords.length === 0) {
      hostEl.innerHTML = '<p class="hint">Enable some chords in the Chord Library first, then come back here.</p>';
      return;
    }

    if (index >= chords.length) {
      if (onDone) {
        onDone();
        return;
      }
      hostEl.innerHTML = `
        <p class="hint">All ${chords.length} enabled chords calibrated. Head to the Home screen to play, or restart to redo them.</p>
        <button class="btn" id="wizard-restart">Restart calibration</button>
      `;
      hostEl.querySelector('#wizard-restart').addEventListener('click', () => {
        index = 0;
        render();
      });
      return;
    }

    const chord = chords[index];
    hostEl.innerHTML = `
      <p class="hint">
        Walk through each chord you use and capture its real sound — this matters more than
        anything else here, since it's what actually drives recognition.
      </p>
      <p class="small">Chord ${index + 1} of ${chords.length}</p>
      <div class="row" style="align-items:center; gap:1.25rem">
        <div class="detected-chord">${chord.name}</div>
        ${chord.frets ? renderChordDiagram(chord.frets) : ''}
      </div>
      <p class="hint">Strum and hold ${chord.name}, then capture.</p>
      <div class="row">
        <button class="btn primary" id="wizard-capture" ${hasInput ? '' : 'disabled'}>Capture ${chord.name}</button>
        <button class="btn" id="wizard-skip">Skip</button>
      </div>
      ${!hasInput ? '<p class="small" style="margin-top:0.5rem">Connect audio input first.</p>' : ''}
    `;

    hostEl.querySelector('#wizard-capture').addEventListener('click', () => {
      store.upsert({ id: chord.id, name: chord.name, source: chord.source, chroma: audioDetector.getSmoothedChroma() });
      index++;
      render();
    });
    hostEl.querySelector('#wizard-skip').addEventListener('click', () => {
      index++;
      render();
    });
  }

  function onAudioChange() {
    render();
  }
  audio.addEventListener('connected', onAudioChange);
  audio.addEventListener('disconnected', onAudioChange);

  render();

  return () => {
    audio.removeEventListener('connected', onAudioChange);
    audio.removeEventListener('disconnected', onAudioChange);
  };
}
