import { getHighScores, highScoreTableHTML, levelsWithScores, GAME_LABELS } from '../lib/highScores.js';
import { renderLevelPicker } from './levelPicker.js';
import { DEFAULT_LEVEL } from '../games/difficultyLevels.js';

export function renderHighScores(container) {
  // Each game defaults to whichever level it already has scores on (the
  // highest one played so far), falling back to the app-wide default so a
  // never-played game still shows a sensible tab.
  const viewLevel = {};
  for (const gameId of Object.keys(GAME_LABELS)) {
    const withScores = levelsWithScores(gameId);
    viewLevel[gameId] = withScores.length ? withScores[withScores.length - 1] : DEFAULT_LEVEL;
  }

  container.innerHTML = `
    <div class="card">
      <h2>🏆 High Scores</h2>
      <p class="hint">Top 10 for each game, tracked separately per difficulty level, saved on this device.</p>
    </div>
    ${Object.keys(GAME_LABELS)
      .map(
        (gameId) => `
        <div class="card">
          <h3>${GAME_LABELS[gameId]}</h3>
          <div class="level-picker" id="hs-level-picker-${gameId}" style="margin-bottom:1rem"></div>
          <div id="hs-table-${gameId}"></div>
        </div>
      `
      )
      .join('')}
  `;

  for (const gameId of Object.keys(GAME_LABELS)) {
    const tableEl = container.querySelector(`#hs-table-${gameId}`);
    const pickerEl = container.querySelector(`#hs-level-picker-${gameId}`);
    const withScores = new Set(levelsWithScores(gameId));

    function renderTable() {
      tableEl.innerHTML = highScoreTableHTML(getHighScores(gameId, viewLevel[gameId]));
    }

    function renderPicker() {
      renderLevelPicker(pickerEl, {
        value: viewLevel[gameId],
        onChange: (level) => {
          viewLevel[gameId] = level;
          renderTable();
          renderPicker();
        },
      });
      // Dim levels with no recorded runs yet, purely cosmetic.
      pickerEl.querySelectorAll('[data-level]').forEach((btn) => {
        if (!withScores.has(Number(btn.dataset.level))) btn.classList.add('level-btn-empty');
      });
    }

    renderPicker();
    renderTable();
  }
}
