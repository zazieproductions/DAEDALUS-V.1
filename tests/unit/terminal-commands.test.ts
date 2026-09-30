import { describe, expect, it } from 'vitest';

import {
  COMMAND_NAMES,
  renderHelp,
  runCommand,
  TERMINAL_COMMANDS,
} from '@/features/terminal/commands';

describe('command dispatch', () => {
  it('reports unknown commands like a shell instead of throwing', () => {
    const { lines } = runCommand('sudo rm -rf /');
    expect(lines[0]).toBe('nous: command not found: sudo');
    expect(lines[1]).toContain('help');
  });

  it('is case-insensitive on the command name', () => {
    expect(runCommand('HELP').lines).toEqual(runCommand('help').lines);
  });

  it('signals a screen wipe rather than emitting lines', () => {
    expect(runCommand('clear')).toEqual({ lines: [], clearScreen: true });
  });

  it('tolerates ragged whitespace', () => {
    expect(runCommand('   help   ').lines.length).toBeGreaterThan(0);
  });

  it('contains a faulting command instead of taking the window down', () => {
    const original = TERMINAL_COMMANDS.status.run;
    TERMINAL_COMMANDS.status.run = () => {
      throw new Error('kernel panic');
    };

    try {
      expect(runCommand('status').lines[0]).toContain('internal fault — kernel panic');
    } finally {
      TERMINAL_COMMANDS.status.run = original;
    }
  });

  it('runs every registered command without error', () => {
    for (const name of COMMAND_NAMES) {
      const result = runCommand(name);
      expect(Array.isArray(result.lines)).toBe(true);
    }
  });
});

describe('help', () => {
  it('is generated from the registry, so it can never go stale', () => {
    const help = renderHelp().join('\n');
    for (const name of COMMAND_NAMES) {
      expect(help).toContain(name);
    }
  });

  it('renders a box whose every row is the same width', () => {
    const rows = renderHelp();
    const widths = new Set(rows.map((row) => [...row].length));
    expect(widths.size).toBe(1);
  });
});

describe('individual commands', () => {
  it('glitch corrupts its argument, defaulting to the house slogan', () => {
    expect(runCommand('glitch', { random: () => 0.99 }).lines).toEqual(
      Array.from({ length: 5 }, () => 'THE MEDIUM IS THE MESSAGE'),
    );
    expect(runCommand('glitch hello world', { random: () => 0.99 }).lines[0]).toBe('hello world');
  });

  it('matrix emits eight rows of sixty katakana', () => {
    const { lines } = runCommand('matrix', { random: () => 0.5 });
    expect(lines).toHaveLength(8);
    for (const line of lines) {
      expect([...line]).toHaveLength(60);
      expect(line.codePointAt(0)).toBeGreaterThanOrEqual(0x30a0);
    }
  });

  it('haiku returns three lines, padded with blanks for breathing room', () => {
    const { lines } = runCommand('haiku', { random: () => 0 });
    expect(lines[0]).toBe('');
    expect(lines.at(-1)).toBe('');
    expect(lines.slice(1, -1)).toHaveLength(3);
  });

  it('neofetch pairs the sigil with the spec sheet', () => {
    const { lines } = runCommand('neofetch');
    expect(lines.length).toBeGreaterThanOrEqual(15);
    expect(lines.join('\n')).toContain('polymath@daedalus');
  });

  it('status interpolates plausible diagnostics', () => {
    const { lines } = runCommand('status', { random: () => 0.5 });
    expect(lines[1]).toBe('[MEM] Semantic memory utilization: 82.5%');
  });
});
