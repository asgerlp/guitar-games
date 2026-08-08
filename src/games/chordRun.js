import { levelT, lerp } from './difficultyLevels.js';

const GRAVITY = 2600; // px/s^2 — fixed across levels, only pacing (below) scales
const JUMP_IMPULSE = -820; // px/s, launched upward on a grounded jump trigger
const PLAYER_X_FRAC = 0.24;
const PLAYER_HALF_WIDTH = 18;
const RUN_HEIGHT = 56;
const DUCK_HEIGHT = 30;
const OBSTACLE_HALF_WIDTH = 20;
const GROUND_INSET = 60; // distance from the bottom of the canvas to the ground line

const DEFAULT_START_SPEED = 190;
const DEFAULT_RAMP_PER_SEC = 4;
const DEFAULT_MAX_SPEED = 420;
const DEFAULT_OBSTACLE_GAP_SEC = 1.5;

/** Maps a 6-tier difficulty level to Chord Run's scroll speed and obstacle spacing. */
export function runParamsForLevel(level) {
  const t = levelT(level);
  return {
    startSpeed: lerp(150, 280, t),
    rampPerSec: lerp(2, 9, t),
    maxSpeed: lerp(320, 560, t),
    obstacleGapSec: lerp(2.2, 1.0, t),
  };
}

/**
 * Side-view endless runner: the ground scrolls under a fixed runner. Two
 * chords map to Jump (a one-shot impulse, triggered whenever that chord is
 * reported while grounded — holding it lets you keep bunny-hopping) and
 * Duck (a held stance, live for as long as that chord keeps matching).
 * Obstacles are one of two kinds — a low log you must be airborne to clear,
 * or a high beam you must be ducked under — so the two actions are always
 * in tension: hold jump and you're safe from logs but exposed to beams,
 * and vice versa for duck.
 */
export class ChordRunGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      startSpeed = DEFAULT_START_SPEED,
      rampPerSec = DEFAULT_RAMP_PER_SEC,
      maxSpeed = DEFAULT_MAX_SPEED,
      obstacleGapSec = DEFAULT_OBSTACLE_GAP_SEC,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [jumpId, duckId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.startSpeed = startSpeed;
    this.rampPerSec = rampPerSec;
    this.maxSpeed = maxSpeed;
    this.obstacleGapSec = obstacleGapSec;

    this.groundY = canvas.height - GROUND_INSET;
    this.playerY = this.groundY;
    this.vy = 0;
    this.grounded = true;
    this.action = null; // 'jump' | 'duck' | null, last reported

    this.keysDown = new Set();
    this.obstacles = [];
    this.spawnTimer = 1.1;
    this.speed = startSpeed;
    this.distance = 0;
    this.elapsed = 0;
    this.running = false;

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKey(e, true);
    this._onKeyUp = (e) => this._handleKey(e, false);
  }

  start() {
    this.running = true;
    this.detector.addEventListener('chordchange', this._onChordChange);
    if (this.keyboardFallback) {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    }
    this._lastTime = performance.now();
    this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
    this.detector.removeEventListener('chordchange', this._onChordChange);
    if (this.keyboardFallback) {
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    }
  }

  _reportAction(action) {
    this.action = action;
    if (action === 'jump' && this.grounded) {
      this.vy = JUMP_IMPULSE;
      this.grounded = false;
    }
  }

  _handleChordChange(match) {
    const idx = match ? this.chordIds.indexOf(match.id) : -1;
    this._reportAction(idx === 0 ? 'jump' : idx === 1 ? 'duck' : null);
  }

  _handleKey(e, isDown) {
    const idx = { 1: 0, 2: 1 }[e.key];
    if (idx === undefined) return;
    if (isDown) this.keysDown.add(idx);
    else this.keysDown.delete(idx);
    const active = this.keysDown.has(0) ? 'jump' : this.keysDown.has(1) ? 'duck' : null;
    this._reportAction(active);
  }

  _loop(time) {
    if (!this.running) return;
    const dt = Math.min((time - this._lastTime) / 1000, 0.05);
    this._lastTime = time;
    this._update(dt);
    this._draw();
    if (this.running) this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    this.elapsed += dt;
    this.speed = Math.min(this.maxSpeed, this.startSpeed + this.elapsed * this.rampPerSec);
    this.distance += this.speed * dt;

    this.vy += GRAVITY * dt;
    this.playerY = Math.min(this.groundY, this.playerY + this.vy * dt);
    if (this.playerY >= this.groundY) {
      this.playerY = this.groundY;
      this.vy = 0;
      this.grounded = true;
    }

    const ducking = this.action === 'duck';

    this.spawnTimer -= dt;
    // Same lesson as Chord Racer's obstacle spacing: the floor here is a
    // wall-clock time budget, not a pixel gap, so it stays fair regardless
    // of how fast the world is scrolling.
    const dynamicInterval = Math.max(this.obstacleGapSec, this.obstacleGapSec + 0.6 - this.elapsed * 0.008);
    if (this.spawnTimer <= 0) {
      this.spawnTimer = dynamicInterval;
      this.obstacles.push({ x: this.canvas.width + 40, type: Math.random() < 0.5 ? 'low' : 'high' });
    }

    const playerX = this.canvas.width * PLAYER_X_FRAC;
    for (const ob of this.obstacles) {
      ob.x -= this.speed * dt;
      const withinX = Math.abs(ob.x - playerX) < OBSTACLE_HALF_WIDTH + PLAYER_HALF_WIDTH;
      if (withinX) {
        const safe = ob.type === 'low' ? !this.grounded : ducking;
        if (!safe) {
          this._gameOver();
          return;
        }
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.x > -60);

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: Math.floor(this.distance / 10) } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', { detail: { score: Math.floor(this.distance / 10), elapsedSeconds: this.elapsed } })
    );
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0d0620';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#6b3fa0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY + 2);
    ctx.lineTo(canvas.width, this.groundY + 2);
    ctx.stroke();

    const playerX = canvas.width * PLAYER_X_FRAC;
    const ducking = this.action === 'duck';
    const height = ducking && this.grounded ? DUCK_HEIGHT : RUN_HEIGHT;
    const airborneLift = this.groundY - this.playerY;

    ctx.fillStyle = '#39ff88';
    ctx.shadowColor = 'rgba(57, 255, 136, 0.55)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(playerX - PLAYER_HALF_WIDTH, this.groundY - height - airborneLift, PLAYER_HALF_WIDTH * 2, height, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    for (const ob of this.obstacles) {
      if (ob.type === 'low') {
        ctx.fillStyle = '#c9622c';
        ctx.beginPath();
        ctx.roundRect(ob.x - OBSTACLE_HALF_WIDTH, this.groundY - 22, OBSTACLE_HALF_WIDTH * 2, 22, 5);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ff2ec4';
        ctx.shadowColor = 'rgba(255, 46, 196, 0.55)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(ob.x - OBSTACLE_HALF_WIDTH, this.groundY - RUN_HEIGHT - 14, OBSTACLE_HALF_WIDTH * 2, 14, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        // supports hanging down to the ground so the beam reads as fixed overhead
        ctx.fillStyle = 'rgba(255, 46, 196, 0.35)';
        ctx.fillRect(ob.x - 2, this.groundY - RUN_HEIGHT, 4, RUN_HEIGHT);
      }
    }

    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(Math.floor(this.distance / 10)), canvas.width / 2, 36);
    ctx.textAlign = 'left';
  }
}
