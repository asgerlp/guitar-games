const MAX_SPEED = 800; // px/s hard cap, independent of adaptive difficulty
const CAR_HALF_WIDTH = 26;
const OBSTACLE_HALF_WIDTH = 30;
const HIT_HALF_HEIGHT = 28;
const OBSTACLE_TYPES = ['tree', 'rock', 'banana', 'barrel'];

/** Canvas-driven "dodge obstacles by switching lanes/chords" game. */
export class ChordRacerGame extends EventTarget {
  constructor(
    canvas,
    {
      laneChordIds,
      detector,
      keyboardFallback = false,
      startSpeed = 70,
      rampPerSec = 2.5,
      carInset = 80,
      obstacleGapSec = 1.6,
    }
  ) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.laneChordIds = laneChordIds;
    this.laneCount = laneChordIds.length;
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.startSpeed = startSpeed;
    this.rampPerSec = rampPerSec;
    this.carInset = carInset;
    this.obstacleGapSec = obstacleGapSec;

    this.currentLaneIndex = Math.floor(this.laneCount / 2);
    this.carX = this._laneCenterX(this.currentLaneIndex);
    this.obstacles = [];
    this.speed = startSpeed;
    this.elapsed = 0;
    this.distance = 0;
    this.spawnTimer = obstacleGapSec + 0.85;
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

  _handleChordChange(match) {
    if (!match) return;
    const idx = this.laneChordIds.indexOf(match.id);
    if (idx !== -1) this.currentLaneIndex = idx;
  }

  _handleKeyDown(e) {
    if (e.key === 'ArrowLeft') this.currentLaneIndex = Math.max(0, this.currentLaneIndex - 1);
    if (e.key === 'ArrowRight') this.currentLaneIndex = Math.min(this.laneCount - 1, this.currentLaneIndex + 1);
  }

  _laneCenterX(idx) {
    const laneWidth = this.canvas.width / this.laneCount;
    return laneWidth * idx + laneWidth / 2;
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
    this.speed = Math.min(MAX_SPEED, this.startSpeed + this.elapsed * this.rampPerSec);
    this.distance += this.speed * dt;

    const targetX = this._laneCenterX(this.currentLaneIndex);
    this.carX += (targetX - this.carX) * Math.min(1, dt * 10);

    this.spawnTimer -= dt;
    // This interval is the actual time a player gets between one obstacle's
    // lane and the next one's, since every obstacle crosses the track at the
    // same current speed. It has to stay long enough to switch chords and
    // settle before the next lane call — too short and a dodge into a lane
    // gets immediately undone by the next obstacle already needing you out
    // of it. obstacleGapSec is the floor it eases down to; it starts with
    // some extra breathing room on top and tightens toward that floor as
    // the run goes on.
    const dynamicInterval = Math.max(this.obstacleGapSec, this.obstacleGapSec + 0.85 - this.elapsed * 0.01);
    if (this.spawnTimer <= 0) {
      this.spawnTimer = dynamicInterval;
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      this.obstacles.push({ lane: Math.floor(Math.random() * this.laneCount), y: -40, type });
    }

    for (const ob of this.obstacles) ob.y += this.speed * dt;
    this.obstacles = this.obstacles.filter((ob) => ob.y < this.canvas.height + 60);

    const carY = this.canvas.height - this.carInset;
    for (const ob of this.obstacles) {
      const obX = this._laneCenterX(ob.lane);
      const hitX = Math.abs(obX - this.carX) < CAR_HALF_WIDTH + OBSTACLE_HALF_WIDTH - 16;
      const hitY = Math.abs(ob.y - carY) < HIT_HALF_HEIGHT;
      if (hitX && hitY) {
        this._gameOver();
        return;
      }
    }

    this.dispatchEvent(
      new CustomEvent('tick', { detail: { score: Math.floor(this.distance / 10), speed: this.speed } })
    );
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', {
        detail: { score: Math.floor(this.distance / 10), elapsedSeconds: this.elapsed },
      })
    );
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2e3850';
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 14]);
    for (let i = 1; i < this.laneCount; i++) {
      const x = (canvas.width / this.laneCount) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const ob of this.obstacles) {
      const x = this._laneCenterX(ob.lane);
      this._drawObstacle(x, ob.y, ob.type, OBSTACLE_HALF_WIDTH * 2, 40);
    }

    const carY = canvas.height - this.carInset;
    this._drawCar(this.carX, carY, CAR_HALF_WIDTH * 2, 44, {
      body: '#5ad1a8',
      cabin: '#0f3226',
      facing: 'up',
    });
  }

  /** Draw a simple top-down car sprite centered at (cx, cy). */
  _drawCar(cx, cy, width, height, { body, cabin, facing }) {
    const ctx = this.ctx;
    const halfW = width / 2;
    const halfH = height / 2;
    const noseUp = facing === 'up';

    ctx.save();
    ctx.translate(cx, cy);

    // Wheels: four nubs that clearly poke out past the body's sides, in a
    // mid-tone that reads against both the dark road and the body color.
    const wheelW = 7;
    const wheelH = height * 0.34;
    const wheelInsetY = halfH - wheelH / 2 - 2;
    ctx.fillStyle = '#4a5268';
    for (const side of [-1, 1]) {
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.roundRect(side * halfW - (side > 0 ? 1 : wheelW - 1), dir * wheelInsetY - wheelH / 2, wheelW, wheelH, 2);
        ctx.fill();
      }
    }

    // Body, with a thin dark outline so it stays legible against similarly
    // dark obstacles/background.
    ctx.fillStyle = body;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, width, height, 10);
    ctx.fill();
    ctx.stroke();

    // Cabin/roof block, offset toward the nose so which way the car is
    // facing is obvious even at a glance.
    const cabinH = height * 0.46;
    const cabinY = noseUp ? -halfH + 5 : halfH - 5 - cabinH;
    ctx.fillStyle = cabin;
    ctx.beginPath();
    ctx.roundRect(-halfW + 8, cabinY, width - 16, cabinH, 5);
    ctx.fill();

    // Headlights at the nose edge.
    ctx.fillStyle = '#fff6d8';
    const lightY = noseUp ? -halfH + 2 : halfH - 6;
    ctx.fillRect(-halfW + 4, lightY, 7, 4);
    ctx.fillRect(halfW - 11, lightY, 7, 4);

    ctx.restore();
  }

  /** Dispatch to the sprite for a road-hazard obstacle type. */
  _drawObstacle(cx, cy, type, width, height) {
    switch (type) {
      case 'tree':
        return this._drawTree(cx, cy, width, height);
      case 'rock':
        return this._drawRock(cx, cy, width, height);
      case 'banana':
        return this._drawBanana(cx, cy, width, height);
      case 'barrel':
      default:
        return this._drawBarrel(cx, cy, width, height);
    }
  }

  _drawTree(cx, cy, width, height) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = '#6b4a2a';
    ctx.fillRect(-4, height * 0.18, 8, height * 0.28);

    const r = width * 0.32;
    ctx.fillStyle = '#2e6b3e';
    ctx.beginPath();
    ctx.arc(0, -height * 0.08, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-r * 0.7, height * 0.05, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.7, height * 0.05, r * 0.75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3f8a52';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.35, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _drawRock(cx, cy, width, height) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = '#8b8f9c';
    ctx.beginPath();
    ctx.moveTo(-width * 0.34, height * 0.1);
    ctx.lineTo(-width * 0.4, -height * 0.15);
    ctx.lineTo(-width * 0.08, -height * 0.35);
    ctx.lineTo(width * 0.28, -height * 0.28);
    ctx.lineTo(width * 0.38, height * 0.02);
    ctx.lineTo(width * 0.26, height * 0.32);
    ctx.lineTo(-width * 0.15, height * 0.34);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#686c79';
    ctx.beginPath();
    ctx.moveTo(width * 0.02, height * 0.3);
    ctx.lineTo(width * 0.26, height * 0.32);
    ctx.lineTo(width * 0.38, height * 0.02);
    ctx.lineTo(width * 0.12, -height * 0.02);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.ellipse(-width * 0.12, -height * 0.14, width * 0.14, height * 0.08, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _drawBanana(cx, cy, width, height) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.35);

    ctx.fillStyle = '#f5d13d';
    ctx.beginPath();
    ctx.moveTo(-width * 0.32, height * 0.22);
    ctx.quadraticCurveTo(-width * 0.05, -height * 0.42, width * 0.32, -height * 0.16);
    ctx.quadraticCurveTo(width * 0.02, -height * 0.12, -width * 0.2, height * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#c9a52a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-width * 0.26, height * 0.2);
    ctx.quadraticCurveTo(-width * 0.02, -height * 0.32, width * 0.27, -height * 0.15);
    ctx.stroke();

    ctx.fillStyle = '#6b4a1f';
    ctx.beginPath();
    ctx.arc(-width * 0.3, height * 0.22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.32, -height * 0.16, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _drawBarrel(cx, cy, width, height) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const r = Math.min(width, height) * 0.42;
    ctx.fillStyle = '#c9622c';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#7a3a16';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.3, r * 0.18, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
