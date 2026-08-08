export const de = {
  // --- Topbar / nav ---
  'nav.settings': 'Einstellungen',
  'topbar.inputConnected': 'Eingang: Audio — {device}',
  'topbar.inputNotConnected': 'Eingang: nicht verbunden',
  'topbar.inputUnsupported': 'Eingang: in diesem Browser nicht unterstützt',

  // --- Home ---
  'home.welcomeTitle': 'Willkommen',
  'home.welcomeBody':
    "Schließe das USB-Audiointerface/Pedal deiner Gitarre an — es erscheint dann unter <strong>Einstellungen</strong>. Wähle es dort aus (nicht das eingebaute Mikrofon deines Laptops), damit die Akkorderkennung direkt mit diesem Signal arbeitet. In den Einstellungen findest du außerdem die Akkordbibliothek, in der du sehen oder anpassen kannst, welche Akkorde erkannt werden — wähle danach unten ein Spiel.",
  'home.gamesTitle': 'Spiele',
  'home.racerDesc': 'Wechsle die Spur, indem du Akkorde wechselst. Weiche Hindernissen aus. Die Geschwindigkeit steigt mit der Zeit.',
  'home.fightDesc': 'Tritt gegen den Computer an. Blocke seine angekündigten Angriffe und kontere mit verschiedenen Akkorden.',
  'home.flapDesc':
    "Halte den aktiven Akkord, um zu steigen und Rohren auszuweichen — er wechselt ständig, sodass eine Form allein dich nicht trägt.",
  'home.pongDesc': 'Halte einen Akkord, um den Schläger nach links zu bewegen, einen anderen für rechts — halte den Ball im Spiel.',
  'home.runDesc': 'Springe über Baumstämme und ducke unter Balken mit zwei Akkorden. Halte Springen, um weiter zu hüpfen, halte Ducken, um darunter zu gleiten.',
  'home.snakeDesc': "Vier Akkorde steuern hoch/runter/links/rechts. Klassisches Snake — friss Futter, ramm dich nicht selbst oder eine Wand.",
  'home.stackDesc': 'Klassisches Fallblock-Puzzle. Verschiebe, drehe und lasse Blöcke mit vier Akkorden fallen — räume volle Reihen für Punkte.',
  'home.chompDesc': 'Steuere durch ein Labyrinth und friss Punkte, während Geister dich jagen. Schnapp dir eine Kraftpille, um kurzzeitig den Spieß umzudrehen.',
  'home.hopperDesc': 'Überquere Verkehr und einen Fluss aus Baumstämmen mit vier Akkorden. Kein Boden im Wasser — reite auf einem Stamm oder ertrinke.',
  'home.highwayDesc': 'Noten fallen eine 3D-Straße herab — halte im Moment, in dem eine Note die Linie kreuzt, den richtigen Akkord, um zu punkten.',
  'home.blocksDesc': 'Eine originale Voxel-Bau-Sandbox. Laufe, drehe dich und springe mit Akkorden; brich und platziere Blöcke mit der Maus.',
  'home.highScoresTitle': 'Bestenliste',
  'home.highScoresDesc': "Sieh dir die Top 10 für jedes Spiel an. Schaffst du einen Top-10-Lauf, wirst du nach deinem Namen gefragt.",

  // --- Settings ---
  'settings.title': 'Einstellungen',
  'settings.intro':
    "Hört direkt auf dein USB-Audiointerface/Pedal — nicht das eingebaute Mikrofon deines Laptops — und erkennt Akkorde anhand des Klangs selbst. Wähle unten das Gerät aus, als das deine Gitarre/dein Pedal tatsächlich erscheint, nicht das eingebaute Mikrofon, und kalibriere dann die Akkorde, die du verwenden möchtest — das ist wichtiger als alles andere hier.",
  'settings.replayWizardBtn': 'Einrichtungsassistenten erneut starten',
  'settings.languageTitle': 'Sprache',
  'settings.audioInputTitle': 'Audioeingang',
  'settings.liveMonitorTitle': 'Live-Monitor',
  'settings.liveMonitorHint': 'Schlage einen Akkord an und halte ihn — die vorhandenen Töne sollten unten aufleuchten.',
  'settings.closestChord': 'Nächster Akkord:',
  'settings.levelUnknown': 'Pegel: —',
  'settings.levelDb': 'Pegel: {db} dB',
  'settings.matchedStatus': '✓ erkannt — darauf reagieren die Spiele',
  'settings.notConfidentStatus':
    'noch nicht sicher genug (benötigt {threshold}%) — versuche, diesen Akkord unten zu kalibrieren',
  'settings.calibrateTitle': 'Kalibriere deine Akkorde',
  'settings.recalibrateTitle': 'Neu kalibrieren oder benutzerdefinierten Akkord hinzufügen',
  'settings.recalibrateHint':
    "Für die einmalige Neukalibrierung eines bestimmten Akkords oder zum Hinzufügen eines völlig neuen, der nicht in der geführten Liste oben steht.",
  'settings.captureExistingBtn': 'Für ausgewählten Akkord aufnehmen',
  'settings.newChordPlaceholder': 'z. B. F#m',
  'settings.captureNewBtn': 'Als neuen Akkord aufnehmen',
  'settings.enableAudioFirst': 'Aktiviere zuerst oben den Audioeingang.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'Dieser Browser unterstützt keine Audioeingangsaufnahme. Verwende Chrome oder Edge.',
  'audio.enableBtn': 'Audioeingang aktivieren',
  'audio.requestingPermission': 'Berechtigung wird angefragt…',
  'audio.couldNotAccess':
    "Zugriff auf Audioeingang fehlgeschlagen: {message}. Prüfe die Website-Berechtigungen des Browsers (Schlosssymbol in der Adressleiste).",
  'audio.disconnectBtn': 'Trennen',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Aktiviere zuerst einige Akkorde in der Akkordbibliothek und komm dann hierher zurück.',
  'calibrate.allDone': 'Alle {count} aktivierten Akkorde sind kalibriert. Gehe zur Startseite, um zu spielen, oder starte neu, um sie zu wiederholen.',
  'calibrate.restartBtn': 'Kalibrierung neu starten',
  'calibrate.walkthroughHint':
    "Gehe jeden Akkord durch, den du benutzt, und nimm seinen echten Klang auf — das ist wichtiger als alles andere hier, denn es steuert die Erkennung.",
  'calibrate.chordProgress': 'Akkord {index} von {total}',
  'calibrate.strumAndHold': 'Schlage {chord} an und halte ihn, dann aufnehmen.',
  'calibrate.captureBtn': '{chord} aufnehmen',
  'calibrate.skipBtn': 'Überspringen',
  'calibrate.connectAudioFirst': 'Verbinde zuerst den Audioeingang.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Akkordbibliothek',
  'library.intro':
    'Dies sind die Akkorde, die die App erkennt. Die Spalte "Aktiviert" steuert, welche Akkorde in Spielen zugewiesen werden können. Um einen neuen Akkord hinzuzufügen oder einen neu zu kalibrieren, der nicht zuverlässig erkannt wird, nutze die Kalibrierungsabschnitte oben — die Aufnahme des tatsächlichen Live-Klangs eines Akkords funktioniert besser als die Standardwerte, wenn deine Gitarre/dein Tonabnehmer/Pedal anders klingt als angenommen (Standardstimmung, offene Lage).',
  'library.colEnabled': 'Aktiviert',
  'library.colName': 'Name',
  'library.colHowToPlay': 'Spielweise',
  'library.colNotes': 'Notizen',
  'library.colSource': 'Quelle',
  'library.noDiagram': 'kein Diagramm',
  'library.capturedFromAudio': 'aus Audio aufgenommen',
  'library.deleteBtn': 'Löschen',
  'library.confirmDelete': 'Diesen Akkord aus deiner Bibliothek löschen?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Willkommen bei Chord Games',
  'onboarding.welcomeBody':
    'Eine schnelle Einrichtung sorgt für zuverlässige Erkennung deiner Gitarre — verbinde deinen Audioeingang und nimm ein paar Akkorde auf. Zwei kurze Schritte, das machst du nur einmal.',
  'onboarding.startBtn': "Los geht's →",
  'onboarding.skipAllBtn': 'Einrichtung überspringen, direkt zu den Spielen',
  'onboarding.audioTitle': 'Audio verbinden',
  'onboarding.audioBody':
    "Wähle unten das USB-Audiointerface/Pedal deiner Gitarre — nicht das eingebaute Mikrofon deines Laptops. Das ist optional: Jedes Spiel hat auch eine Tastatur-Alternative zum Testen ohne Gitarre, und du kannst später jederzeit über die Einstellungen verbinden.",
  'onboarding.continueBtn': 'Weiter →',
  'onboarding.skipCalibrateBtn': "Überspringen, ich kalibriere später",
  'onboarding.doneTitle': "Alles bereit!",
  'onboarding.doneBody': 'Gehe zu den Spielen und leg los. Du kannst diese Anleitung jederzeit über die Einstellungen erneut ansehen.',
  'onboarding.finishBtn': 'Weiter zu den Spielen →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Sehr leicht',
  'level.easy': 'Leicht',
  'level.medium': 'Mittel',
  'level.hard': 'Schwer',
  'level.veryHard': 'Sehr schwer',
  'level.insane': 'Wahnsinnig',

  // --- High scores ---
  'highScores.empty': 'Noch keine Bestenliste — sei der Erste!',
  'highScores.colRank': '#',
  'highScores.colName': 'Name',
  'highScores.colScore': 'Punkte',
  'highScores.savedTo': 'In der Bestenliste {level} gespeichert!',
  'highScores.newHighScore': 'Neuer Rekord für {level}! Gib deinen Namen für die Bestenliste ein:',
  'highScores.namePlaceholder': 'Dein Name',
  'highScores.saveBtn': 'Speichern',
  'highScores.anonymous': 'Anonym',
  'highScores.title': 'Bestenliste',
  'highScores.subtitle': 'Top 10 für jedes Spiel, getrennt nach Schwierigkeitsgrad, auf diesem Gerät gespeichert.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Start',
  'common.difficultyTitle': 'Schwierigkeitsgrad',
  'common.quitBtn': 'Zurück zur Einrichtung',
  'common.gameOverTitle': 'Spiel vorbei',
  'common.playAgainBtn': 'Nochmal spielen',
  'common.changeSettingsBtn': 'Einstellungen ändern',
  'common.scoreLabel': 'Punkte:',
  'common.noAudioBanner':
    'Kein Audioeingang verbunden. Verbinde deine Gitarre/dein Pedal unter „Einstellungen“, oder aktiviere unten die Tastatur-Alternative zum Testen.',
  'common.enableChordsBanner': 'Aktiviere mindestens {count} Akkorde in den Einstellungen, um zu spielen.',
  'common.chordsToUseLabel': 'Zu verwendende Akkorde',
  'common.noDiagram': 'kein Diagramm',

  // --- Chord Racer ---
  'racer.description':
    "Das Auto driftet in die Spur, deren Akkord du gerade hältst. Hindernisse fallen umso schneller, je länger du überlebst — wechsle Akkorde sauber und schnell, um ihnen auszuweichen.",
  'racer.lanesLabel': 'Spuren',
  'racer.laneLeft': 'Links',
  'racer.laneRight': 'Rechts',
  'racer.laneN': 'Spur {n}',
  'racer.kbFallbackLabel': 'Pfeiltasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'racer.difficultyHint':
    'Wähle einen Schwierigkeitsgrad, um direkt zu einer Voreinstellung zu springen. Von dort passt sie sich weiterhin automatisch an dich an: Ein Lauf, der fast sofort endet, senkt die Schwierigkeit und gibt dir mehr Reaktionsspielraum, ein Lauf, den du locker überstehst, verkürzt diesen Spielraum, und alles dazwischen erhöht ihn sanft mit der Zeit.',
  'racer.startSpeedStat': 'Startgeschwindigkeit: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Anstieg: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Reaktionsraum: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Hindernisabstand: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Auf Standard zurücksetzen',
  'racer.manualSpeedLabel': 'Startgeschwindigkeit manuell festlegen',
  'racer.setBtn': 'Festlegen',
  'racer.manualGapLabel': 'Minimale Zeit zwischen Hindernissen (Sekunden)',
  'racer.lanesHud': 'Spuren: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Guter Lauf — der nächste gibt dir etwas weniger Reaktionsspielraum.',
  'racer.feedbackDown':
    'Das ging schnell vorbei — der nächste gibt dir mehr Reaktionsspielraum, damit du Fuß fassen kannst.',
  'racer.feedbackSame': 'Die Schwierigkeit bleibt für den nächsten Lauf konstant.',

  // --- Chord Fight ---
  'fight.description':
    "Tritt gegen den Computer an. Er holt vor jedem Angriff kurz aus — halte den Akkord, den du <strong>Blocken</strong> zugewiesen hast, in diesem Moment, um ihn abzuwehren. Spiele einen Angriffsakkord, um zurückzuschlagen; jeder hat eine kurze Abklingzeit, sodass wirklich das Wechseln zwischen Akkorden Kämpfe gewinnt, nicht das Spammen eines einzelnen.",
  'fight.kbFallbackLabel': 'Zifferntasten-Alternative 1-4 aktivieren (zum Testen ohne Gitarre)',
  'fight.difficultyHint':
    'Steuert, wie schnell und hart der Computer angreift, und wie viel Vorwarnzeit dir seine Ansage zum Blocken gibt.',
  'fight.actionAttack': 'Angriff',
  'fight.actionKick': 'Tritt',
  'fight.actionSpecial': 'Spezial',
  'fight.actionBlock': 'Blocken',
  'fight.playerHpHud': 'Du:',
  'fight.cpuHpHud': 'CPU:',
  'fight.youLabel': 'Du',
  'fight.cpuLabel': 'CPU',
  'fight.blockedLabel': 'Geblockt!',
  'fight.winTitle': 'Du hast gewonnen!',
  'fight.loseTitle': 'K.o.',
  'fight.winHint': 'Starke Reflexe — blocke rechtzeitig und kontere sauber für eine Revanche.',
  'fight.loseHint': 'Diesmal hatte der Computer die Oberhand. Achte auf die Ansage und blocke sie.',
  'fight.damageDealt': 'Verursachter Schaden: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Halte den Akkord, der gerade als <strong>aktiv</strong> markiert ist, um zu steigen — lass los (oder spiele etwas anderes) und die Schwerkraft übernimmt. Der aktive Akkord wechselt während des Laufs ständig zwischen deinen zugewiesenen Akkorden, achte also auf die Legende, statt dich auf eine Form zu verlassen.",
  'flap.kbFallbackLabel': 'Zifferntasten-Alternative 1-4, gehalten, aktivieren (zum Testen ohne Gitarre)',
  'flap.difficultyHint':
    'Steuert, wie oft der aktive Akkord wechselt und wie eng die Rohre sind — niedrigere Stufen geben dir viel mehr Zeit, dich auf jeden Akkord einzustellen.',
  'flap.chordN': 'Akkord {n}',
  'flap.activeChordHud': 'Aktiver Akkord:',
  'flap.gameOverHint':
    'In ein Rohr oder den Rand gestürzt. Achte auf die Legende — der aktive Akkord ändert sich während des Laufs.',

  // --- Chord Pong ---
  'pong.description':
    'Halte den Ball im Spiel. Halte den Akkord <strong>Links bewegen</strong>, um den Schläger nach links zu bewegen, <strong>Rechts bewegen</strong> für rechts — lass los und der Schläger stoppt. Jeder Aufprall auf dem Schläger beschleunigt den Ball etwas, sodass ein langer Ballwechsel zunehmend schwerer am Leben zu halten ist.',
  'pong.moveLeft': 'Links bewegen',
  'pong.moveRight': 'Rechts bewegen',
  'pong.kbFallbackLabel': 'Pfeiltasten-Alternative, gehalten, aktivieren (zum Testen ohne Gitarre)',
  'pong.difficultyHint': 'Steuert Breite und Geschwindigkeit des Schlägers sowie Starttempo und Beschleunigung des Balls mit jedem Ballwechsel.',
  'pong.rallyHud': 'Ballwechsel:',
  'pong.gameOverHint':
    'Der Ball ist am Schläger vorbeigekommen. Längere Ballwechsel bedeuten einen schnelleren Ball — bleib zentriert, um beide Richtungen abzudecken.',

  // --- Chord Run ---
  'run.description':
    "Lauf weiter. Spiele den <strong>Sprung</strong>-Akkord, um über niedrige Hindernisse zu hüpfen — halte ihn, um weiter zu hüpfen — und halte den <strong>Ducken</strong>-Akkord, um unter hohen Hindernissen durchzugleiten. Du kannst immer nur eines gleichzeitig tun, sodass ein Lauf mit abwechselnden Hindernissen wirklich das Wechseln von Akkorden erfordert, nicht das Festhalten an einem.",
  'run.jump': 'Springen',
  'run.duck': 'Ducken',
  'run.kbFallbackLabel': 'Zifferntasten-Alternative 1-2 aktivieren (zum Testen ohne Gitarre)',
  'run.difficultyHint': 'Steuert, wie schnell die Welt scrollt, und die Mindestzeit zwischen Hindernissen.',
  'run.loadingEngine': '3D-Engine wird geladen…',
  'run.gameOverHint': 'Von einem Hindernis erwischt. Baumstämme brauchen einen Sprung, Balken ein Ducken — achte darauf, was kommt.',

  // --- Chord Snake ---
  'snake.description':
    "Klassisches Gitter-Snake — vier Akkorde steuern hoch/runter/links/rechts. Du kannst nicht direkt in deinen eigenen Körper zurückdrehen, eine falsch erkannte Akkordeingabe wird also einfach ignoriert, statt den Lauf zu beenden. Futter fressen lässt die Schlange wachsen und erhöht jedes Mal etwas das Tempo.",
  'snake.up': 'Hoch',
  'snake.down': 'Runter',
  'snake.left': 'Links',
  'snake.right': 'Rechts',
  'snake.kbFallbackLabel': 'Pfeiltasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'snake.difficultyHint':
    'Steuert, wie schnell die Schlange sich bewegt. Sauber zwischen vier Akkorden zu wechseln ist schwerer als zwischen zweien — starte also mit Sehr leicht oder Leicht, wenn das dein erster Lauf ist.',
  'snake.gameOverHint':
    'Gegen eine Wand oder den eigenen Schwanz gestoßen. Wenn dir vier Akkorde zu viel sind, gehe eine Schwierigkeitsstufe runter für mehr Zeit zwischen den Wendungen.',

  // --- Chord Stack ---
  'stack.description':
    "Klassisches Fallblock-Puzzle. Vier Akkorde steuern den Block: verschiebe ihn nach links oder rechts, drehe ihn, oder halte den vierten, damit er schneller fällt. Räume volle Reihen, um zu punkten — je mehr Reihen auf einmal, desto größer der Bonus.",
  'stack.moveLeft': 'Links bewegen',
  'stack.moveRight': 'Rechts bewegen',
  'stack.rotate': 'Drehen',
  'stack.softDrop': 'Schnellfall',
  'stack.kbFallbackLabel': 'Pfeiltasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'stack.difficultyHint': 'Steuert, wie schnell Blöcke fallen, und wie viel schneller geräumte Reihen sie fallen lassen.',
  'stack.gameOverHint': 'Der Stapel hat die Spitze erreicht. Volle Reihen zu räumen hält ihn niedrig — lass keine Lücken sich stapeln.',

  // --- Chord Chomp ---
  'chomp.description':
    "Steuere durch ein Labyrinth und friss Punkte, während Geister dich jagen. Vier Akkorde bewegen dich hoch/runter/links/rechts — eine Richtungsänderung wird vorgemerkt und tritt in Kraft, sobald du die nächste Kreuzung erreichst, sodass kein bildgenaues Timing nötig ist. Schnapp dir eine große, pulsierende Pille, um die Geister kurzzeitig essbar zu machen.",
  'chomp.up': 'Hoch',
  'chomp.down': 'Runter',
  'chomp.left': 'Links',
  'chomp.right': 'Rechts',
  'chomp.kbFallbackLabel': 'Pfeiltasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'chomp.difficultyHint': 'Steuert die Geschwindigkeit der Geister und wie viele dich jagen, sowie wie lange eine Pille sie essbar macht.',
  'chomp.gameOverHint': 'Von einem Geist ohne verbleibende Leben erwischt, oder das Labyrinth ist leer. Kraftpillen verschaffen dir ein Zeitfenster, um den Spieß umzudrehen.',

  // --- Chord Hopper ---
  'hopper.description':
    "Überquere eine Straße und einen Fluss, um die Plattformen auf der anderen Seite zu erreichen. Vier Akkorde bewegen dich hoch/runter/links/rechts, jeweils einen Sprung. Verkehr bedeutet sofortigen Tod — weiche ihm aus. Der Fluss hat keinen Boden, du überlebst nur, indem du auf einem Baumstamm reitest; auf offenem Wasser zu stehen, oder beim Reiten über einen der Ränder zu treiben, beendet den Lauf genauso schnell.",
  'hopper.up': 'Hoch',
  'hopper.down': 'Runter',
  'hopper.left': 'Links',
  'hopper.right': 'Rechts',
  'hopper.kbFallbackLabel': 'Pfeiltasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'hopper.difficultyHint': 'Steuert, wie schnell Verkehr und Baumstämme sich bewegen, und wie dicht sie gepackt sind.',
  'hopper.gameOverHint': 'Vom Verkehr erwischt, im Fluss ertrunken, oder zwischen den Plattformen gelandet. Beobachte die Spur, bevor du den Sprung wagst.',

  // --- Chord Highway ---
  'highway.description':
    "Noten fallen die Straße auf dich zu, jede Spur an einen deiner Akkorde gebunden. Anders als die anderen Spiele hier will dieses die echte Sache: halte in dem Moment, in dem eine Note die Trefferlinie kreuzt, den richtigen Akkord. Ein sauberer Treffer baut deine Combo auf; eine durchgelassene Note kostet Gesundheit. Gesundheit auf null, oder das ganze Set gespielt, beendet den Lauf.",
  'highway.lanesLabel': 'Spuren',
  'highway.laneN': 'Spur {n}',
  'highway.kbFallbackLabel': 'Zifferntasten-Alternative aktivieren (zum Testen ohne Gitarre)',
  'highway.difficultyHint': 'Steuert, wie schnell Noten fallen, wie dicht sie gepackt sind, und wie viel ein Fehltreffer dich kostet.',
  'highway.comboHud': 'Combo:',
  'highway.healthHud': 'Gesundheit:',
  'highway.gameOverHint': 'Zu viele Fehltreffer haben deine Gesundheit aufgebraucht, oder du hast das ganze Set durchgespielt. Die Combo baut sich schnell auf, sobald das Timing passt.',

  // --- Chord Blocks ---
  'blocks.description':
    "Eine originale Voxel-Bau-Sandbox — laufe durch eine kleine hügelige Welt und baue mit Gras-, Erd-, Stein-, Holz- und Laubblöcken, bevor die Zeit abläuft. Drei Akkorde steuern sie im Panzerstil: Vorwärts läuft in die Richtung, in die du schaust, und die anderen beiden drehen diese Blickrichtung nach links oder rechts — kein Mouse-Look nötig. Ein vierter Akkord springt.",
  'blocks.forward': 'Vorwärts',
  'blocks.turnLeft': 'Links drehen',
  'blocks.turnRight': 'Rechts drehen',
  'blocks.jump': 'Springen',
  'blocks.kbFallbackLabel': 'Pfeiltasten- und Leertaste-Alternative aktivieren (zum Testen ohne Gitarre)',
  'blocks.mouseHint': 'Linksklick zerstört den Block, den du ansiehst; Rechtsklick platziert deinen gewählten Blocktyp daran.',
  'blocks.difficultyHint': 'Steuert, wie lange deine Bausitzung dauert, und wie schnell du läufst und dich drehst.',
  'blocks.timeHud': 'Zeit:',
  'blocks.type.grass': 'Gras',
  'blocks.type.dirt': 'Erde',
  'blocks.type.stone': 'Stein',
  'blocks.type.wood': 'Holz',
  'blocks.type.leaves': 'Laub',
  'blocks.gameOverHint': 'Die Zeit ist abgelaufen. Punktzahl ist die Gesamtzahl der in dieser Sitzung platzierten Blöcke.',
};
