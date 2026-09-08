import { create } from 'zustand';

import { INITIAL_METRICS, METRICS, stepMetric } from '@/config/metrics';
import { WINDOW_MANIFEST } from '@/config/window-manifest';
import { TERMINAL_BANNER, TERMINAL_SCROLLBACK } from '@/data/terminal-content';
import { clampWindowPosition, maximisedGeometry, type Viewport } from '@/lib/geometry';
import type { MetricKey, WindowId, WindowRuntimeState } from '@/types/os';

/**
 * The kernel.
 *
 * A single Zustand store owns every piece of cross-window state: stacking
 * order, focus, geometry, the terminal transcript, the clock and the synthetic
 * metrics. Windows themselves stay stateless with respect to the shell — they
 * receive no props and read nothing but their own local UI state, which is why
 * a new window can be added without touching anything but the registry.
 *
 * Deliberately **not** persisted: DAEDALUS boots fresh every time, because the
 * boot sequence is part of the piece.
 */

/** Runtime state for every window, derived from the registry defaults. */
function createInitialWindows(): Record<WindowId, WindowRuntimeState> {
  const entries = WINDOW_MANIFEST.map((descriptor, index) => [
    descriptor.id,
    {
      id: descriptor.id,
      ...descriptor.defaultGeometry,
      minimised: descriptor.startsMinimised,
      maximised: false,
      // Seed the stack in registry order so the first paint is deterministic.
      zIndex: index + 1,
      restoreGeometry: null,
    } satisfies WindowRuntimeState,
  ]);

  return Object.fromEntries(entries) as Record<WindowId, WindowRuntimeState>;
}

export interface OSState {
  // ---------------------------------------------------------------- windows
  windows: Record<WindowId, WindowRuntimeState>;
  /** The focused window, or `null` when everything is docked. */
  activeWindow: WindowId | null;
  /** Highest z-index currently assigned; increments on every focus. */
  topZ: number;

  /** Bring a window to the front, restoring it if it was docked. */
  focusWindow: (id: WindowId) => void;
  /** Send a window to the dock, or bring it back. */
  toggleMinimise: (id: WindowId) => void;
  /** Fill the desktop, or return to the pre-maximise geometry. */
  toggleMaximise: (id: WindowId, viewport: Viewport) => void;
  /** Move a window, clamped so its title bar stays reachable. */
  moveWindow: (id: WindowId, x: number, y: number, viewport: Viewport) => void;

  // ------------------------------------------------------------------- boot
  bootComplete: boolean;
  completeBoot: () => void;

  // --------------------------------------------------------------- terminal
  terminalLines: string[];
  /** Append one line, trimming the transcript to `TERMINAL_SCROLLBACK`. */
  appendTerminalLines: (lines: readonly string[]) => void;
  clearTerminal: () => void;

  // ------------------------------------------------------- clock & metrics
  currentTime: Date;
  setTime: (date: Date) => void;
  metrics: Record<MetricKey, number>;
  /** Advance every metric by one tick of its bounded random walk. */
  advanceMetrics: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: createInitialWindows(),
  activeWindow: 'terminal',
  topZ: WINDOW_MANIFEST.length,

  focusWindow: (id) => {
    const state = get();
    // Already on top and visible? Nothing to do — avoids a render per click.
    if (state.activeWindow === id && !state.windows[id].minimised) return;

    const zIndex = state.topZ + 1;
    set({
      activeWindow: id,
      topZ: zIndex,
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex, minimised: false },
      },
    });
  },

  toggleMinimise: (id) =>
    set((state) => {
      const window = state.windows[id];
      const minimised = !window.minimised;

      return {
        windows: { ...state.windows, [id]: { ...window, minimised } },
        activeWindow: minimised ? (state.activeWindow === id ? null : state.activeWindow) : id,
      };
    }),

  toggleMaximise: (id, viewport) =>
    set((state) => {
      const window = state.windows[id];

      if (window.maximised) {
        const restored = window.restoreGeometry ?? {
          x: window.x,
          y: window.y,
          width: window.width,
          height: window.height,
        };
        return {
          windows: {
            ...state.windows,
            [id]: { ...window, ...restored, maximised: false, restoreGeometry: null },
          },
        };
      }

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            ...maximisedGeometry(viewport),
            maximised: true,
            restoreGeometry: {
              x: window.x,
              y: window.y,
              width: window.width,
              height: window.height,
            },
          },
        },
      };
    }),

  moveWindow: (id, x, y, viewport) =>
    set((state) => {
      const window = state.windows[id];
      const position = clampWindowPosition({ x, y }, window, viewport);

      if (position.x === window.x && position.y === window.y) return state;

      return { windows: { ...state.windows, [id]: { ...window, ...position } } };
    }),

  bootComplete: false,
  completeBoot: () => set({ bootComplete: true }),

  // The banner is seeded here rather than written by an effect on first
  // render, so the terminal has content the moment it mounts.
  terminalLines: [...TERMINAL_BANNER],
  appendTerminalLines: (lines) =>
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines].slice(-TERMINAL_SCROLLBACK),
    })),
  clearTerminal: () => set({ terminalLines: [] }),

  currentTime: new Date(),
  setTime: (date) => set({ currentTime: date }),

  metrics: { ...INITIAL_METRICS },
  advanceMetrics: () =>
    set((state) => ({
      metrics: Object.fromEntries(
        METRICS.map((metric) => [metric.key, stepMetric(metric, state.metrics[metric.key])]),
      ) as Record<MetricKey, number>,
    })),
}));
