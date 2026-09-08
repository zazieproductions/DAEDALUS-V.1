#!/usr/bin/env node
/**
 * Remove build artefacts and tool caches.
 *
 * Written in Node rather than `rm -rf` so `npm run clean` behaves identically
 * on Windows, macOS and Linux.
 */

import { rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = ['dist', 'coverage', 'node_modules/.tmp', 'node_modules/.vite'];

for (const target of TARGETS) {
  rmSync(resolve(root, target), { recursive: true, force: true });
  console.log(`removed ${target}`);
}
