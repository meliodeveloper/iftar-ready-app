import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mosque } from "@/lib/mockData";
import { pressable } from "@/lib/motion";

interface MosqueCardProps {
  mosque: Mosque;
  expanded?: boolean;
  onToggle?: (mosque: Mosque) => void;
  compact?: boolean;
}

export default function MosqueCard({ mosque, expanded, onToggle, compact }: MosqueCardProps) {
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(mosque.name)}&ll=${mosque.lat},${mosque.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}&query_place_id=${encodeURIComponent(mosque.name)}`;

  return (
    <div className={`glass-card transition-all ${compact ? "p-3.5" : "p-4"} ${expanded ? "ring-1 ring-primary dark:gold-glow" : ""}`}>
      <button
        onClick={() => onToggle?.(mosque)}
        className="w-full text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-foreground ${compact ? "text-[15px]" : "text-base"}`}>
              {mosque.name}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{mosque.address}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-primary text-sm font-semibold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              {mosque.distance}
            </span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border flex gap-3">
              <motion.a
                {...pressable}
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
              >
                <Navigation className="w-4 h-4" />
                Apple Maps
              </motion.a>
              <motion.a
                {...pressable}
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[14px] font-semibold text-foreground active:scale-[0.98] transition-transform"
              >
                <MapPin className="w-4 h-4 text-primary" />
                Google Maps
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
