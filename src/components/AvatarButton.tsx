import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/settingsStore";

export default function AvatarButton() {
  const navigate = useNavigate();
  const displayName = useSettings((s) => s.displayName);
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <button
      onClick={() => navigate("/profile")}
      aria-label="Open profile and settings"
      className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center justify-center text-sm font-semibold text-primary hover:ring-1 hover:ring-primary/40 transition-all shrink-0"
    >
      {initial}
    </button>
  );
}
