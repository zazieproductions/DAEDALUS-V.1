import { useState } from 'react';

import { QUOTES } from '@/data/quotes';
import { useInterval } from '@/hooks/useInterval';
import { pickRandom } from '@/lib/random';

/** How long a quote stays on the wall. */
const QUOTE_ROTATION_MS = 30_000;

/**
 * The desktop watermark: one quote from the corpus at 8% opacity, rotating
 * every thirty seconds.
 *
 * It is meant to be *almost* unreadable — ambient text you notice on the third
 * glance. The initial quote is chosen in a lazy state initialiser rather than
 * an effect, so the first paint is already correct.
 */
export function QuoteWatermark() {
  const [quote, setQuote] = useState(() => pickRandom(QUOTES));

  useInterval(() => setQuote(pickRandom(QUOTES)), QUOTE_ROTATION_MS);

  return (
    <div className="absolute bottom-16 left-6 right-6 pointer-events-none">
      <p
        className="font-mono text-[10px] italic leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.08)' }}
      >
        {quote}
      </p>
    </div>
  );
}

export default QuoteWatermark;
