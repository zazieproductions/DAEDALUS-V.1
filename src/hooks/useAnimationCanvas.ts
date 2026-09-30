import { useEffect, useRef, type RefObject } from 'react';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Everything a draw callback needs for one frame. */
export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  /** Logical width — draw in these units, not device pixels. */
  width: number;
  /** Logical height. */
  height: number;
  /** Monotonically increasing simulation time, in seconds since mount. */
  time: number;
  /** Frame counter, starting at 0. */
  frame: number;
}

export interface AnimationCanvasOptions {
  /** Logical (CSS-pixel) coordinate space the draw callback works in. */
  width: number;
  height: number;
  /** Called once per animation frame. */
  draw: (frame: CanvasFrame) => void;
  /** Suspend the loop without unmounting (e.g. window minimised). */
  paused?: boolean;
}

/**
 * Run a device-pixel-correct `requestAnimationFrame` loop on a canvas.
 *
 * Three things this solves that a hand-rolled `useEffect` loop usually gets
 * wrong:
 *
 *  - **HiDPI.** The backing store is sized to `devicePixelRatio` and the
 *    context pre-scaled, so drawing code stays in logical coordinates and
 *    still renders sharp on retina displays.
 *  - **Callback identity.** `draw` lives in a ref, so a new closure per render
 *    (which is every render, for anything reading state) does not tear down
 *    and restart the animation — the bug that used to reset the knowledge
 *    graph whenever a node was hovered.
 *  - **Accessibility.** With `prefers-reduced-motion` the loop is replaced by
 *    a single static frame.
 *
 * @returns A ref to attach to the `<canvas>` element.
 */
export function useAnimationCanvas({
  width,
  height,
  draw,
  paused = false,
}: AnimationCanvasOptions): RefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // jsdom and locked-down browsers can refuse a 2D context. The rest of
      // the window stays usable; only the visualisation is missing.
      console.warn('[daedalus/canvas] 2D context unavailable — animation skipped.');
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (paused) return;

    let frame = 0;
    let start: number | null = null;
    let handle = 0;

    const renderFrame = (timestamp: number) => {
      start ??= timestamp;
      drawRef.current({ ctx, width, height, time: (timestamp - start) / 1000, frame });
      frame += 1;
      handle = requestAnimationFrame(renderFrame);
    };

    if (prefersReducedMotion) {
      drawRef.current({ ctx, width, height, time: 0, frame: 0 });
      return;
    }

    handle = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(handle);
  }, [width, height, paused, prefersReducedMotion]);

  return canvasRef;
}
