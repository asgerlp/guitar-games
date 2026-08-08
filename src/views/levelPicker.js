import { LEVELS } from '../games/difficultyLevels.js';

/**
 * Renders a row of 6 difficulty buttons into hostEl and wires click
 * handling. `onChange` is called with the new level id; the caller decides
 * what that means for their game and is responsible for re-rendering.
 */
export function renderLevelPicker(hostEl, { value, onChange }) {
  hostEl.innerHTML = LEVELS.map(
    (lvl) =>
      `<button type="button" class="btn level-btn${lvl.id === value ? ' active' : ''}" data-level="${lvl.id}">${lvl.label}</button>`
  ).join('');

  hostEl.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => onChange(Number(btn.dataset.level)));
  });
}
