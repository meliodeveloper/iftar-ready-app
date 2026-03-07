import { useState } from "react";
import { Navigation, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { pressable } from "@/lib/motion";
import { openExternal, isEmbedded } from "@/lib/openExternal";

interface DirectionButtonsProps {
  appleMapsUrl: string;
  googleMapsUrl: string;
}

export default function DirectionButtons({ appleMapsUrl, googleMapsUrl }: DirectionButtonsProps) {
  const [showFallback, setShowFallback] = useState(false);
  const embedded = isEmbedded();

  const handleOpen = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ok = openExternal(url);
    if (!ok) setShowFallback(true);
  };

  return (
    <div className="space-y-2">
      {embedded && (
        <p className="text-[11px] text-muted-foreground text-center">
          Maps may not open in preview. Use the published app or links below.
        </p>
      )}

      <div className="flex gap-3">
        <motion.button
          {...pressable}
          onClick={(e) => handleOpen(appleMapsUrl, e)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[14px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
        >
          <Navigation className="w-4 h-4" />
          Apple Maps
        </motion.button>
        <motion.button
          {...pressable}
          onClick={(e) => handleOpen(googleMapsUrl, e)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[14px] font-semibold text-foreground active:scale-[0.98] transition-transform"
        >
          <MapPin className="w-4 h-4 text-primary" />
          Google Maps
        </motion.button>
      </div>

      {/* Fallback direct links — always visible in embedded, or shown if open failed */}
      {(embedded || showFallback) && (
        <div className="flex gap-3">
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open Apple Maps link
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open Google Maps link
          </a>
        </div>
      )}
    </div>
  );
}
