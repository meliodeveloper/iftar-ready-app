import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import PrayerTimes from "./pages/PrayerTimes";
import Mosques from "./pages/Mosques";
import HalalFood from "./pages/HalalFood";
import RamadanCalendar from "./pages/RamadanCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen relative">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/mosques" element={<Mosques />} />
            <Route path="/halal-food" element={<HalalFood />} />
            <Route path="/calendar" element={<RamadanCalendar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
