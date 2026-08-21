import { useState } from 'react';
import { Compass, RefreshCw } from 'lucide-react';

const hexagrams = [
  { name: '乾 (Qián)', meaning: 'The Creative — Pure yang energy. Initiate boldly.' },
  { name: '坤 (Kūn)', meaning: 'The Receptive — Yield and receive. Strength in openness.' },
  { name: '屯 (Zhūn)', meaning: 'Difficulty at the Beginning — Persist through initial chaos.' },
  { name: '蒙 (Méng)', meaning: 'Youthful Folly — Embrace not-knowing as the start of wisdom.' },
  { name: '需 (Xū)', meaning: 'Waiting — Patience is not passive; it is active readiness.' },
  { name: '訟 (Sòng)', meaning: 'Conflict — Seek resolution through understanding, not force.' },
  { name: '師 (Shī)', meaning: 'The Army — Organize your inner resources. Discipline creates freedom.' },
  { name: '比 (Bǐ)', meaning: 'Holding Together — Unity comes from genuine connection.' },
];

const tarotMajor = [
  { name: '0 — The Fool', meaning: 'Leap into the unknown. The creative act begins with trust.' },
  { name: 'I — The Magician', meaning: 'You have all the tools. Channel will into manifestation.' },
  { name: 'II — The High Priestess', meaning: 'The answer lies in intuition, not analysis.' },
  { name: 'XII — The Hanged Man', meaning: 'Invert your perspective. Suspension brings illumination.' },
  { name: 'XVI — The Tower', meaning: 'Creative destruction. What falls away was never truly yours.' },
  { name: 'XVII — The Star', meaning: 'After the storm, clarity. Pour yourself into the work.' },
  { name: 'XVIII — The Moon', meaning: 'Navigate by feeling. The unconscious knows the way.' },
  { name: 'XXI — The World', meaning: 'Completion and new beginning. The ouroboros turns.' },
];

export default function OracleWindow() {
  const [mode, setMode] = useState<'iching' | 'tarot'>('iching');
  const [result, setResult] = useState<{ name: string; meaning: string } | null>(null);
  const [casting, setCasting] = useState(false);

  const cast = () => {
    setCasting(true);
    setTimeout(() => {
      const deck = mode === 'iching' ? hexagrams : tarotMajor;
      setResult(deck[Math.floor(Math.random() * deck.length)]);
      setCasting(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col p-3 font-mono text-xs" style={{ color: '#ffe66d', background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => { setMode('iching'); setResult(null); }}
          className="px-2 py-1 rounded text-[9px] tracking-wider"
          style={{
            background: mode === 'iching' ? 'rgba(255,230,109,0.15)' : 'transparent',
            border: `1px solid ${mode === 'iching' ? 'rgba(255,230,109,0.3)' : 'rgba(255,230,109,0.1)'}`,
            color: '#ffe66d',
          }}
        >
          易經 I CHING
        </button>
        <button
          onClick={() => { setMode('tarot'); setResult(null); }}
          className="px-2 py-1 rounded text-[9px] tracking-wider"
          style={{
            background: mode === 'tarot' ? 'rgba(255,230,109,0.15)' : 'transparent',
            border: `1px solid ${mode === 'tarot' ? 'rgba(255,230,109,0.3)' : 'rgba(255,230,109,0.1)'}`,
            color: '#ffe66d',
          }}
        >
          TAROT MAJOR
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {result ? (
          <div className="text-center space-y-3 p-4">
            <Compass size={24} style={{ color: '#ffe66d', margin: '0 auto' }} className={casting ? 'animate-spin' : ''} />
            <div className="text-lg font-bold" style={{ color: '#ffe66d' }}>{result.name}</div>
            <div className="text-[11px] leading-relaxed max-w-xs" style={{ color: '#d4c85a' }}>{result.meaning}</div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <Compass size={32} style={{ color: '#ffe66d40' }} />
            <div className="text-[10px]" style={{ color: '#8a7e3a' }}>Consult the oracle for creative guidance</div>
          </div>
        )}
      </div>

      <button
        onClick={cast}
        disabled={casting}
        className="w-full py-2 rounded text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
        style={{
          background: 'rgba(255,230,109,0.1)',
          border: '1px solid rgba(255,230,109,0.3)',
          color: '#ffe66d',
          opacity: casting ? 0.5 : 1,
        }}
      >
        <RefreshCw size={10} className={casting ? 'animate-spin' : ''} />
        {casting ? 'CASTING...' : mode === 'iching' ? 'CAST YARROW STALKS' : 'DRAW A CARD'}
      </button>
    </div>
  );
}
