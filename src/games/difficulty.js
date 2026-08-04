const STORAGE_KEY = 'guitarGames.racerDifficulty';

// A fresh player starts gentle — slow speed, slow ramp, generous room
// between an obstacle appearing and reaching the car (a low carInset keeps
// the car near the bottom of the track, maximizing that reaction distance),
// and a wide gap between obstacles so a lane switch never gets undone by
// the next obstacle arriving right on top of it.
const DEFAULTS = { startSpeed: 70, rampPerSec: 2.5, carInset: 80, obstacleGapSec: 1.6 };

const MIN_START_SPEED = 50;
const MAX_START_SPEED = 260;
const MIN_RAMP = 1;
const MAX_RAMP = 12;
// carInset = how far the car sits from the bottom of the track. Small means
// the car is near the bottom, so an obstacle has most of the track's height
// to travel before reaching it (easy). Large moves the car up toward the
// obstacles' spawn point, shrinking that reaction distance (hard) without
// needing to touch speed at all.
const MIN_CAR_INSET = 60;
const MAX_CAR_INSET = 420;
// obstacleGapSec = the minimum time, in seconds, between one obstacle and
// the next (see the comment in chordRacer.js's _update for why this is the
// number that actually governs "can I switch back in time"). This is a
// manual-only setting rather than part of the adaptive loop below, since
// it's about giving the player breathing room to operate their instrument,
// not about raw challenge.
const MIN_OBSTACLE_GAP_SEC = 0.6;
const MAX_OBSTACLE_GAP_SEC = 4;

// Below this, the run ended almost immediately — back off. This has to
// clear the game's own "pure luck" noise floor: with 2 lanes and random
// obstacle-lane spawning, a player who reacts to literally nothing still
// survives a median of ~7s (obstacles take a few seconds to reach the car,
// and each one only has a 50% chance of being in your lane), with a long
// tail out past 20s. A threshold anywhere near that just measures spawn
// luck, not skill — 18s comfortably clears the p95 of that no-skill
// distribution (simulated: p50 ~7s, p95 ~10s, max observed ~22s over 20k
// trials), so only runs showing genuine reactive play land above it.
const SHORT_RUN_SECONDS = 18;
// Above this, they comfortably outlasted the difficulty — push harder.
// Effectively never reached by pure luck (0/20k trials in the same sim).
const LONG_RUN_SECONDS = 40;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw && Number.isFinite(raw.startSpeed) && Number.isFinite(raw.rampPerSec) && Number.isFinite(raw.carInset)) {
      return { obstacleGapSec: DEFAULTS.obstacleGapSec, ...raw };
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULTS };
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Tracks how Chord Racer should start and ramp for this player, persisted
 * across sessions in localStorage. Every completed run nudges the
 * difficulty toward a length that's neither a near-instant crash nor a
 * trivial survival, so the game gradually finds — and keeps pace with —
 * the player's actual skill instead of hitting them with fixed numbers.
 *
 * Getting harder mainly means shortening the reaction-time gap (raising
 * carInset), not just raising speed — speed still creeps up too, but
 * gently, since cranking speed alone is what made things feel unfairly
 * fast rather than genuinely more challenging.
 */
export class DifficultyModel {
  constructor() {
    this.state = load();
  }

  get() {
    return { ...this.state };
  }

  /** Manually override the starting speed, e.g. from a settings control. */
  setStartSpeed(value) {
    this.state = { ...this.state, startSpeed: clamp(value, MIN_START_SPEED, MAX_START_SPEED) };
    save(this.state);
  }

  /** Manually override the gap between obstacles, e.g. from a settings control. */
  setObstacleGap(value) {
    this.state = { ...this.state, obstacleGapSec: clamp(value, MIN_OBSTACLE_GAP_SEC, MAX_OBSTACLE_GAP_SEC) };
    save(this.state);
  }

  /** Call once per finished run. Returns 'up' | 'down' | 'same' for feedback. */
  recordRun({ elapsedSeconds }) {
    let { startSpeed, rampPerSec, carInset } = this.state;

    if (elapsedSeconds < SHORT_RUN_SECONDS) {
      startSpeed *= 0.92;
      rampPerSec *= 0.92;
      carInset *= 0.8; // give back a lot of reaction room quickly
    } else if (elapsedSeconds > LONG_RUN_SECONDS) {
      startSpeed *= 1.04;
      rampPerSec *= 1.04;
      carInset *= 1.15; // shorten the reaction gap — the main "harder" lever
    } else {
      // A solid, unremarkable run: creep difficulty up a little so steady
      // play keeps getting more challenging over time.
      startSpeed *= 1.01;
      rampPerSec *= 1.01;
      carInset *= 1.05;
    }

    startSpeed = clamp(startSpeed, MIN_START_SPEED, MAX_START_SPEED);
    rampPerSec = clamp(rampPerSec, MIN_RAMP, MAX_RAMP);
    carInset = clamp(carInset, MIN_CAR_INSET, MAX_CAR_INSET);

    const direction = carInset > this.state.carInset ? 'up' : carInset < this.state.carInset ? 'down' : 'same';

    this.state = { ...this.state, startSpeed, rampPerSec, carInset };
    save(this.state);
    return direction;
  }

  reset() {
    this.state = { ...DEFAULTS };
    save(this.state);
  }
}
