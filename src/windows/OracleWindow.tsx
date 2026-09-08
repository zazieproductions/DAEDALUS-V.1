import { useState } from 'react';
import { Compass, RefreshCw } from 'lucide-react';

import {
  ORACLE_CAST_DURATION_MS,
  ORACLE_DECKS,
  type OracleCard,
  type OracleDeckId,
} from '@/data/oracle';
import { pickRandom } from '@/lib/random';

/**
 * ORACLE // DIVINATION.
 *
 * A randomiser with good taste. The claim it makes — see
 * `docs/creative-methodology.md` — is that a constrained, charged prompt
 * breaks a creative deadlock better than an open question does, and that the
 * *ritual* (choose a deck, wait 1.2s, receive one card) is doing as much work
 * as the text.
 */
export function OracleWindow() {
  const [deckId, setDeckId] = useState<OracleDeckId>('iching');
  const [card, setCard] = useState<OracleCard | null>(null);
  const [casting, setCasting] = useState(false);

  const deck = ORACLE_DECKS[deckId];

  const selectDeck = (id: OracleDeckId) => {
    setDeckId(id);
    setCard(null);
  };

  const cast = () => {
    setCasting(true);
    setTimeout(() => {
      setCard(pickRandom(deck.cards));
      setCasting(false);
    }, ORACLE_CAST_DURATION_MS);
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#ffe66d', background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-3" role="group" aria-label="Divination system">
        {Object.values(ORACLE_DECKS).map((option) => {
          const isActive = option.id === deckId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => selectDeck(option.id)}
              aria-pressed={isActive}
              className="px-2 py-1 rounded text-[9px] tracking-wider"
              style={{
                background: isActive ? 'rgba(255,230,109,0.15)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(255,230,109,0.3)' : 'rgba(255,230,109,0.1)'}`,
                color: '#ffe66d',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center" aria-live="polite">
        {card ? (
          <div className="text-center space-y-3 p-4">
            <Compass size={24} style={{ color: '#ffe66d', margin: '0 auto' }} aria-hidden />
            <div className="text-lg font-bold" style={{ color: '#ffe66d' }}>
              {card.name}
            </div>
            <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: '#d4c85a' }}>
              {card.meaning}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <Compass
              size={32}
              style={{ color: '#ffe66d40' }}
              className={casting ? 'animate-spin' : undefined}
              aria-hidden
            />
            <p className="text-[10px]" style={{ color: '#8a7e3a' }}>
              Consult the oracle for creative guidance
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={cast}
        disabled={casting}
        className="w-full py-2 rounded text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
        style={{
          background: 'rgba(255,230,109,0.1)',
          border: '1px solid rgba(255,230,109,0.3)',
          color: '#ffe66d',
          opacity: casting ? 0.5 : 1,
        }}
      >
        <RefreshCw size={10} className={casting ? 'animate-spin' : undefined} aria-hidden />
        {casting ? 'CASTING...' : deck.action}
      </button>
    </div>
  );
}

export default OracleWindow;
