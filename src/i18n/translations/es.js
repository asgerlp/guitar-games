export const es = {
  // --- Topbar / nav ---
  'nav.settings': 'Ajustes',
  'topbar.inputConnected': 'Entrada: Audio — {device}',
  'topbar.inputNotConnected': 'Entrada: no conectada',
  'topbar.inputUnsupported': 'Entrada: no compatible con este navegador',

  // --- Home ---
  'home.welcomeTitle': 'Bienvenido',
  'home.welcomeBody':
    "Conecta la interfaz de audio USB/pedal de tu guitarra y aparecerá en <strong>Ajustes</strong> — selecciónala ahí (no el micrófono integrado de tu portátil) para que el reconocimiento de acordes funcione directamente con esa señal. Ajustes también tiene la biblioteca de acordes, donde puedes ver o personalizar qué acordes se reconocen, y luego elegir un juego abajo.",
  'home.gamesTitle': 'Juegos',
  'home.racerDesc': 'Cambia de carril cambiando de acordes. Esquiva obstáculos. La velocidad aumenta con el tiempo.',
  'home.fightDesc': 'Enfréntate a la CPU. Bloquea sus ataques anunciados y contraataca con distintos acordes.',
  'home.flapDesc':
    "Mantén el acorde activo para subir y esquivar tuberías — cambia constantemente, así que una sola forma no te bastará.",
  'home.pongDesc': 'Mantén un acorde para mover la pala a la izquierda, otro para la derecha — mantén la pelota en juego.',
  'home.runDesc': 'Salta troncos y agáchate bajo vigas con dos acordes. Mantén saltar para seguir saltando, mantén agacharse para deslizarte por debajo.',
  'home.snakeDesc': "Cuatro acordes controlan arriba/abajo/izquierda/derecha. Snake clásico — come comida, no choques contigo mismo ni con una pared.",
  'home.highScoresTitle': 'Puntuaciones máximas',
  'home.highScoresDesc': "Consulta el top 10 de cada juego. Si logras una partida en el top 10, te pedirán tu nombre.",

  // --- Settings ---
  'settings.title': 'Ajustes',
  'settings.intro':
    "Escucha directamente tu interfaz de audio USB/pedal — no el micrófono integrado de tu portátil — y detecta acordes a partir del propio sonido. Elige abajo el dispositivo con el que realmente aparece tu guitarra/pedal, no el micrófono integrado, y luego calibra los acordes que planeas usar — eso importa más que cualquier otra cosa aquí.",
  'settings.replayWizardBtn': 'Repetir el asistente de configuración',
  'settings.languageTitle': 'Idioma',
  'settings.audioInputTitle': 'Entrada de audio',
  'settings.liveMonitorTitle': 'Monitor en vivo',
  'settings.liveMonitorHint': 'Toca y mantén un acorde — las clases de tono presentes deberían iluminarse abajo.',
  'settings.closestChord': 'Acorde más cercano:',
  'settings.levelUnknown': 'Nivel: —',
  'settings.levelDb': 'Nivel: {db} dB',
  'settings.matchedStatus': '✓ coincide — a esto reaccionarán los juegos',
  'settings.notConfidentStatus':
    'aún no lo suficientemente seguro (se necesita {threshold}%) — prueba a calibrar este acorde abajo',
  'settings.calibrateTitle': 'Calibra tus acordes',
  'settings.recalibrateTitle': 'Recalibrar o añadir un acorde personalizado',
  'settings.recalibrateHint':
    "Para recalibrar puntualmente un acorde específico, o añadir uno completamente nuevo que no esté en la lista guiada de arriba.",
  'settings.captureExistingBtn': 'Capturar para el acorde seleccionado',
  'settings.newChordPlaceholder': 'p. ej. F#m',
  'settings.captureNewBtn': 'Capturar como acorde nuevo',
  'settings.enableAudioFirst': 'Activa primero la entrada de audio arriba.',

  // --- Audio controls (shared by Settings and onboarding) ---
  'audio.unsupported': 'Este navegador no admite la captura de entrada de audio. Usa Chrome o Edge.',
  'audio.enableBtn': 'Activar entrada de audio',
  'audio.requestingPermission': 'Solicitando permiso…',
  'audio.couldNotAccess':
    "No se pudo acceder a la entrada de audio: {message}. Revisa los permisos del sitio en el navegador (icono de candado en la barra de direcciones).",
  'audio.disconnectBtn': 'Desconectar',

  // --- Calibration wizard (shared by Settings and onboarding) ---
  'calibrate.noChordsEnabled': 'Activa primero algunos acordes en la biblioteca de acordes y vuelve aquí después.',
  'calibrate.allDone': 'Los {count} acordes activados están calibrados. Ve a la pantalla de inicio para jugar, o reinicia para repetirlos.',
  'calibrate.restartBtn': 'Reiniciar calibración',
  'calibrate.walkthroughHint':
    "Repasa cada acorde que uses y captura su sonido real — esto importa más que cualquier otra cosa aquí, ya que es lo que realmente impulsa el reconocimiento.",
  'calibrate.chordProgress': 'Acorde {index} de {total}',
  'calibrate.strumAndHold': 'Toca y mantén {chord}, luego captura.',
  'calibrate.captureBtn': 'Capturar {chord}',
  'calibrate.skipBtn': 'Omitir',
  'calibrate.connectAudioFirst': 'Conecta primero una entrada de audio.',

  // --- Chord Library (embedded in Settings) ---
  'library.title': 'Biblioteca de acordes',
  'library.intro':
    'Estos son los acordes que la aplicación reconoce. La columna "Activado" controla qué acordes están disponibles para asignar en los juegos. Para añadir un acorde nuevo o recalibrar uno que no coincide de forma fiable, usa las secciones de calibración de arriba — capturar el sonido real en vivo de un acorde funciona mejor que los valores predeterminados si tu guitarra/pastilla/pedal suena distinto a lo que asumen (afinación estándar, posición abierta).',
  'library.colEnabled': 'Activado',
  'library.colName': 'Nombre',
  'library.colHowToPlay': 'Cómo tocarlo',
  'library.colNotes': 'Notas',
  'library.colSource': 'Fuente',
  'library.noDiagram': 'sin diagrama',
  'library.capturedFromAudio': 'capturado desde audio',
  'library.deleteBtn': 'Eliminar',
  'library.confirmDelete': '¿Eliminar este acorde de tu biblioteca?',

  // --- Onboarding wizard ---
  'onboarding.welcomeTitle': 'Bienvenido a Chord Games',
  'onboarding.welcomeBody':
    'Una configuración rápida logra un reconocimiento fiable de tu guitarra — conecta tu entrada de audio y captura un par de acordes. Dos pasos cortos, y solo lo haces una vez.',
  'onboarding.startBtn': 'Vamos allá →',
  'onboarding.skipAllBtn': 'Saltar configuración, llévame a los juegos',
  'onboarding.audioTitle': 'Conecta tu audio',
  'onboarding.audioBody':
    "Elige abajo la interfaz de audio USB/pedal de tu guitarra — no el micrófono integrado de tu portátil. Esto es opcional: cada juego también tiene una alternativa de teclado para probar sin guitarra, y siempre puedes conectarla más tarde desde Ajustes.",
  'onboarding.continueBtn': 'Continuar →',
  'onboarding.skipCalibrateBtn': 'Omitir, calibraré más tarde',
  'onboarding.doneTitle': '¡Todo listo!',
  'onboarding.doneBody': 'Ve a los juegos y empieza a jugar. Puedes repetir esta guía en cualquier momento desde Ajustes.',
  'onboarding.finishBtn': 'Continuar a los juegos →',

  // --- Difficulty levels (shared across every game) ---
  'level.superEasy': 'Súper fácil',
  'level.easy': 'Fácil',
  'level.medium': 'Medio',
  'level.hard': 'Difícil',
  'level.veryHard': 'Muy difícil',
  'level.insane': 'Extremo',

  // --- High scores ---
  'highScores.empty': '¡Aún no hay puntuaciones — sé el primero!',
  'highScores.colRank': '#',
  'highScores.colName': 'Nombre',
  'highScores.colScore': 'Puntos',
  'highScores.savedTo': '¡Guardado en la tabla de {level}!',
  'highScores.newHighScore': '¡Nuevo récord de {level}! Introduce tu nombre para la clasificación:',
  'highScores.namePlaceholder': 'Tu nombre',
  'highScores.saveBtn': 'Guardar',
  'highScores.anonymous': 'Anónimo',
  'highScores.title': 'Puntuaciones máximas',
  'highScores.subtitle': 'Top 10 de cada juego, registrado por separado según el nivel de dificultad, guardado en este dispositivo.',

  // --- Shared UI chrome reused across every game's setup/play/game-over screens ---
  'common.startBtn': 'Empezar',
  'common.difficultyTitle': 'Dificultad',
  'common.quitBtn': 'Salir a la configuración',
  'common.gameOverTitle': 'Fin de la partida',
  'common.playAgainBtn': 'Jugar de nuevo',
  'common.changeSettingsBtn': 'Cambiar ajustes',
  'common.scoreLabel': 'Puntos:',
  'common.noAudioBanner':
    'No hay entrada de audio conectada. Conecta tu guitarra/pedal en "Ajustes", o activa la alternativa de teclado abajo para probar.',
  'common.enableChordsBanner': 'Activa al menos {count} acordes en Ajustes para jugar.',
  'common.chordsToUseLabel': 'Acordes a usar',
  'common.noDiagram': 'sin diagrama',

  // --- Chord Racer ---
  'racer.description':
    "El coche se desliza hacia el carril cuyo acorde estás manteniendo. Los obstáculos caen más rápido cuanto más sobrevives — cambia de acordes de forma limpia y rápida para esquivarlos.",
  'racer.lanesLabel': 'Carriles',
  'racer.laneLeft': 'Izquierda',
  'racer.laneRight': 'Derecha',
  'racer.laneN': 'Carril {n}',
  'racer.kbFallbackLabel': 'Activar alternativa de flechas (para probar sin guitarra)',
  'racer.difficultyHint':
    'Elige un nivel para saltar directamente a un preajuste. A partir de ahí, se sigue adaptando a ti automáticamente: una partida que termina casi al instante reduce la dificultad y te da más margen de reacción, una partida que superas con comodidad acorta ese margen, y todo lo demás lo aumenta suavemente con el tiempo.',
  'racer.startSpeedStat': 'Velocidad inicial: <strong>{value}</strong> px/s',
  'racer.rampStat': 'Aumento: <strong>{value}</strong> px/s²',
  'racer.reactionRoomStat': 'Margen de reacción: <strong>{value}</strong> px',
  'racer.obstacleGapStat': 'Distancia entre obstáculos: <strong>{value}</strong> s',
  'racer.resetDifficultyBtn': 'Restablecer valores predeterminados',
  'racer.manualSpeedLabel': 'Establecer velocidad inicial manualmente',
  'racer.setBtn': 'Aplicar',
  'racer.manualGapLabel': 'Tiempo mínimo entre obstáculos (segundos)',
  'racer.lanesHud': 'Carriles: <strong>{lanes}</strong>',
  'racer.feedbackUp': 'Buena partida — la siguiente te dará un poco menos de margen de reacción.',
  'racer.feedbackDown':
    'Eso terminó rápido — la siguiente te dará más margen de reacción para que encuentres el ritmo.',
  'racer.feedbackSame': 'La dificultad se mantiene estable para la próxima partida.',

  // --- Chord Fight ---
  'fight.description':
    "Enfréntate a la CPU. Se prepara brevemente antes de cada ataque — mantén el acorde que hayas asignado a <strong>Bloquear</strong> durante ese momento para anularlo. Toca un acorde de ataque para contraatacar; cada uno tiene un breve tiempo de reutilización, así que lo que realmente gana los combates es cambiar de acordes, no repetir uno solo.",
  'fight.kbFallbackLabel': 'Activar alternativa de números 1-4 (para probar sin guitarra)',
  'fight.difficultyHint':
    'Controla la rapidez y fuerza con que ataca la CPU, y cuánto tiempo de aviso te da su preparación para bloquear.',
  'fight.actionAttack': 'Atacar',
  'fight.actionKick': 'Patada',
  'fight.actionSpecial': 'Especial',
  'fight.actionBlock': 'Bloquear',
  'fight.playerHpHud': 'Tú:',
  'fight.cpuHpHud': 'CPU:',
  'fight.youLabel': 'Tú',
  'fight.cpuLabel': 'CPU',
  'fight.blockedLabel': '¡Bloqueado!',
  'fight.winTitle': '¡Has ganado!',
  'fight.loseTitle': 'K.O.',
  'fight.winHint': 'Buenos reflejos — bloquea a tiempo y contraataca con precisión para una revancha.',
  'fight.loseHint': 'La CPU se impuso esta vez. Vigila la preparación y bloquéala.',
  'fight.damageDealt': 'Daño infligido: <strong>{score}</strong>',

  // --- Chord Flap ---
  'flap.description':
    "Mantén el acorde marcado como <strong>activo</strong> para subir — suelta (o toca otra cosa) y la gravedad toma el control. El acorde activo cambia continuamente entre tus acordes asignados durante la partida, así que fíjate en la leyenda en lugar de acomodarte a una sola forma.",
  'flap.kbFallbackLabel': 'Activar alternativa de números 1-4, mantenidos (para probar sin guitarra)',
  'flap.difficultyHint':
    'Controla con qué frecuencia cambia el acorde activo y cuán estrechas son las tuberías — los niveles más bajos te dan mucho más tiempo para acomodarte a cada acorde.',
  'flap.chordN': 'Acorde {n}',
  'flap.activeChordHud': 'Acorde activo:',
  'flap.gameOverHint':
    'Chocaste contra una tubería o el borde. Fíjate en la leyenda — el acorde activo cambia a lo largo de la partida.',

  // --- Chord Pong ---
  'pong.description':
    'Mantén la pelota en juego. Mantén el acorde <strong>Mover izquierda</strong> para deslizar la pala a la izquierda, <strong>Mover derecha</strong> para deslizarla a la derecha — suelta y la pala se detiene. Cada rebote en la pala acelera un poco la pelota, así que un peloteo largo se vuelve progresivamente más difícil de mantener.',
  'pong.moveLeft': 'Mover izquierda',
  'pong.moveRight': 'Mover derecha',
  'pong.kbFallbackLabel': 'Activar alternativa de flechas, mantenidas (para probar sin guitarra)',
  'pong.difficultyHint': 'Controla el ancho y la velocidad de la pala, y la rapidez con que la pelota empieza y aumenta con cada peloteo.',
  'pong.rallyHud': 'Peloteo:',
  'pong.gameOverHint':
    'La pelota pasó la pala. Peloteos más largos significan una pelota más rápida — mantente centrado para cubrir ambas direcciones.',

  // --- Chord Run ---
  'run.description':
    "Sigue corriendo. Toca el acorde de <strong>Saltar</strong> para saltar sobre obstáculos bajos — mantenlo y seguirás saltando — y mantén el acorde de <strong>Agacharse</strong> para deslizarte bajo obstáculos altos. Solo puedes hacer una cosa a la vez, así que una serie de obstáculos alternos exige realmente cambiar de acordes, no quedarse con uno para siempre.",
  'run.jump': 'Saltar',
  'run.duck': 'Agacharse',
  'run.kbFallbackLabel': 'Activar alternativa de números 1-2 (para probar sin guitarra)',
  'run.difficultyHint': 'Controla la velocidad de desplazamiento del mundo y el tiempo mínimo entre obstáculos.',
  'run.loadingEngine': 'Cargando motor 3D…',
  'run.gameOverHint': 'Atrapado por un obstáculo. Los troncos requieren un salto, las vigas requieren agacharse — presta atención a lo que viene.',

  // --- Chord Snake ---
  'snake.description':
    "Snake clásico en cuadrícula — cuatro acordes controlan arriba/abajo/izquierda/derecha. No puedes girar directamente hacia tu propio cuerpo, así que un acorde mal reconocido simplemente se ignora en lugar de terminar la partida. Comer comida hace crecer a la serpiente y acelera un poco el juego cada vez.",
  'snake.up': 'Arriba',
  'snake.down': 'Abajo',
  'snake.left': 'Izquierda',
  'snake.right': 'Derecha',
  'snake.kbFallbackLabel': 'Activar alternativa de flechas (para probar sin guitarra)',
  'snake.difficultyHint':
    'Controla la velocidad de movimiento de la serpiente. Cambiar de forma limpia entre cuatro acordes es más difícil que entre dos, así que empieza en Súper fácil o Fácil si es tu primera partida.',
  'snake.gameOverHint':
    'Chocaste con una pared o tu propia cola. Si cuatro acordes te parecen demasiados, baja el nivel de dificultad para tener más tiempo entre giros.',
};
