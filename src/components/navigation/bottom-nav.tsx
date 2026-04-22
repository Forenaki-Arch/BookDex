"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Libreria", icon: Home },
  { href: "/app/search", label: "Scopri", icon: Search },
  { href: "/app/stats", label: "Stats", icon: BarChart3 },
  { href: "/app/settings", label: "Profilo", icon: Settings },
];

// Bottom navigation stile iOS/Android — mobile only
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden safe-bottom px-3 pb-3">
      <div className="mx-auto max-w-md rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-lg">
        <ul className="flex justify-around px-2 py-2">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
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
      </div>
    </nav>
  );
}
