import { describe, expect, it } from 'vitest';
import { clamp, getTimeGreeting, glitchText, randomHex } from './utils';

describe('getTimeGreeting', () => {
  it('maps hours onto diegetic cognitive phases', () => {
    expect(getTimeGreeting(3)).toMatch(/NOCTURNAL/);
    expect(getTimeGreeting(7)).toMatch(/DAWN/);
    expect(getTimeGreeting(10)).toMatch(/MERIDIAN/);
    expect(getTimeGreeting(14)).toMatch(/SOLAR/);
    expect(getTimeGreeting(19)).toMatch(/CREPUSCULAR/);
    expect(getTimeGreeting(22)).toMatch(/NOCTIS/);
  });
});

describe('glitchText', () => {
  it('preserves string length', () => {
    const s = 'THE MEDIUM IS THE MESSAGE';
    expect(glitchText(s).length).toBe(s.length);
  });
});

describe('randomHex', () => {
  it('returns a 7-character lowercase hex color', () => {
    expect(randomHex()).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('clamp', () => {
  it('constrains a number to a closed interval', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});
