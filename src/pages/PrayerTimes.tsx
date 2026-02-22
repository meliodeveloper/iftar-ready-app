import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { mockPrayerTimes, mockMosques } from "@/lib/mockData";
import { MapPin, Info } from "lucide-react";

const prayers = [
  { name: "Fajr", key: "fajr" as const, isFasting: true },
  { name: "Sunrise", key: "sunrise" as const },
  { name: "Dhuhr", key: "dhuhr" as const },
  { name: "Asr", key: "asr" as const },
  { name: "Maghrib", key: "maghrib" as const, isFasting: true },
  { name: "Isha", key: "isha" as const },
];

export default function PrayerTimes() {
  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Prayer Times" subtitle="Today's schedule" />
      
      <div className="px-5 space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary" />
          Based on {mockMosques[0].name}
        </div>

        <div className="space-y-2">
          {prayers.map((prayer, i) => (
            <motion.div
              key={prayer.key}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-4 flex items-center justify-between ${
                prayer.isFasting ? "ring-1 ring-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${prayer.isFasting ? "bg-primary animate-pulse-gold" : "bg-muted-foreground/30"}`} />
                <div>
                  <p className="font-semibold text-foreground">{prayer.name}</p>
                  {prayer.isFasting && (
                    <p className="text-[10px] text-primary">
                      {prayer.key === "fajr" ? "Fast begins" : "Fast ends (Iftar)"}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {mockPrayerTimes[prayer.key]}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Times shown are based on your selected mosque. Actual times may vary slightly depending on calculation method.</p>
        </div>
      </div>
    </div>
  );
}
