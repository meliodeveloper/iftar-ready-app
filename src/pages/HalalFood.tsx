import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import VenueCard from "@/components/VenueCard";
import { mockHalalVenues } from "@/lib/mockData";
import { Search, Info } from "lucide-react";

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

      <div className="px-5 space-y-3">
        {/* Iftar banner */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3.5 flex items-center gap-3"
        >
          <span className="text-2xl">🌙</span>
          <div>
            <p className="text-[15px] font-semibold text-primary">Iftar soon!</p>
            <p className="text-[13px] text-muted-foreground">Browse halal spots for your iftar meal</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ios-input pl-10"
          />
        </div>

        {/* Cuisine filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`shrink-0 ios-pill ${
                cuisine === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground active:bg-secondary/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Venues */}
        <div className="space-y-2.5">
          {filtered.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <VenueCard venue={venue} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-[15px]">No venues found</p>
            <p className="text-[13px] text-muted-foreground mt-1">Try widening your search</p>
          </div>
        )}

        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-secondary text-[13px] text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>"Suggested" venues may serve halal food but are not independently verified. Please confirm directly with the restaurant.</p>
        </div>
      </div>
    </div>
  );
}
