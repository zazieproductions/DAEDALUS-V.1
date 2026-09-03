import { useState } from 'react';
import { bookshelf } from '../../data/catalogs';
import { Search, BookOpen, Star } from 'lucide-react';

export default function LibraryWindow() {
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['Gödel, Escher, Bach', 'Pale Fire']));

  const fields = [...new Set(bookshelf.map((b) => b.field))];
  const filtered = bookshelf.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchField = !selectedField || b.field === selectedField;
    return matchSearch && matchField;
  });

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#e0d4b8', background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex-1 flex items-center gap-2 px-2 py-1 rounded"
          style={{ background: 'rgba(224,212,184,0.05)', border: '1px solid rgba(224,212,184,0.15)' }}
        >
          <Search size={10} style={{ color: '#e0d4b8' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the stacks..."
            className="flex-1 bg-transparent outline-none text-[10px]"
            style={{ color: '#e0d4b8' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <button
          type="button"
          onClick={() => setSelectedField(null)}
          className="px-1.5 py-0.5 rounded text-[8px] tracking-wider"
          style={{
            background: !selectedField ? 'rgba(224,212,184,0.15)' : 'transparent',
            border: '1px solid rgba(224,212,184,0.1)',
            color: '#e0d4b8',
          }}
        >
          ALL
        </button>
        {fields.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setSelectedField(selectedField === f ? null : f)}
            className="px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase"
            style={{
              background: selectedField === f ? 'rgba(224,212,184,0.15)' : 'transparent',
              border: '1px solid rgba(224,212,184,0.08)',
              color: selectedField === f ? '#e0d4b8' : '#8a7e68',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto space-y-1">
        {filtered.map((book) => (
          <div
            key={book.title}
            className="flex items-start gap-2 p-2 rounded transition-all hover:scale-[1.01]"
            style={{ background: 'rgba(224,212,184,0.03)', border: '1px solid rgba(224,212,184,0.06)' }}
          >
            <BookOpen size={12} style={{ color: '#8a7e68', marginTop: 2, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-[11px] truncate" style={{ color: '#e0d4b8' }}>
                  {book.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = new Set(favorites);
                    if (next.has(book.title)) next.delete(book.title);
                    else next.add(book.title);
                    setFavorites(next);
                  }}
                >
                  <Star
                    size={8}
                    fill={favorites.has(book.title) ? '#ffe66d' : 'none'}
                    style={{ color: favorites.has(book.title) ? '#ffe66d' : '#555' }}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#8a7e68' }}>{book.author}</span>
                <span style={{ color: '#555' }}>•</span>
                <span style={{ color: '#555' }}>{book.year}</span>
                <span
                  className="px-1 rounded text-[7px] uppercase tracking-wider"
                  style={{ background: 'rgba(224,212,184,0.08)', color: '#8a7e68' }}
                >
                  {book.field}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-2 pt-2 text-[9px] text-center"
        style={{ borderTop: '1px solid rgba(224,212,184,0.1)', color: '#555' }}
      >
        {filtered.length} volumes · BIBLIOTHECA UNIVERSALIS
      </div>
    </div>
  );
}
