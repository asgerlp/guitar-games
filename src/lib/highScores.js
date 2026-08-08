import { loadJSON, saveJSON } from './storage.js';
import { DEFAULT_LEVEL, levelLabel } from '../games/difficultyLevels.js';

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

// Scores are tracked per difficulty level, since a big score on Super Easy
// and a modest one on Insane aren't really comparable achievements. Entries
// saved before levels existed (a flat array per game, not grouped by level)
// get folded into the default level bucket the first time they're read,
// rather than silently discarded.
function levelBuckets(raw) {
  if (Array.isArray(raw)) return { [DEFAULT_LEVEL]: raw };
  return raw && typeof raw === 'object' ? raw : {};
}

/** Top scores for a game at a specific level, highest first (at most 10). */
export function getHighScores(gameId, level) {
  const all = loadAll();
  const buckets = levelBuckets(all[gameId]);
  return Array.isArray(buckets[level]) ? buckets[level] : [];
}

/** Which levels have at least one recorded score for this game, ascending. */
export function levelsWithScores(gameId) {
  const all = loadAll();
  const buckets = levelBuckets(all[gameId]);
  return Object.keys(buckets)
    .map(Number)
    .filter((level) => buckets[level]?.length > 0)
    .sort((a, b) => a - b);
}

/** Whether `score` would land in the top-10 for this game at this level. */
export function qualifiesForHighScore(gameId, level, score) {
  if (!(score > 0)) return false;
  const scores = getHighScores(gameId, level);
  return scores.length < MAX_ENTRIES || score > scores[scores.length - 1].score;
}

/** Record a new score at this level, keeping only the top 10, sorted highest first. */
export function addHighScore(gameId, level, name, score) {
  const all = loadAll();
  const buckets = levelBuckets(all[gameId]);
  const entry = { name: name.trim().slice(0, 20) || 'Anonymous', score, date: new Date().toISOString() };
  const scores = Array.isArray(buckets[level]) ? buckets[level] : [];
  buckets[level] = [...scores, entry].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
  all[gameId] = buckets;
  saveAll(all);
  return buckets[level];
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
 * `hostEl`, scoped to the level the run was just played at. If `score`
 * doesn't qualify for that level's top 10, leaves it empty. After saving,
 * swaps to a confirmation plus that level's updated leaderboard.
 */
export function renderHighScoreSection(hostEl, gameId, level, score) {
  let saved = false;

  function paint() {
    if (saved) {
      hostEl.innerHTML = `
        <p class="hint">Saved to the ${levelLabel(level)} leaderboard!</p>
        ${highScoreTableHTML(getHighScores(gameId, level))}
      `;
      return;
    }

    if (!qualifiesForHighScore(gameId, level, score)) {
      hostEl.innerHTML = '';
      return;
    }

    hostEl.innerHTML = `
      <p class="hint">🏆 New ${levelLabel(level)} high score! Enter your name for the leaderboard:</p>
      <div class="row" style="justify-content:center">
        <input type="text" id="hs-name" maxlength="20" placeholder="Your name" />
        <button class="btn primary" id="hs-save">Save</button>
      </div>
    `;

    const nameInput = hostEl.querySelector('#hs-name');
    const submit = () => {
      addHighScore(gameId, level, nameInput.value, score);
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
