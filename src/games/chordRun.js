import * as THREE from 'three';
import { levelT, lerp } from './difficultyLevels.js';

const GRAVITY = 20; // units/s^2 — fixed across levels, only pacing (below) scales
const JUMP_SPEED = 6; // units/s, launched upward on a grounded jump trigger (~0.6s airtime)
const PLAYER_Z = 0;
const PLAYER_HALF_DEPTH = 0.5;
const RUN_HEIGHT = 1.6;
const DUCK_SCALE = 0.5; // squash factor applied to the whole player rig while ducking
const OBSTACLE_HALF_DEPTH = 0.55;
const OBSTACLE_SPAWN_Z = -46;
const OBSTACLE_DESPAWN_Z = 4;
const PILLAR_COUNT_PER_SIDE = 12;
const PILLAR_SPACING = 8;
const GRID_SIZE = 140;
const GRID_DIVISIONS = 56;

const DEFAULT_START_SPEED = 13;
const DEFAULT_RAMP_PER_SEC = 0.35;
const DEFAULT_MAX_SPEED = 30;
const DEFAULT_OBSTACLE_GAP_SEC = 1.5;

/** Maps a 6-tier difficulty level to Chord Run's scroll speed and obstacle spacing. */
export function runParamsForLevel(level) {
  const t = levelT(level);
  return {
    startSpeed: lerp(10, 19, t),
    rampPerSec: lerp(0.18, 0.75, t),
    maxSpeed: lerp(22, 38, t),
    obstacleGapSec: lerp(2.2, 1.0, t),
  };
}

/**
 * Real 3D (three.js/WebGL) endless runner: a fixed third-person camera
 * looks down a temple corridor while obstacles approach out of the fog.
 * Two chords map to Jump (a one-shot impulse, triggered whenever that
 * chord is reported while grounded — holding it lets you keep
 * bunny-hopping) and Duck (a held stance, live for as long as that chord
 * keeps matching). Obstacles are one of two kinds — a low log you must be
 * airborne to clear, or a high beam you must be ducked under — so the two
 * actions are always in tension: hold jump and you're safe from logs but
 * exposed to beams, and vice versa for duck. The physics/input model is
 * unchanged from the original 2D version — only the rendering and spatial
 * axis (depth instead of screen-x) are new.
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
    this.chordIds = chordIds; // [jumpId, duckId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.startSpeed = startSpeed;
    this.rampPerSec = rampPerSec;
    this.maxSpeed = maxSpeed;
    this.obstacleGapSec = obstacleGapSec;

    this.playerY = 0;
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

    this._initScene();

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKey(e, true);
    this._onKeyUp = (e) => this._handleKey(e, false);
  }

  _initScene() {
    const { canvas } = this;
    const bg = new THREE.Color('#0d0620');

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(canvas.width, canvas.height, false);
    this.renderer.setClearColor(bg, 1);

    this.scene = new THREE.Scene();
    this.scene.background = bg;
    // Far edge matches the camera-to-spawn distance, so obstacles fade in
    // out of the fog as they spawn rather than popping into view.
    this.scene.fog = new THREE.Fog(bg, 14, 52);

    this.camera = new THREE.PerspectiveCamera(62, canvas.width / canvas.height, 0.1, 100);
    this.camera.position.set(0, 2.6, 6);
    this.camera.lookAt(0, 1.1, -8);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, GRID_SIZE),
      new THREE.MeshBasicMaterial({ color: 0x140a28 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -60);
    this.scene.add(ground);

    this.grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, 0x6b3fa0, 0x3a2456);
    this.grid.position.set(0, 0.01, -60);
    this.scene.add(this.grid);
    this._gridSpacing = GRID_SIZE / GRID_DIVISIONS;
    this._gridBaseZ = this.grid.position.z;

    this.pillars = [];
    for (let i = 0; i < PILLAR_COUNT_PER_SIDE; i++) {
      const z = -i * PILLAR_SPACING - 4;
      for (const side of [-1, 1]) {
        const pillar = this._makePillar();
        pillar.position.set(side * 3.6, 0, z);
        this.scene.add(pillar);
        this.pillars.push(pillar);
      }
    }

    this.player = this._makePlayer();
    this.player.position.set(0, 0, PLAYER_Z);
    this.scene.add(this.player);
  }

  _makePillar() {
    const group = new THREE.Group();
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 2.4, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x2e1a52 })
    );
    post.position.y = 1.2;
    group.add(post);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0x26e0ff }));
    glow.position.y = 2.5;
    group.add(glow);
    return group;
  }

  _makePlayer() {
    const group = new THREE.Group();
    const height = RUN_HEIGHT * 0.6;
    const radius = 0.32;
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(radius, height, 4, 8),
      new THREE.MeshBasicMaterial({ color: 0x39ff88 })
    );
    body.position.y = height / 2 + radius;
    group.add(body);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: 0xbdffdc })
    );
    edges.position.copy(body.position);
    group.add(edges);
    return group;
  }

  _makeObstacleMesh(type) {
    const group = new THREE.Group();
    if (type === 'low') {
      const log = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.5, OBSTACLE_HALF_DEPTH * 2),
        new THREE.MeshBasicMaterial({ color: 0xc9622c })
      );
      log.position.y = 0.25;
      group.add(log);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(log.geometry),
        new THREE.LineBasicMaterial({ color: 0xffcfa8 })
      );
      edges.position.copy(log.position);
      group.add(edges);
      return group;
    }

    const beamY = RUN_HEIGHT + 0.15;
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.3, OBSTACLE_HALF_DEPTH * 2),
      new THREE.MeshBasicMaterial({ color: 0xff2ec4 })
    );
    beam.position.y = beamY;
    group.add(beam);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(beam.geometry),
      new THREE.LineBasicMaterial({ color: 0xffb3ec })
    );
    edges.position.copy(beam.position);
    group.add(edges);
    for (const side of [-1, 1]) {
      const support = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, beamY, 0.12),
        new THREE.MeshBasicMaterial({ color: 0x7a1a5c })
      );
      support.position.set(side * 0.85, beamY / 2, 0);
      group.add(support);
    }
    return group;
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
    this._disposeScene();
  }

  _disposeScene() {
    this.scene.traverse((obj) => {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material?.dispose();
    });
    this.renderer.dispose();
  }

  _reportAction(action) {
    this.action = action;
    if (action === 'jump' && this.grounded) {
      this.vy = JUMP_SPEED;
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
    // _update may have ended the game (which disposes the renderer) — don't
    // render or reschedule against a torn-down WebGL context.
    if (!this.running) return;
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    this.elapsed += dt;
    this.speed = Math.min(this.maxSpeed, this.startSpeed + this.elapsed * this.rampPerSec);
    this.distance += this.speed * dt;

    this.vy -= GRAVITY * dt;
    this.playerY = Math.max(0, this.playerY + this.vy * dt);
    if (this.playerY <= 0) {
      this.playerY = 0;
      this.vy = 0;
      this.grounded = true;
    }

    const ducking = this.action === 'duck';
    this.player.position.y = this.playerY;
    this.player.scale.y = ducking && this.grounded ? DUCK_SCALE : 1;

    // Infinite-scroll floor grid: shift by the run distance modulo one
    // cell, wrapping seamlessly instead of actually moving 100s of units.
    this.grid.position.z = this._gridBaseZ + (this.distance % this._gridSpacing);

    for (const pillar of this.pillars) {
      pillar.position.z += this.speed * dt;
      if (pillar.position.z > 6) pillar.position.z -= PILLAR_COUNT_PER_SIDE * PILLAR_SPACING;
    }

    this.spawnTimer -= dt;
    // Same lesson as Chord Racer's obstacle spacing: the floor here is a
    // wall-clock time budget, not a world-unit gap, so it stays fair
    // regardless of how fast the world is scrolling.
    const dynamicInterval = Math.max(this.obstacleGapSec, this.obstacleGapSec + 0.6 - this.elapsed * 0.008);
    if (this.spawnTimer <= 0) {
      this.spawnTimer = dynamicInterval;
      const type = Math.random() < 0.5 ? 'low' : 'high';
      const mesh = this._makeObstacleMesh(type);
      mesh.position.z = OBSTACLE_SPAWN_Z;
      this.scene.add(mesh);
      this.obstacles.push({ mesh, z: OBSTACLE_SPAWN_Z, type });
    }

    for (const ob of this.obstacles) {
      ob.z += this.speed * dt;
      ob.mesh.position.z = ob.z;
      const withinZ = Math.abs(ob.z - PLAYER_Z) < OBSTACLE_HALF_DEPTH + PLAYER_HALF_DEPTH;
      if (withinZ) {
        const safe = ob.type === 'low' ? !this.grounded : ducking;
        if (!safe) {
          this._gameOver();
          return;
        }
      }
    }

    const passed = this.obstacles.filter((o) => o.z > OBSTACLE_DESPAWN_Z);
    for (const ob of passed) {
      this.scene.remove(ob.mesh);
      ob.mesh.traverse((obj) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
    }
    this.obstacles = this.obstacles.filter((o) => o.z <= OBSTACLE_DESPAWN_Z);

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: Math.floor(this.distance / 10) } }));
  }

  _gameOver() {
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', { detail: { score: Math.floor(this.distance / 10), elapsedSeconds: this.elapsed } })
    );
  }
}
