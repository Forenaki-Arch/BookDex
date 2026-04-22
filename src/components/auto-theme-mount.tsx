"use client";
import { useEffect, useState } from "react";
import { DEFAULT_SCHEDULE, loadSchedule, useAutoTheme, type AutoThemeConfig } from "@/hooks/use-auto-theme";

// Componente "silenzioso" che monta il hook auto-theme dopo l'hydration.
// Vive nel layout root e non renderizza nulla.
export function AutoThemeMount() {
  const [config, setConfig] = useState<AutoThemeConfig>(DEFAULT_SCHEDULE);

  useEffect(() => {
    setConfig(loadSchedule());
    // Ascolta eventuali modifiche dalla Settings page
    const onChange = () => setConfig(loadSchedule());
    window.addEventListener("bookdex-auto-theme", onChange);
    return () => window.removeEventListener("bookdex-auto-theme", onChange);
  }, []);

  useAutoTheme(config);
  return null;
}
