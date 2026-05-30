import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "dark" | "light" | "midnight" | "sunset";

export type Theme = {
  id: ThemeId;
  name: string;
  emoji: string;
  // Tailwind class strings used app-wide
  bg: string;
  bgSoft: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;       // gradient
  accentSolid: string;  // single colour bg
  accentText: string;
  ring: string;
};

export const THEMES: Record<ThemeId, Theme> = {
  dark: {
    id: "dark",
    name: "Slate Dark",
    emoji: "🌙",
    bg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
    bgSoft: "bg-slate-950/40",
    surface: "bg-slate-900/70",
    surfaceAlt: "bg-slate-800/60",
    border: "border-slate-800/60",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    textSubtle: "text-slate-500",
    accent: "from-indigo-500 to-violet-500",
    accentSolid: "bg-indigo-500",
    accentText: "text-indigo-400",
    ring: "ring-indigo-500/30",
  },
  light: {
    id: "light",
    name: "Cloud Light",
    emoji: "☀️",
    bg: "bg-gradient-to-br from-slate-50 via-white to-indigo-50",
    bgSoft: "bg-white/60",
    surface: "bg-white",
    surfaceAlt: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    textSubtle: "text-slate-500",
    accent: "from-indigo-500 to-violet-500",
    accentSolid: "bg-indigo-500",
    accentText: "text-indigo-600",
    ring: "ring-indigo-500/30",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Blue",
    emoji: "🌌",
    bg: "bg-gradient-to-br from-[#020617] via-[#0b1437] to-[#020617]",
    bgSoft: "bg-[#0b1437]/40",
    surface: "bg-[#0b1437]/70",
    surfaceAlt: "bg-[#142057]/60",
    border: "border-blue-900/50",
    text: "text-blue-50",
    textMuted: "text-blue-200/70",
    textSubtle: "text-blue-300/50",
    accent: "from-cyan-400 to-blue-500",
    accentSolid: "bg-cyan-500",
    accentText: "text-cyan-300",
    ring: "ring-cyan-500/30",
  },
  sunset: {
    id: "sunset",
    name: "Sunset Glow",
    emoji: "🌅",
    bg: "bg-gradient-to-br from-[#1a0b1f] via-[#3a0f2a] to-[#1a0b1f]",
    bgSoft: "bg-[#2a0f24]/40",
    surface: "bg-[#2a0f24]/70",
    surfaceAlt: "bg-[#3a1530]/60",
    border: "border-rose-900/40",
    text: "text-rose-50",
    textMuted: "text-rose-200/70",
    textSubtle: "text-rose-300/50",
    accent: "from-orange-400 via-pink-500 to-rose-500",
    accentSolid: "bg-pink-500",
    accentText: "text-pink-300",
    ring: "ring-pink-500/30",
  },
};

type ThemeContextType = {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const KEY = "nova-ai-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem(KEY) as ThemeId | null;
      if (stored && THEMES[stored]) return stored;
    } catch { /* ignore */ }
    return "dark";
  });

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    try { localStorage.setItem(KEY, id); } catch { /* ignore */ }
  };

  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId], themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
