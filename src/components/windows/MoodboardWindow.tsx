import { useState, useEffect } from 'react';
import { Palette, RefreshCw } from 'lucide-react';
import { randomHex } from '../../lib/utils';

interface Swatch {
  color: string;
  name: string;
}

const aesthetics = [
  { name: 'Brutalist', colors: ['#1a1a1a', '#ff0000', '#ffffff', '#888888', '#000000'] },
  { name: 'Solarpunk', colors: ['#2d5a27', '#f4d35e', '#ee964b', '#0d3b66', '#f0f3bd'] },
  { name: 'Vaporwave', colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'] },
  { name: 'Wabi-sabi', colors: ['#8b7355', '#d4c5a9', '#6b5b4a', '#c4b59a', '#3d3229'] },
  { name: 'Bauhaus', colors: ['#dd1c1a', '#0e4bef', '#f0c808', '#000000', '#ffffff'] },
  { name: 'Cyberpunk', colors: ['#0d0221', '#0abdc6', '#ea00d9', '#711c91', '#133e7c'] },
  { name: 'Art Nouveau', colors: ['#4a6741', '#c9a959', '#8b4513', '#deb887', '#2e4a3e'] },
  { name: 'De Stijl', colors: ['#ff0000', '#0000ff', '#ffff00', '#ffffff', '#000000'] },
];

export default function MoodboardWindow() {
  const [selectedAesthetic, setSelectedAesthetic] = useState(0);
  const [customPalette, setCustomPalette] = useState<string[]>([]);

  const generateCustom = () => {
    setCustomPalette(Array.from({ length: 5 }, () => randomHex()));
  };

  useEffect(() => { generateCustom(); }, []);

  const current = aesthetics[selectedAesthetic];

  return (
    <div className="h-full flex flex-col p-3 font-mono text-xs" style={{ color: '#e0e0e0', background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Palette size={10} style={{ color: '#e0e0e0' }} />
        <span className="text-[9px] tracking-wider" style={{ color: '#888' }}>AESTHETIC PALETTE GENERATOR</span>
      </div>

      {/* Aesthetic selector */}
      <div className="flex flex-wrap gap-1 mb-3">
        {aesthetics.map((a, i) => (
          <button
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

      {/* Current palette */}
      <div className="mb-3">
        <div className="text-[9px] tracking-wider mb-1" style={{ color: '#666' }}>{current.name.toUpperCase()} PALETTE</div>
        <div className="flex gap-1 h-16 rounded overflow-hidden">
          {current.colors.map((color, i) => (
            <div
              key={i}
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

      {/* Custom palette */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] tracking-wider" style={{ color: '#666' }}>GENERATIVE PALETTE</span>
          <button onClick={generateCustom} className="p-0.5" style={{ color: '#666' }}>
            <RefreshCw size={10} />
          </button>
        </div>
        <div className="flex gap-1 h-12 rounded overflow-hidden">
          {customPalette.map((color, i) => (
            <div
              key={i}
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

      {/* Texture preview */}
      <div className="mt-3 p-3 rounded" style={{
        background: `linear-gradient(135deg, ${current.colors[0]}40 0%, ${current.colors[1]}40 50%, ${current.colors[2]}40 100%)`,
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="text-[9px] tracking-wider" style={{ color: '#888' }}>GRADIENT PREVIEW</div>
        <div className="text-[10px] mt-1" style={{ color: '#aaa' }}>
          {current.name} — A visual language of intention and atmosphere
        </div>
      </div>
    </div>
  );
}
