export const sv = {
  // --- Topbar / nav ---
  'nav.settings': 'Inställningar',
  'topbar.inputConnected': 'Ingång: Ljud — {device}',
  'topbar.inputNotConnected': 'Ingång: inte ansluten',
  'topbar.inputUnsupported': 'Ingång: stöds inte i den här webbläsaren',

  // --- Home ---
  'home.welcomeTitle': 'Välkommen',
  'home.welcomeBody':
    "Anslut din gitarrs USB-ljudgränssnitt/pedal så dyker den upp under <strong>Inställningar</strong> — välj den där (inte datorns inbyggda mikrofon) så körs ackordigenkänning direkt på den signalen. Inställningar har också ackordbiblioteket, så du kan se eller anpassa vilka ackord som känns igen, och sedan välja ett spel nedan.",
  'home.gamesTitle': 'Spel',
  'home.racerDesc': 'Styr mellan filer genom att byta ackord. Undvik hinder. Farten ökar med tiden.',
  'home.fightDesc': 'Möt datorn. Blockera dess aviserade attacker och slå tillbaka med olika ackord.',
  'home.flapDesc':
    "Håll det aktiva ackordet för att stiga och undvika rör — det roterar hela tiden, så en enda form bär dig inte hela vägen.",
  'home.pongDesc': 'Håll ett ackord för att flytta racketen åt vänster, ett annat för höger — håll bollen i spel.',
  'home.runDesc': 'Hoppa över stockar och ducka under bjälkar med två ackord. Håll hoppa för att fortsätta hoppa, håll ducka för att glida under.',
  'home.snakeDesc': "Fyra ackord styr upp/ner/vänster/höger. Klassisk orm — ät mat, krocka inte med dig själv eller en vägg.",
  'home.stackDesc': 'Klassiskt fallande-klossar-pussel. Flytta, rotera och släpp klossar med fyra ackord — rensa hela rader för poäng.',
  'home.chompDesc': 'Styr genom en labyrint och ät prickar medan spöken jagar dig. Ta en pulserande pastill för att kortvarigt vända på steken.',
  'home.hopperDesc': 'Ta dig över trafik och en flod av stockar med fyra ackord. Inget golv i vattnet — rid på en stock eller drunkna.',
  'home.highwayDesc': 'Toner faller ner en 3D-motorväg — håll rätt ackord i det ögonblick en ton korsar linjen för att poängsätta.',
  'home.blocksDesc': 'En original voxel-byggsandlåda. Gå, sväng och hoppa med ackord; slå sönder och placera klossar med musen.',
  'home.highScoresTitle': 'Topplistor',
  'home.highScoresDesc': "Se topp 10 för varje spel. Klarar du en topp-10-omgång blir du ombedd att ange ditt namn.",

  // --- Settings ---
  'settings.title': 'Inställningar',
  'settings.intro':
    "Lyssnar direkt på ditt USB-ljudgränssnitt/pedal — inte datorns inbyggda mikrofon — och känner igen ackord från själva ljudet. Välj den enhet din gitarr/pedal faktiskt visas som nedan, inte den inbyggda mikrofonen, och kalibrera sedan de ackord du planerar att använda — det spelar större roll än något annat här.",
  'settings.replayWizardBtn': 'Kör installationsguiden igen',
  'settings.languageTitle': 'Språk',
  'settings.audioInputTitle': 'Ljudingång',
  'settings.liveMonitorTitle': 'Live-monitor',
  'settings.liveMonitorHint': 'Slå an och håll ett ackord — de närvarande tonklasserna ska lysa upp nedan.',
  'settings.closestChord': 'Närmaste ackord:',
  'settings.levelUnknown': 'Nivå: —',
  'settings.levelDb': 'Nivå: {db} dB',
  'settings.matchedStatus': '✓ matchad — det här är vad spelen reagerar på',
  'settings.notConfidentStatus':
    'inte tillräckligt säker än (behöver {threshold}%) — försök kalibrera det här ackordet nedan',
  'settings.calibrateTitle': 'Kalibrera dina ackord',
  'settings.recalibrateTitle': 'Kalibrera om eller lägg till ett eget ackord',
  'settings.recalibrateHint':
    "För engångskalibrering av ett specifikt ackord, eller för att lägga till ett helt nytt som inte finns i den guidade listan ovan.",
  'settings.captureExistingBtn': 'Fånga för valt ackord',
  'settings.newChordPlaceholder': 't.ex. F#m',
  'settings.captureNewBtn': 'Fånga som nytt ackord',
  'settings.enableAudioFirst': 'Aktivera ljudingång ovan först.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'Den här webbläsaren stöder inte inspelning av ljudingång. Använd Chrome eller Edge.',
  'audio.enableBtn': 'Aktivera ljudingång',
  'audio.requestingPermission': 'Begär behörighet…',
  'audio.couldNotAccess':
    "Kunde inte komma åt ljudingång: {message}. Kontrollera webbläsarens webbplatsbehörigheter (hänglåsikonen i adressfältet).",
  'audio.disconnectBtn': 'Koppla från',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Aktivera några ackord i ackordbiblioteket först, kom sedan tillbaka hit.',
  'calibrate.allDone': 'Alla {count} aktiverade ackord är kalibrerade. Gå till startsidan för att spela, eller starta om för att göra om dem.',
  'calibrate.restartBtn': 'Starta om kalibrering',
  'calibrate.walkthroughHint':
    "Gå igenom varje ackord du använder och fånga dess verkliga ljud — det spelar större roll än något annat här, eftersom det faktiskt styr igenkänningen.",
  'calibrate.chordProgress': 'Ackord {index} av {total}',
  'calibrate.strumAndHold': 'Slå an och håll {chord}, fånga sedan.',
  'calibrate.captureBtn': 'Fånga {chord}',
  'calibrate.skipBtn': 'Hoppa över',
  'calibrate.connectAudioFirst': 'Anslut ljudingång först.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Ackordbibliotek',
  'library.intro':
    'Det här är ackorden appen känner igen. Kolumnen "Aktiverad" styr vilka ackord som är tillgängliga att tilldela i spel. För att lägga till ett nytt ackord eller kalibrera om ett som inte matchar tillförlitligt, använd kalibreringssektionerna ovan — att fånga ett ackords faktiska liveljud fungerar bättre än standardvärdena om din gitarr/pickup/pedal låter annorlunda än vad de förutsätter (standardstämning, öppen position).',
  'library.colEnabled': 'Aktiverad',
  'library.colName': 'Namn',
  'library.colHowToPlay': 'Så spelar du',
  'library.colNotes': 'Anteckningar',
  'library.colSource': 'Källa',
  'library.noDiagram': 'inget diagram',
  'library.capturedFromAudio': 'fångat från ljud',
  'library.deleteBtn': 'Ta bort',
  'library.confirmDelete': 'Ta bort det här ackordet från ditt bibliotek?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Välkommen till Chord Games',
  'onboarding.welcomeBody':
    'En snabb installation gör att din gitarr känns igen tillförlitligt — anslut din ljudingång och fånga ett par ackord. Två korta steg, och du gör det bara en gång.',
  'onboarding.startBtn': 'Nu kör vi →',
  'onboarding.skipAllBtn': 'Hoppa över installationen, ta mig till spelen',
  'onboarding.audioTitle': 'Anslut ditt ljud',
  'onboarding.audioBody':
    "Välj din gitarrs USB-ljudgränssnitt/pedal nedan — inte datorns inbyggda mikrofon. Det här är valfritt: alla spel har också en tangentbordslösning för att testa utan gitarr, och du kan alltid ansluta senare från Inställningar.",
  'onboarding.continueBtn': 'Fortsätt →',
  'onboarding.skipCalibrateBtn': 'Hoppa över, jag kalibrerar senare',
  'onboarding.doneTitle': 'Du är klar!',
  'onboarding.doneBody': 'Gå till spelen och börja spela. Du kan alltid köra den här guiden igen från Inställningar.',
  'onboarding.finishBtn': 'Fortsätt till spelen →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Superlätt',
  'level.easy': 'Lätt',
  'level.medium': 'Medel',
  'level.hard': 'Svår',
  'level.veryHard': 'Mycket svår',
  'level.insane': 'Galen',

  // --- High scores ---
  'highScores.empty': 'Inga topplistenoteringar än — bli den första!',
  'highScores.colRank': '#',
  'highScores.colName': 'Namn',
  'highScores.colScore': 'Poäng',
  'highScores.savedTo': 'Sparat på topplistan för {level}!',
  'highScores.newHighScore': 'Nytt rekord för {level}! Ange ditt namn för topplistan:',
  'highScores.namePlaceholder': 'Ditt namn',
  'highScores.saveBtn': 'Spara',
  'highScores.anonymous': 'Anonym',
  'highScores.title': 'Topplistor',
  'highScores.subtitle': 'Topp 10 för varje spel, spårat separat per svårighetsgrad, sparat på den här enheten.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Starta',
  'common.difficultyTitle': 'Svårighetsgrad',
  'common.quitBtn': 'Avsluta till inställningar',
  'common.gameOverTitle': 'Game over',
  'common.playAgainBtn': 'Spela igen',
  'common.changeSettingsBtn': 'Ändra inställningar',
  'common.scoreLabel': 'Poäng:',
  'common.noAudioBanner':
    'Ingen ljudingång ansluten. Anslut din gitarr/pedal under "Inställningar", eller aktivera tangentbordslösningen nedan för att testa.',
  'common.enableChordsBanner': 'Aktivera minst {count} ackord i Inställningar för att spela.',
  'common.chordsToUseLabel': 'Ackord att använda',
  'common.noDiagram': 'inget diagram',

  // --- Chord Racer ---
  'racer.description':
    "Bilen glider mot vilken fil som helst vars ackord du för tillfället håller. Hinder faller snabbare ju längre du överlever — byt ackord rent och snabbt för att undvika dem.",
  'racer.lanesLabel': 'Filer',
  'racer.laneLeft': 'Vänster',
  'racer.laneRight': 'Höger',
  'racer.laneN': 'Fil {n}',
  'racer.kbFallbackLabel': 'Aktivera piltangentslösning (för att testa utan gitarr)',
  'racer.difficultyHint':
    'Välj en nivå för att hoppa direkt till en förinställning. Därifrån anpassar den sig ändå automatiskt till dig: en omgång som slutar nästan omedelbart mjukar upp svårighetsgraden och ger dig mer tid att reagera, en omgång du klarar bekvämt förkortar den tiden, och allt däremellan höjer den försiktigt över tid.',
  'racer.startSpeedStat': 'Starthastighet: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Ökning: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Reaktionsutrymme: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Avstånd mellan hinder: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Återställ till standard',
  'racer.manualSpeedLabel': 'Ställ in starthastighet manuellt',
  'racer.setBtn': 'Ställ in',
  'racer.manualGapLabel': 'Minsta tid mellan hinder (sekunder)',
  'racer.lanesHud': 'Filer: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Bra omgång — nästa ger dig lite mindre tid att reagera.',
  'racer.feedbackDown':
    'Den var över snabbt — nästa ger dig mer tid att reagera så du kan hitta fotfäste.',
  'racer.feedbackSame': 'Svårighetsgraden hålls stabil till nästa omgång.',

  // --- Chord Fight ---
  'fight.description':
    "Möt datorn. Den förbereder sig kort innan varje attack — håll det ackord du har tilldelat <strong>Blockera</strong> under det ögonblicket för att avvärja den. Spela ett attackackord för att slå tillbaka; varje har en kort nedkylning, så det är att byta mellan ackord som faktiskt vinner strider, inte att spamma ett enda.",
  'fight.kbFallbackLabel': 'Aktivera sifferlösning 1-4 (för att testa utan gitarr)',
  'fight.difficultyHint':
    'Styr hur snabbt och hårt datorn attackerar, och hur lång varningstid dess förberedelse ger dig att blockera.',
  'fight.actionAttack': 'Attack',
  'fight.actionKick': 'Spark',
  'fight.actionSpecial': 'Special',
  'fight.actionBlock': 'Blockera',
  'fight.playerHpHud': 'Du:',
  'fight.cpuHpHud': 'Dator:',
  'fight.youLabel': 'Du',
  'fight.cpuLabel': 'Dator',
  'fight.blockedLabel': 'Blockerad!',
  'fight.winTitle': 'Du vann!',
  'fight.loseTitle': 'Utslagen',
  'fight.winHint': 'Snygga reflexer — blockera i tid och slå rent tillbaka för en revansch.',
  'fight.loseHint': 'Datorn fick övertaget den här gången. Bevaka förberedelsen och blockera den.',
  'fight.damageDealt': 'Utdelad skada: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Håll det ackord som för tillfället är markerat <strong>aktivt</strong> för att stiga — släpp (eller spela något annat) så tar tyngdkraften över. Det aktiva ackordet fortsätter rotera bland dina tilldelade ackord under omgången, så håll koll på förklaringen istället för att slå dig till ro med en enda form.",
  'flap.kbFallbackLabel': 'Aktivera sifferlösning 1-4, nedhållen (för att testa utan gitarr)',
  'flap.difficultyHint':
    'Styr hur ofta det aktiva ackordet roterar och hur trånga rören är — de lägre nivåerna ger dig mycket mer tid att sätta dig in i varje ackord.',
  'flap.chordN': 'Ackord {n}',
  'flap.activeChordHud': 'Aktivt ackord:',
  'flap.gameOverHint':
    'Kraschade in i ett rör eller kanten. Håll koll på förklaringen — det aktiva ackordet ändras under omgången.',

  // --- Chord Pong ---
  'pong.description':
    'Håll bollen i spel. Håll ackordet <strong>Flytta vänster</strong> för att flytta racketen åt vänster, <strong>Flytta höger</strong> för att flytta den åt höger — släpp och racketen stannar. Varje studs mot racketen gör bollen lite snabbare, så en lång boll blir gradvis svårare att hålla vid liv.',
  'pong.moveLeft': 'Flytta vänster',
  'pong.moveRight': 'Flytta höger',
  'pong.kbFallbackLabel': 'Aktivera piltangentslösning, nedhållen (för att testa utan gitarr)',
  'pong.difficultyHint': 'Styr racketens bredd och hastighet, samt hur snabbt bollen startar och ökar med varje boll.',
  'pong.rallyHud': 'Boll:',
  'pong.gameOverHint':
    'Bollen kom förbi racketen. Längre bollar innebär en snabbare boll — håll dig centrerad så du kan täcka båda riktningarna.',

  // --- Chord Run ---
  'run.description':
    "Fortsätt springa. Spela <strong>Hoppa</strong>-ackordet för att hoppa över låga hinder — håll det så fortsätter du hoppa — och håll <strong>Ducka</strong>-ackordet för att glida under höga hinder. Du kan bara göra en sak i taget, så en serie omväxlande hinder innebär att verkligen byta ackord, inte att välja ett och hålla det för alltid.",
  'run.jump': 'Hoppa',
  'run.duck': 'Ducka',
  'run.kbFallbackLabel': 'Aktivera sifferlösning 1-2 (för att testa utan gitarr)',
  'run.difficultyHint': 'Styr hur snabbt världen rullar och minsta tiden mellan hinder.',
  'run.loadingEngine': 'Laddar 3D-motor…',
  'run.gameOverHint': 'Fångad av ett hinder. Stockar kräver ett hopp, bjälkar kräver en duck — håll koll på vad som kommer.',

  // --- Chord Snake ---
  'snake.description':
    "Klassisk rutnätsorm — fyra ackord styr upp/ner/vänster/höger. Du kan inte svänga rakt tillbaka in i din egen kropp, så en felaktig ackordmatchning ignoreras bara istället för att avsluta omgången. Att äta mat gör ormen längre och gör spelet lite snabbare varje gång.",
  'snake.up': 'Upp',
  'snake.down': 'Ner',
  'snake.left': 'Vänster',
  'snake.right': 'Höger',
  'snake.kbFallbackLabel': 'Aktivera piltangentslösning (för att testa utan gitarr)',
  'snake.difficultyHint':
    'Styr hur snabbt ormen rör sig. Att byta rent mellan fyra ackord är svårare än två, så börja på Superlätt eller Lätt om det här är din första omgång.',
  'snake.gameOverHint':
    'Träffade en vägg eller din egen svans. Om fyra ackord känns som mycket, gå ner en svårighetsgrad för mer tid mellan svängarna.',

  // --- Chord Stack ---
  'stack.description':
    "Klassiskt fallande-klossar-pussel. Fyra ackord styr klossen: flytta den åt vänster eller höger, rotera den, eller håll den fjärde för att få den att falla snabbare. Rensa hela rader för att poängsätta — ju fler på en gång, desto större bonus.",
  'stack.moveLeft': 'Flytta vänster',
  'stack.moveRight': 'Flytta höger',
  'stack.rotate': 'Rotera',
  'stack.softDrop': 'Snabbfall',
  'stack.kbFallbackLabel': 'Aktivera piltangentslösning (för att testa utan gitarr)',
  'stack.difficultyHint': 'Styr hur snabbt klossar faller, och hur mycket snabbare rensade rader gör dem.',
  'stack.gameOverHint': 'Högen nådde toppen. Att rensa hela rader håller den låg — låt inte luckor hopa sig.',

  // --- Chord Chomp ---
  'chomp.description':
    "Styr genom en labyrint och ät prickar medan spöken jagar dig. Fyra ackord flyttar dig upp/ner/vänster/höger — en sväng köas och träder i kraft så snart du når nästa korsning, så det kräver ingen bildperfekt timing. Ta en stor pulserande pastill för att kortvarigt göra spökena ätbara.",
  'chomp.up': 'Upp',
  'chomp.down': 'Ner',
  'chomp.left': 'Vänster',
  'chomp.right': 'Höger',
  'chomp.kbFallbackLabel': 'Aktivera piltangentslösning (för att testa utan gitarr)',
  'chomp.difficultyHint': 'Styr spökenas fart och hur många som jagar dig, samt hur länge en pastill gör dem ätbara.',
  'chomp.gameOverHint': 'Fångad av ett spöke utan liv kvar, eller labyrinten är tom. Kraftpastiller ger dig ett fönster att vända på steken.',

  // --- Chord Hopper ---
  'hopper.description':
    "Ta dig över en väg och en flod för att nå plattorna på andra sidan. Fyra ackord flyttar dig upp/ner/vänster/höger, ett hopp i taget. Trafik är omedelbar död — undvik den. Floden har inget golv, så du överlever bara genom att rida på en stock; att stå i öppet vatten, eller driva av vid någon av kanterna medan du rider, avslutar omgången lika snabbt.",
  'hopper.up': 'Upp',
  'hopper.down': 'Ner',
  'hopper.left': 'Vänster',
  'hopper.right': 'Höger',
  'hopper.kbFallbackLabel': 'Aktivera piltangentslösning (för att testa utan gitarr)',
  'hopper.difficultyHint': 'Styr hur snabbt trafik och stockar rör sig, och hur tätt packade de är.',
  'hopper.gameOverHint': 'Träffad av trafik, drunknad i floden, eller landade mellan plattorna. Studera filen innan du gör hoppet.',

  // --- Chord Highway ---
  'highway.description':
    "Toner faller ner motorvägen mot dig, varje fil kopplad till ett av dina ackord. Till skillnad från de andra spelen här vill det här ha den riktiga varan: håll rätt ackord i det ögonblick en ton korsar trefflinjen. En ren träff bygger din combo; att låta en passera kostar hälsa. Hälsa på noll, eller att du spelar igenom hela setet, avslutar omgången.",
  'highway.lanesLabel': 'Filer',
  'highway.laneN': 'Fil {n}',
  'highway.kbFallbackLabel': 'Aktivera sifferlösning (för att testa utan gitarr)',
  'highway.difficultyHint': 'Styr hur snabbt toner faller, hur tätt packade de är, och hur mycket ett missat kostar dig.',
  'highway.comboHud': 'Combo:',
  'highway.healthHud': 'Hälsa:',
  'highway.gameOverHint': 'För många missar tömde din hälsa, eller så spelade du igenom hela setet. Combon byggs upp snabbt när timingen klaffar.',

  // --- Chord Blocks ---
  'blocks.description':
    "En original voxel-byggsandlåda — gå runt i en liten kuperad värld och bygg med gräs-, jord-, sten-, trä- och lövklossar innan tiden tar slut. Tre ackord styr den stridsvagnsstil: Framåt går den väg du vänder dig, och de andra två svänger den riktningen vänster eller höger — ingen musblick behövs. Ett fjärde ackord hoppar.",
  'blocks.forward': 'Framåt',
  'blocks.turnLeft': 'Sväng vänster',
  'blocks.turnRight': 'Sväng höger',
  'blocks.jump': 'Hoppa',
  'blocks.kbFallbackLabel': 'Aktivera piltangents- och mellanslagslösning (för att testa utan gitarr)',
  'blocks.mouseHint': 'Vänsterklick slår sönder klossen du vänder dig mot; högerklick placerar din valda klosstyp mot den.',
  'blocks.difficultyHint': 'Styr hur länge din byggsession varar, och hur snabbt du går och svänger.',
  'blocks.timeHud': 'Tid:',
  'blocks.type.grass': 'Gräs',
  'blocks.type.dirt': 'Jord',
  'blocks.type.stone': 'Sten',
  'blocks.type.wood': 'Trä',
  'blocks.type.leaves': 'Löv',
  'blocks.gameOverHint': 'Tiden är slut. Poäng är totalt antal klossar placerade denna session.',
};
