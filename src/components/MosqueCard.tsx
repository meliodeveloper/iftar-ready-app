import { MapPin, Navigation } from "lucide-react";
import type { Mosque } from "@/lib/mockData";

interface MosqueCardProps {
  mosque: Mosque;
  selected?: boolean;
  onSelect?: (mosque: Mosque) => void;
  compact?: boolean;
}

export default function MosqueCard({ mosque, selected, onSelect, compact }: MosqueCardProps) {
  return (
    <button
      onClick={() => onSelect?.(mosque)}
      className={`w-full text-left glass-card p-4 transition-all ${
        selected ? "ring-1 ring-primary gold-glow" : "hover:border-primary/30"
      } ${compact ? "p-3" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-foreground ${compact ? "text-sm" : ""}`}>
            {mosque.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{mosque.address}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-primary text-sm font-medium shrink-0">
          <Navigation className="w-3.5 h-3.5" />
          {mosque.distance}
        </div>
      </div>
    </button>
  );
}
