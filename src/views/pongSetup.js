import { ChordPongGame, pongParamsForLevel } from '../games/chordPong.js';
import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

const SETTINGS_KEY = 'guitarGames.pongSetup';

export function renderPong(container, ctx) {
  const { store, audio, detector, t } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let chordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let level = saved.level ?? DEFAULT_LEVEL;
  let game = null;

  function slotLabels() {
    return [t('pong.moveLeft'), t('pong.moveRight')];
  }

  function defaultAssignment() {
    const enabled = store.enabled();
    return [enabled[0]?.id ?? null, enabled[1 % enabled.length]?.id ?? null];
  }

  function persistSettings() {
    saveJSON(SETTINGS_KEY, { chordIds, keyboardFallback, level });
  }

  const enabledIds = new Set(store.enabled().map((c) => c.id));
  chordIds =
    Array.isArray(saved.chordIds) && saved.chordIds.length === 2 && saved.chordIds.every((id) => enabledIds.has(id))
      ? saved.chordIds
      : defaultAssignment();

  function renderSetup() {
    const enabled = store.enabled();

    container.innerHTML = `
      <div class="card">
        <h2>🏓 Chord Pong</h2>
        <p class="hint">${t('pong.description')}</p>
        ${!audio.currentDeviceId ? `<p class="banner">${t('common.noAudioBanner')}</p>` : ''}
        ${enabled.length < 2 ? `<p class="banner">${t('common.enableChordsBanner', { count: 2 })}</p>` : ''}
        <div class="lane-pick" id="chord-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">${t('pong.kbFallbackLabel')}</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 2 ? 'disabled' : ''}>${t('common.startBtn')}</button>
        </div>
      </div>
      <div class="card">
        <h2>${t('common.difficultyTitle')}</h2>
        <p class="hint">${t('pong.difficultyHint')}</p>
        <div class="level-picker" id="level-picker"></div>
      </div>
    `;

    const chordPick = container.querySelector('#chord-pick');
    chordPick.innerHTML = slotLabels().map(
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
      holder.innerHTML = chord?.frets ? renderChordDiagram(chord.frets) : `<span class="small">${t('common.noDiagram')}</span>`;
    }

    slotLabels().forEach((_, i) => renderDiagram(i));

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
      t,
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
          <span>${t('pong.rallyHud')} <strong id="hud-score">0</strong></span>
        </div>
        <div class="lane-legend">
          ${slotLabels().map(
            (label, i) => `
              <div class="legend-item">
                <span class="small">${label}: ${chords[i]?.name ?? '?'}</span>
                ${chords[i]?.frets ? renderChordDiagram(chords[i].frets, { width: 48, height: 62 }) : ''}
              </div>
            `
          ).join('')}
        </div>
        <canvas id="pong-canvas" width="480" height="640"></canvas>
        <button class="btn" id="quit-btn">${t('common.quitBtn')}</button>
      </div>
    `;

    const canvas = container.querySelector('#pong-canvas');
    const scoreEl = container.querySelector('#hud-score');

    game = new ChordPongGame(canvas, { chordIds, detector, keyboardFallback, ...pongParamsForLevel(level) });
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
        <h2>${t('common.gameOverTitle')}</h2>
        <div class="score">${score}</div>
        <p class="hint">${t('pong.gameOverHint')}</p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">${t('common.playAgainBtn')}</button>
          <button class="btn" id="setup-btn">${t('common.changeSettingsBtn')}</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'pong', level, score, t);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
