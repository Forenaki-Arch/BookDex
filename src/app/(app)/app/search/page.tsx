"use client";
import { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ScanLine, Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/scanner/barcode-scanner";
import { BookDetailDialog } from "@/components/books/book-detail-dialog";
import { BookCover } from "@/components/books/book-cover";
import { searchBooks, findByIsbn } from "@/lib/api/books-api";
import type { Book } from "@/lib/types";
import { toast } from "sonner";

// Pagina di ricerca + scanner
function SearchInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, startTransition] = useTransition();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Shortcut PWA: /app/search?scan=1 apre direttamente lo scanner
  useEffect(() => {
    if (params.get("scan") === "1") setScannerOpen(true);
  }, [params]);

  // Ricerca debounced (400ms), annullata su nuovi tasti
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const books = await searchBooks(query, controller.signal);
          setResults(books);
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            toast.error("Ricerca fallita", { description: "Riprova tra poco." });
          }
        }
      });
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleIsbn = async (isbn: string) => {
    setScannerOpen(false);
    toast.loading("Cerco il libro...", { id: "isbn-search" });
    try {
      const book = await findByIsbn(isbn);
      toast.dismiss("isbn-search");
      if (book) {
        setSelectedBook(book);
      } else {
        toast.error("Libro non trovato", {
          description: `L'ISBN ${isbn} non è presente nel database.`,
        });
      }
    } catch {
      toast.dismiss("isbn-search");
      toast.error("Errore di rete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scopri</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cerca per titolo, autore o scansiona il codice ISBN.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un libro, un autore, un ISBN..."
            className="pl-9 pr-9 h-12"
            aria-label="Campo di ricerca libri"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Pulisci ricerca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          size="lg"
          onClick={() => setScannerOpen(true)}
          className="h-12 px-4 shadow-md hover:shadow-lg"
          aria-label="Apri scanner ISBN"
        >
          <ScanLine className="w-5 h-5" />
        </Button>
      </div>

      {/* Suggerimenti quando la ricerca è vuota */}
      {!loading && query.length < 3 && results.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SuggestionCard
            icon={SearchIcon}
            title="Cerca per testo"
            description="Digita almeno 3 caratteri: titolo, autore, editore..."
          />
          <SuggestionCard
            icon={ScanLine}
            title="Scansiona ISBN"
            description="Usa la fotocamera per leggere il codice a barre di un libro."
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}

        {!loading &&
          results.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              onClick={() => setSelectedBook(book)}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              <BookCover src={book.thumbnail} alt={book.title} />
              <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.authors.join(", ")}
              </p>
            </motion.button>
          ))}

        {!loading && query.length >= 3 && results.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-12">
            Nessun risultato per &quot;{query}&quot;.
          </p>
        )}
      </div>

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          {scannerOpen && (
            <BarcodeScanner onScan={handleIsbn} onClose={() => setScannerOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <BookDetailDialog
        book={selectedBook}
        open={!!selectedBook}
        onOpenChange={(v) => !v && setSelectedBook(null)}
      />
    </div>
  );
}

function SuggestionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof SearchIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-default">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Caricamento…</div>}>
      <SearchInner />
    </Suspense>
  );
}
