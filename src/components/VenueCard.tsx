import { MapPin, Navigation, Phone, Star, BadgeCheck, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pressable } from "@/lib/motion";
import type { HalalVenue } from "@/lib/mockData";
import { openExternal } from "@/lib/openExternal";

interface VenueCardProps {
  venue: HalalVenue;
  expanded?: boolean;
  onToggle?: () => void;
}

export default function VenueCard({ venue, expanded, onToggle }: VenueCardProps) {
  const hasCoords = venue.lat != null && venue.lng != null;
  const appleMapsUrl = hasCoords
    ? `https://maps.apple.com/?daddr=${venue.lat},${venue.lng}&q=${encodeURIComponent(venue.name)}`
    : `https://maps.apple.com/?q=${encodeURIComponent(venue.name + " " + venue.address)}`;
  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.name + " " + venue.address)}`;

  return (
    <div className={`glass-card p-4 transition-all ${!venue.isOpen ? "opacity-70" : ""} ${expanded ? "ring-1 ring-primary dark:gold-glow" : ""}`}>
      <button
        onClick={onToggle}
        className="w-full text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{venue.name}</h3>
              {venue.verified ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-full shrink-0">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded-full shrink-0">
                  Suggested
                </span>
              )}
              {!venue.isOpen && (
                <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full shrink-0">
                  Closed
                </span>
              )}
            </div>
            <p className="text-[13px] text-muted-foreground mt-1">{venue.cuisine} · {venue.priceLevel}</p>
            <p className="text-[13px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{venue.address}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1 text-primary text-sm font-semibold">
              <Star className="w-3.5 h-3.5 fill-primary" />
              {venue.rating}
            </div>
            <span className="text-[13px] text-muted-foreground">{venue.distance}</span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className={`text-[13px] font-medium ${venue.isOpen ? "text-success" : "text-destructive"}`}>
              {venue.isOpen ? "Open now" : "Closed"}
            </span>
          </div>
          {venue.phone && (
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              <span>{venue.phone}</span>
            </div>
          )}
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
              {/* Opening hours */}
              {venue.openingHours && venue.openingHours.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Opening Hours</p>
                  <div className="bg-secondary rounded-xl p-3 space-y-1">
                    {venue.openingHours.map((line, i) => {
                      const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
                      const isToday = line.toLowerCase().startsWith(todayName.toLowerCase());
                      return (
                        <p
                          key={i}
                          className={`text-[12px] ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direction buttons */}
              <div className="flex gap-3">
                <motion.button
                  {...pressable}
                  onClick={(e) => { e.stopPropagation(); openExternal(appleMapsUrl); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
                >
                  <Navigation className="w-4 h-4" />
                  Apple Maps
                </motion.button>
                <motion.button
                  {...pressable}
                  onClick={(e) => { e.stopPropagation(); openExternal(googleMapsUrl); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[14px] font-semibold text-foreground active:scale-[0.98] transition-transform"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  Google Maps
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
