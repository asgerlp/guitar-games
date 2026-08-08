export const no = {
  // --- Topbar / nav ---
  'nav.settings': 'Innstillinger',
  'topbar.inputConnected': 'Inngang: Lyd — {device}',
  'topbar.inputNotConnected': 'Inngang: ikke tilkoblet',
  'topbar.inputUnsupported': 'Inngang: støttes ikke i denne nettleseren',

  // --- Home ---
  'home.welcomeTitle': 'Velkommen',
  'home.welcomeBody':
    "Koble til gitarens USB-lydgrensesnitt/pedal, så dukker den opp under <strong>Innstillinger</strong> — velg den der (ikke datamaskinens innebygde mikrofon), så kjører akkordgjenkjenning direkte på det signalet. Innstillinger har også akkordbiblioteket, så du kan se eller tilpasse hvilke akkorder som gjenkjennes, og deretter velge et spill nedenfor.",
  'home.gamesTitle': 'Spill',
  'home.racerDesc': 'Styr mellom felt ved å bytte akkorder. Unngå hindringer. Farten øker over tid.',
  'home.fightDesc': 'Møt datamaskinen. Blokker dens varslede angrep og slå tilbake med ulike akkorder.',
  'home.flapDesc':
    "Hold den aktive akkorden for å stige og unngå rør — den roterer hele tiden, så én form bærer deg ikke hele veien.",
  'home.pongDesc': 'Hold én akkord for å flytte racketen til venstre, en annen for høyre — hold ballen i spill.',
  'home.runDesc': 'Hopp over stokker og duk under bjelker med to akkorder. Hold hopp for å fortsette å hoppe, hold duk for å gli under.',
  'home.snakeDesc': "Fire akkorder styrer opp/ned/venstre/høyre. Klassisk orm — spis mat, ikke treff deg selv eller en vegg.",
  'home.highScoresTitle': 'Toppscorer',
  'home.highScoresDesc': "Se topp 10 for hvert spill. Klarer du en topp-10-runde, blir du bedt om navnet ditt.",

  // --- Settings ---
  'settings.title': 'Innstillinger',
  'settings.intro':
    "Lytter direkte til USB-lydgrensesnittet/pedalen din — ikke datamaskinens innebygde mikrofon — og gjenkjenner akkorder ut fra selve lyden. Velg enheten gitaren/pedalen faktisk vises som nedenfor, ikke den innebygde mikrofonen, og kalibrer deretter akkordene du planlegger å bruke — det betyr mer enn noe annet her.",
  'settings.replayWizardBtn': 'Kjør oppsettsveiviseren på nytt',
  'settings.languageTitle': 'Språk',
  'settings.audioInputTitle': 'Lydinngang',
  'settings.liveMonitorTitle': 'Live-monitor',
  'settings.liveMonitorHint': 'Spill og hold en akkord — tonene som er til stede skal lyse opp nedenfor.',
  'settings.closestChord': 'Nærmeste akkord:',
  'settings.levelUnknown': 'Nivå: —',
  'settings.levelDb': 'Nivå: {db} dB',
  'settings.matchedStatus': '✓ gjenkjent — dette er det spillene reagerer på',
  'settings.notConfidentStatus':
    'ikke sikker nok ennå (trenger {threshold}%) — prøv å kalibrere denne akkorden nedenfor',
  'settings.calibrateTitle': 'Kalibrer akkordene dine',
  'settings.recalibrateTitle': 'Rekalibrer eller legg til en egendefinert akkord',
  'settings.recalibrateHint':
    "For engangs rekalibrering av en bestemt akkord, eller for å legge til en helt ny som ikke er i den guidede listen ovenfor.",
  'settings.captureExistingBtn': 'Fang opp for valgt akkord',
  'settings.newChordPlaceholder': 'f.eks. F#m',
  'settings.captureNewBtn': 'Fang opp som ny akkord',
  'settings.enableAudioFirst': 'Aktiver lydinngang ovenfor først.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'Denne nettleseren støtter ikke opptak av lydinngang. Bruk Chrome eller Edge.',
  'audio.enableBtn': 'Aktiver lydinngang',
  'audio.requestingPermission': 'Ber om tillatelse…',
  'audio.couldNotAccess':
    "Fikk ikke tilgang til lydinngang: {message}. Sjekk nettleserens nettstedstillatelser (hengelåsikonet i adressefeltet).",
  'audio.disconnectBtn': 'Koble fra',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Aktiver noen akkorder i akkordbiblioteket først, kom så tilbake hit.',
  'calibrate.allDone': 'Alle {count} aktiverte akkorder er kalibrert. Gå til startsiden for å spille, eller start på nytt for å gjøre dem om igjen.',
  'calibrate.restartBtn': 'Start kalibrering på nytt',
  'calibrate.walkthroughHint':
    "Gå gjennom hver akkord du bruker, og fang opp den faktiske lyden — det betyr mer enn noe annet her, siden det er det som faktisk styrer gjenkjenningen.",
  'calibrate.chordProgress': 'Akkord {index} av {total}',
  'calibrate.strumAndHold': 'Spill og hold {chord}, fang så opp.',
  'calibrate.captureBtn': 'Fang opp {chord}',
  'calibrate.skipBtn': 'Hopp over',
  'calibrate.connectAudioFirst': 'Koble til lydinngang først.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Akkordbibliotek',
  'library.intro':
    'Dette er akkordene appen gjenkjenner. Kolonnen "Aktivert" styrer hvilke akkorder som er tilgjengelige å tildele i spill. For å legge til en ny akkord eller rekalibrere en som ikke treffer pålitelig, bruk kalibreringsseksjonene ovenfor — å fange opp en akkords faktiske live-lyd fungerer bedre enn standardverdiene hvis gitaren/pickupen/pedalen din høres annerledes ut enn det de forutsetter (standardstemming, åpen posisjon).',
  'library.colEnabled': 'Aktivert',
  'library.colName': 'Navn',
  'library.colHowToPlay': 'Slik spilles den',
  'library.colNotes': 'Notater',
  'library.colSource': 'Kilde',
  'library.noDiagram': 'ingen diagram',
  'library.capturedFromAudio': 'fanget opp fra lyd',
  'library.deleteBtn': 'Slett',
  'library.confirmDelete': 'Slette denne akkorden fra biblioteket ditt?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Velkommen til Chord Games',
  'onboarding.welcomeBody':
    'Et raskt oppsett gir pålitelig gjenkjenning av gitaren din — koble til lydinngangen og fang opp et par akkorder. To korte trinn, og du gjør det bare én gang.',
  'onboarding.startBtn': 'Sett i gang →',
  'onboarding.skipAllBtn': 'Hopp over oppsett, ta meg til spillene',
  'onboarding.audioTitle': 'Koble til lyden din',
  'onboarding.audioBody':
    "Velg gitarens USB-lydgrensesnitt/pedal nedenfor — ikke datamaskinens innebygde mikrofon. Dette er valgfritt: alle spill har også en tastaturløsning for testing uten gitar, og du kan alltid koble til senere fra Innstillinger.",
  'onboarding.continueBtn': 'Fortsett →',
  'onboarding.skipCalibrateBtn': 'Hopp over, jeg kalibrerer senere',
  'onboarding.doneTitle': 'Du er klar!',
  'onboarding.doneBody': 'Gå til spillene og begynn å spille. Du kan alltid kjøre denne guiden på nytt fra Innstillinger.',
  'onboarding.finishBtn': 'Fortsett til spillene →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Superlett',
  'level.easy': 'Lett',
  'level.medium': 'Middels',
  'level.hard': 'Vanskelig',
  'level.veryHard': 'Svært vanskelig',
  'level.insane': 'Sinnssykt',

  // --- High scores ---
  'highScores.empty': 'Ingen toppscorer ennå — bli den første!',
  'highScores.colRank': '#',
  'highScores.colName': 'Navn',
  'highScores.colScore': 'Poeng',
  'highScores.savedTo': 'Lagret på {level}-listen!',
  'highScores.newHighScore': 'Ny {level}-rekord! Skriv inn navnet ditt til rangeringslisten:',
  'highScores.namePlaceholder': 'Navnet ditt',
  'highScores.saveBtn': 'Lagre',
  'highScores.anonymous': 'Anonym',
  'highScores.title': 'Toppscorer',
  'highScores.subtitle': 'Topp 10 for hvert spill, sporet separat per vanskelighetsgrad, lagret på denne enheten.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Start',
  'common.difficultyTitle': 'Vanskelighetsgrad',
  'common.quitBtn': 'Avslutt til oppsett',
  'common.gameOverTitle': 'Spillet er over',
  'common.playAgainBtn': 'Spill igjen',
  'common.changeSettingsBtn': 'Endre innstillinger',
  'common.scoreLabel': 'Poeng:',
  'common.noAudioBanner':
    'Ingen lydinngang tilkoblet. Koble til gitaren/pedalen din under "Innstillinger", eller aktiver tastaturløsningen nedenfor for å teste.',
  'common.enableChordsBanner': 'Aktiver minst {count} akkorder i Innstillinger for å spille.',
  'common.chordsToUseLabel': 'Akkorder som skal brukes',
  'common.noDiagram': 'ingen diagram',

  // --- Chord Racer ---
  'racer.description':
    "Bilen driver mot hvilket felt du for øyeblikket holder akkorden til. Hindringer faller raskere jo lenger du overlever — bytt akkorder rent og raskt for å unngå dem.",
  'racer.lanesLabel': 'Felt',
  'racer.laneLeft': 'Venstre',
  'racer.laneRight': 'Høyre',
  'racer.laneN': 'Felt {n}',
  'racer.kbFallbackLabel': 'Aktiver piltast-løsning (for testing uten gitar)',
  'racer.difficultyHint':
    'Velg et nivå for å hoppe rett til en forhåndsinnstilling. Derfra tilpasser den seg fortsatt automatisk til deg: en runde som slutter nesten øyeblikkelig, senker vanskelighetsgraden og gir deg mer plass til å reagere, en runde du overlever komfortabelt forkorter den plassen, og alt imellom skrur den forsiktig opp over tid.',
  'racer.startSpeedStat': 'Startfart: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Opptrapping: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Reaksjonsrom: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Avstand mellom hindringer: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Tilbakestill til standard',
  'racer.manualSpeedLabel': 'Angi startfart manuelt',
  'racer.setBtn': 'Angi',
  'racer.manualGapLabel': 'Minimumstid mellom hindringer (sekunder)',
  'racer.lanesHud': 'Felt: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Fin runde — neste gir deg litt mindre plass til å reagere.',
  'racer.feedbackDown':
    'Den var overstått raskt — neste gir deg mer plass til å reagere, slik at du kan finne fotfeste.',
  'racer.feedbackSame': 'Vanskelighetsgraden holdes stabil til neste runde.',

  // --- Chord Fight ---
  'fight.description':
    "Møt datamaskinen. Den forbereder seg kort før hvert angrep — hold akkorden du har tildelt <strong>Blokker</strong> i det tidsrommet for å avverge det. Spill en angreps-akkord for å slå tilbake; hver har en kort nedkjøling, så det er å bytte mellom akkorder som faktisk vinner kamper, ikke å spamme én.",
  'fight.kbFallbackLabel': 'Aktiver talltast-løsning 1-4 (for testing uten gitar)',
  'fight.difficultyHint':
    'Styrer hvor raskt og hardt datamaskinen angriper, og hvor lang varslingstid forberedelsen gir deg til å blokkere.',
  'fight.actionAttack': 'Angrip',
  'fight.actionKick': 'Spark',
  'fight.actionSpecial': 'Spesial',
  'fight.actionBlock': 'Blokker',
  'fight.playerHpHud': 'Deg:',
  'fight.cpuHpHud': 'Datamaskin:',
  'fight.youLabel': 'Deg',
  'fight.cpuLabel': 'Datamaskin',
  'fight.blockedLabel': 'Blokkert!',
  'fight.winTitle': 'Du vant!',
  'fight.loseTitle': 'Slått ut',
  'fight.winHint': 'Flotte reflekser — blokker i tide og slå rent tilbake for en revansj.',
  'fight.loseHint': 'Datamaskinen fikk overtaket denne gangen. Følg med på forberedelsen, og blokker den.',
  'fight.damageDealt': 'Påført skade: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Hold akkorden som for øyeblikket er merket <strong>aktiv</strong>, for å stige — slipp (eller spill noe annet), så tar tyngdekraften over. Den aktive akkorden fortsetter å rotere mellom de tildelte akkordene dine gjennom runden, så følg med på forklaringen i stedet for å slå deg til ro med én form.",
  'flap.kbFallbackLabel': 'Aktiver talltast-løsning 1-4, holdt nede (for testing uten gitar)',
  'flap.difficultyHint':
    'Styrer hvor ofte den aktive akkorden roterer, og hvor trange rørene er — de lavere nivåene gir deg mye mer tid til å falle til ro med hver akkord.',
  'flap.chordN': 'Akkord {n}',
  'flap.activeChordHud': 'Aktiv akkord:',
  'flap.gameOverHint':
    'Krasjet inn i et rør eller kanten. Følg med på forklaringen — den aktive akkorden endres gjennom runden.',

  // --- Chord Pong ---
  'pong.description':
    'Hold ballen i spill. Hold akkorden <strong>Flytt venstre</strong> for å flytte racketen til venstre, <strong>Flytt høyre</strong> for å flytte den til høyre — slipp, så stopper racketen. Hver rikosjett mot racketen gjør ballen litt raskere, så en lang duell blir gradvis vanskeligere å holde i live.',
  'pong.moveLeft': 'Flytt venstre',
  'pong.moveRight': 'Flytt høyre',
  'pong.kbFallbackLabel': 'Aktiver piltast-løsning, holdt nede (for testing uten gitar)',
  'pong.difficultyHint': 'Styrer racketens bredde og fart, samt hvor raskt ballen starter og trappes opp med hver duell.',
  'pong.rallyHud': 'Duell:',
  'pong.gameOverHint':
    'Ballen kom forbi racketen. Lengre duetter betyr en raskere ball — hold deg sentrert så du kan dekke begge retninger.',

  // --- Chord Run ---
  'run.description':
    "Fortsett å løpe. Spill <strong>Hopp</strong>-akkorden for å hoppe over lave hindringer — hold den, så fortsetter du å hoppe — og hold <strong>Duk</strong>-akkorden for å gli under høye hindringer. Du kan bare gjøre én ting om gangen, så en runde med vekslende hindringer betyr å faktisk bytte akkorder, ikke å velge én og holde den for alltid.",
  'run.jump': 'Hopp',
  'run.duck': 'Duk',
  'run.kbFallbackLabel': 'Aktiver talltast-løsning 1-2 (for testing uten gitar)',
  'run.difficultyHint': 'Styrer hvor fort verdenen ruller, og minimumstiden mellom hindringer.',
  'run.loadingEngine': 'Laster 3D-motor…',
  'run.gameOverHint': 'Fanget av en hindring. Stokker krever et hopp, bjelker krever en duk — følg med på hva som kommer.',

  // --- Chord Snake ---
  'snake.description':
    "Klassisk rutenett-orm — fire akkorder styrer opp/ned/venstre/høyre. Du kan ikke svinge rett tilbake inn i din egen kropp, så en feilaktig akkordgjenkjenning blir bare ignorert i stedet for å avslutte runden. Å spise mat gjør ormen lengre og øker farten litt hver gang.",
  'snake.up': 'Opp',
  'snake.down': 'Ned',
  'snake.left': 'Venstre',
  'snake.right': 'Høyre',
  'snake.kbFallbackLabel': 'Aktiver piltast-løsning (for testing uten gitar)',
  'snake.difficultyHint':
    'Styrer hvor fort ormen beveger seg. Å bytte rent mellom fire akkorder er vanskeligere enn to, så start på Superlett eller Lett hvis dette er din første runde.',
  'snake.gameOverHint':
    'Traff en vegg eller din egen hale. Hvis fire akkorder føles som mye, gå ned et vanskelighetsnivå for mer tid mellom svingene.',
};
