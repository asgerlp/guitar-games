import { levelT, lerp } from './difficultyLevels.js';

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const SIDEBAR = 110;

const DEFAULT_FALL_INTERVAL_START = 0.8;
const DEFAULT_FALL_INTERVAL_MIN = 0.28;
const DEFAULT_INTERVAL_DECREASE_PER_LINE = 0.018;
const SOFT_DROP_DIVISOR = 14;

const SHAPES = {
  I: { color: '#26e0ff', cells: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] },
  O: { color: '#ffe14d', cells: [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]] },
  T: { color: '#ff2ec4', cells: [[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]] },
  S: { color: '#39ff88', cells: [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]] },
  Z: { color: '#ff3b5c', cells: [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]] },
  J: { color: '#6b8cff', cells: [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] },
  L: { color: '#ffa552', cells: [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] },
};
const TYPES = Object.keys(SHAPES);

function rotateCW(grid) {
  const n = grid.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) out[c][n - 1 - r] = grid[r][c];
  }
  return out;
}

/** Maps a 6-tier difficulty level to Chord Stack's fall speed. */
export function stackParamsForLevel(level) {
  const t = levelT(level);
  return {
    fallIntervalStart: lerp(1.1, 0.45, t),
    fallIntervalMin: lerp(0.6, 0.16, t),
    intervalDecreasePerLine: lerp(0.01, 0.03, t),
  };
}

/**
 * Original falling-block puzzle: four chords map to Move Left, Move Right,
 * Rotate, and Soft Drop. The first three are edge-triggered — one chord
 * switch, one action — since holding a chord to auto-repeat a shift or spin
 * would be awkward to control with a guitar. Soft drop is the exception: it
 * stays active for as long as that chord keeps matching, same held-action
 * pattern as Chord Run's duck.
 */
export class ChordStackGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      fallIntervalStart = DEFAULT_FALL_INTERVAL_START,
      fallIntervalMin = DEFAULT_FALL_INTERVAL_MIN,
      intervalDecreasePerLine = DEFAULT_INTERVAL_DECREASE_PER_LINE,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [leftId, rightId, rotateId, softDropId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.fallInterval = fallIntervalStart;
    this.fallIntervalMin = fallIntervalMin;
    this.intervalDecreasePerLine = intervalDecreasePerLine;

    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.bag = [];
    this.softDropActive = false;
    this.keysDown = new Set();
    this.linesCleared = 0;
    this.score = 0;
    this.elapsed = 0;
    this.fallTimer = this.fallInterval;
    this.running = false;
    this.gameOver = false;

    this.current = this._spawnPiece();
    this.next = this._spawnPiece();

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

  _nextBagType() {
    if (this.bag.length === 0) {
      this.bag = [...TYPES];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop();
  }

  _spawnPiece() {
    const type = this._nextBagType();
    return { type, shape: SHAPES[type].cells, row: -1, col: Math.floor(COLS / 2) - 2 };
  }

  _collides(shape, row, col) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const br = row + r;
        const bc = col + c;
        if (bc < 0 || bc >= COLS || br >= ROWS) return true;
        if (br >= 0 && this.board[br][bc]) return true;
      }
    }
    return false;
  }

  _handleChordChange(match) {
    const idx = match ? this.chordIds.indexOf(match.id) : -1;
    this.softDropActive = idx === 3;
    if (idx === 0) this._moveBy(-1);
    else if (idx === 1) this._moveBy(1);
    else if (idx === 2) this._rotate();
  }

  _handleKey(e, isDown) {
    if (e.key === 'ArrowDown') {
      this.softDropActive = isDown;
      return;
    }
    if (!isDown) return;
    if (e.key === 'ArrowLeft') this._moveBy(-1);
    else if (e.key === 'ArrowRight') this._moveBy(1);
    else if (e.key === 'ArrowUp') this._rotate();
  }

  _moveBy(dx) {
    if (this.gameOver) return;
    const { shape, row, col } = this.current;
    if (!this._collides(shape, row, col + dx)) this.current.col += dx;
  }

  _rotate() {
    if (this.gameOver) return;
    const rotated = rotateCW(this.current.shape);
    const { row, col } = this.current;
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!this._collides(rotated, row, col + kick)) {
        this.current.shape = rotated;
        this.current.col += kick;
        return;
      }
    }
  }

  _lockPiece() {
    const { type, shape, row, col } = this.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const br = row + r;
        const bc = col + c;
        if (br < 0) {
          this._endGame();
          return;
        }
        this.board[br][bc] = SHAPES[type].color;
      }
    }

    const clearedRows = [];
    for (let r = 0; r < ROWS; r++) {
      if (this.board[r].every((cell) => cell)) clearedRows.push(r);
    }
    if (clearedRows.length > 0) {
      this.board = this.board.filter((_, r) => !clearedRows.includes(r));
      while (this.board.length < ROWS) this.board.unshift(Array(COLS).fill(null));
      this.linesCleared += clearedRows.length;
      this.score += [0, 100, 300, 600, 1000][clearedRows.length] ?? 1000;
      this.fallInterval = Math.max(
        this.fallIntervalMin,
        this.fallInterval - this.intervalDecreasePerLine * clearedRows.length
      );
    }

    this.current = this.next;
    this.next = this._spawnPiece();
    if (this._collides(this.current.shape, this.current.row, this.current.col)) {
      this._endGame();
    }
  }

  _endGame() {
    this.gameOver = true;
    this._gameOver();
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
    if (this.gameOver) return;
    this.elapsed += dt;
    const interval = this.softDropActive ? this.fallInterval / SOFT_DROP_DIVISOR : this.fallInterval;
    this.fallTimer -= dt;
    if (this.fallTimer > 0) return;
    this.fallTimer = interval;

    const { shape, row, col } = this.current;
    if (!this._collides(shape, row + 1, col)) {
      this.current.row += 1;
    } else {
      this._lockPiece();
      if (this.gameOver) return;
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.score } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: this.score, elapsedSeconds: this.elapsed } }));
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#05030a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(107, 63, 160, 0.25)';
    ctx.lineWidth = 1;
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(COLS * CELL, r * CELL);
      ctx.stroke();
    }

    const drawCell = (r, c, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
    };

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.board[r][c]) drawCell(r, c, this.board[r][c]);
      }
    }

    if (!this.gameOver) {
      const { type, shape, row, col } = this.current;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] && row + r >= 0) drawCell(row + r, col + c, SHAPES[type].color);
        }
      }
    }

    // Sidebar: score + next-piece preview.
    const sbX = COLS * CELL + 14;
    ctx.fillStyle = '#a996d1';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE', sbX, 24);
    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(String(this.score), sbX, 46);

    ctx.fillStyle = '#a996d1';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('NEXT', sbX, 90);
    const previewCell = 16;
    const nextShape = SHAPES[this.next.type].cells;
    for (let r = 0; r < nextShape.length; r++) {
      for (let c = 0; c < nextShape[r].length; c++) {
        if (!nextShape[r][c]) continue;
        ctx.fillStyle = SHAPES[this.next.type].color;
        ctx.fillRect(sbX + c * previewCell, 104 + r * previewCell, previewCell - 2, previewCell - 2);
      }
    }
  }
}

export const STACK_CANVAS_WIDTH = COLS * CELL + SIDEBAR;
export const STACK_CANVAS_HEIGHT = ROWS * CELL;
