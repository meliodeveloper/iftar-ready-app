import { useState } from "react";
import { MapPin, ChevronRight, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import MosqueCard from "@/components/MosqueCard";
import AvatarButton from "@/components/AvatarButton";
import { mockMosques, mockPrayerTimes } from "@/lib/mockData";
import { pageTransitionProps, staggerContainer, staggerItem, pressable } from "@/lib/motion";
import heroImage from "@/assets/ramadan-hero.jpg";

export default function Index() {
  const navigate = useNavigate();
  const nearest = mockMosques[0];
  const [mosqueExpanded, setMosqueExpanded] = useState(false);

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src={heroImage} alt="Ramadan night" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute top-12 right-5 z-20">
          <AvatarButton />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-5 px-5">
          <Moon className="w-7 h-7 text-primary mb-1.5 animate-pulse-gold" />
          <h1 className="text-2xl font-display font-bold text-gradient-gold">Ramadan Companion</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Your guide through the blessed month</p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-5 space-y-4 mt-5"
      >
        {/* Location */}
        <motion.div variants={staggerItem} className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-[15px] text-foreground">London, UK</span>
          <button className="text-[13px] text-primary font-semibold ml-auto">Change</button>
        </motion.div>

        {/* Countdown */}
        <motion.div variants={staggerItem} className="glass-card p-5">
          <CountdownTimer />
        </motion.div>

        {/* Today's Fasting Times */}
        <motion.div
          variants={staggerItem}
          {...pressable}
          onClick={() => navigate("/prayer-times")}
          className="glass-card p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-foreground">Today's Fasting Times</h3>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-muted-foreground">Timetable</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fast Begins</p>
              <p className="text-xl font-bold text-foreground mt-1">{mockPrayerTimes.fajr}</p>
              <p className="text-[11px] text-primary font-medium mt-0.5">Fajr</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fast Ends</p>
              <p className="text-xl font-bold text-foreground mt-1">{mockPrayerTimes.maghrib}</p>
              <p className="text-[11px] text-primary font-medium mt-0.5">Maghrib / Iftar</p>
            </div>
          </div>
        </motion.div>

        {/* Nearest Mosque */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-foreground">Nearest Mosque</h3>
            <button onClick={() => navigate("/mosques")} className="text-[13px] text-primary font-semibold">
              View all
            </button>
          </div>
          <MosqueCard
            mosque={nearest}
            compact
            expanded={mosqueExpanded}
            onToggle={() => setMosqueExpanded(!mosqueExpanded)}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
