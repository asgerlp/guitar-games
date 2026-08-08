import { renderSettings } from './settings.js';
import { loadJSON, saveJSON } from '../lib/storage.js';

const ONBOARDED_KEY = 'guitarGames.onboarded';

export function hasOnboarded() {
  return loadJSON(ONBOARDED_KEY, false) === true;
}

function markOnboarded() {
  saveJSON(ONBOARDED_KEY, true);
}

/**
 * First-run guide: connect audio and (optionally) calibrate chords before
 * picking a game. This is the exact same content as the Settings page —
 * composed here with intro framing and a "Continue" CTA instead of routed
 * to separately — so there's one calibration flow to maintain, not two.
 * Shown automatically once (see hasOnboarded()); reachable again anytime
 * via "Replay setup wizard" on Settings.
 */
export function renderOnboarding(container, ctx) {
  container.innerHTML = `
    <div class="card">
      <h2>👋 Welcome</h2>
      <p class="hint">
        Let's get your guitar recognized. Connect your audio input below, then walk through
        calibrating the chords you plan to use — capturing how they actually sound through your
        gear works far better than the built-in defaults. You can skip straight to the games at
        any point, and revisit this guide later from Settings.
      </p>
    </div>
  `;

  const settingsHost = document.createElement('div');
  container.appendChild(settingsHost);
  const cleanupSettings = renderSettings(settingsHost, ctx, { showReplayWizard: false });

  const continueCard = document.createElement('div');
  continueCard.className = 'card';
  continueCard.style.textAlign = 'center';
  continueCard.innerHTML = `
    <p class="hint">Ready when you are — this only needs to happen once.</p>
    <button class="btn primary" id="onboarding-continue">Continue to games →</button>
  `;
  container.appendChild(continueCard);
  continueCard.querySelector('#onboarding-continue').addEventListener('click', () => {
    markOnboarded();
    ctx.navigate('home');
  });

  return () => {
    cleanupSettings?.();
  };
}
