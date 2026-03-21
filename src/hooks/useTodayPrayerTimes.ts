import { useQuery } from "@tanstack/react-query";
import type { PrayerTime } from "@/lib/mockData";
import { useSettings, type CalcMethod } from "@/lib/settingsStore";

const CALC_METHOD_MAP: Record<CalcMethod, number> = {
  MWL: 3,
  ISNA: 2,
  Egypt: 5,
  Makkah: 4,
  Karachi: 1,
};

async function fetchTodayPrayerTimes(
  lat: number,
  lng: number,
  method: number
): Promise<PrayerTime> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  const json = await res.json();
  const t = json.data.timings;

  // Strip timezone suffix "HH:MM (TZ)" → "HH:MM"
  const strip = (s: string) => s.split(" ")[0];

  return {
    fajr: strip(t.Fajr),
    sunrise: strip(t.Sunrise),
    dhuhr: strip(t.Dhuhr),
    asr: strip(t.Asr),
    maghrib: strip(t.Maghrib),
    isha: strip(t.Isha),
  };
}

export function useTodayPrayerTimes(lat: number | null, lng: number | null) {
  const calcMethod = useSettings((s) => s.calcMethod);
  const method = CALC_METHOD_MAP[calcMethod] ?? 3;

  return useQuery<PrayerTime>({
    queryKey: ["today-prayer-times", lat, lng, method],
    queryFn: () => fetchTodayPrayerTimes(lat!, lng!, method),
    enabled: lat !== null && lng !== null,
    staleTime: 60 * 60 * 1000, // 1h — times are date-specific
    retry: 1,
  });
}
