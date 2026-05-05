import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "deknek3d.appearance";

const defaultSettings = {
  theme: "auto",
  accent: "#22d3ee",
  reducedMotion: false,
  animations: true,
  particles: true,
  fontSize: 100,
};

const AppearanceContext = createContext({
  settings: defaultSettings,
  resolvedTheme: "dark",
  updateSettings: () => {},
  setSettings: () => {},
});

function clampFontSize(value) {
  if (!Number.isFinite(value)) return defaultSettings.fontSize;
  return Math.max(90, Math.min(120, value));
}

export function AppearanceProvider({ children }) {
  const [settings, setSettingsState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
        fontSize: clampFontSize(Number(parsed.fontSize ?? defaultSettings.fontSize)),
      };
    } catch {
      return defaultSettings;
    }
  });

  const resolvedTheme = useMemo(() => {
    if (settings.theme === "light" || settings.theme === "dark") return settings.theme;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
  }, [settings.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.style.setProperty("--app-accent", settings.accent);
    root.style.setProperty("--app-font-scale", String(settings.fontSize / 100));
    root.style.fontSize = `${settings.fontSize}%`;

    document.body.classList.toggle("theme-light", resolvedTheme === "light");
    document.body.classList.toggle("reduce-motion", settings.reducedMotion || !settings.animations);
  }, [resolvedTheme, settings]);

  const updateSettings = (patch) => {
    setSettingsState((current) => {
      const next = {
        ...current,
        ...patch,
      };
      next.fontSize = clampFontSize(Number(next.fontSize));
      return next;
    });
  };

  const value = useMemo(
    () => ({ settings, resolvedTheme, updateSettings, setSettings: setSettingsState }),
    [settings, resolvedTheme]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  return useContext(AppearanceContext);
}
