/**
 * Design tokens for DAEDALUS // OS.
 *
 * These values are mirrored in `src/styles/global.css` under Tailwind's
 * `@theme` block so that both utility classes and inline styles resolve to the
 * same palette. `tests/unit/theme-tokens.test.ts` fails the build if the two
 * copies ever drift apart.
 */

/** Chrome: the surfaces the windows and shell are built from. */
export const surface = {
  /** Desktop background — near-black with a blue cast. */
  background: '#0a0a14',
  /** Panel fill (top bar gradient start). */
  raised: '#1a1a2e',
  /** Hairline borders between chrome elements. */
  border: '#2a2a4a',
  /** Default body text. */
  foreground: '#e0e0e0',
  /** De-emphasised text. */
  muted: '#8888aa',
} as const;

/**
 * Accent palette. Each window owns exactly one accent, which colours its
 * chrome, glow and interior type. Names are deliberately material rather than
 * semantic — this is an instrument panel, not a design system.
 */
export const accent = {
  /** Phosphor green — the OS's primary signal colour. */
  signal: '#00ff88',
  /** Cool teal — analytical surfaces. */
  cyan: '#4ecdc4',
  /** Violet — generative surfaces. */
  violet: '#a855f7',
  /** Warm red — authored / editorial surfaces. */
  ember: '#ff6b6b',
  /** Amber — divinatory surfaces. */
  amber: '#ffe66d',
  /** Aged paper — the library. */
  parchment: '#e0d4b8',
  /** Dusty rose — the lexicon. */
  rose: '#f0a0c0',
  /** Neutral bone — the moodboard, which supplies its own colour. */
  bone: '#e0e0e0',
} as const;

export type AccentName = keyof typeof accent;

/**
 * Append an alpha channel to a 6-digit hex colour.
 *
 * The UI leans on 8-digit hex (`#00ff8820`) rather than `rgba()` so accent
 * colours can be composed with plain string concatenation inside style props.
 *
 * @param hex   A `#rrggbb` colour. Returned unchanged if it is already 8-digit.
 * @param alpha Opacity in the range 0–1; values outside are clamped.
 */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.min(1, Math.max(0, alpha));
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');

  if (/^#[0-9a-f]{8}$/i.test(hex)) return hex.slice(0, 7) + channel;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;

  return `${hex}${channel}`;
}

/** Vertical space reserved by the top bar, in CSS pixels. */
export const TOP_BAR_HEIGHT = 52;

/** Height of a window title bar, in CSS pixels. */
export const TITLE_BAR_HEIGHT = 32;
