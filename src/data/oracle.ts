/**
 * Divination decks for the ORACLE.
 *
 * The window is a randomiser with good taste: a constrained, meaningful prompt
 * set beats an open-ended one when you are stuck. Both decks are subsets —
 * eight of the sixty-four hexagrams and eight of the twenty-two major arcana —
 * chosen for their relevance to making things.
 */

/** One drawn result, whichever deck it came from. */
export interface OracleCard {
  /** Display name, including the original glyph or numeral. */
  name: string;
  /** Interpretation, written as creative-practice guidance. */
  meaning: string;
}

export type OracleDeckId = 'iching' | 'tarot';

export interface OracleDeck {
  id: OracleDeckId;
  /** Label on the mode selector. */
  label: string;
  /** Verb on the draw button — casting stalks is not drawing a card. */
  action: string;
  cards: readonly OracleCard[];
}

const I_CHING: readonly OracleCard[] = [
  { name: '乾 (Qián)', meaning: 'The Creative — Pure yang energy. Initiate boldly.' },
  { name: '坤 (Kūn)', meaning: 'The Receptive — Yield and receive. Strength in openness.' },
  {
    name: '屯 (Zhūn)',
    meaning: 'Difficulty at the Beginning — Persist through initial chaos.',
  },
  {
    name: '蒙 (Méng)',
    meaning: 'Youthful Folly — Embrace not-knowing as the start of wisdom.',
  },
  { name: '需 (Xū)', meaning: 'Waiting — Patience is not passive; it is active readiness.' },
  { name: '訟 (Sòng)', meaning: 'Conflict — Seek resolution through understanding, not force.' },
  {
    name: '師 (Shī)',
    meaning: 'The Army — Organize your inner resources. Discipline creates freedom.',
  },
  { name: '比 (Bǐ)', meaning: 'Holding Together — Unity comes from genuine connection.' },
];

const TAROT_MAJOR: readonly OracleCard[] = [
  { name: '0 — The Fool', meaning: 'Leap into the unknown. The creative act begins with trust.' },
  {
    name: 'I — The Magician',
    meaning: 'You have all the tools. Channel will into manifestation.',
  },
  { name: 'II — The High Priestess', meaning: 'The answer lies in intuition, not analysis.' },
  {
    name: 'XII — The Hanged Man',
    meaning: 'Invert your perspective. Suspension brings illumination.',
  },
  {
    name: 'XVI — The Tower',
    meaning: 'Creative destruction. What falls away was never truly yours.',
  },
  { name: 'XVII — The Star', meaning: 'After the storm, clarity. Pour yourself into the work.' },
  { name: 'XVIII — The Moon', meaning: 'Navigate by feeling. The unconscious knows the way.' },
  { name: 'XXI — The World', meaning: 'Completion and new beginning. The ouroboros turns.' },
];

export const ORACLE_DECKS: Record<OracleDeckId, OracleDeck> = {
  iching: { id: 'iching', label: '易經 I CHING', action: 'CAST YARROW STALKS', cards: I_CHING },
  tarot: { id: 'tarot', label: 'TAROT MAJOR', action: 'DRAW A CARD', cards: TAROT_MAJOR },
};

/** Deliberate delay before a result appears — divination should not feel instant. */
export const ORACLE_CAST_DURATION_MS = 1200;
