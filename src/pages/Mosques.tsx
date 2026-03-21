import { useState } from "react";
import { motion } from "framer-motion";
import StickyHeader from "@/components/StickyHeader";
import MosqueCard from "@/components/MosqueCard";
import { mockMosques, type Mosque } from "@/lib/mockData";
import { Search, Loader2, WifiOff, Star } from "lucide-react";
import { pageTransitionProps, staggerContainer, staggerItem } from "@/lib/motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyMosques } from "@/hooks/useNearbyPlaces";
import { useSettings } from "@/lib/settingsStore";

export default function Mosques() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selectedMosqueId = useSettings((s) => s.selectedMosqueId);
  const selectedMosqueName = useSettings((s) => s.selectedMosqueName);

  const { position } = useGeolocation();
  const { data: liveMosques, isLoading, isError } = useNearbyMosques(
    position?.lat ?? null,
    position?.lng ?? null
  );

  const mosques = liveMosques && liveMosques.length > 0 ? liveMosques : mockMosques;

  // Find the default mosque in the current list
  const defaultMosque = selectedMosqueId
    ? mosques.find((m) => m.id === selectedMosqueId)
    : null;

  // Filter out the default mosque from the main list to avoid duplication
  const otherMosques = mosques.filter((m) => m.id !== selectedMosqueId);

  const filtered = otherMosques.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern" style={{}}>
      <StickyHeader title="Mosques" />

      <div className="px-5 space-y-4">
        {isError && (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground glass-card p-3">
            <WifiOff className="w-4 h-4" />
            <span>Couldn't fetch live data — showing saved mosques</span>
          </div>
        )}

        <div className="relative liquid-glass rounded-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search mosques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ios-input !pl-10 !bg-transparent !border-transparent"
          />
        </div>

        {/* Your default mosque */}
        {(defaultMosque || selectedMosqueName) && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <h3 className="text-[13px] font-semibold text-primary uppercase tracking-wider">Your Mosque</h3>
            </div>
            {defaultMosque ? (
              <MosqueCard
                mosque={defaultMosque}
                expanded={expanded === defaultMosque.id}
                onToggle={(m: Mosque) => setExpanded(expanded === m.id ? null : m.id)}
              />
            ) : (
              <div className="glass-card p-3.5">
                <p className="text-[15px] font-semibold text-foreground">{selectedMosqueName}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">Not found nearby — showing saved name</p>
              </div>
            )}
          </div>
        )}

        {/* Nearby mosques */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {filtered.length > 0 && (
              <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                Nearby
              </h3>
            )}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-2.5"
            >
              {filtered.map((mosque) => (
                <motion.div key={mosque.id} variants={staggerItem}>
                  <MosqueCard
                    mosque={mosque}
                    expanded={expanded === mosque.id}
                    onToggle={(m: Mosque) => setExpanded(expanded === m.id ? null : m.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {!isLoading && filtered.length === 0 && !defaultMosque && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-[15px]">No mosques found</p>
            <p className="text-[13px] text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
