import { useMemo, useState } from 'react';
import { Languages, Search } from 'lucide-react';

import { LEXICON } from '@/data/lexicon';

/**
 * LEXICON OBSCURA.
 *
 * An accordion of untranslatable words. Definitions stay collapsed by design:
 * you meet the word before you meet its explanation, which is the entire
 * argument of the window — that naming a thing is what lets you think it.
 */
export function LexiconWindow() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return LEXICON;

    return LEXICON.filter(
      (entry) =>
        entry.term.toLowerCase().includes(needle) ||
        entry.definition.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#f0a0c0', background: 'rgba(0,0,0,0.3)' }}
    >
      <h3 className="flex items-center gap-2 mb-2">
        <Languages size={10} style={{ color: '#f0a0c0' }} aria-hidden />
        <span className="text-[9px] tracking-wider" style={{ color: '#c07090' }}>
          LEXICON OF UNTRANSLATABLE CONCEPTS
        </span>
      </h3>

      <div
        className="flex items-center gap-2 mb-2 px-2 py-1 rounded"
        style={{ background: 'rgba(240,160,192,0.05)', border: '1px solid rgba(240,160,192,0.15)' }}
      >
        <Search size={10} style={{ color: '#f0a0c0' }} aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lexicon..."
          aria-label="Search terms and definitions"
          className="flex-1 bg-transparent outline-none text-[10px]"
          style={{ color: '#f0a0c0' }}
        />
      </div>

      <ul className="flex-1 overflow-auto space-y-1">
        {results.map((entry) => {
          const isExpanded = expanded === entry.term;

          return (
            <li key={entry.term}>
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : entry.term)}
                aria-expanded={isExpanded}
                className="w-full text-left p-2 rounded transition-all"
                style={{
                  background: isExpanded ? 'rgba(240,160,192,0.08)' : 'rgba(240,160,192,0.02)',
                  border: `1px solid ${
                    isExpanded ? 'rgba(240,160,192,0.2)' : 'rgba(240,160,192,0.05)'
                  }`,
                }}
              >
                <span className="font-bold text-[11px] block" style={{ color: '#f0a0c0' }}>
                  {entry.term}
                </span>
                {isExpanded && (
                  <span
                    className="mt-1 text-[10px] leading-relaxed block"
                    style={{ color: '#c08098' }}
                  >
                    {entry.definition}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p
        className="mt-2 pt-2 text-[8px] text-center"
        style={{ borderTop: '1px solid rgba(240,160,192,0.1)', color: '#805060' }}
      >
        {results.length} entries · Some things exist only between languages
      </p>
    </div>
  );
}

export default LexiconWindow;
