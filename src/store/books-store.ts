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
  setHydrated: (v: boolean) => void;
  // Selettori utili
  getByStatus: (status: BookStatus) => SavedBook[];
  has: (id: string) => boolean;
  getById: (id: string) => SavedBook | undefined;
}

export const useBooksStore = create<BooksState>()(
  persist(
    (set, get) => ({
      books: {},
      hydrated: false,

      // Aggiunge un libro a una delle tre liste (mantiene rating e progress se già presenti)
      addBook: (book, status) =>
        set((state) => {
          const now = Date.now();
          const existing = state.books[book.id];
          return {
            books: {
              ...state.books,
              [book.id]: {
                ...book,
                ...existing,
                status,
                addedAt: existing?.addedAt ?? now,
                updatedAt: now,
              },
            },
          };
        }),

      // Sposta un libro tra le liste
      moveBook: (id, status) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          return {
            books: { ...state.books, [id]: { ...book, status, updatedAt: Date.now() } },
          };
        }),

      // Rimuove definitivamente un libro
      removeBook: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.books;
          return { books: rest };
        }),

      // Assegna un voto (1-5)
      rateBook: (id, rating) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const clamped = Math.max(0, Math.min(5, rating));
          return {
            books: { ...state.books, [id]: { ...book, rating: clamped, updatedAt: Date.now() } },
          };
        }),

      // Imposta la percentuale di lettura (0-100)
      setProgress: (id, progress) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          const clamped = Math.max(0, Math.min(100, progress));
          return {
            books: { ...state.books, [id]: { ...book, progress: clamped, updatedAt: Date.now() } },
          };
        }),

      // Salva note personali
      setNotes: (id, notes) =>
        set((state) => {
          const book = state.books[id];
          if (!book) return state;
          return {
            books: { ...state.books, [id]: { ...book, notes, updatedAt: Date.now() } },
          };
        }),

      setHydrated: (v) => set({ hydrated: v }),

      getByStatus: (status) =>
        Object.values(get().books)
          .filter((b) => b.status === status)
          .sort((a, b) => b.updatedAt - a.updatedAt),

      has: (id) => Boolean(get().books[id]),
      getById: (id) => get().books[id],
    }),
    {
      name: "bookdex-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
