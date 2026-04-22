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
    title: "Scanner ISBN integrato",
    description:
      "Punta la fotocamera sul codice a barre: il libro viene aggiunto automaticamente alla tua libreria.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Library,
    title: "Tre liste intelligenti",
    description:
      'Organizza la tua collezione in "Da Leggere", "In Lettura" e "Letti" con un tocco.',
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Star,
    title: "Valutazioni e progresso",
    description:
      "Tieni traccia della percentuale di lettura e dai un voto in stelle ai libri completati.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Palette,
    title: "Tre temi premium",
    description:
      "Chiaro, Scuro e un raffinato Sepia/Paper per simulare la lettura su carta.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Smartphone,
    title: "Installabile su mobile",
    description:
      "Aggiungi BookDex alla home del tuo telefono: si apre in standalone, come un'app nativa.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: WifiOff,
    title: "Funziona offline",
    description:
      "I tuoi dati sono salvati localmente. Consulta la tua libreria anche senza connessione.",
    color: "from-sky-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Veloce come un lampo",
    description:
      "Costruita con Next.js App Router, ottimizzata per caricamenti istantanei e transizioni fluide.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "Nessun account, nessun tracking. I tuoi libri restano sul tuo dispositivo.",
    color: "from-slate-500 to-gray-600",
  },
];

// Sezione features con hover 3D e gradient per icone
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
          Funzionalità
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          Tutto ciò che ti serve, niente di superfluo.
        </h2>
        <p className="mt-4 text-muted-foreground text-balance font-serif">
          BookDex combina potenza e semplicità in un&apos;interfaccia pensata per durare.
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
