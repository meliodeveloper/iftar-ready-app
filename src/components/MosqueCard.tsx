import { MapPin, Navigation, ChevronDown, Star as StarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mosque } from "@/lib/mockData";
import { pressable } from "@/lib/motion";
import { useSettings } from "@/lib/settingsStore";
import { toast } from "sonner";

interface MosqueCardProps {
  mosque: Mosque;
  expanded?: boolean;
  onToggle?: (mosque: Mosque) => void;
  compact?: boolean;
}

export default function MosqueCard({ mosque, expanded, onToggle, compact }: MosqueCardProps) {
  const selectedMosqueId = useSettings((s) => s.selectedMosqueId);
  const update = useSettings((s) => s.update);
  const isDefault = selectedMosqueId === mosque.id;

  const appleMapsUrl = `https://maps.apple.com/?daddr=${mosque.lat},${mosque.lng}&q=${encodeURIComponent(mosque.name)}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}&destination_place_id=${encodeURIComponent(mosque.name)}`;

  const setAsDefault = () => {
    update({ selectedMosqueId: mosque.id, selectedMosqueName: mosque.name });
    toast.success(`${mosque.name} set as your default mosque`);
  };

  return (
    <div className={`glass-card transition-all ${compact ? "p-3.5" : "p-4"} ${expanded ? "ring-1 ring-primary dark:gold-glow" : ""}`}>
      <button
        onClick={() => onToggle?.(mosque)}
        className="w-full text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-foreground ${compact ? "text-[15px]" : "text-base"}`}>
                {mosque.name}
              </h3>
              {isDefault && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                  <StarIcon className="w-3 h-3 fill-primary" /> Default
                </span>
              )}
            </div>
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
            <div className="pt-3 mt-3 border-t border-border space-y-3">
              {/* Set as default */}
              {!isDefault && (
                <motion.button
                  {...pressable}
                  onClick={setAsDefault}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-[14px] font-semibold text-primary active:scale-[0.98] transition-transform"
                >
                  <StarIcon className="w-4 h-4" />
                  Set as default mosque
                </motion.button>
              )}

              {/* Directions */}
              <div className="flex gap-3">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
