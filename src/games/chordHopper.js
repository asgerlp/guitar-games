import { levelT, lerp } from './difficultyLevels.js';

const COLS = 13;
const RIVER_LANES = 5;
const TRAFFIC_LANES = 5;
const ROWS = 1 + RIVER_LANES + 1 + TRAFFIC_LANES + 1; // goal, river, median, traffic, start
const CELL = 36;
const HOP_COOLDOWN = 0.14;
const GOAL_COUNT = 5;

const GOAL_ROW = 0;
const RIVER_ROWS = [1, 2, 3, 4, 5];
const MEDIAN_ROW = 6;
const TRAFFIC_ROWS = [7, 8, 9, 10, 11];
const START_ROW = 12;

const DIRS = { up: { dr: -1, dc: 0 }, down: { dr: 1, dc: 0 }, left: { dr: 0, dc: -1 }, right: { dr: 0, dc: 1 } };
const DIR_LIST = ['up', 'down', 'left', 'right'];
const KEY_DIRS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

const DEFAULT_TRAFFIC_SPEED = 90;
const DEFAULT_RIVER_SPEED = 70;
const DEFAULT_SPAWN_GAP = 1.4;

/**
 * Maps a 6-tier difficulty level to Chord Hopper's traffic/river pace. The
 * low end of trafficSpeed/spawnGapSec is deliberately much gentler than a
 * straight lerp from the high end would give — the effective gap between
 * vehicles in a lane is roughly (speed * spawnGap - vehicleWidth), and both
 * factors shrinking together at the same rate left almost no clearance even
 * on "Easy".
 */
export function hopperParamsForLevel(level) {
  const t = levelT(level);
  return {
    trafficSpeed: lerp(35, 150, t),
    riverSpeed: lerp(45, 110, t),
    spawnGapSec: lerp(2.8, 0.85, t),
  };
}

function goalCols() {
  const cols = [];
  for (let i = 0; i < GOAL_COUNT; i++) cols.push(Math.round(((i + 0.5) * COLS) / GOAL_COUNT));
  return cols;
}

/**
 * Original lane-crossing game: four chords hop the frog up/down/left/right
 * one grid cell at a time, edge-triggered on each new chord match (with a
 * short cooldown so detector jitter can't register as a double-hop). Cross
 * a road of traffic, a safe median, then a river where you survive only by
 * riding a log — standing on open water is instant death, and drifting off
 * either edge while riding one is too.
 */
export class ChordHopperGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      trafficSpeed = DEFAULT_TRAFFIC_SPEED,
      riverSpeed = DEFAULT_RIVER_SPEED,
      spawnGapSec = DEFAULT_SPAWN_GAP,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [upId, downId, leftId, rightId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.trafficSpeed = trafficSpeed;
    this.riverSpeed = riverSpeed;
    this.spawnGapSec = spawnGapSec;

    this.goalCols = goalCols();
    this.filledGoals = new Set();

    this.traffic = TRAFFIC_ROWS.map((row, i) => ({
      row,
      dir: i % 2 === 0 ? 1 : -1,
      speed: trafficSpeed * (0.78 + i * 0.1),
      vehicles: [],
      spawnTimer: Math.random() * spawnGapSec,
    }));
    this.river = RIVER_ROWS.map((row, i) => ({
      row,
      dir: i % 2 === 0 ? -1 : 1,
      speed: riverSpeed * (0.75 + i * 0.1),
      logs: [],
      spawnTimer: Math.random() * spawnGapSec,
    }));

    this._resetFrog();
    this.lives = 3;
    this.score = 0;
    this.bestRow = START_ROW;
    this.elapsed = 0;
    this.hopCooldown = 0;
    this.running = false;
    this.dead = false;

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKeyDown(e);
  }

  _resetFrog() {
    this.frog = { row: START_ROW, col: Math.floor(COLS / 2), x: Math.floor(COLS / 2), onLog: null };
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

  _handleChordChange(match) {
    if (!match) return;
    const idx = this.chordIds.indexOf(match.id);
    if (idx !== -1) this._hop(DIR_LIST[idx]);
  }

  _handleKeyDown(e) {
    const dir = KEY_DIRS[e.key];
    if (dir) this._hop(dir);
  }

  _hop(dir) {
    if (this.dead || this.hopCooldown > 0) return;
    const { dr, dc } = DIRS[dir];
    const nr = this.frog.row + dr;
    const nc = this.frog.col + dc;
    if (nr < GOAL_ROW || nr > START_ROW || nc < 0 || nc >= COLS) return;
    this.frog.row = nr;
    this.frog.col = nc;
    this.frog.x = nc;
    this.hopCooldown = HOP_COOLDOWN;
    if (nr < this.bestRow) {
      this.score += 10;
      this.bestRow = nr;
    }
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
    if (this.dead) return;
    this.elapsed += dt;
    if (this.hopCooldown > 0) this.hopCooldown -= dt;

    for (const lane of this.traffic) {
      lane.spawnTimer -= dt;
      if (lane.spawnTimer <= 0) {
        lane.spawnTimer = this.spawnGapSec + Math.random() * 0.6;
        lane.vehicles.push({ x: lane.dir > 0 ? -1.2 : COLS + 0.2, width: 1.4 + Math.random() * 0.5 });
      }
      for (const v of lane.vehicles) v.x += (lane.dir * lane.speed * dt) / CELL;
      lane.vehicles = lane.vehicles.filter((v) => v.x > -2 && v.x < COLS + 2);
    }

    for (const lane of this.river) {
      lane.spawnTimer -= dt;
      if (lane.spawnTimer <= 0) {
        lane.spawnTimer = this.spawnGapSec + Math.random() * 0.6;
        lane.logs.push({ x: lane.dir > 0 ? -2 : COLS + 0.2, width: 2.2 + Math.random() * 0.8 });
      }
      for (const log of lane.logs) log.x += (lane.dir * lane.speed * dt) / CELL;
      lane.logs = lane.logs.filter((log) => log.x > -3 && log.x < COLS + 3);
    }

    if (RIVER_ROWS.includes(this.frog.row)) {
      const lane = this.river.find((l) => l.row === this.frog.row);
      const ridingLog = lane.logs.find((log) => this.frog.x >= log.x && this.frog.x <= log.x + log.width);
      if (!ridingLog) {
        this._loseLife();
        return;
      }
      this.frog.x += (lane.dir * lane.speed * dt) / CELL;
      this.frog.col = Math.round(this.frog.x);
      if (this.frog.x < -0.4 || this.frog.x > COLS - 0.6) {
        this._loseLife();
        return;
      }
    } else {
      this.frog.x = this.frog.col;
    }

    if (TRAFFIC_ROWS.includes(this.frog.row)) {
      const lane = this.traffic.find((l) => l.row === this.frog.row);
      const hit = lane.vehicles.some((v) => this.frog.x >= v.x - 0.15 && this.frog.x <= v.x + v.width + 0.15);
      if (hit) {
        this._loseLife();
        return;
      }
    }

    if (this.frog.row === GOAL_ROW) {
      const slotIdx = this.goalCols.findIndex((c) => Math.abs(c - Math.round(this.frog.x)) < 1 && !this.filledGoals.has(c));
      if (slotIdx !== -1) {
        this.filledGoals.add(this.goalCols[slotIdx]);
        this.score += 100;
        if (this.filledGoals.size >= GOAL_COUNT) {
          this.score += 500;
          this._endGame();
          return;
        }
        this._resetFrog();
        this.bestRow = START_ROW;
      } else {
        this._loseLife();
        return;
      }
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.score, lives: this.lives } }));
  }

  _loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this._endGame();
      return;
    }
    this._resetFrog();
    this.bestRow = START_ROW;
  }

  _endGame() {
    this.dead = true;
    this._gameOver();
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: this.score, elapsedSeconds: this.elapsed } }));
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rowColor = (row) => {
      if (row === GOAL_ROW) return '#0b3b1e';
      if (RIVER_ROWS.includes(row)) return '#0c2a52';
      if (row === MEDIAN_ROW) return '#173a20';
      if (TRAFFIC_ROWS.includes(row)) return '#201f28';
      return '#173a20';
    };
    for (let r = 0; r < ROWS; r++) {
      ctx.fillStyle = rowColor(r);
      ctx.fillRect(0, r * CELL, canvas.width, CELL);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.setLineDash([10, 8]);
    for (const row of TRAFFIC_ROWS) {
      ctx.beginPath();
      ctx.moveTo(0, row * CELL + CELL / 2);
      ctx.lineTo(canvas.width, row * CELL + CELL / 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const c of this.goalCols) {
      const filled = this.filledGoals.has(c);
      ctx.fillStyle = filled ? '#39ff88' : '#0e5a2d';
      ctx.beginPath();
      ctx.ellipse(c * CELL + CELL / 2, GOAL_ROW * CELL + CELL / 2, CELL * 0.4, CELL * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#8a5a2c';
    for (const lane of this.river) {
      for (const log of lane.logs) {
        ctx.beginPath();
        ctx.roundRect(log.x * CELL, lane.row * CELL + 6, log.width * CELL, CELL - 12, 8);
        ctx.fill();
      }
    }

    for (const lane of this.traffic) {
      for (const v of lane.vehicles) {
        ctx.fillStyle = '#ff2ec4';
        ctx.beginPath();
        ctx.roundRect(v.x * CELL, lane.row * CELL + 6, v.width * CELL, CELL - 12, 6);
        ctx.fill();
        ctx.fillStyle = '#fff6d8';
        const lightX = lane.dir > 0 ? (v.x + v.width) * CELL - 6 : v.x * CELL + 2;
        ctx.fillRect(lightX, lane.row * CELL + CELL / 2 - 3, 4, 6);
      }
    }

    const fx = this.frog.x * CELL + CELL / 2;
    const fy = this.frog.row * CELL + CELL / 2;
    ctx.fillStyle = '#39ff88';
    ctx.shadowColor = 'rgba(57, 255, 136, 0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0b3b1e';
    ctx.beginPath();
    ctx.arc(fx - 6, fy - 6, 3, 0, Math.PI * 2);
    ctx.arc(fx + 6, fy - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.score}`, 8, canvas.height - 8);
    ctx.textAlign = 'right';
    ctx.fillText('♥'.repeat(Math.max(0, this.lives)), canvas.width - 8, canvas.height - 8);
    ctx.textAlign = 'left';
  }
}

export const HOPPER_CANVAS_WIDTH = COLS * CELL;
export const HOPPER_CANVAS_HEIGHT = ROWS * CELL;
