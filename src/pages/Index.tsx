import { MapPin, ChevronRight, Moon, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AvatarButton from "@/components/AvatarButton";
import { mockMosques, mockPrayerTimes, getCountdownTarget } from "@/lib/mockData";
import { pageTransitionProps, staggerContainer, staggerItem, pressable } from "@/lib/motion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

function useCountdown() {
  const [state, setState] = useState(() => {
    const t = getCountdownTarget();
    return { label: t.label, sublabel: t.sublabel, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    const tick = () => {
      const t = getCountdownTarget();
      const diff = Math.max(0, t.targetTime.getTime() - Date.now());
      setState({
        label: t.label,
        sublabel: t.sublabel,
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}

function Digit({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -6, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const nearest = mockMosques[0];
  const countdown = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-background">
      {/* Soft radial glow only — no geometric pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.04),transparent_70%)]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 pt-14 pb-2 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-[15px] font-display font-semibold text-foreground">Ramadan</span>
        </div>
        <AvatarButton />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 px-5 space-y-5 mt-2"
      >
        {/* ── Hero card ── */}
        <motion.div
          variants={staggerItem}
          {...pressable}
          onClick={() => navigate("/prayer-times")}
          className="rounded-2xl bg-card border border-border/60 p-5 cursor-pointer shadow-sm"
        >
          {/* Countdown label */}
          <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">
            {countdown.sublabel}
          </p>
          <p className="text-[13px] font-medium text-foreground/70 mb-3">
            {countdown.label}
          </p>

          {/* Large countdown */}
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-5xl font-bold text-primary tabular-nums tracking-tight">
              <Digit value={pad(countdown.hours)} />
            </span>
            <span className="text-2xl text-primary/50 font-light mx-0.5">:</span>
            <span className="text-5xl font-bold text-primary tabular-nums tracking-tight">
              <Digit value={pad(countdown.minutes)} />
            </span>
            <span className="text-2xl text-primary/50 font-light mx-0.5">:</span>
            <span className="text-5xl font-bold text-primary tabular-nums tracking-tight">
              <Digit value={pad(countdown.seconds)} />
            </span>
          </div>

          {/* Fajr / Maghrib chips */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/70 rounded-lg px-3 py-1.5">
              <span className="text-[11px] text-muted-foreground">Fajr</span>
              <span className="text-[14px] font-semibold text-foreground">{mockPrayerTimes.fajr}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/70 rounded-lg px-3 py-1.5">
              <span className="text-[11px] text-muted-foreground">Maghrib</span>
              <span className="text-[14px] font-semibold text-foreground">{mockPrayerTimes.maghrib}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground">
              Timetable <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>

        {/* ── Secondary rows (grouped list) ── */}
        <motion.div variants={staggerItem} className="rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden">
          {/* Location row */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-[13px] text-foreground">London, UK</span>
            <button className="text-[12px] text-primary font-medium ml-auto">Change</button>
          </div>

          {/* Nearest mosque row */}
          <motion.button
            {...pressable}
            onClick={() => navigate("/mosques")}
            className="w-full flex items-center gap-3 px-4 py-3 border-b border-border/40 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground truncate">{nearest.name}</p>
              <p className="text-[12px] text-muted-foreground">{nearest.distance} away</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </motion.button>

          {/* Halal food row */}
          <motion.button
            {...pressable}
            onClick={() => navigate("/halal-food")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground">Halal food nearby</p>
              <p className="text-[12px] text-muted-foreground">Explore restaurants</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
