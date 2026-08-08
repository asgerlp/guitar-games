import { renderChordDiagram } from '../chords/chordDiagram.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { renderHighScoreSection } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

const SETTINGS_KEY = 'guitarGames.blocksSetup';
// Mirrors chordBlocks.js's BLOCK_TYPES — kept local so this module doesn't
// statically import from a file that pulls in three.js.
const BLOCK_TYPES = ['grass', 'dirt', 'stone', 'wood', 'leaves'];
const BLOCK_EMOJI = { grass: '🟩', dirt: '🟫', stone: '⬜', wood: '🟧', leaves: '🟢' };

export function renderBlocks(container, ctx) {
  const { store, audio, detector, t } = ctx;
  const saved = loadJSON(SETTINGS_KEY, {});

  let chordIds = [];
  let keyboardFallback = saved.keyboardFallback ?? false;
  let level = saved.level ?? DEFAULT_LEVEL;
  let game = null;

  function slotLabels() {
    return [t('blocks.forward'), t('blocks.turnLeft'), t('blocks.turnRight'), t('blocks.jump')];
  }

  function blockTypeLabel(type) {
    return t(`blocks.type.${type}`);
  }

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
        <h2>🧊 Chord Blocks</h2>
        <p class="hint">${t('blocks.description')}</p>
        ${!audio.currentDeviceId ? `<p class="banner">${t('common.noAudioBanner')}</p>` : ''}
        ${enabled.length < 4 ? `<p class="banner">${t('common.enableChordsBanner', { count: 4 })}</p>` : ''}
        <div class="lane-pick" id="chord-pick"></div>
        <label class="checkbox-row" style="margin-top:1rem">
          <input type="checkbox" id="kb-fallback" ${keyboardFallback ? 'checked' : ''} />
          <span class="small">${t('blocks.kbFallbackLabel')}</span>
        </label>
        <p class="hint" style="margin-top:0.75rem">${t('blocks.mouseHint')}</p>
        <div style="margin-top:1.25rem">
          <button class="btn primary" id="start-btn" ${enabled.length < 4 ? 'disabled' : ''}>${t('common.startBtn')}</button>
        </div>
      </div>
      <div class="card">
        <h2>${t('common.difficultyTitle')}</h2>
        <p class="hint">${t('blocks.difficultyHint')}</p>
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

  async function renderPlaying() {
    container.innerHTML = `
      <div class="game-canvas-wrap">
        <div class="hud">
          <span>${t('common.scoreLabel')} <strong id="hud-score">0</strong></span>
          <span>${t('blocks.timeHud')} <strong id="hud-time">--</strong></span>
        </div>
        <div class="lane-legend" id="palette"></div>
        <div class="crosshair-wrap">
          <canvas id="blocks-canvas" width="480" height="480"></canvas>
          <div class="crosshair" aria-hidden="true"></div>
        </div>
        <p class="hint" id="blocks-loading">${t('run.loadingEngine')}</p>
        <button class="btn" id="quit-btn">${t('common.quitBtn')}</button>
      </div>
    `;

    const canvas = container.querySelector('#blocks-canvas');
    const scoreEl = container.querySelector('#hud-score');
    const timeEl = container.querySelector('#hud-time');
    const paletteEl = container.querySelector('#palette');
    const loadingEl = container.querySelector('#blocks-loading');

    paletteEl.innerHTML = BLOCK_TYPES.map(
      (type, i) => `<button type="button" class="btn palette-btn${i === 0 ? ' active' : ''}" data-type="${type}">${BLOCK_EMOJI[type]} ${blockTypeLabel(type)}</button>`
    ).join('');

    container.querySelector('#quit-btn').addEventListener('click', () => {
      if (game) game.stop();
      game = null;
      renderSetup();
    });

    // Chord Blocks needs three.js, so it's loaded on demand here rather
    // than bundled into every page load.
    const { ChordBlocksGame, blocksParamsForLevel } = await import('../games/chordBlocks.js');
    if (!canvas.isConnected) return; // quit/navigated away while the engine was loading

    loadingEl.remove();
    game = new ChordBlocksGame(canvas, { chordIds, detector, keyboardFallback, ...blocksParamsForLevel(level) });

    paletteEl.querySelectorAll('[data-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        game.setPlaceType(btn.dataset.type);
        paletteEl.querySelectorAll('[data-type]').forEach((b) => b.classList.toggle('active', b === btn));
      });
    });

    game.addEventListener('tick', (e) => {
      scoreEl.textContent = e.detail.score;
      timeEl.textContent = Math.ceil(e.detail.timeLeft);
    });
    game.addEventListener('gameover', (e) => renderGameOver(e.detail.score));
    game.start();
  }

  function renderGameOver(score) {
    container.innerHTML = `
      <div class="card game-over-panel">
        <h2>${t('common.gameOverTitle')}</h2>
        <div class="score">${score}</div>
        <p class="hint">${t('blocks.gameOverHint')}</p>
        <div id="hs-host"></div>
        <div class="row" style="justify-content:center; margin-top:1rem">
          <button class="btn primary" id="retry-btn">${t('common.playAgainBtn')}</button>
          <button class="btn" id="setup-btn">${t('common.changeSettingsBtn')}</button>
        </div>
      </div>
    `;
    renderHighScoreSection(container.querySelector('#hs-host'), 'blocks', level, score, t);
    container.querySelector('#retry-btn').addEventListener('click', renderPlaying);
    container.querySelector('#setup-btn').addEventListener('click', renderSetup);
  }

  renderSetup();

  return () => {
    if (game) game.stop();
  };
}
