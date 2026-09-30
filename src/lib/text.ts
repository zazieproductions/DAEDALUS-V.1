import { pickRandom, type RandomSource } from './random';

/** Box-drawing and shade characters used to corrupt text. */
const GLITCH_CHARSET = '▓░▒█▀▄╔╗╚╝║═╬╣╠╩╦';

export interface GlitchOptions {
  /** Probability that any given character is replaced. Defaults to 0.05. */
  probability?: number;
  random?: RandomSource;
}

/**
 * Corrupt a string by replacing random characters with box-drawing glyphs.
 *
 * Per-character (rather than per-run) corruption is intentional: it keeps the
 * word silhouette legible, which reads as *signal degradation* rather than
 * noise. Used by the terminal's `glitch` command.
 */
export function glitchText(text: string, options: GlitchOptions = {}): string {
  const { probability = 0.05, random = Math.random } = options;

  return Array.from(text, (character) =>
    random() < probability ? pickRandom(GLITCH_CHARSET.split(''), random) : character,
  ).join('');
}

/**
 * Map an hour of the day (0–23) onto the OS's greeting for that period.
 *
 * The six bands are the project's own circadian model of creative work:
 * the small hours are treated as a first-class working mode, not an anomaly.
 *
 * @param hour Local hour, 0–23. Values outside the range are clamped.
 */
export function getTimeGreeting(hour: number): string {
  const safeHour = Math.min(23, Math.max(0, Math.floor(hour)));

  if (safeHour < 5) return 'NOCTURNAL MODE // The liminal hours';
  if (safeHour < 8) return 'DAWN PROTOCOL // Aurora cognitionis';
  if (safeHour < 12) return 'MERIDIAN PHASE // Peak ideation window';
  if (safeHour < 17) return 'SOLAR ZENITH // Sustained creation';
  if (safeHour < 21) return 'CREPUSCULAR MODE // Golden hour synthesis';
  return 'NOCTIS PROTOCOL // Deep work activated';
}

/** Count whitespace-delimited words, ignoring empty runs. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
