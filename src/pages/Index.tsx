import { MapPin, ChevronRight, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import AvatarButton from "@/components/AvatarButton";
import { mockMosques, mockPrayerTimes } from "@/lib/mockData";
import { pageTransitionProps, staggerContainer, staggerItem, pressable } from "@/lib/motion";

export default function Index() {
  const navigate = useNavigate();
  const nearest = mockMosques[0];

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">Ramadan Companion</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">London, UK</span>
            <button className="text-[13px] text-primary font-medium ml-1">Change</button>
          </div>
        </div>
        <AvatarButton />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-5 space-y-5 mt-4"
      >
        {/* Hero card: Countdown + Fasting times merged */}
        <motion.div variants={staggerItem} className="glass-card p-5">
          <CountdownTimer />

          <div className="h-px bg-border my-4" />

          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fajr</p>
              <p className="text-lg font-semibold text-foreground mt-0.5">{mockPrayerTimes.fajr}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Maghrib</p>
              <p className="text-lg font-semibold text-foreground mt-0.5">{mockPrayerTimes.maghrib}</p>
            </div>
          </div>

          <motion.button
            {...pressable}
            onClick={() => navigate("/prayer-times")}
            className="flex items-center justify-center gap-1 w-full mt-4 py-2.5 rounded-xl bg-primary/8 text-primary text-[14px] font-medium transition-colors"
          >
            Full timetable <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Nearest Mosque — compact row, no heavy card */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Nearest Mosque</h3>
            <button onClick={() => navigate("/mosques")} className="text-[13px] text-primary font-medium">
              View all
            </button>
          </div>
          <motion.button
            {...pressable}
            onClick={() => navigate("/mosques")}
            className="w-full text-left glass-card p-3.5 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground truncate">{nearest.name}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{nearest.address}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Navigation className="w-3 h-3" />
              {nearest.distance}
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
