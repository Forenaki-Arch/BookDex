"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, Home, Search, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { href: "/app", label: "La mia Libreria", icon: Home },
  { href: "/app/search", label: "Scopri & Scansiona", icon: Search },
  { href: "/app/settings", label: "Impostazioni", icon: Settings },
];

// Sidebar laterale — visibile da md in su
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-card/30 backdrop-blur-sm h-screen sticky top-0">
      <Link href="/" className="p-6 flex items-center gap-2 group">
        <div className="relative">
          <BookMarked className="w-6 h-6 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-6" />
          <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1 opacity-70" />
        </div>
        <span className="text-xl font-bold tracking-tight">BookDex</span>
      </Link>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-pill"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border/60 space-y-2">
        <ThemeToggle />
        <p className="text-[10px] text-muted-foreground text-center">
          BookDex v1.0 · Made with &hearts;
        </p>
      </div>
    </aside>
  );
}
