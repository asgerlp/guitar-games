import { getHighScores, highScoreTableHTML, GAME_LABELS } from '../lib/highScores.js';

export function renderHighScores(container) {
  container.innerHTML = `
    <div class="card">
      <h2>🏆 High Scores</h2>
      <p class="hint">Top 10 for each game, saved on this device.</p>
    </div>
    ${Object.entries(GAME_LABELS)
      .map(
        ([gameId, label]) => `
        <div class="card">
          <h3>${label}</h3>
          ${highScoreTableHTML(getHighScores(gameId))}
        </div>
      `
      )
      .join('')}
  `;
}
