import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Mosque, HalalVenue } from "@/lib/mockData";

interface UseNearbyPlacesOptions {
  lat: number | null;
  lng: number | null;
  type: "mosque" | "halal";
  radius?: number;
  enabled?: boolean;
}

async function fetchNearbyPlaces<T>(
  lat: number,
  lng: number,
  type: string,
  radius: number
): Promise<T[]> {
  const { data, error } = await supabase.functions.invoke("nearby-places", {
    body: { lat, lng, type, radius },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T[];
}

export function useNearbyMosques(lat: number | null, lng: number | null, radius = 5000) {
  return useQuery<Mosque[]>({
    queryKey: ["nearby-mosques", lat, lng, radius],
    queryFn: () => fetchNearbyPlaces<Mosque>(lat!, lng!, "mosque", radius),
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

export function useNearbyHalalVenues(lat: number | null, lng: number | null, radius = 5000) {
  return useQuery<HalalVenue[]>({
    queryKey: ["nearby-halal", lat, lng, radius],
    queryFn: () => fetchNearbyPlaces<HalalVenue>(lat!, lng!, "halal", radius),
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
