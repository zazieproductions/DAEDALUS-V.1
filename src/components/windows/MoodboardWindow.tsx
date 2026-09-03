import { useState } from 'react';
import { Palette, RefreshCw } from 'lucide-react';
import { randomHex } from '../../lib/utils';
import { aesthetics } from '../../data/catalogs';

export default function MoodboardWindow() {
  const [selectedAesthetic, setSelectedAesthetic] = useState(0);
  const [customPalette, setCustomPalette] = useState(() => Array.from({ length: 5 }, () => randomHex()));

  const generateCustom = () => {
    setCustomPalette(Array.from({ length: 5 }, () => randomHex()));
  };

  const current = aesthetics[selectedAesthetic];

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#e0e0e0', background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Palette size={10} style={{ color: '#e0e0e0' }} />
        <span className="text-[9px] tracking-wider" style={{ color: '#888' }}>
          AESTHETIC PALETTE GENERATOR
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {aesthetics.map((a, i) => (
          <button
            type="button"
            key={a.name}
            onClick={() => setSelectedAesthetic(i)}
            className="px-2 py-0.5 rounded text-[8px] tracking-wider transition-all"
            style={{
              background: i === selectedAesthetic ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${i === selectedAesthetic ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
              color: i === selectedAesthetic ? '#fff' : '#666',
            }}
          >
            {a.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <div className="text-[9px] tracking-wider mb-1" style={{ color: '#666' }}>
          {current.name.toUpperCase()} PALETTE
        </div>
        <div className="flex gap-1 h-16 rounded overflow-hidden">
          {current.colors.map((color) => (
            <div
              key={color}
              className="flex-1 flex items-end justify-center pb-1 transition-all hover:flex-[2]"
              style={{ background: color }}
            >
              <span className="text-[7px] font-mono px-1 rounded" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] tracking-wider" style={{ color: '#666' }}>
            GENERATIVE PALETTE
          </span>
          <button type="button" onClick={generateCustom} className="p-0.5" style={{ color: '#666' }}>
            <RefreshCw size={10} />
          </button>
        </div>
        <div className="flex gap-1 h-12 rounded overflow-hidden">
          {customPalette.map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="flex-1 flex items-end justify-center pb-1 transition-all hover:flex-[2]"
              style={{ background: color }}
            >
              <span className="text-[7px] font-mono px-1 rounded" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-3 p-3 rounded"
        style={{
          background: `linear-gradient(135deg, ${current.colors[0]}40 0%, ${current.colors[1]}40 50%, ${current.colors[2]}40 100%)`,
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="text-[9px] tracking-wider" style={{ color: '#888' }}>
          GRADIENT PREVIEW
        </div>
        <div className="text-[10px] mt-1" style={{ color: '#aaa' }}>
          {current.name} — A visual language of intention and atmosphere
        </div>
      </div>
    </div>
  );
}
