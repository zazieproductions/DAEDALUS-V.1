import { BootSequence } from '@/components/boot/BootSequence';
import { Desktop } from '@/components/shell/Desktop';
import { TopBar } from '@/components/shell/TopBar';
import { surface } from '@/config/theme';
import { useOSStore } from '@/store/osStore';

/**
 * Root composition.
 *
 * Two states, one switch: the BIOS, then the desktop environment. There is no
 * router — DAEDALUS is a single machine, and every "page" is a window.
 */
export function App() {
  const bootComplete = useOSStore((store) => store.bootComplete);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{
        background: surface.background,
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
      }}
    >
      {bootComplete ? (
        <>
          <TopBar />
          <Desktop />
        </>
      ) : (
        <BootSequence />
      )}
    </div>
  );
}

export default App;
