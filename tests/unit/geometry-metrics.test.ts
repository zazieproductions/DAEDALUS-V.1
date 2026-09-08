import { describe, expect, it } from 'vitest';

import { METRICS, stepMetric, INITIAL_METRICS } from '@/config/metrics';
import { clampWindowPosition, maximisedGeometry } from '@/lib/geometry';
import { TOP_BAR_HEIGHT } from '@/config/theme';

const VIEWPORT = { width: 1280, height: 800 };
const SIZE = { width: 400, height: 300 };

describe('clampWindowPosition', () => {
  it('leaves an on-screen window where it is', () => {
    expect(clampWindowPosition({ x: 100, y: 200 }, SIZE, VIEWPORT)).toEqual({ x: 100, y: 200 });
  });

  it('never lets a title bar slide under the top bar', () => {
    expect(clampWindowPosition({ x: 100, y: -500 }, SIZE, VIEWPORT).y).toBe(TOP_BAR_HEIGHT);
  });

  it('keeps a grab area visible when dragged off the right edge', () => {
    const { x } = clampWindowPosition({ x: 99_999, y: 100 }, SIZE, VIEWPORT);
    expect(x).toBeLessThanOrEqual(VIEWPORT.width - 96);
  });

  it('keeps a grab area visible when dragged off the left edge', () => {
    const { x } = clampWindowPosition({ x: -99_999, y: 100 }, SIZE, VIEWPORT);
    expect(x + SIZE.width).toBeGreaterThanOrEqual(96);
  });

  it('keeps the title bar above the bottom edge', () => {
    const { y } = clampWindowPosition({ x: 0, y: 99_999 }, SIZE, VIEWPORT);
    expect(y).toBeLessThanOrEqual(VIEWPORT.height);
  });
});

describe('maximisedGeometry', () => {
  it('fills the desktop area below the top bar', () => {
    expect(maximisedGeometry(VIEWPORT)).toEqual({
      x: 0,
      y: TOP_BAR_HEIGHT,
      width: 1280,
      height: 800 - TOP_BAR_HEIGHT,
    });
  });

  it('never reports a negative height on a tiny viewport', () => {
    expect(maximisedGeometry({ width: 200, height: 10 }).height).toBe(0);
  });
});

describe('metric random walk', () => {
  it('declares an initial value for every metric', () => {
    expect(Object.keys(INITIAL_METRICS)).toHaveLength(METRICS.length);
    for (const metric of METRICS) {
      expect(INITIAL_METRICS[metric.key]).toBe(metric.initial);
      expect(metric.initial).toBeGreaterThanOrEqual(metric.min);
      expect(metric.initial).toBeLessThanOrEqual(metric.max);
    }
  });

  it('clamps to the ceiling however lucky the walk gets', () => {
    for (const metric of METRICS) {
      let value = metric.initial;
      for (let tick = 0; tick < 1000; tick++) value = stepMetric(metric, value, () => 1);
      expect(value).toBe(metric.max);
    }
  });

  it('clamps to the floor however unlucky the walk gets', () => {
    for (const metric of METRICS) {
      let value = metric.initial;
      for (let tick = 0; tick < 1000; tick++) value = stepMetric(metric, value, () => 0);
      expect(value).toBe(metric.min);
    }
  });

  it('drifts upward on average, which is the whole joke', () => {
    for (const metric of METRICS) {
      // A uniform draw of 0.5 sits above every metric's bias, so a "neutral"
      // roll must still nudge the value up.
      expect(stepMetric(metric, metric.min, () => 0.5)).toBeGreaterThan(metric.min);
    }
  });
});
