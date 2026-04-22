"use client";
import { motion } from "framer-motion";
import { ScanLine, BookPlus, BookOpen } from "lucide-react";

const steps = [
  {
    icon: ScanLine,
    title: "Scansiona o cerca",
    description:
      "Usa la fotocamera per leggere l'ISBN o digita il titolo. Google Books fa il resto.",
  },
  {
    icon: BookPlus,
    title: "Aggiungi a una lista",
    description:
      'Scegli con un tap: "Da Leggere", "In Lettura" oppure "Letti". Sposta quando vuoi.',
  },
  {
    icon: BookOpen,
    title: "Traccia e valuta",
    description:
      "Aggiorna il progresso di lettura e, a fine libro, assegna le tue stelle.",
  },
];

// Sezione "come funziona" con connecting line animata
export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30 border-y border-border/60">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            In 3 step
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Dal libro fisico alla libreria digitale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Linea di connessione (solo desktop) */}
          <div
            className="hidden md:block absolute top-[36px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
            aria-hidden
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="relative z-10 mx-auto w-[72px] h-[72px] rounded-2xl bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <s.icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
