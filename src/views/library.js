import { formatNoteSet } from '../chords/noteUtils.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';

export function renderLibrary(container, ctx) {
  const { store, navigate } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>Chord Library</h2>
      <p class="hint">
        These are the chords the app recognizes. The "Enabled" column controls which chords are
        available to assign in games. To add a new chord or recalibrate one that isn't matching
        reliably, use <strong>Audio Setup → Calibrate from audio</strong> — it captures the chord's
        actual live sound, which works better than the defaults if your guitar/pickup/pedal sounds
        different from what they assume (standard tuning, open position).
      </p>
      <div class="row" style="margin-bottom:1rem">
        <button class="btn primary" id="go-to-audio-setup">Add / recalibrate a chord in Audio Setup</button>
      </div>
      <table>
        <thead>
          <tr><th>Enabled</th><th>Name</th><th>How to play</th><th>Notes</th><th>Source</th><th></th></tr>
        </thead>
        <tbody id="chord-rows"></tbody>
      </table>
    </div>
  `;

  const rowsEl = container.querySelector('#chord-rows');

  container.querySelector('#go-to-audio-setup').addEventListener('click', () => navigate('audio'));

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
          <td>${c.frets ? renderChordDiagram(c.frets) : '<span class="small">no diagram</span>'}</td>
          <td class="small">${c.notes?.length ? formatNoteSet(c.notes) : c.chroma ? 'captured from audio' : '—'}</td>
          <td class="small">${c.source}</td>
          <td class="row">
            ${c.source === 'custom' ? `<button class="btn danger" data-delete="${c.id}">Delete</button>` : ''}
          </td>
        </tr>
      `
      )
      .join('');

    rowsEl.querySelectorAll('[data-toggle]').forEach((el) => {
      el.addEventListener('change', () => store.setEnabled(el.dataset.toggle, el.checked));
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

  return () => {
    store.removeEventListener('change', onStoreChange);
  };
}
