# Chord Games

**Play it live: https://asgerlp.github.io/guitar-games/**

Browser-based games controlled by chords played on a real electric guitar.
Chord recognition runs on your guitar/pedal's **USB audio output**, read
directly via the Web Audio API — not your laptop's built-in microphone, so
it's a clean, direct signal rather than whatever the room happens to pick up.

![Chord Racer gameplay: a car dodging obstacles across two lanes, one per chord](docs/screenshot-chord-racer.png)

*Chord Racer mid-run — car (green) steers into whichever lane's chord is currently
held, dodging trees, rocks, bananas, and barrels as speed ramps up. Captured using
the keyboard fallback since no physical guitar/audio interface was available in
this environment.*

## How it works

1. Connect your guitar's audio interface/modeling pedal (e.g. a Valeton GP-50)
   to your computer over USB. It shows up as a regular audio input device —
   `src/audio/audioInputManager.js` lets you pick that specific device (not
   the built-in mic) via `getUserMedia`.
2. Each animation frame, an `AnalyserNode`'s FFT output is folded into a
   12-element chroma vector — one bucket per pitch class, octave-collapsed —
   by `src/chords/chromaUtils.js`. This is the same trick chord-recognition
   software uses: you don't need to resolve exact octaves to know "this
   sounds like a G major".
3. `src/chords/audioChordDetector.js` smooths that vector over time and
   compares it via cosine similarity against every chord in your library,
   debouncing briefly before committing to a match.
4. Games subscribe to `chordchange` events and react — e.g. Chord Racer
   steers a car into whichever lane's assigned chord you're currently
   holding.

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

Open the printed URL in **Chrome or Edge** (Safari's Web Audio device-selection
support is unreliable). Go to **Audio Setup**, click "Enable audio input", and
pick your guitar/pedal from the dropdown — not the built-in mic. Then
**Chord Library** to see/customize which chords are recognized, then play
**Chord Racer**.

## Deployment

Every push to `main` builds and deploys the app to GitHub Pages via
`.github/workflows/deploy-pages.yml`. `getUserMedia` needs a secure context,
and Pages serves over HTTPS, so no extra setup is required to use a connected
device there.

One-time repo setup, required before the very first successful deploy:
**Settings → Pages → Source → GitHub Actions**. GitHub's `GITHUB_TOKEN`
can't create a Pages site for the first time via the API (only a human
clicking that setting can), so this step can't be automated away — but once
it's done, every future push deploys with no further action needed.

## Customizing chords

The default library (`src/chords/defaultChords.js`) uses standard shorthand
names (`E`, `Em`, `F#m`, ...) rather than spelling out major/minor/sharp, and
each entry lists the chord's notes (encoded as standard MIDI note numbers —
just a compact way to represent absolute pitch, nothing to do with the MIDI
protocol/hardware) plus a fretboard shape (`frets`) for the "how to play"
diagrams shown in the Chord Library, the Chord Racer lane picker, and as a
live legend while playing.

Those default notes are also what the audio pipeline derives its initial
chroma-matching template from — a theoretical approximation that rarely
cosine-matches real guitar audio as tightly as a captured reference would,
since every guitar/pickup/pedal sounds a little different. **Audio Setup**
leads with a guided **"Calibrate your chords"** wizard for exactly this: it
steps through your enabled chords one at a time (with a diagram as a
reminder of the shape) so you capture each one's actual live sound as its
reference before you ever try to play a game. There's also a freeform
"Recalibrate or add a custom chord" panel below it for one-off touch-ups or
adding chords outside the guided list. Custom chords captured purely from
audio have no known fretboard shape, so they show "no diagram" in the Chord
Library instead — recalibrating a default chord's sound keeps its diagram,
since only the reference sound changes, not the shape.

The live monitor always shows the closest-matching chord and its score, even
below the confidence threshold needed to actually commit as a match (labeled
"not confident enough yet" vs. "✓ matched") — so a low match isn't a mystery,
it's a direct nudge toward calibrating that chord.

## Audio pipeline internals / tuning

No physical audio interface was available while building this, so the whole
pipeline — device selection, FFT → chroma folding, cosine-similarity matching
— is covered by an automated test that feeds real oscillator-synthesized
tones through a mocked `getUserMedia`, not real guitar audio. Real-hardware
tuning is still worth doing on your end:

- **Audio Setup**'s live monitor shows a running diagnostics line ("Level: -42
  dB · closest: G (54%)") even when nothing commits as a match — that tells
  you whether the problem is signal level (too quiet to clear the silence
  gate) or match quality (audible, but not similar enough to any chord in the
  library) so you're not debugging blind.
- `SILENCE_DB` in `audioChordDetector.js` is the peak-dB floor below which a
  frame is treated as "not playing" — raise it if background noise is
  triggering false matches, lower it if quiet playing isn't registering.
- `MATCH_THRESHOLD` is the cosine-similarity cutoff to accept a match — lower
  it if legitimate chords aren't matching even with a decent "closest" score
  in the diagnostics line; raise it if wrong chords match too easily.
- `HOLD_MS` is how long a candidate match must stay stable before it fires,
  as a debounce against strum noise — raise it if chords flicker between
  candidates, lower it for snappier response.
