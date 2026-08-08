/**
 * Shared 6-tier difficulty scale used by every game. Each game maps a level
 * to its own parameters via levelT() (0 at Super Easy, 1 at Insane) rather
 * than sharing raw numbers, since "fast" means something different to a
 * scrolling racer, a falling bird, and a grid-based snake.
 */
export const LEVELS = [
  { id: 1, labelKey: 'level.superEasy' },
  { id: 2, labelKey: 'level.easy' },
  { id: 3, labelKey: 'level.medium' },
  { id: 4, labelKey: 'level.hard' },
  { id: 5, labelKey: 'level.veryHard' },
  { id: 6, labelKey: 'level.insane' },
];

// New players land on "Easy" rather than the middle of the scale — a brand
// new game (or a brand new player) that opens on "Medium" by default has
// burned first impressions before here; starting one notch gentler costs
// nothing for someone who wants a challenge; a single click moves them up.
export const DEFAULT_LEVEL = 2;

export function levelT(level) {
  return (level - 1) / (LEVELS.length - 1);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function levelLabel(level, t) {
  const key = LEVELS.find((l) => l.id === level)?.labelKey ?? 'level.medium';
  return t(key);
}
