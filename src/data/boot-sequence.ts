/**
 * The BIOS fiction.
 *
 * DAEDALUS boots like a machine from an alternate 1996 that mounts
 * `/dev/imagination` instead of `/dev/sda1`. The joke only works if the format
 * is rigorously correct, so every line keeps the `[TAG] message` shape with a
 * five-character tag field.
 */

/** Milliseconds between printed lines. 29 lines ≈ 2.6s of boot. */
export const BOOT_LINE_INTERVAL_MS = 90;

/** Pause after the last line, before the fade begins. */
export const BOOT_HOLD_MS = 800;

/** Duration of the fade from BIOS to desktop. */
export const BOOT_FADE_MS = 600;

/** Advertised OS version. Kept in step with `package.json`'s major line. */
export const OS_VERSION = '7.3.1';

const BIOS_COPYRIGHT_YEAR = new Date().getFullYear();

export const BOOT_SEQUENCE: readonly string[] = [
  `[BIOS] POLYMATHIC OPERATING SYSTEM v${OS_VERSION} — Codename: DAEDALUS`,
  `[BIOS] Copyright (c) ${BIOS_COPYRIGHT_YEAR} Ars Combinatoria Institute`,
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
