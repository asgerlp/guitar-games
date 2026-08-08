import { renderChordDiagram } from '../chords/chordDiagram.js';
import { MATCH_THRESHOLD } from '../chords/audioChordDetector.js';
import { renderLibrary } from './library.js';

const NOTE_LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * The single Settings page: audio input, live chord monitor, the guided
 * calibration wizard, one-off recalibration, and the chord library — all
 * merged here since they're really one workflow (get your instrument
 * recognized reliably), not separate destinations.
 */
export function renderSettings(container, ctx, { showReplayWizard = true } = {}) {
  const { audio, audioDetector, store, navigate } = ctx;
  let wizardIndex = 0;

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
      ${!audio.isSupported ? '<p class="banner">This browser doesn’t support audio input capture. Use Chrome or Edge.</p>' : ''}
      <div class="row" id="audio-controls"></div>
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
    <div class="card" id="wizard-panel"></div>
    <div class="card" id="calibrate-panel"></div>
    <div class="card" id="library-host"></div>
  `;

  const controls = container.querySelector('#audio-controls');
  const fills = [...container.querySelectorAll('[data-fill]')];
  const liveChord = container.querySelector('#live-chord');
  const matchStatus = container.querySelector('#match-status');
  const levelReadout = container.querySelector('#level-readout');
  const wizardPanel = container.querySelector('#wizard-panel');
  const calibratePanel = container.querySelector('#calibrate-panel');

  container.querySelector('#replay-wizard-btn')?.addEventListener('click', () => navigate('onboarding'));

  function renderControls() {
    if (!audio.currentDeviceId) {
      controls.innerHTML = `<button class="btn primary" id="enable-btn" ${audio.isSupported ? '' : 'disabled'}>Enable audio input</button>`;
      controls.querySelector('#enable-btn').addEventListener('click', async (e) => {
        e.target.disabled = true;
        e.target.textContent = 'Requesting permission…';
        try {
          const remembered = localStorage.getItem('guitarGames.audioDeviceId') || undefined;
          await audio.selectInput(remembered);
        } catch (err) {
          controls.innerHTML = `<p class="banner">Couldn't access audio input: ${err.message}. Check the browser's site permissions (padlock icon in the address bar).</p>`;
        }
      });
      return;
    }

    const inputs = audio.listInputs();
    controls.innerHTML = `
      <select id="audio-device-select">
        ${inputs
          .map(
            (i) =>
              `<option value="${i.id}" ${i.id === audio.currentDeviceId ? 'selected' : ''}>${i.name}</option>`
          )
          .join('')}
      </select>
      <button class="btn" id="disconnect-btn">Disconnect</button>
    `;
    controls.querySelector('#audio-device-select').addEventListener('change', (e) => {
      audio.selectInput(e.target.value);
    });
    controls.querySelector('#disconnect-btn').addEventListener('click', () => audio.stop());
  }

  // --- guided calibration wizard: walk through the chords you actually
  // have enabled, one at a time, capturing each one's live sound. This is
  // the recommended first-run flow, since defaults derived from theoretical
  // note lists rarely cosine-match real guitar audio closely enough on
  // their own. ------------------------------------------------------------
  function renderWizard() {
    const chords = store.enabled();
    const hasInput = !!audio.currentDeviceId;

    if (chords.length === 0) {
      wizardPanel.innerHTML = `
        <h2>Calibrate your chords</h2>
        <p class="hint">Enable some chords in the Chord Library below first, then come back here.</p>
      `;
      return;
    }

    if (wizardIndex >= chords.length) {
      wizardPanel.innerHTML = `
        <h2>Calibrate your chords</h2>
        <p class="hint">All ${chords.length} enabled chords calibrated. Head to the Home screen to play, or restart to redo them.</p>
        <button class="btn" id="wizard-restart">Restart calibration</button>
      `;
      wizardPanel.querySelector('#wizard-restart').addEventListener('click', () => {
        wizardIndex = 0;
        renderWizard();
      });
      return;
    }

    const chord = chords[wizardIndex];
    wizardPanel.innerHTML = `
      <h2>Calibrate your chords</h2>
      <p class="hint">
        Walk through each chord you use and capture its real sound — this matters more than
        anything else here, since it's what actually drives recognition.
      </p>
      <p class="small">Chord ${wizardIndex + 1} of ${chords.length}</p>
      <div class="row" style="align-items:center; gap:1.25rem">
        <div class="detected-chord">${chord.name}</div>
        ${chord.frets ? renderChordDiagram(chord.frets) : ''}
      </div>
      <p class="hint">Strum and hold ${chord.name}, then capture.</p>
      <div class="row">
        <button class="btn primary" id="wizard-capture" ${hasInput ? '' : 'disabled'}>Capture ${chord.name}</button>
        <button class="btn" id="wizard-skip">Skip</button>
      </div>
      ${!hasInput ? '<p class="small" style="margin-top:0.5rem">Enable audio input above first.</p>' : ''}
    `;

    wizardPanel.querySelector('#wizard-capture').addEventListener('click', () => {
      store.upsert({ id: chord.id, name: chord.name, source: chord.source, chroma: audioDetector.getSmoothedChroma() });
      wizardIndex++;
      renderWizard();
    });
    wizardPanel.querySelector('#wizard-skip').addEventListener('click', () => {
      wizardIndex++;
      renderWizard();
    });
  }

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

  audio.addEventListener('connected', renderControls);
  audio.addEventListener('disconnected', renderControls);
  audio.addEventListener('deviceschanged', renderControls);
  audio.addEventListener('connected', renderWizard);
  audio.addEventListener('disconnected', renderWizard);
  audio.addEventListener('connected', renderCalibratePanel);
  audio.addEventListener('disconnected', renderCalibratePanel);
  audio.addEventListener('chroma', onChroma);
  store.addEventListener('change', onStoreChange);

  renderControls();
  renderWizard();
  renderCalibratePanel();
  const cleanupLibrary = renderLibrary(container.querySelector('#library-host'), ctx);

  return () => {
    audio.removeEventListener('connected', renderControls);
    audio.removeEventListener('disconnected', renderControls);
    audio.removeEventListener('connected', renderWizard);
    audio.removeEventListener('disconnected', renderWizard);
    audio.removeEventListener('connected', renderCalibratePanel);
    audio.removeEventListener('disconnected', renderCalibratePanel);
    audio.removeEventListener('deviceschanged', renderControls);
    audio.removeEventListener('chroma', onChroma);
    store.removeEventListener('change', onStoreChange);
    cleanupLibrary?.();
  };
}
