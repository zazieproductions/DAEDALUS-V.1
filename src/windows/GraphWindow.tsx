import { useCallback, useEffect, useRef, useState } from 'react';

import { useAnimationCanvas, type CanvasFrame } from '@/hooks/useAnimationCanvas';
import {
  categoryColor,
  createKnowledgeGraph,
  findNodeAt,
  GRAPH_CATEGORIES,
  SIMULATION_DEFAULTS,
  stepForceSimulation,
  type GraphEdge,
  type GraphNode,
} from '@/lib/simulations/force-graph';

const CANVAS = { width: SIMULATION_DEFAULTS.width, height: SIMULATION_DEFAULTS.height } as const;

/**
 * KNOWLEDGE GRAPH — sixteen concepts, four faculties, one force simulation.
 *
 * The simulation itself lives in `@/lib/simulations/force-graph` and is pure;
 * this component owns only the canvas, the pointer and the legend. Node and
 * edge arrays are held in refs and mutated in place — re-allocating them 60
 * times a second would be pointless garbage.
 *
 * Hover is tracked in a ref for the draw loop and mirrored into state only
 * when it changes, so moving the mouse costs at most one React render per
 * node transition instead of one per frame.
 */
export function GraphWindow() {
  // Lazily built once, then mutated in place by the simulation.
  const graphRef = useRef<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  graphRef.current ??= createKnowledgeGraph(CANVAS);

  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const draw = useCallback(({ ctx, width, height }: CanvasFrame) => {
    const graph = graphRef.current;
    if (!graph) return;
    const { nodes, edges } = graph;

    stepForceSimulation(nodes, { width, height, pointer: pointerRef.current });

    // Motion trails, same technique as the cortex mapper.
    ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
    ctx.fillRect(0, 0, width, height);

    const byId = new Map(nodes.map((node) => [node.id, node]));

    for (const edge of edges) {
      const source = byId.get(edge.source);
      const target = byId.get(edge.target);
      if (!source || !target) continue;

      // Cross-faculty links are drawn faintest — they are the rarest and, per
      // the manifesto, the most interesting.
      const isCrossCategory = source.category !== target.category;
      ctx.strokeStyle = isCrossCategory
        ? 'rgba(255,255,255,0.06)'
        : `${categoryColor(source.category)}30`;
      ctx.lineWidth = isCrossCategory ? 0.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    }

    for (const node of nodes) {
      const color = categoryColor(node.category);
      const isHovered = hoveredRef.current === node.id;

      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
      glow.addColorStop(0, `${color}40`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHovered ? '#fff' : color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * (isHovered ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `${color}90`;
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + node.size + 10);
    }
  }, []);

  const canvasRef = useAnimationCanvas({ ...CANVAS, draw });

  // Pointer tracking is wired up imperatively so it can run at pointer rate
  // without re-rendering, and still map CSS pixels into canvas coordinates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toCanvasSpace = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      return {
        x: (event.clientX - rect.left) * (CANVAS.width / rect.width),
        y: (event.clientY - rect.top) * (CANVAS.height / rect.height),
      };
    };

    const handleMove = (event: PointerEvent) => {
      const point = toCanvasSpace(event);
      pointerRef.current = point;

      const node = point && graphRef.current ? findNodeAt(graphRef.current.nodes, point) : null;
      const nextId = node?.id ?? null;
      if (nextId !== hoveredRef.current) {
        hoveredRef.current = nextId;
        setHovered(nextId);
      }
    };

    const handleLeave = () => {
      pointerRef.current = null;
      hoveredRef.current = null;
      setHovered(null);
    };

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerleave', handleLeave);
    return () => {
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerleave', handleLeave);
    };
  }, [canvasRef]);

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex-1 p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          role="img"
          aria-label={
            hovered
              ? `Knowledge graph, ${hovered} highlighted`
              : 'Force-directed knowledge graph of sixteen concepts'
          }
        />
      </div>
      <div
        className="flex items-center justify-center gap-3 p-2"
        style={{ borderTop: '1px solid #1a1a2e' }}
      >
        {GRAPH_CATEGORIES.map((category) => (
          <div key={category.name} className="flex items-center gap-1">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full"
              style={{ background: category.color }}
            />
            <span
              className="font-mono text-[8px] tracking-wider"
              style={{ color: `${category.color}90` }}
            >
              {category.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GraphWindow;
