import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function latLngToPixel(lat: number, lng: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;

  const x = ((lng + 180) / 360) * n * 256;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256;

  return { x, y, n };
}

export default function StaticOsmMap({
  lat,
  lng,
  label,
  zoom = 16,
}: {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
}) {
  const [hasError, setHasError] = useState(false);

  const { tiles, transform } = useMemo(() => {
    const { x, y, n } = latLngToPixel(lat, lng, zoom);

    const tileX0 = Math.floor(x / 256);
    const tileY0 = Math.floor(y / 256);

    const dx = x - tileX0 * 256;
    const dy = y - tileY0 * 256;

    const tileList: Array<{ x: number; y: number; left: number; top: number; key: string }> = [];

    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const rawX = tileX0 + i;
        const rawY = tileY0 + j;

        // wrap X around the world, clamp Y at the poles
        const tx = mod(rawX, n);
        const ty = clamp(rawY, 0, n - 1);

        tileList.push({
          x: tx,
          y: ty,
          left: (i + 1) * 256,
          top: (j + 1) * 256,
          key: `${zoom}:${tx}:${ty}:${i}:${j}`,
        });
      }
    }

    return {
      tiles: tileList,
      // Align the lat/lng point to the viewport center
      transform: `translate(${- (256 + dx)}px, ${-(256 + dy)}px)`,
    };
  }, [lat, lng, zoom]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!hasError ? (
        <>
          {/* Tile layer */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2" style={{ transform }}>
              {tiles.map((t) => (
                <img
                  key={t.key}
                  src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
                  alt=""
                  loading="eager"
                  className="absolute w-[256px] h-[256px] select-none pointer-events-none"
                  style={{ left: t.left, top: t.top }}
                  onError={() => setHasError(true)}
                />
              ))}
            </div>
          </div>

          {/* Subtle top fade so the close button stays readable */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 to-transparent pointer-events-none" />

          {/* Center marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-xl border border-border shadow-sm flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" aria-label={label ? `Location pin for ${label}` : "Location pin"} />
            </div>
            <div className="mx-auto w-1 h-3 bg-background/80 border border-border rounded-full -mt-1" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <p className="text-[13px] text-muted-foreground">Map preview unavailable</p>
        </div>
      )}
    </div>
  );
}
