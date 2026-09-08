/**
 * Content served by terminal commands.
 *
 * Kept apart from `src/features/terminal/commands.ts` so the command
 * *mechanism* stays small and testable while the *writing* can be extended
 * without touching logic.
 */

/** Lines printed when the terminal first opens. */
export const TERMINAL_BANNER: readonly string[] = [
  'DAEDALUS Terminal v7.3.1 — Type "help" for commands',
  'Connected to noosphere. Latency: 2.3ms',
  '',
];

/** Shell prompt. Also used to colourise echoed input in the transcript. */
export const TERMINAL_PROMPT = 'polymath@daedalus:~$';

/** Maximum number of transcript lines retained in the store. */
export const TERMINAL_SCROLLBACK = 50;

/** Responses for `think` — provocations rather than answers. */
export const THOUGHTS: readonly string[] = [
  'What if we modeled economic systems as cellular automata on a Riemannian manifold?',
  'The isomorphism between musical fugues and recursive algorithms suggests a deeper structure...',
  'Consider: every great artwork is a proof by construction of an aesthetic theorem.',
  'Language is a virus from outer space. — Burroughs. But what is the host?',
  'If we treat cities as organisms, what are their dreams?',
  'The boundary between mathematics and poetry dissolves at sufficient abstraction.',
];

/** Responses for `haiku`, stored as their three constituent lines. */
export const HAIKUS: readonly (readonly [string, string, string])[] = [
  ['Algorithms dream', 'in silicon reverie—', 'consciousness blooms.'],
  ['Between the zeros', 'and ones, a universe', 'of meaning unfolds.'],
  ['The polymath sees', 'connections invisible—', 'everything is one.'],
];

/** ASCII sigil printed by `neofetch`, left column only. */
export const NEOFETCH_ART: readonly string[] = [
  '     ╔═══╗    ',
  '     ║ δ ║    ',
  '     ╚═══╝    ',
  '    ╱     ╲   ',
  '   ╱  ◊◊◊  ╲  ',
  '  ╱  ◊◊◊◊◊  ╲ ',
  ' ╱  ◊◊◊◊◊◊◊  ╲',
  '╱   ◊◊◊◊◊◊◊   ╲',
  '╲   ◊◊◊◊◊◊◊   ╱',
  ' ╲  ◊◊◊◊◊◊◊  ╱',
  '  ╲  ◊◊◊◊◊  ╱ ',
  '   ╲  ◊◊◊  ╱  ',
  '    ╲     ╱   ',
  '     ╲   ╱    ',
  '      ╲ ╱     ',
];

/** Right column of `neofetch`: the spec sheet of a machine that cannot exist. */
export const NEOFETCH_FACTS: readonly string[] = [
  'polymath@daedalus',
  '──────────────────',
  'OS: DAEDALUS v7.3.1',
  'Kernel: nous-4.2.0',
  'Uptime: ∞',
  'Packages: 47,000 (cross-disciplinary)',
  'Shell: /bin/nous',
  'Resolution: ∞ × ∞',
  'WM: Polymathic Desktop',
  'Theme: Liminal Dark',
  'Icons: Hermetic',
  'Terminal: νοῦς',
  'CPU: Neural Substrate @ ∞ GHz',
  'Memory: 847 TB / ∞ TB',
];

/** Identity card printed by `whoami`. */
export const WHOAMI_LINES: readonly string[] = [
  TERMINAL_PROMPT,
  'UID: ∞  GID: creative-genius',
  'Groups: autodidact, flâneur, bricoleur, aesthete',
  'Shell: /bin/nous',
  'Home: /dev/imagination',
];

/** Default subject for `glitch` when invoked without arguments. */
export const DEFAULT_GLITCH_TEXT = 'THE MEDIUM IS THE MESSAGE';
