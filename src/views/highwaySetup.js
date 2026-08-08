import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

const LANE_COUNT_DEFAULT = 4;
const SETTINGS_KEY = 'guitarGames.highwaySetup';

export function renderHighway(container, ctx) {
  const { store, audio, detector, t } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let laneCount = saved.laneCount ?? LANE_COUNT_DEFAULT;
  let laneChordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let level = saved.level ?? DEFAULT_LEVEL;
  let game = null;

  function laneLabelsFor(count) {
    return Array.from({ length: count }, (_, i) => t('highway.laneN', { n: i + 1 }));
  }

  function defaultLaneAssignment(count) {
    const enabled = store.enabled();
    const ids = [];
    for (let i = 0; i < count; i++) ids.push(enabled[i % enabled.length]?.id ?? null);
    return ids;
  }

  function persistSettings() {
    saveJSON(SETTINGS_KEY, { laneCount, laneChordIds, keyboardFallback, level });
  }

  const enabledIds = new Set(store.enabled().map((c) => c.id));
  laneChordIds =
    Array.isArray(saved.laneChordIds) &&
    saved.laneChordIds.length === laneCount &&
    saved.laneChordIds.every((id) => enabledIds.has(id))
      ? saved.laneChordIds
      : defaultLaneAssignment(laneCount);

  function renderSetup() {
    const enabled = store.enabled();
    const laneLabels = laneLabelsFor(laneCount);

    container.innerHTML = `
      <div class="card">
        <h2>🎶 Chord Highway</h2>
        <p class="hint">${t('highway.description')}</p>
        ${!audio.currentDeviceId ? `<p class="banner">${t('common.noAudioBanner')}</p>` : ''}
        ${enabled.length < 3 ? `<p class="banner">${t('common.enableChordsBanner', { count: 3 })}</p>` : ''}
        <div class="row" style="margin-bottom:1rem">
          <label class="small" for="lane-count">${t('highway.lanesLabel')}</label>
          <select id="lane-count">
            ${[3, 4, 5].map((n) => `<option value="${n}" ${n === laneCount ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="lane-pick" id="lane-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">${t('highway.kbFallbackLabel')}</span>
        </label>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 3 ? 'disabled' : ''}>${t('common.startBtn')}</button>
        </div>
      </div>
      <div class="card">
        <h2>${t('common.difficultyTitle')}</h2>
        <p class="hint">${t('highway.difficultyHint')}</p>
        <div class="level-picker" id="level-picker"></div>
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
      holder.innerHTML = chord?.frets ? renderChordDiagram(chord.frets) : `<span class="small">${t('common.noDiagram')}</span>`;
    }

    laneLabels.forEach((_, i) => renderLaneDiagram(i));

    lanePick.querySelectorAll('select[data-lane]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const i = Number(sel.dataset.lane);
        laneChordIds[i] = sel.value;
        renderLaneDiagram(i);
        persistSettings();
      });
    });

    container.querySelector('#lane-count').addEventListener('change', (e) => {
      laneCount = Number(e.target.value);
      laneChordIds = defaultLaneAssignment(laneCount);
      persistSettings();
      renderSetup();
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

  async function renderPlaying() {
    const enabled = store.enabled();
    const laneChords = laneChordIds.map((id) => enabled.find((c) => c.id === id));

    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>${t('common.scoreLabel')} <strong id="hud-score">0</strong></span>
          <span>${t('highway.comboHud')} <strong id="hud-combo">0</strong></span>
          <span>${t('highway.healthHud')} <strong id="hud-health">100</strong></span>
        </div>
        <div class="lane-legend">
          ${laneChords
            .map(
              (c, i) => `
              <div class="legend-item">
                <span class="small">${t('highway.laneN', { n: i + 1 })}: ${c?.name ?? '?'}</span>
                ${c?.frets ? renderChordDiagram(c.frets, { width: 48, height: 62 }) : ''}
              </div>
            `
            )
            .join('')}
        </div>
        <canvas id="highway-canvas" width="480" height="480"></canvas>
        <p class="hint" id="highway-loading">${t('run.loadingEngine')}</p>
        <button class="btn" id="quit-btn">${t('common.quitBtn')}</button>
      </div>
    `;

    const canvas = container.querySelector('#highway-canvas');
    const scoreEl = container.querySelector('#hud-score');
    const comboEl = container.querySelector('#hud-combo');
    const healthEl = container.querySelector('#hud-health');
    const loadingEl = container.querySelector('#highway-loading');

    container.querySelector('#quit-btn').addEventListener('click', () => {
      if (game) game.stop();
      game = null;
      renderSetup();
    });

    // Chord Highway needs three.js, so it's loaded on demand here rather
    // than bundled into every page load.
    const { ChordHighwayGame, highwayParamsForLevel } = await import('../games/chordHighway.js');
    if (!canvas.isConnected) return; // quit/navigated away while the engine was loading

    loadingEl.remove();
    game = new ChordHighwayGame(canvas, { laneChordIds, detector, keyboardFallback, ...highwayParamsForLevel(level) });
    game.addEventListener('tick', (e) => {
      scoreEl.textContent = e.detail.score;
      comboEl.textContent = e.detail.combo;
      healthEl.textContent = Math.round(e.detail.health);
    });
    game.addEventListener('gameover', (e) => renderGameOver(e.detail.score));
    game.start();
  }

  function renderGameOver(score) {
    container.innerHTML = `
      <div class="card game-over-panel">
        <h2>${t('common.gameOverTitle')}</h2>
        <div class="score">${score}</div>
        <p class="hint">${t('highway.gameOverHint')}</p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">${t('common.playAgainBtn')}</button>
          <button class="btn" id="setup-btn">${t('common.changeSettingsBtn')}</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'highway', level, score, t);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
