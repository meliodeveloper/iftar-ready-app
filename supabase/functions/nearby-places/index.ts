import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yourdomain.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not configured");
    }

    const { lat, lng, type, radius = 5000 } = await req.json();

    if (!lat || !lng || !type) {
      return new Response(JSON.stringify({ error: "lat, lng, and type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Places API (New) - Nearby Search
    const includedTypes = type === "mosque" ? ["mosque"] : ["restaurant"]; // halal venues

    const textQuery = type === "mosque" ? undefined : "halal restaurant";

    let places: any[] = [];

    if (type === "mosque") {
      // Nearby Search for mosques
      const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.googleMapsUri",
        },
        body: JSON.stringify({
          includedTypes,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius,
            },
          },
          maxResultCount: 20,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Google Places API error [${response.status}]: ${errBody}`);
      }

      const data = await response.json();
      places = data.places || [];
    } else {
      // Text Search for halal restaurants
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.googleMapsUri,places.priceLevel,places.primaryType,places.primaryTypeDisplayName",
        },
        body: JSON.stringify({
          textQuery: "halal restaurant",
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius,
            },
          },
          maxResultCount: 20,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Google Places API error [${response.status}]: ${errBody}`);
      }

      const data = await response.json();
      places = data.places || [];
    }

    // Transform to our app format with distance calculation
    const results = places.map((place: any) => {
      const placeLat = place.location?.latitude ?? 0;
      const placeLng = place.location?.longitude ?? 0;
      const dist = haversine(lat, lng, placeLat, placeLng);

      const base = {
        id: place.id,
        name: place.displayName?.text ?? "Unknown",
        address: place.formattedAddress ?? "",
        distance: formatDistance(dist),
        lat: placeLat,
        lng: placeLng,
        phone: place.nationalPhoneNumber,
        googleMapsUri: place.googleMapsUri,
      };

      if (type === "mosque") {
        return base;
      }

      // Halal venue extras
      return {
        ...base,
        rating: place.rating ?? 0,
        cuisine: place.primaryTypeDisplayName?.text ?? "Restaurant",
        priceLevel: mapPriceLevel(place.priceLevel),
        isOpen: place.currentOpeningHours?.openNow ?? false,
        verified: false, // Google doesn't verify halal
        openingHours: place.currentOpeningHours?.weekdayDescriptions ?? [],
      };
    });

    // Sort by distance
    results.sort((a: any, b: any) => {
      const dA = parseFloat(a.distance);
      const dB = parseFloat(b.distance);
      return dA - dB;
    });

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("nearby-places error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function formatDistance(miles: number): string {
  return miles < 0.1 ? "< 0.1 mi" : `${miles.toFixed(1)} mi`;
}

function mapPriceLevel(level?: string): string {
  switch (level) {
    case "PRICE_LEVEL_FREE":
      return "Free";
    case "PRICE_LEVEL_INEXPENSIVE":
      return "£";
    case "PRICE_LEVEL_MODERATE":
      return "££";
    case "PRICE_LEVEL_EXPENSIVE":
      return "£££";
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return "££££";
    default:
      return "££";
  }
}
