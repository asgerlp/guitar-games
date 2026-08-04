const STORAGE_KEY = 'guitarGames.racerDifficulty';

// A fresh player starts gentle — slow initial speed, slow ramp — rather than
// the old fixed 150px/s start, which was too fast for a first-ever run.
const DEFAULTS = { startSpeed: 90, rampPerSec: 4 };

const MIN_START_SPEED = 60;
const MAX_START_SPEED = 420;
const MIN_RAMP = 1.5;
const MAX_RAMP = 22;

// Below this, the run ended almost immediately — back off.
const SHORT_RUN_SECONDS = 8;
// Above this, they comfortably outlasted the difficulty — push harder.
const LONG_RUN_SECONDS = 40;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw && Number.isFinite(raw.startSpeed) && Number.isFinite(raw.rampPerSec)) return raw;
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULTS };
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Tracks how fast Chord Racer should start and ramp for this player,
 * persisted across sessions in localStorage. Every completed run nudges the
 * difficulty toward a length that's neither a near-instant crash nor a
 * trivial survival, so the game gradually finds — and keeps pace with —
 * the player's actual skill instead of hitting them with a fixed speed.
 */
export class DifficultyModel {
  constructor() {
    this.state = load();
  }

  get() {
    return { ...this.state };
  }

  /** Call once per finished run. Returns 'up' | 'down' | 'same' for feedback. */
  recordRun({ elapsedSeconds }) {
    let { startSpeed, rampPerSec } = this.state;

    if (elapsedSeconds < SHORT_RUN_SECONDS) {
      startSpeed *= 0.88;
      rampPerSec *= 0.88;
    } else if (elapsedSeconds > LONG_RUN_SECONDS) {
      startSpeed *= 1.12;
      rampPerSec *= 1.12;
    } else {
      // A solid, unremarkable run: creep the difficulty up a little so
      // steady play keeps getting more challenging over time.
      startSpeed *= 1.03;
      rampPerSec *= 1.03;
    }

    startSpeed = clamp(startSpeed, MIN_START_SPEED, MAX_START_SPEED);
    rampPerSec = clamp(rampPerSec, MIN_RAMP, MAX_RAMP);

    const direction = startSpeed > this.state.startSpeed ? 'up' : startSpeed < this.state.startSpeed ? 'down' : 'same';

    this.state = { startSpeed, rampPerSec };
    save(this.state);
    return direction;
  }

  reset() {
    this.state = { ...DEFAULTS };
    save(this.state);
  }
}
