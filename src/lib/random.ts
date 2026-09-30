/**
 * Deterministic-friendly randomness helpers.
 *
 * Every function takes an optional `random` source so that simulations and
 * generators can be driven by a seeded PRNG in tests (and, one day, by a
 * reproducible "session seed" — see the roadmap).
 */

/** Anything shaped like `Math.random`: returns a float in `[0, 1)`. */
export type RandomSource = () => number;

/** Pick one element. Returns `undefined` only for an empty collection. */
export function pickRandom<T>(items: readonly T[], random: RandomSource = Math.random): T {
  if (items.length === 0) {
    throw new RangeError('pickRandom() requires a non-empty array');
  }
  return items[Math.floor(random() * items.length)];
}

/**
 * Fisher–Yates shuffle, returning a new array.
 *
 * Note: the obvious `[...items].sort(() => Math.random() - 0.5)` is *not* a
 * uniform shuffle — comparison sorts assume a consistent comparator, so some
 * permutations become far more likely than others. The cross-pollination
 * engine depends on genuinely unbiased pairing, so it uses this instead.
 */
export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Uniform float in `[min, max)`. */
export function randomBetween(
  min: number,
  max: number,
  random: RandomSource = Math.random,
): number {
  return min + random() * (max - min);
}

/** A random opaque colour as a 6-digit `#rrggbb` string. */
export function randomHex(random: RandomSource = Math.random): string {
  const value = Math.floor(random() * 0x1000000);
  return `#${value.toString(16).padStart(6, '0')}`;
}
