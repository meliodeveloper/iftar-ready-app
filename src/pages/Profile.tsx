import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ChevronRight, Trash2, ExternalLink, Info, MapPinOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings, type CalcMethod, type Madhab, type TimeFormat, type ThemePreference, type LocationMode } from "@/lib/settingsStore";
import { mockMosques } from "@/lib/mockData";
import { pageTransitionProps, staggerContainer, staggerItem, pressable, spring } from "@/lib/motion";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 pt-3.5 pb-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      <div className="px-4 pb-4 space-y-3.5 mt-1">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ios-row">
      <span className="text-[15px] text-foreground">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 shrink-0 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <motion.span
        layout
        transition={spring}
        className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-sm"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex bg-secondary rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-200 ${
            value === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const calcMethods: { label: string; value: CalcMethod }[] = [
  { label: "Muslim World League", value: "MWL" },
  { label: "ISNA", value: "ISNA" },
  { label: "Egyptian", value: "Egypt" },
  { label: "Umm al-Qura", value: "Makkah" },
  { label: "Karachi", value: "Karachi" },
];

export default function Profile() {
  const navigate = useNavigate();
  const settings = useSettings();
  const update = useSettings((s) => s.update);
  const clearCache = useSettings((s) => s.clearCache);
  const queryClient = useQueryClient();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationDenied(result.state === "denied");
        result.onchange = () => setLocationDenied(result.state === "denied");
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.themePreference === "dark") {
      root.classList.add("dark");
    } else if (settings.themePreference === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [settings.themePreference]);

  const selectedMosqueName = settings.selectedMosqueName || mockMosques.find((m) => m.id === settings.selectedMosqueId)?.name;

  return (
    <motion.div {...pageTransitionProps} className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      {/* Header */}
      <div className="pt-14 pb-3 px-5 flex items-center gap-3">
        <motion.button
          {...pressable}
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-2xl font-display font-bold text-gradient-gold">Profile</h1>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-5 space-y-4"
      >
        {/* Location denied banner */}
        {locationDenied && (
          <motion.div variants={staggerItem} className="glass-card p-3.5 flex items-center gap-3">
            <MapPinOff className="w-5 h-5 text-warning shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-foreground">Location access denied</p>
              <p className="text-[13px] text-muted-foreground">Enable GPS for accurate prayer times.</p>
            </div>
            <motion.button
              {...pressable}
              onClick={() => navigator.geolocation.getCurrentPosition(() => {}, () => {})}
              className="shrink-0 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold"
            >
              Enable
            </motion.button>
          </motion.div>
        )}

        {/* Account */}
        <motion.div variants={staggerItem}>
          <Section title="Account">
            <div>
              <label className="text-[13px] text-muted-foreground mb-1 block">Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => update({ displayName: e.target.value })}
                placeholder="Your name"
                className="ios-input"
              />
            </div>
            <Field label="Location mode">
              <SegmentedControl<LocationMode>
                options={[
                  { label: "Auto (GPS)", value: "auto" },
                  { label: "Manual", value: "manual" },
                ]}
                value={settings.locationMode}
                onChange={(v) => update({ locationMode: v })}
              />
            </Field>
            {settings.locationMode === "manual" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                <label className="text-[13px] text-muted-foreground mb-1 block">City / Postcode</label>
                <input
                  type="text"
                  value={settings.manualLocation}
                  onChange={(e) => update({ manualLocation: e.target.value })}
                  placeholder="e.g. London, E1"
                  className="ios-input"
                />
              </motion.div>
            )}
          </Section>
        </motion.div>

        {/* Ramadan & Prayer */}
        <motion.div variants={staggerItem}>
          <Section title="Ramadan & Prayer">
            <div>
              <span className="text-[15px] text-foreground block mb-1">Default Mosque</span>
              <motion.button
                {...pressable}
                onClick={() => navigate("/mosques")}
                className="w-full flex items-center justify-between bg-secondary rounded-xl px-3.5 py-2.5 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[15px] text-foreground truncate">
                    {selectedMosqueName ?? "None selected"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.button>
            </div>

            <div>
              <span className="text-[13px] text-muted-foreground block mb-1">Calculation fallback</span>
              <select
                value={settings.calcMethod}
                onChange={(e) => update({ calcMethod: e.target.value as CalcMethod })}
                className="ios-input appearance-none"
              >
                {calcMethods.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <Field label="Madhab">
              <SegmentedControl<Madhab>
                options={[
                  { label: "Shafi'i", value: "shafi" },
                  { label: "Hanafi", value: "hanafi" },
                ]}
                value={settings.madhab}
                onChange={(v) => update({ madhab: v })}
              />
            </Field>

            <Field label="Time format">
              <SegmentedControl<TimeFormat>
                options={[
                  { label: "12h", value: "12h" },
                  { label: "24h", value: "24h" },
                ]}
                value={settings.timeFormat}
                onChange={(v) => update({ timeFormat: v })}
              />
            </Field>
          </Section>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={staggerItem}>
          <Section title="Notifications">
            <Field label="Enable notifications">
              <Toggle checked={settings.notifEnabled} onChange={(v) => update({ notifEnabled: v })} />
            </Field>

            {settings.notifEnabled && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[15px] text-foreground">Pre-iftar alert</span>
                    <span className="text-[13px] text-primary font-semibold tabular-nums">{settings.preIftarMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={5}
                    value={settings.preIftarMinutes}
                    onChange={(e) => update({ preIftarMinutes: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
                    <span>15 min</span><span>120 min</span>
                  </div>
                </div>

                <Field label="Daily Suhoor reminder">
                  <Toggle checked={settings.dailySuhoorReminder} onChange={(v) => update({ dailySuhoorReminder: v })} />
                </Field>
              </>
            )}
          </Section>
        </motion.div>

        {/* Food discovery */}
        <motion.div variants={staggerItem}>
          <Section title="Food Discovery">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[15px] text-foreground">Search radius</span>
                <span className="text-[13px] text-primary font-semibold tabular-nums">{settings.foodRadiusKm} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={settings.foodRadiusKm}
                onChange={(e) => update({ foodRadiusKm: Number(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
                <span>1 km</span><span>20 km</span>
              </div>
            </div>

            <Field label="Open now only">
              <Toggle checked={settings.openNowOnly} onChange={(v) => update({ openNowOnly: v })} />
            </Field>
            <Field label="Verified only">
              <Toggle checked={settings.verifiedOnly} onChange={(v) => update({ verifiedOnly: v })} />
            </Field>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary text-[12px] text-muted-foreground">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p><strong className="text-foreground font-medium">Verified</strong> = matched halal database. <strong className="text-foreground font-medium">Suggested</strong> = Google listing match.</p>
            </div>
          </Section>
        </motion.div>

        {/* App */}
        <motion.div variants={staggerItem}>
          <Section title="App">
            <Field label="Theme">
              <SegmentedControl<ThemePreference>
                options={[
                  { label: "Light", value: "light" },
                  { label: "Dark", value: "dark" },
                  { label: "Auto", value: "auto" },
                ]}
                value={settings.themePreference}
                onChange={(v) => update({ themePreference: v })}
              />
            </Field>

            <div className="divide-y divide-border rounded-xl bg-secondary overflow-hidden -mx-0.5">
              <motion.button
                {...pressable}
                onClick={() => alert("Ramadan Companion\n\nA Ramadan prayer times, mosque finder, and halal food app.\n\nBuilt with React + Supabase.")}
                className="flex items-center justify-between w-full px-3.5 py-3 text-[15px] text-foreground transition-colors"
              >
                About
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              {/* TODO: replace # with real Privacy Policy and Terms of Service URLs */}
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  {...pressable}
                  className="flex items-center justify-between w-full px-3.5 py-3 text-[15px] text-foreground transition-colors"
                >
                  {item}
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </motion.a>
              ))}
            </div>

            {!showClearConfirm ? (
              <motion.button
                {...pressable}
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-[15px] font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear cached data
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-3"
              >
                <p className="text-[15px] text-foreground">This will reset all settings to defaults. Are you sure?</p>
                <div className="flex gap-2">
                  <motion.button
                    {...pressable}
                    onClick={() => { clearCache(); queryClient.clear(); setShowClearConfirm(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-[15px] font-semibold"
                  >
                    Confirm
                  </motion.button>
                  <motion.button
                    {...pressable}
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-[15px] font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </Section>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
