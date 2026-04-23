"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is BookDex free?",
    a: "Yes, completely. BookDex is an open-source project with no account, no ads, and no tracking.",
  },
  {
    q: "Where are my books saved?",
    a: "Data is saved locally on your device via localStorage. You can export it as JSON from Settings for a backup.",
  },
  {
    q: "Does the scanner work on every device?",
    a: "It works on any modern browser with camera access. HTTPS (or localhost) is required.",
  },
  {
    q: "Can I use it offline?",
    a: "Yes. Once loaded, the app works offline thanks to PWA technology. New searches still need a connection.",
  },
  {
    q: "Where does the book data come from?",
    a: "BookDex uses the Google Books public API for covers, descriptions, estimated prices, and other metadata.",
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
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked questions</h2>
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
