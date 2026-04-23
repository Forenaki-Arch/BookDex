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
  rating?: number;                          // 1-5, valid only for "read"
  progress?: number;                        // 0-100 percentage for "reading"
  currentPage?: number;                     // absolute page number the reader is on
  notes?: string;                           // free-form personal notes
  tags?: string[];                          // custom collections (e.g. "fantasy", "gift")
  startedAt?: number;                       // timestamp when reading started
  finishedAt?: number;                      // timestamp when finished
  addedAt: number;
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
