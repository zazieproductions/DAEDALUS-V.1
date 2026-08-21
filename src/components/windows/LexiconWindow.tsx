import { useState } from 'react';
import { lexiconEntries } from '../../lib/store';
import { Languages, Search } from 'lucide-react';

export default function LexiconWindow() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = lexiconEntries.filter(
    (e) => !search || e.term.toLowerCase().includes(search.toLowerCase()) || e.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-3 font-mono text-xs" style={{ color: '#f0a0c0', background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Languages size={10} style={{ color: '#f0a0c0' }} />
        <span className="text-[9px] tracking-wider" style={{ color: '#c07090' }}>LEXICON OF UNTRANSLATABLE CONCEPTS</span>
      </div>

      <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded" style={{ background: 'rgba(240,160,192,0.05)', border: '1px solid rgba(240,160,192,0.15)' }}>
        <Search size={10} style={{ color: '#f0a0c0' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lexicon..."
          className="flex-1 bg-transparent outline-none text-[10px]"
          style={{ color: '#f0a0c0' }}
        />
      </div>

      <div className="flex-1 overflow-auto space-y-1">
        {filtered.map((entry) => (
          <button
            key={entry.term}
            onClick={() => setExpanded(expanded === entry.term ? null : entry.term)}
            className="w-full text-left p-2 rounded transition-all"
            style={{
              background: expanded === entry.term ? 'rgba(240,160,192,0.08)' : 'rgba(240,160,192,0.02)',
              border: `1px solid ${expanded === entry.term ? 'rgba(240,160,192,0.2)' : 'rgba(240,160,192,0.05)'}`,
            }}
          >
            <div className="font-bold text-[11px]" style={{ color: '#f0a0c0' }}>{entry.term}</div>
            {expanded === entry.term && (
              <div className="mt-1 text-[10px] leading-relaxed" style={{ color: '#c08098' }}>
                {entry.def}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-2 pt-2 text-[8px] text-center" style={{ borderTop: '1px solid rgba(240,160,192,0.1)', color: '#805060' }}>
        {filtered.length} entries · Some things exist only between languages
      </div>
    </div>
  );
}
