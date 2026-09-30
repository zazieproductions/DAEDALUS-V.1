/** A waypoint in CHRONOS. */
export interface TimelineEvent {
  /** Gregorian year; negative values are BCE. */
  year: number;
  /** One-line description of what happened. */
  event: string;
  category: TimelineCategory;
}

export type TimelineCategory = 'science' | 'art' | 'philosophy' | 'technology';

/** Accent colour per category, shared by the rail and the detail card. */
export const TIMELINE_CATEGORY_COLORS: Record<TimelineCategory, string> = {
  science: '#4ecdc4',
  art: '#ff6b6b',
  philosophy: '#ffe66d',
  technology: '#a855f7',
};

/**
 * Fixed points in deep time. Ordered oldest → newest; CHRONOS relies on that
 * ordering to place markers along the rail.
 */
const FIXED_EVENTS: readonly TimelineEvent[] = [
  { year: -2600, event: 'Great Pyramid of Giza constructed', category: 'technology' },
  { year: -500, event: 'Heraclitus: "Everything flows"', category: 'philosophy' },
  { year: -300, event: "Euclid's Elements published", category: 'science' },
  { year: 1452, event: 'Leonardo da Vinci born — the polymath archetype', category: 'art' },
  { year: 1543, event: 'Copernicus: De revolutionibus', category: 'science' },
  { year: 1687, event: 'Newton: Principia Mathematica', category: 'science' },
  { year: 1781, event: 'Kant: Critique of Pure Reason', category: 'philosophy' },
  { year: 1859, event: 'Darwin: On the Origin of Species', category: 'science' },
  { year: 1905, event: 'Einstein: Annus Mirabilis papers', category: 'science' },
  { year: 1913, event: 'Duchamp: Bicycle Wheel — art is idea', category: 'art' },
  { year: 1931, event: "Gödel's Incompleteness Theorems", category: 'science' },
  { year: 1936, event: 'Turing: On Computable Numbers', category: 'technology' },
  {
    year: 1948,
    event: 'Shannon: A Mathematical Theory of Communication',
    category: 'technology',
  },
  { year: 1962, event: 'Kuhn: The Structure of Scientific Revolutions', category: 'philosophy' },
  { year: 1969, event: 'ARPANET: First message sent', category: 'technology' },
  { year: 1977, event: 'Voyager Golden Record launched', category: 'art' },
];

/**
 * Build the timeline, terminating in a "you are here" marker stamped with the
 * current year. Injecting `now` keeps the function pure and testable — and
 * stops the last entry from quietly going stale, as a hard-coded year would.
 */
export function buildTimeline(now: Date = new Date()): TimelineEvent[] {
  return [
    ...FIXED_EVENTS,
    {
      year: now.getFullYear(),
      event: 'You are here. What will you create?',
      category: 'art',
    },
  ];
}

/** Render a year the way historians do, rather than the way `Number` does. */
export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}
