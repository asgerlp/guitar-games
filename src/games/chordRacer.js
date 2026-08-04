const BASE_SPEED = 150; // px/s
const MAX_SPEED = 560; // px/s
const RAMP_PER_SEC = 7; // px/s gained per second survived
const CAR_HALF_WIDTH = 26;
const OBSTACLE_HALF_WIDTH = 30;
const HIT_HALF_HEIGHT = 28;

/** Canvas-driven "dodge obstacles by switching lanes/chords" game. */
export class ChordRacerGame extends EventTarget {
  constructor(canvas, { laneChordIds, detector, keyboardFallback = false }) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.laneChordIds = laneChordIds;
    this.laneCount = laneChordIds.length;
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;

    this.currentLaneIndex = Math.floor(this.laneCount / 2);
    this.carX = this._laneCenterX(this.currentLaneIndex);
    this.obstacles = [];
    this.speed = BASE_SPEED;
    this.elapsed = 0;
    this.distance = 0;
    this.spawnTimer = 0.6;
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
    this.speed = Math.min(MAX_SPEED, BASE_SPEED + this.elapsed * RAMP_PER_SEC);
    this.distance += this.speed * dt;

    const targetX = this._laneCenterX(this.currentLaneIndex);
    this.carX += (targetX - this.carX) * Math.min(1, dt * 10);

    this.spawnTimer -= dt;
    const dynamicInterval = Math.max(0.42, 1.15 - this.elapsed * 0.012);
    if (this.spawnTimer <= 0) {
      this.spawnTimer = dynamicInterval;
      this.obstacles.push({ lane: Math.floor(Math.random() * this.laneCount), y: -40 });
    }

    for (const ob of this.obstacles) ob.y += this.speed * dt;
    this.obstacles = this.obstacles.filter((ob) => ob.y < this.canvas.height + 60);

    const carY = this.canvas.height - 90;
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
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: Math.floor(this.distance / 10) } }));
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
      this._drawCar(x, ob.y, OBSTACLE_HALF_WIDTH * 2, 40, {
        body: '#ff5c6c',
        cabin: '#5c1620',
        facing: 'down',
      });
    }

    const carY = canvas.height - 90;
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
}
