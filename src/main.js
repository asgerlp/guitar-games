import './style.css';
import { MidiManager } from './midi/midiManager.js';
import { ChordDetector } from './chords/chordDetector.js';
import { ChordStore } from './chords/chordStore.js';
import { midiToName } from './chords/noteUtils.js';
import { renderHome } from './views/home.js';
import { renderMidiSetup } from './views/midiSetup.js';
import { renderLibrary } from './views/library.js';
import { renderRacer } from './views/racerSetup.js';

const midi = new MidiManager();
const store = new ChordStore();
const detector = new ChordDetector();
detector.setLibrary(store.enabled());
store.addEventListener('change', () => detector.setLibrary(store.enabled()));

midi.addEventListener('noteon', (e) => detector.noteOn(e.detail.note));
midi.addEventListener('noteoff', (e) => detector.noteOff(e.detail.note));
midi.addEventListener('disconnected', () => detector.reset());

const VIEWS = {
  home: { label: 'Home', render: renderHome },
  midi: { label: 'MIDI Setup', render: renderMidiSetup },
  library: { label: 'Chord Library', render: renderLibrary },
  racer: { label: 'Chord Racer', render: renderRacer },
};

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <h1>🎸 <span class="pick">Chord</span> Games</h1>
    <div class="status-cluster">
      <span id="midi-status"><span class="dot"></span>MIDI: checking…</span>
      <span id="chord-badge" class="chord-badge">—</span>
    </div>
  </header>
  <nav class="tabs" id="tabs"></nav>
  <main id="main"></main>
`;

const tabsEl = document.getElementById('tabs');
const mainEl = document.getElementById('main');
const midiStatusEl = document.getElementById('midi-status');
const chordBadgeEl = document.getElementById('chord-badge');

let currentCleanup = null;
let currentView = 'home';

function navigate(view, params) {
  if (currentCleanup) currentCleanup();
  currentView = view;
  [...tabsEl.children].forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  currentCleanup = VIEWS[view].render(mainEl, ctx, params) || null;
}

const ctx = { midi, store, detector, navigate };

for (const [key, def] of Object.entries(VIEWS)) {
  const btn = document.createElement('button');
  btn.textContent = def.label;
  btn.dataset.view = key;
  btn.addEventListener('click', () => navigate(key));
  tabsEl.appendChild(btn);
}

function setMidiStatus(ok, text) {
  midiStatusEl.innerHTML = `<span class="dot ${ok ? 'ok' : ''}"></span>MIDI: ${text}`;
}

midi.addEventListener('connected', (e) => setMidiStatus(true, `connected (${e.detail.name})`));
midi.addEventListener('disconnected', () => setMidiStatus(false, 'disconnected'));
midi.addEventListener('unsupported', () => setMidiStatus(false, 'unsupported in this browser'));
midi.addEventListener('deviceschanged', () => {
  if (!midi.currentInput) setMidiStatus(false, midi.listInputs().length ? 'not selected' : 'no devices found');
});

detector.addEventListener('chordchange', (e) => {
  const match = e.detail;
  chordBadgeEl.textContent = match ? `${match.name} (${Math.round(match.score * 100)}%)` : '—';
  chordBadgeEl.classList.toggle('active', !!match);
});

setMidiStatus(false, midi.isSupported ? 'not connected' : 'unsupported in this browser');
midi.init();

navigate('home');

// Handy in the console for verifying note numbers while wiring up the GP-50.
window.__guitarGames = { midi, store, detector, midiToName };
