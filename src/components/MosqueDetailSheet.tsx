import { MapPin, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mosque } from "@/lib/mockData";
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
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mosque.lng - 0.005},${mosque.lat - 0.003},${mosque.lng + 0.005},${mosque.lat + 0.003}&layer=mapnik&marker=${mosque.lat},${mosque.lng}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl overflow-hidden safe-area-bottom"
          >
            {/* Handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-muted-foreground/25" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-[17px] font-semibold text-foreground">{mosque.name}</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{mosque.address}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 ml-3 active:scale-95 transition-transform"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Map */}
            <div className="mx-5 rounded-2xl overflow-hidden border border-border h-48">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title={`Map of ${mosque.name}`}
                loading="lazy"
              />
            </div>

            {/* Action buttons */}
            <div className="px-5 py-4 flex gap-3">
              <motion.a
                {...pressable}
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-[15px] font-medium text-foreground active:scale-[0.98] transition-transform"
              >
                <Navigation className="w-4 h-4 text-primary" />
                Apple Maps
              </motion.a>
              <motion.a
                {...pressable}
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-[15px] font-medium text-foreground active:scale-[0.98] transition-transform"
              >
                <MapPin className="w-4 h-4 text-primary" />
                Google Maps
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
