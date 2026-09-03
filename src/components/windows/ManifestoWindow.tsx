import { useState } from 'react';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { defaultManifesto } from '../../data/catalogs';

export default function ManifestoWindow() {
  const [text, setText] = useState(defaultManifesto);
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(defaultManifesto.split(/\s+/).length);

  const handleChange = (val: string) => {
    setText(val);
    setWordCount(val.split(/\s+/).filter(Boolean).length);
    setSaved(false);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,107,107,0.1)' }}
      >
        <FileText size={10} style={{ color: '#ff6b6b' }} />
        <span className="font-mono text-[9px] tracking-wider" style={{ color: '#ff6b6b' }}>
          MANIFESTO.txt
        </span>
        <div className="flex-1" />
        <span className="font-mono text-[8px]" style={{ color: '#555' }}>
          {wordCount} words
        </span>
        <button
          type="button"
          onClick={() => {
            // Visual acknowledgement only — no persistence layer exists.
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] tracking-wider"
          style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#ff6b6b' }}
        >
          <Save size={8} /> {saved ? 'SAVED' : 'SAVE'}
        </button>
        <button type="button" onClick={() => handleChange(defaultManifesto)} className="p-1 rounded" style={{ color: '#555' }}>
          <RotateCcw size={10} />
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 p-3 bg-transparent outline-none resize-none font-mono text-[11px] leading-relaxed"
        style={{ color: '#e0e0e0' }}
        spellCheck={false}
      />
    </div>
  );
}
