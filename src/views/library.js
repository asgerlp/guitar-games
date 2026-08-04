import { formatNoteSet, midiToName } from '../chords/noteUtils.js';

export function renderLibrary(container, ctx) {
  const { store, midi, detector } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>Chord Library</h2>
      <p class="hint">
        These are the chords the app recognizes. The "Enabled" column controls which chords are
        available to assign in games. Notes are absolute MIDI pitches — re-record any chord from
        your own guitar if the defaults (standard tuning, open position) don't match what your
        GP-50 actually sends.
      </p>
      <table>
        <thead>
          <tr><th>Enabled</th><th>Name</th><th>Notes</th><th>Source</th><th></th></tr>
        </thead>
        <tbody id="chord-rows"></tbody>
      </table>
    </div>
    <div class="card" id="record-panel"></div>
  `;

  const rowsEl = container.querySelector('#chord-rows');
  const recordPanel = container.querySelector('#record-panel');

  // --- recording state -----------------------------------------------
  let recording = null; // { id: string|null, name: string } while capture panel is open
  let heldNotes = new Set();

  function onNoteOn(e) {
    heldNotes.add(e.detail.note);
    renderRecordPanel();
  }
  function onNoteOff(e) {
    heldNotes.delete(e.detail.note);
    renderRecordPanel();
  }
  midi.addEventListener('noteon', onNoteOn);
  midi.addEventListener('noteoff', onNoteOff);

  function startRecording(target) {
    recording = target;
    heldNotes = new Set();
    renderRecordPanel();
  }

  function cancelRecording() {
    recording = null;
    renderRecordPanel();
  }

  function captureChord() {
    if (heldNotes.size < 2) return;
    const notes = [...heldNotes];
    const id = recording.id ?? store.makeCustomId(recording.name);
    const existing = recording.id ? store.get(recording.id) : null;
    store.upsert({
      id,
      name: recording.name,
      notes,
      source: existing?.source ?? 'custom',
    });
    recording = null;
    renderRecordPanel();
    renderRows();
  }

  function renderRecordPanel() {
    if (!recording) {
      recordPanel.innerHTML = `
        <h2>Add a new chord</h2>
        <p class="hint">Give it a name, strum and hold the chord on your guitar, then capture it.</p>
        <div class="row">
          <input type="text" id="new-chord-name" placeholder="e.g. F major" />
          <button class="btn primary" id="start-add">Start recording</button>
        </div>
      `;
      recordPanel.querySelector('#start-add').addEventListener('click', () => {
        const name = recordPanel.querySelector('#new-chord-name').value.trim();
        if (!name) return;
        startRecording({ id: null, name });
      });
      return;
    }

    const liveNotes = [...heldNotes].sort((a, b) => a - b).map(midiToName).join('  ');
    recordPanel.innerHTML = `
      <h2>Recording: ${recording.name}</h2>
      <p class="hint">Strum and hold the chord. Once at least two notes are held, capture it.</p>
      <div class="notes-live">${liveNotes || '(nothing held)'}</div>
      <div class="row" style="margin-top:0.75rem">
        <button class="btn primary" id="capture-btn" ${heldNotes.size < 2 ? 'disabled' : ''}>
          Capture (${heldNotes.size} note${heldNotes.size === 1 ? '' : 's'} held)
        </button>
        <button class="btn" id="cancel-btn">Cancel</button>
      </div>
    `;
    recordPanel.querySelector('#capture-btn').addEventListener('click', captureChord);
    recordPanel.querySelector('#cancel-btn').addEventListener('click', cancelRecording);
  }

  // --- library table ----------------------------------------------------
  function renderRows() {
    rowsEl.innerHTML = store
      .list()
      .map(
        (c) => `
        <tr>
          <td>
            <input type="checkbox" data-toggle="${c.id}" ${store.isEnabled(c.id) ? 'checked' : ''} />
          </td>
          <td>${c.name}</td>
          <td class="small">${formatNoteSet(c.notes)}</td>
          <td class="small">${c.source}</td>
          <td class="row">
            <button class="btn" data-rerecord="${c.id}">Re-record</button>
            ${c.source === 'custom' ? `<button class="btn danger" data-delete="${c.id}">Delete</button>` : ''}
          </td>
        </tr>
      `
      )
      .join('');

    rowsEl.querySelectorAll('[data-toggle]').forEach((el) => {
      el.addEventListener('change', () => store.setEnabled(el.dataset.toggle, el.checked));
    });
    rowsEl.querySelectorAll('[data-rerecord]').forEach((el) => {
      el.addEventListener('click', () => {
        const chord = store.get(el.dataset.rerecord);
        startRecording({ id: chord.id, name: chord.name });
      });
    });
    rowsEl.querySelectorAll('[data-delete]').forEach((el) => {
      el.addEventListener('click', () => {
        if (confirm('Delete this chord from your library?')) {
          store.remove(el.dataset.delete);
          renderRows();
        }
      });
    });
  }

  function onStoreChange() {
    renderRows();
  }
  store.addEventListener('change', onStoreChange);

  renderRows();
  renderRecordPanel();

  return () => {
    midi.removeEventListener('noteon', onNoteOn);
    midi.removeEventListener('noteoff', onNoteOff);
    store.removeEventListener('change', onStoreChange);
  };
}
