/** Canonical surface language for DAEDALUS // OS. Keep this palette tight. */
export const colors = {
  void: '#0a0a14',
  voidDeep: '#0a0a0a',
  phosphor: '#00ff88',
  phosphorDim: '#00cc66',
  violet: '#a855f7',
  coral: '#ff6b6b',
  gold: '#ffe66d',
  teal: '#4ecdc4',
  parchment: '#e0d4b8',
  rose: '#f0a0c0',
  surface: '#1a1a2e',
  surfaceDeep: '#0d0d1a',
  border: '#2a2a4a',
  foreground: '#e0e0e0',
  muted: '#8888aa',
} as const;

export const fonts = {
  mono: '"JetBrains Mono", "Fira Code", "SF Mono", ui-monospace, monospace',
} as const;

/** Top bar height in px — window drag clamps below this so chrome never hides under the dock. */
export const TOPBAR_HEIGHT = 52;
