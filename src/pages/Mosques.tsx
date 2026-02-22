import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import MosqueCard from "@/components/MosqueCard";
import { mockMosques, type Mosque } from "@/lib/mockData";
import { Search } from "lucide-react";

export default function Mosques() {
  const [selected, setSelected] = useState<string>(mockMosques[0].id);
  const [search, setSearch] = useState("");

  const filtered = mockMosques.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Mosques" subtitle="Find mosques near you" />

      <div className="px-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mosques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((mosque, i) => (
            <motion.div
              key={mosque.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <MosqueCard
                mosque={mosque}
                selected={selected === mosque.id}
                onSelect={(m: Mosque) => setSelected(m.id)}
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No mosques found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
