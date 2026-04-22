"use client";
import { motion } from "framer-motion";

interface Props {
  data: { label: string; value: number }[];
  max?: number;
  accentClass?: string;
}

// Grafico a barre verticale SVG-free, dipende solo da Tailwind e Framer Motion
export function BarChart({ data, max, accentClass = "bg-primary" }: Props) {
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => {
        const pct = (d.value / top) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="relative w-full h-full flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
                className={`w-full rounded-t-md ${accentClass} relative group`}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.value}
                </span>
              </motion.div>
            </div>
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
