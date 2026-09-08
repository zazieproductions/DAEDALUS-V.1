import { beforeEach, describe, expect, it } from 'vitest';

import { WINDOW_IDS, WINDOW_REGISTRY, WINDOWS_BY_ID } from '@/config/windows';
import { TOP_BAR_HEIGHT } from '@/config/theme';
import { useOSStore } from '@/store/osStore';

const VIEWPORT = { width: 1440, height: 900 };

/** Fresh kernel per test — Zustand stores are module singletons. */
function resetStore() {
  useOSStore.setState(useOSStore.getInitialState(), true);
}

describe('window registry', () => {
  it('has a unique, non-empty descriptor per window id', () => {
    expect(new Set(WINDOW_IDS).size).toBe(WINDOW_REGISTRY.length);

    for (const descriptor of WINDOW_REGISTRY) {
      expect(descriptor.title.trim()).not.toBe('');
      expect(descriptor.summary.trim()).not.toBe('');
      expect(descriptor.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(descriptor.component).toBeTypeOf('function');
      expect(descriptor.icon).toBeDefined();
    }
  });

  it('indexes every descriptor by id', () => {
    for (const id of WINDOW_IDS) {
      expect(WINDOWS_BY_ID[id].id).toBe(id);
    }
  });

  it('places every window inside a plausible default viewport', () => {
    for (const { defaultGeometry: geometry, id } of WINDOW_REGISTRY) {
      expect(geometry.width, id).toBeGreaterThan(200);
      expect(geometry.height, id).toBeGreaterThan(200);
      expect(geometry.y, id).toBeGreaterThanOrEqual(TOP_BAR_HEIGHT);
    }
  });

  it('opens with a calm desktop: at most five windows on screen', () => {
    const open = WINDOW_REGISTRY.filter((descriptor) => !descriptor.startsMinimised);
    expect(open.length).toBeLessThanOrEqual(5);
    expect(open.length).toBeGreaterThan(0);
  });
});

describe('OS kernel', () => {
  beforeEach(resetStore);

  it('seeds runtime state from the registry', () => {
    const { windows } = useOSStore.getState();

    for (const descriptor of WINDOW_REGISTRY) {
      const state = windows[descriptor.id];
      expect(state.x).toBe(descriptor.defaultGeometry.x);
      expect(state.width).toBe(descriptor.defaultGeometry.width);
      expect(state.minimised).toBe(descriptor.startsMinimised);
      expect(state.maximised).toBe(false);
    }
  });

  it('raises a focused window above every other', () => {
    const { focusWindow } = useOSStore.getState();

    focusWindow('moodboard');
    const { windows, activeWindow } = useOSStore.getState();
    const highest = Math.max(...Object.values(windows).map((w) => w.zIndex));

    expect(activeWindow).toBe('moodboard');
    expect(windows.moodboard.zIndex).toBe(highest);
    expect(windows.moodboard.minimised).toBe(false);
  });

  it('does not churn state when re-focusing the already-focused window', () => {
    const { focusWindow } = useOSStore.getState();
    focusWindow('terminal');
    const before = useOSStore.getState();

    focusWindow('terminal');
    expect(useOSStore.getState().windows).toBe(before.windows);
  });

  it('drops focus when the focused window is docked', () => {
    const { focusWindow, toggleMinimise } = useOSStore.getState();

    focusWindow('graph');
    toggleMinimise('graph');

    expect(useOSStore.getState().activeWindow).toBeNull();
    expect(useOSStore.getState().windows.graph.minimised).toBe(true);
  });

  it('restores exact geometry after maximise → restore', () => {
    const { toggleMaximise } = useOSStore.getState();
    const before = { ...useOSStore.getState().windows.library };

    toggleMaximise('library', VIEWPORT);
    const maximised = useOSStore.getState().windows.library;
    expect(maximised.maximised).toBe(true);
    expect(maximised.width).toBe(VIEWPORT.width);
    expect(maximised.y).toBe(TOP_BAR_HEIGHT);

    toggleMaximise('library', VIEWPORT);
    const restored = useOSStore.getState().windows.library;
    expect(restored).toMatchObject({
      x: before.x,
      y: before.y,
      width: before.width,
      height: before.height,
      maximised: false,
      restoreGeometry: null,
    });
  });

  it('clamps a window dragged into the void', () => {
    const { moveWindow } = useOSStore.getState();

    moveWindow('terminal', -5000, -5000, VIEWPORT);
    const { x, y } = useOSStore.getState().windows.terminal;

    expect(y).toBe(TOP_BAR_HEIGHT);
    expect(x).toBeGreaterThan(-useOSStore.getState().windows.terminal.width);
  });

  it('keeps the terminal transcript bounded', () => {
    const { appendTerminalLines, clearTerminal } = useOSStore.getState();

    appendTerminalLines(Array.from({ length: 500 }, (_, i) => `line ${i}`));
    expect(useOSStore.getState().terminalLines).toHaveLength(50);
    expect(useOSStore.getState().terminalLines.at(-1)).toBe('line 499');

    clearTerminal();
    expect(useOSStore.getState().terminalLines).toEqual([]);
  });

  it('advances every metric within bounds', () => {
    const { advanceMetrics } = useOSStore.getState();

    for (let tick = 0; tick < 200; tick++) advanceMetrics();

    for (const [key, value] of Object.entries(useOSStore.getState().metrics)) {
      expect(value, key).toBeGreaterThanOrEqual(60);
      expect(value, key).toBeLessThanOrEqual(99.9);
    }
  });

  it('boots exactly once', () => {
    expect(useOSStore.getState().bootComplete).toBe(false);
    useOSStore.getState().completeBoot();
    expect(useOSStore.getState().bootComplete).toBe(true);
  });
});
