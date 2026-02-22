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
      className={`w-full text-left glass-card transition-all active:scale-[0.98] ${
        compact ? "p-3.5" : "p-4"
      } ${selected ? "ring-1 ring-primary dark:gold-glow" : ""}`}
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
        <div className="flex items-center gap-1 text-primary text-sm font-semibold shrink-0">
          <Navigation className="w-3.5 h-3.5" />
          {mosque.distance}
        </div>
      </div>
    </button>
  );
}
