import type { Book } from "@/lib/types";

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
  publisher?: string[];
  subject?: string[];
  language?: string[];
}

function normalize(doc: OpenLibraryDoc): Book {
  const isbn = doc.isbn?.find((i) => i.length === 13) ?? doc.isbn?.[0];
  const thumbnail = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    : undefined;
  return {
    id: isbn ? `isbn:${isbn}` : doc.key.replace("/works/", "ol:"),
    isbn,
    title: doc.title,
    authors: doc.author_name ?? ["Unknown Author"],
    thumbnail,
    pageCount: doc.number_of_pages_median,
    publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
    publisher: doc.publisher?.[0],
    categories: doc.subject?.slice(0, 5),
    language: doc.language?.[0],
  };
}

export async function searchBooks(query: string, signal?: AbortSignal): Promise<Book[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error("Book search error");
  const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
  return (data.docs ?? []).map(normalize);
}

export async function findByIsbn(isbn: string, signal?: AbortSignal): Promise<Book | null> {
  const res = await fetch(`/api/books?isbn=${encodeURIComponent(isbn)}`, { signal });
  if (!res.ok) return null;
  const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
  const first = data.docs?.[0];
  return first ? normalize(first) : null;
}
