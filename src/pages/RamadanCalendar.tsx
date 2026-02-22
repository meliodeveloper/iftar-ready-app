import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { mockRamadanCalendar } from "@/lib/mockData";
import { Star } from "lucide-react";

export default function RamadanCalendar() {
  const todayDay = 5;

  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Ramadan Calendar" subtitle="30 days of blessings" />

      <div className="px-5">
        <div className="glass-card overflow-hidden divide-y divide-border">
          {mockRamadanCalendar.map((day, i) => {
            const isToday = day.day === todayDay;
            const isPast = day.day < todayDay;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.4) }}
                className={`px-4 py-3 flex items-center gap-3 ${
                  isToday ? "bg-primary/5 dark:bg-primary/10" : ""
                } ${isPast ? "opacity-50" : ""}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  isToday ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}>
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">{day.date}</span>
                    {isToday && <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Today</span>}
                  </div>
                  {day.note && (
                    <p className="text-[12px] text-primary flex items-center gap-1 mt-0.5 font-medium">
                      <Star className="w-3 h-3 fill-primary" />
                      {day.note}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 text-right shrink-0">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Fajr</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">{day.fajr}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Maghrib</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">{day.maghrib}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
