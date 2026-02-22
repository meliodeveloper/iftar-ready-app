import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before first render to avoid flash
const saved = JSON.parse(localStorage.getItem("ramadan-companion-settings") || "{}");
const pref = saved?.state?.themePreference || "dark";
const root = document.documentElement;
if (pref === "dark") {
  root.classList.add("dark");
} else if (pref === "light") {
  root.classList.remove("dark");
} else {
  root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
}

createRoot(document.getElementById("root")!).render(<App />);
