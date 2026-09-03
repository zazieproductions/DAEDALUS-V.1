# Desktop shell

## Boot sequence

`BootSequence` is a full-viewport overlay (`z-index: 9999`) that types `bootLines` from `src/data/boot.ts` at 90ms per line. When the script ends it waits 800ms, sets a local `done` flag (Framer Motion exit fade), then waits 600ms and calls `setBoot(true)`.

The overlay is **not** a loader. No assets are awaited. Skipping it (`?skipBoot=1`) is equivalent to jumping to the desktop.

The `[AUD]` line is copy. There is no Web Audio worklet, oscillator, or unlock gesture.

## Top bar

Fixed 52px chrome (`TOPBAR_HEIGHT`). Three zones:

1. **Identity** — pulsing CPU glyph, `DAEDALUS//OS`, and a greeting derived from local hour (`getTimeGreeting`).
2. **Dock** — one icon per `WindowId`. Clicking a minimized window calls `setActiveWindow` (also restores). Clicking an open window minimizes it. The green underline means *mounted*, not *focused*.
3. **Telemetry + clock** — GQ / PI / OR / CP update every 3 seconds via a bounded random walk. The clock ticks every 1 second.

## Window manager

`DraggableWindow` is a thin WM:

- `position: absolute` using store `x, y, w, h, zIndex`
- title-bar drag writes through `moveWindow`
- drag offset is stored in a ref so we do not rebind listeners per pixel
- chrome buttons `stopPropagation` so they do not start a drag
- close and minimize both call `toggleMinimize`
- maximize is non-functional chrome (`MAXIMIZE // OFFLINE`)
- missing windows are not destroyed: the store always contains ten frames

Drag is mouse-only (`mousedown` / `mousemove` / `mouseup` on `window`).

## Background field

Layers, back to front:

1. void fill `#0a0a14`
2. `public/images/neural-bg.svg` at ~22% opacity (uses `import.meta.env.BASE_URL`)
3. phosphor / violet / teal radials
4. 2px repeating scanlines
5. 40px grid
6. italic quote watermark, swapped every 30s from `obscureQuotes`

## Capture / skip

`shouldSkipBoot()` reads `URLSearchParams` once when the Zustand store module initializes. It is the only “feature flag” in the runtime.
