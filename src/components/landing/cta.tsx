"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="container max-w-6xl py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15 }}
        >
          <BookMarked className="w-14 h-14 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Start tracking your next read.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto font-serif text-balance">
            Free, private, fast. No account required.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-8 h-12 px-8 group hover:scale-105 transition-transform shadow-xl"
          >
            <Link href="/app">
              Open your library
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
