import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AutoThemeMount } from "@/components/auto-theme-mount";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "BookDex — Your personal book tracker",
    template: "%s | BookDex",
  },
  description:
    "Scan, catalogue, and track your books. Mobile-first PWA with ISBN scanner, smart lists, ratings and three visual themes.",
  manifest: "/manifest.webmanifest",
  applicationName: "BookDex",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BookDex" },
  keywords: ["books", "reading", "ISBN", "scanner", "personal library", "PWA"],
  authors: [{ name: "Forenaki" }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider>
          <AutoThemeMount />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
