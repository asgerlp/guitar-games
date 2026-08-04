/**
 * Fans out to whichever chord-detection pipeline (MIDI or audio) is
 * currently active, presenting one stable 'chordchange' event source so
 * games and shared UI (the topbar badge, etc.) don't need to know or care
 * which input produced a match. "Active" is simply whichever source most
 * recently connected — connecting the other one takes over.
 */
export class InputRouter extends EventTarget {
  constructor() {
    super();
    this.activeSource = null; // 'midi' | 'audio' | null
    this.current = null;
  }

  setActiveSource(source) {
    this.activeSource = source;
    this.current = null;
    this.dispatchEvent(new CustomEvent('chordchange', { detail: null }));
  }

  /** Call with the source name whenever that pipeline emits a chordchange. */
  reportChordChange(source, match) {
    if (source !== this.activeSource) return;
    this.current = match;
    this.dispatchEvent(new CustomEvent('chordchange', { detail: match }));
  }
}
