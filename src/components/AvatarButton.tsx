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
      className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-semibold text-primary hover:bg-secondary/80 active:scale-95 transition-all shrink-0"
    >
      {initial}
    </button>
  );
}
