import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

import { buildTimeline, formatYear, TIMELINE_CATEGORY_COLORS } from '@/data/timeline';

/**
 * CHRONOS // DEEP TIME.
 *
 * Forty-six centuries on one rail. Markers are spaced by *index*, not by year:
 * a linear time axis would compress everything after 1900 into a single pixel,
 * and the point of the window is the sequence, not the durations.
 *
 * The timeline is built once per mount so its final "you are here" entry is
 * stamped with the current year.
 */
export function ChronosWindow() {
  const timeline = useMemo(() => buildTimeline(), []);
  const [index, setIndex] = useState(timeline.length - 1);

  const event = timeline[index];
  const color = TIMELINE_CATEGORY_COLORS[event.category];

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#4ecdc4', background: 'rgba(0,0,0,0.3)' }}
    >
      <h3 className="flex items-center gap-2 mb-3">
        <Clock size={10} style={{ color: '#4ecdc4' }} aria-hidden />
        <span className="text-[9px] tracking-wider" style={{ color: '#2a8a80' }}>
          DEEP TIME NAVIGATOR
        </span>
      </h3>

      <div className="relative h-8 mb-3 flex items-center">
        <div className="absolute inset-x-0 h-px top-1/2" style={{ background: '#2a4a4a' }} />
        {timeline.map((entry, entryIndex) => {
          const isSelected = entryIndex === index;

          return (
            <button
              key={`${entry.year}-${entry.event}`}
              type="button"
              onClick={() => setIndex(entryIndex)}
              aria-label={`${formatYear(entry.year)}: ${entry.event}`}
              aria-current={isSelected}
              className="absolute w-2 h-2 rounded-full transition-all"
              style={{
                left: `${(entryIndex / (timeline.length - 1)) * 100}%`,
                background: isSelected ? TIMELINE_CATEGORY_COLORS[entry.category] : '#2a4a4a',
                boxShadow: isSelected
                  ? `0 0 8px ${TIMELINE_CATEGORY_COLORS[entry.category]}`
                  : 'none',
                transform: `translateX(-50%) scale(${isSelected ? 1.5 : 1})`,
              }}
            />
          );
        })}
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center p-4 rounded"
        style={{ background: 'rgba(78,205,196,0.03)', border: '1px solid rgba(78,205,196,0.1)' }}
        aria-live="polite"
      >
        <div className="text-2xl font-bold mb-2 tabular-nums" style={{ color }}>
          {formatYear(event.year)}
        </div>
        <p
          className="text-[11px] text-center leading-relaxed max-w-sm"
          style={{ color: '#8ac8c0' }}
        >
          {event.event}
        </p>
        <span
          className="mt-2 px-2 py-0.5 rounded text-[7px] uppercase tracking-widest"
          style={{ background: `${color}15`, color }}
        >
          {event.category}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={() => setIndex((current) => Math.max(0, current - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider"
          style={{
            background: 'rgba(78,205,196,0.1)',
            border: '1px solid rgba(78,205,196,0.2)',
            color: '#4ecdc4',
            opacity: index === 0 ? 0.3 : 1,
          }}
        >
          <ChevronLeft size={10} aria-hidden /> EARLIER
        </button>
        <span className="text-[8px] tabular-nums" style={{ color: '#2a6a60' }}>
          {index + 1} / {timeline.length}
        </span>
        <button
          type="button"
          onClick={() => setIndex((current) => Math.min(timeline.length - 1, current + 1))}
          disabled={index === timeline.length - 1}
          className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider"
          style={{
            background: 'rgba(78,205,196,0.1)',
            border: '1px solid rgba(78,205,196,0.2)',
            color: '#4ecdc4',
            opacity: index === timeline.length - 1 ? 0.3 : 1,
          }}
        >
          LATER <ChevronRight size={10} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default ChronosWindow;
