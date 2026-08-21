import { useOSStore } from './lib/store';
import BootSequence from './components/BootSequence';
import TopBar from './components/TopBar';
import Desktop from './components/Desktop';

export default function App() {
  const bootComplete = useOSStore((s) => s.bootComplete);

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#0a0a14', fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace' }}>
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
