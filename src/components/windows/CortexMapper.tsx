import { useEffect, useRef, useState } from 'react';
import { generateSynapseData } from '../../lib/utils';

export default function CortexMapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes] = useState(generateSynapseData);
  const animRef = useRef<number>(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 280;

    const animate = () => {
      timeRef.current += 0.02;
      const t = timeRef.current;
      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.3 * (0.5 + 0.5 * Math.sin(t + i * 0.5));
            ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x + Math.sin(t + i) * 3, nodes[i].y + Math.cos(t + i) * 3);
            ctx.lineTo(nodes[j].x + Math.sin(t + j) * 3, nodes[j].y + Math.cos(t + j) * 3);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const nx = node.x + Math.sin(t + i) * 3;
        const ny = node.y + Math.cos(t + i) * 3;
        const pulse = 1 + 0.3 * Math.sin(t * 2 + i);
        const isActive = activeNode === node.label;

        // Glow
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.r * 3 * pulse);
        gradient.addColorStop(0, isActive ? 'rgba(255, 107, 107, 0.6)' : 'rgba(0, 255, 136, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nx, ny, node.r * 3 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = isActive ? '#ff6b6b' : '#00ff88';
        ctx.beginPath();
        ctx.arc(nx, ny, node.r * pulse * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isActive ? '#ff6b6b' : 'rgba(0, 255, 136, 0.7)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, ny + node.r * 2 + 10);
      });

      // Floating particles
      for (let i = 0; i < 20; i++) {
        const px = (Math.sin(t * 0.3 + i * 17) * 0.5 + 0.5) * canvas.width;
        const py = (Math.cos(t * 0.2 + i * 13) * 0.5 + 0.5) * canvas.height;
        ctx.fillStyle = `rgba(78, 205, 196, ${0.1 + 0.1 * Math.sin(t + i)})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [nodes, activeNode]);

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex-1 flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <div className="flex flex-wrap gap-1 p-2" style={{ borderTop: '1px solid #1a2a1a' }}>
        {nodes.map((n) => (
          <button
            key={n.label}
            onClick={() => setActiveNode(activeNode === n.label ? null : n.label)}
            className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider transition-all"
            style={{
              background: activeNode === n.label ? 'rgba(255,107,107,0.2)' : 'rgba(0,255,136,0.05)',
              border: `1px solid ${activeNode === n.label ? '#ff6b6b40' : '#00ff8820'}`,
              color: activeNode === n.label ? '#ff6b6b' : '#00ff88',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
