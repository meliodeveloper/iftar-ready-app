import { useMemo } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { mockPrayerTimes } from "@/lib/mockData";
import { MapPin, Info, Loader2 } from "lucide-react";
import { pageTransitionProps, staggerContainer, staggerItem } from "@/lib/motion";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTodayPrayerTimes } from "@/hooks/useTodayPrayerTimes";

const prayers = [
  { name: "Fajr", key: "fajr" as const, isFasting: true },
  { name: "Sunrise", key: "sunrise" as const },
  { name: "Dhuhr", key: "dhuhr" as const },
  { name: "Asr", key: "asr" as const },
  { name: "Maghrib", key: "maghrib" as const, isFasting: true },
  { name: "Isha", key: "isha" as const },
];

/** Parse "HH:MM" into minutes since midnight */
function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function PrayerTimes() {
  const now = useCurrentTime(60_000);

  const { position, locationLabel } = useGeolocation();
  const { data: liveTimes, isLoading } = useTodayPrayerTimes(
    position?.lat ?? null,
    position?.lng ?? null
  );

  const prayerTimes = liveTimes ?? mockPrayerTimes;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const activePrayerKey = useMemo(() => {
    for (let i = prayers.length - 1; i >= 0; i--) {
      if (currentMinutes >= toMinutes(prayerTimes[prayers[i].key])) {
        return prayers[i].key;
      }
    }
    return null;
  }, [currentMinutes, prayerTimes]);

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Prayer Times" subtitle={dateLabel} backTo="/" />

      <div className="px-5 space-y-4">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary" />
          {locationLabel}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="glass-card overflow-hidden divide-y divide-border"
          >
            {prayers.map((prayer) => {
              const isActive = prayer.key === activePrayerKey;
              return (
                <motion.div
                  key={prayer.key}
                  variants={staggerItem}
                  className={`px-4 py-3.5 flex items-center justify-between ${
                    prayer.isFasting ? "bg-primary/5 dark:bg-primary/8" : ""
                  } ${isActive ? "ring-1 ring-inset ring-primary/30" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-primary animate-pulse" : prayer.isFasting ? "bg-primary" : "bg-muted-foreground/25"
                    }`} />
                    <div>
                      <p className="font-semibold text-foreground text-[15px]">{prayer.name}</p>
                      {prayer.isFasting && (
                        <p className="text-[11px] text-primary font-medium">
                          {prayer.key === "fajr" ? "Fast begins" : "Fast ends (Iftar)"}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    {prayerTimes[prayer.key]}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-secondary text-[13px] text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          <p>Times shown are based on your selected mosque. Actual times may vary slightly depending on calculation method.</p>
        </div>
      </div>
    </motion.div>
  );
}
