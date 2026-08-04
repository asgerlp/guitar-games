# Chord Games

**Play it live: https://asgerlp.github.io/guitar-games/**

Browser-based games controlled by chords played on a real electric guitar.
Two input pipelines are supported:

- **MIDI** (`src/midi/`), for gear that outputs a MIDI note per string (e.g.
  Roland's GK-pickup-based synth gear) over the **Web MIDI API** — no audio
  analysis involved, so recognition is as accurate as your gear's own note
  tracking.
- **USB audio** (`src/audio/`), for gear that's class-compliant USB audio but
  has no MIDI note output at all — common on affordable modeling
  pedals/interfaces (e.g. a Valeton GP-50). This reads the device's actual
  audio signal directly via the Web Audio API — **not** the laptop's built-in
  microphone — and detects chords from the sound itself.

Whichever pipeline is active feeds the same "chord changed" event, so games
don't know or care which one is in use.

![Chord Racer gameplay: a car dodging obstacles across two lanes, one per chord](docs/screenshot-chord-racer.png)

*Chord Racer mid-run — car (green) steers into whichever lane's chord is currently
held, dodging trees, rocks, bananas, and barrels as speed ramps up. Captured using
the keyboard fallback since no physical GP-50 was available in this environment.*

## How it works

1. Connect your GP-50 (with a GK-equipped guitar/pickup) to your Mac via a
   MIDI interface. The GP-50 sends a MIDI note per string it hears.
2. This app listens to raw MIDI note on/off events (`src/midi/midiManager.js`),
   tracks which notes are currently held, and after a short debounce matches
   the held note set against a library of known chords
   (`src/chords/chordDetector.js`) using pitch-class overlap scoring.
3. Games subscribe to chord-change events and react — e.g. Chord Racer steers
   a car into whichever lane's assigned chord you're currently holding.

Chord Racer's speed is adaptive rather than fixed (`src/games/difficulty.js`):
it starts gentle, and after every run backs off if you crashed almost
immediately, pushes up if you comfortably survived, or nudges up slightly
otherwise — so it settles near your actual skill level instead of hitting a
beginner with the same speed as an expert. This is stored per-browser in
localStorage and can be reset from the Chord Racer setup screen.

## Running it

```sh
npm install
npm run dev
```

Open the printed URL in **Chrome or Edge** (Safari does not support the Web
MIDI API). Go to **MIDI Setup** or **Audio Setup** — whichever matches your
gear — to connect your device and confirm it's being read correctly, then
**Chord Library** to see/customize which chords are recognized, then play
**Chord Racer**.

## Deployment

Every push to `main` builds and deploys the app to GitHub Pages via
`.github/workflows/deploy-pages.yml`. Web MIDI needs a secure context, and
Pages serves over HTTPS, so no extra setup is required to use a connected
GP-50 there.

One-time repo setup, required before the very first successful deploy:
**Settings → Pages → Source → GitHub Actions**. GitHub's `GITHUB_TOKEN`
can't create a Pages site for the first time via the API (only a human
clicking that setting can), so this step can't be automated away — but once
it's done, every future push deploys with no further action needed.

## Customizing chords

The default library (`src/chords/defaultChords.js`) assumes standard tuning
and open-position voicings with no transpose on the GP-50, using standard
shorthand names (`E`, `Em`, `F#m`, ...) rather than spelling out
major/minor/sharp. If your setup reports different absolute MIDI pitches,
use **Chord Library → Re-record** (or **Add a new chord**) to capture the
exact notes your gear sends for a given shape — the app matches on whatever
you record, not on music theory.

Each default chord also carries a fretboard shape (`frets` in
`defaultChords.js`), rendered as a small "how to play" diagram
(`src/chords/chordDiagram.js`) in the Chord Library, the Chord Racer lane
picker, and as a live legend while playing. Custom chords recorded purely
from MIDI notes don't have a known fingering, so they show "no diagram"
instead — re-recording a default chord keeps its diagram, since only the
notes change, not the shape.

No physical GP-50 was available while building this, so the MIDI plumbing is
implemented directly against the Web MIDI API spec and covered by the fake
note-event flow, but real-hardware verification (exact note numbers your
GP-50 sends per string/channel, timing feel of the strum debounce) is still
worth doing on your end — tweak `SETTLE_MS`/`MATCH_THRESHOLD` in
`chordDetector.js` if strums feel laggy or chords misfire.

## Audio input (for gear without MIDI note output)

Some gear — including a Valeton GP-50, despite the name overlap with Roland's
MIDI-capable GP-50 — only exposes itself as a class-compliant USB **audio**
interface, with no per-note MIDI output at all. **Audio Setup** covers that
case: pick that device (not the built-in mic) from the dropdown there, and
`src/audio/audioInputManager.js` reads it directly via `getUserMedia` +
`AnalyserNode`.

Matching works by chroma analysis (`src/chords/chromaUtils.js`): each
animation frame's FFT bins are folded into a 12-element vector — one bucket
per pitch class, octave-collapsed — then compared via cosine similarity
against each chord's template
(`src/chords/audioChordDetector.js`). Default chords derive a template
automatically from their MIDI note list, so no extra data entry is needed;
custom or recalibrated chords can instead carry their own `chroma` array
captured live from **Audio Setup → Calibrate from audio**, which is worth
doing if a chord isn't matching reliably, since guitars/pickups/pedals all
sound a little different.

Both pipelines dispatch the same `chordchange` shape into a small router
(`src/chords/inputRouter.js`), which is what games actually listen to —
whichever source connected most recently becomes "active", and Chord Racer
(or any future game) never needs to know which one is in use.
