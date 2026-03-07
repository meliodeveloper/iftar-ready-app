import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdownTarget } from "@/lib/mockData";
import { useCurrentTime } from "@/hooks/useCurrentTime";

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
  const now = useCurrentTime(1000);

  const target = useMemo(() => getCountdownTarget(now), [now]);

  const diff = Math.max(0, target.targetTime.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

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
          { value: pad(hours), label: "HR" },
          { value: pad(minutes), label: "MIN" },
          { value: pad(seconds), label: "SEC" },
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
