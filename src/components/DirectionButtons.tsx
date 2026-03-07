import { Navigation, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { pressable } from "@/lib/motion";
import { openExternal } from "@/lib/openExternal";

interface DirectionButtonsProps {
  appleMapsUrl: string;
  googleMapsUrl: string;
}

export default function DirectionButtons({ appleMapsUrl, googleMapsUrl }: DirectionButtonsProps) {
  return (
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
  );
}
