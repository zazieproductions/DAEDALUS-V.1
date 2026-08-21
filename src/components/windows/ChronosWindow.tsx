import { useState, useMemo } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  year: number;
  event: string;
  category: 'science' | 'art' | 'philosophy' | 'technology';
}

const timeline: TimelineEvent[] = [
  { year: -2600, event: 'Great Pyramid of Giza constructed', category: 'technology' },
  { year: -500, event: 'Heraclitus: "Everything flows"', category: 'philosophy' },
  { year: -300, event: "Euclid's Elements published", category: 'science' },
  { year: 1452, event: 'Leonardo da Vinci born — the polymath archetype', category: 'art' },
  { year: 1543, event: 'Copernicus: De revolutionibus', category: 'science' },
  { year: 1687, event: 'Newton: Principia Mathematica', category: 'science' },
  { year: 1781, event: "Kant: Critique of Pure Reason", category: 'philosophy' },
  { year: 1859, event: 'Darwin: On the Origin of Species', category: 'science' },
  { year: 1905, event: 'Einstein: Annus Mirabilis papers', category: 'science' },
  { year: 1913, event: 'Duchamp: Bicycle Wheel — art is idea', category: 'art' },
  { year: 1931, event: "Gödel's Incompleteness Theorems", category: 'science' },
  { year: 1936, event: 'Turing: On Computable Numbers', category: 'technology' },
  { year: 1948, event: 'Shannon: A Mathematical Theory of Communication', category: 'technology' },
  { year: 1962, event: 'Kuhn: The Structure of Scientific Revolutions', category: 'philosophy' },
  { year: 1969, event: 'ARPANET: First message sent', category: 'technology' },
  { year: 1977, event: 'Voyager Golden Record launched', category: 'art' },
  { year: 2024, event: 'You are here. What will you create?', category: 'art' },
];

const catColors: Record<string, string> = {
  science: '#4ecdc4',
  art: '#ff6b6b',
  philosophy: '#ffe66d',
  technology: '#a855f7',
};

export default function ChronosWindow() {
  const [selectedIdx, setSelectedIdx] = useState(timeline.length - 1);
  const event = timeline[selectedIdx];

  const yearDisplay = (y: number) => y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;

  return (
    <div className="h-full flex flex-col p-3 font-mono text-xs" style={{ color: '#4ecdc4', background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={10} style={{ color: '#4ecdc4' }} />
        <span className="text-[9px] tracking-wider" style={{ color: '#2a8a80' }}>DEEP TIME NAVIGATOR</span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-8 mb-3 flex items-center">
        <div className="absolute inset-x-0 h-px top-1/2" style={{ background: '#2a4a4a' }} />
        {timeline.map((ev, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className="absolute w-2 h-2 rounded-full transition-all -translate-x-1/2"
            style={{
              left: `${(i / (timeline.length - 1)) * 100}%`,
              background: i === selectedIdx ? catColors[ev.category] : '#2a4a4a',
              boxShadow: i === selectedIdx ? `0 0 8px ${catColors[ev.category]}` : 'none',
              transform: `translateX(-50%) scale(${i === selectedIdx ? 1.5 : 1})`,
            }}
          />
        ))}
      </div>

      {/* Selected event */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 rounded" style={{ background: 'rgba(78,205,196,0.03)', border: '1px solid rgba(78,205,196,0.1)' }}>
        <div className="text-2xl font-bold mb-2" style={{ color: catColors[event.category] }}>
          {yearDisplay(event.year)}
        </div>
        <div className="text-[11px] text-center leading-relaxed max-w-sm" style={{ color: '#8ac8c0' }}>
          {event.event}
        </div>
        <div className="mt-2 px-2 py-0.5 rounded text-[7px] uppercase tracking-widest" style={{ background: catColors[event.category] + '15', color: catColors[event.category] }}>
          {event.category}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
          disabled={selectedIdx === 0}
          className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider"
          style={{ background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.2)', color: '#4ecdc4', opacity: selectedIdx === 0 ? 0.3 : 1 }}
        >
          <ChevronLeft size={10} /> EARLIER
        </button>
        <span className="text-[8px]" style={{ color: '#2a6a60' }}>{selectedIdx + 1} / {timeline.length}</span>
        <button
          onClick={() => setSelectedIdx(Math.min(timeline.length - 1, selectedIdx + 1))}
          disabled={selectedIdx === timeline.length - 1}
          className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider"
          style={{ background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.2)', color: '#4ecdc4', opacity: selectedIdx === timeline.length - 1 ? 0.3 : 1 }}
        >
          LATER <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}
