import { loadJSON, saveJSON } from './storage.js';

const STORAGE_KEY = 'guitarGames.highScores';
const MAX_ENTRIES = 10;

export const GAME_LABELS = {
  racer: 'Chord Racer',
  fight: 'Chord Fight',
  flap: 'Chord Flap',
  pong: 'Chord Pong',
  run: 'Chord Run',
  snake: 'Chord Snake',
};

function loadAll() {
  return loadJSON(STORAGE_KEY, {});
}

function saveAll(all) {
  saveJSON(STORAGE_KEY, all);
}

/** Top scores for a game, highest first (at most 10). */
export function getHighScores(gameId) {
  const all = loadAll();
  return Array.isArray(all[gameId]) ? all[gameId] : [];
}

/** Whether `score` would land in the top-10 list for this game. */
export function qualifiesForHighScore(gameId, score) {
  if (!(score > 0)) return false;
  const scores = getHighScores(gameId);
  return scores.length < MAX_ENTRIES || score > scores[scores.length - 1].score;
}

/** Record a new score, keeping only the top 10, sorted highest first. */
export function addHighScore(gameId, name, score) {
  const all = loadAll();
  const scores = getHighScores(gameId);
  const entry = { name: name.trim().slice(0, 20) || 'Anonymous', score, date: new Date().toISOString() };
  const next = [...scores, entry].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
  all[gameId] = next;
  saveAll(all);
  return next;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Renders a top-10 table, or an empty-state message if there are no scores yet. */
export function highScoreTableHTML(entries) {
  if (entries.length === 0) return '<p class="hint">No high scores yet — be the first!</p>';
  return `
    <table>
      <thead>
        <tr><th>#</th><th>Name</th><th>Score</th></tr>
      </thead>
      <tbody>
        ${entries
          .map((e, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(e.name)}</td><td>${e.score}</td></tr>`)
          .join('')}
      </tbody>
    </table>
  `;
}

/**
 * Wires up a self-contained "new high score" name-entry widget inside
 * `hostEl`. If `score` doesn't qualify for the top 10, leaves it empty.
 * After saving, swaps to a confirmation plus the updated leaderboard.
 */
export function renderHighScoreSection(hostEl, gameId, score) {
  let saved = false;

  function paint() {
    if (saved) {
      hostEl.innerHTML = `
        <p class="hint">Saved to the leaderboard!</p>
        ${highScoreTableHTML(getHighScores(gameId))}
      `;
      return;
    }

    if (!qualifiesForHighScore(gameId, score)) {
      hostEl.innerHTML = '';
      return;
    }

    hostEl.innerHTML = `
      <p class="hint">🏆 New high score! Enter your name for the leaderboard:</p>
      <div class="row" style="justify-content:center">
        <input type="text" id="hs-name" maxlength="20" placeholder="Your name" />
        <button class="btn primary" id="hs-save">Save</button>
      </div>
    `;

    const nameInput = hostEl.querySelector('#hs-name');
    const submit = () => {
      addHighScore(gameId, nameInput.value, score);
      saved = true;
      paint();
    };
    hostEl.querySelector('#hs-save').addEventListener('click', submit);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    nameInput.focus();
  }

  paint();
}
