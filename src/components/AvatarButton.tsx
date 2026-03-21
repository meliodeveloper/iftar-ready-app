import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

export default function AvatarButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/profile")}
      aria-label="Open profile and settings"
      className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-primary active:scale-95 transition-all shrink-0"
    >
      <Settings className="w-4.5 h-4.5" />
    </button>
  );
}
