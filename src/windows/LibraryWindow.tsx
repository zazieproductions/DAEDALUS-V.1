import { useMemo, useState } from 'react';
import { BookOpen, Search, Star } from 'lucide-react';

import { BOOKSHELF, DEFAULT_FAVOURITE_TITLES } from '@/data/books';

/**
 * BIBLIOTHECA UNIVERSALIS — the shelf.
 *
 * Search and field filters compose (they are ANDed), and both derive from the
 * data rather than a hard-coded list, so adding a book with a new `field`
 * automatically adds its filter chip.
 */
export function LibraryWindow() {
  const [query, setQuery] = useState('');
  const [field, setField] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(
    () => new Set(DEFAULT_FAVOURITE_TITLES),
  );

  const fields = useMemo(() => [...new Set(BOOKSHELF.map((book) => book.field))], []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return BOOKSHELF.filter((book) => {
      const matchesQuery =
        !needle ||
        book.title.toLowerCase().includes(needle) ||
        book.author.toLowerCase().includes(needle);
      return matchesQuery && (!field || book.field === field);
    });
  }, [query, field]);

  const toggleFavourite = (title: string) => {
    setFavourites((previous) => {
      const next = new Set(previous);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#e0d4b8', background: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="flex items-center gap-2 px-2 py-1 mb-2 rounded"
        style={{ background: 'rgba(224,212,184,0.05)', border: '1px solid rgba(224,212,184,0.15)' }}
      >
        <Search size={10} style={{ color: '#e0d4b8' }} aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the stacks..."
          aria-label="Search books by title or author"
          className="flex-1 bg-transparent outline-none text-[10px]"
          style={{ color: '#e0d4b8' }}
        />
      </div>

      <div className="flex flex-wrap gap-1 mb-2" role="group" aria-label="Filter by field">
        <button
          type="button"
          onClick={() => setField(null)}
          aria-pressed={field === null}
          className="px-1.5 py-0.5 rounded text-[8px] tracking-wider"
          style={{
            background: field ? 'transparent' : 'rgba(224,212,184,0.15)',
            border: '1px solid rgba(224,212,184,0.1)',
            color: '#e0d4b8',
          }}
        >
          ALL
        </button>
        {fields.map((name) => {
          const isActive = field === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => setField(isActive ? null : name)}
              aria-pressed={isActive}
              className="px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase"
              style={{
                background: isActive ? 'rgba(224,212,184,0.15)' : 'transparent',
                border: '1px solid rgba(224,212,184,0.08)',
                color: isActive ? '#e0d4b8' : '#8a7e68',
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      <ul className="flex-1 overflow-auto space-y-1">
        {results.map((book) => {
          const isFavourite = favourites.has(book.title);

          return (
            <li
              key={book.title}
              className="flex items-start gap-2 p-2 rounded transition-all hover:scale-[1.01]"
              style={{
                background: 'rgba(224,212,184,0.03)',
                border: '1px solid rgba(224,212,184,0.06)',
              }}
            >
              <BookOpen
                size={12}
                style={{ color: '#8a7e68', marginTop: 2, flexShrink: 0 }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-[11px] truncate" style={{ color: '#e0d4b8' }}>
                    {book.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFavourite(book.title)}
                    aria-pressed={isFavourite}
                    aria-label={`${isFavourite ? 'Unstar' : 'Star'} ${book.title}`}
                  >
                    <Star
                      size={8}
                      fill={isFavourite ? '#ffe66d' : 'none'}
                      style={{ color: isFavourite ? '#ffe66d' : '#555' }}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#8a7e68' }}>{book.author}</span>
                  <span style={{ color: '#555' }} aria-hidden>
                    •
                  </span>
                  <span style={{ color: '#555' }}>{book.year}</span>
                  <span
                    className="px-1 rounded text-[7px] uppercase tracking-wider"
                    style={{ background: 'rgba(224,212,184,0.08)', color: '#8a7e68' }}
                  >
                    {book.field}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p
        className="mt-2 pt-2 text-[9px] text-center"
        style={{ borderTop: '1px solid rgba(224,212,184,0.1)', color: '#555' }}
      >
        {results.length} volumes · BIBLIOTHECA UNIVERSALIS
      </p>
    </div>
  );
}

export default LibraryWindow;
