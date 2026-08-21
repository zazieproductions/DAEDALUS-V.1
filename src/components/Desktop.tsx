import { useEffect, useState } from 'react';
import { useOSStore, obscureQuotes } from '../lib/store';
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
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)]);
    const interval = setInterval(() => {
      setQuote(obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0a14' }}>
      {/* Background layers */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(/images/neural-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(78,205,196,0.02) 0%, transparent 50%)',
      }} />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Quote watermark */}
      <div className="absolute bottom-16 left-6 right-6 pointer-events-none">
        <p className="font-mono text-[10px] italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.08)' }}>
          {quote}
        </p>
      </div>

      {/* Windows */}
      <DraggableWindow id="terminal" accentColor="#00ff88">
        <TerminalWindow />
      </DraggableWindow>

      <DraggableWindow id="cortex" accentColor="#00ff88">
        <CortexMapper />
      </DraggableWindow>

      <DraggableWindow id="library" accentColor="#e0d4b8">
        <LibraryWindow />
      </DraggableWindow>

      <DraggableWindow id="synth" accentColor="#a855f7">
        <SynthWindow />
      </DraggableWindow>

      <DraggableWindow id="graph" accentColor="#4ecdc4">
        <GraphWindow />
      </DraggableWindow>

      <DraggableWindow id="manifesto" accentColor="#ff6b6b">
        <ManifestoWindow />
      </DraggableWindow>

      <DraggableWindow id="oracle" accentColor="#ffe66d">
        <OracleWindow />
      </DraggableWindow>

      <DraggableWindow id="chronos" accentColor="#4ecdc4">
        <ChronosWindow />
      </DraggableWindow>

      <DraggableWindow id="lexicon" accentColor="#f0a0c0">
        <LexiconWindow />
      </DraggableWindow>

      <DraggableWindow id="moodboard" accentColor="#e0e0e0">
        <MoodboardWindow />
      </DraggableWindow>
    </div>
  );
}
