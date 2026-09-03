import { useEffect, useState } from 'react';
import { obscureQuotes } from '../data/catalogs';
import { windowAccent } from '../config/windows';
import { colors } from '../config/theme';
import DraggableWindow from './DraggableWindow';
import TerminalWindow from './windows/TerminalWindow';
import CortexMapper from './windows/CortexMapper';
import LibraryWindow from './windows/LibraryWindow';
import SynthWindow from './windows/SynthWindow';
import GraphWindow from './windows/GraphWindow';
import ManifestoWindow from './windows/ManifestoWindow';
import OracleWindow from './windows/OracleWindow';
import ChronosWindow from './windows/ChronosWindow';
import LexiconWindow from './windows/LexiconWindow';
import MoodboardWindow from './windows/MoodboardWindow';

export default function Desktop() {
  const [quote, setQuote] = useState(
    () => obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuote(obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)]);
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: colors.void }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/neural-bg.svg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(78,205,196,0.02) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute bottom-16 left-6 right-6 pointer-events-none">
        <p className="font-mono text-[10px] italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.08)' }}>
          {quote}
        </p>
      </div>

      <DraggableWindow id="terminal" accentColor={windowAccent.terminal}>
        <TerminalWindow />
      </DraggableWindow>
      <DraggableWindow id="cortex" accentColor={windowAccent.cortex}>
        <CortexMapper />
      </DraggableWindow>
      <DraggableWindow id="library" accentColor={windowAccent.library}>
        <LibraryWindow />
      </DraggableWindow>
      <DraggableWindow id="synth" accentColor={windowAccent.synth}>
        <SynthWindow />
      </DraggableWindow>
      <DraggableWindow id="graph" accentColor={windowAccent.graph}>
        <GraphWindow />
      </DraggableWindow>
      <DraggableWindow id="manifesto" accentColor={windowAccent.manifesto}>
        <ManifestoWindow />
      </DraggableWindow>
      <DraggableWindow id="oracle" accentColor={windowAccent.oracle}>
        <OracleWindow />
      </DraggableWindow>
      <DraggableWindow id="chronos" accentColor={windowAccent.chronos}>
        <ChronosWindow />
      </DraggableWindow>
      <DraggableWindow id="lexicon" accentColor={windowAccent.lexicon}>
        <LexiconWindow />
      </DraggableWindow>
      <DraggableWindow id="moodboard" accentColor={windowAccent.moodboard}>
        <MoodboardWindow />
      </DraggableWindow>
    </div>
  );
}
