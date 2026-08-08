import { levelT, lerp } from './difficultyLevels.js';

const MAZE_W = 9; // maze cells across
const MAZE_H = 9; // maze cells down
const COLS = MAZE_W * 2 + 1; // rasterized pixel-grid columns
const ROWS = MAZE_H * 2 + 1;
const CELL = 26;
const LOOP_CHANCE = 0.18;
const TUNNEL_ROW = 2 * Math.floor(MAZE_H / 2) + 1;

const DIRS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};
const DIR_LIST = ['up', 'down', 'left', 'right'];
const KEY_DIRS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

const DEFAULT_PLAYER_SPEED = 5.2; // cells/sec
const DEFAULT_GHOST_SPEED_MUL = 0.82;
const DEFAULT_GHOST_COUNT = 2;
const DEFAULT_FRIGHTENED_SEC = 7;

const GHOST_COLORS = ['#ff3b5c', '#ff2ec4', '#26e0ff', '#ffa552'];

/** Maps a 6-tier difficulty level to Chord Chomp's ghost pressure. */
export function chompParamsForLevel(level) {
  const t = levelT(level);
  return {
    ghostSpeedMul: lerp(0.62, 0.98, t),
    ghostCount: t < 0.35 ? 2 : t < 0.7 ? 3 : 4,
    frightenedSec: lerp(9, 4, t),
  };
}

/** Randomized-DFS perfect maze, rasterized to a wall/open pixel grid, with a few extra loop-openings punched in and one tunnel row for wraparound. Guarantees every open cell is reachable. */
export function generateMaze() {
  const walls = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
  const visited = Array.from({ length: MAZE_H }, () => Array(MAZE_W).fill(false));

  const cellPx = (cx, cy) => [cy * 2 + 1, cx * 2 + 1];

  const stack = [[0, 0]];
  visited[0][0] = true;
  const [sr, sc] = cellPx(0, 0);
  walls[sr][sc] = false;

  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < MAZE_W && ny >= 0 && ny < MAZE_H && !visited[ny][nx]) neighbors.push([nx, ny, dx, dy]);
    }
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }
    const [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
    visited[ny][nx] = true;
    const [cr, cc] = cellPx(cx, cy);
    walls[cr + dy][cc + dx] = false;
    const [nr, nc] = cellPx(nx, ny);
    walls[nr][nc] = false;
    stack.push([nx, ny]);
  }

  // Extra loops: some still-walled cells directly between two open cell
  // centers get opened too, purely additive so connectivity can't break.
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (!walls[r][c]) continue;
      const isBetweenCells = (r % 2 === 1 && c % 2 === 0) || (r % 2 === 0 && c % 2 === 1);
      if (isBetweenCells && Math.random() < LOOP_CHANCE) walls[r][c] = false;
    }
  }

  walls[TUNNEL_ROW][0] = false;
  walls[TUNNEL_ROW][COLS - 1] = false;

  return walls;
}

function neighborsOf(walls, r, c) {
  const out = [];
  for (const dir of DIR_LIST) {
    const { dx, dy } = DIRS[dir];
    let nr = r + dy;
    let nc = c + dx;
    if (r === TUNNEL_ROW && c === 0 && dir === 'left') nc = COLS - 1;
    else if (r === TUNNEL_ROW && c === COLS - 1 && dir === 'right') nc = 0;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
    if (walls[nr][nc]) continue;
    out.push({ r: nr, c: nc, dir });
  }
  return out;
}

function bfsFirstStep(walls, from, to) {
  if (from.r === to.r && from.c === to.c) return null;
  const key = (r, c) => `${r},${c}`;
  const visited = new Set([key(from.r, from.c)]);
  const queue = [{ ...from, first: null }];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const n of neighborsOf(walls, cur.r, cur.c)) {
      const k = key(n.r, n.c);
      if (visited.has(k)) continue;
      visited.add(k);
      const first = cur.first ?? n.dir;
      if (n.r === to.r && n.c === to.c) return first;
      queue.push({ r: n.r, c: n.c, first });
    }
  }
  return null;
}

/**
 * Original maze-chase game: four chords steer up/down/left/right, same
 * buffered-turn feel as arcade maze games — a direction request is held
 * until the player reaches the next intersection where that turn is
 * actually legal, rather than requiring pixel-perfect timing. Ghosts chase
 * via BFS shortest-path, recomputed each time they reach an intersection.
 * Eating a power pellet flips ghosts frightened (edible, fleeing) for a
 * limited time.
 */
export class ChordChompGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      playerSpeed = DEFAULT_PLAYER_SPEED,
      ghostSpeedMul = DEFAULT_GHOST_SPEED_MUL,
      ghostCount = DEFAULT_GHOST_COUNT,
      frightenedSec = DEFAULT_FRIGHTENED_SEC,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chordIds = chordIds; // [upId, downId, leftId, rightId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.playerSpeed = playerSpeed;
    this.ghostSpeedMul = ghostSpeedMul;
    this.frightenedSec = frightenedSec;

    this.walls = generateMaze();
    this.dots = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => !this.walls[r][c]));
    this.pellets = this._placePellets();
    for (const p of this.pellets) this.dots[p.r][p.c] = false;
    this.totalDots = this.dots.flat().filter(Boolean).length + this.pellets.length;

    const startCell = { r: TUNNEL_ROW - 2 >= 1 ? TUNNEL_ROW - 2 : 1, c: 1 };
    this.player = { r: startCell.r, c: startCell.c, x: startCell.c, y: startCell.r, dir: 'right', queued: 'right' };

    const centerR = Math.floor(ROWS / 2);
    const centerC = Math.floor(COLS / 2);
    const ghostHomes = this._findOpenCellsNear(centerR, centerC, ghostCount);
    this.ghosts = ghostHomes.map((home, i) => ({
      r: home.r,
      c: home.c,
      x: home.c,
      y: home.r,
      dir: DIR_LIST[i % DIR_LIST.length],
      color: GHOST_COLORS[i % GHOST_COLORS.length],
      frightened: 0,
      speedMul: ghostSpeedMul,
    }));

    this.lives = 3;
    this.score = 0;
    this.elapsed = 0;
    this.animT = 0;
    this.running = false;
    this.dead = false;

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKeyDown(e);
  }

  _placePellets() {
    const corners = [
      { r: 1, c: 1 },
      { r: 1, c: COLS - 2 },
      { r: ROWS - 2, c: 1 },
      { r: ROWS - 2, c: COLS - 2 },
    ];
    return corners.map((corner) => this._findOpenCellsNear(corner.r, corner.c, 1)[0]).filter(Boolean);
  }

  _findOpenCellsNear(r0, c0, count) {
    const found = [];
    const seen = new Set();
    const queue = [{ r: r0, c: c0 }];
    seen.add(`${r0},${c0}`);
    let head = 0;
    while (head < queue.length && found.length < count) {
      const cur = queue[head++];
      if (!this.walls || !this.walls[cur.r][cur.c]) found.push(cur);
      for (const n of neighborsOf(this.walls, cur.r, cur.c)) {
        const k = `${n.r},${n.c}`;
        if (seen.has(k)) continue;
        seen.add(k);
        queue.push({ r: n.r, c: n.c });
      }
    }
    return found;
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
    if (idx !== -1) this.player.queued = DIR_LIST[idx];
  }

  _handleKeyDown(e) {
    const dir = KEY_DIRS[e.key];
    if (dir) this.player.queued = dir;
  }

  _loop(time) {
    if (!this.running) return;
    const dt = Math.min((time - this._lastTime) / 1000, 0.05);
    this._lastTime = time;
    this._update(dt);
    this._draw();
    if (this.running) this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  _isAligned(entity) {
    return Math.abs(entity.x - entity.c) < 0.06 && Math.abs(entity.y - entity.r) < 0.06;
  }

  _canMove(r, c, dir) {
    return neighborsOf(this.walls, r, c).some((n) => n.dir === dir);
  }

  _wrapPosition(entity) {
    if (entity.c < 0) {
      entity.c = COLS - 1;
      entity.x = entity.c;
    } else if (entity.c >= COLS) {
      entity.c = 0;
      entity.x = entity.c;
    }
  }

  _moveEntity(entity, speed, dt) {
    const { dx, dy } = DIRS[entity.dir] ?? { dx: 0, dy: 0 };
    entity.x += dx * speed * dt;
    entity.y += dy * speed * dt;
    if (this._isAligned(entity)) {
      entity.x = entity.c;
      entity.y = entity.r;
    }
  }

  _update(dt) {
    if (this.dead) return;
    this.elapsed += dt;
    this.animT += dt;

    const p = this.player;
    if (this._isAligned(p)) {
      p.r = Math.round(p.y);
      p.c = Math.round(p.x);
      if (p.queued !== p.dir && this._canMove(p.r, p.c, p.queued)) p.dir = p.queued;
      if (!this._canMove(p.r, p.c, p.dir)) p.dir = null;
    }
    if (p.dir) this._moveEntity(p, this.playerSpeed, dt);
    this._wrapPosition(p);

    if (this._isAligned(p)) {
      const r = Math.round(p.y);
      const c = Math.round(p.x);
      if (this.dots[r][c]) {
        this.dots[r][c] = false;
        this.score += 10;
      }
      const pelletIdx = this.pellets.findIndex((pe) => pe.r === r && pe.c === c && !pe.eaten);
      if (pelletIdx !== -1) {
        this.pellets[pelletIdx].eaten = true;
        this.score += 50;
        for (const g of this.ghosts) g.frightened = this.frightenedSec;
      }
    }

    for (const g of this.ghosts) {
      if (g.frightened > 0) g.frightened = Math.max(0, g.frightened - dt);
      if (this._isAligned(g)) {
        g.r = Math.round(g.y);
        g.c = Math.round(g.x);
        const options = neighborsOf(this.walls, g.r, g.c);
        let nextDir = null;
        if (g.frightened > 0) {
          const away = options.filter((o) => o.dir !== this._opposite(g.dir));
          nextDir = (away.length ? away : options)[Math.floor(Math.random() * (away.length ? away.length : options.length))]?.dir;
        } else {
          const step = bfsFirstStep(this.walls, { r: g.r, c: g.c }, { r: Math.round(p.y), c: Math.round(p.x) });
          nextDir = step ?? options[Math.floor(Math.random() * options.length)]?.dir;
        }
        if (nextDir) g.dir = nextDir;
      }
      const speed = this.playerSpeed * g.speedMul * (g.frightened > 0 ? 0.6 : 1);
      this._moveEntity(g, speed, dt);
      this._wrapPosition(g);
    }

    for (const g of this.ghosts) {
      const dist = Math.hypot(g.x - p.x, g.y - p.y);
      if (dist < 0.6) {
        if (g.frightened > 0) {
          g.frightened = 0;
          const home = this._findOpenCellsNear(Math.floor(ROWS / 2), Math.floor(COLS / 2), 1)[0];
          g.r = home.r;
          g.c = home.c;
          g.x = home.c;
          g.y = home.r;
          this.score += 200;
        } else {
          this._loseLife();
          return;
        }
      }
    }

    const dotsLeft = this.dots.flat().filter(Boolean).length + this.pellets.filter((pe) => !pe.eaten).length;
    if (dotsLeft === 0) {
      this.score += 1000;
      this._endGame();
      return;
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.score, lives: this.lives } }));
  }

  _opposite(dir) {
    return { up: 'down', down: 'up', left: 'right', right: 'left' }[dir] ?? null;
  }

  _loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this._endGame();
      return;
    }
    const startCell = { r: TUNNEL_ROW - 2 >= 1 ? TUNNEL_ROW - 2 : 1, c: 1 };
    Object.assign(this.player, { r: startCell.r, c: startCell.c, x: startCell.c, y: startCell.r, dir: 'right', queued: 'right' });
    const centerR = Math.floor(ROWS / 2);
    const centerC = Math.floor(COLS / 2);
    const homes = this._findOpenCellsNear(centerR, centerC, this.ghosts.length);
    this.ghosts.forEach((g, i) => {
      const home = homes[i] ?? homes[0];
      Object.assign(g, { r: home.r, c: home.c, x: home.c, y: home.r, frightened: 0 });
    });
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
    ctx.fillStyle = '#05030a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1f3a6b';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.walls[r][c]) ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    ctx.fillStyle = '#ffe14d';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.dots[r][c]) {
          ctx.beginPath();
          ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    const pulse = 4 + Math.sin(this.animT * 6) * 1.5;
    for (const pe of this.pellets) {
      if (pe.eaten) continue;
      ctx.beginPath();
      ctx.arc(pe.c * CELL + CELL / 2, pe.r * CELL + CELL / 2, pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    const p = this.player;
    const mouthPhase = Math.abs(Math.sin(this.animT * 10)) * 0.28;
    const angleFor = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 };
    const baseAngle = angleFor[p.dir] ?? 0;
    ctx.fillStyle = '#ffe14d';
    ctx.beginPath();
    ctx.arc(p.x * CELL + CELL / 2, p.y * CELL + CELL / 2, CELL * 0.42, baseAngle + mouthPhase, baseAngle - mouthPhase + Math.PI * 2);
    ctx.lineTo(p.x * CELL + CELL / 2, p.y * CELL + CELL / 2);
    ctx.fill();

    for (const g of this.ghosts) {
      const gx = g.x * CELL + CELL / 2;
      const gy = g.y * CELL + CELL / 2;
      const r = CELL * 0.4;
      ctx.fillStyle = g.frightened > 0 ? (g.frightened < 2 && Math.floor(this.animT * 6) % 2 === 0 ? '#dfe6ff' : '#2e3fd6') : g.color;
      ctx.beginPath();
      ctx.arc(gx, gy, r, Math.PI, 0);
      ctx.lineTo(gx + r, gy + r);
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(gx + r - (r * 2 * (i + 0.5)) / 3, gy + r * (i % 2 === 0 ? 0.6 : 1));
      }
      ctx.lineTo(gx - r, gy + r);
      ctx.closePath();
      ctx.fill();
      if (g.frightened <= 0) {
        ctx.fillStyle = '#f2ecff';
        ctx.beginPath();
        ctx.arc(gx - r * 0.35, gy - r * 0.1, r * 0.22, 0, Math.PI * 2);
        ctx.arc(gx + r * 0.35, gy - r * 0.1, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#f2ecff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.score}`, 8, ROWS * CELL - 8);
    ctx.textAlign = 'right';
    ctx.fillText('♥'.repeat(Math.max(0, this.lives)), COLS * CELL - 8, ROWS * CELL - 8);
    ctx.textAlign = 'left';
  }
}

export const CHOMP_CANVAS_WIDTH = COLS * CELL;
export const CHOMP_CANVAS_HEIGHT = ROWS * CELL;
