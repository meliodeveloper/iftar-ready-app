import { Home, MapPin, Utensils, Calendar, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/prayer-times", icon: Clock, label: "Times" },
  { path: "/mosques", icon: MapPin, label: "Mosques" },
  { path: "/halal-food", icon: Utensils, label: "Halal" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                className={`w-5 h-5 transition-colors relative z-10 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium relative z-10 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
