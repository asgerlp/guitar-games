/**
 * Thin wrapper around the Web MIDI API. Exposes device discovery/selection
 * and normalized note on/off events, and copes with the GP-50 (or any MIDI
 * interface) being plugged in after the page has already loaded.
 */
export class MidiManager extends EventTarget {
  constructor() {
    super();
    /** @type {MIDIAccess|null} */
    this.access = null;
    /** @type {MIDIInput|null} */
    this.currentInput = null;
    this.currentInputId = null;
  }

  get isSupported() {
    return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
  }

  async init() {
    if (!this.isSupported) {
      this.dispatchEvent(new CustomEvent('unsupported'));
      return;
    }
    this.access = await navigator.requestMIDIAccess({ sysex: false });
    this.access.onstatechange = () => this._handleStateChange();
    this._handleStateChange();
  }

  _handleStateChange() {
    this.dispatchEvent(new CustomEvent('deviceschanged', { detail: { inputs: this.listInputs() } }));

    // If the device we were using disappeared, drop it.
    if (this.currentInputId && !this.access.inputs.get(this.currentInputId)) {
      this.currentInput = null;
      this.currentInputId = null;
      this.dispatchEvent(new CustomEvent('disconnected'));
    }

    // If we don't have a device selected but a previously-remembered one just
    // showed up (e.g. GP-50 powered on after page load), reattach to it.
    const rememberedId = localStorage.getItem('guitarGames.midiDeviceId');
    if (!this.currentInputId && rememberedId) {
      const input = [...this.access.inputs.values()].find((i) => i.id === rememberedId);
      if (input) this.selectInput(input.id);
    }
  }

  listInputs() {
    if (!this.access) return [];
    return [...this.access.inputs.values()].map((i) => ({
      id: i.id,
      name: i.name,
      manufacturer: i.manufacturer,
      state: i.state,
    }));
  }

  selectInput(id) {
    if (this.currentInput) {
      this.currentInput.onmidimessage = null;
    }
    const input = this.access?.inputs.get(id);
    if (!input) return false;

    input.onmidimessage = (msg) => this._handleMessage(msg);
    this.currentInput = input;
    this.currentInputId = id;
    localStorage.setItem('guitarGames.midiDeviceId', id);
    this.dispatchEvent(new CustomEvent('connected', { detail: { id, name: input.name } }));
    return true;
  }

  _handleMessage(msg) {
    const [status, note, velocity] = msg.data;
    const command = status & 0xf0;
    const channel = status & 0x0f;

    if (command === 0x90 && velocity > 0) {
      this.dispatchEvent(new CustomEvent('noteon', { detail: { note, velocity, channel } }));
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      this.dispatchEvent(new CustomEvent('noteoff', { detail: { note, channel } }));
    }
  }
}
