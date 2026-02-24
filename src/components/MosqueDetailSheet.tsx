import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mosque } from "@/lib/mockData";
import StaticOsmMap from "@/components/StaticOsmMap";
import { pressable } from "@/lib/motion";

interface MosqueDetailSheetProps {
  mosque: Mosque | null;
  open: boolean;
  onClose: () => void;
}

export default function MosqueDetailSheet({ mosque, open, onClose }: MosqueDetailSheetProps) {
  if (!mosque) return null;

  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(mosque.name)}&ll=${mosque.lat},${mosque.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}&query_place_id=${encodeURIComponent(mosque.name)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 380 }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          {/* Full-screen map */}
          <div className="flex-1 relative bg-muted">
            <StaticOsmMap lat={mosque.lat} lng={mosque.lng} label={mosque.name} />

            {/* Top bar — collapse button */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
              <motion.button
                {...pressable}
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-lg border border-border flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              >
                <ChevronDown className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Floating card overlay */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 28, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 p-4 safe-area-bottom"
          >
            <div className="bg-background/90 backdrop-blur-xl border border-border rounded-3xl shadow-lg overflow-hidden">
              {/* Info */}
              <div className="px-5 pt-5 pb-3">
                <h2 className="text-[17px] font-semibold text-foreground">{mosque.name}</h2>
                <p className="text-[13px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                  <span>{mosque.address}</span>
                </p>
                <p className="text-[13px] text-primary font-medium mt-1">{mosque.distance} away</p>
              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-border" />

              {/* Action buttons */}
              <div className="px-5 py-4 flex gap-3">
                <motion.a
                  {...pressable}
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
                >
                  <Navigation className="w-4 h-4" />
                  Apple Maps
                </motion.a>
                <motion.a
                  {...pressable}
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-[15px] font-semibold text-foreground active:scale-[0.98] transition-transform"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  Google Maps
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
