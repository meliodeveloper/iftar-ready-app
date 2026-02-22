import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCountdownTarget } from "@/lib/mockData";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-sm text-muted-foreground">{target.sublabel}</p>
      <h2 className="text-lg font-semibold text-gradient-gold font-display">
        Countdown to {target.label}
      </h2>
      <div className="flex items-center gap-3">
        {[
          { value: pad(timeLeft.hours), label: "Hours" },
          { value: pad(timeLeft.minutes), label: "Min" },
          { value: pad(timeLeft.seconds), label: "Sec" },
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="countdown-ring w-[72px] h-[72px] flex items-center justify-center bg-secondary/50">
              <span className="text-2xl font-bold text-primary tabular-nums">
                {unit.value}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
