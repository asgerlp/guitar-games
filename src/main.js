import './style.css';
import { AudioInputManager } from './audio/audioInputManager.js';
import { AudioChordDetector } from './chords/audioChordDetector.js';
import { ChordStore } from './chords/chordStore.js';
import { renderHome } from './views/home.js';
import { renderSettings } from './views/settings.js';
import { renderOnboarding, hasOnboarded } from './views/onboarding.js';
import { renderRacer } from './views/racerSetup.js';
import { renderFight } from './views/fightSetup.js';
import { renderHighScores } from './views/highScores.js';
import { renderFlap } from './views/flapSetup.js';
import { renderPong } from './views/pongSetup.js';
import { renderRun } from './views/runSetup.js';
import { renderSnake } from './views/snakeSetup.js';

const audio = new AudioInputManager();
const store = new ChordStore();
const detector = new AudioChordDetector();

detector.setLibrary(store.enabled());
store.addEventListener('change', () => detector.setLibrary(store.enabled()));

audio.addEventListener('chroma', (e) => detector.feed(e.detail));
audio.addEventListener('disconnected', () => detector.reset());

// Every view is reachable by key via navigate(); only NAV_ITEMS below get a
// permanent tab. Games and High Scores live as tiles on the Home screen —
// showing them again in top nav would just be the same links twice.
const VIEWS = {
  home: { render: renderHome },
  settings: { render: renderSettings },
  onboarding: { render: renderOnboarding },
  racer: { render: renderRacer },
  fight: { render: renderFight },
  flap: { render: renderFlap },
  pong: { render: renderPong },
  run: { render: renderRun },
  snake: { render: renderSnake },
  scores: { render: renderHighScores },
};

const NAV_ITEMS = [{ key: 'settings', label: 'Settings' }];

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <button class="brand-home" id="brand-home" type="button">🎸 <span class="pick">Chord</span> Games</button>
    <div class="status-cluster">
      <span id="input-status"><span class="dot"></span>Input: checking…</span>
      <span id="chord-badge" class="chord-badge">—</span>
    </div>
  </header>
  <nav class="tabs" id="tabs"></nav>
  <main id="main"></main>
`;

const tabsEl = document.getElementById('tabs');
const mainEl = document.getElementById('main');
const inputStatusEl = document.getElementById('input-status');
const chordBadgeEl = document.getElementById('chord-badge');
const brandHomeEl = document.getElementById('brand-home');

let currentCleanup = null;
let currentView = 'home';

function navigate(view, params) {
  if (currentCleanup) currentCleanup();
  currentView = view;
  [...tabsEl.children].forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  window.scrollTo(0, 0);
  currentCleanup = VIEWS[view].render(mainEl, ctx, params) || null;
}

const ctx = { audio, store, detector, audioDetector: detector, navigate };

for (const { key, label } of NAV_ITEMS) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.dataset.view = key;
  btn.addEventListener('click', () => navigate(key));
  tabsEl.appendChild(btn);
}

brandHomeEl.addEventListener('click', () => navigate('home'));

function setInputStatus(ok, text) {
  inputStatusEl.innerHTML = `<span class="dot ${ok ? 'ok' : ''}"></span>Input: ${text}`;
}

function updateInputStatus() {
  if (audio.currentDeviceId) {
    setInputStatus(true, `Audio — ${audio.currentDeviceLabel}`);
  } else {
    setInputStatus(false, audio.isSupported ? 'not connected' : 'unsupported in this browser');
  }
}

audio.addEventListener('connected', updateInputStatus);
audio.addEventListener('disconnected', updateInputStatus);

detector.addEventListener('chordchange', (e) => {
  const match = e.detail;
  chordBadgeEl.textContent = match ? `${match.name} (${Math.round(match.score * 100)}%)` : '—';
  chordBadgeEl.classList.toggle('active', !!match);
});

updateInputStatus();

navigate(hasOnboarded() ? 'home' : 'onboarding');

// Handy in the console for debugging while wiring up hardware.
window.__guitarGames = { audio, store, detector };
