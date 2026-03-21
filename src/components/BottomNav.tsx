import { Home, MapPin, Utensils, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { haptics } from "@/lib/haptics";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/mosques", icon: MapPin, label: "Mosques" },
  { path: "/halal-food", icon: Utensils, label: "Halal" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-[50px] max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => { haptics.light(); navigate(item.path); }}
              whileTap={{ scale: 0.9 }}
              transition={spring}
              className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-full"
            >
              <div className="relative flex items-center justify-center w-8 h-8">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/12"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon
                  className={`relative w-[20px] h-[20px] transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
