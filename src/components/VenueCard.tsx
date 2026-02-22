import { Star, MapPin, Phone, Navigation, BadgeCheck, Clock } from "lucide-react";
import type { HalalVenue } from "@/lib/mockData";

export default function VenueCard({ venue }: { venue: HalalVenue }) {
  return (
    <div className="glass-card p-4">
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
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={`text-[13px] font-medium ${venue.isOpen ? "text-success" : "text-destructive"}`}>
            {venue.isOpen ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {venue.phone && (
            <a href={`tel:${venue.phone}`} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform">
              <Phone className="w-4 h-4 text-foreground" />
            </a>
          )}
          <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center active:scale-95 transition-transform">
            <Navigation className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
