# 0003 — Simulations are pure and separate from rendering

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

Two windows are canvas animations. Both were originally written as one large
`useEffect` containing initialisation, physics, drawing and event wiring, with
component state in the dependency array.

That produced two concrete bugs:

1. **The knowledge graph restarted on hover.** `hoveredNode` was in the effect's
   dependency array, so changing it tore down the animation and rebuilt the
   entire graph from scratch — new random positions, new edges. In practice the
   bug was invisible only because nothing ever set `hoveredNode`: the state
   setter was dead code, and the hover feature had never worked.
2. **Animation speed depended on refresh rate.** Time advanced by a fixed
   `0.02` per frame, so the same scene ran twice as fast on a 120 Hz display.

Neither could be tested: the physics was unreachable without a real canvas.

## Decision

Three-way split.

**1. Simulation — pure, in `src/lib/simulations/`.**
`createKnowledgeGraph()`, `stepForceSimulation()`, `createSynapseField()`,
`synapseLinkOpacity()`. No React, no canvas, no `Math.random` that cannot be
overridden — every stochastic function takes an optional `random` source.

**2. Frame loop — one hook, `useAnimationCanvas`.**
Owns `requestAnimationFrame`, device-pixel-ratio scaling, and
`prefers-reduced-motion`. The `draw` callback is held in a ref, so re-renders
cannot restart the loop. It reports elapsed **seconds**, not frames.

**3. Rendering — in the window component.**
Reads simulation output and paints. Interaction state that the draw loop needs
lives in refs, mirrored into React state only when it actually changes.

## Consequences

**Good**

- The physics is unit-tested: nodes stay inside the frame over 600 ticks,
  kinetic energy decays, coincident nodes do not produce `NaN`, link opacity
  stays within its documented range. That last set of tests found the
  divide-by-zero guard requirement.
- Hover works, and costs one React render per node transition instead of one
  per frame.
- Canvases are sharp on HiDPI displays; drawing code still uses logical units.
- Animation speed is identical at 60 Hz and 120 Hz.
- Reduced-motion users get a single static frame instead of a perpetual loop.

**Costs**

- More files and one indirection between "the maths" and "the picture".
- The pointer→hover path is imperative (a `pointermove` listener attached in an
  effect) rather than a React handler, because it must run at pointer rate
  without rendering. It is commented as such.

**Precedent**

Any future window with an animation should follow the same split. If the
simulation cannot be described as a pure function of state and time, that is a
signal the design needs revisiting before it is written.
