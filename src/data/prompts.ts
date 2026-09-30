/**
 * Ideation corpus for SYNTH.
 *
 * Two distinct mechanisms live here:
 *  1. `IDEATION_PROMPTS` — authored provocations, cycled one at a time.
 *  2. `CROSS_POLLINATION_DOMAINS` — the raw material for the combinatorial
 *     engine, which shuffles and pairs disciplines that rarely meet.
 *     See `docs/creative-methodology.md`.
 */

export const IDEATION_PROMPTS: readonly string[] = [
  'What if consciousness is a standing wave in a field of pure information?',
  'Design a city where architecture responds to collective emotional states.',
  'Create a programming language based on musical notation and set theory.',
  'What would a post-scarcity economy look like through the lens of gift theory?',
  'Imagine a library that contains every book that will never be written.',
  'How would Borges design a search engine?',
  'What if we could compile dreams into executable programs?',
  'Design a typeface that changes based on the semantic content of the text.',
  'Create an instrument that plays the electromagnetic spectrum of emotions.',
  'What would happen if we applied category theory to social relationships?',
  'Architect a museum where the building itself is the only exhibit.',
  'How would you encode the complete works of Shakespeare in DNA?',
];

/**
 * Deliberately non-adjacent disciplines. The value of the pairing engine comes
 * from semantic distance, so avoid adding two domains from the same faculty.
 */
export const CROSS_POLLINATION_DOMAINS: readonly string[] = [
  'topology',
  'semiotics',
  'mycology',
  'game theory',
  'phenomenology',
  'acoustics',
  'origami',
  'cryptography',
  'choreography',
  'fermentation',
];

/** How many domain pairs the engine emits per synthesis run. */
export const CROSS_POLLINATION_PAIR_COUNT = 3;
