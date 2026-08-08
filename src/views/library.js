import { formatNoteSet } from '../chords/noteUtils.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';

export function renderLibrary(container, ctx) {
  const { store, t } = ctx;

  container.innerHTML = `
    <h2>${t('library.title')}</h2>
    <p class="hint">${t('library.intro')}</p>
    <table>
      <thead>
        <tr>
          <th>${t('library.colEnabled')}</th>
          <th>${t('library.colName')}</th>
          <th>${t('library.colHowToPlay')}</th>
          <th>${t('library.colNotes')}</th>
          <th>${t('library.colSource')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="chord-rows"></tbody>
    </table>
  `;

  const rowsEl = container.querySelector('#chord-rows');

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
          <td>${c.frets ? renderChordDiagram(c.frets) : `<span class="small">${t('library.noDiagram')}</span>`}</td>
          <td class="small">${c.notes?.length ? formatNoteSet(c.notes) : c.chroma ? t('library.capturedFromAudio') : '—'}</td>
          <td class="small">${c.source}</td>
          <td class="row">
            ${c.source === 'custom' ? `<button class="btn danger" data-delete="${c.id}">${t('library.deleteBtn')}</button>` : ''}
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
        if (confirm(t('library.confirmDelete'))) {
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
