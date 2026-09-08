import { TITLE_BAR_HEIGHT, TOP_BAR_HEIGHT } from '@/config/theme';
import type { WindowGeometry } from '@/types/os';

export interface Viewport {
  width: number;
  height: number;
}

/**
 * How much of a window must remain on screen after a drag, in CSS pixels.
 * Enough that the title bar can always be grabbed again.
 */
const MIN_VISIBLE_WIDTH = 96;

/**
 * Constrain a dragged window so it can never be lost off-screen.
 *
 * Windows may hang off the right and bottom edges (that is normal desktop
 * behaviour) but the title bar always stays reachable: it cannot travel above
 * the top bar, below the viewport, or so far sideways that no grab area
 * remains.
 */
export function clampWindowPosition(
  position: { x: number; y: number },
  size: { width: number; height: number },
  viewport: Viewport,
): { x: number; y: number } {
  const minX = MIN_VISIBLE_WIDTH - size.width;
  const maxX = Math.max(minX, viewport.width - MIN_VISIBLE_WIDTH);
  const minY = TOP_BAR_HEIGHT;
  const maxY = Math.max(minY, viewport.height - TITLE_BAR_HEIGHT);

  return {
    x: Math.min(maxX, Math.max(minX, position.x)),
    y: Math.min(maxY, Math.max(minY, position.y)),
  };
}

/** Geometry of a window occupying the whole desktop area below the top bar. */
export function maximisedGeometry(viewport: Viewport): WindowGeometry {
  return {
    x: 0,
    y: TOP_BAR_HEIGHT,
    width: viewport.width,
    height: Math.max(0, viewport.height - TOP_BAR_HEIGHT),
  };
}
