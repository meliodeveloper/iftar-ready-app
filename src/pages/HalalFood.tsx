import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import VenueCard from "@/components/VenueCard";
import { mockHalalVenues } from "@/lib/mockData";
import { Search, Filter, Info } from "lucide-react";

const cuisines = ["All", "Pakistani", "Indian", "Lebanese", "Middle Eastern"];

export default function HalalFood() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");

  const filtered = mockHalalVenues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = cuisine === "All" || v.cuisine === cuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Halal Food" subtitle="Discover halal spots near you" />

      <div className="px-5 space-y-4">
        {/* Iftar banner */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3"
        >
          <span className="text-2xl">🌙</span>
          <div>
            <p className="text-sm font-semibold text-primary">Iftar soon!</p>
            <p className="text-xs text-muted-foreground">Browse halal spots for your iftar meal</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Cuisine filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                cuisine === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Venues */}
        <div className="space-y-3">
          {filtered.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <VenueCard venue={venue} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No venues found</p>
            <p className="text-xs text-muted-foreground mt-1">Try widening your search</p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>"Suggested" venues may serve halal food but are not independently verified. Please confirm directly with the restaurant.</p>
        </div>
      </div>
    </div>
  );
}
