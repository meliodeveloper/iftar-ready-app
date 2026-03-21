import { useEffect, useRef } from "react";
import { useSettings } from "@/lib/settingsStore";
import { requestPermission, schedulePrayerNotifications } from "@/lib/notifications";
import type { PrayerTime } from "@/lib/mockData";

export function usePrayerNotifications(prayerTimes: PrayerTime | undefined, locationKey: string | null) {
  const notifEnabled = useSettings((s) => s.notifEnabled);
  const fajrNotification = useSettings((s) => s.fajrNotification);
  const suhoorNotification = useSettings((s) => s.suhoorNotification);
  const iftarReminderNotification = useSettings((s) => s.iftarReminderNotification);
  const permissionRequested = useRef(false);

  useEffect(() => {
    if (!prayerTimes || !notifEnabled) return;

    async function schedule() {
      if (!permissionRequested.current) {
        permissionRequested.current = true;
        const granted = await requestPermission();
        if (!granted) return;
      }
      await schedulePrayerNotifications(prayerTimes!, {
        fajrNotification,
        suhoorNotification,
        iftarReminderNotification,
      });
    }

    schedule();
  }, [prayerTimes, notifEnabled, fajrNotification, suhoorNotification, iftarReminderNotification, locationKey]);
}
