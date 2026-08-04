const FRETS_SHOWN = 4;

/**
 * Render a standard guitar chord diagram (fretboard, nut, x/o markers, and
 * dots) as an inline SVG string. `frets` is one entry per string, low E to
 * high e: -1 = muted, 0 = open, n = fretted at n. Returns '' when there's no
 * shape to draw (e.g. a custom chord captured from audio only, with no known
 * fingering).
 */
export function renderChordDiagram(frets, { width = 64, height = 82 } = {}) {
  if (!frets || frets.length === 0) return '';

  const stringCount = frets.length;
  const marginTop = 16;
  const marginBottom = 6;
  const marginX = 8;
  const gridW = width - marginX * 2;
  const gridH = height - marginTop - marginBottom;
  const stringGap = gridW / (stringCount - 1);
  const fretGap = gridH / FRETS_SHOWN;

  const lines = [];

  // Nut: a thick line at the top of the grid.
  lines.push(
    `<line x1="${marginX}" y1="${marginTop}" x2="${marginX + gridW}" y2="${marginTop}" stroke="currentColor" stroke-width="2.5" />`
  );

  for (let f = 1; f <= FRETS_SHOWN; f++) {
    const y = marginTop + f * fretGap;
    lines.push(
      `<line x1="${marginX}" y1="${y}" x2="${marginX + gridW}" y2="${y}" stroke="currentColor" stroke-width="1" opacity="0.45" />`
    );
  }

  for (let s = 0; s < stringCount; s++) {
    const x = marginX + s * stringGap;
    lines.push(
      `<line x1="${x}" y1="${marginTop}" x2="${x}" y2="${marginTop + gridH}" stroke="currentColor" stroke-width="1" opacity="0.6" />`
    );
  }

  const markers = frets.map((fret, i) => {
    const x = marginX + i * stringGap;
    if (fret === -1) {
      return `<text x="${x}" y="${marginTop - 5}" font-size="9" text-anchor="middle" fill="currentColor">✕</text>`;
    }
    if (fret === 0) {
      return `<circle cx="${x}" cy="${marginTop - 8}" r="3" fill="none" stroke="currentColor" stroke-width="1.3" />`;
    }
    const y = marginTop + (fret - 0.5) * fretGap;
    return `<circle cx="${x}" cy="${y}" r="4.5" fill="currentColor" />`;
  });

  return `<svg class="chord-diagram" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="chord diagram">${lines.join('')}${markers.join('')}</svg>`;
}
