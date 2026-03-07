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
    // Tick on the requested cadence
    sync();
    intervalRef.current = setInterval(sync, intervalMs);

    // Re-sync when the user returns to the tab / app
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", sync);

    return () => {
      clearInterval(intervalRef.current);
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
