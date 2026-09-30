import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { env } from '@/config/env';
import {
  BOOT_FADE_MS,
  BOOT_HOLD_MS,
  BOOT_LINE_INTERVAL_MS,
  BOOT_SEQUENCE,
} from '@/data/boot-sequence';
import { accent } from '@/config/theme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useOSStore } from '@/store/osStore';

/**
 * The BIOS.
 *
 * A ~2.6 second typewriter print of {@link BOOT_SEQUENCE}, then a fade to the
 * desktop. It is the first and most load-bearing piece of the fiction, so it
 * gets three escape hatches:
 *
 *   - `VITE_SKIP_BOOT=true` skips it entirely (developer loop);
 *   - `prefers-reduced-motion` skips it (accessibility);
 *   - any click or key press skips it (patience).
 *
 * The timer is a single self-rescheduling interval rather than one timeout per
 * line: 29 timers that must all be cancelled on unmount is 29 chances to leak.
 */
export function BootSequence() {
  const completeBoot = useOSStore((store) => store.completeBoot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [printedLines, setPrintedLines] = useState<string[]>([]);
  const [fading, setFading] = useState(false);

  const shouldSkip = env.skipBootSequence || prefersReducedMotion;

  useEffect(() => {
    if (shouldSkip) {
      completeBoot();
      return;
    }

    let index = 0;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      if (index < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[index];
        index += 1;
        setPrintedLines((lines) => [...lines, line]);
        return;
      }

      clearInterval(interval);
      fadeTimer = setTimeout(() => {
        setFading(true);
        doneTimer = setTimeout(completeBoot, BOOT_FADE_MS);
      }, BOOT_HOLD_MS);
    }, BOOT_LINE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [completeBoot, shouldSkip]);

  // Let impatient operators through.
  useEffect(() => {
    if (shouldSkip) return;

    const skip = () => completeBoot();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [completeBoot, shouldSkip]);

  if (shouldSkip) return null;

  return (
    <AnimatePresence>
      {!fading && (
        <motion.div
          role="status"
          aria-label="System boot sequence. Press any key to skip."
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#0a0a0a' }}
          exit={{ opacity: 0 }}
          transition={{ duration: BOOT_FADE_MS / 1000 }}
        >
          <div
            className="w-full max-w-3xl p-8 font-mono text-xs leading-relaxed"
            style={{ color: accent.signal }}
          >
            {printedLines.map((line, index) => (
              <div key={`${index}-${line}`} className="whitespace-pre">
                {line}
                {index === printedLines.length - 1 && <span className="animate-pulse">█</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BootSequence;
