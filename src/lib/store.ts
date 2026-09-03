import { create } from 'zustand';
import { defaultWindows, type WindowFrame, type WindowId } from '../config/windows';
import { TOPBAR_HEIGHT } from '../config/theme';
import { shouldSkipBoot, clamp } from './utils';

export type { WindowId, WindowFrame };

interface OSState {
  windows: Record<WindowId, WindowFrame>;
  activeWindow: WindowId | null;
  topZ: number;
  bootComplete: boolean;
  terminalLines: string[];
  currentTime: Date;
  geniusScore: number;
  polymathIndex: number;
  obscurityRating: number;
  creativePulse: number;
  setActiveWindow: (id: WindowId) => void;
  toggleMinimize: (id: WindowId) => void;
  setBoot: (v: boolean) => void;
  addTerminalLine: (line: string) => void;
  clearTerminal: () => void;
  setTime: (d: Date) => void;
  updateMetrics: () => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
}

const welcomeLines = [
  'DAEDALUS Terminal v7.3.1 — Type "help" for commands',
  'Connected to noosphere. Latency: 2.3ms',
  '',
];

export const useOSStore = create<OSState>((set, get) => ({
  windows: defaultWindows,
  activeWindow: 'terminal',
  topZ: 10,
  bootComplete: shouldSkipBoot(),
  terminalLines: welcomeLines,
  currentTime: new Date(),
  geniusScore: 94.7,
  polymathIndex: 87.3,
  obscurityRating: 96.1,
  creativePulse: 78.5,
  setActiveWindow: (id) => {
    const newZ = get().topZ + 1;
    set((s) => ({
      activeWindow: id,
      topZ: newZ,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], zIndex: newZ, minimized: false },
      },
    }));
  },
  toggleMinimize: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], minimized: !s.windows[id].minimized },
      },
      activeWindow: s.windows[id].minimized ? id : s.activeWindow === id ? null : s.activeWindow,
    })),
  setBoot: (v) => set({ bootComplete: v }),
  addTerminalLine: (line) =>
    set((s) => ({ terminalLines: [...s.terminalLines.slice(-50), line] })),
  clearTerminal: () => set({ terminalLines: [] }),
  setTime: (d) => set({ currentTime: d }),
  /**
   * Theatrical telemetry. These numbers are a random walk, not measurements.
   * The aesthetic is institutional confidence; the implementation is noise.
   */
  updateMetrics: () =>
    set((s) => ({
      geniusScore: Math.min(99.9, Math.max(80, s.geniusScore + (Math.random() - 0.45) * 0.8)),
      polymathIndex: Math.min(99.9, Math.max(70, s.polymathIndex + (Math.random() - 0.45) * 0.6)),
      obscurityRating: Math.min(99.9, Math.max(85, s.obscurityRating + (Math.random() * 0.4 - 0.192))),
      creativePulse: Math.min(99.9, Math.max(60, s.creativePulse + (Math.random() - 0.4) * 1.2)),
    })),
  moveWindow: (id, x, y) => {
    const frame = get().windows[id];
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          x: clamp(x, 16 - frame.w, vw - 48),
          y: clamp(y, TOPBAR_HEIGHT, vh - 32),
        },
      },
    }));
  },
}));
