/// <reference types="vite/client" />

/**
 * Environment variables recognised by the application.
 * Keep in sync with `.env.example` and `src/config/env.ts`.
 */
interface ImportMetaEnv {
  /** `true` to bypass the boot animation during development. */
  readonly VITE_SKIP_BOOT?: string;
  /** Public base path, e.g. `/DAEDALUS-V.1/` for GitHub Pages. */
  readonly VITE_BASE_PATH?: string;
  /** Comma-separated dev-server hostnames to trust (cloud IDEs, proxies). */
  readonly VITE_ALLOWED_HOSTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
