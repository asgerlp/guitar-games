/**
 * Device connect/select/disconnect controls for the current audio input.
 * Self-contained: wires its own listeners and keeps itself in sync with the
 * AudioInputManager's connected/disconnected/deviceschanged events. Used by
 * both the Settings page and the onboarding wizard's audio step.
 */
export function renderAudioControls(hostEl, ctx) {
  const { audio } = ctx;

  function render() {
    if (!audio.isSupported) {
      hostEl.innerHTML = '<p class="banner">This browser doesn’t support audio input capture. Use Chrome or Edge.</p>';
      return;
    }

    if (!audio.currentDeviceId) {
      hostEl.innerHTML = `<button class="btn primary" id="enable-btn">Enable audio input</button>`;
      hostEl.querySelector('#enable-btn').addEventListener('click', async (e) => {
        e.target.disabled = true;
        e.target.textContent = 'Requesting permission…';
        try {
          const remembered = localStorage.getItem('guitarGames.audioDeviceId') || undefined;
          await audio.selectInput(remembered);
        } catch (err) {
          hostEl.innerHTML = `<p class="banner">Couldn't access audio input: ${err.message}. Check the browser's site permissions (padlock icon in the address bar).</p>`;
        }
      });
      return;
    }

    const inputs = audio.listInputs();
    hostEl.innerHTML = `
      <div class="row">
        <select id="audio-device-select">
          ${inputs
            .map(
              (i) =>
                `<option value="${i.id}" ${i.id === audio.currentDeviceId ? 'selected' : ''}>${i.name}</option>`
            )
            .join('')}
        </select>
        <button class="btn" id="disconnect-btn">Disconnect</button>
      </div>
    `;
    hostEl.querySelector('#audio-device-select').addEventListener('change', (e) => {
      audio.selectInput(e.target.value);
    });
    hostEl.querySelector('#disconnect-btn').addEventListener('click', () => audio.stop());
  }

  audio.addEventListener('connected', render);
  audio.addEventListener('disconnected', render);
  audio.addEventListener('deviceschanged', render);
  render();

  return () => {
    audio.removeEventListener('connected', render);
    audio.removeEventListener('disconnected', render);
    audio.removeEventListener('deviceschanged', render);
  };
}
