import { Haptics, ImpactStyle } from "@capacitor/haptics";

const impact = async (style: ImpactStyle) => {
  try {
    await Haptics.impact({ style });
  } catch {
    // Silently fail on web or when Haptics is unavailable
  }
};

export const haptics = {
  light: () => impact(ImpactStyle.Light),
  medium: () => impact(ImpactStyle.Medium),
  heavy: () => impact(ImpactStyle.Heavy),
};
