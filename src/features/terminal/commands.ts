import {
  DEFAULT_GLITCH_TEXT,
  HAIKUS,
  NEOFETCH_ART,
  NEOFETCH_FACTS,
  THOUGHTS,
  WHOAMI_LINES,
} from '@/data/terminal-content';
import { QUOTES } from '@/data/quotes';
import { pickRandom, type RandomSource } from '@/lib/random';
import { glitchText } from '@/lib/text';

/**
 * The terminal command set.
 *
 * The shell is a *registry*, not a switch statement: `help` is generated from
 * the same table that dispatches commands, so the two can never disagree.
 * Every command is a pure `(args) => lines` function, which makes the whole
 * shell testable without rendering anything.
 */

export interface CommandContext {
  /** Injectable randomness so command output can be asserted in tests. */
  random?: RandomSource;
}

export interface CommandResult {
  /** Lines to append to the transcript. */
  lines: string[];
  /** Set by `clear`; the caller wipes the transcript instead of appending. */
  clearScreen?: boolean;
}

export interface TerminalCommand {
  /** Shown in `help`. Keep it under ~30 characters. */
  description: string;
  run: (args: string[], context: CommandContext) => string[];
}

/** Draw a box-drawing frame around a title and a body, as a BIOS would. */
function frame(title: string, rows: readonly string[]): string[] {
  const innerWidth = Math.max(title.length, ...rows.map((row) => row.length)) + 4;
  const pad = (content: string) => `║  ${content.padEnd(innerWidth - 2)}║`;

  return [
    `╔${'═'.repeat(innerWidth)}╗`,
    pad(title),
    `╠${'═'.repeat(innerWidth)}╣`,
    ...rows.map(pad),
    `╚${'═'.repeat(innerWidth)}╝`,
  ];
}

export const TERMINAL_COMMANDS: Record<string, TerminalCommand> = {
  help: {
    description: 'Display this message',
    run: () => renderHelp(),
  },

  quote: {
    description: 'Channel the noosphere',
    run: (_args, { random }) => [pickRandom(QUOTES, random)],
  },

  status: {
    description: 'System diagnostics',
    run: (_args, { random = Math.random }) => [
      '[SYS] All cognitive subsystems: NOMINAL',
      `[MEM] Semantic memory utilization: ${(70 + random() * 25).toFixed(1)}%`,
      `[CPU] Ideation throughput: ${(1000 + random() * 9000).toFixed(0)} concepts/sec`,
      `[NET] Noosphere latency: ${(1 + random() * 5).toFixed(1)}ms`,
      '[GPU] Qualia renderer: ACTIVE',
      `[IO]  Synesthetic channels: ${Math.floor(7 + random() * 5)} active`,
    ],
  },

  think: {
    description: 'Generate a thought',
    run: (_args, { random }) => [`[THOUGHT] ${pickRandom(THOUGHTS, random)}`, ''],
  },

  clear: {
    description: 'Clear terminal',
    // Handled by `runCommand`; the entry exists so `help` lists it.
    run: () => [],
  },

  whoami: {
    description: 'Identity query',
    run: (_args, { random = Math.random }) => [
      ...WHOAMI_LINES,
      `Uptime: ${Math.floor(random() * 10000)} days of continuous learning`,
    ],
  },

  neofetch: {
    description: 'System information',
    run: () => {
      const gutter = Math.max(...NEOFETCH_ART.map((line) => line.length)) + 4;
      const rows = Math.max(NEOFETCH_ART.length, NEOFETCH_FACTS.length);

      return Array.from({ length: rows }, (_, index) => {
        const art = (NEOFETCH_ART[index] ?? '').padEnd(gutter);
        return `${art}${NEOFETCH_FACTS[index] ?? ''}`.trimEnd();
      });
    },
  },

  matrix: {
    description: 'Enter the matrix',
    run: (_args, { random = Math.random }) =>
      // Katakana block (U+30A0–U+30FF) — the canonical "digital rain" glyphs.
      Array.from({ length: 8 }, () =>
        Array.from({ length: 60 }, () =>
          String.fromCharCode(0x30a0 + Math.floor(random() * 96)),
        ).join(''),
      ),
  },

  haiku: {
    description: 'Generate a haiku',
    run: (_args, { random }) => ['', ...pickRandom(HAIKUS, random), ''],
  },

  glitch: {
    description: '▓░▒█▀▄',
    run: (args, { random }) => {
      const text = args.join(' ') || DEFAULT_GLITCH_TEXT;
      return Array.from({ length: 5 }, () => glitchText(text, { random }));
    },
  },
};

/** Command names in declaration order. */
export const COMMAND_NAMES = Object.keys(TERMINAL_COMMANDS);

/**
 * Render the `help` box from the command table.
 *
 * Generated rather than hand-written: adding a command to the registry adds it
 * to `help` automatically, which is why this documentation can't go stale.
 */
export function renderHelp(): string[] {
  const nameWidth = Math.max(...COMMAND_NAMES.map((name) => name.length));
  const rows = COMMAND_NAMES.map(
    (name) => `${name.padEnd(nameWidth + 2)}— ${TERMINAL_COMMANDS[name].description}`,
  );

  return frame('DAEDALUS TERMINAL // Available Commands', rows);
}

/**
 * Parse and execute one line of input.
 *
 * Unknown commands produce a shell-style error rather than throwing; a thrown
 * command is caught and reported so a bad command can never take the window
 * down with it.
 */
export function runCommand(input: string, context: CommandContext = {}): CommandResult {
  const [name = '', ...args] = input.trim().split(/\s+/);
  const command = TERMINAL_COMMANDS[name.toLowerCase()];

  if (name.toLowerCase() === 'clear') {
    return { lines: [], clearScreen: true };
  }

  if (!command) {
    return {
      lines: [`nous: command not found: ${name}`, 'Type "help" for available commands.'],
    };
  }

  try {
    return { lines: command.run(args, context) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { lines: [`nous: ${name}: internal fault — ${detail}`] };
  }
}
