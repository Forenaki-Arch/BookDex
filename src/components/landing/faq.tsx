"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "BookDex è gratuito?",
    a: "Sì, completamente. BookDex è un progetto open source, senza account, senza pubblicità e senza tracking.",
  },
  {
    q: "Dove vengono salvati i miei libri?",
    a: "I dati vengono salvati localmente sul tuo dispositivo tramite localStorage. Puoi esportarli in JSON dalle Impostazioni per un backup.",
  },
  {
    q: "Lo scanner funziona su ogni dispositivo?",
    a: "Funziona su qualsiasi browser moderno con accesso alla fotocamera. Richiede una connessione HTTPS (o localhost).",
  },
  {
    q: "Posso usarlo offline?",
    a: "Sì. Una volta caricata, l'app funziona offline grazie alla tecnologia PWA. Ovviamente le nuove ricerche necessitano di connessione.",
  },
  {
    q: "Da quale fonte vengono i dati dei libri?",
    a: "BookDex usa le API pubbliche di Google Books per copertina, descrizione, prezzo stimato e altri metadati.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="container max-w-3xl py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Domande frequenti</h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/60 bg-card overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
              aria-expanded={open === i}
            >
              <span className="font-medium">{f.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
