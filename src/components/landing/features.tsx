"use client";
import { motion } from "framer-motion";
import {
  ScanLine,
  Library,
  Palette,
  Smartphone,
  WifiOff,
  Star,
  Zap,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "Built-in ISBN scanner",
    description:
      "Point your camera at the barcode — the book is automatically added to your library.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Library,
    title: "Three smart lists",
    description:
      'Organise your collection into "To Read", "Reading" and "Read" with a single tap.',
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Star,
    title: "Ratings & progress",
    description:
      "Track your reading percentage and rate completed books with stars.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Palette,
    title: "Three premium themes",
    description:
      "Light, Dark, and a refined Sepia/Paper mode that simulates reading on paper.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Smartphone,
    title: "Installable on mobile",
    description:
      "Add BookDex to your home screen — it opens standalone, just like a native app.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    description:
      "Your data is saved locally. Browse your library even without a connection.",
    color: "from-sky-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Built with Next.js App Router, optimised for instant loads and smooth transitions.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "No account, no tracking. Your books stay on your device.",
    color: "from-slate-500 to-gray-600",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28 container max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Features
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          Everything you need, nothing you don&apos;t.
        </h2>
        <p className="mt-4 text-muted-foreground text-balance font-serif">
          BookDex blends power and simplicity into an interface built to last.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 glow-on-hover"
          >
            <div
              className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
            >
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="relative z-10 mt-4 font-semibold">{f.title}</h3>
            <p className="relative z-10 mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
