# 0001 — A declarative manifest drives the window system

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

Knowledge about the ten windows was originally spread across three files:

- `lib/store.ts` held titles and default geometry;
- `components/Desktop.tsx` held accent colours and ten hard-coded JSX blocks;
- `components/TopBar.tsx` held a separate `Record<WindowId, Icon>` map.

Adding a window meant editing all three and remembering the order. Nothing
enforced consistency — a window could have an icon and no accent, or an entry in
the dock but no window on the desktop. The desktop's render body was ten
near-identical blocks differing only by two identifiers.

## Decision

Declare every window exactly once, as data, in
`src/config/window-manifest.ts`: id, title, summary, icon, accent, default
geometry, initial docked state.

Split the declaration in two layers:

- **`window-manifest.ts`** — metadata only. Imports icons and theme tokens.
  Imports no components and no store.
- **`windows.ts`** — the manifest bound to its React components.

The store, dock and diagram tool read the manifest; only `Desktop` and the
tests read the registry.

## Why the split

The obvious single-file design closes an import cycle:

```
osStore → windows.ts → TerminalWindow → osStore
```

The store seeds its initial state from the registry at module-evaluation time,
so depending on which module the bundler reaches first, `WINDOW_REGISTRY`
evaluates as `undefined` inside `createInitialWindows()`. This was not
hypothetical — it was hit during the restructure and surfaced as a test suite
failing to even import. Keeping metadata free of component imports makes the
dependency graph a DAG by construction.

## Consequences

**Good**

- Adding a window touches three files and no logic: component, `WindowId`
  union, manifest entry. Both component maps are `Record<WindowId, …>`, so
  TypeScript refuses to compile a half-finished addition.
- `Desktop` collapsed from ten JSX blocks to one `.map()`; `TopBar`'s icon map
  disappeared entirely.
- Documentation is generated: `tools/generate-layout-diagram.mjs` renders
  `docs/media/desktop-layout.svg` from the manifest, and CI fails if the
  committed SVG is stale.
- The manifest is directly testable — one test validates every entry.

**Costs**

- Two files instead of one, with a non-obvious rule about which may import
  what. Mitigated by a prominent comment in the manifest and the table in
  `docs/architecture.md`.
- All ten window components are in the initial bundle. At ~385 kB total that is
  fine; if it stops being fine, `component` can become a `lazy()` thunk without
  changing anything else.
