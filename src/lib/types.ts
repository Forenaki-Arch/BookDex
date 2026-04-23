// Tipi condivisi dell'applicazione BookDex

export type BookStatus = "to-read" | "reading" | "read";

export interface Book {
  id: string;                               // ID Google Books o ISBN
  isbn?: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
  categories?: string[];
  language?: string;
  averageRating?: number;                   // Voto medio di Google Books
  estimatedPrice?: { amount: number; currency: string };
}

export interface SavedBook extends Book {
  status: BookStatus;
  rating?: number;                          // 1-5, valido solo per "read"
  progress?: number;                        // 0-100 per "reading"
  notes?: string;                           // note libere dell'utente
  tags?: string[];                          // collezioni personalizzate (es. "fantasy", "regalo")
  startedAt?: number;                       // timestamp inizio lettura
  finishedAt?: number;                      // timestamp completamento
  addedAt: number;                          // timestamp
  updatedAt: number;
}

export interface BookStatusConfig {
  value: BookStatus;
  label: string;
  emptyMessage: string;
}

export const STATUS_LABELS: Record<BookStatus, string> = {
  "to-read": "To Read",
  reading: "Reading",
  read: "Read",
};
