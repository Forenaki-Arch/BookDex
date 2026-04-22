"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookMarked, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hero della landing page con animazioni scenografiche
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Sfondo animato a gradiente */}
      <div className="absolute inset-0 animated-gradient" aria-hidden />
      <div className="absolute inset-0 bg-gradient-mesh" aria-hidden />

      {/* Bollicine decorative fluttuanti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-3xl"
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container max-w-6xl relative py-20 sm:py-28 lg:py-36 text-center">
        {/* Badge in alto */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-md px-4 py-1.5 text-xs font-medium shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>v1.0 — Ora disponibile come PWA</span>
        </motion.div>

        {/* Titolo principale */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
        >
          La tua libreria,{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              reinventata
            </span>
            <motion.span
              className="absolute -right-6 -top-2"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400/30" />
            </motion.span>
          </span>
        </motion.h1>

        {/* Sottotitolo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground text-balance font-serif"
        >
          Scansiona ISBN, cataloga titoli, traccia il tuo progresso di lettura.
          Un&apos;esperienza mobile-first, offline-first, con un design che ami guardare.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="group h-12 px-8 shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all">
            <Link href="/app">
              <BookMarked className="w-5 h-5 mr-2 transition-transform group-hover:-rotate-12" />
              Apri BookDex
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-background/60 backdrop-blur-md">
            <Link href="/app/search?scan=1">
              <ScanLine className="w-5 h-5 mr-2" />
              Scansiona subito
            </Link>
          </Button>
        </motion.div>

        {/* Mockup animato (preview card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="mt-16 mx-auto max-w-md relative"
        >
          <div className="relative aspect-[9/16] rounded-[2rem] bg-card border-8 border-foreground/90 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute top-0 inset-x-0 h-6 bg-foreground/90 flex justify-center items-end pb-1">
              <div className="w-16 h-1 rounded-full bg-background/40" />
            </div>
            <div className="pt-10 px-5 pb-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-5 h-5 text-primary" />
                <span className="font-bold">BookDex</span>
              </div>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.2 }}
                  className="flex gap-3 p-3 rounded-xl bg-background/80 backdrop-blur mb-2 border border-border/40"
                >
                  <div className="w-10 h-14 rounded bg-gradient-to-br from-primary/60 to-accent/40 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 rounded bg-foreground/70 w-3/4" />
                    <div className="h-2 rounded bg-muted-foreground/40 w-1/2" />
                    <div className="h-1.5 rounded-full bg-primary/30 mt-2">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${30 + i * 25}%` }}
                        transition={{ delay: 1.5 + i * 0.2, duration: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
