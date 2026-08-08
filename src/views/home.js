export function renderHome(container, ctx) {
  const { t } = ctx;

  container.innerHTML = `
    <div class="card">
      <h2>${t('home.welcomeTitle')}</h2>
      <p class="hint">${t('home.welcomeBody')}</p>
    </div>
    <div class="card">
      <h2>${t('home.gamesTitle')}</h2>
      <div class="game-select-grid">
        <button class="game-tile" id="tile-racer">
          <h3>🏎️ Chord Racer</h3>
          <p>${t('home.racerDesc')}</p>
        </button>
        <button class="game-tile" id="tile-fight">
          <h3>🥋 Chord Fight</h3>
          <p>${t('home.fightDesc')}</p>
        </button>
        <button class="game-tile" id="tile-flap">
          <h3>🐦 Chord Flap</h3>
          <p>${t('home.flapDesc')}</p>
        </button>
        <button class="game-tile" id="tile-pong">
          <h3>🏓 Chord Pong</h3>
          <p>${t('home.pongDesc')}</p>
        </button>
        <button class="game-tile" id="tile-run">
          <h3>🏃 Chord Run</h3>
          <p>${t('home.runDesc')}</p>
        </button>
        <button class="game-tile" id="tile-snake">
          <h3>🐍 Chord Snake</h3>
          <p>${t('home.snakeDesc')}</p>
        </button>
        <button class="game-tile" id="tile-stack">
          <h3>🧱 Chord Stack</h3>
          <p>${t('home.stackDesc')}</p>
        </button>
        <button class="game-tile" id="tile-chomp">
          <h3>👾 Chord Chomp</h3>
          <p>${t('home.chompDesc')}</p>
        </button>
        <button class="game-tile" id="tile-hopper">
          <h3>🐸 Chord Hopper</h3>
          <p>${t('home.hopperDesc')}</p>
        </button>
        <button class="game-tile" id="tile-highway">
          <h3>🎶 Chord Highway</h3>
          <p>${t('home.highwayDesc')}</p>
        </button>
        <button class="game-tile" id="tile-blocks">
          <h3>🧊 Chord Blocks</h3>
          <p>${t('home.blocksDesc')}</p>
        </button>
        <button class="game-tile" id="tile-scores">
          <h3>🏆 ${t('home.highScoresTitle')}</h3>
          <p>${t('home.highScoresDesc')}</p>
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
  container.querySelector('#tile-stack').addEventListener('click', () => ctx.navigate('stack'));
  container.querySelector('#tile-chomp').addEventListener('click', () => ctx.navigate('chomp'));
  container.querySelector('#tile-hopper').addEventListener('click', () => ctx.navigate('hopper'));
  container.querySelector('#tile-highway').addEventListener('click', () => ctx.navigate('highway'));
  container.querySelector('#tile-blocks').addEventListener('click', () => ctx.navigate('blocks'));
  container.querySelector('#tile-scores').addEventListener('click', () => ctx.navigate('scores'));
}
