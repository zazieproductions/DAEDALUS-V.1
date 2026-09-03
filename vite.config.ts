import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages serves this repo from /DAEDALUS-V.1/.
 * Local dev and screenshot capture keep base at /.
 * Override with BASE_PATH if deploying to another subdirectory.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_']);
  const base = process.env.BASE_PATH || env.VITE_BASE_PATH || '/';

  return {
    plugins: [react(), tailwindcss()],
    base,
    envPrefix: ['VITE_'],
    build: {
      sourcemap: true,
      assetsDir: 'assets',
    },
    preview: {
      host: true,
      port: 4173,
    },
    server: {
      host: true,
    },
  };
});
