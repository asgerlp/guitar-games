import { ChordRacerGame } from '../games/chordRacer.js';

const LANE_COUNT_DEFAULT = 2;

export function renderRacer(container, ctx) {
  const { store, midi, detector } = ctx;

  let laneCount = LANE_COUNT_DEFAULT;
  let laneChordIds = [];
  let keyboardFallback = false;
  let game = null;

  function defaultLaneAssignment(count) {
    const enabled = store.enabled();
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(enabled[i % enabled.length]?.id ?? null);
    }
    return ids;
  }

  laneChordIds = defaultLaneAssignment(laneCount);

  function renderSetup() {
    const enabled = store.enabled();
    const laneLabels = laneCount === 2 ? ['Left', 'Right'] : Array.from({ length: laneCount }, (_, i) => `Lane ${i + 1}`);

    container.innerHTML = `
      <div class="card">
        <h2>🏎️ Chord Racer</h2>
        <p class="hint">
          The car drifts to whichever lane's chord you're currently holding. Obstacles fall faster
          the longer you survive — switch chords cleanly and quickly to dodge them.
        </p>
        ${
          !midi.currentInput
            ? '<p class="banner">No MIDI device connected. Connect your GP-50 under "MIDI Setup", or enable keyboard fallback below to test.</p>'
            : ''
        }
        ${
          enabled.length < 2
            ? '<p class="banner">Enable at least 2 chords in the Chord Library to play.</p>'
            : ''
        }
        <div class="row" style="margin-bottom:1rem">
          <label class="small" for="lane-count">Lanes</label>
          <select id="lane-count">
            ${[2, 3, 4].map((n) => `<option value="${n}" ${n === laneCount ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="lane-pick" id="lane-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">Enable arrow-key fallback (for testing without a guitar)</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 2 ? 'disabled' : ''}>Start</button>
        </div>
      </div>
    `;

    const lanePick = container.querySelector('#lane-pick');
    lanePick.innerHTML = laneLabels
      .map(
        (label, i) => `
        <div class="lane-slot">
          <label>${label}</label>
          <select data-lane="${i}">
            ${enabled
              .map((c) => `<option value="${c.id}" ${laneChordIds[i] === c.id ? 'selected' : ''}>${c.name}</option>`)
              .join('')}
          </select>
        </div>
      `
      )
      .join('');

    lanePick.querySelectorAll('select[data-lane]').forEach((sel) => {
      sel.addEventListener('change', () => {
        laneChordIds[Number(sel.dataset.lane)] = sel.value;
      });
    });

    container.querySelector('#lane-count').addEventListener('change', (e) => {
      laneCount = Number(e.target.value);
      laneChordIds = defaultLaneAssignment(laneCount);
      renderSetup();
    });

    container.querySelector('#kb-fallback').addEventListener('change', (e) => {
      keyboardFallback = e.target.checked;
    });

    const startBtn = container.querySelector('#start-btn');
    if (startBtn) startBtn.addEventListener('click', renderPlaying);
  }

  function renderPlaying() {
    const enabled = store.enabled();
    const laneNames = laneChordIds.map((id) => enabled.find((c) => c.id === id)?.name ?? '?');

    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>Score: <strong id="hud-score">0</strong></span>
          <span>Lanes: <strong>${laneNames.join(' / ')}</strong></span>
        </div>
        <canvas id="racer-canvas" width="480" height="640"></canvas>
        <button class="btn" id="quit-btn">Quit to setup</button>
      </div>
    `;

    const canvas = container.querySelector('#racer-canvas');
    const scoreEl = container.querySelector('#hud-score');

    game = new ChordRacerGame(canvas, { laneChordIds, detector, keyboardFallback });
    game.addEventListener('tick', (e) => {
      scoreEl.textContent = e.detail.score;
    });
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
        <div class="score">${score}</div>
        <p class="hint">Try switching chords faster and cleaner to react quicker next run.</p>
        <div class="row" style="justify-content:center">
          <button class="btn primary" id="retry-btn">Play again</button>
          <button class="btn" id="setup-btn">Change settings</button>
        </div>
      </div>
    `;
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
