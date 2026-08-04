import { computeChroma } from '../chords/chromaUtils.js';

const FFT_SIZE = 16384;

/**
 * Web Audio equivalent of MidiManager: picks a specific input device (e.g. a
 * USB audio interface like the GP-50's own audio output, not just the
 * built-in mic), analyses it in real time, and emits per-frame chroma
 * vectors for chord matching. Unlike MIDI, getUserMedia requires an explicit
 * user gesture/permission — there's no silent auto-connect on page load.
 */
export class AudioInputManager extends EventTarget {
  constructor() {
    super();
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.stream = null;
    this.currentDeviceId = null;
    this.currentDeviceLabel = null;
    this._inputs = [];
    this._rafId = null;

    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = () => this.refreshDevices();
    }
  }

  get isSupported() {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  }

  async refreshDevices() {
    if (!this.isSupported) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    this._inputs = devices
      .filter((d) => d.kind === 'audioinput')
      .map((d) => ({ id: d.deviceId, name: d.label || 'Audio input (enable to see its name)' }));
    this.dispatchEvent(new CustomEvent('deviceschanged', { detail: { inputs: this._inputs } }));
  }

  listInputs() {
    return this._inputs;
  }

  /** Connect to a specific device, or the system default if id is omitted. */
  async selectInput(deviceId) {
    this._stopStream();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    this.stream = stream;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.smoothingTimeConstant = 0.15;
    this.sourceNode.connect(this.analyser);

    const track = stream.getAudioTracks()[0];
    this.currentDeviceId = track?.getSettings?.().deviceId ?? deviceId ?? null;
    this.currentDeviceLabel = track?.label || 'Audio input';
    if (this.currentDeviceId) localStorage.setItem('guitarGames.audioDeviceId', this.currentDeviceId);

    // Labels are blank until permission is granted; now that it has been,
    // refresh so the device picker can show real names.
    await this.refreshDevices();

    this._startLoop();
    this.dispatchEvent(
      new CustomEvent('connected', { detail: { id: this.currentDeviceId, name: this.currentDeviceLabel } })
    );
  }

  stop() {
    const wasConnected = !!this.currentDeviceId;
    this._stopStream();
    this.currentDeviceId = null;
    this.currentDeviceLabel = null;
    if (wasConnected) this.dispatchEvent(new CustomEvent('disconnected'));
  }

  _stopStream() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
    this.sourceNode = null;
  }

  _startLoop() {
    const freqData = new Float32Array(this.analyser.frequencyBinCount);
    const sampleRate = this.audioContext.sampleRate;
    const fftSize = this.analyser.fftSize;

    const tick = () => {
      if (!this.analyser) return;
      this.analyser.getFloatFrequencyData(freqData);
      const { chroma, level } = computeChroma(freqData, sampleRate, fftSize);
      this.dispatchEvent(new CustomEvent('chroma', { detail: { chroma, level } }));
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }
}
