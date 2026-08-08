export const fr = {
  // --- Topbar / nav ---
  'nav.settings': 'Paramètres',
  'topbar.inputConnected': 'Entrée : Audio — {device}',
  'topbar.inputNotConnected': 'Entrée : non connectée',
  'topbar.inputUnsupported': 'Entrée : non prise en charge par ce navigateur',

  // --- Home ---
  'home.welcomeTitle': 'Bienvenue',
  'home.welcomeBody':
    "Connectez l'interface audio USB/pédale de votre guitare, elle apparaîtra dans <strong>Paramètres</strong> — choisissez-la là-bas (pas le micro intégré de votre ordinateur) pour que la reconnaissance d'accords fonctionne directement sur ce signal. Paramètres contient aussi la bibliothèque d'accords, où vous pouvez voir ou personnaliser les accords reconnus, puis choisir un jeu ci-dessous.",
  'home.gamesTitle': 'Jeux',
  'home.racerDesc': 'Changez de voie en changeant d\'accords. Évitez les obstacles. La vitesse augmente avec le temps.',
  'home.fightDesc': "Affrontez l'ordinateur. Bloquez ses attaques annoncées et ripostez avec différents accords.",
  'home.flapDesc':
    "Maintenez l'accord actif pour monter et éviter les tuyaux — il change constamment, donc une seule forme ne suffira pas.",
  'home.pongDesc': "Maintenez un accord pour déplacer la raquette à gauche, un autre pour la droite — gardez la balle en jeu.",
  'home.runDesc': "Sautez par-dessus les rondins et baissez-vous sous les poutres avec deux accords. Maintenez sauter pour enchaîner les sauts, maintenez se baisser pour glisser dessous.",
  'home.snakeDesc': "Quatre accords dirigent haut/bas/gauche/droite. Snake classique — mangez, ne heurtez ni vous-même ni un mur.",
  'home.stackDesc': 'Puzzle classique de blocs qui tombent. Déplacez, tournez et faites tomber les pièces avec quatre accords — videz des lignes complètes pour marquer.',
  'home.chompDesc': "Traversez un labyrinthe en mangeant des points pendant que des fantômes vous traquent. Prenez une pastille pour brièvement inverser les rôles.",
  'home.hopperDesc': 'Traversez la circulation et une rivière de rondins avec quatre accords. Pas de fond dans l\'eau — montez sur un rondin ou coulez.',
  'home.highwayDesc': "Des notes tombent sur une autoroute en 3D — tenez le bon accord à l'instant où une note franchit la ligne pour marquer.",
  'home.blocksDesc': "Un bac à sable de construction voxel original. Marchez, tournez et sautez avec des accords ; cassez et posez des blocs à la souris.",
  'home.highScoresTitle': 'Meilleurs scores',
  'home.highScoresDesc': "Consultez le top 10 de chaque jeu. Atteignez le top 10 et on vous demandera votre nom.",

  // --- Settings ---
  'settings.title': 'Paramètres',
  'settings.intro':
    "Écoute directement votre interface audio USB/pédale — pas le micro intégré de votre ordinateur — et détecte les accords à partir du son lui-même. Choisissez ci-dessous l'appareil sous lequel apparaît réellement votre guitare/pédale, pas le micro intégré, puis calibrez les accords que vous prévoyez d'utiliser — c'est ce qui compte le plus ici.",
  'settings.replayWizardBtn': "Relancer l'assistant de configuration",
  'settings.languageTitle': 'Langue',
  'settings.audioInputTitle': 'Entrée audio',
  'settings.liveMonitorTitle': 'Moniteur en direct',
  'settings.liveMonitorHint': "Jouez et maintenez un accord — les classes de hauteur présentes devraient s'allumer ci-dessous.",
  'settings.closestChord': 'Accord le plus proche :',
  'settings.levelUnknown': 'Niveau : —',
  'settings.levelDb': 'Niveau : {db} dB',
  'settings.matchedStatus': '✓ reconnu — c\'est ce à quoi les jeux réagiront',
  'settings.notConfidentStatus':
    'pas encore assez fiable ({threshold}% requis) — essayez de calibrer cet accord ci-dessous',
  'settings.calibrateTitle': 'Calibrez vos accords',
  'settings.recalibrateTitle': 'Recalibrer ou ajouter un accord personnalisé',
  'settings.recalibrateHint':
    "Pour recalibrer ponctuellement un accord spécifique, ou en ajouter un tout nouveau qui n'est pas dans la liste guidée ci-dessus.",
  'settings.captureExistingBtn': "Capturer pour l'accord sélectionné",
  'settings.newChordPlaceholder': 'ex. F#m',
  'settings.captureNewBtn': 'Capturer comme nouvel accord',
  'settings.enableAudioFirst': "Activez d'abord l'entrée audio ci-dessus.",

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': "Ce navigateur ne prend pas en charge la capture d'entrée audio. Utilisez Chrome ou Edge.",
  'audio.enableBtn': "Activer l'entrée audio",
  'audio.requestingPermission': 'Demande de permission…',
  'audio.couldNotAccess':
    "Impossible d'accéder à l'entrée audio : {message}. Vérifiez les autorisations du site dans le navigateur (icône de cadenas dans la barre d'adresse).",
  'audio.disconnectBtn': 'Déconnecter',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': "Activez d'abord des accords dans la bibliothèque d'accords, puis revenez ici.",
  'calibrate.allDone': 'Les {count} accords activés sont calibrés. Rendez-vous à l\'accueil pour jouer, ou recommencez pour les refaire.',
  'calibrate.restartBtn': 'Recommencer la calibration',
  'calibrate.walkthroughHint':
    "Passez en revue chaque accord que vous utilisez et capturez son vrai son — c'est ce qui compte le plus ici, puisque c'est ce qui pilote réellement la reconnaissance.",
  'calibrate.chordProgress': 'Accord {index} sur {total}',
  'calibrate.strumAndHold': 'Jouez et maintenez {chord}, puis capturez.',
  'calibrate.captureBtn': 'Capturer {chord}',
  'calibrate.skipBtn': 'Passer',
  'calibrate.connectAudioFirst': "Connectez d'abord une entrée audio.",

  // --- Chord Library (embedded in Settings) ---
  'library.title': "Bibliothèque d'accords",
  'library.intro':
    "Voici les accords que l'application reconnaît. La colonne « Activé » détermine quels accords sont disponibles à assigner dans les jeux. Pour ajouter un nouvel accord ou en recalibrer un qui ne correspond pas de façon fiable, utilisez les sections de calibration ci-dessus — capturer le son réel d'un accord fonctionne mieux que les valeurs par défaut si votre guitare/micro/pédale sonne différemment de ce qu'elles supposent (accordage standard, position ouverte).",
  'library.colEnabled': 'Activé',
  'library.colName': 'Nom',
  'library.colHowToPlay': 'Comment jouer',
  'library.colNotes': 'Notes',
  'library.colSource': 'Source',
  'library.noDiagram': 'pas de diagramme',
  'library.capturedFromAudio': 'capturé depuis l\'audio',
  'library.deleteBtn': 'Supprimer',
  'library.confirmDelete': 'Supprimer cet accord de votre bibliothèque ?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Bienvenue dans Chord Games',
  'onboarding.welcomeBody':
    'Une configuration rapide permet une reconnaissance fiable de votre guitare — connectez votre entrée audio et capturez quelques accords. Deux étapes courtes, à faire une seule fois.',
  'onboarding.startBtn': 'C\'est parti →',
  'onboarding.skipAllBtn': 'Passer la configuration, direct aux jeux',
  'onboarding.audioTitle': 'Connectez votre audio',
  'onboarding.audioBody':
    "Choisissez ci-dessous l'interface audio USB/pédale de votre guitare — pas le micro intégré de votre ordinateur. C'est optionnel : chaque jeu propose aussi une solution clavier pour tester sans guitare, et vous pourrez toujours vous connecter plus tard depuis Paramètres.",
  'onboarding.continueBtn': 'Continuer →',
  'onboarding.skipCalibrateBtn': 'Passer, je calibrerai plus tard',
  'onboarding.doneTitle': 'Vous êtes prêt !',
  'onboarding.doneBody': 'Rendez-vous dans les jeux pour commencer à jouer. Vous pouvez revoir ce guide à tout moment depuis Paramètres.',
  'onboarding.finishBtn': 'Continuer vers les jeux →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Très facile',
  'level.easy': 'Facile',
  'level.medium': 'Moyen',
  'level.hard': 'Difficile',
  'level.veryHard': 'Très difficile',
  'level.insane': 'Extrême',

  // --- High scores ---
  'highScores.empty': 'Pas encore de meilleur score — soyez le premier !',
  'highScores.colRank': '#',
  'highScores.colName': 'Nom',
  'highScores.colScore': 'Score',
  'highScores.savedTo': 'Enregistré au classement {level} !',
  'highScores.newHighScore': 'Nouveau record {level} ! Entrez votre nom pour le classement :',
  'highScores.namePlaceholder': 'Votre nom',
  'highScores.saveBtn': 'Enregistrer',
  'highScores.anonymous': 'Anonyme',
  'highScores.title': 'Meilleurs scores',
  'highScores.subtitle': 'Top 10 pour chaque jeu, suivi séparément par niveau de difficulté, enregistré sur cet appareil.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Démarrer',
  'common.difficultyTitle': 'Difficulté',
  'common.quitBtn': 'Quitter vers la configuration',
  'common.gameOverTitle': 'Partie terminée',
  'common.playAgainBtn': 'Rejouer',
  'common.changeSettingsBtn': 'Modifier les paramètres',
  'common.scoreLabel': 'Score :',
  'common.noAudioBanner':
    'Aucune entrée audio connectée. Connectez votre guitare/pédale dans « Paramètres », ou activez la solution clavier ci-dessous pour tester.',
  'common.enableChordsBanner': 'Activez au moins {count} accords dans Paramètres pour jouer.',
  'common.chordsToUseLabel': 'Accords à utiliser',
  'common.noDiagram': 'pas de diagramme',

  // --- Chord Racer ---
  'racer.description':
    "La voiture dérive vers la voie de l'accord que vous maintenez actuellement. Les obstacles tombent plus vite plus vous survivez longtemps — changez d'accords proprement et rapidement pour les éviter.",
  'racer.lanesLabel': 'Voies',
  'racer.laneLeft': 'Gauche',
  'racer.laneRight': 'Droite',
  'racer.laneN': 'Voie {n}',
  'racer.kbFallbackLabel': 'Activer la solution flèches (pour tester sans guitare)',
  'racer.difficultyHint':
    "Choisissez un niveau pour passer directement à un préréglage. Ensuite, le jeu s'adapte toujours automatiquement à vous : une partie qui se termine presque instantanément réduit la difficulté et vous laisse plus de temps de réaction, une partie que vous survivez facilement raccourcit ce temps, et tout ce qui est entre les deux l'augmente doucement avec le temps.",
  'racer.startSpeedStat': 'Vitesse initiale : <strong>{value}</strong> px/s',
  'racer.rampStat': 'Montée : <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Marge de réaction : <strong>{value}</strong> px',
  'racer.obstacleGapStat': "Écart entre obstacles : <strong>{value}</strong> s",
  'racer.resetDifficultyBtn': 'Réinitialiser par défaut',
  'racer.manualSpeedLabel': 'Définir la vitesse initiale manuellement',
  'racer.setBtn': 'Définir',
  'racer.manualGapLabel': 'Temps minimum entre les obstacles (secondes)',
  'racer.lanesHud': 'Voies : <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Belle partie — la prochaine vous laissera un peu moins de marge de réaction.',
  'racer.feedbackDown':
    "Ça a été rapide — la prochaine vous laissera plus de marge de réaction pour prendre vos repères.",
  'racer.feedbackSame': 'La difficulté reste stable pour la prochaine partie.',

  // --- Chord Fight ---
  'fight.description':
    "Affrontez l'ordinateur. Il s'apprête brièvement avant chaque attaque — maintenez l'accord que vous avez assigné à <strong>Bloquer</strong> durant ce moment pour l'annuler. Jouez un accord d'attaque pour riposter ; chacun a un court temps de recharge, donc c'est le changement d'accords qui gagne réellement les combats, pas le fait de spammer un seul.",
  'fight.kbFallbackLabel': 'Activer la solution chiffres 1-4 (pour tester sans guitare)',
  'fight.difficultyHint':
    "Contrôle la vitesse et la puissance des attaques de l'ordinateur, ainsi que le temps que son annonce vous laisse pour bloquer.",
  'fight.actionAttack': 'Attaque',
  'fight.actionKick': 'Coup de pied',
  'fight.actionSpecial': 'Spécial',
  'fight.actionBlock': 'Bloquer',
  'fight.playerHpHud': 'Vous :',
  'fight.cpuHpHud': 'Ordi :',
  'fight.youLabel': 'Vous',
  'fight.cpuLabel': 'Ordi',
  'fight.blockedLabel': 'Bloqué !',
  'fight.winTitle': 'Vous avez gagné !',
  'fight.loseTitle': 'K.O.',
  'fight.winHint': 'Beaux réflexes — bloquez au bon moment et ripostez proprement pour une revanche.',
  'fight.loseHint': "L'ordinateur a eu le dessus cette fois. Surveillez l'annonce et bloquez-la.",
  'fight.damageDealt': 'Dégâts infligés : <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Maintenez l'accord actuellement marqué <strong>actif</strong> pour monter — relâchez (ou jouez autre chose) et la gravité reprend le dessus. L'accord actif change continuellement parmi vos accords assignés durant la partie, alors surveillez la légende plutôt que de vous installer sur une seule forme.",
  'flap.kbFallbackLabel': 'Activer la solution chiffres 1-4, maintenus (pour tester sans guitare)',
  'flap.difficultyHint':
    "Contrôle la fréquence de changement de l'accord actif et la largeur des tuyaux — les niveaux les plus bas vous laissent beaucoup plus de temps pour vous installer sur chaque accord.",
  'flap.chordN': 'Accord {n}',
  'flap.activeChordHud': 'Accord actif :',
  'flap.gameOverHint':
    "Percuté un tuyau ou le bord. Surveillez la légende — l'accord actif change tout au long de la partie.",

  // --- Chord Pong ---
  'pong.description':
    "Gardez la balle en jeu. Maintenez l'accord <strong>Aller à gauche</strong> pour déplacer la raquette vers la gauche, <strong>Aller à droite</strong> pour la droite — relâchez et la raquette s'arrête. Chaque rebond sur la raquette accélère un peu la balle, donc un long échange devient progressivement plus difficile à maintenir.",
  'pong.moveLeft': 'Aller à gauche',
  'pong.moveRight': 'Aller à droite',
  'pong.kbFallbackLabel': 'Activer la solution flèches, maintenues (pour tester sans guitare)',
  'pong.difficultyHint': "Contrôle la largeur et la vitesse de la raquette, ainsi que la vitesse initiale et l'accélération de la balle à chaque échange.",
  'pong.rallyHud': 'Échange :',
  'pong.gameOverHint':
    "La balle a dépassé la raquette. Des échanges plus longs signifient une balle plus rapide — restez centré pour couvrir les deux directions.",

  // --- Chord Run ---
  'run.description':
    "Continuez à courir. Jouez l'accord <strong>Sauter</strong> pour sauter par-dessus les obstacles bas — maintenez-le pour enchaîner les sauts — et maintenez l'accord <strong>Se baisser</strong> pour glisser sous les obstacles hauts. Vous ne pouvez faire qu'une chose à la fois, donc une série d'obstacles alternés signifie changer réellement d'accords, pas en garder un seul indéfiniment.",
  'run.jump': 'Sauter',
  'run.duck': 'Se baisser',
  'run.kbFallbackLabel': 'Activer la solution chiffres 1-2 (pour tester sans guitare)',
  'run.difficultyHint': "Contrôle la vitesse de défilement du monde et le temps minimum entre les obstacles.",
  'run.loadingEngine': 'Chargement du moteur 3D…',
  'run.gameOverHint': "Attrapé par un obstacle. Les rondins demandent un saut, les poutres demandent de se baisser — surveillez ce qui arrive.",

  // --- Chord Snake ---
  'snake.description':
    "Snake classique sur grille — quatre accords dirigent haut/bas/gauche/droite. Vous ne pouvez pas faire demi-tour directement dans votre propre corps, donc une reconnaissance d'accord erronée est simplement ignorée plutôt que de terminer la partie. Manger de la nourriture fait grandir le serpent et accélère un peu le jeu à chaque fois.",
  'snake.up': 'Haut',
  'snake.down': 'Bas',
  'snake.left': 'Gauche',
  'snake.right': 'Droite',
  'snake.kbFallbackLabel': 'Activer la solution flèches (pour tester sans guitare)',
  'snake.difficultyHint':
    "Contrôle la vitesse de déplacement du serpent. Changer proprement entre quatre accords est plus difficile qu'entre deux, alors commencez par Très facile ou Facile si c'est votre première partie.",
  'snake.gameOverHint':
    "Touché un mur ou votre propre queue. Si quatre accords semblent difficiles à gérer, baissez le niveau de difficulté pour plus de temps entre les virages.",

  // --- Chord Stack ---
  'stack.description':
    "Puzzle classique de blocs qui tombent. Quatre accords pilotent la pièce : déplacez-la à gauche ou à droite, tournez-la, ou maintenez le quatrième pour la faire tomber plus vite. Videz des lignes complètes pour marquer — plus il y en a d'un coup, plus le bonus est gros.",
  'stack.moveLeft': 'Déplacer à gauche',
  'stack.moveRight': 'Déplacer à droite',
  'stack.rotate': 'Tourner',
  'stack.softDrop': 'Chute rapide',
  'stack.kbFallbackLabel': 'Activer la solution flèches (pour tester sans guitare)',
  'stack.difficultyHint': 'Contrôle la vitesse de chute des pièces, et à quel point vider des lignes l\'accélère.',
  'stack.gameOverHint': "La pile a atteint le sommet. Vider des lignes complètes la garde basse — ne laissez pas les trous s'accumuler.",

  // --- Chord Chomp ---
  'chomp.description':
    "Traversez un labyrinthe en mangeant des points pendant que des fantômes vous traquent. Quatre accords vous déplacent haut/bas/gauche/droite — un virage est mis en attente et prend effet dès que vous atteignez la prochaine intersection, sans besoin d'un timing au pixel près. Prenez une grosse pastille pulsante pour rendre brièvement les fantômes comestibles.",
  'chomp.up': 'Haut',
  'chomp.down': 'Bas',
  'chomp.left': 'Gauche',
  'chomp.right': 'Droite',
  'chomp.kbFallbackLabel': 'Activer la solution flèches (pour tester sans guitare)',
  'chomp.difficultyHint': 'Contrôle la vitesse des fantômes et leur nombre, ainsi que la durée pendant laquelle une pastille les rend comestibles.',
  'chomp.gameOverHint': "Attrapé par un fantôme sans vie restante, ou le labyrinthe est nettoyé. Les pastilles vous offrent une fenêtre pour inverser les rôles.",

  // --- Chord Hopper ---
  'hopper.description':
    "Traversez une route puis une rivière pour atteindre les nénuphars de l'autre côté. Quatre accords vous déplacent haut/bas/gauche/droite, un bond à la fois. La circulation, c'est la mort instantanée — évitez-la. La rivière n'a pas de fond, vous ne survivez qu'en montant sur un rondin ; rester sur l'eau libre, ou dériver hors des bords en montant sur un rondin, termine la partie tout aussi vite.",
  'hopper.up': 'Haut',
  'hopper.down': 'Bas',
  'hopper.left': 'Gauche',
  'hopper.right': 'Droite',
  'hopper.kbFallbackLabel': 'Activer la solution flèches (pour tester sans guitare)',
  'hopper.difficultyHint': 'Contrôle la vitesse de la circulation et des rondins, et leur densité.',
  'hopper.gameOverHint': "Heurté par la circulation, noyé dans la rivière, ou atterri entre les nénuphars. Observez la voie avant de vous engager dans le bond.",

  // --- Chord Highway ---
  'highway.description':
    "Des notes tombent sur l'autoroute vers vous, chaque voie liée à l'un de vos accords. Contrairement aux autres jeux ici, celui-ci veut la vraie chose : tenez le bon accord à l'instant où une note franchit la ligne de frappe. Un coup net fait grimper votre combo ; en laisser passer une coûte de la santé. Santé à zéro, ou le set entier joué, met fin à la partie.",
  'highway.lanesLabel': 'Voies',
  'highway.laneN': 'Voie {n}',
  'highway.kbFallbackLabel': 'Activer la solution chiffres (pour tester sans guitare)',
  'highway.difficultyHint': 'Contrôle la vitesse de chute des notes, leur densité, et le coût d\'une note manquée.',
  'highway.comboHud': 'Combo :',
  'highway.healthHud': 'Santé :',
  'highway.gameOverHint': "Trop de notes manquées ont vidé votre santé, ou vous avez joué tout le set. Le combo grimpe vite une fois le timing acquis.",

  // --- Chord Blocks ---
  'blocks.description':
    "Un bac à sable de construction voxel original — parcourez un petit monde vallonné et construisez avec des blocs d'herbe, de terre, de pierre, de bois et de feuilles avant la fin du chrono. Trois accords le pilotent façon char d'assaut : Avancer marche dans la direction où vous regardez, et les deux autres tournent cette direction à gauche ou à droite — pas besoin de viser à la souris. Un quatrième accord fait sauter.",
  'blocks.forward': 'Avancer',
  'blocks.turnLeft': 'Tourner à gauche',
  'blocks.turnRight': 'Tourner à droite',
  'blocks.jump': 'Sauter',
  'blocks.kbFallbackLabel': 'Activer la solution flèches + espace (pour tester sans guitare)',
  'blocks.mouseHint': 'Clic gauche pour casser le bloc en face de vous ; clic droit pour poser le type de bloc sélectionné contre lui.',
  'blocks.difficultyHint': 'Contrôle la durée de votre session de construction, et votre vitesse de marche et de rotation.',
  'blocks.timeHud': 'Temps :',
  'blocks.type.grass': 'Herbe',
  'blocks.type.dirt': 'Terre',
  'blocks.type.stone': 'Pierre',
  'blocks.type.wood': 'Bois',
  'blocks.type.leaves': 'Feuilles',
  'blocks.gameOverHint': "Le temps est écoulé. Le score correspond au nombre total de blocs posés durant cette session.",
};
