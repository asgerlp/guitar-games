export const da = {
  // --- Topbar / nav ---
  'nav.settings': 'Indstillinger',
  'topbar.inputConnected': 'Input: Lyd — {device}',
  'topbar.inputNotConnected': 'Input: ikke tilsluttet',
  'topbar.inputUnsupported': 'Input: understøttes ikke i denne browser',

  // --- Home ---
  'home.welcomeTitle': 'Velkommen',
  'home.welcomeBody':
    "Tilslut din guitars USB-lydinterface/pedal, så dukker den op under <strong>Indstillinger</strong> — vælg den der (ikke din computers indbyggede mikrofon), så kører akkordgenkendelse direkte på det signal. Indstillinger har også akkordbiblioteket, så du kan se eller tilpasse hvilke akkorder der genkendes, og derefter vælge et spil nedenfor.",
  'home.gamesTitle': 'Spil',
  'home.racerDesc': 'Styr mellem baner ved at skifte akkorder. Undgå forhindringer. Farten øges over tid.',
  'home.fightDesc': "Kæmp mod CPU'en. Bloker dens varslede angreb og slå igen med forskellige akkorder.",
  'home.flapDesc':
    "Hold den aktive akkord for at stige og undgå rør — den skifter hele tiden, så én form bærer dig ikke hele vejen.",
  'home.pongDesc': 'Hold én akkord for at flytte battet til venstre, en anden for at flytte det til højre — hold bolden i spil.',
  'home.runDesc': 'Hop over stammer og duk under bjælker med to akkorder. Hold hop for at blive ved med at hoppe, hold duk for at glide under.',
  'home.snakeDesc': "Fire akkorder styrer op/ned/venstre/højre. Klassisk orm — spis mad, ram ikke dig selv eller en væg.",
  'home.highScoresTitle': 'Highscores',
  'home.highScoresDesc': "Se top 10 for hvert spil. Lander du en top-10-runde, bliver du bedt om dit navn.",

  // --- Settings ---
  'settings.title': 'Indstillinger',
  'settings.intro':
    "Lytter direkte til dit USB-lydinterface/din pedal — ikke computerens indbyggede mikrofon — og genkender akkorder ud fra selve lyden. Vælg den enhed din guitar/pedal faktisk optræder som nedenfor, ikke den indbyggede mikrofon, og kalibrer derefter de akkorder du planlægger at bruge — det betyder mere end noget andet her.",
  'settings.replayWizardBtn': 'Gennemgå opsætningsguiden igen',
  'settings.languageTitle': 'Sprog',
  'settings.audioInputTitle': 'Lydinput',
  'settings.liveMonitorTitle': 'Live-monitor',
  'settings.liveMonitorHint': 'Stryg og hold en akkord — de tilstedeværende toner skal lyse op nedenfor.',
  'settings.closestChord': 'Nærmeste akkord:',
  'settings.levelUnknown': 'Niveau: —',
  'settings.levelDb': 'Niveau: {db} dB',
  'settings.matchedStatus': '✓ genkendt — dette er hvad spillene reagerer på',
  'settings.notConfidentStatus':
    'ikke sikker nok endnu (kræver {threshold}%) — prøv at kalibrere denne akkord nedenfor',
  'settings.calibrateTitle': 'Kalibrer dine akkorder',
  'settings.recalibrateTitle': 'Rekalibrer eller tilføj en brugerdefineret akkord',
  'settings.recalibrateHint':
    "Til engangskalibrering af en bestemt akkord, eller for at tilføje en helt ny, der ikke er på den guidede liste ovenfor.",
  'settings.captureExistingBtn': 'Optag for valgt akkord',
  'settings.newChordPlaceholder': 'f.eks. F#m',
  'settings.captureNewBtn': 'Optag som ny akkord',
  'settings.enableAudioFirst': 'Aktivér lydinput ovenfor først.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'Denne browser understøtter ikke optagelse af lydinput. Brug Chrome eller Edge.',
  'audio.enableBtn': 'Aktivér lydinput',
  'audio.requestingPermission': 'Anmoder om tilladelse…',
  'audio.couldNotAccess':
    "Kunne ikke tilgå lydinput: {message}. Tjek browserens webstedstilladelser (hængelåsikonet i adresselinjen).",
  'audio.disconnectBtn': 'Afbryd',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Aktivér nogle akkorder i akkordbiblioteket først, kom så tilbage her.',
  'calibrate.allDone': 'Alle {count} aktiverede akkorder er kalibreret. Gå til forsiden for at spille, eller genstart for at gøre dem om.',
  'calibrate.restartBtn': 'Genstart kalibrering',
  'calibrate.walkthroughHint':
    "Gennemgå hver akkord du bruger, og optag dens rigtige lyd — det betyder mere end noget andet her, da det er det, der faktisk styrer genkendelsen.",
  'calibrate.chordProgress': 'Akkord {index} af {total}',
  'calibrate.strumAndHold': 'Stryg og hold {chord}, og optag så.',
  'calibrate.captureBtn': 'Optag {chord}',
  'calibrate.skipBtn': 'Spring over',
  'calibrate.connectAudioFirst': 'Tilslut lydinput først.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Akkordbibliotek',
  'library.intro':
    'Dette er de akkorder, appen genkender. Kolonnen "Aktiveret" styrer, hvilke akkorder der er tilgængelige til tildeling i spil. For at tilføje en ny akkord eller rekalibrere en, der ikke matcher pålideligt, skal du bruge kalibreringssektionerne ovenfor — at optage en akkords faktiske live-lyd fungerer bedre end standardværdierne, hvis din guitar/pickup/pedal lyder anderledes end det, de forudsætter (standardstemning, åben position).',
  'library.colEnabled': 'Aktiveret',
  'library.colName': 'Navn',
  'library.colHowToPlay': 'Sådan spilles',
  'library.colNotes': 'Noter',
  'library.colSource': 'Kilde',
  'library.noDiagram': 'intet diagram',
  'library.capturedFromAudio': 'optaget fra lyd',
  'library.deleteBtn': 'Slet',
  'library.confirmDelete': 'Slet denne akkord fra dit bibliotek?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Velkommen til Chord Games',
  'onboarding.welcomeBody':
    'En hurtig opsætning gør, at din guitar genkendes pålideligt — tilslut din lydindgang, og optag et par akkorder. To korte trin, og du gør det kun én gang.',
  'onboarding.startBtn': 'Lad os gå i gang →',
  'onboarding.skipAllBtn': 'Spring opsætning over, tag mig til spillene',
  'onboarding.audioTitle': 'Tilslut din lyd',
  'onboarding.audioBody':
    "Vælg din guitars USB-lydinterface/pedal nedenfor — ikke computerens indbyggede mikrofon. Dette er valgfrit: alle spil har også en tastaturløsning til test uden guitar, og du kan altid tilslutte senere fra Indstillinger.",
  'onboarding.continueBtn': 'Fortsæt →',
  'onboarding.skipCalibrateBtn': "Spring over, jeg kalibrerer senere",
  'onboarding.doneTitle': "Du er klar!",
  'onboarding.doneBody': 'Gå til spillene og begynd at spille. Du kan altid gennemgå denne guide igen fra Indstillinger.',
  'onboarding.finishBtn': 'Fortsæt til spillene →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Super Nem',
  'level.easy': 'Nem',
  'level.medium': 'Mellem',
  'level.hard': 'Svær',
  'level.veryHard': 'Meget Svær',
  'level.insane': 'Vanvittig',

  // --- High scores ---
  'highScores.empty': 'Ingen highscores endnu — bliv den første!',
  'highScores.colRank': '#',
  'highScores.colName': 'Navn',
  'highScores.colScore': 'Point',
  'highScores.savedTo': 'Gemt på {level}-ranglisten!',
  'highScores.newHighScore': 'Ny {level}-highscore! Indtast dit navn til ranglisten:',
  'highScores.namePlaceholder': 'Dit navn',
  'highScores.saveBtn': 'Gem',
  'highScores.anonymous': 'Anonym',
  'highScores.title': 'Highscores',
  'highScores.subtitle': 'Top 10 for hvert spil, sporet separat pr. sværhedsgrad, gemt på denne enhed.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Start',
  'common.difficultyTitle': 'Sværhedsgrad',
  'common.quitBtn': 'Afslut til opsætning',
  'common.gameOverTitle': 'Spillet er slut',
  'common.playAgainBtn': 'Spil igen',
  'common.changeSettingsBtn': 'Skift indstillinger',
  'common.scoreLabel': 'Point:',
  'common.noAudioBanner':
    'Ingen lydinput tilsluttet. Tilslut din guitar/pedal under "Indstillinger", eller aktivér tastaturløsning nedenfor for at teste.',
  'common.enableChordsBanner': 'Aktivér mindst {count} akkorder i Indstillinger for at spille.',
  'common.chordsToUseLabel': 'Akkorder der skal bruges',
  'common.noDiagram': 'intet diagram',

  // --- Chord Racer ---
  'racer.description':
    "Bilen glider hen til hvilken bane, hvis akkord du aktuelt holder. Forhindringer falder hurtigere, jo længere du overlever — skift akkorder rent og hurtigt for at undgå dem.",
  'racer.lanesLabel': 'Baner',
  'racer.laneLeft': 'Venstre',
  'racer.laneRight': 'Højre',
  'racer.laneN': 'Bane {n}',
  'racer.kbFallbackLabel': 'Aktivér piletast-løsning (til test uden guitar)',
  'racer.difficultyHint':
    'Vælg et niveau for at springe direkte til en forudindstilling. Derfra tilpasser den sig stadig automatisk til dig: en runde, der slutter næsten øjeblikkeligt, sænker sværhedsgraden og giver dig mere plads til at reagere, en runde du klarer nemt forkorter den plads, og alt derimellem skruer den forsigtigt op over tid.',
  'racer.startSpeedStat': 'Startfart: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Optrapning: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Reaktionsplads: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Afstand mellem forhindringer: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Nulstil til standard',
  'racer.manualSpeedLabel': 'Indstil startfart manuelt',
  'racer.setBtn': 'Sæt',
  'racer.manualGapLabel': 'Minimumtid mellem forhindringer (sekunder)',
  'racer.lanesHud': 'Baner: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Flot runde — næste giver dig lidt mindre plads til at reagere.',
  'racer.feedbackDown':
    'Den var overstået hurtigt — næste giver dig mere plads til at reagere, så du kan finde fodfæste.',
  'racer.feedbackSame': 'Sværhedsgraden holdes stabil til næste runde.',

  // --- Chord Fight ---
  'fight.description':
    "Kæmp mod CPU'en. Den varsler kort før hvert angreb — hold den akkord, du har tildelt <strong>Bloker</strong>, i det tidsrum for at afvise det. Spil en angrebs-akkord for at slå igen; hver har en kort nedkøling, så det er at skifte mellem akkorder, der reelt vinder kampe, ikke at spamme én.",
  'fight.kbFallbackLabel': 'Aktivér taltast-løsning 1-4 (til test uden guitar)',
  'fight.difficultyHint':
    'Styrer hvor hurtigt og hårdt CPU\'en angriber, og hvor lang varslingstid dens optakt giver dig til at blokere.',
  'fight.actionAttack': 'Angrib',
  'fight.actionKick': 'Spark',
  'fight.actionSpecial': 'Special',
  'fight.actionBlock': 'Bloker',
  'fight.playerHpHud': 'Dig:',
  'fight.cpuHpHud': 'CPU:',
  'fight.youLabel': 'Dig',
  'fight.cpuLabel': 'CPU',
  'fight.blockedLabel': 'Blokeret!',
  'fight.winTitle': 'Du vandt!',
  'fight.loseTitle': 'Slået ud',
  'fight.winHint': 'Flotte reflekser — bloker til tiden og slå rent tilbage til en revanche.',
  'fight.loseHint': 'CPU\'en fik overtaget denne gang. Hold øje med optakten, og bloker den.',
  'fight.damageDealt': 'Skade forvoldt: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Hold den akkord, der er markeret som <strong>aktiv</strong>, for at stige — slip (eller spil noget andet) og tyngdekraften tager over. Den aktive akkord skifter hele tiden mellem dine tildelte akkorder gennem runden, så hold øje med oversigten i stedet for at slå dig til ro med én form.",
  'flap.kbFallbackLabel': 'Aktivér taltast-løsning 1-4, holdt nede (til test uden guitar)',
  'flap.difficultyHint':
    'Styrer hvor ofte den aktive akkord skifter, og hvor tætte rørene er — de lavere niveauer giver dig meget mere tid til at falde til ro med hver akkord.',
  'flap.chordN': 'Akkord {n}',
  'flap.activeChordHud': 'Aktiv akkord:',
  'flap.gameOverHint':
    'Styrtede ind i et rør eller kanten. Hold øje med oversigten — den aktive akkord ændrer sig gennem runden.',

  // --- Chord Pong ---
  'pong.description':
    'Hold bolden i spil. Hold akkorden til <strong>Flyt venstre</strong> for at flytte battet til venstre, <strong>Flyt højre</strong> for at flytte det til højre — slip og battet stopper. Hvert bounce på battet gør bolden lidt hurtigere, så en lang duel bliver gradvist sværere at holde i live.',
  'pong.moveLeft': 'Flyt venstre',
  'pong.moveRight': 'Flyt højre',
  'pong.kbFallbackLabel': 'Aktivér piletast-løsning, holdt nede (til test uden guitar)',
  'pong.difficultyHint': 'Styrer battets bredde og fart, samt hvor hurtigt bolden starter og optrappes med hver duel.',
  'pong.rallyHud': 'Duel:',
  'pong.gameOverHint':
    'Bolden kom forbi battet. Længere dueller betyder en hurtigere bold — hold dig centreret, så du kan dække begge retninger.',

  // --- Chord Run ---
  'run.description':
    "Bliv ved med at løbe. Spil <strong>Hop</strong>-akkorden for at hoppe over lave forhindringer — hold den, så bliver du ved med at hoppe — og hold <strong>Duk</strong>-akkorden for at glide under høje forhindringer. Du kan kun gøre én ting ad gangen, så en runde med skiftende forhindringer betyder rent faktisk at skifte akkorder, ikke bare vælge én og holde den for evigt.",
  'run.jump': 'Hop',
  'run.duck': 'Duk',
  'run.kbFallbackLabel': 'Aktivér taltast-løsning 1-2 (til test uden guitar)',
  'run.difficultyHint': 'Styrer hvor hurtigt verdenen ruller, og minimumtiden mellem forhindringer.',
  'run.loadingEngine': 'Indlæser 3D-motor…',
  'run.gameOverHint': 'Fanget af en forhindring. Stammer kræver et hop, bjælker kræver en duk — hold øje med hvad der kommer.',

  // --- Chord Snake ---
  'snake.description':
    "Klassisk gitter-orm — fire akkorder styrer op/ned/venstre/højre. Du kan ikke dreje lige tilbage ind i din egen krop, så en fejlagtig akkordgenkendelse bliver bare ignoreret i stedet for at afslutte runden. At spise mad gør ormen længere og øger farten en smule hver gang.",
  'snake.up': 'Op',
  'snake.down': 'Ned',
  'snake.left': 'Venstre',
  'snake.right': 'Højre',
  'snake.kbFallbackLabel': 'Aktivér piletast-løsning (til test uden guitar)',
  'snake.difficultyHint':
    'Styrer hvor hurtigt ormen bevæger sig. At skifte rent mellem fire akkorder er sværere end to, så start på Super Nem eller Nem, hvis det er din første runde.',
  'snake.gameOverHint':
    'Ramte en væg eller din egen hale. Hvis fire akkorder føles som mange, så gå ned i sværhedsgrad for mere tid mellem sving.',
};
