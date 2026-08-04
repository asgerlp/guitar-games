import { ChordRacerGame } from '../games/chordRacer.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';
import { DifficultyModel } from '../games/difficulty.js';

const LANE_COUNT_DEFAULT = 2;

export function renderRacer(container, ctx) {
  const { store, midi, detector } = ctx;
  const difficulty = new DifficultyModel();

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
      <div class="card">
        <h2>Difficulty</h2>
        <p class="hint">
          Speed adapts to you automatically: a run that ends almost instantly backs it off, a run
          you comfortably survive pushes it up, and everything in between nudges it up gently over
          time. No settings to tune by hand.
        </p>
        <div class="row">
          <span class="small">Current start speed: <strong>${Math.round(difficulty.get().startSpeed)}</strong> px/s</span>
          <span class="small">Ramp: <strong>${difficulty.get().rampPerSec.toFixed(1)}</strong> px/s²</span>
          <button class="btn" id="reset-difficulty-btn">Reset to default</button>
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
          <div class="lane-diagram" data-diagram="${i}"></div>
        </div>
      `
      )
      .join('');

    function renderLaneDiagram(i) {
      const chord = store.get(laneChordIds[i]);
      const holder = lanePick.querySelector(`[data-diagram="${i}"]`);
      holder.innerHTML = chord?.frets
        ? renderChordDiagram(chord.frets)
        : '<span class="small">no diagram</span>';
    }

    laneLabels.forEach((_, i) => renderLaneDiagram(i));

    lanePick.querySelectorAll('select[data-lane]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const i = Number(sel.dataset.lane);
        laneChordIds[i] = sel.value;
        renderLaneDiagram(i);
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

    container.querySelector('#reset-difficulty-btn').addEventListener('click', () => {
      difficulty.reset();
      renderSetup();
    });

    const startBtn = container.querySelector('#start-btn');
    if (startBtn) startBtn.addEventListener('click', renderPlaying);
  }

  function renderPlaying() {
    const enabled = store.enabled();
    const laneChords = laneChordIds.map((id) => enabled.find((c) => c.id === id));
    const laneLabels =
      laneCount === 2 ? ['Left', 'Right'] : Array.from({ length: laneCount }, (_, i) => `Lane ${i + 1}`);

    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>Score: <strong id="hud-score">0</strong></span>
          <span>Lanes: <strong>${laneChords.map((c) => c?.name ?? '?').join(' / ')}</strong></span>
        </div>
        <div class="lane-legend">
          ${laneLabels
            .map(
              (label, i) => `
              <div class="legend-item">
                <span class="small">${label}: ${laneChords[i]?.name ?? '?'}</span>
                ${laneChords[i]?.frets ? renderChordDiagram(laneChords[i].frets, { width: 48, height: 62 }) : ''}
              </div>
            `
            )
            .join('')}
        </div>
        <canvas id="racer-canvas" width="480" height="640"></canvas>
        <button class="btn" id="quit-btn">Quit to setup</button>
      </div>
    `;

    const canvas = container.querySelector('#racer-canvas');
    const scoreEl = container.querySelector('#hud-score');

    const { startSpeed, rampPerSec } = difficulty.get();
    game = new ChordRacerGame(canvas, { laneChordIds, detector, keyboardFallback, startSpeed, rampPerSec });
    game.addEventListener('tick', (e) => {
      scoreEl.textContent = e.detail.score;
    });
    game.addEventListener('gameover', (e) => {
      const direction = difficulty.recordRun({ elapsedSeconds: e.detail.elapsedSeconds });
      renderGameOver(e.detail.score, direction);
    });
    game.start();

    container.querySelector('#quit-btn').addEventListener('click', () => {
      game.stop();
      game = null;
      renderSetup();
    });
  }

  function renderGameOver(score, direction) {
    const feedback = {
      up: "Nice run — next one starts a little faster.",
      down: "That was over fast — next one starts a little slower so you can find your footing.",
      same: 'Difficulty holding steady for the next run.',
    }[direction];

    container.innerHTML = `
      <div class="card game-over-panel">
        <h2>Game Over</h2>
        <div class="score">${score}</div>
        <p class="hint">${feedback}</p>
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
