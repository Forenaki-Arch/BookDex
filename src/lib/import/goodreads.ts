import type { BookStatus, SavedBook } from "@/lib/types";

// Parser CSV minimale, robusto a virgolette e virgole interne.
// Ritorna righe come array di stringhe.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += c;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim().length > 0));
}

// Mappa Goodreads "Exclusive Shelf" sul nostro BookStatus
function mapShelf(shelf: string): BookStatus {
  const s = shelf.toLowerCase().trim();
  if (s === "currently-reading") return "reading";
  if (s === "read") return "read";
  return "to-read";
}

// Estrae un ISBN pulito da un campo Goodreads (può essere ="0123456789" o vuoto)
function cleanIsbn(raw: string): string | undefined {
  if (!raw) return undefined;
  const match = raw.match(/\d+[\dX]?/i);
  return match?.[0];
}

// Converte una riga Goodreads in SavedBook. Ritorna null se manca titolo.
function rowToBook(headers: string[], row: string[]): SavedBook | null {
  const get = (name: string) => {
    const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  const title = get("Title");
  if (!title) return null;

  const isbn13 = cleanIsbn(get("ISBN13"));
  const isbn10 = cleanIsbn(get("ISBN"));
  const isbn = isbn13 ?? isbn10;
  const authors = [get("Author"), get("Additional Authors")]
    .filter(Boolean)
    .flatMap((s) => s.split(",").map((a) => a.trim()))
    .filter(Boolean);
  const rating = Number(get("My Rating")) || undefined;
  const status = mapShelf(get("Exclusive Shelf"));
  const pagesNum = Number(get("Number of Pages"));
  const yearNum = Number(get("Year Published"));
  const publisher = get("Publisher") || undefined;
  const notes = get("My Review") || undefined;
  const bookshelves = get("Bookshelves");
  const tags = bookshelves
    ? bookshelves
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : undefined;

  const id = isbn ? `isbn:${isbn}` : `gr:${get("Book Id") || title}`;
  const now = Date.now();

  return {
    id,
    isbn,
    title,
    authors: authors.length > 0 ? authors : ["Autore sconosciuto"],
    publisher,
    pageCount: pagesNum > 0 ? pagesNum : undefined,
    publishedDate: yearNum > 0 ? String(yearNum) : undefined,
    status,
    rating: rating && rating > 0 ? rating : undefined,
    notes,
    tags,
    addedAt: now,
    updatedAt: now,
    finishedAt: status === "read" ? now : undefined,
  };
}

// Punto di ingresso: parsifica il CSV Goodreads e ritorna i libri importabili.
export function parseGoodreadsCsv(text: string): SavedBook[] {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const [headers, ...dataRows] = rows;
  const books: SavedBook[] = [];
  for (const row of dataRows) {
    const book = rowToBook(headers, row);
    if (book) books.push(book);
  }
  return books;
}
