// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { accent, surface, withAlpha } from '@/config/theme';

/**
 * Tailwind reads its palette from `@theme` in the global stylesheet, while
 * inline styles read `src/config/theme.ts`. Nothing in the toolchain links the
 * two, so this test does.
 */
describe('design tokens', () => {
  const css = readFileSync(
    fileURLToPath(new URL('../../src/styles/global.css', import.meta.url)),
    'utf8',
  );

  const expectations: Record<string, string> = {
    '--color-background': surface.background,
    '--color-foreground': surface.foreground,
    '--color-surface': surface.raised,
    '--color-border': surface.border,
    '--color-primary': accent.signal,
    '--color-accent': accent.violet,
  };

  it.each(Object.entries(expectations))('%s matches theme.ts (%s)', (token, value) => {
    expect(css).toContain(`${token}: ${value};`);
  });
});

describe('withAlpha', () => {
  it('appends an alpha channel', () => {
    expect(withAlpha('#00ff88', 1)).toBe('#00ff88ff');
    expect(withAlpha('#00ff88', 0)).toBe('#00ff8800');
    expect(withAlpha('#00ff88', 0.5)).toBe('#00ff8880');
  });

  it('replaces an existing alpha channel rather than doubling it', () => {
    expect(withAlpha('#00ff8820', 1)).toBe('#00ff88ff');
  });

  it('clamps out-of-range alpha', () => {
    expect(withAlpha('#00ff88', 5)).toBe('#00ff88ff');
    expect(withAlpha('#00ff88', -5)).toBe('#00ff8800');
  });

  it('passes through anything it does not understand', () => {
    expect(withAlpha('rebeccapurple', 0.5)).toBe('rebeccapurple');
  });
});
