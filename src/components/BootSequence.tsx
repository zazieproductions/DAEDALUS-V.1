import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../lib/store';
import { bootLines, BOOT_LINE_MS } from '../data/boot';
import { colors, fonts } from '../config/theme';

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const setBoot = useOSStore((s) => s.setBoot);

  useEffect(() => {
    let i = 0;
    const interval = window.setInterval(() => {
      if (i < bootLines.length) {
        const line = bootLines[i];
        setVisibleLines((prev) => [...prev, line]);
        i += 1;
      } else {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setDone(true);
          window.setTimeout(() => setBoot(true), 600);
        }, 800);
      }
    }, BOOT_LINE_MS);
    return () => window.clearInterval(interval);
  }, [setBoot]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: colors.voidDeep }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-full max-w-3xl p-8 text-xs leading-relaxed"
            style={{ color: colors.phosphor, fontFamily: fonts.mono }}
          >
            {visibleLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {line}
                {idx === visibleLines.length - 1 && <span className="animate-pulse">█</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
