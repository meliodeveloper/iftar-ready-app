import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import VenueCard from "@/components/VenueCard";
import { mockHalalVenues } from "@/lib/mockData";
import { Search, Info, Loader2, WifiOff } from "lucide-react";
import { pageTransitionProps, staggerContainer, staggerItem, pressable } from "@/lib/motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyHalalVenues } from "@/hooks/useNearbyPlaces";
import { useSettings } from "@/lib/settingsStore";

export default function HalalFood() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openNowOnly = useSettings((s) => s.openNowOnly);
  const verifiedOnly = useSettings((s) => s.verifiedOnly);
  const foodRadiusKm = useSettings((s) => s.foodRadiusKm);

  const { position } = useGeolocation();
  const { data: liveVenues, isLoading, isError } = useNearbyHalalVenues(
    position?.lat ?? null,
    position?.lng ?? null,
    foodRadiusKm * 1000
  );

  const venues = liveVenues && liveVenues.length > 0 ? liveVenues : mockHalalVenues;

  // Build dynamic cuisine tabs from actual data
  const cuisineTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of venues) {
      const label = v.cuisine || "Restaurant";
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    // Sort by frequency descending, take top tags
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
    return ["All", ...sorted];
  }, [venues]);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const matchesSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.cuisine.toLowerCase().includes(search.toLowerCase()) ||
        v.address.toLowerCase().includes(search.toLowerCase());
      const matchesCuisine = cuisine === "All" || v.cuisine === cuisine;
      const matchesOpen = !openNowOnly || v.isOpen;
      const matchesVerified = !verifiedOnly || v.verified;
      return matchesSearch && matchesCuisine && matchesOpen && matchesVerified;
    });
  }, [venues, search, cuisine, openNowOnly, verifiedOnly]);

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Halal Food" subtitle="Discover halal spots near you" />

      <div className="px-5 space-y-4">
        {isError && (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground glass-card p-3">
            <WifiOff className="w-4 h-4" />
            <span>Couldn't fetch live data — showing saved venues</span>
          </div>
        )}

        {/* Iftar banner */}
        <div className="glass-card p-3.5 flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <p className="text-[15px] font-semibold text-primary">Iftar soon!</p>
            <p className="text-[13px] text-muted-foreground">Browse halal spots for your iftar meal</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ios-input !pl-10"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
            {cuisineTabs.map((c) => (
              <motion.button
                key={c}
                {...pressable}
                onClick={() => setCuisine(c)}
                className={`shrink-0 ios-pill ${
                  cuisine === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
          {(openNowOnly || verifiedOnly) && (
            <div className="flex gap-2">
              {openNowOnly && (
                <span className="ios-pill text-[12px] bg-success/15 text-success border border-success/30">
                  Open now
                </span>
              )}
              {verifiedOnly && (
                <span className="ios-pill text-[12px] bg-success/15 text-success border border-success/30">
                  Verified only
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-[12px] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {cuisine !== "All" && ` for "${cuisine}"`}
          {openNowOnly && " · open now"}
        </p>

        {/* Venues */}
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
            {filtered.map((venue) => (
              <motion.div key={venue.id} variants={staggerItem}>
                <VenueCard
                  venue={venue}
                  expanded={expandedId === venue.id}
                  onToggle={() => setExpandedId(expandedId === venue.id ? null : venue.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-[15px]">No venues found</p>
            <p className="text-[13px] text-muted-foreground mt-1">Try widening your search or removing filters</p>
          </div>
        )}

        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-secondary text-[13px] text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>"Suggested" venues may serve halal food but are not independently verified. Please confirm directly with the restaurant.</p>
        </div>
      </div>
    </motion.div>
  );
}
