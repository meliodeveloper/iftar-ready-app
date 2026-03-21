# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:8080
npm run build        # Production build
npm run build:dev    # Development mode build
npm run lint         # ESLint check
npm run test         # Run tests once (vitest)
npm run test:watch   # Watch mode
npm run preview      # Preview production build
```

To run a single test file: `npx vitest run src/test/example.test.ts`

## Tech Stack

**Frontend:** React 18 + TypeScript + Vite (`@vitejs/plugin-react-swc`), React Router v6, TanStack React Query v5, Zustand v5, Framer Motion, Tailwind CSS v3, shadcn-ui (Radix UI primitives), lucide-react icons, date-fns, zod, react-hook-form, sonner (toasts)

**Backend:** Supabase (Edge Functions run on Deno), no database tables — Supabase is used only as an authenticated proxy to call Google Places API server-side

**Testing:** Vitest + @testing-library/react + jsdom

**Build tooling:** Vite 5, TypeScript 5, ESLint 9, autoprefixer, PostCSS

## Architecture

**Layout:** Mobile-first, `max-w-md` (448px) centered. Bottom navigation (`BottomNav.tsx`) with 4 tabs; profile via avatar button. All page routes are in `src/App.tsx`.

**Routes:**
| Path | Page | Notes |
|------|------|-------|
| `/` | `Index.tsx` | Home — countdown timer, quick links |
| `/prayer-times` | `PrayerTimes.tsx` | Uses mock data (not live API yet) |
| `/mosques` | `Mosques.tsx` | Live — Google Places via edge function |
| `/halal-food` | `HalalFood.tsx` | Live — Google Places via edge function |
| `/calendar` | `RamadanCalendar.tsx` | Live — Aladhan API |
| `/profile` | `Profile.tsx` | Settings UI |
| `*` | `Onboarding.tsx` | Shown when `onboardingComplete` is false in settings |

**State:**
- *Client/user settings* — Zustand store in `src/lib/settingsStore.ts`, persisted to localStorage as `ramadan-companion-settings`. Covers onboarding, location mode, mosque preference, notification settings, prayer calculation method, theme, madhab, food filters, etc.
- *Server data* — TanStack React Query. Nearby places: 5-minute stale time. Ramadan calendar: 24-hour stale time.

**Geolocation fallback chain** (`src/hooks/useGeolocation.ts`):
1. Browser Geolocation API
2. Manual location from settings (if set)
3. London (51.5177, -0.0654)

**Mock data:** `src/lib/mockData.ts` contains static prayer times, mosques, and halal venues. The Prayer Times page (`/prayer-times`) still uses `mockPrayerTimes`. The Ramadan Calendar and Nearby Places use real APIs.

## Supabase Edge Functions

### `nearby-places`
**File:** `supabase/functions/nearby-places/index.ts`
**Invoked via:** `supabase.functions.invoke("nearby-places", { body: { lat, lng, type, radius } })`
**CORS:** Restricted to `https://iftar-ready-app.lovable.app` only — local dev calls will be blocked unless you update the CORS header.

**Request body:**
```json
{ "lat": number, "lng": number, "type": "mosque" | "halal", "radius": number (default 5000) }
```

**Behaviour:**
- `type: "mosque"` → calls Google Places Nearby Search (`places:searchNearby`) with `includedTypes: ["mosque"]`
- `type: "halal"` → calls Google Places Text Search (`places:searchText`) with query `"halal restaurant"` and a location bias
- Returns up to 20 results sorted by distance (haversine, in miles)
- Distances formatted as `"X.X mi"` or `"< 0.1 mi"`

**Requires** Supabase secret: `GOOGLE_PLACES_API_KEY` (set with `supabase secrets set GOOGLE_PLACES_API_KEY=...`)

## External APIs

### Aladhan API
- **URL:** `https://api.aladhan.com/v1/hijriCalendar/{year}/{month}?latitude=...&longitude=...&method=...`
- **Auth:** None (free, no API key)
- **Used in:** `src/hooks/useRamadanCalendar.ts`
- **Purpose:** Fetches all 30 days of Ramadan with Fajr and Maghrib times for a given location and calculation method
- **Cached:** 24 hours (stale time in React Query)
- **Calc methods:** MWL=3, ISNA=2, Egypt=5, Makkah=4, Karachi=1 (user-selectable in Profile)

### Google Places API (New)
- **Base URL:** `https://places.googleapis.com/v1/places`
- **Auth:** `X-Goog-Api-Key` header with `GOOGLE_PLACES_API_KEY` Supabase secret
- **Called from:** `supabase/functions/nearby-places/index.ts` (server-side only — key never exposed to client)
- **Endpoints used:**
  - `places:searchNearby` — for mosques
  - `places:searchText` — for halal restaurants
- **Field masks** request: id, displayName, formattedAddress, location, rating, userRatingCount, currentOpeningHours, nationalPhoneNumber, googleMapsUri, priceLevel, primaryType, primaryTypeDisplayName

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

### Supabase Edge Function secrets (not in `.env`)
Set via `supabase secrets set`:
```
GOOGLE_PLACES_API_KEY=<your-google-places-api-key>
```

## Animations

Shared presets in `src/lib/motion.ts`:
- `pageTransitionProps` — spread onto page root `<motion.div>` for page transitions
- `staggerContainer` / `staggerItem` — for animated lists (use as `variants`)
- `pressable` — tap/press feedback for interactive elements
- `MotionConfig reducedMotion="user"` is set globally in `App.tsx` — respects OS accessibility settings

## Styling Conventions

- Dark mode is class-based; theme applied in `main.tsx` before first render to prevent flash
- Custom fonts: Inter (sans-serif), Amiri (Arabic display)
- Utility classes: `.glass-card`, `.text-gradient-gold`, `.gradient-ramadan`, `.geometric-pattern`
- Colors via CSS variables (not hardcoded Tailwind colors)
- `cn()` helper from `src/lib/utils.ts` — wraps `clsx` + `tailwind-merge`

## Key Patterns

- **Supabase client:** `src/integrations/supabase/client.ts` — initialized from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- **DB types:** `src/integrations/supabase/types.ts` — auto-generated (no DB tables currently used)
- **Path alias:** `@/*` resolves to `src/*`
- **Settings mutation:** Always use `useSettings((s) => s.update)({ key: value })` — never set Zustand state directly
- **External links:** `src/lib/openExternal.ts` — helper for opening maps/directions links
- **QueryClient:** Single instance created in `App.tsx`, not configured with defaults (uses React Query defaults except per-query `staleTime`)
