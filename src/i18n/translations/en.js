// English is the master catalog — every other language file must cover the
// same keys (i18n.js falls back to this file for anything missing).
export const en = {
  // --- Topbar / nav ---
  'nav.settings': 'Settings',
  'topbar.inputConnected': 'Input: Audio — {device}',
  'topbar.inputNotConnected': 'Input: not connected',
  'topbar.inputUnsupported': 'Input: unsupported in this browser',

  // --- Home ---
  'home.welcomeTitle': 'Welcome',
  'home.welcomeBody':
    "Connect your guitar's USB audio interface/pedal and it'll show up under <strong>Settings</strong> — pick it there (not your laptop's built-in mic) and chord recognition runs on that signal directly. Settings also has the chord library, so you can see or customize which chords are recognized, then pick a game below.",
  'home.gamesTitle': 'Games',
  'home.racerDesc': 'Steer between lanes by switching chords. Dodge obstacles. Speed ramps up over time.',
  'home.fightDesc': 'Face off against the CPU. Block its telegraphed attacks and hit back with different chords.',
  'home.flapDesc':
    "Hold the active chord to rise and dodge pipes — it keeps rotating, so one shape won't carry you.",
  'home.pongDesc': 'Hold one chord to slide the paddle left, another to slide right — keep the ball in play.',
  'home.runDesc': 'Jump logs and duck beams with two chords. Hold jump to keep hopping, hold duck to slide under.',
  'home.snakeDesc': "Four chords steer up/down/left/right. Classic snake — eat food, don't hit yourself or a wall.",
  'home.highScoresTitle': 'High Scores',
  'home.highScoresDesc': "See the top 10 for each game. Land a top-10 run and you'll be asked for your name.",

  // --- Settings ---
  'settings.title': 'Settings',
  'settings.intro':
    "Listens to your USB audio interface/pedal directly — not your laptop's built-in microphone — and detects chords from the sound itself. Pick the device your guitar/pedal actually appears as below, not the built-in mic, then calibrate the chords you plan to use — that matters more than anything else here.",
  'settings.replayWizardBtn': 'Replay setup wizard',
  'settings.languageTitle': 'Language',
  'settings.audioInputTitle': 'Audio Input',
  'settings.liveMonitorTitle': 'Live monitor',
  'settings.liveMonitorHint': 'Strum and hold a chord — the pitch classes present should light up below.',
  'settings.closestChord': 'Closest chord:',
  'settings.levelUnknown': 'Level: —',
  'settings.levelDb': 'Level: {db} dB',
  'settings.matchedStatus': '✓ matched — this is what games will react to',
  'settings.notConfidentStatus':
    'not confident enough yet (need {threshold}%) — try calibrating this chord below',
  'settings.calibrateTitle': 'Calibrate your chords',
  'settings.recalibrateTitle': 'Recalibrate or add a custom chord',
  'settings.recalibrateHint':
    "For one-off recalibration of a specific chord, or adding a brand new one that isn't in the guided list above.",
  'settings.captureExistingBtn': 'Capture for selected chord',
  'settings.newChordPlaceholder': 'e.g. F#m',
  'settings.captureNewBtn': 'Capture as new chord',
  'settings.enableAudioFirst': 'Enable audio input above first.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'This browser doesn’t support audio input capture. Use Chrome or Edge.',
  'audio.enableBtn': 'Enable audio input',
  'audio.requestingPermission': 'Requesting permission…',
  'audio.couldNotAccess':
    "Couldn't access audio input: {message}. Check the browser's site permissions (padlock icon in the address bar).",
  'audio.disconnectBtn': 'Disconnect',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Enable some chords in the Chord Library first, then come back here.',
  'calibrate.allDone': 'All {count} enabled chords calibrated. Head to the Home screen to play, or restart to redo them.',
  'calibrate.restartBtn': 'Restart calibration',
  'calibrate.walkthroughHint':
    "Walk through each chord you use and capture its real sound — this matters more than anything else here, since it's what actually drives recognition.",
  'calibrate.chordProgress': 'Chord {index} of {total}',
  'calibrate.strumAndHold': 'Strum and hold {chord}, then capture.',
  'calibrate.captureBtn': 'Capture {chord}',
  'calibrate.skipBtn': 'Skip',
  'calibrate.connectAudioFirst': 'Connect audio input first.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Chord Library',
  'library.intro':
    'These are the chords the app recognizes. The "Enabled" column controls which chords are available to assign in games. To add a new chord or recalibrate one that isn\'t matching reliably, use the calibration sections above — capturing a chord\'s actual live sound works better than the defaults if your guitar/pickup/pedal sounds different from what they assume (standard tuning, open position).',
  'library.colEnabled': 'Enabled',
  'library.colName': 'Name',
  'library.colHowToPlay': 'How to play',
  'library.colNotes': 'Notes',
  'library.colSource': 'Source',
  'library.noDiagram': 'no diagram',
  'library.capturedFromAudio': 'captured from audio',
  'library.deleteBtn': 'Delete',
  'library.confirmDelete': 'Delete this chord from your library?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Welcome to Chord Games',
  'onboarding.welcomeBody':
    'A quick setup gets your guitar recognized reliably — connect your audio input and capture a couple of chords. Two short steps, and you only do this once.',
  'onboarding.startBtn': "Let's go →",
  'onboarding.skipAllBtn': 'Skip setup, take me to the games',
  'onboarding.audioTitle': 'Connect your audio',
  'onboarding.audioBody':
    "Pick your guitar's USB audio interface/pedal below — not your laptop's built-in mic. This is optional: every game also has a keyboard fallback for testing without a guitar, and you can always connect later from Settings.",
  'onboarding.continueBtn': 'Continue →',
  'onboarding.skipCalibrateBtn': "Skip, I'll calibrate later",
  'onboarding.doneTitle': "You're all set!",
  'onboarding.doneBody': 'Head to the games and start playing. You can replay this guide anytime from Settings.',
  'onboarding.finishBtn': 'Continue to games →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Super Easy',
  'level.easy': 'Easy',
  'level.medium': 'Medium',
  'level.hard': 'Hard',
  'level.veryHard': 'Very Hard',
  'level.insane': 'Insane',

  // --- High scores ---
  'highScores.empty': 'No high scores yet — be the first!',
  'highScores.colRank': '#',
  'highScores.colName': 'Name',
  'highScores.colScore': 'Score',
  'highScores.savedTo': 'Saved to the {level} leaderboard!',
  'highScores.newHighScore': 'New {level} high score! Enter your name for the leaderboard:',
  'highScores.namePlaceholder': 'Your name',
  'highScores.saveBtn': 'Save',
  'highScores.anonymous': 'Anonymous',
  'highScores.title': 'High Scores',
  'highScores.subtitle': 'Top 10 for each game, tracked separately per difficulty level, saved on this device.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Start',
  'common.difficultyTitle': 'Difficulty',
  'common.quitBtn': 'Quit to setup',
  'common.gameOverTitle': 'Game Over',
  'common.playAgainBtn': 'Play again',
  'common.changeSettingsBtn': 'Change settings',
  'common.scoreLabel': 'Score:',
  'common.noAudioBanner':
    'No audio input connected. Connect your guitar/pedal under "Settings", or enable keyboard fallback below to test.',
  'common.enableChordsBanner': 'Enable at least {count} chords in Settings to play.',
  'common.chordsToUseLabel': 'Chords to use',
  'common.noDiagram': 'no diagram',

  // --- Chord Racer ---
  'racer.description':
    "The car drifts to whichever lane's chord you're currently holding. Obstacles fall faster the longer you survive — switch chords cleanly and quickly to dodge them.",
  'racer.lanesLabel': 'Lanes',
  'racer.laneLeft': 'Left',
  'racer.laneRight': 'Right',
  'racer.laneN': 'Lane {n}',
  'racer.kbFallbackLabel': 'Enable arrow-key fallback (for testing without a guitar)',
  'racer.difficultyHint':
    'Pick a level to jump straight to a preset. From there it still adapts to you automatically: a run that ends almost instantly backs off and gives you more room to react, a run you comfortably survive shortens that room, and everything in between nudges it up gently over time.',
  'racer.startSpeedStat': 'Start speed: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Ramp: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Reaction room: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Obstacle gap: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Reset to default',
  'racer.manualSpeedLabel': 'Set start speed manually',
  'racer.setBtn': 'Set',
  'racer.manualGapLabel': 'Minimum time between obstacles (seconds)',
  'racer.lanesHud': 'Lanes: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Nice run — next one gives you a little less room to react.',
  'racer.feedbackDown':
    'That was over fast — next one gives you more room to react so you can find your footing.',
  'racer.feedbackSame': 'Difficulty holding steady for the next run.',

  // --- Chord Fight ---
  'fight.description':
    "Face off against the CPU. It briefly winds up before every attack — hold whichever chord you've mapped to <strong>Block</strong> during that window to negate it. Play an attack-type chord to hit back; each one has a short cooldown, so switching between chords is what actually wins fights, not spamming one.",
  'fight.kbFallbackLabel': 'Enable number-key fallback 1-4 (for testing without a guitar)',
  'fight.difficultyHint':
    'Controls how fast and hard the CPU attacks, and how long its wind-up telegraph gives you to block.',
  'fight.actionAttack': 'Attack',
  'fight.actionKick': 'Kick',
  'fight.actionSpecial': 'Special',
  'fight.actionBlock': 'Block',
  'fight.playerHpHud': 'You:',
  'fight.cpuHpHud': 'CPU:',
  'fight.youLabel': 'You',
  'fight.cpuLabel': 'CPU',
  'fight.blockedLabel': 'Blocked!',
  'fight.winTitle': 'You Win!',
  'fight.loseTitle': 'Knocked Out',
  'fight.winHint': 'Nice reflexes — block on time and hit back cleanly for a rematch.',
  'fight.loseHint': 'The CPU got the better of you this time. Watch for the wind-up and block it.',
  'fight.damageDealt': 'Damage dealt: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Hold whichever chord is currently marked <strong>active</strong> to rise — let go (or play anything else) and gravity takes over. The active chord keeps rotating between your assigned chords through the run, so watch the legend rather than settling into one shape.",
  'flap.kbFallbackLabel': 'Enable number-key fallback 1-4, held down (for testing without a guitar)',
  'flap.difficultyHint':
    'Controls how often the active chord rotates and how tight the pipes are — the lower levels give you a lot more time to settle into each chord.',
  'flap.chordN': 'Chord {n}',
  'flap.activeChordHud': 'Active chord:',
  'flap.gameOverHint':
    'Crashed into a pipe or the edge. Keep an eye on the legend — the active chord changes through the run.',

  // --- Chord Pong ---
  'pong.description':
    'Keep the ball in play. Hold the <strong>Move Left</strong> chord to slide the paddle left, <strong>Move Right</strong> to slide it right — let go and the paddle stops. Every bounce off the paddle speeds the ball up a little, so a long rally gets progressively harder to keep alive.',
  'pong.moveLeft': 'Move Left',
  'pong.moveRight': 'Move Right',
  'pong.kbFallbackLabel': 'Enable arrow-key fallback, held down (for testing without a guitar)',
  'pong.difficultyHint': 'Controls paddle width and speed, and how fast the ball starts and ramps up with each rally.',
  'pong.rallyHud': 'Rally:',
  'pong.gameOverHint':
    'The ball got past the paddle. Longer rallies mean a faster ball — stay centered so you can cover either direction.',

  // --- Chord Run ---
  'run.description':
    "Keep running. Play the <strong>Jump</strong> chord to hop over low obstacles — hold it and you'll keep hopping — and hold the <strong>Duck</strong> chord to slide under high ones. You can only be doing one at a time, so a run of alternating obstacles means genuinely switching chords, not picking one and holding it forever.",
  'run.jump': 'Jump',
  'run.duck': 'Duck',
  'run.kbFallbackLabel': 'Enable number-key fallback 1-2 (for testing without a guitar)',
  'run.difficultyHint': 'Controls how fast the world scrolls and the minimum time between obstacles.',
  'run.loadingEngine': 'Loading 3D engine…',
  'run.gameOverHint': 'Caught by an obstacle. Logs need a jump, beams need a duck — watch which is coming.',

  // --- Chord Snake ---
  'snake.description':
    "Classic grid snake — four chords steer Up/Down/Left/Right. You can't turn straight back into your own body, so a mistaken chord match just gets ignored rather than ending the run outright. Eating food grows the snake and speeds the game up a little each time.",
  'snake.up': 'Up',
  'snake.down': 'Down',
  'snake.left': 'Left',
  'snake.right': 'Right',
  'snake.kbFallbackLabel': 'Enable arrow-key fallback (for testing without a guitar)',
  'snake.difficultyHint':
    'Controls how fast the snake moves. Switching cleanly between four chords is harder than two, so start at Super Easy or Easy if this is your first run.',
  'snake.gameOverHint':
    'Hit a wall or your own tail. If four chords feel like a lot, drop down a difficulty level for more time between turns.',
};
