import { useState } from 'react';
import { Palette, RefreshCw } from 'lucide-react';

import { AESTHETIC_PALETTES, GENERATIVE_PALETTE_SIZE } from '@/data/aesthetics';
import { randomHex } from '@/lib/random';

function generatePalette(): string[] {
  return Array.from({ length: GENERATIVE_PALETTE_SIZE }, () => randomHex());
}

/** One row of colour chips; the hovered chip takes double width. */
function SwatchRow({ colors, height }: { colors: readonly string[]; height: string }) {
  return (
    <div className={`flex gap-1 ${height} rounded overflow-hidden`}>
      {colors.map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="flex-1 flex items-end justify-center pb-1 transition-all hover:flex-[2]"
          style={{ background: color }}
          title={color}
        >
          <span
            className="text-[7px] font-mono px-1 rounded"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          >
            {color}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * MOODBOARD // ΑΙΣΘΗΣΙΣ.
 *
 * Eight movement palettes set against a purely random one. The juxtaposition
 * is the argument: five random hex values are almost never a palette, which is
 * what makes the curated eight worth studying.
 */
export function MoodboardWindow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [generated, setGenerated] = useState<string[]>(generatePalette);

  const current = AESTHETIC_PALETTES[selectedIndex];

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#e0e0e0', background: 'rgba(0,0,0,0.3)' }}
    >
      <h3 className="flex items-center gap-2 mb-3">
        <Palette size={10} style={{ color: '#e0e0e0' }} aria-hidden />
        <span className="text-[9px] tracking-wider" style={{ color: '#888' }}>
          AESTHETIC PALETTE GENERATOR
        </span>
      </h3>

      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Aesthetic movement">
        {AESTHETIC_PALETTES.map((palette, index) => {
          const isActive = index === selectedIndex;

          return (
            <button
              key={palette.name}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-pressed={isActive}
              className="px-2 py-0.5 rounded text-[8px] tracking-wider transition-all"
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                color: isActive ? '#fff' : '#666',
              }}
            >
              {palette.name.toUpperCase()}
            </button>
          );
        })}
      </div>

      <section className="mb-3">
        <h4 className="text-[9px] tracking-wider mb-1" style={{ color: '#666' }}>
          {current.name.toUpperCase()} PALETTE
        </h4>
        <SwatchRow colors={current.colors} height="h-16" />
      </section>

      <section className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-[9px] tracking-wider" style={{ color: '#666' }}>
            GENERATIVE PALETTE
          </h4>
          <button
            type="button"
            onClick={() => setGenerated(generatePalette())}
            className="p-0.5"
            style={{ color: '#666' }}
            aria-label="Generate a new random palette"
            title="Regenerate"
          >
            <RefreshCw size={10} aria-hidden />
          </button>
        </div>
        <SwatchRow colors={generated} height="h-12" />
      </section>

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

export default MoodboardWindow;
