import { colors } from './theme';

export type WindowId =
  | 'terminal'
  | 'cortex'
  | 'library'
  | 'synth'
  | 'graph'
  | 'manifesto'
  | 'oracle'
  | 'chronos'
  | 'lexicon'
  | 'moodboard';

export interface WindowFrame {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  zIndex: number;
}

/**
 * Default layout is authored for a ~1440×900 desktop field.
 * Positions are diegetic, not responsive: this is an OS simulation, not a fluid app.
 */
export const defaultWindows: Record<WindowId, WindowFrame> = {
  terminal: { id: 'terminal', title: 'TERMINAL // νους', x: 20, y: 60, w: 520, h: 340, minimized: false, zIndex: 1 },
  cortex: { id: 'cortex', title: 'CORTEX MAPPER', x: 560, y: 60, w: 440, h: 340, minimized: false, zIndex: 2 },
  library: { id: 'library', title: 'BIBLIOTHECA UNIVERSALIS', x: 20, y: 420, w: 400, h: 320, minimized: false, zIndex: 3 },
  synth: { id: 'synth', title: 'SYNTH // IDEATION ENGINE', x: 440, y: 420, w: 380, h: 320, minimized: false, zIndex: 4 },
  graph: { id: 'graph', title: 'KNOWLEDGE GRAPH', x: 840, y: 420, w: 380, h: 320, minimized: false, zIndex: 5 },
  manifesto: { id: 'manifesto', title: 'MANIFESTO EDITOR', x: 1020, y: 60, w: 360, h: 340, minimized: true, zIndex: 6 },
  oracle: { id: 'oracle', title: 'ORACLE // DIVINATION', x: 200, y: 200, w: 400, h: 300, minimized: true, zIndex: 7 },
  chronos: { id: 'chronos', title: 'CHRONOS // DEEP TIME', x: 300, y: 150, w: 500, h: 350, minimized: true, zIndex: 8 },
  lexicon: { id: 'lexicon', title: 'LEXICON OBSCURA', x: 150, y: 100, w: 420, h: 350, minimized: true, zIndex: 9 },
  moodboard: { id: 'moodboard', title: 'MOODBOARD // ΑΙΣΘΗΣΙΣ', x: 400, y: 180, w: 500, h: 380, minimized: true, zIndex: 10 },
};

export const windowAccent: Record<WindowId, string> = {
  terminal: colors.phosphor,
  cortex: colors.phosphor,
  library: colors.parchment,
  synth: colors.violet,
  graph: colors.teal,
  manifesto: colors.coral,
  oracle: colors.gold,
  chronos: colors.teal,
  lexicon: colors.rose,
  moodboard: colors.foreground,
};

export const WINDOW_ORDER = Object.keys(defaultWindows) as WindowId[];
