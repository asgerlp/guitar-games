import { MATCH_THRESHOLD } from '../chords/audioChordDetector.js';
import { renderLibrary } from './library.js';
import { renderAudioControls } from './audioControls.js';
import { renderCalibrationWizard } from './calibrationWizard.js';

const NOTE_LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * The single Settings page: audio input, live chord monitor, the guided
 * calibration wizard, one-off recalibration, and the chord library — all
 * merged here since they're really one workflow (get your instrument
 * recognized reliably), not separate destinations. Unlike the onboarding
 * wizard, this shows everything at once — appropriate for a returning
 * player who wants to tweak one thing, not a guided first-time flow.
 */
export function renderSettings(container, ctx, { showReplayWizard = true } = {}) {
  const { audio, audioDetector, store, navigate } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>Settings</h2>
      <p class="hint">
        Listens to your USB audio interface/pedal directly — not your laptop's built-in
        microphone — and detects chords from the sound itself. Pick the device your guitar/pedal
        actually appears as below, not the built-in mic, then calibrate the chords you plan to
        use — that matters more than anything else here.
      </p>
      ${
        showReplayWizard
          ? '<div class="row"><button class="btn" id="replay-wizard-btn">Replay setup wizard</button></div>'
          : ''
      }
    </div>
    <div class="card">
      <h2>Audio Input</h2>
      <div id="audio-controls"></div>
    </div>
    <div class="card">
      <h2>Live monitor</h2>
      <p class="hint">Strum and hold a chord — the pitch classes present should light up below.</p>
      <div class="chroma-bars">
        ${NOTE_LABELS.map(
          (label) => `
          <div class="chroma-bar">
            <div class="chroma-bar-fill" data-fill></div>
            <span class="chroma-bar-label">${label}</span>
          </div>
        `
        ).join('')}
      </div>
      <p class="row" style="margin-top:0.75rem">
        <span class="small">Closest chord:</span>
        <span class="detected-chord" id="live-chord">—</span>
      </p>
      <p class="small" id="match-status"></p>
      <p class="small" id="level-readout">Level: —</p>
    </div>
    <div class="card">
      <h2>Calibrate your chords</h2>
      <div id="wizard-host"></div>
    </div>
    <div class="card" id="calibrate-panel"></div>
    <div class="card" id="library-host"></div>
  `;

  const fills = [...container.querySelectorAll('[data-fill]')];
  const liveChord = container.querySelector('#live-chord');
  const matchStatus = container.querySelector('#match-status');
  const levelReadout = container.querySelector('#level-readout');
  const calibratePanel = container.querySelector('#calibrate-panel');

  container.querySelector('#replay-wizard-btn')?.addEventListener('click', () => navigate('onboarding'));

  function renderCalibratePanel() {
    const chords = store.list();
    const hasInput = !!audio.currentDeviceId;
    calibratePanel.innerHTML = `
      <h2>Recalibrate or add a custom chord</h2>
      <p class="hint">
        For one-off recalibration of a specific chord, or adding a brand new one that isn't in
        the guided list above.
      </p>
      <div class="row">
        <select id="calibrate-select">
          ${chords.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <button class="btn primary" id="capture-existing-btn" ${hasInput ? '' : 'disabled'}>
          Capture for selected chord
        </button>
      </div>
      <div class="row" style="margin-top:0.75rem">
        <input type="text" id="new-chord-name" placeholder="e.g. F#m" />
        <button class="btn" id="capture-new-btn" ${hasInput ? '' : 'disabled'}>Capture as new chord</button>
      </div>
      ${!hasInput ? '<p class="small" style="margin-top:0.5rem">Enable audio input above first.</p>' : ''}
    `;

    calibratePanel.querySelector('#capture-existing-btn')?.addEventListener('click', () => {
      const id = calibratePanel.querySelector('#calibrate-select').value;
      const chord = store.get(id);
      if (!chord) return;
      store.upsert({ id: chord.id, name: chord.name, source: chord.source, chroma: audioDetector.getSmoothedChroma() });
    });

    calibratePanel.querySelector('#capture-new-btn')?.addEventListener('click', () => {
      const input = calibratePanel.querySelector('#new-chord-name');
      const name = input.value.trim();
      if (!name) return;
      const id = store.makeCustomId(name);
      store.upsert({ id, name, source: 'custom', chroma: audioDetector.getSmoothedChroma() });
      input.value = '';
    });
  }

  function onChroma() {
    const smoothed = audioDetector.getSmoothedChroma();
    smoothed.forEach((v, i) => {
      if (fills[i]) fills[i].style.height = `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
    });

    levelReadout.textContent = Number.isFinite(audioDetector.lastLevel)
      ? `Level: ${Math.round(audioDetector.lastLevel)} dB`
      : 'Level: —';

    const candidate = audioDetector.lastCandidate;
    if (!candidate) {
      liveChord.textContent = '—';
      matchStatus.textContent = '';
      liveChord.classList.remove('active');
      return;
    }

    liveChord.textContent = `${candidate.name} (${Math.round(candidate.score * 100)}%)`;
    const isCommitted = audioDetector.current?.id === candidate.id;
    liveChord.classList.toggle('active', isCommitted);
    matchStatus.textContent = isCommitted
      ? '✓ matched — this is what games will react to'
      : `not confident enough yet (need ${Math.round(MATCH_THRESHOLD * 100)}%) — try calibrating this chord below`;
  }

  function onStoreChange() {
    renderCalibratePanel();
  }

  audio.addEventListener('connected', renderCalibratePanel);
  audio.addEventListener('disconnected', renderCalibratePanel);
  audio.addEventListener('chroma', onChroma);
  store.addEventListener('change', onStoreChange);

  const cleanupAudioControls = renderAudioControls(container.querySelector('#audio-controls'), ctx);
  const cleanupWizard = renderCalibrationWizard(container.querySelector('#wizard-host'), ctx);
  renderCalibratePanel();
  const cleanupLibrary = renderLibrary(container.querySelector('#library-host'), ctx);

  return () => {
    audio.removeEventListener('connected', renderCalibratePanel);
    audio.removeEventListener('disconnected', renderCalibratePanel);
    audio.removeEventListener('chroma', onChroma);
    store.removeEventListener('change', onStoreChange);
    cleanupAudioControls?.();
    cleanupWizard?.();
    cleanupLibrary?.();
  };
}
