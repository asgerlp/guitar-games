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
  container.querySelector('#tile-scores').addEventListener('click', () => ctx.navigate('scores'));
}
