import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper per combinare classi Tailwind risolvendo i conflitti
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatta un prezzo secondo la valuta
export function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

// Tronca un testo (usato per descrizioni lunghe)
export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

// Rimuove tag HTML da una stringa (Google Books a volte restituisce HTML)
export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}
