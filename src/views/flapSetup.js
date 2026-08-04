import { ChordFlapGame } from '../games/chordFlap.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';

const CHORD_COUNT_DEFAULT = 3;
const SETTINGS_KEY = 'guitarGames.flapSetup';

export function renderFlap(container, ctx) {
  const { store, audio, detector } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let chordCount = saved.chordCount ?? CHORD_COUNT_DEFAULT;
  let chordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let game = null;

  function defaultAssignment(count) {
    const enabled = store.enabled();
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(enabled[i % enabled.length]?.id ?? null);
    }
    return ids;
  }

  function persistSettings() {
    saveJSON(SETTINGS_KEY, { chordCount, chordIds, keyboardFallback });
  }

  const enabledIds = new Set(store.enabled().map((c) => c.id));
  chordIds =
    Array.isArray(saved.chordIds) && saved.chordIds.length === chordCount && saved.chordIds.every((id) => enabledIds.has(id))
      ? saved.chordIds
      : defaultAssignment(chordCount);

  function renderSetup() {
    const enabled = store.enabled();

    container.innerHTML = `
      <div class="card">
        <h2>🐦 Chord Flap</h2>
        <p class="hint">
          Hold whichever chord is currently marked <strong>active</strong> to rise — let go (or play
          anything else) and gravity takes over. The active chord keeps rotating between your
          assigned chords through the run, so watch the legend rather than settling into one shape.
        </p>
        ${
          !audio.currentDeviceId
            ? '<p class="banner">No audio input connected. Connect your guitar/pedal under "Audio Setup", or enable keyboard fallback below to test.</p>'
            : ''
        }
        ${
          enabled.length < 2
            ? '<p class="banner">Enable at least 2 chords in the Chord Library to play.</p>'
            : ''
        }
        <div class="row" style="margin-bottom:1rem">
          <label class="small" for="chord-count">Chords to use</label>
          <select id="chord-count">
            ${[2, 3, 4].map((n) => `<option value="${n}" ${n === chordCount ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="lane-pick" id="chord-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">Enable number-key fallback 1-4, held down (for testing without a guitar)</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 2 ? 'disabled' : ''}>Start</button>
        </div>
      </div>
    `;

    const chordPick = container.querySelector('#chord-pick');
    chordPick.innerHTML = chordIds
      .map(
        (_, i) => `
        <div class="lane-slot">
          <label>Chord ${i + 1}</label>
          <select data-slot="${i}">
            ${enabled
              .map((c) => `<option value="${c.id}" ${chordIds[i] === c.id ? 'selected' : ''}>${c.name}</option>`)
              .join('')}
          </select>
          <div class="lane-diagram" data-diagram="${i}"></div>
        </div>
      `
      )
      .join('');

    function renderDiagram(i) {
      const chord = store.get(chordIds[i]);
      const holder = chordPick.querySelector(`[data-diagram="${i}"]`);
      holder.innerHTML = chord?.frets ? renderChordDiagram(chord.frets) : '<span class="small">no diagram</span>';
    }

    chordIds.forEach((_, i) => renderDiagram(i));

    chordPick.querySelectorAll('select[data-slot]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const i = Number(sel.dataset.slot);
        chordIds[i] = sel.value;
        renderDiagram(i);
        persistSettings();
      });
    });

    container.querySelector('#chord-count').addEventListener('change', (e) => {
      chordCount = Number(e.target.value);
      chordIds = defaultAssignment(chordCount);
      persistSettings();
      renderSetup();
    });

    container.querySelector('#kb-fallback').addEventListener('change', (e) => {
      keyboardFallback = e.target.checked;
      persistSettings();
    });

    const startBtn = container.querySelector('#start-btn');
    if (startBtn) startBtn.addEventListener('click', renderPlaying);
  }

  function renderPlaying() {
    const enabled = store.enabled();
    const chords = chordIds.map((id) => enabled.find((c) => c.id === id));

    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>Active chord: <strong id="hud-active-chord">${chords[0]?.name ?? '?'}</strong></span>
          <span>Score: <strong id="hud-score">0</strong></span>
        </div>
        <div class="lane-legend" id="flap-legend">
          ${chords
            .map(
              (c, i) => `
              <div class="legend-item" data-legend="${i}">
                <span class="small">${c?.name ?? '?'}</span>
                ${c?.frets ? renderChordDiagram(c.frets, { width: 48, height: 62 }) : ''}
              </div>
            `
            )
            .join('')}
        </div>
        <canvas id="flap-canvas" width="480" height="640"></canvas>
        <button class="btn" id="quit-btn">Quit to setup</button>
      </div>
    `;

    const canvas = container.querySelector('#flap-canvas');
    const scoreEl = container.querySelector('#hud-score');
    const activeChordEl = container.querySelector('#hud-active-chord');
    const legendEl = container.querySelector('#flap-legend');

    function highlightActive(idx) {
      activeChordEl.textContent = chords[idx]?.name ?? '?';
      legendEl.querySelectorAll('[data-legend]').forEach((el) => {
        el.classList.toggle('active', Number(el.dataset.legend) === idx);
      });
    }
    highlightActive(0);

    game = new ChordFlapGame(canvas, { chordIds, detector, keyboardFallback });
    game.addEventListener('tick', (e) => {
      scoreEl.textContent = e.detail.score;
    });
    game.addEventListener('rotate', (e) => highlightActive(e.detail.activeIndex));
    game.addEventListener('gameover', (e) => renderGameOver(e.detail.score));
    game.start();

    container.querySelector('#quit-btn').addEventListener('click', () => {
      game.stop();
      game = null;
      renderSetup();
    });
  }

  function renderGameOver(score) {
    container.innerHTML = `
      <div class="card game-over-panel">
        <h2>Game Over</h2>
        <div class="score">Score: ${score}</div>
        <p class="hint">
          Crashed into a pipe or the edge. Keep an eye on the legend — the active chord changes
          through the run.
        </p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">Play again</button>
          <button class="btn" id="setup-btn">Change settings</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'flap', score);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
