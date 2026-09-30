/**
 * Core type vocabulary for the DAEDALUS window system.
 *
 * The OS is deliberately split in two halves:
 *
 *  - **Static descriptors** (`WindowDescriptor`) live in `src/config/windows.ts`.
 *    They never change at runtime: title, icon, accent colour, default geometry.
 *  - **Runtime state** (`WindowRuntimeState`) lives in the Zustand store.
 *    Only mutable facts belong here: position, size, stacking, visibility.
 *
 * Keeping the two apart is what allows a single registry entry to drive the
 * dock, the desktop, the window chrome and the generated layout diagram.
 */

import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Stable identifier for every window shipped with the OS. */
export type WindowId =
  | 'terminal'
  | 'cortex'
  | 'library'
  | 'synth'
  | 'graph'
  | 'manifesto'
  | 'oracle'
  | 'chronos'
  | 'lexicon'
  | 'moodboard';

/** Position (top-left corner) and size of a window, in CSS pixels. */
export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Everything the shell needs to know about a window *before* it is opened.
 * Declared once, in `src/config/window-manifest.ts`.
 */
export interface WindowManifestEntry {
  id: WindowId;
  /** Title rendered in the window chrome and the dock tooltip. */
  title: string;
  /** One-line description used by docs tooling and the generated diagram. */
  summary: string;
  /** Dock icon. */
  icon: LucideIcon;
  /** Hex accent colour that themes the chrome, glow and focus ring. */
  accent: string;
  /** Where the window sits, and how large it is, on first boot. */
  defaultGeometry: WindowGeometry;
  /** Windows that start docked (minimised) keep the first screen calm. */
  startsMinimised: boolean;
}

/** A manifest entry bound to the component that renders its body. */
export interface WindowDescriptor extends WindowManifestEntry {
  component: ComponentType;
}

/** The mutable half: what the user has done to a window since boot. */
export interface WindowRuntimeState extends WindowGeometry {
  id: WindowId;
  minimised: boolean;
  maximised: boolean;
  /** Stacking order; the focused window always owns the highest value. */
  zIndex: number;
  /** Geometry captured before maximising, so restore is lossless. */
  restoreGeometry: WindowGeometry | null;
}

/** Keys of the four synthetic telemetry readouts in the top bar. */
export type MetricKey = 'genius' | 'polymath' | 'obscurity' | 'pulse';

/**
 * A metric is a bounded random walk. `bias` below 0.5 makes the walk drift
 * upward over time; `volatility` sets the step size. See
 * `docs/simulations.md` for why the numbers are what they are.
 */
export interface MetricDescriptor {
  key: MetricKey;
  /** Two-letter label shown in the pill (e.g. `GQ`). */
  abbreviation: string;
  /** Expanded name, used for tooltips and accessible labels. */
  label: string;
  icon: LucideIcon;
  color: string;
  initial: number;
  min: number;
  max: number;
  volatility: number;
  bias: number;
}
