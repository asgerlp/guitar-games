import { midiToName } from '../chords/noteUtils.js';

export function renderMidiSetup(container, ctx) {
  const { midi } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>MIDI Setup</h2>
      <p class="hint">
        Select the MIDI input your GP-50 (or its MIDI/USB interface) appears as.
        If nothing shows up, make sure the GP-50 is powered on, connected, and that your
        browser has granted MIDI permission (check the address bar).
      </p>
      <div class="row">
        <select id="device-select"></select>
        <button class="btn" id="refresh-btn">Refresh devices</button>
      </div>
      <p id="unsupported-msg" class="banner" style="display:none">
        This browser doesn't support the Web MIDI API. Use Chrome or Edge.
      </p>
    </div>
    <div class="card">
      <h2>Live monitor</h2>
      <p class="hint">Play notes/chords on the guitar and confirm they show up here in real time.</p>
      <div class="notes-live" id="live-notes">(nothing held)</div>
      <p class="row" style="margin-top:0.75rem">
        <span class="small">Best match:</span>
        <span class="detected-chord" id="live-chord">—</span>
      </p>
    </div>
  `;

  if (!midi.isSupported) {
    container.querySelector('#unsupported-msg').style.display = 'block';
  }

  const select = container.querySelector('#device-select');
  const liveNotes = container.querySelector('#live-notes');
  const liveChord = container.querySelector('#live-chord');

  function renderDeviceList() {
    const inputs = midi.listInputs();
    select.innerHTML = inputs.length
      ? inputs.map((i) => `<option value="${i.id}">${i.name}</option>`).join('')
      : '<option value="">No MIDI devices found</option>';
    if (midi.currentInputId) select.value = midi.currentInputId;
  }

  renderDeviceList();

  select.addEventListener('change', () => {
    if (select.value) midi.selectInput(select.value);
  });

  container.querySelector('#refresh-btn').addEventListener('click', renderDeviceList);

  const held = new Set();

  function renderLiveNotes() {
    liveNotes.textContent = held.size
      ? [...held].sort((a, b) => a - b).map(midiToName).join('  ')
      : '(nothing held)';
  }

  function onNoteOn(e) {
    held.add(e.detail.note);
    renderLiveNotes();
  }
  function onNoteOff(e) {
    held.delete(e.detail.note);
    renderLiveNotes();
  }
  function onDevicesChanged() {
    renderDeviceList();
  }
  function onChordChange(e) {
    const match = e.detail;
    liveChord.textContent = match ? `${match.name} (${Math.round(match.score * 100)}%)` : '—';
  }

  midi.addEventListener('noteon', onNoteOn);
  midi.addEventListener('noteoff', onNoteOff);
  midi.addEventListener('deviceschanged', onDevicesChanged);
  midi.addEventListener('connected', onDevicesChanged);
  ctx.detector.addEventListener('chordchange', onChordChange);

  return () => {
    midi.removeEventListener('noteon', onNoteOn);
    midi.removeEventListener('noteoff', onNoteOff);
    midi.removeEventListener('deviceschanged', onDevicesChanged);
    midi.removeEventListener('connected', onDevicesChanged);
    ctx.detector.removeEventListener('chordchange', onChordChange);
  };
}
