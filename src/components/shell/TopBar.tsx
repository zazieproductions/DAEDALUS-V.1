import { Cpu } from 'lucide-react';

import { MetricPill } from '@/components/shell/MetricPill';
import { WindowDock } from '@/components/shell/WindowDock';
import { METRIC_TICK_MS, METRICS } from '@/config/metrics';
import { accent, surface, TOP_BAR_HEIGHT } from '@/config/theme';
import { useInterval } from '@/hooks/useInterval';
import { getTimeGreeting } from '@/lib/text';
import { useOSStore } from '@/store/osStore';

/** Clock resolution. The readout shows seconds, so one second it is. */
const CLOCK_TICK_MS = 1000;

/**
 * The system bar: identity, circadian greeting, dock, telemetry and clock.
 *
 * It owns the OS's two heartbeats — the clock (1 Hz) and the metric walk
 * (0.33 Hz). Both live here rather than in the store so that the timers exist
 * only while the desktop is mounted.
 */
export function TopBar() {
  const currentTime = useOSStore((store) => store.currentTime);
  const metrics = useOSStore((store) => store.metrics);
  const setTime = useOSStore((store) => store.setTime);
  const advanceMetrics = useOSStore((store) => store.advanceMetrics);

  useInterval(() => setTime(new Date()), CLOCK_TICK_MS);
  useInterval(advanceMetrics, METRIC_TICK_MS);

  const timeLabel = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateLabel = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between px-3 select-none"
      style={{
        height: TOP_BAR_HEIGHT,
        background: `linear-gradient(180deg, ${surface.raised} 0%, #0d0d1a 100%)`,
        borderBottom: `1px solid ${surface.border}`,
      }}
    >
      {/* Identity + circadian greeting */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative" aria-hidden>
            <Cpu size={18} style={{ color: accent.signal }} className="animate-pulse" />
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping"
              style={{ background: accent.signal }}
            />
          </span>
          <span
            className="font-mono text-xs font-bold tracking-[0.2em]"
            style={{ color: accent.signal }}
          >
            DAEDALUS<span style={{ color: '#666' }}>//OS</span>
          </span>
        </div>
        <span className="h-6 w-px" style={{ background: surface.border }} aria-hidden />
        <span className="font-mono text-[10px] tracking-wider" style={{ color: surface.muted }}>
          {getTimeGreeting(currentTime.getHours())}
        </span>
      </div>

      <WindowDock />

      {/* Telemetry + clock */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {METRICS.map((metric) => (
            <MetricPill key={metric.key} metric={metric} value={metrics[metric.key]} />
          ))}
        </div>
        <span className="h-6 w-px" style={{ background: surface.border }} aria-hidden />
        <div className="text-right font-mono">
          <div
            className="text-[11px] font-bold tracking-wider tabular-nums"
            style={{ color: surface.foreground }}
          >
            {timeLabel}
          </div>
          <div className="text-[9px] tracking-wider" style={{ color: '#666' }}>
            {dateLabel}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
