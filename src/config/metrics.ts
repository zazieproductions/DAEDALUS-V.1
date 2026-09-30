import { Brain, Eye, Sparkles, Zap } from 'lucide-react';

import type { MetricDescriptor, MetricKey } from '@/types/os';

/**
 * The four readouts in the top bar.
 *
 * They are honest about being fiction: nothing is measured. Each one is a
 * bounded random walk with an upward bias (`bias < 0.5`), so the numbers
 * fidget convincingly and creep up over a session — the interface flattering
 * its operator, which is the joke. The parameters are tuned so that each
 * metric has a distinct temperament rather than all four twitching alike.
 *
 * See `docs/simulations.md` for the derivation.
 */
export const METRICS: readonly MetricDescriptor[] = [
  {
    key: 'genius',
    abbreviation: 'GQ',
    label: 'Genius quotient',
    icon: Zap,
    color: '#ff6b6b',
    initial: 94.7,
    min: 80,
    max: 99.9,
    volatility: 0.8,
    bias: 0.45,
  },
  {
    key: 'polymath',
    abbreviation: 'PI',
    label: 'Polymath index',
    icon: Brain,
    color: '#4ecdc4',
    initial: 87.3,
    min: 70,
    max: 99.9,
    volatility: 0.6,
    bias: 0.45,
  },
  {
    key: 'obscurity',
    abbreviation: 'OR',
    label: 'Obscurity rating',
    icon: Eye,
    color: '#ffe66d',
    initial: 96.1,
    min: 85,
    max: 99.9,
    // Already near the ceiling, so it barely moves — obscurity is stable.
    volatility: 0.4,
    bias: 0.48,
  },
  {
    key: 'pulse',
    abbreviation: 'CP',
    label: 'Creative pulse',
    icon: Sparkles,
    color: '#a855f7',
    initial: 78.5,
    min: 60,
    max: 99.9,
    // The most volatile and most optimistic of the four.
    volatility: 1.2,
    bias: 0.4,
  },
];

/** Metrics are re-sampled on this cadence, in milliseconds. */
export const METRIC_TICK_MS = 3000;

/** Starting values, keyed for the store. */
export const INITIAL_METRICS: Record<MetricKey, number> = Object.fromEntries(
  METRICS.map((metric) => [metric.key, metric.initial]),
) as Record<MetricKey, number>;

/**
 * Advance one metric by a single tick of its random walk.
 *
 * @param metric The descriptor supplying bounds and temperament.
 * @param value  The current value.
 * @param random Injectable randomness, so the walk is testable.
 */
export function stepMetric(
  metric: MetricDescriptor,
  value: number,
  random: () => number = Math.random,
): number {
  const delta = (random() - metric.bias) * metric.volatility;
  return Math.min(metric.max, Math.max(metric.min, value + delta));
}
