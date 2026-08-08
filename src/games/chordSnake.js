import { levelT, lerp } from './difficultyLevels.js';

const GRID_SIZE = 20;

const DIRS = ['up', 'down', 'left', 'right'];
const DIR_DELTAS = { up: { dx: 0, dy: -1 }, down: { dx: 0, dy: 1 }, left: { dx: -1, dy: 0 }, right: { dx: 1, dy: 0 } };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const KEY_DIRS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

const DEFAULT_MOVE_INTERVAL_START = 0.55;
const DEFAULT_MOVE_INTERVAL_MIN = 0.28;
const DEFAULT_INTERVAL_DECREASE_PER_FOOD = 0.015;

/**
 * Maps a 6-tier difficulty level to Chord Snake's tick pace. The starting
 * interval is the main lever here — four chords is a lot to keep straight,
 * so the easy end needs to be genuinely slow, not just "a bit slower".
 */
export function snakeParamsForLevel(level) {
  const t = levelT(level);
  return {
    moveIntervalStart: lerp(0.85, 0.22, t),
    moveIntervalMin: lerp(0.55, 0.11, t),
    intervalDecreasePerFood: lerp(0.008, 0.025, t),
  };
}

/**
 * Classic grid snake: four chords map to up/down/left/right. Direction
 * changes are edge-triggered (like Racer's lane switching) rather than
 * held — the detector's chordchange event queues a pending turn, applied on
 * the next grid tick, and a turn directly into the snake's own body is
 * ignored so one stray chord match can't cause an instant self-collision.
 */
export class ChordSnakeGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      moveIntervalStart = DEFAULT_MOVE_INTERVAL_START,
      moveIntervalMin = DEFAULT_MOVE_INTERVAL_MIN,
      intervalDecreasePerFood = DEFAULT_INTERVAL_DECREASE_PER_FOOD,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [upId, downId, leftId, rightId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.cell = canvas.width / GRID_SIZE;
    this.moveInterval = moveIntervalStart;
    this.moveIntervalMin = moveIntervalMin;
    this.intervalDecreasePerFood = intervalDecreasePerFood;

    const start = Math.floor(GRID_SIZE / 2);
    this.snake = [
      { x: start - 1, y: start },
      { x: start - 2, y: start },
      { x: start - 3, y: start },
    ];
    this.direction = 'right';
    this.pendingDirection = 'right';
    this._spawnFood();

    this.foodEaten = 0;
    this.tickTimer = this.moveInterval;
    this.elapsed = 0;
    this.running = false;

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKeyDown(e);
  }

  start() {
    this.running = true;
    this.detector.addEventListener('chordchange', this._onChordChange);
    if (this.keyboardFallback) window.addEventListener('keydown', this._onKeyDown);
    this._lastTime = performance.now();
    this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
    this.detector.removeEventListener('chordchange', this._onChordChange);
    if (this.keyboardFallback) window.removeEventListener('keydown', this._onKeyDown);
  }

  _queueDirection(dir) {
    if (dir === OPPOSITE[this.direction]) return; // can't reverse straight into your own neck
    this.pendingDirection = dir;
  }

  _handleChordChange(match) {
    if (!match) return;
    const idx = this.chordIds.indexOf(match.id);
    if (idx === -1) return;
    this._queueDirection(DIRS[idx]);
  }

  _handleKeyDown(e) {
    const dir = KEY_DIRS[e.key];
    if (dir) this._queueDirection(dir);
  }

  _spawnFood() {
    let cell;
    do {
      cell = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (this.snake.some((seg) => seg.x === cell.x && seg.y === cell.y));
    this.food = cell;
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
    this.tickTimer -= dt;
    if (this.tickTimer > 0) return;
    this.tickTimer = this.moveInterval;
    this._step();
  }

  _step() {
    this.direction = this.pendingDirection;
    const { dx, dy } = DIR_DELTAS[this.direction];
    const head = this.snake[0];
    const next = { x: head.x + dx, y: head.y + dy };

    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      this._gameOver();
      return;
    }
    if (this.snake.some((seg) => seg.x === next.x && seg.y === next.y)) {
      this._gameOver();
      return;
    }

    this.snake.unshift(next);
    if (next.x === this.food.x && next.y === this.food.y) {
      this.foodEaten += 1;
      this.moveInterval = Math.max(this.moveIntervalMin, this.moveInterval - this.intervalDecreasePerFood);
      this._spawnFood();
    } else {
      this.snake.pop();
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.foodEaten } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: this.foodEaten, elapsedSeconds: this.elapsed } }));
  }

  _draw() {
    const { ctx, canvas, cell } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0d0620';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(107, 63, 160, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(canvas.width, i * cell);
      ctx.stroke();
    }

    ctx.fillStyle = '#ff2ec4';
    ctx.shadowColor = 'rgba(255, 46, 196, 0.7)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc((this.food.x + 0.5) * cell, (this.food.y + 0.5) * cell, cell * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    this.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#26e0ff' : '#39ff88';
      if (i === 0) {
        ctx.shadowColor = 'rgba(38, 224, 255, 0.6)';
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      ctx.roundRect(seg.x * cell + 1.5, seg.y * cell + 1.5, cell - 3, cell - 3, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.foodEaten), canvas.width / 2, 24);
    ctx.textAlign = 'left';
  }
}
