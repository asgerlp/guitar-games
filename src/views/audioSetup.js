const NOTE_LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function renderAudioSetup(container, ctx) {
  const { audio, audioDetector, store } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>Audio Setup</h2>
      <p class="hint">
        Listens to your USB audio interface/pedal directly — not your laptop's built-in
        microphone — and detects chords from the sound itself. Pick the device your guitar/pedal
        actually appears as below, not the built-in mic.
      </p>
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
        <span class="small">Best match:</span>
        <span class="detected-chord" id="live-chord">—</span>
      </p>
      <p class="small" id="diagnostics">Level: — · closest: —</p>
    </div>
    <div class="card" id="calibrate-panel"></div>
  `;

  const controls = container.querySelector('#audio-controls');
  const fills = [...container.querySelectorAll('[data-fill]')];
  const liveChord = container.querySelector('#live-chord');
  const diagnostics = container.querySelector('#diagnostics');
  const calibratePanel = container.querySelector('#calibrate-panel');

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

  function renderCalibratePanel() {
    const chords = store.list();
    const hasInput = !!audio.currentDeviceId;
    calibratePanel.innerHTML = `
      <h2>Calibrate from audio</h2>
      <p class="hint">
        Every guitar/pickup/pedal sounds a little different. If a chord isn't matching reliably,
        strum and hold it clearly, then capture its live sound as that chord's audio reference.
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

    const levelText = Number.isFinite(audioDetector.lastLevel) ? `${Math.round(audioDetector.lastLevel)} dB` : '—';
    const candidate = audioDetector.lastCandidate;
    const closestText = candidate ? `${candidate.name} (${Math.round(candidate.score * 100)}%)` : '—';
    diagnostics.textContent = `Level: ${levelText} · closest: ${closestText}`;
  }

  function onChordChange(e) {
    const match = e.detail;
    liveChord.textContent = match ? `${match.name} (${Math.round(match.score * 100)}%)` : '—';
  }

  function onStoreChange() {
    renderCalibratePanel();
  }

  audio.addEventListener('connected', renderControls);
  audio.addEventListener('disconnected', renderControls);
  audio.addEventListener('deviceschanged', renderControls);
  audio.addEventListener('connected', renderCalibratePanel);
  audio.addEventListener('disconnected', renderCalibratePanel);
  audio.addEventListener('chroma', onChroma);
  audioDetector.addEventListener('chordchange', onChordChange);
  store.addEventListener('change', onStoreChange);

  renderControls();
  renderCalibratePanel();

  return () => {
    audio.removeEventListener('connected', renderControls);
    audio.removeEventListener('disconnected', renderControls);
    audio.removeEventListener('connected', renderCalibratePanel);
    audio.removeEventListener('disconnected', renderCalibratePanel);
    audio.removeEventListener('deviceschanged', renderControls);
    audio.removeEventListener('chroma', onChroma);
    audioDetector.removeEventListener('chordchange', onChordChange);
    store.removeEventListener('change', onStoreChange);
  };
}
