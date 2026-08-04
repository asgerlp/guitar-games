import './style.css';
import { AudioInputManager } from './audio/audioInputManager.js';
import { AudioChordDetector } from './chords/audioChordDetector.js';
import { ChordStore } from './chords/chordStore.js';
import { renderHome } from './views/home.js';
import { renderAudioSetup } from './views/audioSetup.js';
import { renderLibrary } from './views/library.js';
import { renderRacer } from './views/racerSetup.js';
import { renderFight } from './views/fightSetup.js';
import { renderHighScores } from './views/highScores.js';

const audio = new AudioInputManager();
const store = new ChordStore();
const detector = new AudioChordDetector();

detector.setLibrary(store.enabled());
store.addEventListener('change', () => detector.setLibrary(store.enabled()));

audio.addEventListener('chroma', (e) => detector.feed(e.detail));
audio.addEventListener('disconnected', () => detector.reset());

const VIEWS = {
  home: { label: 'Home', render: renderHome },
  audio: { label: 'Audio Setup', render: renderAudioSetup },
  library: { label: 'Chord Library', render: renderLibrary },
  racer: { label: 'Chord Racer', render: renderRacer },
  fight: { label: 'Chord Fight', render: renderFight },
  scores: { label: 'High Scores', render: renderHighScores },
};

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <h1>🎸 <span class="pick">Chord</span> Games</h1>
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

let currentCleanup = null;
let currentView = 'home';

function navigate(view, params) {
  if (currentCleanup) currentCleanup();
  currentView = view;
  [...tabsEl.children].forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  currentCleanup = VIEWS[view].render(mainEl, ctx, params) || null;
}

const ctx = { audio, store, detector, audioDetector: detector, navigate };

for (const [key, def] of Object.entries(VIEWS)) {
  const btn = document.createElement('button');
  btn.textContent = def.label;
  btn.dataset.view = key;
  btn.addEventListener('click', () => navigate(key));
  tabsEl.appendChild(btn);
}

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

navigate('home');

// Handy in the console for debugging while wiring up hardware.
window.__guitarGames = { audio, store, detector };
