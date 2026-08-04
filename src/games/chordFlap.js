const GRAVITY = 1400; // px/s^2, always pulling the bird down
const LIFT_ACCEL = 2200; // px/s^2 applied while holding the active chord — nets +800 upward
// Velocity-proportional drag (air resistance) — without it, a bang-bang
// "hold or don't" controller with real reaction latency (chord-switch time)
// oscillates with growing amplitude and slams into an edge almost
// immediately, verified via simulation before adding this. Drag caps terminal
// speed naturally (fall settles near GRAVITY/DRAG, rise near (LIFT-GRAVITY)/DRAG)
// and damps the oscillation instead.
const DRAG = 8;
const MAX_FALL_SPEED = 320; // safety clamp, well above the natural drag-limited terminal speed
const MAX_RISE_SPEED = -260;
const BIRD_X_FRAC = 0.28;
const BIRD_RADIUS = 16;

const PIPE_WIDTH = 64;
const PIPE_GAP = 220;
const PIPE_SPACING = 260; // horizontal gap between successive pipe pairs
const START_SPEED = 150; // px/s scroll speed
const MAX_SPEED = 420;
const SPEED_RAMP_PER_SEC = 2.5;

const ROTATE_MIN_SEC = 3.5; // how long the active (flap) chord stays the same before rotating
const ROTATE_MAX_SEC = 6.5;

/**
 * Flappy-Bird-style canvas game: gravity always pulls the bird down, and
 * holding whichever chord is currently "active" applies upward thrust.
 * Unlike Racer/Fight (sticky last-selection), this needs a genuinely live
 * "am I holding it right now" signal so the bird falls the instant you stop
 * — chordchange events (including the null ones on silence/mismatch) drive
 * that directly instead of persisting `.current`.
 *
 * The active chord rotates on a randomized timer among the assigned chords
 * so holding one shape forever stops working partway through any run.
 */
export class ChordFlapGame extends EventTarget {
  constructor(canvas, { chordIds, detector, keyboardFallback = false }) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds;
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;

    this.birdY = canvas.height / 2;
    this.birdVy = 0;
    this.audioHolding = false;
    this.keysDown = new Set();

    this.activeIndex = 0;
    this.elapsed = 0;
    this.nextRotateAt = this._randomRotateDelay();

    this.pipes = [];
    this.nextPipeAt = 0.6;
    this.speed = START_SPEED;
    this.score = 0;
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

  _randomRotateDelay() {
    return this.elapsed + ROTATE_MIN_SEC + Math.random() * (ROTATE_MAX_SEC - ROTATE_MIN_SEC);
  }

  _handleChordChange(match) {
    this.audioHolding = !!match && this.chordIds[this.activeIndex] === match.id;
  }

  _handleKey(e, isDown) {
    const idx = { 1: 0, 2: 1, 3: 2, 4: 3 }[e.key];
    if (idx === undefined) return;
    if (isDown) this.keysDown.add(idx);
    else this.keysDown.delete(idx);
  }

  get holding() {
    return this.audioHolding || this.keysDown.has(this.activeIndex);
  }

  _rotateActiveChord() {
    if (this.chordIds.length > 1) {
      let next = this.activeIndex;
      while (next === this.activeIndex) next = Math.floor(Math.random() * this.chordIds.length);
      this.activeIndex = next;
    }
    this.nextRotateAt = this._randomRotateDelay();
    // Re-derive holding for the new active chord immediately — the last
    // reported match might already match it (or no longer match the old one).
    const current = this.detector.current;
    this.audioHolding = !!current && this.chordIds[this.activeIndex] === current.id;
    this.dispatchEvent(new CustomEvent('rotate', { detail: { activeIndex: this.activeIndex } }));
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
    this.speed = Math.min(MAX_SPEED, START_SPEED + this.elapsed * SPEED_RAMP_PER_SEC);

    if (this.elapsed >= this.nextRotateAt) this._rotateActiveChord();

    const accel = GRAVITY - (this.holding ? LIFT_ACCEL : 0) - DRAG * this.birdVy;
    this.birdVy = Math.max(MAX_RISE_SPEED, Math.min(MAX_FALL_SPEED, this.birdVy + accel * dt));
    this.birdY += this.birdVy * dt;

    if (this.birdY - BIRD_RADIUS <= 0 || this.birdY + BIRD_RADIUS >= this.canvas.height) {
      this._gameOver();
      return;
    }

    this.nextPipeAt -= dt;
    if (this.nextPipeAt <= 0) {
      this.nextPipeAt = PIPE_SPACING / this.speed;
      const margin = 60;
      const gapY = margin + Math.random() * (this.canvas.height - margin * 2 - PIPE_GAP);
      this.pipes.push({ x: this.canvas.width + PIPE_WIDTH, gapY, passed: false });
    }

    const birdX = this.canvas.width * BIRD_X_FRAC;
    for (const pipe of this.pipes) {
      pipe.x -= this.speed * dt;

      if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
        pipe.passed = true;
        this.score += 1;
      }

      const withinX = birdX + BIRD_RADIUS > pipe.x && birdX - BIRD_RADIUS < pipe.x + PIPE_WIDTH;
      const withinGap = this.birdY - BIRD_RADIUS > pipe.gapY && this.birdY + BIRD_RADIUS < pipe.gapY + PIPE_GAP;
      if (withinX && !withinGap) {
        this._gameOver();
        return;
      }
    }
    this.pipes = this.pipes.filter((p) => p.x + PIPE_WIDTH > -20);

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.score } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: this.score, elapsedSeconds: this.elapsed } }));
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1b2337';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2e6b3e';
    for (const pipe of this.pipes) {
      ctx.beginPath();
      ctx.roundRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY, 6);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, canvas.height - (pipe.gapY + PIPE_GAP), 6);
      ctx.fill();
    }

    const birdX = canvas.width * BIRD_X_FRAC;
    ctx.save();
    ctx.translate(birdX, this.birdY);
    ctx.rotate(Math.max(-0.5, Math.min(0.9, this.birdVy / 500)));
    ctx.fillStyle = this.holding ? '#f5d13d' : '#e0a52e';
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b2337';
    ctx.beginPath();
    ctx.arc(BIRD_RADIUS * 0.4, -BIRD_RADIUS * 0.25, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c9622c';
    ctx.beginPath();
    ctx.moveTo(BIRD_RADIUS * 0.7, 0);
    ctx.lineTo(BIRD_RADIUS * 1.3, -3);
    ctx.lineTo(BIRD_RADIUS * 1.3, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#eef1f8';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.score), canvas.width / 2, 36);
    ctx.textAlign = 'left';
  }
}
