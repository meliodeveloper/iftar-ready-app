import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/lib/settingsStore";

interface GeoPosition {
  lat: number;
  lng: number;
}

interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  refresh: () => void;
  locationLabel: string;
}

const DEFAULT_POSITION: GeoPosition = { lat: 51.5177, lng: -0.0654 }; // London fallback

export function useGeolocation(): UseGeolocationResult {
  const locationMode = useSettings((s) => s.locationMode);
  const manualLocation = useSettings((s) => s.manualLocation);
  const manualLat = useSettings((s) => (s as any).manualLat as number | undefined);
  const manualLng = useSettings((s) => (s as any).manualLng as number | undefined);

  const [autoPosition, setAutoPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuto = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setAutoPosition(DEFAULT_POSITION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAutoPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setError(err.message);
        setAutoPosition(DEFAULT_POSITION);
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  useEffect(() => {
    if (locationMode === "auto") {
      fetchAuto();
    } else {
      setLoading(false);
    }
  }, [locationMode, fetchAuto]);

  // Determine the effective position
  let position: GeoPosition | null;
  let locationLabel: string;

  if (locationMode === "manual" && manualLat && manualLng) {
    position = { lat: manualLat, lng: manualLng };
    locationLabel = manualLocation || `${manualLat.toFixed(2)}°, ${manualLng.toFixed(2)}°`;
  } else if (autoPosition) {
    position = autoPosition;
    locationLabel = `${autoPosition.lat.toFixed(2)}°N, ${autoPosition.lng.toFixed(2)}°W`;
  } else {
    position = null;
    locationLabel = "Locating…";
  }

  return { position, error, loading, refresh: fetchAuto, locationLabel };
}
