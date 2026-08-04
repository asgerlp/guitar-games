const PLAYER_MAX_HP = 100;
const CPU_MAX_HP = 100;
const CPU_TELEGRAPH_MS = 700; // how long the CPU "winds up" before an attack lands — your window to block
const CPU_ATTACK_MIN_INTERVAL = 1.1; // seconds, floor as the fight goes on
const CPU_ATTACK_MAX_INTERVAL = 2.6;
const CPU_DAMAGE_MIN = 8;
const CPU_DAMAGE_MAX = 15;

export const ACTION_DEFS = {
  attack: { label: 'Attack', damage: 12, cooldownSec: 0.5 },
  kick: { label: 'Kick', damage: 20, cooldownSec: 0.9 },
  special: { label: 'Special', damage: 32, cooldownSec: 1.8 },
  block: { label: 'Block', damage: 0, cooldownSec: 0 },
};

/** Which action each of 2-4 assigned chords maps to, in order. */
export function actionTypesForCount(count) {
  if (count <= 2) return ['attack', 'block'];
  if (count === 3) return ['attack', 'block', 'kick'];
  return ['attack', 'block', 'kick', 'special'];
}

/**
 * Canvas stick-figure fight against a CPU opponent. The CPU telegraphs each
 * attack briefly before it lands — hold the chord mapped to "Block" during
 * that window to negate it. Playing an attack-type chord deals damage,
 * gated by a short per-action cooldown so switching chords (not spamming
 * one) is what actually matters, same interaction model as Chord Racer.
 */
export class ChordFightGame extends EventTarget {
  constructor(canvas, { actionChordIds, actionTypes, detector, keyboardFallback = false }) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.actionChordIds = actionChordIds;
    this.actionTypes = actionTypes;
    this.detector = detector;
    this.keyboardFallback = keyboardFallback;

    this.playerHealth = PLAYER_MAX_HP;
    this.cpuHealth = CPU_MAX_HP;
    this.damageDealt = 0;
    this.currentAction = null;
    this.cooldownReadyAt = {};
    this.elapsed = 0;

    this.cpuState = 'idle'; // 'idle' | 'telegraph'
    this.cpuTelegraphElapsed = 0;
    this.pendingCpuDamage = 0;
    this.nextCpuAttackAt = this._randomCpuInterval();

    this.floaters = [];
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

  _randomCpuInterval() {
    const shrink = Math.min(CPU_ATTACK_MAX_INTERVAL - CPU_ATTACK_MIN_INTERVAL, this.elapsed * 0.008);
    const max = Math.max(CPU_ATTACK_MIN_INTERVAL + 0.3, CPU_ATTACK_MAX_INTERVAL - shrink);
    return this.elapsed + CPU_ATTACK_MIN_INTERVAL + Math.random() * (max - CPU_ATTACK_MIN_INTERVAL);
  }

  _handleChordChange(match) {
    if (!match) return;
    const idx = this.actionChordIds.indexOf(match.id);
    if (idx === -1) return;
    this._setAction(this.actionTypes[idx]);
  }

  _handleKeyDown(e) {
    const idx = { 1: 0, 2: 1, 3: 2, 4: 3 }[e.key];
    if (idx === undefined || idx >= this.actionTypes.length) return;
    this._setAction(this.actionTypes[idx]);
  }

  _setAction(actionType) {
    this.currentAction = actionType;
    if (actionType === 'block') return; // a held stance, not an instant action
    const def = ACTION_DEFS[actionType];
    if (!def) return;
    if (this.elapsed < (this.cooldownReadyAt[actionType] ?? 0)) return;
    this.cooldownReadyAt[actionType] = this.elapsed + def.cooldownSec;
    this.cpuHealth = Math.max(0, this.cpuHealth - def.damage);
    this.damageDealt += def.damage;
    this._addFloater(`-${def.damage}`, 'cpu', '#ff5c6c');
    if (this.cpuHealth <= 0) this._endGame('win');
  }

  _addFloater(text, side, color) {
    this.floaters.push({ text, side, color, life: 1 });
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

    for (const f of this.floaters) f.life -= dt * 1.2;
    this.floaters = this.floaters.filter((f) => f.life > 0);

    if (this.cpuState === 'idle') {
      if (this.elapsed >= this.nextCpuAttackAt) {
        this.cpuState = 'telegraph';
        this.cpuTelegraphElapsed = 0;
        this.pendingCpuDamage = CPU_DAMAGE_MIN + Math.random() * (CPU_DAMAGE_MAX - CPU_DAMAGE_MIN);
      }
    } else {
      this.cpuTelegraphElapsed += dt * 1000;
      if (this.cpuTelegraphElapsed >= CPU_TELEGRAPH_MS) {
        this._resolveCpuAttack();
        this.cpuState = 'idle';
        this.nextCpuAttackAt = this._randomCpuInterval();
      }
    }

    this.dispatchEvent(
      new CustomEvent('tick', { detail: { playerHealth: this.playerHealth, cpuHealth: this.cpuHealth } })
    );
  }

  _resolveCpuAttack() {
    if (this.currentAction === 'block') {
      this._addFloater('Blocked!', 'player', '#5ad1a8');
      return;
    }
    const damage = Math.round(this.pendingCpuDamage);
    this.playerHealth = Math.max(0, this.playerHealth - damage);
    this._addFloater(`-${damage}`, 'player', '#ff5c6c');
    if (this.playerHealth <= 0) this._endGame('lose');
  }

  _endGame(result) {
    this.stop();
    this.dispatchEvent(
      new CustomEvent('gameover', {
        detail: { result, elapsedSeconds: this.elapsed, score: Math.round(this.damageDealt) },
      })
    );
  }

  _draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const groundY = canvas.height - 70;
    const playerX = canvas.width * 0.28;
    const cpuX = canvas.width * 0.72;

    ctx.strokeStyle = '#2e3850';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, groundY + 4);
    ctx.lineTo(canvas.width - 20, groundY + 4);
    ctx.stroke();

    this._drawHealthBar(20, canvas.width / 2 - 30, this.playerHealth, PLAYER_MAX_HP, 'You', '#5ad1a8');
    this._drawHealthBar(canvas.width / 2 + 10, canvas.width / 2 - 30, this.cpuHealth, CPU_MAX_HP, 'CPU', '#ff5c6c');

    this._drawStickFigure(playerX, groundY, {
      color: '#5ad1a8',
      pose: this.currentAction ?? 'idle',
      facing: 1,
    });

    const cpuFlash = this.cpuState === 'telegraph' && Math.floor(this.cpuTelegraphElapsed / 100) % 2 === 0;
    this._drawStickFigure(cpuX, groundY, {
      color: cpuFlash ? '#fff6d8' : '#ff5c6c',
      pose: this.cpuState === 'telegraph' ? 'telegraph' : 'idle',
      facing: -1,
    });

    ctx.textAlign = 'center';
    ctx.font = 'bold 16px monospace';
    for (const f of this.floaters) {
      const x = f.side === 'player' ? playerX : cpuX;
      const y = groundY - 130 - (1 - f.life) * 40;
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, x, y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  _drawHealthBar(x, width, health, maxHealth, label, color) {
    const ctx = this.ctx;
    const y = 14;
    const h = 18;
    ctx.fillStyle = '#222b40';
    ctx.fillRect(x, y, width, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * Math.max(0, health / maxHealth), h);
    ctx.strokeStyle = '#2e3850';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, h);
    ctx.fillStyle = '#eef1f8';
    ctx.font = '12px monospace';
    ctx.fillText(`${label} ${Math.max(0, Math.round(health))}`, x, y - 4);
  }

  /** Simple top-down-free stick figure: circle head, line torso/limbs, pose-dependent arms/legs. */
  _drawStickFigure(x, groundY, { color, pose, facing }) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, 0);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    const headR = 14;
    const hipY = groundY - 10;
    const shoulderY = hipY - 60;
    const headY = shoulderY - headR - 4;

    ctx.beginPath();
    if (pose === 'kick') {
      ctx.moveTo(0, hipY);
      ctx.lineTo(-facing * 10, groundY);
      ctx.moveTo(0, hipY);
      ctx.lineTo(facing * 42, hipY - 6);
    } else {
      ctx.moveTo(0, hipY);
      ctx.lineTo(-14, groundY);
      ctx.moveTo(0, hipY);
      ctx.lineTo(14, groundY);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(0, shoulderY);
    ctx.stroke();

    ctx.beginPath();
    if (pose === 'block') {
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(facing * 22, shoulderY - 18);
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(facing * 22, shoulderY - 2);
    } else if (pose === 'attack' || pose === 'special') {
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(facing * 38, shoulderY - 4);
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(-facing * 14, shoulderY + 16);
    } else if (pose === 'telegraph') {
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(facing * 8, shoulderY - 32);
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(-facing * 8, shoulderY + 8);
    } else {
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(facing * 14, shoulderY + 20);
      ctx.moveTo(0, shoulderY);
      ctx.lineTo(-facing * 14, shoulderY + 20);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
