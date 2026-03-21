import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import StickyHeader from "@/components/StickyHeader";
import { mockRamadanCalendar, getRamadanDay } from "@/lib/mockData";
import { Star, Loader2, MapPin } from "lucide-react";
import { pageTransitionProps, staggerItem } from "@/lib/motion";

// Faster stagger than the shared preset (0.02s × 30 = 0.6s total)
const calendarStagger = {
  animate: { transition: { staggerChildren: 0.02 } },
};
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useRamadanCalendar } from "@/hooks/useRamadanCalendar";
import { useSettings } from "@/lib/settingsStore";

export default function RamadanCalendar() {
  const now = useCurrentTime(60_000);
  const todayDay = getRamadanDay(now);
  const todayRef = useRef<HTMLDivElement>(null);

  const { position, locationLabel } = useGeolocation();
  const selectedMosqueName = useSettings((s) => s.selectedMosqueName);
  const { data: liveCalendar, isLoading } = useRamadanCalendar(
    position?.lat ?? null,
    position?.lng ?? null
  );

  // If data was already in React Query cache on mount, skip the entrance animation
  const skipAnimation = useRef(liveCalendar !== undefined);

  const calendar = liveCalendar && liveCalendar.length > 0 ? liveCalendar : mockRamadanCalendar;

  // Auto-scroll to today
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [todayDay, isLoading]);

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern" style={{}}>
      <StickyHeader title="Calendar" />

      <div className="px-5 space-y-3">
        {/* Location info */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary" />
          <span>
            {selectedMosqueName
              ? `Based on ${selectedMosqueName}`
              : `Based on ${locationLabel}`}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={calendarStagger}
            initial={skipAnimation.current ? false : "initial"}
            animate="animate"
            className="glass-card overflow-hidden divide-y divide-border"
          >
            {calendar.map((day) => {
              const isToday = todayDay !== null && day.day === todayDay;
              const isPast = todayDay !== null && day.day < todayDay;
              return (
                <motion.div
                  key={day.day}
                  ref={isToday ? todayRef : undefined}
                  variants={staggerItem}
                  className={`px-4 py-3 flex items-center gap-3 ${
                    isToday ? "bg-primary/5 dark:bg-primary/8" : ""
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
