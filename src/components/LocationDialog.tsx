import { useState, useCallback } from "react";
import { MapPin, X, Loader2, LocateFixed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/lib/settingsStore";

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
}

const GEOCODE_URL = "https://nominatim.openstreetmap.org/search";

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationDialog({ open, onClose }: LocationDialogProps) {
  const update = useSettings((s) => s.update);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `${GEOCODE_URL}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      );
      const data: GeoResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  const selectResult = (r: GeoResult) => {
    update({
      locationMode: "manual",
      manualLocation: r.display_name.split(",").slice(0, 2).join(",").trim(),
      manualLat: parseFloat(r.lat),
      manualLng: parseFloat(r.lon),
    } as any);
    onClose();
    setQuery("");
    setResults([]);
  };

  const useAutoLocation = () => {
    update({ locationMode: "auto", manualLocation: "" } as any);
    onClose();
    setQuery("");
    setResults([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[80vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-6 pt-2 flex flex-col gap-4 overflow-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Set Location</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Search input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search city or address..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    className="ios-input !pl-9"
                    autoFocus
                  />
                </div>
                <button
                  onClick={search}
                  disabled={searching || !query.trim()}
                  className="shrink-0 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                </button>
              </div>

              {/* Use current location */}
              <button
                onClick={useAutoLocation}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary active:scale-[0.98] transition-transform"
              >
                <LocateFixed className="w-4 h-4 text-primary" />
                <span className="text-[14px] font-medium text-foreground">Use my current location</span>
              </button>

              {/* Results */}
              {results.length > 0 && (
                <div className="divide-y divide-border rounded-xl bg-secondary overflow-hidden">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => selectResult(r)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 active:bg-primary/10 transition-colors"
                    >
                      <p className="text-[14px] font-medium text-foreground truncate">
                        {r.display_name.split(",").slice(0, 2).join(",")}
                      </p>
                      <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                        {r.display_name}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {searching && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
