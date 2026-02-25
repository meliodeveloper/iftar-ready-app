import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import MosqueCard from "@/components/MosqueCard";
import { mockMosques, type Mosque } from "@/lib/mockData";
import { Search, Loader2, WifiOff } from "lucide-react";
import { pageTransitionProps, staggerContainer, staggerItem } from "@/lib/motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyMosques } from "@/hooks/useNearbyPlaces";

export default function Mosques() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { position } = useGeolocation();
  const { data: liveMosques, isLoading, isError } = useNearbyMosques(
    position?.lat ?? null,
    position?.lng ?? null
  );

  const mosques = liveMosques && liveMosques.length > 0 ? liveMosques : mockMosques;

  const filtered = mosques.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Mosques" subtitle="Find mosques near you" />

      <div className="px-5 space-y-4">
        {isError && (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground glass-card p-3">
            <WifiOff className="w-4 h-4" />
            <span>Couldn't fetch live data — showing saved mosques</span>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mosques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ios-input pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
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
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-[15px]">No mosques found</p>
            <p className="text-[13px] text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
