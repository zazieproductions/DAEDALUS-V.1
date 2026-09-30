import { describe, expect, it } from 'vitest';

import { getTimeGreeting, glitchText, countWords } from '@/lib/text';
import { pickRandom, randomBetween, randomHex, shuffle } from '@/lib/random';

/** A deterministic stand-in for `Math.random`, cycling through fixed values. */
function sequence(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

describe('getTimeGreeting', () => {
  it.each([
    [0, 'NOCTURNAL'],
    [4, 'NOCTURNAL'],
    [5, 'DAWN'],
    [7, 'DAWN'],
    [8, 'MERIDIAN'],
    [11, 'MERIDIAN'],
    [12, 'SOLAR'],
    [16, 'SOLAR'],
    [17, 'CREPUSCULAR'],
    [20, 'CREPUSCULAR'],
    [21, 'NOCTIS'],
    [23, 'NOCTIS'],
  ])('maps hour %i to the %s band', (hour, expected) => {
    expect(getTimeGreeting(hour)).toContain(expected);
  });

  it('clamps out-of-range hours instead of returning undefined', () => {
    expect(getTimeGreeting(-4)).toBe(getTimeGreeting(0));
    expect(getTimeGreeting(99)).toBe(getTimeGreeting(23));
  });

  it('covers all 24 hours with a non-empty greeting', () => {
    for (let hour = 0; hour < 24; hour++) {
      expect(getTimeGreeting(hour)).toMatch(/\/\//);
    }
  });
});

describe('glitchText', () => {
  it('preserves length', () => {
    expect(glitchText('THE MEDIUM IS THE MESSAGE')).toHaveLength(25);
  });

  it('leaves text untouched when the corruption roll always fails', () => {
    expect(glitchText('SIGNAL', { random: () => 0.99 })).toBe('SIGNAL');
  });

  it('replaces every character when the roll always succeeds', () => {
    const result = glitchText('SIGNAL', { probability: 1, random: () => 0 });
    expect(result).toHaveLength(6);
    expect(result).not.toContain('S');
  });
});

describe('countWords', () => {
  it('ignores repeated whitespace and trailing newlines', () => {
    expect(countWords('  one   two\n\nthree  ')).toBe(3);
  });

  it('returns zero for empty input', () => {
    expect(countWords('   ')).toBe(0);
  });
});

describe('random helpers', () => {
  it('pickRandom selects by index', () => {
    expect(pickRandom(['a', 'b', 'c'], () => 0.5)).toBe('b');
  });

  it('pickRandom rejects an empty collection rather than returning undefined', () => {
    expect(() => pickRandom([], Math.random)).toThrow(RangeError);
  });

  it('shuffle is a permutation, never a mutation of the source', () => {
    const source = Object.freeze([1, 2, 3, 4, 5]);
    const result = shuffle(source, sequence([0.1, 0.9, 0.4, 0.2]));

    expect(result).toHaveLength(5);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(source).toEqual([1, 2, 3, 4, 5]);
  });

  it('randomBetween stays inside its bounds', () => {
    expect(randomBetween(10, 20, () => 0)).toBe(10);
    expect(randomBetween(10, 20, () => 0.5)).toBe(15);
  });

  it('randomHex always produces six digits, including for small values', () => {
    expect(randomHex(() => 0)).toBe('#000000');
    expect(randomHex(() => 0.999999)).toMatch(/^#[0-9a-f]{6}$/);
  });
});
