import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';

import { surface, TITLE_BAR_HEIGHT, withAlpha } from '@/config/theme';
import { useOSStore } from '@/store/osStore';
import type { WindowDescriptor } from '@/types/os';

interface DraggableWindowProps {
  descriptor: WindowDescriptor;
}

/** Current viewport, read at interaction time rather than stored. */
function viewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Window chrome: title bar, controls, drag behaviour and focus ring.
 *
 * Dragging uses **pointer events with capture** rather than mouse events on
 * `window`. That buys three things for free: touch and stylus support, no
 * dropped drags when the cursor outruns the element, and automatic cleanup if
 * the pointer is cancelled by the browser.
 *
 * The component subscribes to exactly one window's slice of the store, so a
 * clock tick in the top bar does not re-render ten windows.
 */
export function DraggableWindow({ descriptor }: DraggableWindowProps) {
  const { id, title, accent, component: Body } = descriptor;

  const state = useOSStore((store) => store.windows[id]);
  const isActive = useOSStore((store) => store.activeWindow === id);
  const focusWindow = useOSStore((store) => store.focusWindow);
  const toggleMinimise = useOSStore((store) => store.toggleMinimise);
  const toggleMaximise = useOSStore((store) => store.toggleMaximise);
  const moveWindow = useOSStore((store) => store.moveWindow);

  /** Pointer offset within the title bar at drag start. */
  const grabOffset = useRef({ x: 0, y: 0 });
  /**
   * Whether a drag is in progress. This — not `hasPointerCapture` — is the
   * source of truth: pointer capture is a progressive enhancement that keeps
   * events flowing when the cursor outruns the title bar, and it is absent in
   * jsdom and older browsers.
   */
  const dragging = useRef(false);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      // Ignore secondary buttons and drags initiated on the control cluster.
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest('button')) return;
      if (state.maximised) return;

      event.preventDefault();
      focusWindow(id);
      dragging.current = true;
      grabOffset.current = { x: event.clientX - state.x, y: event.clientY - state.y };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [focusWindow, id, state.maximised, state.x, state.y],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;

      moveWindow(
        id,
        event.clientX - grabOffset.current.x,
        event.clientY - grabOffset.current.y,
        viewport(),
      );
    },
    [id, moveWindow],
  );

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  if (state.minimised) return null;

  return (
    <motion.section
      aria-label={title}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute overflow-hidden rounded-lg"
      style={{
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
        border: `1px solid ${isActive ? withAlpha(accent, 0.38) : surface.border}`,
        background: 'rgba(10, 10, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: isActive
          ? `0 0 30px ${withAlpha(accent, 0.08)}, 0 8px 32px rgba(0,0,0,0.6)`
          : '0 4px 16px rgba(0,0,0,0.4)',
      }}
      onPointerDown={() => focusWindow(id)}
    >
      <header
        className="flex items-center justify-between px-3 select-none touch-none"
        style={{
          height: TITLE_BAR_HEIGHT,
          cursor: state.maximised ? 'default' : 'move',
          background: `linear-gradient(90deg, ${withAlpha(accent, 0.06)} 0%, transparent 100%)`,
          borderBottom: `1px solid ${withAlpha(accent, 0.13)}`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => toggleMaximise(id, viewport())}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          />
          <h2
            className="font-mono text-[10px] tracking-[0.15em] font-medium"
            style={{ color: accent }}
          >
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <ChromeButton label={`Minimise ${title}`} onClick={() => toggleMinimise(id)}>
            <Minus size={10} />
          </ChromeButton>
          <ChromeButton
            label={`${state.maximised ? 'Restore' : 'Maximise'} ${title}`}
            onClick={() => toggleMaximise(id, viewport())}
          >
            {state.maximised ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
          </ChromeButton>
          {/* Windows are never destroyed — closing returns them to the dock,
              which is where the OS fiction says they live. */}
          <ChromeButton label={`Dismiss ${title} to the dock`} onClick={() => toggleMinimise(id)}>
            <X size={10} />
          </ChromeButton>
        </div>
      </header>

      <div className="overflow-auto" style={{ height: `calc(100% - ${TITLE_BAR_HEIGHT}px)` }}>
        <Body />
      </div>
    </motion.section>
  );
}

function ChromeButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="p-0.5 rounded opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 transition-opacity"
      style={{ color: '#888' }}
    >
      {children}
    </button>
  );
}

export default DraggableWindow;
