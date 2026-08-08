import { ChordFightGame, ACTION_DEFS, actionTypesForCount, cpuParamsForLevel } from '../games/chordFight.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

const ACTION_COUNT_DEFAULT = 2;
const SETTINGS_KEY = 'guitarGames.fightSetup';

export function renderFight(container, ctx) {
  const { store, audio, detector } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let actionCount = saved.actionCount ?? ACTION_COUNT_DEFAULT;
  let actionChordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let level = saved.level ?? DEFAULT_LEVEL;
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
    saveJSON(SETTINGS_KEY, { actionCount, actionChordIds, keyboardFallback, level });
  }

  const enabledIds = new Set(store.enabled().map((c) => c.id));
  actionChordIds =
    Array.isArray(saved.actionChordIds) &&
    saved.actionChordIds.length === actionCount &&
    saved.actionChordIds.every((id) => enabledIds.has(id))
      ? saved.actionChordIds
      : defaultAssignment(actionCount);

  function renderSetup() {
    const enabled = store.enabled();
    const actionTypes = actionTypesForCount(actionCount);

    container.innerHTML = `
      <div class="card">
        <h2>🥋 Chord Fight</h2>
        <p class="hint">
          Face off against the CPU. It briefly winds up before every attack — hold whichever
          chord you've mapped to <strong>Block</strong> during that window to negate it. Play an
          attack-type chord to hit back; each one has a short cooldown, so switching between
          chords is what actually wins fights, not spamming one.
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
          <label class="small" for="action-count">Chords to use</label>
          <select id="action-count">
            ${[2, 3, 4].map((n) => `<option value="${n}" ${n === actionCount ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="lane-pick" id="action-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">Enable number-key fallback 1-4 (for testing without a guitar)</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 2 ? 'disabled' : ''}>Start</button>
        </div>
      </div>
      <div class="card">
        <h2>Difficulty</h2>
        <p class="hint">Controls how fast and hard the CPU attacks, and how long its wind-up telegraph gives you to block.</p>
        <div class="level-picker" id="level-picker"></div>
      </div>
    `;

    const actionPick = container.querySelector('#action-pick');
    actionPick.innerHTML = actionTypes
      .map(
        (type, i) => `
        <div class="lane-slot">
          <label>${ACTION_DEFS[type].label}</label>
          <select data-action="${i}">
            ${enabled
              .map((c) => `<option value="${c.id}" ${actionChordIds[i] === c.id ? 'selected' : ''}>${c.name}</option>`)
              .join('')}
          </select>
          <div class="lane-diagram" data-diagram="${i}"></div>
        </div>
      `
      )
      .join('');

    function renderDiagram(i) {
      const chord = store.get(actionChordIds[i]);
      const holder = actionPick.querySelector(`[data-diagram="${i}"]`);
      holder.innerHTML = chord?.frets ? renderChordDiagram(chord.frets) : '<span class="small">no diagram</span>';
    }

    actionTypes.forEach((_, i) => renderDiagram(i));

    actionPick.querySelectorAll('select[data-action]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const i = Number(sel.dataset.action);
        actionChordIds[i] = sel.value;
        renderDiagram(i);
        persistSettings();
      });
    });

    container.querySelector('#action-count').addEventListener('change', (e) => {
      actionCount = Number(e.target.value);
      actionChordIds = defaultAssignment(actionCount);
      persistSettings();
      renderSetup();
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
    const actionTypes = actionTypesForCount(actionCount);
    const actionChords = actionChordIds.map((id) => enabled.find((c) => c.id === id));

    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>You: <strong id="hud-player-hp">100</strong> HP</span>
          <span>CPU: <strong id="hud-cpu-hp">100</strong> HP</span>
        </div>
        <div class="lane-legend">
          ${actionTypes
            .map(
              (type, i) => `
              <div class="legend-item">
                <span class="small">${ACTION_DEFS[type].label}: ${actionChords[i]?.name ?? '?'}</span>
                ${actionChords[i]?.frets ? renderChordDiagram(actionChords[i].frets, { width: 48, height: 62 }) : ''}
              </div>
            `
            )
            .join('')}
        </div>
        <canvas id="fight-canvas" width="480" height="480"></canvas>
        <button class="btn" id="quit-btn">Quit to setup</button>
      </div>
    `;

    const canvas = container.querySelector('#fight-canvas');
    const playerHpEl = container.querySelector('#hud-player-hp');
    const cpuHpEl = container.querySelector('#hud-cpu-hp');

    game = new ChordFightGame(canvas, {
      actionChordIds,
      actionTypes,
      detector,
      keyboardFallback,
      ...cpuParamsForLevel(level),
    });
    game.addEventListener('tick', (e) => {
      playerHpEl.textContent = Math.round(e.detail.playerHealth);
      cpuHpEl.textContent = Math.round(e.detail.cpuHealth);
    });
    game.addEventListener('gameover', (e) => renderGameOver(e.detail.result, e.detail.score));
    game.start();

    container.querySelector('#quit-btn').addEventListener('click', () => {
      game.stop();
      game = null;
      renderSetup();
    });
  }

  function renderGameOver(result, score) {
    const win = result === 'win';
    container.innerHTML = `
      <div class="card game-over-panel">
        <h2 class="${win ? 'win' : 'lose'}">${win ? 'You Win!' : 'Knocked Out'}</h2>
        <div class="score">${win ? '🥋' : '💥'}</div>
        <p class="hint">
          ${win ? 'Nice reflexes — block on time and hit back cleanly for a rematch.' : 'The CPU got the better of you this time. Watch for the wind-up and block it.'}
        </p>
        <p class="hint">Damage dealt: <strong>${score}</strong></p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">Play again</button>
          <button class="btn" id="setup-btn">Change settings</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'fight', score);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
