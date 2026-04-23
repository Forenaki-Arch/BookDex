import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper per combinare classi Tailwind risolvendo i conflitti
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatta un prezzo secondo la valuta
export function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
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

// Valida un URL http/https prima di iniettarlo in CSS (previene CSS injection)
// Ritorna undefined se l'URL non è http(s) o se il parsing fallisce.
export function safeImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
    // Rimuoviamo caratteri che potrebbero chiudere la funzione url() in CSS
    if (/["'()\\]/.test(url)) return undefined;
    return url;
  } catch {
    return undefined;
  }
}
