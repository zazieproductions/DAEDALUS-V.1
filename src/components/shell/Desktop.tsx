import { DesktopBackdrop } from '@/components/shell/DesktopBackdrop';
import { QuoteWatermark } from '@/components/shell/QuoteWatermark';
import { DraggableWindow } from '@/components/window/DraggableWindow';
import { surface } from '@/config/theme';
import { WINDOW_REGISTRY } from '@/config/windows';

/**
 * The desktop surface.
 *
 * Note how little there is here: the desktop does not know what a terminal or
 * an oracle is, it only knows how to render whatever the registry declares.
 * Ten windows, one `map`.
 */
export function Desktop() {
  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: surface.background }}>
      <DesktopBackdrop />
      <QuoteWatermark />

      {WINDOW_REGISTRY.map((descriptor) => (
        <DraggableWindow key={descriptor.id} descriptor={descriptor} />
      ))}
    </main>
  );
}

export default Desktop;
