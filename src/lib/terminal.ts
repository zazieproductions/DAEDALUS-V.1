import { obscureQuotes } from '../data/catalogs';
import { glitchText } from './utils';

export type CommandFn = (args: string[]) => string[];

const thoughts = [
  'What if we modeled economic systems as cellular automata on a Riemannian manifold?',
  'The isomorphism between musical fugues and recursive algorithms suggests a deeper structure...',
  'Consider: every great artwork is a proof by construction of an aesthetic theorem.',
  'Language is a virus from outer space. — Burroughs. But what is the host?',
  'If we treat cities as organisms, what are their dreams?',
  'The boundary between mathematics and poetry dissolves at sufficient abstraction.',
];

const haikus = [
  ['Algorithms dream', 'in silicon reverie—', 'consciousness blooms.'],
  ['Between the zeros', 'and ones, a universe', 'of meaning unfolds.'],
  ['The polymath sees', 'connections invisible—', 'everything is one.'],
];

export const commands: Record<string, CommandFn> = {
  help: () => [
    '╔══════════════════════════════════════════════╗',
    '║  DAEDALUS TERMINAL // Available Commands     ║',
    '╠══════════════════════════════════════════════╣',
    '║  help      — Display this message            ║',
    '║  quote     — Channel the noosphere           ║',
    '║  status    — System diagnostics               ║',
    '║  think     — Generate a thought               ║',
    '║  clear     — Clear terminal                   ║',
    '║  whoami    — Identity query                   ║',
    '║  neofetch  — System information               ║',
    '║  matrix    — Enter the matrix                 ║',
    '║  haiku     — Generate a haiku                 ║',
    '║  glitch    — ▓░▒█▀▄                           ║',
    '╚══════════════════════════════════════════════╝',
  ],
  quote: () => [obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)]],
  status: () => [
    '[SYS] All cognitive subsystems: NOMINAL',
    `[MEM] Semantic memory utilization: ${(70 + Math.random() * 25).toFixed(1)}%`,
    `[CPU] Ideation throughput: ${(1000 + Math.random() * 9000).toFixed(0)} concepts/sec`,
    `[NET] Noosphere latency: ${(1 + Math.random() * 5).toFixed(1)}ms`,
    '[GPU] Qualia renderer: ACTIVE',
    `[IO]  Synesthetic channels: ${Math.floor(7 + Math.random() * 5)} active`,
  ],
  whoami: () => [
    'polymath@daedalus:~$',
    'UID: ∞  GID: creative-genius',
    'Groups: autodidact, flâneur, bricoleur, aesthete',
    'Shell: /bin/nous',
    'Home: /dev/imagination',
    `Uptime: ${Math.floor(Math.random() * 10000)} days of continuous learning`,
  ],
  think: () => [`[THOUGHT] ${thoughts[Math.floor(Math.random() * thoughts.length)]}`, ''],
  neofetch: () => [
    '     ╔═══╗         polymath@daedalus',
    '     ║ δ ║         ──────────────────',
    '     ╚═══╝         OS: DAEDALUS v7.3.1',
    '    ╱     ╲        Kernel: nous-4.2.0',
    '   ╱  ◊◊◊  ╲       Uptime: ∞',
    '  ╱  ◊◊◊◊◊  ╲      Packages: 47,000 (cross-disciplinary)',
    ' ╱  ◊◊◊◊◊◊◊  ╲     Shell: /bin/nous',
    '╱   ◊◊◊◊◊◊◊   ╲    Resolution: ∞ × ∞',
    '╲   ◊◊◊◊◊◊◊   ╱    WM: Polymathic Desktop',
    ' ╲  ◊◊◊◊◊◊◊  ╱     Theme: Liminal Dark',
    '  ╲  ◊◊◊◊◊  ╱      Icons: Hermetic',
    '   ╲  ◊◊◊  ╱       Terminal: νοῦς',
    '    ╲     ╱        CPU: Neural Substrate @ ∞ GHz',
    '     ╲   ╱         Memory: 847 TB / ∞ TB',
    '      ╲ ╱',
  ],
  matrix: () => {
    const lines: string[] = [];
    for (let i = 0; i < 8; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
      }
      lines.push(line);
    }
    return lines;
  },
  haiku: () => {
    const h = haikus[Math.floor(Math.random() * haikus.length)];
    return ['', ...h, ''];
  },
  glitch: (args) => {
    const text = args.join(' ') || 'THE MEDIUM IS THE MESSAGE';
    return Array.from({ length: 5 }, () => glitchText(text));
  },
};

export const KNOWN_COMMANDS = Object.keys(commands);
