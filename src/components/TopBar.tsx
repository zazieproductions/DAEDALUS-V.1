import { useEffect } from 'react';
import { useOSStore, type WindowId } from '../lib/store';
import { getTimeGreeting } from '../lib/utils';
import { Cpu, Zap, Brain, Eye, Sparkles, Terminal, BookOpen, Lightbulb, Network, FileText, Compass, Clock, Languages, Palette } from 'lucide-react';

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
  const { currentTime, setTime, geniusScore, polymathIndex, obscurityRating, creativePulse, updateMetrics, windows, setActiveWindow, toggleMinimize } = useOSStore();

  useEffect(() => {
    const t1 = setInterval(() => setTime(new Date()), 1000);
    const t2 = setInterval(() => updateMetrics(), 3000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [setTime, updateMetrics]);

  const hour = currentTime.getHours();
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[52px] flex items-center justify-between px-3 select-none" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)', borderBottom: '1px solid #2a2a4a' }}>
      {/* Left: Logo & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu size={18} style={{ color: '#00ff88' }} className="animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping" style={{ background: '#00ff88' }} />
          </div>
          <span className="font-mono text-xs font-bold tracking-[0.2em]" style={{ color: '#00ff88' }}>DAEDALUS<span style={{ color: '#666' }}>//OS</span></span>
        </div>
        <div className="h-6 w-px" style={{ background: '#2a2a4a' }} />
        <span className="font-mono text-[10px] tracking-wider" style={{ color: '#8888aa' }}>{getTimeGreeting(hour)}</span>
      </div>

      {/* Center: Window Dock */}
      <div className="flex items-center gap-1">
        {(Object.keys(windows) as WindowId[]).map((id) => {
          const Icon = windowIcons[id];
          const w = windows[id];
          return (
            <button
              key={id}
              onClick={() => w.minimized ? setActiveWindow(id) : toggleMinimize(id)}
              className="relative flex items-center gap-1 px-2 py-1 rounded transition-all"
              style={{
                background: !w.minimized ? 'rgba(0,255,136,0.1)' : 'transparent',
                border: !w.minimized ? '1px solid rgba(0,255,136,0.3)' : '1px solid transparent',
              }}
              title={w.title}
            >
              <Icon size={12} style={{ color: !w.minimized ? '#00ff88' : '#555' }} />
              {!w.minimized && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full" style={{ background: '#00ff88' }} />}
            </button>
          );
        })}
      </div>

      {/* Right: Metrics & Time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MetricPill icon={<Zap size={10} />} label="GQ" value={geniusScore} color="#ff6b6b" />
          <MetricPill icon={<Brain size={10} />} label="PI" value={polymathIndex} color="#4ecdc4" />
          <MetricPill icon={<Eye size={10} />} label="OR" value={obscurityRating} color="#ffe66d" />
          <MetricPill icon={<Sparkles size={10} />} label="CP" value={creativePulse} color="#a855f7" />
        </div>
        <div className="h-6 w-px" style={{ background: '#2a2a4a' }} />
        <div className="text-right font-mono">
          <div className="text-[11px] font-bold tracking-wider" style={{ color: '#e0e0e0' }}>{timeStr}</div>
          <div className="text-[9px] tracking-wider" style={{ color: '#666' }}>{dateStr}</div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color }}>{icon}</span>
      <span className="text-[9px] tracking-wider" style={{ color: '#777' }}>{label}</span>
      <span className="text-[10px] font-bold tabular-nums" style={{ color }}>{value.toFixed(1)}</span>
    </div>
  );
}
