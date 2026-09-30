import type { MetricDescriptor } from '@/types/os';

interface MetricPillProps {
  metric: MetricDescriptor;
  value: number;
}

/**
 * One synthetic telemetry readout.
 *
 * `tabular-nums` matters more than it looks: without it the digits change
 * width as the value drifts and the whole top bar jitters once a second.
 */
export function MetricPill({ metric, value }: MetricPillProps) {
  const Icon = metric.icon;

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-mono"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      title={`${metric.label}: ${value.toFixed(1)}`}
    >
      <span style={{ color: metric.color }} aria-hidden>
        <Icon size={10} />
      </span>
      <span className="text-[9px] tracking-wider" style={{ color: '#777' }} aria-hidden>
        {metric.abbreviation}
      </span>
      <span className="sr-only">{metric.label}</span>
      <span className="text-[10px] font-bold tabular-nums" style={{ color: metric.color }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default MetricPill;
