import * as THREE from 'three';
import { levelT, lerp } from './difficultyLevels.js';

const WORLD_SIZE = 20;
const STEP_HEIGHT = 1.05;
const EYE_HEIGHT = 1.6;
const GRAVITY = 18;
const TREE_COUNT = 14;

const BLOCK_TYPES = ['grass', 'dirt', 'stone', 'wood', 'leaves'];
const BLOCK_COLORS = {
  grass: 0x3f8a52,
  dirt: 0x6b4a2a,
  stone: 0x8b8f9c,
  wood: 0x7a5230,
  leaves: 0x2e6b3e,
};

const DEFAULT_SESSION_SECONDS = 100;
const DEFAULT_WALK_SPEED = 3.4;
const DEFAULT_TURN_SPEED = 2.2;
const DEFAULT_JUMP_IMPULSE = 6.5;

/** Maps a 6-tier difficulty level to Chord Blocks' session length and pace. */
export function blocksParamsForLevel(level) {
  const t = levelT(level);
  return {
    sessionSeconds: lerp(150, 70, t),
    walkSpeed: lerp(3, 4.2, t),
    turnSpeed: lerp(1.8, 2.8, t),
  };
}

function key(x, y, z) {
  return `${x},${y},${z}`;
}

function heightAt(x, z) {
  const h = 3 + Math.sin(x * 0.35) * 1.4 + Math.cos(z * 0.32) * 1.4 + Math.sin((x + z) * 0.18) * 0.8;
  return Math.max(1, Math.round(h));
}

/**
 * Original voxel-building sandbox, inspired by (but not a clone of) the
 * genre — its own name and block art, no borrowed assets. Three chords
 * steer it tank-style: Forward walks in whichever way you're facing, Turn
 * Left/Turn Right rotate that facing (camera yaw doubles as movement
 * facing, so no mouse-look is needed), and a fourth triggers a jump.
 * Left-click breaks whatever block is dead ahead; right-click places the
 * currently-selected block type against that same target. Score is total
 * blocks placed before the timer runs out.
 */
export class ChordBlocksGame extends EventTarget {
  constructor(
    canvas,
    {
      chordIds,
      detector,
      keyboardFallback = false,
      sessionSeconds = DEFAULT_SESSION_SECONDS,
      walkSpeed = DEFAULT_WALK_SPEED,
      turnSpeed = DEFAULT_TURN_SPEED,
      jumpImpulse = DEFAULT_JUMP_IMPULSE,
    }
  ) {
    super();
    this.canvas = canvas;
    this.chordIds = chordIds; // [forwardId, turnLeftId, turnRightId, jumpId]
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;
    this.sessionSeconds = sessionSeconds;
    this.walkSpeed = walkSpeed;
    this.turnSpeed = turnSpeed;
    this.jumpImpulse = jumpImpulse;

    this.blocks = new Map();
    this.columnTop = Array.from({ length: WORLD_SIZE }, () => Array(WORLD_SIZE).fill(1));
    this._generateWorld();

    this.placeType = 'grass';
    this.yaw = Math.PI;
    this.player = { x: WORLD_SIZE / 2, z: WORLD_SIZE / 2, y: 0, vy: 0, grounded: true };
    this.player.y = this.columnTop[Math.floor(this.player.x)][Math.floor(this.player.z)];

    this.action = null;
    this.lastMatchId = null;
    this.keysDown = new Set();
    this.placed = 0;
    this.score = 0;
    this.timeLeft = sessionSeconds;
    this.elapsed = 0;
    this.running = false;
    this.ended = false;

    this._initScene();
    this._rebuildBlockMeshes();

    this._onChordChange = (e) => this._handleChordChange(e.detail);
    this._onKeyDown = (e) => this._handleKey(e, true);
    this._onKeyUp = (e) => this._handleKey(e, false);
    this._onMouseDown = (e) => this._handleMouseDown(e);
    this._onContextMenu = (e) => e.preventDefault();
  }

  _generateWorld() {
    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        const h = heightAt(x, z);
        for (let y = 0; y < h; y++) {
          this.blocks.set(key(x, y, z), y === h - 1 ? 'grass' : 'dirt');
        }
        this.columnTop[x][z] = h;
      }
    }

    let planted = 0;
    let attempts = 0;
    while (planted < TREE_COUNT && attempts < TREE_COUNT * 20) {
      attempts += 1;
      const x = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      const z = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      const h = this.columnTop[x][z];
      if (this.blocks.get(key(x, h - 1, z)) !== 'grass') continue;
      for (let ty = 0; ty < 3; ty++) this.blocks.set(key(x, h + ty, z), 'wood');
      for (let lx = -1; lx <= 1; lx++) {
        for (let lz = -1; lz <= 1; lz++) {
          for (let ly = 0; ly < 2; ly++) {
            this.blocks.set(key(x + lx, h + 3 + ly, z + lz), 'leaves');
          }
        }
      }
      this.columnTop[x][z] = h + 5;
      planted += 1;
    }
  }

  _recomputeColumnTop(x, z) {
    let top = 0;
    for (let y = 0; y < 64; y++) {
      if (this.blocks.has(key(x, y, z))) top = y + 1;
    }
    this.columnTop[x][z] = Math.max(top, 0);
  }

  _initScene() {
    const { canvas } = this;
    const bg = new THREE.Color('#0d1a3d');

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(canvas.width, canvas.height, false);
    this.renderer.setClearColor(bg, 1);

    this.scene = new THREE.Scene();
    this.scene.background = bg;
    this.scene.fog = new THREE.Fog(bg, 10, 34);

    this.camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.05, 60);

    this.raycaster = new THREE.Raycaster();
    this.instancedMeshes = [];
  }

  _rebuildBlockMeshes() {
    for (const mesh of this.instancedMeshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.instancedMeshes = [];
    this.typeCoords = {};

    const byType = {};
    for (const type of BLOCK_TYPES) byType[type] = [];
    for (const [k, type] of this.blocks) {
      const [x, y, z] = k.split(',').map(Number);
      byType[type]?.push([x, y, z]);
    }

    const geo = new THREE.BoxGeometry(1, 1, 1);
    for (const type of BLOCK_TYPES) {
      const coords = byType[type];
      if (coords.length === 0) continue;
      const mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: BLOCK_COLORS[type] }), coords.length);
      mesh.userData.type = type;
      const m = new THREE.Matrix4();
      coords.forEach(([x, y, z], i) => {
        m.makeTranslation(x + 0.5, y + 0.5, z + 0.5);
        mesh.setMatrixAt(i, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
      this.scene.add(mesh);
      this.instancedMeshes.push(mesh);
      this.typeCoords[type] = coords;
    }
  }

  start() {
    this.running = true;
    this.detector.addEventListener('chordchange', this._onChordChange);
    if (this.keyboardFallback) {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    }
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('contextmenu', this._onContextMenu);
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
    this.canvas.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.removeEventListener('contextmenu', this._onContextMenu);
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

  setPlaceType(type) {
    if (BLOCK_TYPES.includes(type)) this.placeType = type;
  }

  _handleChordChange(match) {
    const idx = match ? this.chordIds.indexOf(match.id) : -1;
    this.action = idx === 0 ? 'forward' : idx === 1 ? 'turnLeft' : idx === 2 ? 'turnRight' : null;
    if (idx === 3 && match.id !== this.lastMatchId) this._jump();
    this.lastMatchId = match?.id ?? null;
  }

  _handleKey(e, isDown) {
    const idx = { ArrowUp: 0, ArrowLeft: 1, ArrowRight: 2, Space: 3 }[e.code];
    if (idx === undefined) return;
    if (isDown) this.keysDown.add(idx);
    else this.keysDown.delete(idx);
    if (idx === 3 && isDown) this._jump();
    this.action = this.keysDown.has(0) ? 'forward' : this.keysDown.has(1) ? 'turnLeft' : this.keysDown.has(2) ? 'turnRight' : null;
  }

  _jump() {
    if (this.player.grounded) {
      this.player.vy = this.jumpImpulse;
      this.player.grounded = false;
    }
  }

  _targetedBlock() {
    this.raycaster.set(this.camera.position, this.camera.getWorldDirection(new THREE.Vector3()));
    const hits = this.raycaster.intersectObjects(this.instancedMeshes, false);
    if (hits.length === 0 || hits[0].distance > 6) return null;
    const hit = hits[0];
    const type = hit.object.userData.type;
    const coord = this.typeCoords[type][hit.instanceId];
    const normal = hit.face.normal.clone().round();
    return { coord, type, normal };
  }

  _handleMouseDown(e) {
    if (this.ended) return;
    const target = this._targetedBlock();
    if (!target) return;
    if (e.button === 0) this._breakBlock(target);
    else if (e.button === 2) this._placeBlock(target);
  }

  _breakBlock(target) {
    const [x, y, z] = target.coord;
    this.blocks.delete(key(x, y, z));
    this._recomputeColumnTop(x, z);
    this._rebuildBlockMeshes();
  }

  _placeBlock(target) {
    const [x, y, z] = target.coord;
    const nx = x + target.normal.x;
    const ny = y + target.normal.y;
    const nz = z + target.normal.z;
    if (nx < 0 || nx >= WORLD_SIZE || nz < 0 || nz >= WORLD_SIZE || ny < 0 || ny > 40) return;
    if (this.blocks.has(key(nx, ny, nz))) return;
    this.blocks.set(key(nx, ny, nz), this.placeType);
    this._recomputeColumnTop(nx, nz);
    this._rebuildBlockMeshes();
    this.placed += 1;
    this.score += 10;
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
    this.timeLeft = Math.max(0, this.timeLeft - dt);

    if (this.action === 'turnLeft') this.yaw += this.turnSpeed * dt;
    else if (this.action === 'turnRight') this.yaw -= this.turnSpeed * dt;
    else if (this.action === 'forward') {
      const dx = Math.sin(this.yaw) * this.walkSpeed * dt;
      const dz = Math.cos(this.yaw) * this.walkSpeed * dt;
      const curCol = [Math.floor(this.player.x), Math.floor(this.player.z)];
      const nx = Math.min(WORLD_SIZE - 0.51, Math.max(0.5, this.player.x + dx));
      const nz = Math.min(WORLD_SIZE - 0.51, Math.max(0.5, this.player.z + dz));
      const targetCol = [Math.floor(nx), Math.floor(nz)];
      const curTop = this.columnTop[curCol[0]][curCol[1]];
      const targetTop = this.columnTop[targetCol[0]][targetCol[1]];
      if (Math.abs(targetTop - curTop) <= STEP_HEIGHT || this.player.y > curTop + 0.1) {
        this.player.x = nx;
        this.player.z = nz;
      }
    }

    const groundY = this.columnTop[Math.floor(this.player.x)][Math.floor(this.player.z)];
    this.player.vy -= GRAVITY * dt;
    this.player.y += this.player.vy * dt;
    if (this.player.y <= groundY) {
      this.player.y = groundY;
      this.player.vy = 0;
      this.player.grounded = true;
    } else {
      this.player.grounded = false;
    }

    this.camera.position.set(this.player.x, this.player.y + EYE_HEIGHT, this.player.z);
    const lookX = this.player.x + Math.sin(this.yaw);
    const lookZ = this.player.z + Math.cos(this.yaw);
    this.camera.lookAt(lookX, this.player.y + EYE_HEIGHT - 0.15, lookZ);

    if (this.timeLeft <= 0) {
      this._endGame();
      return;
    }

    this.dispatchEvent(new CustomEvent('tick', { detail: { score: this.score, timeLeft: this.timeLeft, placeType: this.placeType } }));
  }

  _endGame() {
    this.ended = true;
    this.stop();
    this.dispatchEvent(new CustomEvent('gameover', { detail: { score: this.score, elapsedSeconds: this.elapsed } }));
  }
}

export { BLOCK_TYPES };
