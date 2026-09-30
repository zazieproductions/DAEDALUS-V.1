import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Global test setup.
 *
 * Runs for every test file, including the handful that opt into the `node`
 * environment — hence the DOM guard. jsdom implements neither `matchMedia` nor
 * a canvas 2D context, both of which DAEDALUS touches, so they are stubbed
 * once here rather than per test.
 */

const hasDom = typeof window !== 'undefined';

afterEach(() => {
  if (hasDom) cleanup();
});

if (hasDom) {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }

  // jsdom refuses `getContext` unless the native `canvas` package is installed,
  // and logs a loud "Not implemented" for every call. The animation hook already
  // handles a null context gracefully, so return null quietly instead.
  HTMLCanvasElement.prototype.getContext = (() => null) as HTMLCanvasElement['getContext'];

  // jsdom has no layout engine; scrollIntoView is a no-op stub.
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
}

// Silence the expected "2D context unavailable" warning from useAnimationCanvas.
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('[daedalus/canvas]')) return;
  originalWarn(...args);
};
