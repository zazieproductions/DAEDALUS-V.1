import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Track the user's motion preference.
 *
 * DAEDALUS is an animated interface by design — boot text types itself, the
 * synapse field breathes, the graph never quite settles. When the operating
 * system asks for reduced motion we honour it: animations render a single
 * static frame instead of looping, and the boot sequence completes instantly.
 *
 * Falls back to `false` where `matchMedia` is unavailable (older jsdom, SSR).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(QUERY);
    if (!mediaQuery) return;

    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
