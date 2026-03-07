import { useQuery } from "@tanstack/react-query";
import type { RamadanDay } from "@/lib/mockData";
import { useSettings, type CalcMethod } from "@/lib/settingsStore";

// Aladhan API calculation method mapping
const CALC_METHOD_MAP: Record<CalcMethod, number> = {
  MWL: 3,
  ISNA: 2,
  Egypt: 5,
  Makkah: 4,
  Karachi: 1,
};

// Ramadan 2026 ≈ Hijri 1447, month 9
const HIJRI_YEAR = 1447;
const HIJRI_MONTH = 9;

interface AladhanTiming {
  Fajr: string;
  Maghrib: string;
}

interface AladhanDay {
  timings: AladhanTiming;
  date: {
    gregorian: { date: string }; // DD-MM-YYYY
    hijri: { day: string; month: { number: number } };
  };
}

async function fetchRamadanCalendar(
  lat: number,
  lng: number,
  method: number
): Promise<RamadanDay[]> {
  const url = `https://api.aladhan.com/v1/hijriCalendar/${HIJRI_YEAR}/${HIJRI_MONTH}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  const json = await res.json();
  const data: AladhanDay[] = json.data || [];

  return data.map((d, i) => {
    const day = i + 1;
    // Parse "HH:MM (TZ)" → "HH:MM"
    const fajr = d.timings.Fajr.split(" ")[0];
    const maghrib = d.timings.Maghrib.split(" ")[0];
    // Convert DD-MM-YYYY → YYYY-MM-DD
    const [dd, mm, yyyy] = d.date.gregorian.date.split("-");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    return {
      day,
      date: dateStr,
      fajr,
      maghrib,
      note:
        day === 27
          ? "Laylat al-Qadr (likely)"
          : day === 1
          ? "First day of Ramadan"
          : day === 30
          ? "Last day of Ramadan"
          : undefined,
    };
  });
}

export function useRamadanCalendar(lat: number | null, lng: number | null) {
  const calcMethod = useSettings((s) => s.calcMethod);
  const method = CALC_METHOD_MAP[calcMethod] ?? 3;

  return useQuery<RamadanDay[]>({
    queryKey: ["ramadan-calendar", lat, lng, method],
    queryFn: () => fetchRamadanCalendar(lat!, lng!, method),
    enabled: lat !== null && lng !== null,
    staleTime: 24 * 60 * 60 * 1000, // cache 24h
    retry: 1,
  });
}
