"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Provider dei temi: Light, Dark e tema personalizzato "Paper/Sepia"
// Deriviamo i props direttamente dal componente per evitare dipendenze
// sul tipo ThemeProviderProps (il cui export è cambiato tra le versioni di next-themes)
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

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
