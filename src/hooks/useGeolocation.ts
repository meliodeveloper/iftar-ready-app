import { useState, useEffect, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
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

const LONDON_FALLBACK: GeoPosition = { lat: 51.5177, lng: -0.0654 };

export function useGeolocation(): UseGeolocationResult {
  const locationMode = useSettings((s) => s.locationMode);
  const manualLocation = useSettings((s) => s.manualLocation);
  const manualLat = useSettings((s) => s.manualLat);
  const manualLng = useSettings((s) => s.manualLng);

  const [detectedPosition, setDetectedPosition] = useState<GeoPosition | null>(null);
  const [geoFailed, setGeoFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const attemptedRef = useRef(false);

  const fetchAuto = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGeoFailed(false);

    if (Capacitor.isNativePlatform()) {
      // Native iOS/Android — use Capacitor to get a single native permission prompt
      try {
        const pos = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false });
        setDetectedPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoFailed(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Location unavailable";
        console.warn("Geolocation error:", msg);
        setError(msg);
        setGeoFailed(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Web / PWA — fall back to navigator.geolocation
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setGeoFailed(true);
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectedPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGeoFailed(false);
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setError(err.message);
          setGeoFailed(true);
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Always attempt geolocation on first mount in auto mode
  useEffect(() => {
    if (locationMode === "auto") {
      attemptedRef.current = true;
      fetchAuto();
    } else {
      setLoading(false);
    }
  }, [locationMode, fetchAuto]);

  // Determine the effective position
  let position: GeoPosition | null;
  let locationLabel: string;

  if (locationMode === "manual" && manualLat != null && manualLng != null) {
    // User explicitly chose a manual location
    position = { lat: manualLat, lng: manualLng };
    locationLabel = manualLocation || `${manualLat.toFixed(2)}°, ${manualLng.toFixed(2)}°`;
  } else if (detectedPosition) {
    // Geolocation succeeded — always use real coordinates
    position = detectedPosition;
    const latDir = detectedPosition.lat >= 0 ? "N" : "S";
    const lngDir = detectedPosition.lng >= 0 ? "E" : "W";
    locationLabel = `${Math.abs(detectedPosition.lat).toFixed(2)}°${latDir}, ${Math.abs(detectedPosition.lng).toFixed(2)}°${lngDir}`;
  } else if (geoFailed) {
    // Geolocation failed — only now use London fallback
    position = LONDON_FALLBACK;
    locationLabel = "London, UK (default)";
  } else {
    // Still loading
    position = null;
    locationLabel = "Locating…";
  }

  return { position, error, loading, refresh: fetchAuto, locationLabel };
}
