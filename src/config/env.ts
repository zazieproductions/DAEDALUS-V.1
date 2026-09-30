/**
 * Typed, validated access to build-time environment variables.
 *
 * DAEDALUS is a fully client-side application: there is no server, no API key
 * and no secret. The handful of variables below exist purely to make the
 * developer loop pleasant and the deployment portable. Everything is read
 * once, here, so no component ever touches `import.meta.env` directly.
 *
 * Copy `.env.example` to `.env.local` to override any of them.
 */

/**
 * Parse a `true`/`false`-ish string. Anything unrecognised falls back to
 * `fallback` and warns loudly rather than failing silently — a mistyped flag
 * that quietly does nothing is worse than a noisy one.
 */
function readBoolean(raw: string | undefined, fallback: boolean, name: string): boolean {
  if (raw === undefined || raw === '') return fallback;

  const normalised = raw.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalised)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalised)) return false;

  console.warn(
    `[daedalus/env] ${name}="${raw}" is not a boolean; falling back to ${String(fallback)}.`,
  );
  return fallback;
}

export interface AppEnvironment {
  /**
   * Skip the ~3 second BIOS boot animation and drop straight onto the
   * desktop. Invaluable when iterating on a window; never enabled in
   * production builds.
   */
  skipBootSequence: boolean;
  /**
   * Public base path the app is served from. Set to `/<repo-name>/` when
   * deploying to a GitHub Pages project site. Consumed by `vite.config.ts`
   * at build time and re-exported here for completeness.
   */
  basePath: string;
  /** True when running under `vite dev`. */
  isDevelopment: boolean;
}

export const env: AppEnvironment = {
  skipBootSequence: readBoolean(import.meta.env.VITE_SKIP_BOOT, false, 'VITE_SKIP_BOOT'),
  basePath: import.meta.env.BASE_URL ?? '/',
  isDevelopment: import.meta.env.DEV,
};
