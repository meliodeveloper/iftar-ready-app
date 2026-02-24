import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdownTarget } from "@/lib/mockData";

function AnimatedDigit({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-2xl font-bold text-primary tabular-nums inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [target, setTarget] = useState(getCountdownTarget());

  useEffect(() => {
    const tick = () => {
      const t = getCountdownTarget();
      setTarget(t);
      const diff = t.targetTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
        {target.sublabel}
      </p>
      <h2 className="text-[15px] font-semibold text-foreground">
        Countdown to {target.label}
      </h2>
      <div className="flex items-center gap-3 mt-1">
        {[
          { value: pad(timeLeft.hours), label: "HR" },
          { value: pad(timeLeft.minutes), label: "MIN" },
          { value: pad(timeLeft.seconds), label: "SEC" },
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-[60px] h-[60px] rounded-2xl bg-secondary flex items-center justify-center">
              <AnimatedDigit value={unit.value} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wide">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
