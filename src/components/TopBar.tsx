import { useEffect, type ReactNode } from 'react';
import { useOSStore, type WindowId } from '../lib/store';
import { getTimeGreeting } from '../lib/utils';
import { colors } from '../config/theme';
import {
  Cpu,
  Zap,
  Brain,
  Eye,
  Sparkles,
  Terminal,
  BookOpen,
  Lightbulb,
  Network,
  FileText,
  Compass,
  Clock,
  Languages,
  Palette,
} from 'lucide-react';

const windowIcons: Record<WindowId, typeof Cpu> = {
  terminal: Terminal,
  cortex: Brain,
  library: BookOpen,
  synth: Lightbulb,
  graph: Network,
  manifesto: FileText,
  oracle: Compass,
  chronos: Clock,
  lexicon: Languages,
  moodboard: Palette,
};

export default function TopBar() {
  const currentTime = useOSStore((s) => s.currentTime);
  const setTime = useOSStore((s) => s.setTime);
  const geniusScore = useOSStore((s) => s.geniusScore);
  const polymathIndex = useOSStore((s) => s.polymathIndex);
  const obscurityRating = useOSStore((s) => s.obscurityRating);
  const creativePulse = useOSStore((s) => s.creativePulse);
  const updateMetrics = useOSStore((s) => s.updateMetrics);
  const windows = useOSStore((s) => s.windows);
  const setActiveWindow = useOSStore((s) => s.setActiveWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);

  useEffect(() => {
    const t1 = window.setInterval(() => setTime(new Date()), 1000);
    const t2 = window.setInterval(() => updateMetrics(), 3000);
    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
    };
  }, [setTime, updateMetrics]);

  const hour = currentTime.getHours();
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999] h-[52px] flex items-center justify-between px-3 select-none"
      style={{
        background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.surfaceDeep} 100%)`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu size={18} style={{ color: colors.phosphor }} className="animate-pulse" />
            <div
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping"
              style={{ background: colors.phosphor }}
            />
          </div>
          <span className="font-mono text-xs font-bold tracking-[0.2em]" style={{ color: colors.phosphor }}>
            DAEDALUS<span style={{ color: '#666' }}>//OS</span>
          </span>
        </div>
        <div className="h-6 w-px" style={{ background: colors.border }} />
        <span className="font-mono text-[10px] tracking-wider truncate" style={{ color: colors.muted }}>
          {getTimeGreeting(hour)}
        </span>
      </div>

      <div className="flex items-center gap-1" data-dock>
        {(Object.keys(windows) as WindowId[]).map((id) => {
          const Icon = windowIcons[id];
          const frame = windows[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => (frame.minimized ? setActiveWindow(id) : toggleMinimize(id))}
              className="relative flex items-center gap-1 px-2 py-1 rounded transition-all"
              style={{
                background: !frame.minimized ? 'rgba(0,255,136,0.1)' : 'transparent',
                border: !frame.minimized ? '1px solid rgba(0,255,136,0.3)' : '1px solid transparent',
              }}
              title={frame.title}
            >
              <Icon size={12} style={{ color: !frame.minimized ? colors.phosphor : '#555' }} />
              {!frame.minimized && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                  style={{ background: colors.phosphor }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MetricPill icon={<Zap size={10} />} label="GQ" value={geniusScore} color={colors.coral} />
          <MetricPill icon={<Brain size={10} />} label="PI" value={polymathIndex} color={colors.teal} />
          <MetricPill icon={<Eye size={10} />} label="OR" value={obscurityRating} color={colors.gold} />
          <MetricPill icon={<Sparkles size={10} />} label="CP" value={creativePulse} color={colors.violet} />
        </div>
        <div className="h-6 w-px" style={{ background: colors.border }} />
        <div className="text-right font-mono">
          <div className="text-[11px] font-bold tracking-wider" style={{ color: colors.foreground }}>
            {timeStr}
          </div>
          <div className="text-[9px] tracking-wider" style={{ color: '#666' }}>
            {dateStr}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[9px] tracking-wider" style={{ color: '#777' }}>
        {label}
      </span>
      <span className="text-[10px] font-bold tabular-nums" style={{ color }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}
