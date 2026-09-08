#!/usr/bin/env node
/**
 * Generate `docs/media/desktop-layout.svg` from the window manifest.
 *
 * The diagram in the documentation is not a hand-drawn approximation and not a
 * screenshot: it is rendered from the same `defaultGeometry` values the
 * running desktop uses, so it cannot drift out of date. Re-run it whenever the
 * manifest changes:
 *
 *     npm run docs:diagram
 *
 * The manifest is TypeScript, so rather than adding a build step this script
 * parses the literal it needs. That keeps the tool dependency-free at the cost
 * of being strict about the manifest's formatting — if the parse fails, it
 * says so loudly instead of emitting a wrong picture.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const MANIFEST = resolve(root, 'src/config/window-manifest.ts');
const OUTPUT = resolve(root, 'docs/media/desktop-layout.svg');

/** Nominal desktop the default geometry was designed against. */
const VIEWPORT = { width: 1440, height: 820 };
const TOP_BAR_HEIGHT = 52;

const ACCENTS = {
  signal: '#00ff88',
  cyan: '#4ecdc4',
  violet: '#a855f7',
  ember: '#ff6b6b',
  amber: '#ffe66d',
  parchment: '#e0d4b8',
  rose: '#f0a0c0',
  bone: '#e0e0e0',
};

function parseManifest(source) {
  const entryPattern =
    /id:\s*'(?<id>[^']+)',\s*\n\s*title:\s*'(?<title>[^']+)',[\s\S]*?accent:\s*accent\.(?<accent>\w+),\s*\n\s*defaultGeometry:\s*\{\s*x:\s*(?<x>-?\d+),\s*y:\s*(?<y>-?\d+),\s*width:\s*(?<width>\d+),\s*height:\s*(?<height>\d+)\s*\},\s*\n\s*startsMinimised:\s*(?<minimised>true|false)/g;

  const entries = [...source.matchAll(entryPattern)].map((match) => ({
    id: match.groups.id,
    title: match.groups.title,
    accent: ACCENTS[match.groups.accent] ?? '#ffffff',
    x: Number(match.groups.x),
    y: Number(match.groups.y),
    width: Number(match.groups.width),
    height: Number(match.groups.height),
    minimised: match.groups.minimised === 'true',
  }));

  if (entries.length === 0) {
    throw new Error(
      `Could not parse any window entries from ${MANIFEST}. ` +
        'Has the manifest formatting changed? Update tools/generate-layout-diagram.mjs.',
    );
  }

  return entries;
}

const escapeXml = (value) =>
  value.replace(
    /[<>&'"]/g,
    (char) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[char]};`,
  );

function renderWindow(entry) {
  const opacity = entry.minimised ? 0.28 : 1;
  const dash = entry.minimised ? ' stroke-dasharray="4 4"' : '';
  const label = escapeXml(entry.title);

  return `  <g opacity="${opacity}">
    <rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="${entry.height}" rx="8"
          fill="rgba(10,10,20,0.92)" stroke="${entry.accent}" stroke-opacity="0.55" stroke-width="1.5"${dash} />
    <rect x="${entry.x}" y="${entry.y}" width="${entry.width}" height="26" rx="8"
          fill="${entry.accent}" fill-opacity="0.10" />
    <circle cx="${entry.x + 14}" cy="${entry.y + 13}" r="3.5" fill="${entry.accent}" />
    <text x="${entry.x + 26}" y="${entry.y + 17}" font-family="JetBrains Mono, monospace"
          font-size="11" letter-spacing="1.4" fill="${entry.accent}">${label}</text>
    <text x="${entry.x + 14}" y="${entry.y + 46}" font-family="JetBrains Mono, monospace"
          font-size="10" fill="#5a5a78">${entry.width} × ${entry.height}${entry.minimised ? '  ·  docked' : ''}</text>
  </g>`;
}

const manifest = parseManifest(readFileSync(MANIFEST, 'utf8'));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWPORT.width} ${VIEWPORT.height}"
     width="${VIEWPORT.width}" height="${VIEWPORT.height}" role="img"
     aria-label="Default window layout of DAEDALUS // OS">
  <title>DAEDALUS // OS — default desktop layout</title>
  <desc>Generated from src/config/window-manifest.ts by tools/generate-layout-diagram.mjs. Do not edit by hand.</desc>

  <rect width="${VIEWPORT.width}" height="${VIEWPORT.height}" fill="#0a0a14" />
  <g stroke="#ffffff" stroke-opacity="0.03">
${Array.from({ length: Math.ceil(VIEWPORT.width / 40) }, (_, i) => `    <line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${VIEWPORT.height}" />`).join('\n')}
${Array.from({ length: Math.ceil(VIEWPORT.height / 40) }, (_, i) => `    <line x1="0" y1="${i * 40}" x2="${VIEWPORT.width}" y2="${i * 40}" />`).join('\n')}
  </g>

  <rect width="${VIEWPORT.width}" height="${TOP_BAR_HEIGHT}" fill="#1a1a2e" />
  <line x1="0" y1="${TOP_BAR_HEIGHT}" x2="${VIEWPORT.width}" y2="${TOP_BAR_HEIGHT}" stroke="#2a2a4a" />
  <text x="16" y="32" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold"
        letter-spacing="3" fill="#00ff88">DAEDALUS<tspan fill="#666">//OS</tspan></text>
  <text x="${VIEWPORT.width - 16}" y="32" text-anchor="end" font-family="JetBrains Mono, monospace"
        font-size="10" fill="#8888aa">GQ · PI · OR · CP</text>

${manifest.map(renderWindow).join('\n')}

  <text x="16" y="${VIEWPORT.height - 16}" font-family="JetBrains Mono, monospace" font-size="10" fill="#3a3a55">
    Default layout · solid = open on boot, dashed = docked · generated from src/config/window-manifest.ts
  </text>
</svg>
`;

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, svg);

const open = manifest.filter((entry) => !entry.minimised).length;
console.log(
  `Wrote ${OUTPUT} — ${manifest.length} windows (${open} open on boot, ${manifest.length - open} docked).`,
);
