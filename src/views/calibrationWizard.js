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
  const { store, audio, audioDetector, t } = ctx;
  let index = 0;

  function render() {
    const chords = store.enabled();
    const hasInput = !!audio.currentDeviceId;

    if (chords.length === 0) {
      hostEl.innerHTML = `<p class="hint">${t('calibrate.noChordsEnabled')}</p>`;
      return;
    }

    if (index >= chords.length) {
      if (onDone) {
        onDone();
        return;
      }
      hostEl.innerHTML = `
        <p class="hint">${t('calibrate.allDone', { count: chords.length })}</p>
        <button class="btn" id="wizard-restart">${t('calibrate.restartBtn')}</button>
      `;
      hostEl.querySelector('#wizard-restart').addEventListener('click', () => {
        index = 0;
        render();
      });
      return;
    }

    const chord = chords[index];
    hostEl.innerHTML = `
      <p class="hint">${t('calibrate.walkthroughHint')}</p>
      <p class="small">${t('calibrate.chordProgress', { index: index + 1, total: chords.length })}</p>
      <div class="row" style="align-items:center; gap:1.25rem">
        <div class="detected-chord">${chord.name}</div>
        ${chord.frets ? renderChordDiagram(chord.frets) : ''}
      </div>
      <p class="hint">${t('calibrate.strumAndHold', { chord: chord.name })}</p>
      <div class="row">
        <button class="btn primary" id="wizard-capture" ${hasInput ? '' : 'disabled'}>${t('calibrate.captureBtn', { chord: chord.name })}</button>
        <button class="btn" id="wizard-skip">${t('calibrate.skipBtn')}</button>
      </div>
      ${!hasInput ? `<p class="small" style="margin-top:0.5rem">${t('calibrate.connectAudioFirst')}</p>` : ''}
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
