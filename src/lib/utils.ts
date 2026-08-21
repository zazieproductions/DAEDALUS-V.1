export function glitchText(text: string): string {
  const glitchChars = '▓░▒█▀▄╔╗╚╝║═╬╣╠╩╦';
  return text
    .split('')
    .map((c) => (Math.random() < 0.05 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c))
    .join('');
}

export function generateSynapseData() {
  const nodes: { x: number; y: number; r: number; label: string }[] = [];
  const labels = ['ART', 'MATH', 'MUSIC', 'CODE', 'PHIL', 'LIT', 'BIO', 'PHYS', 'LING', 'ARCH', 'CHEM', 'PSYCH'];
  labels.forEach((label, i) => {
    const angle = (i / labels.length) * Math.PI * 2;
    const radius = 80 + Math.random() * 40;
    nodes.push({
      x: 150 + Math.cos(angle) * radius,
      y: 130 + Math.sin(angle) * radius,
      r: 4 + Math.random() * 8,
      label,
    });
  });
  return nodes;
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
