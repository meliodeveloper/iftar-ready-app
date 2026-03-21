import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Returns a live `Date` that updates every `intervalMs` (default 1000ms).
 * Re-syncs immediately when the tab/app regains focus or visibility.
 */
export function useCurrentTime(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const sync = useCallback(() => setNow(new Date()), []);

  useEffect(() => {
    const start = () => {
      sync();
      intervalRef.current = setInterval(sync, intervalMs);
    };

    const stop = () => {
      clearInterval(intervalRef.current);
    };

    // Pause interval when hidden, resume and re-sync when visible again
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    // Start immediately unless the tab is already hidden
    if (!document.hidden) {
      start();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", sync);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", sync);
    };
  }, [intervalMs, sync]);

  return now;
}

/**
 * Returns just the current local date string (YYYY-MM-DD) that updates once per minute.
 * Useful for components that only care about the day rolling over.
 */
export function useCurrentDate(): string {
  const now = useCurrentTime(60_000);
  return now.toISOString().split("T")[0];
}

/**
 * Returns the IANA timezone string for the user's device.
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Europe/London";
  }
}
