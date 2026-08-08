export function renderHome(container, ctx) {
  container.innerHTML = `
    <div class="card">
      <h2>Welcome</h2>
      <p class="hint">
        Connect your guitar's USB audio interface/pedal and it'll show up under
        <strong>Audio Setup</strong> — pick it there (not your laptop's built-in mic) and chord
        recognition runs on that signal directly. Head to <strong>Chord Library</strong> to see or
        customize which chords are recognized, then pick a game below.
      </p>
    </div>
    <div class="card">
      <h2>Games</h2>
      <div class="game-select-grid">
        <button class="game-tile" id="tile-racer">
          <h3>🏎️ Chord Racer</h3>
          <p>Steer between lanes by switching chords. Dodge obstacles. Speed ramps up over time.</p>
        </button>
        <button class="game-tile" id="tile-fight">
          <h3>🥋 Chord Fight</h3>
          <p>Face off against the CPU. Block its telegraphed attacks and hit back with different chords.</p>
        </button>
        <button class="game-tile" id="tile-flap">
          <h3>🐦 Chord Flap</h3>
          <p>Hold the active chord to rise and dodge pipes — it keeps rotating, so one shape won't carry you.</p>
        </button>
        <button class="game-tile" id="tile-pong">
          <h3>🏓 Chord Pong</h3>
          <p>Hold one chord to slide the paddle left, another to slide right — keep the ball in play.</p>
        </button>
        <button class="game-tile" id="tile-run">
          <h3>🏃 Chord Run</h3>
          <p>Jump logs and duck beams with two chords. Hold jump to keep hopping, hold duck to slide under.</p>
        </button>
        <button class="game-tile" id="tile-snake">
          <h3>🐍 Chord Snake</h3>
          <p>Four chords steer up/down/left/right. Classic snake — eat food, don't hit yourself or a wall.</p>
        </button>
        <button class="game-tile" id="tile-scores">
          <h3>🏆 High Scores</h3>
          <p>See the top 10 for each game. Land a top-10 run and you'll be asked for your name.</p>
        </button>
      </div>
    </div>
  `;

  container.querySelector('#tile-racer').addEventListener('click', () => ctx.navigate('racer'));
  container.querySelector('#tile-fight').addEventListener('click', () => ctx.navigate('fight'));
  container.querySelector('#tile-flap').addEventListener('click', () => ctx.navigate('flap'));
  container.querySelector('#tile-pong').addEventListener('click', () => ctx.navigate('pong'));
  container.querySelector('#tile-run').addEventListener('click', () => ctx.navigate('run'));
  container.querySelector('#tile-snake').addEventListener('click', () => ctx.navigate('snake'));
  container.querySelector('#tile-scores').addEventListener('click', () => ctx.navigate('scores'));
}
