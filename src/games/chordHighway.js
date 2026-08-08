import * as THREE from 'three';
import { levelT, lerp } from './difficultyLevels.js';

const LANE_WIDTH = 1.6;
const NOTE_SPAWN_Z = -42;
const HIT_ZONE_Z = 0;
const HIT_WINDOW = 1.3;
const DESPAWN_Z = 3;
const TOTAL_NOTES = 40;
const MAX_HEALTH = 100;
const LANE_COLORS = [0x26e0ff, 0xff2ec4, 0x39ff88, 0xffe14d, 0xffa552];

const DEFAULT_NOTE_SPEED = 11;
const DEFAULT_SPAWN_GAP = 1.1;
const DEFAULT_MISS_PENALTY = 16;

/** Maps a 6-tier difficulty level to Chord Highway's note pace. */
export function highwayParamsForLevel(level) {
  const t = levelT(level);
  return {
    noteSpeed: lerp(7, 17, t),
    spawnGapSec: lerp(1.5, 0.55, t),
    missPenalty: lerp(10, 24, t),
  };
}

/**
 * Original 3D rhythm game: notes fall down one of several lanes toward a
 * hit line near the camera, each lane tied to a real chord you assigned it.
 * Unlike every other game here, this one doesn't map chords to discrete
 * actions — it asks you to actually be holding the right chord at the right
 * moment, same as a real song. A note is judged the instant it's inside the
 * hit window: currently-matched chord equal to that lane's chord scores a
 * hit and grows the combo; anything else lets it pass as a miss, resetting
 * the combo and costing health. Health hitting zero, or clearing the fixed
 * note count, ends the run.
 */
export class ChordHighwayGame extends EventTarget {
  constructor(
    canvas,
    {
      laneChordIds,
      detector,
      keyboardFallback = false,
      noteSpeed = DEFAULT_NOTE_SPEED,
      spawnGapSec = DEFAULT_SPAWN_GAP,
      missPenalty = DEFAULT_MISS_PENALTY,
    }
  ) {
    super();
    this.canvas = canvas;
    this.laneChordIds = laneChordIds;
    this.laneCount = laneChordIds.length;
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.noteSpeed = noteSpeed;
    this.spawnGapSec = spawnGapSec;
    this.missPenalty = missPenalty;

    this.currentMatchId = null;
    this.keysDown = new Set();
    this.notes = [];
    this.spawnTimer = 0.6;
    this.notesSpawned = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.health = MAX_HEALTH;
    this.elapsed = 0;
    this.running = false;
    this.ended = false;

    this._initScene();

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKey(e, true);
    this._onKeyUp = (e) => this._handleKey(e, false);
  }

  _highwayWidth() {
    return this.laneCount * LANE_WIDTH;
  }

  _laneX(idx) {
    const w = this._highwayWidth();
    return -w / 2 + LANE_WIDTH * idx + LANE_WIDTH / 2;
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
    this.scene.fog = new THREE.Fog(bg, 14, 48);

    this.camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 100);
    this.camera.position.set(0, 4.2, 7.5);
    this.camera.lookAt(0, 0, -14);

    const w = this._highwayWidth();
    const highway = new THREE.Mesh(
      new THREE.PlaneGeometry(w, 60),
      new THREE.MeshBasicMaterial({ color: 0x140a28 })
    );
    highway.rotation.x = -Math.PI / 2;
    highway.position.set(0, 0, -18);
    this.scene.add(highway);

    for (let i = 0; i <= this.laneCount; i++) {
      const x = -w / 2 + LANE_WIDTH * i;
      const divider = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.02, 60),
        new THREE.MeshBasicMaterial({ color: 0x6b3fa0 })
      );
      divider.position.set(x, 0.01, -18);
      this.scene.add(divider);
    }

    this.hitZone = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.05, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
    );
    this.hitZone.position.set(0, 0.03, HIT_ZONE_Z);
    this.scene.add(this.hitZone);

    this.laneGlows = [];
    for (let i = 0; i < this.laneCount; i++) {
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(LANE_WIDTH * 0.9, 0.7),
        new THREE.MeshBasicMaterial({ color: LANE_COLORS[i % LANE_COLORS.length], transparent: true, opacity: 0 })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(this._laneX(i), 0.02, HIT_ZONE_Z);
      this.scene.add(glow);
      this.laneGlows.push(glow);
    }
  }

  _makeNoteMesh(laneIdx) {
    const color = LANE_COLORS[laneIdx % LANE_COLORS.length];
    const group = new THREE.Group();
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshBasicMaterial({ color }));
    group.add(gem);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(gem.geometry), new THREE.LineBasicMaterial({ color: 0xffffff }));
    group.add(edges);
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

  _handleChordChange(match) {
    this.currentMatchId = match?.id ?? null;
  }

  _handleKey(e, isDown) {
    const idx = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 }[e.key];
    if (idx === undefined || idx >= this.laneCount) return;
    if (isDown) this.keysDown.add(idx);
    else this.keysDown.delete(idx);
    const active = [...this.keysDown][0];
    this.currentMatchId = active !== undefined ? this.laneChordIds[active] : null;
  }

  _loop(time) {
    if (!this.running) return;
    const dt = Math.min((time - this._lastTime) / 1000, 0.05);
    this._lastTime = time;
    this._update(dt);
    if (!this.running) return;
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    if (this.ended) return;
    this.elapsed += dt;

    for (const glow of this.laneGlows) {
      glow.material.opacity = Math.max(0, glow.material.opacity - dt * 3);
    }

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.notesSpawned < TOTAL_NOTES) {
      this.spawnTimer = this.spawnGapSec;
      const laneIdx = Math.floor(Math.random() * this.laneCount);
      const mesh = this._makeNoteMesh(laneIdx);
      mesh.position.set(this._laneX(laneIdx), 0.5, NOTE_SPAWN_Z);
      this.scene.add(mesh);
      this.notes.push({ mesh, laneIdx, z: NOTE_SPAWN_Z, judged: false });
      this.notesSpawned += 1;
    }

    for (const note of this.notes) {
      note.z += this.noteSpeed * dt;
      note.mesh.position.z = note.z;
      note.mesh.rotation.y += dt * 2;

      if (!note.judged && note.z >= HIT_ZONE_Z - HIT_WINDOW && note.z <= HIT_ZONE_Z + HIT_WINDOW) {
        if (this.currentMatchId === this.laneChordIds[note.laneIdx]) {
          note.judged = true;
          this.combo += 1;
          this.maxCombo = Math.max(this.maxCombo, this.combo);
          this.hits += 1;
          this.score += 100 * Math.min(8, 1 + Math.floor(this.combo / 5));
          this.health = Math.min(MAX_HEALTH, this.health + 1.5);
          this.laneGlows[note.laneIdx].material.opacity = 0.55;
        }
      } else if (!note.judged && note.z > HIT_ZONE_Z + HIT_WINDOW) {
        note.judged = true;
        this.combo = 0;
        this.misses += 1;
        this.health -= this.missPenalty;
      }
    }

    const passed = this.notes.filter((n) => n.z > DESPAWN_Z);
    for (const n of passed) {
      this.scene.remove(n.mesh);
      n.mesh.traverse((obj) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
    }
    this.notes = this.notes.filter((n) => n.z <= DESPAWN_Z);

    if (this.health <= 0) {
      this.health = 0;
      this._endGame();
      return;
    }
    if (this.notesSpawned >= TOTAL_NOTES && this.notes.length === 0) {
      this.score += 500;
      this._endGame();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('tick', { detail: { score: this.score, combo: this.combo, health: this.health } })
    );
  }

  _endGame() {
    this.ended = true;
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', {
        detail: { score: this.score, elapsedSeconds: this.elapsed, hits: this.hits, misses: this.misses, maxCombo: this.maxCombo },
      })
    );
  }
}
