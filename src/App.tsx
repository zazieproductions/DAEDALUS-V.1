import { useOSStore } from './lib/store';
import BootSequence from './components/BootSequence';
import TopBar from './components/TopBar';
import Desktop from './components/Desktop';
import { colors, fonts } from './config/theme';

export default function App() {
  const bootComplete = useOSStore((s) => s.bootComplete);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ background: colors.void, fontFamily: fonts.mono }}
    >
      {!bootComplete && <BootSequence />}
      {bootComplete && (
        <>
          <TopBar />
          <Desktop />
        </>
      )}
    </div>
  );
}
