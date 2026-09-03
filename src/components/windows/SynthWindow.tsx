import { useState } from 'react';
import { ideationPrompts, ideationDomains } from '../../data/catalogs';
import { Shuffle, Lightbulb, Copy, Check, Sparkles } from 'lucide-react';

function rollConnections(): string[] {
  const shuffled = [...ideationDomains].sort(() => Math.random() - 0.5);
  return [`${shuffled[0]} × ${shuffled[1]}`, `${shuffled[2]} × ${shuffled[3]}`, `${shuffled[4]} × ${shuffled[5]}`];
}

export default function SynthWindow() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [connections, setConnections] = useState<string[]>(() => rollConnections());

  const generateConnections = () => {
    setGenerating(true);
    const pairs = rollConnections();
    window.setTimeout(() => {
      setConnections(pairs);
      setGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(ideationPrompts[currentPrompt]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#a855f7', background: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="p-3 rounded mb-3"
        style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={10} style={{ color: '#a855f7' }} />
          <span className="text-[9px] tracking-wider" style={{ color: '#7c3aed' }}>
            IDEATION PROMPT #{currentPrompt + 1}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#d8b4fe' }}>
          {ideationPrompts[currentPrompt]}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => setCurrentPrompt((currentPrompt + 1) % ideationPrompts.length)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider transition-all"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}
          >
            <Shuffle size={8} /> NEXT
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider transition-all"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#7c3aed' }}
          >
            {copied ? <Check size={8} /> : <Copy size={8} />} {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={10} style={{ color: '#a855f7' }} />
          <span className="text-[9px] tracking-wider" style={{ color: '#7c3aed' }}>
            CROSS-POLLINATION ENGINE
          </span>
        </div>
        <div className="space-y-1.5">
          {connections.map((c, i) => (
            <div
              key={i}
              className="p-2 rounded text-[10px] transition-all"
              style={{
                background: 'rgba(168,85,247,0.03)',
                border: '1px solid rgba(168,85,247,0.1)',
                color: '#c084fc',
                opacity: generating ? 0.3 : 1,
              }}
            >
              ⟨ {c} ⟩
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={generateConnections}
          className="mt-2 w-full py-1.5 rounded text-[9px] tracking-wider transition-all"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: '#a855f7',
          }}
        >
          {generating ? '◌ SYNTHESIZING...' : '↻ REGENERATE CONNECTIONS'}
        </button>
      </div>
    </div>
  );
}
