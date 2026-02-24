import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import MosqueCard from "@/components/MosqueCard";
import { mockMosques, type Mosque } from "@/lib/mockData";
import { Search } from "lucide-react";
import { pageTransitionProps, staggerContainer, staggerItem } from "@/lib/motion";

export default function Mosques() {
  const [selected, setSelected] = useState<string>(mockMosques[0].id);
  const [search, setSearch] = useState("");

  const filtered = mockMosques.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      <PageHeader title="Mosques" subtitle="Find mosques near you" />

      <div className="px-5 space-y-4">
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
                selected={selected === mosque.id}
                onSelect={(m: Mosque) => setSelected(m.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-[15px]">No mosques found</p>
            <p className="text-[13px] text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
