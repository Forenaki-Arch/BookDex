import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "BookDex — Il tuo tracker personale di libri",
    template: "%s | BookDex",
  },
  description:
    "Scansiona, cataloga e tieni traccia dei tuoi libri. Mobile-first PWA con scanner ISBN, liste personalizzate, valutazioni e tre temi visivi.",
  manifest: "/manifest.webmanifest",
  applicationName: "BookDex",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BookDex" },
  keywords: ["libri", "lettura", "ISBN", "scanner", "libreria personale", "PWA"],
  authors: [{ name: "BookDex" }],
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
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
