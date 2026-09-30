import { useEffect, useRef } from 'react';

/**
 * Declarative `setInterval`.
 *
 * The callback is kept in a ref, so a fresh closure every render does **not**
 * restart the timer — the classic bug where a 1s clock resets itself on every
 * tick and drifts. Pass `null` as the delay to pause.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
