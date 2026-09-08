import { describe, expect, it } from 'vitest';

import { buildTimeline, formatYear } from '@/data/timeline';
import { BOOKSHELF } from '@/data/books';
import { LEXICON } from '@/data/lexicon';
import { AESTHETIC_PALETTES } from '@/data/aesthetics';
import { ORACLE_DECKS } from '@/data/oracle';
import { CROSS_POLLINATION_DOMAINS, CROSS_POLLINATION_PAIR_COUNT } from '@/data/prompts';
import { QUOTES } from '@/data/quotes';

/**
 * The corpus is content, not code — but broken content still breaks windows,
 * so its shape is asserted here.
 */
describe('corpus integrity', () => {
  it('has unique book titles (the library keys on them)', () => {
    expect(new Set(BOOKSHELF.map((book) => book.title)).size).toBe(BOOKSHELF.length);
  });

  it('has unique lexicon terms with real definitions', () => {
    expect(new Set(LEXICON.map((entry) => entry.term)).size).toBe(LEXICON.length);
    for (const entry of LEXICON) {
      expect(entry.definition.length).toBeGreaterThan(20);
    }
  });

  it('attributes every quote', () => {
    for (const quote of QUOTES) {
      expect(quote).toContain('—');
    }
  });

  it('gives every palette exactly five valid hex colours', () => {
    for (const palette of AESTHETIC_PALETTES) {
      expect(palette.colors).toHaveLength(5);
      for (const color of palette.colors) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it('has enough domains for a full round of disjoint pairs', () => {
    expect(CROSS_POLLINATION_DOMAINS.length).toBeGreaterThanOrEqual(
      CROSS_POLLINATION_PAIR_COUNT * 2,
    );
    expect(new Set(CROSS_POLLINATION_DOMAINS).size).toBe(CROSS_POLLINATION_DOMAINS.length);
  });

  it('gives every oracle deck a label, an action verb and cards', () => {
    for (const deck of Object.values(ORACLE_DECKS)) {
      expect(deck.cards.length).toBeGreaterThan(0);
      expect(deck.action).toMatch(/[A-Z]/);
      for (const card of deck.cards) {
        expect(card.meaning.length).toBeGreaterThan(20);
      }
    }
  });
});

describe('timeline', () => {
  it('is ordered oldest to newest', () => {
    const years = buildTimeline(new Date('2026-01-01')).map((event) => event.year);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
  });

  it('ends on a "you are here" marker stamped with the current year', () => {
    const timeline = buildTimeline(new Date('2031-06-01'));
    expect(timeline.at(-1)).toMatchObject({ year: 2031, event: expect.stringContaining('here') });
  });

  it('formats eras the way historians do', () => {
    expect(formatYear(-2600)).toBe('2600 BCE');
    expect(formatYear(1936)).toBe('1936 CE');
  });
});
