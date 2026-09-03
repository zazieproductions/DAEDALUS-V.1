import { useEffect, useRef } from 'react';
import { graphCategories } from '../../data/catalogs';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  category: string;
  size: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

export default function GraphWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = 360;
    const ch = 260;
    canvas.width = cw;
    canvas.height = ch;

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    graphCategories.forEach((cat, ci) => {
      cat.nodes.forEach((name, ni) => {
        const angle = ((ci * cat.nodes.length + ni) / (graphCategories.length * 4)) * Math.PI * 2;
        nodes.push({
          id: name,
          x: cw / 2 + Math.cos(angle) * (60 + Math.random() * 60),
          y: ch / 2 + Math.sin(angle) * (40 + Math.random() * 40),
          vx: 0,
          vy: 0,
          category: cat.name,
          size: 3 + Math.random() * 4,
        });
      });

      for (let i = 0; i < cat.nodes.length; i++) {
        for (let j = i + 1; j < cat.nodes.length; j++) {
          if (Math.random() < 0.6) edges.push({ source: cat.nodes[i], target: cat.nodes[j] });
        }
      }
    });

    for (let i = 0; i < 8; i++) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      if (a.category !== b.category) edges.push({ source: a.id, target: b.id });
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;

    const getColor = (cat: string) => graphCategories.find((c) => c.name === cat)?.color || '#fff';

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
      ctx.fillRect(0, 0, cw, ch);

      const ns = nodesRef.current;

      for (let i = 0; i < ns.length; i++) {
        ns[i].vx += (cw / 2 - ns[i].x) * 0.0005;
        ns[i].vy += (ch / 2 - ns[i].y) * 0.0005;

        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x;
          const dy = ns[i].y - ns[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 50 / (dist * dist);
          ns[i].vx += dx * force * 0.01;
          ns[i].vy += dy * force * 0.01;
          ns[j].vx -= dx * force * 0.01;
          ns[j].vy -= dy * force * 0.01;
        }

        const mdx = mouseRef.current.x - ns[i].x;
        const mdy = mouseRef.current.y - ns[i].y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 80) {
          ns[i].vx += mdx * 0.001;
          ns[i].vy += mdy * 0.001;
        }

        ns[i].vx *= 0.95;
        ns[i].vy *= 0.95;
        ns[i].x += ns[i].vx;
        ns[i].y += ns[i].vy;
        ns[i].x = Math.max(20, Math.min(cw - 20, ns[i].x));
        ns[i].y = Math.max(20, Math.min(ch - 20, ns[i].y));
      }

      let nearestId: string | null = null;
      let nearestDist = 16;
      for (const n of ns) {
        const dx = mouseRef.current.x - n.x;
        const dy = mouseRef.current.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < nearestDist) {
          nearestId = n.id;
          nearestDist = d;
        }
      }
      hoveredRef.current = nearestId;

      edgesRef.current.forEach((e) => {
        const s = ns.find((n) => n.id === e.source);
        const t = ns.find((n) => n.id === e.target);
        if (!s || !t) return;
        const isCross = s.category !== t.category;
        ctx.strokeStyle = isCross ? 'rgba(255,255,255,0.06)' : `${getColor(s.category)}30`;
        ctx.lineWidth = isCross ? 0.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });

      ns.forEach((n) => {
        const color = getColor(n.category);
        const isHovered = hoveredRef.current === n.id;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 4);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isHovered ? '#fff' : color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * (isHovered ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color + '90';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.id, n.x, n.y + n.size + 10);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (cw / rect.width),
        y: (e.clientY - rect.top) * (ch / rect.height),
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex-1 p-2">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="flex items-center justify-center gap-3 p-2" style={{ borderTop: '1px solid #1a1a2e' }}>
        {graphCategories.map((c) => (
          <div key={c.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            <span className="font-mono text-[8px] tracking-wider" style={{ color: c.color + '90' }}>
              {c.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
