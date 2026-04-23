"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <nav className="container max-w-6xl flex items-center justify-between h-16">
        <Link href="/about" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: -12, scale: 1.1 }} transition={{ type: "spring" }}>
            <BookMarked className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">BookDex</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-40">
            <ThemeToggle variant="ghost" />
          </div>
          <Button asChild size="sm" className="shadow-md">
            <Link href="/app">Open App</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2"
        >
          <a href="#features" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">
            Features
          </a>
          <a href="#how" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">
            How it works
          </a>
          <a href="#faq" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">
            FAQ
          </a>
          <div className="pt-2">
            <ThemeToggle />
          </div>
          <Button asChild className="w-full">
            <Link href="/app">Open App</Link>
          </Button>
        </motion.div>
      )}
    </header>
  );
}
