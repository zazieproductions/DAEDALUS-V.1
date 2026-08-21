import { useRef, useState, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useOSStore, type WindowId } from '../lib/store';
import { Minus, Maximize2, X } from 'lucide-react';

interface Props {
  id: WindowId;
  children: ReactNode;
  accentColor?: string;
}

export default function DraggableWindow({ id, children, accentColor = '#00ff88' }: Props) {
  const { windows, activeWindow, setActiveWindow, toggleMinimize, moveWindow } = useOSStore();
  const w = windows[id];
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setActiveWindow(id);
    offsetRef.current = { x: e.clientX - w.x, y: e.clientY - w.y };

    const handleMouseMove = (ev: MouseEvent) => {
      moveWindow(id, ev.clientX - offsetRef.current.x, ev.clientY - offsetRef.current.y);
    };
    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [id, w.x, w.y, setActiveWindow, moveWindow]);

  if (w.minimized) return null;

  const isActive = activeWindow === id;

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute overflow-hidden"
      style={{
        left: w.x,
        top: w.y,
        width: w.w,
        height: w.h,
        zIndex: w.zIndex,
        borderRadius: '8px',
        border: `1px solid ${isActive ? accentColor + '60' : '#2a2a4a'}`,
        background: 'rgba(10, 10, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: isActive
          ? `0 0 30px ${accentColor}15, 0 8px 32px rgba(0,0,0,0.6)`
          : '0 4px 16px rgba(0,0,0,0.4)',
      }}
      onMouseDown={() => setActiveWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between h-8 px-3 cursor-move select-none"
        style={{
          background: `linear-gradient(90deg, ${accentColor}10 0%, transparent 100%)`,
          borderBottom: `1px solid ${accentColor}20`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
          <span className="font-mono text-[10px] tracking-[0.15em] font-medium" style={{ color: accentColor }}>
            {w.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => toggleMinimize(id)} className="p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity">
            <Minus size={10} style={{ color: '#888' }} />
          </button>
          <button className="p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity">
            <Maximize2 size={10} style={{ color: '#888' }} />
          </button>
          <button onClick={() => toggleMinimize(id)} className="p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity">
            <X size={10} style={{ color: '#888' }} />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-auto" style={{ height: 'calc(100% - 32px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
