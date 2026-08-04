import './style.css';
import { MidiManager } from './midi/midiManager.js';
import { AudioInputManager } from './audio/audioInputManager.js';
import { ChordDetector } from './chords/chordDetector.js';
import { AudioChordDetector } from './chords/audioChordDetector.js';
import { InputRouter } from './chords/inputRouter.js';
import { ChordStore } from './chords/chordStore.js';
import { midiToName } from './chords/noteUtils.js';
import { renderHome } from './views/home.js';
import { renderMidiSetup } from './views/midiSetup.js';
import { renderAudioSetup } from './views/audioSetup.js';
import { renderLibrary } from './views/library.js';
import { renderRacer } from './views/racerSetup.js';

const midi = new MidiManager();
const audio = new AudioInputManager();
const store = new ChordStore();

const midiDetector = new ChordDetector();
const audioDetector = new AudioChordDetector();
const detector = new InputRouter();

function refreshLibraries() {
  midiDetector.setLibrary(store.enabled());
  audioDetector.setLibrary(store.enabled());
}
refreshLibraries();
store.addEventListener('change', refreshLibraries);

midi.addEventListener('noteon', (e) => midiDetector.noteOn(e.detail.note));
midi.addEventListener('noteoff', (e) => midiDetector.noteOff(e.detail.note));
midi.addEventListener('disconnected', () => midiDetector.reset());
midi.addEventListener('connected', () => detector.setActiveSource('midi'));

audio.addEventListener('chroma', (e) => audioDetector.feed(e.detail));
audio.addEventListener('disconnected', () => audioDetector.reset());
audio.addEventListener('connected', () => detector.setActiveSource('audio'));

midiDetector.addEventListener('chordchange', (e) => detector.reportChordChange('midi', e.detail));
audioDetector.addEventListener('chordchange', (e) => detector.reportChordChange('audio', e.detail));

const VIEWS = {
  home: { label: 'Home', render: renderHome },
  midi: { label: 'MIDI Setup', render: renderMidiSetup },
  audio: { label: 'Audio Setup', render: renderAudioSetup },
  library: { label: 'Chord Library', render: renderLibrary },
  racer: { label: 'Chord Racer', render: renderRacer },
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

const ctx = { midi, audio, store, midiDetector, audioDetector, detector, navigate };

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
  if (detector.activeSource === 'midi' && midi.currentInput) {
    setInputStatus(true, `MIDI — ${midi.currentInput.name}`);
  } else if (detector.activeSource === 'audio' && audio.currentDeviceId) {
    setInputStatus(true, `Audio — ${audio.currentDeviceLabel}`);
  } else {
    setInputStatus(false, 'not connected');
  }
}

midi.addEventListener('connected', updateInputStatus);
midi.addEventListener('disconnected', updateInputStatus);
midi.addEventListener('unsupported', updateInputStatus);
midi.addEventListener('deviceschanged', updateInputStatus);
audio.addEventListener('connected', updateInputStatus);
audio.addEventListener('disconnected', updateInputStatus);

detector.addEventListener('chordchange', (e) => {
  const match = e.detail;
  chordBadgeEl.textContent = match ? `${match.name} (${Math.round(match.score * 100)}%)` : '—';
  chordBadgeEl.classList.toggle('active', !!match);
});

updateInputStatus();
midi.init();

navigate('home');

// Handy in the console for debugging while wiring up hardware.
window.__guitarGames = { midi, audio, store, midiDetector, audioDetector, detector, midiToName };
