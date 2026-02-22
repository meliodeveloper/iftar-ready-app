import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ChevronRight, Trash2, ExternalLink, Info } from "lucide-react";
import { useSettings, type CalcMethod, type Madhab, type TimeFormat, type ThemePreference, type LocationMode } from "@/lib/settingsStore";
import { mockMosques } from "@/lib/mockData";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
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
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-secondary"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
          checked ? "translate-x-5 bg-primary-foreground" : "bg-muted-foreground"
        }`}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex bg-secondary/50 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const selectedMosque = mockMosques.find((m) => m.id === settings.selectedMosqueId);

  return (
    <div className="min-h-screen pb-24 bg-gradient-ramadan geometric-pattern">
      {/* Header */}
      <div className="pt-12 pb-4 px-5 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl font-display font-bold text-gradient-gold">Profile</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Section title="Account">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => update({ displayName: e.target.value })}
                placeholder="Your name"
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
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
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="text-xs text-muted-foreground mb-1 block">City / Postcode</label>
                <input
                  type="text"
                  value={settings.manualLocation}
                  onChange={(e) => update({ manualLocation: e.target.value })}
                  placeholder="e.g. London, E1"
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </motion.div>
            )}
          </Section>
        </motion.div>

        {/* Ramadan & Prayer */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Section title="Ramadan & Prayer">
            <div>
              <span className="text-sm text-foreground block mb-1">Default Mosque</span>
              <button
                onClick={() => navigate("/mosques")}
                className="w-full flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground truncate">
                    {selectedMosque?.name ?? "None selected"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block mb-1">Calculation fallback</span>
              <select
                value={settings.calcMethod}
                onChange={(e) => update({ calcMethod: e.target.value as CalcMethod })}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section title="Notifications">
            <Field label="Enable notifications">
              <Toggle checked={settings.notifEnabled} onChange={(v) => update({ notifEnabled: v })} />
            </Field>

            {settings.notifEnabled && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">Pre-iftar alert</span>
                    <span className="text-xs text-primary font-semibold tabular-nums">{settings.preIftarMinutes} min</span>
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
                  <div className="flex justify-between text-[10px] text-muted-foreground">
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section title="Food Discovery">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">Search radius</span>
                <span className="text-xs text-primary font-semibold tabular-nums">{settings.foodRadiusKm} km</span>
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
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 km</span><span>20 km</span>
              </div>
            </div>

            <Field label="Open now only">
              <Toggle checked={settings.openNowOnly} onChange={(v) => update({ openNowOnly: v })} />
            </Field>
            <Field label="Verified only">
              <Toggle checked={settings.verifiedOnly} onChange={(v) => update({ verifiedOnly: v })} />
            </Field>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30 text-[11px] text-muted-foreground">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p><strong className="text-foreground">Verified</strong> = matched halal database. <strong className="text-foreground">Suggested</strong> = Google listing match.</p>
            </div>
          </Section>
        </motion.div>

        {/* App */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
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

            <div className="flex flex-col gap-2">
              {["About", "Privacy Policy", "Terms of Service"].map((item) => (
                <button key={item} className="flex items-center justify-between py-1.5 text-sm text-foreground hover:text-primary transition-colors">
                  {item}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear cached data
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 space-y-3">
                <p className="text-sm text-foreground">This will reset all settings to defaults. Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { clearCache(); setShowClearConfirm(false); }}
                    className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Section>
        </motion.div>
      </div>
    </div>
  );
}
