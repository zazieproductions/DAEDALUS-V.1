import { accent as palette, withAlpha } from '@/config/theme';
import { WINDOW_MANIFEST } from '@/config/window-manifest';
import { useOSStore } from '@/store/osStore';

/**
 * The dock: one launcher per registered window, in registry order.
 *
 * Clicking an open window docks it; clicking a docked window restores and
 * focuses it. The underline is the "running" indicator, in the tradition of
 * every dock since NeXTSTEP.
 */
export function WindowDock() {
  const windows = useOSStore((store) => store.windows);
  const focusWindow = useOSStore((store) => store.focusWindow);
  const toggleMinimise = useOSStore((store) => store.toggleMinimise);

  return (
    <nav aria-label="Open windows" className="flex items-center gap-1">
      {WINDOW_MANIFEST.map(({ id, title, icon: Icon }) => {
        const isOpen = !windows[id].minimised;

        return (
          <button
            key={id}
            type="button"
            onClick={() => (isOpen ? toggleMinimise(id) : focusWindow(id))}
            className="relative flex items-center gap-1 px-2 py-1 rounded transition-all"
            style={{
              background: isOpen ? withAlpha(palette.signal, 0.06) : 'transparent',
              border: `1px solid ${isOpen ? withAlpha(palette.signal, 0.19) : 'transparent'}`,
            }}
            title={title}
            aria-pressed={isOpen}
            aria-label={`${isOpen ? 'Dock' : 'Open'} ${title}`}
          >
            <Icon size={12} style={{ color: isOpen ? palette.signal : '#555' }} aria-hidden />
            {isOpen && (
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                style={{ background: palette.signal }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default WindowDock;
