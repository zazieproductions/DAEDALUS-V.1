import { useCallback, useState } from 'react';
import { Check, Copy, Lightbulb, Shuffle, Sparkles } from 'lucide-react';

import {
  CROSS_POLLINATION_DOMAINS,
  CROSS_POLLINATION_PAIR_COUNT,
  IDEATION_PROMPTS,
} from '@/data/prompts';
import { shuffle } from '@/lib/random';

/** How long the synthesis animation runs before results appear. */
const SYNTHESIS_DELAY_MS = 800;

/** How long the copy button stays confirmed. */
const COPY_FEEDBACK_MS = 2000;

/**
 * Draw N disjoint pairs from the domain pool.
 *
 * One unbiased shuffle, then consecutive slices — which guarantees no domain
 * appears twice in a round, something repeated random draws would not.
 */
function drawPairs(count = CROSS_POLLINATION_PAIR_COUNT): string[] {
  const deck = shuffle(CROSS_POLLINATION_DOMAINS);

  return Array.from({ length: count }, (_, index) => {
    const [a, b] = deck.slice(index * 2, index * 2 + 2);
    return `${a} × ${b}`;
  });
}

/**
 * SYNTH // IDEATION ENGINE.
 *
 * Two halves with different philosophies: a hand-written prompt deck (curated,
 * cyclable, copyable) and a combinatorial engine that forces collisions
 * between distant disciplines. The artificial 800ms "synthesising" delay is
 * deliberate — instant results read as a lookup, a beat of latency reads as
 * thought. See `docs/creative-methodology.md`.
 */
export function SynthWindow() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [synthesising, setSynthesising] = useState(false);
  const [pairs, setPairs] = useState<string[]>(() => drawPairs());

  const regenerate = useCallback(() => {
    setSynthesising(true);
    setTimeout(() => {
      setPairs(drawPairs());
      setSynthesising(false);
    }, SYNTHESIS_DELAY_MS);
  }, []);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(IDEATION_PROMPTS[promptIndex]);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard access is denied in insecure contexts and some embeds.
      // Failing silently would look broken, so say something useful.
      console.warn('[daedalus/synth] Clipboard unavailable — prompt not copied.');
    }
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: '#a855f7', background: 'rgba(0,0,0,0.3)' }}
    >
      <section
        className="p-3 rounded mb-3"
        style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}
      >
        <h3 className="flex items-center gap-2 mb-2">
          <Lightbulb size={10} style={{ color: '#a855f7' }} aria-hidden />
          <span className="text-[9px] tracking-wider" style={{ color: '#7c3aed' }}>
            IDEATION PROMPT #{promptIndex + 1}
          </span>
        </h3>
        <p className="text-[11px] leading-relaxed" style={{ color: '#d8b4fe' }}>
          {IDEATION_PROMPTS[promptIndex]}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => setPromptIndex((index) => (index + 1) % IDEATION_PROMPTS.length)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider transition-all"
            style={{
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
              color: '#a855f7',
            }}
          >
            <Shuffle size={8} aria-hidden /> NEXT
          </button>
          <button
            type="button"
            onClick={copyPrompt}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider transition-all"
            style={{
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: '#7c3aed',
            }}
          >
            {copied ? <Check size={8} aria-hidden /> : <Copy size={8} aria-hidden />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </section>

      <section className="flex-1">
        <h3 className="flex items-center gap-2 mb-2">
          <Sparkles size={10} style={{ color: '#a855f7' }} aria-hidden />
          <span className="text-[9px] tracking-wider" style={{ color: '#7c3aed' }}>
            CROSS-POLLINATION ENGINE
          </span>
        </h3>

        <ul className="space-y-1.5" aria-busy={synthesising}>
          {pairs.map((pair) => (
            <li
              key={pair}
              className="p-2 rounded text-[10px] transition-all"
              style={{
                background: 'rgba(168,85,247,0.03)',
                border: '1px solid rgba(168,85,247,0.1)',
                color: '#c084fc',
                opacity: synthesising ? 0.3 : 1,
              }}
            >
              ⟨ {pair} ⟩
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={regenerate}
          disabled={synthesising}
          className="mt-2 w-full py-1.5 rounded text-[9px] tracking-wider transition-all"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: '#a855f7',
          }}
        >
          {synthesising ? '◌ SYNTHESIZING...' : '↻ REGENERATE CONNECTIONS'}
        </button>
      </section>
    </div>
  );
}

export default SynthWindow;
