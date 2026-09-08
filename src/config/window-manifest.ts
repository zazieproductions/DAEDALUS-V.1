import {
  BookOpen,
  Brain,
  Clock,
  Compass,
  FileText,
  Languages,
  Lightbulb,
  Network,
  Palette,
  Terminal,
} from 'lucide-react';

import { accent } from '@/config/theme';
import type { WindowId, WindowManifestEntry } from '@/types/os';

/**
 * The window manifest — the single source of truth for *what windows exist*.
 *
 * This module holds metadata only: no React components, no store. That
 * restriction is deliberate and load-bearing. The store seeds its runtime
 * state from the manifest, and windows import the store; if the manifest also
 * imported the window components, the three would form an import cycle and
 * `WINDOW_MANIFEST` would evaluate as `undefined` inside the store.
 *
 * The components are attached one layer up, in `src/config/windows.ts`.
 *
 * Everything downstream is derived from this array:
 *
 *   - `Desktop` renders one `<DraggableWindow>` per entry;
 *   - `WindowDock` renders one launcher per entry, in this order;
 *   - `osStore` seeds geometry, stacking and visibility;
 *   - `tools/generate-layout-diagram.mjs` renders the layout diagram in the
 *     docs, so the documentation cannot drift from the code.
 *
 * Ordering is meaningful — it is the dock's left-to-right order, running
 * roughly from "tools you type into" to "tools you look at".
 */
export const WINDOW_MANIFEST: readonly WindowManifestEntry[] = [
  {
    id: 'terminal',
    title: 'TERMINAL // νοῦς',
    summary: 'A shell for a machine that runs on ideas. Ten commands, no filesystem.',
    icon: Terminal,
    accent: accent.signal,
    defaultGeometry: { x: 20, y: 60, width: 520, height: 340 },
    startsMinimised: false,
  },
  {
    id: 'cortex',
    title: 'CORTEX MAPPER',
    summary: 'Twelve disciplines as one breathing synapse field, drawn on canvas.',
    icon: Brain,
    accent: accent.signal,
    defaultGeometry: { x: 560, y: 60, width: 440, height: 340 },
    startsMinimised: false,
  },
  {
    id: 'library',
    title: 'BIBLIOTHECA UNIVERSALIS',
    summary: 'Sixteen books that each rewrote a field. Searchable, filterable, starrable.',
    icon: BookOpen,
    accent: accent.parchment,
    defaultGeometry: { x: 20, y: 420, width: 400, height: 320 },
    startsMinimised: false,
  },
  {
    id: 'synth',
    title: 'SYNTH // IDEATION ENGINE',
    summary: 'Authored provocations plus a combinatorial engine that pairs distant fields.',
    icon: Lightbulb,
    accent: accent.violet,
    defaultGeometry: { x: 440, y: 420, width: 380, height: 320 },
    startsMinimised: false,
  },
  {
    id: 'graph',
    title: 'KNOWLEDGE GRAPH',
    summary: 'A live force-directed layout of sixteen concepts across four faculties.',
    icon: Network,
    accent: accent.cyan,
    defaultGeometry: { x: 840, y: 420, width: 380, height: 320 },
    startsMinimised: false,
  },
  {
    id: 'manifesto',
    title: 'MANIFESTO EDITOR',
    summary: 'A plain-text editor holding the project’s statement of intent.',
    icon: FileText,
    accent: accent.ember,
    defaultGeometry: { x: 1020, y: 60, width: 360, height: 340 },
    startsMinimised: true,
  },
  {
    id: 'oracle',
    title: 'ORACLE // DIVINATION',
    summary: 'I Ching and tarot as a constrained randomiser for creative deadlock.',
    icon: Compass,
    accent: accent.amber,
    defaultGeometry: { x: 200, y: 200, width: 400, height: 300 },
    startsMinimised: true,
  },
  {
    id: 'chronos',
    title: 'CHRONOS // DEEP TIME',
    summary: 'Forty-six centuries of turning points on a single navigable rail.',
    icon: Clock,
    accent: accent.cyan,
    defaultGeometry: { x: 300, y: 150, width: 500, height: 350 },
    startsMinimised: true,
  },
  {
    id: 'lexicon',
    title: 'LEXICON OBSCURA',
    summary: 'Words English has no handle for, on the theory that vocabulary bounds thought.',
    icon: Languages,
    accent: accent.rose,
    defaultGeometry: { x: 150, y: 100, width: 420, height: 350 },
    startsMinimised: true,
  },
  {
    id: 'moodboard',
    title: 'MOODBOARD // ΑΙΣΘΗΣΙΣ',
    summary: 'Eight movement palettes plus a generative one, as a colour instrument.',
    icon: Palette,
    accent: accent.bone,
    defaultGeometry: { x: 400, y: 180, width: 500, height: 380 },
    startsMinimised: true,
  },
];

/** Manifest indexed by id, for O(1) lookups. */
export const WINDOWS_BY_ID: Record<WindowId, WindowManifestEntry> = Object.fromEntries(
  WINDOW_MANIFEST.map((entry) => [entry.id, entry]),
) as Record<WindowId, WindowManifestEntry>;

/** Ids in dock order. */
export const WINDOW_IDS: readonly WindowId[] = WINDOW_MANIFEST.map((entry) => entry.id);
