import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Book, BookStatus, SavedBook } from "@/lib/types";

interface BooksState {
  books: Record<string, SavedBook>;
  hydrated: boolean;
  // Azioni
  addBook: (book: Book, status: BookStatus) => void;
  moveBook: (id: string, status: BookStatus) => void;
  removeBook: (id: string) => void;
  rateBook: (id: string, rating: number) => void;
  setProgress: (id: string, progress: number) => void;
  setNotes: (id: string, notes: string) => void;
  setTags: (id: string, tags: string[]) => void;
  importBooks: (items: SavedBook[]) => { added: number; skipped: number };
  setHydrated: (v: boolean) => void;
  // Selettori utili
  getByStatus: (status: BookStatus) => SavedBook[];
  getByTag: (tag: string) => SavedBook[];
  getAllTags: () => string[];
  has: (id: string) => boolean;
  getById: (id: string) => SavedBook | undefined;
}

export const useBooksStore = create<BooksState>()(
  persist(
    (set, get) => ({
      books: {},
      hydrated: false,

      // Aggiunge un libro a una delle tre liste (mantiene rating e progress se già presenti).
      // Traccia startedAt/finishedAt per statistiche.
      addBook: (book, status) =>
        set((state) => {
          const now = Date.now();
          const existing = state.books[book.id];
          const next: SavedBook = {
            ...book,
            ...existing,
            status,
            addedAt: existing?.addedAt ?? now,
            updatedAt: now,
          };
          // Timestamp ciclo di vita
          if (status === "reading" && !existing?.startedAt) next.startedAt = now;
          if (status === "read" && !existing?.finishedAt) next.finishedAt = now;
          return { books: { ...state.books, [book.id]: next } };
        }),

      // Sposta un libro tra le liste
      moveBook: (id, status) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const now = Date.now();
          const next: SavedBook = { ...book, status, updatedAt: now };
          if (status === "reading" && !book.startedAt) next.startedAt = now;
          if (status === "read" && !book.finishedAt) next.finishedAt = now;
          return { books: { ...state.books, [id]: next } };
        }),

      removeBook: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.books;
          return { books: rest };
        }),

      rateBook: (id, rating) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const clamped = Math.max(0, Math.min(5, rating));
          return {
            books: { ...state.books, [id]: { ...book, rating: clamped, updatedAt: Date.now() } },
          };
        }),

      setProgress: (id, progress) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const clamped = Math.max(0, Math.min(100, progress));
          return {
            books: { ...state.books, [id]: { ...book, progress: clamped, updatedAt: Date.now() } },
          };
        }),

      setNotes: (id, notes) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          return {
            books: { ...state.books, [id]: { ...book, notes, updatedAt: Date.now() } },
          };
        }),

      setTags: (id, tags) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const clean = Array.from(
            new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))
          );
          return {
            books: { ...state.books, [id]: { ...book, tags: clean, updatedAt: Date.now() } },
          };
        }),

      // Import batch da sorgente esterna (CSV Goodreads, backup JSON).
      // Non sovrascrive libri già presenti: restituisce conteggi.
      importBooks: (items) => {
        let added = 0;
        let skipped = 0;
        set((state) => {
          const next = { ...state.books };
          for (const item of items) {
            if (next[item.id]) {
              skipped++;
              continue;
            }
            next[item.id] = item;
            added++;
          }
          return { books: next };
        });
        return { added, skipped };
      },

      setHydrated: (v) => set({ hydrated: v }),

      getByStatus: (status) =>
        Object.values(get().books)
          .filter((b) => b.status === status)
          .sort((a, b) => b.updatedAt - a.updatedAt),

      getByTag: (tag) =>
        Object.values(get().books)
          .filter((b) => b.tags?.includes(tag.toLowerCase()))
          .sort((a, b) => b.updatedAt - a.updatedAt),

      getAllTags: () => {
        const set = new Set<string>();
        Object.values(get().books).forEach((b) => b.tags?.forEach((t) => set.add(t)));
        return Array.from(set).sort();
      },

      has: (id) => Boolean(get().books[id]),
      getById: (id) => get().books[id],
    }),
    {
      name: "bookdex-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2, // bump: aggiunti tags, startedAt, finishedAt
      migrate: (persistedState: unknown, fromVersion) => {
        // Migrazione v1 → v2: nessuna modifica distruttiva, i nuovi campi sono opzionali
        if (fromVersion < 2) return persistedState as BooksState;
        return persistedState as BooksState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
