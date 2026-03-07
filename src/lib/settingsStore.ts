import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LocationMode = "auto" | "manual";
export type TimeFormat = "12h" | "24h";
export type ThemePreference = "light" | "dark" | "auto";
export type CalcMethod =
  | "MWL"
  | "ISNA"
  | "Egypt"
  | "Makkah"
  | "Karachi";
export type Madhab = "shafi" | "hanafi";

export interface UserSettings {
  onboardingComplete: boolean;
  displayName: string;
  locationMode: LocationMode;
  manualLocation: string;
  manualLat: number | null;
  manualLng: number | null;
  selectedMosqueId: string;
  notifEnabled: boolean;
  preIftarMinutes: number;
  dailySuhoorReminder: boolean;
  foodRadiusKm: number;
  verifiedOnly: boolean;
  openNowOnly: boolean;
  timeFormat: TimeFormat;
  themePreference: ThemePreference;
  calcMethod: CalcMethod;
  madhab: Madhab;
}

interface SettingsStore extends UserSettings {
  update: (partial: Partial<UserSettings>) => void;
  clearCache: () => void;
}

const defaults: UserSettings = {
  onboardingComplete: false,
  displayName: "",
  locationMode: "auto",
  manualLocation: "",
  manualLat: null,
  manualLng: null,
  selectedMosqueId: "1",
  notifEnabled: true,
  preIftarMinutes: 60,
  dailySuhoorReminder: false,
  foodRadiusKm: 5,
  verifiedOnly: false,
  openNowOnly: false,
  timeFormat: "24h",
  themePreference: "dark",
  calcMethod: "MWL",
  madhab: "shafi",
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      update: (partial) => set(partial),
      clearCache: () => set(defaults),
    }),
    { name: "ramadan-companion-settings" }
  )
);
