import { cortexLabels } from '../data/catalogs';

const GLITCH_CHARS = '▓░▒█▀▄╔╗╚╝║═╬╣╠╩╦';

/** Sparse character substitution — enough to read as signal decay, not enough to destroy the line. */
export function glitchText(text: string): string {
  return text
    .split('')
    .map((c) => (Math.random() < 0.05 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c))
    .join('');
}

export interface SynapseNode {
  x: number;
  y: number;
  r: number;
  label: string;
}

export function generateSynapseData(width = 400, height = 280): SynapseNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const baseRadius = Math.min(width, height) * 0.32;
  return cortexLabels.map((label, i) => {
    const angle = (i / cortexLabels.length) * Math.PI * 2;
    const radius = baseRadius + Math.random() * (baseRadius * 0.35);
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      r: 4 + Math.random() * 8,
      label,
    };
  });
}

export function getTimeGreeting(hour: number): string {
  if (hour < 5) return 'NOCTURNAL MODE // The liminal hours';
  if (hour < 8) return 'DAWN PROTOCOL // Aurora cognitionis';
  if (hour < 12) return 'MERIDIAN PHASE // Peak ideation window';
  if (hour < 17) return 'SOLAR ZENITH // Sustained creation';
  if (hour < 21) return 'CREPUSCULAR MODE // Golden hour synthesis';
  return 'NOCTIS PROTOCOL // Deep work activated';
}

export function randomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function shouldSkipBoot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const q = new URLSearchParams(window.location.search);
    return q.get('skipBoot') === '1' || q.get('boot') === 'skip';
  } catch {
    return false;
  }
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
