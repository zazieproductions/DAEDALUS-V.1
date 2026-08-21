import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../lib/store';

const bootLines = [
  '[BIOS] POLYMATHIC OPERATING SYSTEM v7.3.1 — Codename: DAEDALUS',
  '[BIOS] Copyright (c) 2024 Ars Combinatoria Institute',
  '[INIT] Loading cognitive architecture...',
  '[INIT] Mounting epistemological frameworks...',
  '[KERN] Initializing neural substrate ████████████ OK',
  '[KERN] Synaptic bus width: 10^14 connections/sec',
  '[KERN] Creativity index calibrated: POLYMATHIC',
  '[MEM]  Allocating 847 TB semantic memory...',
  '[MEM]  Loading cultural database: 4,712 years of human knowledge',
  '[FS]   Mounting /dev/imagination ████████████ OK',
  '[FS]   Mounting /dev/intuition ████████████ OK',
  '[FS]   Mounting /dev/aesthetics ████████████ OK',
  '[NET]  Connecting to noosphere...',
  '[NET]  Akashic records: SYNCHRONIZED',
  '[GPU]  Rendering engine: QUALIA v4.2',
  '[AUD]  Synesthetic audio processor: ONLINE',
  '[SYS]  Loading obscure references module...',
  '[SYS]  Compiling 47,000 cross-disciplinary connections...',
  '[SYS]  Genius quotient threshold: EXCEEDED',
  '[SYS]  Imposter syndrome suppressor: ACTIVE',
  '[OK]   All systems nominal. Welcome, Polymath.',
  '',
  '  ╔══════════════════════════════════════════════╗',
  '  ║  "The only true wisdom is in knowing you     ║',
  '  ║   know nothing." — Σωκράτης                  ║',
  '  ╚══════════════════════════════════════════════╝',
  '',
  '[BOOT] Launching DAEDALUS Desktop Environment...',
];

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const setBoot = useOSStore((s) => s.setBoot);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setVisibleLines((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => setBoot(true), 600);
        }, 800);
      }
    }, 90);
    return () => clearInterval(interval);
  }, [setBoot]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#0a0a0a' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-3xl p-8 font-mono text-xs leading-relaxed" style={{ color: '#00ff88' }}>
            {visibleLines.map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {line}
                {idx === visibleLines.length - 1 && (
                  <span className="animate-pulse">█</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
