import { levelT, lerp } from './difficultyLevels.js';

const BALL_RADIUS = 9;
const PADDLE_HEIGHT = 14;
const PADDLE_Y_INSET = 46; // distance from the bottom of the canvas to the paddle's center

const DEFAULT_PADDLE_WIDTH = 110;
const DEFAULT_PADDLE_SPEED = 470;
const DEFAULT_BALL_SPEED_START = 280;
const DEFAULT_BALL_SPEED_MAX = 590;
const DEFAULT_BALL_SPEED_RAMP_PER_BOUNCE = 12;

/** Maps a 6-tier difficulty level to Chord Pong's paddle/ball pacing. */
export function pongParamsForLevel(level) {
  const t = levelT(level);
  return {
    paddleWidth: lerp(150, 70, t),
    paddleSpeed: lerp(620, 320, t),
    ballSpeedStart: lerp(200, 360, t),
    ballSpeedMax: lerp(420, 760, t),
    ballSpeedRampPerBounce: lerp(5, 20, t),
  };
}

/**
 * Single-player Pong/Breakout hybrid: two chords steer a paddle left/right —
 * continuous while held, like Chord Flap's lift, not a snap-to-lane like
 * Racer — to keep a ball from passing the bottom edge. Score is the rally
 * length (successful paddle bounces); the ball speeds up a little with each
 * one so a long rally is meaningfully harder than a short one.
 */
export class ChordPongGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      paddleWidth = DEFAULT_PADDLE_WIDTH,
      paddleSpeed = DEFAULT_PADDLE_SPEED,
      ballSpeedStart = DEFAULT_BALL_SPEED_START,
      ballSpeedMax = DEFAULT_BALL_SPEED_MAX,
      ballSpeedRampPerBounce = DEFAULT_BALL_SPEED_RAMP_PER_BOUNCE,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [leftId, rightId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.paddleWidth = paddleWidth;
    this.paddleSpeed = paddleSpeed;
    this.ballSpeedMax = ballSpeedMax;
    this.ballSpeedRampPerBounce = ballSpeedRampPerBounce;

    this.paddleX = canvas.width / 2;
    this.paddleY = canvas.height - PADDLE_Y_INSET;

    this.audioDir = null; // 'left' | 'right' | null — live, not sticky
    this.keysDown = new Set();

    const angle = Math.random() * 0.6 - 0.3; // near-vertical, slight random horizontal
    this.ballSpeed = ballSpeedStart;
    this.ball = {
      x: canvas.width / 2,
      y: canvas.height * 0.3,
      vx: this.ballSpeed * Math.sin(angle),
      vy: this.ballSpeed * Math.cos(angle),
    };

    this.rallies = 0;
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

  _handleChordChange(match) {
    if (!match) {
      this.audioDir = null;
      return;
    }
    if (match.id === this.chordIds[0]) this.audioDir = 'left';
    else if (match.id === this.chordIds[1]) this.audioDir = 'right';
    else this.audioDir = null;
  }

  _handleKey(e, isDown) {
    const dir = e.key === 'ArrowLeft' ? 'left' : e.key === 'ArrowRight' ? 'right' : null;
    if (!dir) return;
    if (isDown) this.keysDown.add(dir);
    else this.keysDown.delete(dir);
  }

  get dir() {
    if (this.keysDown.has('left')) return 'left';
    if (this.keysDown.has('right')) return 'right';
    return this.audioDir;
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

    const vx = this.dir === 'left' ? -this.paddleSpeed : this.dir === 'right' ? this.paddleSpeed : 0;
    const halfW = this.paddleWidth / 2;
    this.paddleX = Math.max(halfW, Math.min(this.canvas.width - halfW, this.paddleX + vx * dt));

    const ball = this.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - BALL_RADIUS <= 0) {
      ball.x = BALL_RADIUS;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + BALL_RADIUS >= this.canvas.width) {
      ball.x = this.canvas.width - BALL_RADIUS;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - BALL_RADIUS <= 0) {
      ball.y = BALL_RADIUS;
      ball.vy = Math.abs(ball.vy);
    }

    // Paddle collision: only while the ball is heading down through the
    // paddle's y-band and within its x-span.
    const withinPaddleY =
      ball.vy > 0 &&
      ball.y + BALL_RADIUS >= this.paddleY - PADDLE_HEIGHT / 2 &&
      ball.y - BALL_RADIUS <= this.paddleY + PADDLE_HEIGHT / 2;
    const withinPaddleX = ball.x >= this.paddleX - halfW - BALL_RADIUS && ball.x <= this.paddleX + halfW + BALL_RADIUS;
    if (withinPaddleY && withinPaddleX) {
      this.rallies += 1;
      this.ballSpeed = Math.min(this.ballSpeedMax, this.ballSpeed + this.ballSpeedRampPerBounce);
      // Classic paddle-bounce angling: hit near an edge sends the ball out
      // at a sharper angle than hitting dead center.
      const offset = Math.max(-1, Math.min(1, (ball.x - this.paddleX) / halfW));
      const maxAngle = Math.PI / 3; // 60°
      const angle = offset * maxAngle;
      ball.vx = this.ballSpeed * Math.sin(angle);
      ball.vy = -this.ballSpeed * Math.cos(angle);
      ball.y = this.paddleY - PADDLE_HEIGHT / 2 - BALL_RADIUS;
    }

    if (ball.y - BALL_RADIUS > this.canvas.height) {
      this._gameOver();
      return;
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.rallies } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', { detail: { score: this.rallies, elapsedSeconds: this.elapsed } })
    );
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0d0620';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#39ff88';
    ctx.shadowColor = 'rgba(57, 255, 136, 0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(this.paddleX - this.paddleWidth / 2, this.paddleY - PADDLE_HEIGHT / 2, this.paddleWidth, PADDLE_HEIGHT, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ff2ec4';
    ctx.shadowColor = 'rgba(255, 46, 196, 0.7)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.rallies), canvas.width / 2, 36);
    ctx.textAlign = 'left';
  }
}
