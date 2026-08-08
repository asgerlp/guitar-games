import { MATCH_THRESHOLD } from '../chords/audioChordDetector.js';
import { renderLibrary } from './library.js';
import { renderAudioControls } from './audioControls.js';
import { renderCalibrationWizard } from './calibrationWizard.js';
import { LANGUAGES } from '../i18n/languages.js';

const NOTE_LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * The single Settings page: language, audio input, live chord monitor, the
 * guided calibration wizard, one-off recalibration, and the chord library —
 * all merged here since they're really one workflow (get your instrument
 * recognized reliably, in the language you want), not separate destinations.
 * Unlike the onboarding wizard, this shows everything at once — appropriate
 * for a returning player who wants to tweak one thing, not a guided
 * first-time flow. This is also the only place the language can be
 * changed, so it's the only view that needs to react live to i18n's
 * 'change' event and rebuild itself — everything else just calls t() once
 * per render, which is naturally always current.
 */
export function renderSettings(container, ctx, { showReplayWizard = true } = {}) {
  const { audio, audioDetector, store, navigate, i18n, t } = ctx;
  let cleanupInner = null;

  function onLanguageChange() {
    cleanupInner?.();
    cleanupInner = build();
  }
  i18n.addEventListener('change', onLanguageChange);

  function build() {
    container.innerHTML = `
      <div class="card">
        <h2>${t('settings.title')}</h2>
        <p class="hint">${t('settings.intro')}</p>
        ${
          showReplayWizard
            ? `<div class="row"><button class="btn" id="replay-wizard-btn">${t('settings.replayWizardBtn')}</button></div>`
            : ''
        }
      </div>
      <div class="card">
        <h2>${t('settings.languageTitle')}</h2>
        <div class="row">
          <select id="language-select">
            ${LANGUAGES.map(
              (l) => `<option value="${l.code}" ${l.code === i18n.language ? 'selected' : ''}>${l.label}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="card">
        <h2>${t('settings.audioInputTitle')}</h2>
        <div id="audio-controls"></div>
      </div>
      <div class="card">
        <h2>${t('settings.liveMonitorTitle')}</h2>
        <p class="hint">${t('settings.liveMonitorHint')}</p>
        <div class="chroma-bars">
          ${NOTE_LABELS.map(
            (label) => `
            <div class="chroma-bar">
              <div class="chroma-bar-fill" data-fill></div>
              <span class="chroma-bar-label">${label}</span>
            </div>
          `
          ).join('')}
        </div>
        <p class="row" style="margin-top:0.75rem">
          <span class="small">${t('settings.closestChord')}</span>
          <span class="detected-chord" id="live-chord">—</span>
        </p>
        <p class="small" id="match-status"></p>
        <p class="small" id="level-readout">${t('settings.levelUnknown')}</p>
      </div>
      <div class="card">
        <h2>${t('settings.calibrateTitle')}</h2>
        <div id="wizard-host"></div>
      </div>
      <div class="card" id="calibrate-panel"></div>
      <div class="card" id="library-host"></div>
    `;

    const fills = [...container.querySelectorAll('[data-fill]')];
    const liveChord = container.querySelector('#live-chord');
    const matchStatus = container.querySelector('#match-status');
    const levelReadout = container.querySelector('#level-readout');
    const calibratePanel = container.querySelector('#calibrate-panel');

    container.querySelector('#replay-wizard-btn')?.addEventListener('click', () => navigate('onboarding'));
    container.querySelector('#language-select').addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
    });

    function renderCalibratePanel() {
      const chords = store.list();
      const hasInput = !!audio.currentDeviceId;
      calibratePanel.innerHTML = `
        <h2>${t('settings.recalibrateTitle')}</h2>
        <p class="hint">${t('settings.recalibrateHint')}</p>
        <div class="row">
          <select id="calibrate-select">
            ${chords.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <button class="btn primary" id="capture-existing-btn" ${hasInput ? '' : 'disabled'}>
            ${t('settings.captureExistingBtn')}
          </button>
        </div>
        <div class="row" style="margin-top:0.75rem">
          <input type="text" id="new-chord-name" placeholder="${t('settings.newChordPlaceholder')}" />
          <button class="btn" id="capture-new-btn" ${hasInput ? '' : 'disabled'}>${t('settings.captureNewBtn')}</button>
        </div>
        ${!hasInput ? `<p class="small" style="margin-top:0.5rem">${t('settings.enableAudioFirst')}</p>` : ''}
      `;

      calibratePanel.querySelector('#capture-existing-btn')?.addEventListener('click', () => {
        const id = calibratePanel.querySelector('#calibrate-select').value;
        const chord = store.get(id);
        if (!chord) return;
        store.upsert({ id: chord.id, name: chord.name, source: chord.source, chroma: audioDetector.getSmoothedChroma() });
      });

      calibratePanel.querySelector('#capture-new-btn')?.addEventListener('click', () => {
        const input = calibratePanel.querySelector('#new-chord-name');
        const name = input.value.trim();
        if (!name) return;
        const id = store.makeCustomId(name);
        store.upsert({ id, name, source: 'custom', chroma: audioDetector.getSmoothedChroma() });
        input.value = '';
      });
    }

    function onChroma() {
      const smoothed = audioDetector.getSmoothedChroma();
      smoothed.forEach((v, i) => {
        if (fills[i]) fills[i].style.height = `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
      });

      levelReadout.textContent = Number.isFinite(audioDetector.lastLevel)
        ? t('settings.levelDb', { db: Math.round(audioDetector.lastLevel) })
        : t('settings.levelUnknown');

      const candidate = audioDetector.lastCandidate;
      if (!candidate) {
        liveChord.textContent = '—';
        matchStatus.textContent = '';
        liveChord.classList.remove('active');
        return;
      }

      liveChord.textContent = `${candidate.name} (${Math.round(candidate.score * 100)}%)`;
      const isCommitted = audioDetector.current?.id === candidate.id;
      liveChord.classList.toggle('active', isCommitted);
      matchStatus.textContent = isCommitted
        ? t('settings.matchedStatus')
        : t('settings.notConfidentStatus', { threshold: Math.round(MATCH_THRESHOLD * 100) });
    }

    function onStoreChange() {
      renderCalibratePanel();
    }

    audio.addEventListener('connected', renderCalibratePanel);
    audio.addEventListener('disconnected', renderCalibratePanel);
    audio.addEventListener('chroma', onChroma);
    store.addEventListener('change', onStoreChange);

    const cleanupAudioControls = renderAudioControls(container.querySelector('#audio-controls'), ctx);
    const cleanupWizard = renderCalibrationWizard(container.querySelector('#wizard-host'), ctx);
    renderCalibratePanel();
    const cleanupLibrary = renderLibrary(container.querySelector('#library-host'), ctx);

    return () => {
      audio.removeEventListener('connected', renderCalibratePanel);
      audio.removeEventListener('disconnected', renderCalibratePanel);
      audio.removeEventListener('chroma', onChroma);
      store.removeEventListener('change', onStoreChange);
      cleanupAudioControls?.();
      cleanupWizard?.();
      cleanupLibrary?.();
    };
  }

  cleanupInner = build();

  return () => {
    i18n.removeEventListener('change', onLanguageChange);
    cleanupInner?.();
  };
}
