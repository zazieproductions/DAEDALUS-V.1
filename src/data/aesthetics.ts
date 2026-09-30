/** A named aesthetic and the five colours that carry it. */
export interface AestheticPalette {
  name: string;
  /** Exactly five `#rrggbb` colours, ordered light-to-dark-agnostic. */
  colors: readonly [string, string, string, string, string];
}

/**
 * Movement palettes for the MOODBOARD.
 *
 * Each is a compressed argument about how a movement sees the world: De Stijl
 * gets primaries and nothing else; wabi-sabi gets five browns that are not
 * quite the same brown.
 */
export const AESTHETIC_PALETTES: readonly AestheticPalette[] = [
  { name: 'Brutalist', colors: ['#1a1a1a', '#ff0000', '#ffffff', '#888888', '#000000'] },
  { name: 'Solarpunk', colors: ['#2d5a27', '#f4d35e', '#ee964b', '#0d3b66', '#f0f3bd'] },
  { name: 'Vaporwave', colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'] },
  { name: 'Wabi-sabi', colors: ['#8b7355', '#d4c5a9', '#6b5b4a', '#c4b59a', '#3d3229'] },
  { name: 'Bauhaus', colors: ['#dd1c1a', '#0e4bef', '#f0c808', '#000000', '#ffffff'] },
  { name: 'Cyberpunk', colors: ['#0d0221', '#0abdc6', '#ea00d9', '#711c91', '#133e7c'] },
  { name: 'Art Nouveau', colors: ['#4a6741', '#c9a959', '#8b4513', '#deb887', '#2e4a3e'] },
  { name: 'De Stijl', colors: ['#ff0000', '#0000ff', '#ffff00', '#ffffff', '#000000'] },
];

/** Swatch count for the generative palette, matched to the curated ones. */
export const GENERATIVE_PALETTE_SIZE = 5;
