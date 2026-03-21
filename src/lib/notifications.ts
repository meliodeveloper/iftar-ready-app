import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { PrayerTime } from "@/lib/mockData";

const NOTIF_IDS = [1, 2, 3, 4];

export async function requestPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === "granted";
  } catch {
    return false;
  }
}

function todayAt(timeStr: string, offsetMinutes = 0): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m + offsetMinutes, 0, 0);
  return d;
}

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTime,
  opts: { fajrNotification: boolean; suhoorNotification: boolean; iftarReminderNotification: boolean }
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await cancelAllPrayerNotifications();

    const notifications: Parameters<typeof LocalNotifications.schedule>[0]["notifications"] = [];

    if (opts.suhoorNotification) {
      const at = todayAt(prayerTimes.fajr, -30);
      if (at > new Date()) {
        notifications.push({
          id: 1,
          title: "Suhoor ends soon",
          body: `Fajr in 30 minutes — finish your suhoor before ${prayerTimes.fajr}`,
          schedule: { at },
        });
      }
    }

    if (opts.fajrNotification) {
      const at = todayAt(prayerTimes.fajr);
      if (at > new Date()) {
        notifications.push({
          id: 2,
          title: "Fajr prayer time",
          body: `It is now Fajr — ${prayerTimes.fajr}. Fast begins.`,
          schedule: { at },
        });
      }
    }

    if (opts.iftarReminderNotification) {
      const at = todayAt(prayerTimes.maghrib, -15);
      if (at > new Date()) {
        notifications.push({
          id: 3,
          title: "Iftar in 15 minutes",
          body: `Maghrib is at ${prayerTimes.maghrib} — prepare to break your fast`,
          schedule: { at },
        });
      }
    }

    // Maghrib (iftar) notification — always scheduled when notifEnabled
    const maghribAt = todayAt(prayerTimes.maghrib);
    if (maghribAt > new Date()) {
      notifications.push({
        id: 4,
        title: "Iftar time! Fast ends now",
        body: `Maghrib — ${prayerTimes.maghrib}. You may break your fast.`,
        schedule: { at: maghribAt },
      });
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (err) {
    console.warn("schedulePrayerNotifications error:", err);
  }
}

export async function cancelAllPrayerNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({ notifications: NOTIF_IDS.map((id) => ({ id })) });
  } catch {
    // ignore — may fail if none pending
  }
}
