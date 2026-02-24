import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, Search, ChevronRight, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settingsStore";
import { spring, pressable } from "@/lib/motion";

type Step = "welcome" | "location" | "location-manual" | "notifications" | "done";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const CITIES = [
  "London", "Birmingham", "Manchester", "Leeds", "Bradford",
  "Glasgow", "Edinburgh", "Cardiff", "Bristol", "Leicester",
  "Dubai", "Cairo", "Istanbul", "Kuala Lumpur", "Jakarta",
];

export default function Onboarding() {
  const update = useSettings((s) => s.update);
  const [step, setStep] = useState<Step>("welcome");
  const [dir, setDir] = useState(1);
  const [cityQuery, setCityQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  const go = useCallback((next: Step, direction = 1) => {
    setDir(direction);
    setStep(next);
  }, []);

  const requestLocation = useCallback(() => {
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus("granted");
        update({ locationMode: "auto" });
        setTimeout(() => go("notifications"), 600);
      },
      () => {
        setLocationStatus("denied");
      },
      { timeout: 8000 }
    );
  }, [go, update]);

  const requestNotifications = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      update({ notifEnabled: result === "granted" });
    }
    go("done");
  }, [go, update]);

  const selectCity = useCallback((city: string) => {
    update({ locationMode: "manual", manualLocation: city });
    go("notifications");
  }, [go, update]);

  const finish = useCallback(() => {
    update({ onboardingComplete: true });
  }, [update]);

  const filteredCities = cityQuery
    ? CITIES.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
    : CITIES;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-ramadan geometric-pattern">
      {/* Progress dots */}
      <div className="pt-16 pb-4 flex justify-center gap-2">
        {(["welcome", "location", "notifications", "done"] as const).map((s, i) => {
          const steps: Step[] = ["welcome", "location", "notifications", "done"];
          const current = steps.indexOf(step === "location-manual" ? "location" : step);
          return (
            <motion.div
              key={s}
              className="h-1.5 rounded-full"
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i <= current ? "hsl(var(--primary))" : "hsl(var(--muted))",
              }}
              transition={spring}
            />
          );
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={dir}>
          {step === "welcome" && (
            <motion.div
              key="welcome"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm text-center space-y-8"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, ...spring }}
                className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center"
              >
                <span className="text-5xl">🌙</span>
              </motion.div>

              <div className="space-y-3">
                <h1 className="text-3xl font-display font-bold text-gradient-gold">
                  Ramadan Companion
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your personal guide for prayer times, nearby mosques, halal food, and the Ramadan calendar.
                </p>
              </div>

              <motion.button
                {...pressable}
                onClick={() => go("location")}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2"
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {step === "location" && (
            <motion.div
              key="location"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Enable Location
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use your location to show accurate prayer times and nearby mosques. Your data stays on-device.
                </p>
              </div>

              {locationStatus === "denied" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-3.5 text-left"
                >
                  <p className="text-sm text-foreground font-medium mb-1">Location denied</p>
                  <p className="text-xs text-muted-foreground">
                    You can enable it later in Settings, or search for your city manually below.
                  </p>
                </motion.div>
              )}

              <div className="space-y-3">
                <motion.button
                  {...pressable}
                  onClick={requestLocation}
                  disabled={locationStatus === "requesting" || locationStatus === "granted"}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {locationStatus === "requesting" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : locationStatus === "granted" ? (
                    <>✓ Location Enabled</>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" /> Allow Location Access
                    </>
                  )}
                </motion.button>

                <motion.button
                  {...pressable}
                  onClick={() => go("location-manual")}
                  className="w-full py-3 rounded-2xl bg-secondary text-foreground font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Search city manually
                </motion.button>

                {locationStatus === "denied" && (
                  <button
                    onClick={() => go("notifications")}
                    className="text-sm text-muted-foreground underline underline-offset-2"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === "location-manual" && (
            <motion.div
              key="location-manual"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm space-y-5"
            >
              <button
                onClick={() => go("location", -1)}
                className="text-sm text-muted-foreground flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Find Your City
                </h2>
                <p className="text-sm text-muted-foreground">
                  Search or pick a city for prayer times.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Search cities..."
                  className="ios-input pl-10"
                  autoFocus
                />
              </div>

              <div className="glass-card divide-y divide-border overflow-hidden max-h-[45vh] overflow-y-auto">
                {filteredCities.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No cities found. Try a different search.
                  </div>
                ) : (
                  filteredCities.map((city) => (
                    <motion.button
                      key={city}
                      {...pressable}
                      onClick={() => selectCity(city)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-[15px] text-foreground transition-colors active:bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {city}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === "notifications" && (
            <motion.div
              key="notifications"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Stay Reminded
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get alerts before Iftar and Suhoor so you never miss a moment.
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  {...pressable}
                  onClick={requestNotifications}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" /> Enable Notifications
                </motion.button>

                <button
                  onClick={() => {
                    update({ notifEnabled: false });
                    go("done");
                  }}
                  className="text-sm text-muted-foreground underline underline-offset-2"
                >
                  Not now
                </button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 250, damping: 20 }}
                className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-primary" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl font-display font-bold text-gradient-gold">
                  You're All Set
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Ramadan Mubarak! Your companion is ready.
                </p>
              </div>

              <motion.button
                {...pressable}
                onClick={finish}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2"
              >
                Enter App <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
