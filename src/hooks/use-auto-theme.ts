"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const SCHEDULE_KEY = "bookdex-auto-theme";

// Preferenza utente sull'auto-switch in base all'ora
export interface AutoThemeConfig {
  enabled: boolean;
  darkFrom: number; // ora locale (0-23) da cui attivare dark
  darkTo: number;   // ora locale (0-23) fino a cui resta dark
}

export const DEFAULT_SCHEDULE: AutoThemeConfig = {
  enabled: false,
  darkFrom: 20,
  darkTo: 7,
};

export function loadSchedule(): AutoThemeConfig {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE;
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (!raw) return DEFAULT_SCHEDULE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SCHEDULE, ...parsed };
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveSchedule(config: AutoThemeConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(config));
}

// Ritorna true se l'ora corrente cade nella fascia dark (gestisce wrap su mezzanotte)
export function isDarkHour(now: Date, from: number, to: number): boolean {
  const h = now.getHours();
  if (from <= to) return h >= from && h < to;
  return h >= from || h < to; // wrap oltre mezzanotte (es. 20-7)
}

// Hook: applica il tema automaticamente in base all'ora se enabled
export function useAutoTheme(config: AutoThemeConfig) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!config.enabled) return;
    const apply = () => {
      const wantDark = isDarkHour(new Date(), config.darkFrom, config.darkTo);
      const target = wantDark ? "dark" : "light";
      if (theme !== target) setTheme(target);
    };
    apply();
    // Ri-check ogni minuto: costo trascurabile, garantisce lo switch puntuale
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, [config.enabled, config.darkFrom, config.darkTo, setTheme, theme]);
}
