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
      </div>
    </div>
  `;

  container.querySelector('#tile-racer').addEventListener('click', () => ctx.navigate('racer'));
  container.querySelector('#tile-fight').addEventListener('click', () => ctx.navigate('fight'));
}
