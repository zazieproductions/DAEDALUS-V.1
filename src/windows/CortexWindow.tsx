import { useCallback, useRef, useState } from 'react';

import { accent } from '@/config/theme';
import { useAnimationCanvas, type CanvasFrame } from '@/hooks/useAnimationCanvas';
import {
  createSynapseField,
  synapseLinkOpacity,
  type SynapseNode,
} from '@/lib/simulations/synapse-field';

/** Logical canvas size. Node coordinates are laid out inside this box. */
const CANVAS = { width: 400, height: 280 } as const;

/**
 * The original loop advanced an internal counter by 0.02 per frame. The
 * animation hook reports elapsed *seconds* instead, so this factor preserves
 * the original tempo (0.02 × 60fps ≈ 1.2 rad/s) independently of frame rate.
 */
const RADIANS_PER_SECOND = 1.2;

/** Colour of a highlighted node. */
const ACTIVE_COLOR = '#ff6b6b';

/**
 * CORTEX MAPPER — an ambient portrait of twelve disciplines as one substrate.
 *
 * Rendering notes:
 *  - The canvas is never cleared. Each frame paints a 15% translucent wash of
 *    the background colour instead, which is what produces the phosphor trails.
 *  - Nodes orbit their rest position by a few pixels on de-phased sines, so the
 *    field breathes without any physics.
 *  - The selected label lives in a ref as well as state: the draw loop reads
 *    the ref (no restart on selection) while the buttons render from state.
 */
export function CortexWindow() {
  const [nodes] = useState<SynapseNode[]>(() => createSynapseField(CANVAS));
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const activeLabelRef = useRef<string | null>(null);

  const selectLabel = (label: string) => {
    const next = activeLabelRef.current === label ? null : label;
    activeLabelRef.current = next;
    setActiveLabel(next);
  };

  const draw = useCallback(
    ({ ctx, width, height, time }: CanvasFrame) => {
      const t = time * RADIANS_PER_SECOND;

      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Connections: distance-attenuated, pulsing, drawn before the nodes.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const alpha = synapseLinkOpacity(Math.hypot(dx, dy), t, i);
          if (alpha <= 0) continue;

          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x + Math.sin(t + i) * 3, nodes[i].y + Math.cos(t + i) * 3);
          ctx.lineTo(nodes[j].x + Math.sin(t + j) * 3, nodes[j].y + Math.cos(t + j) * 3);
          ctx.stroke();
        }
      }

      nodes.forEach((node, index) => {
        const x = node.x + Math.sin(t + index) * 3;
        const y = node.y + Math.cos(t + index) * 3;
        const pulse = 1 + 0.3 * Math.sin(t * 2 + index);
        const isActive = activeLabelRef.current === node.label;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, node.radius * 3 * pulse);
        glow.addColorStop(0, isActive ? 'rgba(255, 107, 107, 0.6)' : 'rgba(0, 255, 136, 0.4)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, node.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActive ? ACTIVE_COLOR : accent.signal;
        ctx.beginPath();
        ctx.arc(x, y, node.radius * pulse * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActive ? ACTIVE_COLOR : 'rgba(0, 255, 136, 0.7)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y + node.radius * 2 + 10);
      });

      // Drifting motes, on incommensurable periods so the pattern never repeats.
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(t * 0.3 + i * 17) * 0.5 + 0.5) * width;
        const y = (Math.cos(t * 0.2 + i * 13) * 0.5 + 0.5) * height;
        ctx.fillStyle = `rgba(78, 205, 196, ${0.1 + 0.1 * Math.sin(t + i)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [nodes],
  );

  const canvasRef = useAnimationCanvas({ ...CANVAS, draw });

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex-1 flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          role="img"
          aria-label="Animated synapse field connecting twelve disciplines"
        />
      </div>
      <div className="flex flex-wrap gap-1 p-2" style={{ borderTop: '1px solid #1a2a1a' }}>
        {nodes.map((node) => {
          const isActive = activeLabel === node.label;

          return (
            <button
              key={node.label}
              type="button"
              onClick={() => selectLabel(node.label)}
              aria-pressed={isActive}
              className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider transition-all"
              style={{
                background: isActive ? 'rgba(255,107,107,0.2)' : 'rgba(0,255,136,0.05)',
                border: `1px solid ${isActive ? '#ff6b6b40' : '#00ff8820'}`,
                color: isActive ? ACTIVE_COLOR : accent.signal,
              }}
            >
              {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CortexWindow;
