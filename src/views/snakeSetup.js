import { ChordSnakeGame, snakeParamsForLevel } from '../games/chordSnake.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

const SETTINGS_KEY = 'guitarGames.snakeSetup';
const SLOT_LABELS = ['Up', 'Down', 'Left', 'Right'];

export function renderSnake(container, ctx) {
  const { store, audio, detector } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let chordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let level = saved.level ?? DEFAULT_LEVEL;
  let game = null;

  function defaultAssignment() {
    const enabled = store.enabled();
    const ids = [];
    for (let i = 0; i < 4; i++) ids.push(enabled[i % enabled.length]?.id ?? null);
    return ids;
  }

  function persistSettings() {
    saveJSON(SETTINGS_KEY, { chordIds, keyboardFallback, level });
  }

  const enabledIds = new Set(store.enabled().map((c) => c.id));
  chordIds =
    Array.isArray(saved.chordIds) && saved.chordIds.length === 4 && saved.chordIds.every((id) => enabledIds.has(id))
      ? saved.chordIds
      : defaultAssignment();

  function renderSetup() {
    const enabled = store.enabled();

    container.innerHTML = `
      <div class="card">
        <h2>🐍 Chord Snake</h2>
        <p class="hint">
          Classic grid snake — four chords steer Up/Down/Left/Right. You can't turn straight back
          into your own body, so a mistaken chord match just gets ignored rather than ending the
          run outright. Eating food grows the snake and speeds the game up a little each time.
        </p>
        ${
          !audio.currentDeviceId
            ? '<p class="banner">No audio input connected. Connect your guitar/pedal under "Settings", or enable keyboard fallback below to test.</p>'
            : ''
        }
        ${
          enabled.length < 4
            ? '<p class="banner">Enable at least 4 chords in Settings to play.</p>'
            : ''
        }
        <div class="lane-pick" id="chord-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">Enable arrow-key fallback (for testing without a guitar)</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 4 ? 'disabled' : ''}>Start</button>
        </div>
      </div>
      <div class="card">
        <h2>Difficulty</h2>
        <p class="hint">
          Controls how fast the snake moves. Switching cleanly between four chords is harder than
          two, so start at Super Easy or Easy if this is your first run.
        </p>
        <div class="level-picker" id="level-picker"></div>
      </div>
    `;

    const chordPick = container.querySelector('#chord-pick');
    chordPick.innerHTML = SLOT_LABELS.map(
      (label, i) => `
        <div class="lane-slot">
          <label>${label}</label>
          <select data-slot="${i}">
            ${enabled
              .map((c) => `<option value="${c.id}" ${chordIds[i] === c.id ? 'selected' : ''}>${c.name}</option>`)
              .join('')}
          </select>
          <div class="lane-diagram" data-diagram="${i}"></div>
        </div>
      `
    ).join('');

    function renderDiagram(i) {
      const chord = store.get(chordIds[i]);
      const holder = chordPick.querySelector(`[data-diagram="${i}"]`);
      holder.innerHTML = chord?.frets ? renderChordDiagram(chord.frets) : '<span class="small">no diagram</span>';
    }

    SLOT_LABELS.forEach((_, i) => renderDiagram(i));

    chordPick.querySelectorAll('select[data-slot]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const i = Number(sel.dataset.slot);
        chordIds[i] = sel.value;
        renderDiagram(i);
        persistSettings();
      });
    });

    container.querySelector('#kb-fallback').addEventListener('change', (e) => {
      keyboardFallback = e.target.checked;
      persistSettings();
    });

    renderLevelPicker(container.querySelector('#level-picker'), {
      value: level,
      onChange: (newLevel) => {
        level = newLevel;
        persistSettings();
        renderSetup();
      },
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
          <span>Score: <strong id="hud-score">0</strong></span>
        </div>
        <div class="lane-legend">
          ${SLOT_LABELS.map(
            (label, i) => `
              <div class="legend-item">
                <span class="small">${label}: ${chords[i]?.name ?? '?'}</span>
                ${chords[i]?.frets ? renderChordDiagram(chords[i].frets, { width: 48, height: 62 }) : ''}
              </div>
            `
          ).join('')}
        </div>
        <canvas id="snake-canvas" width="480" height="480"></canvas>
        <button class="btn" id="quit-btn">Quit to setup</button>
      </div>
    `;

    const canvas = container.querySelector('#snake-canvas');
    const scoreEl = container.querySelector('#hud-score');

    game = new ChordSnakeGame(canvas, { chordIds, detector, keyboardFallback, ...snakeParamsForLevel(level) });
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
        <p class="hint">Hit a wall or your own tail. If four chords feel like a lot, drop down a difficulty level for more time between turns.</p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">Play again</button>
          <button class="btn" id="setup-btn">Change settings</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'snake', score);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
