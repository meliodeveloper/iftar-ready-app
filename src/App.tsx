import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { useSettings } from "@/lib/settingsStore";
import { useSwipeBack } from "@/hooks/useSwipeBack";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import PrayerTimes from "./pages/PrayerTimes";
import Mosques from "./pages/Mosques";
import HalalFood from "./pages/HalalFood";
import RamadanCalendar from "./pages/RamadanCalendar";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/mosques" element={<Mosques />} />
        <Route path="/halal-food" element={<HalalFood />} />
        <Route path="/calendar" element={<RamadanCalendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  const onboardingComplete = useSettings((s) => s.onboardingComplete);
  const themePreference = useSettings((s) => s.themePreference);
  useSwipeBack();

  // Keep the dark class in sync with the theme preference, including live
  // system changes when set to "auto"
  useEffect(() => {
    const root = document.documentElement;
    if (themePreference === "dark") {
      root.classList.add("dark");
    } else if (themePreference === "light") {
      root.classList.remove("dark");
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => root.classList.toggle("dark", e.matches);
      root.classList.toggle("dark", mq.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [themePreference]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handler = CapApp.addListener("backButton", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else if (Capacitor.getPlatform() === "android") {
        CapApp.exitApp();
      }
    });
    return () => { handler.then((h) => h.remove()); };
  }, []);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <AnimatedRoutes />
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
