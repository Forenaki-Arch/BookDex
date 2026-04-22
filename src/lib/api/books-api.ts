import type { Book } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

// Wrapper sulle API di Google Books (via proxy server-side /api/books)

interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
    language?: string;
    averageRating?: number;
  };
  saleInfo?: {
    listPrice?: { amount: number; currencyCode: string };
    retailPrice?: { amount: number; currencyCode: string };
  };
}

// Normalizza un item Google Books nel nostro tipo Book
function normalize(item: GoogleBooksItem): Book {
  const v = item.volumeInfo;
  const isbn = v.industryIdentifiers?.find(
    (i) => i.type === "ISBN_13" || i.type === "ISBN_10"
  )?.identifier;
  // Forza https per le cover (Google spesso restituisce http)
  const thumbnail = v.imageLinks?.thumbnail?.replace("http://", "https://");
  const price = item.saleInfo?.retailPrice ?? item.saleInfo?.listPrice;
  const title = v.subtitle ? `${v.title}: ${v.subtitle}` : v.title;
  return {
    id: item.id,
    isbn,
    title,
    authors: v.authors ?? ["Autore sconosciuto"],
    description: v.description ? stripHtml(v.description) : undefined,
    thumbnail,
    pageCount: v.pageCount,
    publishedDate: v.publishedDate,
    publisher: v.publisher,
    categories: v.categories,
    language: v.language,
    averageRating: v.averageRating,
    estimatedPrice: price
      ? { amount: price.amount, currency: price.currencyCode }
      : undefined,
  };
}

// Cerca libri per query testuale
export async function searchBooks(query: string, signal?: AbortSignal): Promise<Book[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error("Errore nella ricerca libri");
  const data = (await res.json()) as { items?: GoogleBooksItem[] };
  return (data.items ?? []).map(normalize);
}

// Cerca un libro specifico tramite ISBN
export async function findByIsbn(isbn: string, signal?: AbortSignal): Promise<Book | null> {
  const res = await fetch(`/api/books?isbn=${encodeURIComponent(isbn)}`, { signal });
  if (!res.ok) return null;
  const data = (await res.json()) as { items?: GoogleBooksItem[] };
  const first = data.items?.[0];
  return first ? normalize(first) : null;
}
