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
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded-full shrink-0">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded-full shrink-0">
                Suggested
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{venue.cuisine} · {venue.priceLevel}</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{venue.address}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-primary text-sm">
            <Star className="w-3.5 h-3.5 fill-primary" />
            {venue.rating}
          </div>
          <span className="text-xs text-muted-foreground">{venue.distance}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className={`text-xs font-medium ${venue.isOpen ? "text-success" : "text-destructive"}`}>
            {venue.isOpen ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {venue.phone && (
            <a href={`tel:${venue.phone}`} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Phone className="w-4 h-4 text-foreground" />
            </a>
          )}
          <button className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <Navigation className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
