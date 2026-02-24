import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdownTarget } from "@/lib/mockData";

function AnimatedDigit({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -6, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="inline-block"
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
    <div className="flex flex-col items-center">
      <p className="text-xs text-muted-foreground tracking-wide uppercase">
        {target.label}
      </p>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-[40px] font-bold text-primary tabular-nums leading-none tracking-tight">
          <AnimatedDigit value={pad(timeLeft.hours)} />
        </span>
        <span className="text-xl text-muted-foreground font-light mx-0.5">:</span>
        <span className="text-[40px] font-bold text-primary tabular-nums leading-none tracking-tight">
          <AnimatedDigit value={pad(timeLeft.minutes)} />
        </span>
        <span className="text-xl text-muted-foreground font-light mx-0.5">:</span>
        <span className="text-[40px] font-bold text-primary tabular-nums leading-none tracking-tight">
          <AnimatedDigit value={pad(timeLeft.seconds)} />
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">{target.sublabel}</p>
    </div>
  );
}
