"use client";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

// Provider dei temi: Light, Dark e tema personalizzato "Paper/Sepia"
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      themes={["light", "dark", "sepia"]}
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
