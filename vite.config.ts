import { loadEnv } from 'vite';
// Vitest's `defineConfig` is Vite's, widened to accept the `test` block below.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vite configuration.
 *
 * Two things worth knowing:
 *
 *  - `@/*` resolves to `src/*` everywhere (Vite, TypeScript and Vitest all
 *    share this alias), so no module ever imports through `../../..`.
 *  - `VITE_BASE_PATH` lets the same build be served from a sub-path, which is
 *    what a GitHub Pages project site needs.
 *
 * The plugin list is deliberately short. `.vite-source-tags.js` — the vendor
 * plugin that stamped every JSX element with a `data-source-loc` attribute —
 * is no longer loaded: its only consumer was the element picker removed in
 * `docs/decisions/0004-remove-vendor-telemetry.md`.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  /**
   * Cloud IDEs, containers and preview proxies serve the dev server under a
   * hostname Vite does not trust by default (its host check guards against DNS
   * rebinding). `VITE_ALLOWED_HOSTS` opts specific hostnames in without
   * weakening the default for everyone else.
   */
  const allowedHosts = (env.VITE_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);

  return {
    base: env.VITE_BASE_PATH || '/',
    server: {
      host: true,
      ...(allowedHosts.length > 0 ? { allowedHosts } : {}),
    },
    plugins: [react(), tailwindcss()],
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // Source maps make the deployed bundle explorable — this is a portfolio
      // piece, and the code is the point.
      sourcemap: true,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.test.{ts,tsx}'],
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/types/**', 'src/**/*.d.ts'],
      },
    },
  };
});
