import { MapPin, ChevronRight, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import MosqueCard from "@/components/MosqueCard";
import { mockMosques, mockPrayerTimes } from "@/lib/mockData";
import heroImage from "@/assets/ramadan-hero.jpg";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

export default function Index() {
  const navigate = useNavigate();
  const nearest = mockMosques[0];

  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img src={heroImage} alt="Ramadan night" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4 px-5">
          <Moon className="w-8 h-8 text-primary mb-2 animate-pulse-gold" />
          <h1 className="text-2xl font-display font-bold text-gradient-gold">Ramadan Companion</h1>
          <p className="text-xs text-muted-foreground mt-1">Your guide through the blessed month</p>
        </div>
      </div>

      <div className="px-5 space-y-5 mt-4">
        {/* Location */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">London, UK</span>
          <button className="text-xs text-primary font-medium ml-auto">Change</button>
        </motion.div>

        {/* Countdown */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="glass-card p-5">
          <CountdownTimer />
        </motion.div>

        {/* Today's Fasting Times */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Today's Fasting Times</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fast Begins</p>
              <p className="text-xl font-bold text-foreground mt-1">{mockPrayerTimes.fajr}</p>
              <p className="text-[10px] text-primary mt-0.5">Fajr</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fast Ends</p>
              <p className="text-xl font-bold text-foreground mt-1">{mockPrayerTimes.maghrib}</p>
              <p className="text-[10px] text-primary mt-0.5">Maghrib / Iftar</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/prayer-times")}
            className="flex items-center justify-center gap-1 w-full mt-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            View full prayer timetable <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Nearest Mosque */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Nearest Mosque</h3>
            <button onClick={() => navigate("/mosques")} className="text-xs text-primary font-medium">
              View all
            </button>
          </div>
          <MosqueCard mosque={nearest} selected compact />
        </motion.div>
      </div>
    </div>
  );
}
