import { renderAudioControls } from './audioControls.js';
import { renderCalibrationWizard } from './calibrationWizard.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

const ONBOARDED_KEY = 'guitarGames.onboarded';
// 'welcome' is a title screen, not a progress step — the dots only cover
// the 3 steps that actually do something.
const STEPS = ['welcome', 'audio', 'calibrate', 'done'];

export function hasOnboarded() {
  return loadJSON(ONBOARDED_KEY, false) === true;
}

function markOnboarded() {
  saveJSON(ONBOARDED_KEY, true);
}

/**
 * First-run guide, shown once (see hasOnboarded()) and replayable anytime
 * from Settings. One focused step at a time — connect audio, then
 * calibrate — each skippable, rather than every setting on one long page.
 * The advanced recalibrate-a-single-chord tool and the full chord library
 * table stay Settings-only; they're maintenance tools, not a first-run need.
 */
export function renderOnboarding(container, ctx) {
  const { t } = ctx;
  let stepIndex = 0;
  let cleanupStep = null;

  function finish() {
    markOnboarded();
    ctx.navigate('home');
  }

  function goTo(index) {
    cleanupStep?.();
    cleanupStep = null;
    stepIndex = index;
    render();
  }

  function stepDots() {
    const progressSteps = STEPS.slice(1); // ['audio', 'calibrate', 'done']
    const current = stepIndex - 1;
    return `
      <div class="wizard-dots">
        ${progressSteps
          .map((_, i) => `<span class="wizard-dot${i === current ? ' active' : ''}${i < current ? ' done' : ''}"></span>`)
          .join('')}
      </div>
    `;
  }

  function render() {
    const step = STEPS[stepIndex];

    if (step === 'welcome') {
      container.innerHTML = `
        <div class="card wizard-step" style="text-align:center">
          <h2>👋 ${t('onboarding.welcomeTitle')}</h2>
          <p class="hint">${t('onboarding.welcomeBody')}</p>
          <button class="btn primary" id="ob-start">${t('onboarding.startBtn')}</button>
          <div style="margin-top:1rem">
            <button class="btn" id="ob-skip-all">${t('onboarding.skipAllBtn')}</button>
          </div>
        </div>
      `;
      container.querySelector('#ob-start').addEventListener('click', () => goTo(1));
      container.querySelector('#ob-skip-all').addEventListener('click', finish);
      return;
    }

    if (step === 'audio') {
      container.innerHTML = `
        <div class="card wizard-step">
          ${stepDots()}
          <h2>${t('onboarding.audioTitle')}</h2>
          <p class="hint">${t('onboarding.audioBody')}</p>
          <div id="ob-audio-controls"></div>
          <div class="row" style="justify-content:flex-end; margin-top:1.5rem">
            <button class="btn primary" id="ob-next">${t('onboarding.continueBtn')}</button>
          </div>
        </div>
      `;
      cleanupStep = renderAudioControls(container.querySelector('#ob-audio-controls'), ctx);
      container.querySelector('#ob-next').addEventListener('click', () => goTo(2));
      return;
    }

    if (step === 'calibrate') {
      container.innerHTML = `
        <div class="card wizard-step">
          ${stepDots()}
          <h2>${t('settings.calibrateTitle')}</h2>
          <div id="ob-calibrate-wizard"></div>
          <div class="row" style="justify-content:flex-end; margin-top:1.5rem">
            <button class="btn" id="ob-skip-calibrate">${t('onboarding.skipCalibrateBtn')}</button>
          </div>
        </div>
      `;
      cleanupStep = renderCalibrationWizard(container.querySelector('#ob-calibrate-wizard'), ctx, {
        onDone: () => goTo(3),
      });
      container.querySelector('#ob-skip-calibrate').addEventListener('click', () => goTo(3));
      return;
    }

    // 'done'
    container.innerHTML = `
      <div class="card wizard-step" style="text-align:center">
        ${stepDots()}
        <h2>🎸 ${t('onboarding.doneTitle')}</h2>
        <p class="hint">${t('onboarding.doneBody')}</p>
        <button class="btn primary" id="ob-finish">${t('onboarding.finishBtn')}</button>
      </div>
    `;
    container.querySelector('#ob-finish').addEventListener('click', finish);
  }

  render();

  return () => {
    cleanupStep?.();
  };
}
