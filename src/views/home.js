export function renderHome(container, ctx) {
  container.innerHTML = `
    <div class="card">
      <h2>Welcome</h2>
      <p class="hint">
        Connect your GP-50 (via a MIDI interface into your Mac) and it'll show up under
        <strong>MIDI Setup</strong>. Chord recognition works from the actual MIDI notes your
        gear sends — no microphone involved. Head to <strong>Chord Library</strong> to see or
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
      </div>
    </div>
  `;

  container.querySelector('#tile-racer').addEventListener('click', () => ctx.navigate('racer'));
}
