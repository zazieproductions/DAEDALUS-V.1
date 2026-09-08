# 0002 — One Zustand store as the kernel; nothing is persisted

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

Ten windows need shared state: which is focused, where each one sits, the
stacking order, the terminal transcript, the clock, the metrics. The options
were React context (a provider tree and manual memoisation), a reducer with
`useContext` (all consumers re-render on every action), or an external store.

A separate question: should any of it survive a reload?

## Decision

**One Zustand store** — `src/store/osStore.ts` — holds all cross-window state.
Components subscribe with narrow selectors:

```ts
const state = useOSStore((store) => store.windows[id]);
```

**Nothing is persisted.** No `localStorage`, no `sessionStorage`, no
`persist()` middleware. The OS boots from the manifest defaults every time.

## Consequences

**Why an external store**

- Selector subscriptions mean a component re-renders only when its own slice
  changes. This is not a micro-optimisation here: the clock ticks once a second,
  and with context every tick would re-render all ten windows.
- No provider tree, no `useMemo` gymnastics around context values.
- Actions are plain functions with stable identities, so they can be passed to
  `useCallback` dependencies without churn.
- The store is trivially testable outside React — see
  `tests/unit/os-store.test.ts`, which drives the whole kernel with no
  rendering at all.

**Why nothing is persisted**

- The boot sequence is part of the piece. A returning visitor who lands on a
  restored desktop has skipped the work's opening.
- The default layout is composed. Persistence would mean most visitors after
  the first see an arrangement nobody designed.
- Persisted state is a migration problem: a stored `WindowId` that no longer
  exists, or geometry from a larger monitor, becomes a crash or an invisible
  window. Not storing it removes an entire class of bug.
- No storage means no cookie banner, no privacy surface, nothing to disclose.

**Costs**

- Edits to the manifesto are lost on reload. Surfaced honestly in the window's
  own documentation comment and in `docs/troubleshooting.md`.
- Users who rearrange the desktop must do so again next session.

**Mitigation**

Opt-in persistence is on the [roadmap](../roadmap.md): a terminal command that
enables layout saving explicitly. That keeps the clean-boot default while
giving the small number of people who want it a way to ask.

**Related mechanics**

Runtime state deliberately excludes the viewport. `moveWindow` and
`toggleMaximise` take `{ width, height }` from the caller instead. Window size
is a DOM fact; mirroring it into the store would require a resize listener and
create a second source of truth that can go stale.
