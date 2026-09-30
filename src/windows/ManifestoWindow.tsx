import { useState } from 'react';
import { FileText, RotateCcw, Save } from 'lucide-react';

import { DEFAULT_MANIFESTO, MANIFESTO_SAVE_FEEDBACK_MS } from '@/data/manifesto';
import { countWords } from '@/lib/text';

/**
 * MANIFESTO EDITOR.
 *
 * A plain textarea holding the project's statement of intent. SAVE is
 * theatre — it flashes a confirmation and persists nothing, which is honest
 * about what this window is: a prop that happens to be editable. Persisting it
 * to `localStorage` is on the roadmap, behind a deliberate decision that the
 * OS should boot identically every time.
 *
 * The word count is derived at render time rather than stored, so it can never
 * disagree with the text.
 */
export function ManifestoWindow() {
  const [text, setText] = useState(DEFAULT_MANIFESTO);
  const [saved, setSaved] = useState(false);

  const handleChange = (value: string) => {
    setText(value);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), MANIFESTO_SAVE_FEEDBACK_MS);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,107,107,0.1)' }}
      >
        <FileText size={10} style={{ color: '#ff6b6b' }} aria-hidden />
        <span className="font-mono text-[9px] tracking-wider" style={{ color: '#ff6b6b' }}>
          MANIFESTO.txt
        </span>
        <span className="flex-1" />
        <span className="font-mono text-[8px] tabular-nums" style={{ color: '#555' }}>
          {countWords(text)} words
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] tracking-wider"
          style={{
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.2)',
            color: '#ff6b6b',
          }}
        >
          <Save size={8} aria-hidden /> {saved ? 'SAVED' : 'SAVE'}
        </button>
        <button
          type="button"
          onClick={() => handleChange(DEFAULT_MANIFESTO)}
          className="p-1 rounded"
          style={{ color: '#555' }}
          aria-label="Reset manifesto to the original draft"
          title="Reset to original draft"
        >
          <RotateCcw size={10} aria-hidden />
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Manifesto text"
        className="flex-1 p-3 bg-transparent outline-none resize-none font-mono text-[11px] leading-relaxed"
        style={{ color: '#e0e0e0' }}
        spellCheck={false}
      />
    </div>
  );
}

export default ManifestoWindow;
