"use client";
import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Bookmark, CheckCheck, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/books/rating-stars";
import { useBooksStore } from "@/store/books-store";
import type { Book, BookStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { formatPrice, truncate } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  book: Book | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// Dialog di dettaglio libro con azioni di aggiunta/rimozione/voto
export function BookDetailDialog({ book, open, onOpenChange }: Props) {
  const addBook = useBooksStore((s) => s.addBook);
  const removeBook = useBooksStore((s) => s.removeBook);
  const rateBook = useBooksStore((s) => s.rateBook);
  const saved = useBooksStore((s) => (book ? s.books[book.id] : undefined));

  const shortDescription = useMemo(
    () => (book?.description ? truncate(book.description, 600) : ""),
    [book?.description]
  );

  if (!book) return null;

  const handleAdd = (status: BookStatus) => {
    addBook(book, status);
    toast.success(`Aggiunto a "${STATUS_LABELS[status]}"`, {
      description: book.title,
    });
  };

  const handleRemove = () => {
    removeBook(book.id);
    toast.info("Libro rimosso dalle tue liste");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative flex-shrink-0">
          {/* Sfondo sfocato con cover */}
          {book.thumbnail && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-125"
              style={{ backgroundImage: `url(${book.thumbnail})` }}
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="relative p-6 flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="shrink-0"
            >
              {book.thumbnail ? (
                <Image
                  src={book.thumbnail}
                  alt={book.title}
                  width={120}
                  height={180}
                  className="rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-[120px] h-[180px] bg-muted rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <DialogHeader>
                <DialogTitle className="text-xl leading-tight text-left">{book.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mt-1">{book.authors.join(", ")}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {book.publishedDate && (
                  <Badge variant="secondary">{book.publishedDate.slice(0, 4)}</Badge>
                )}
                {book.pageCount && <Badge variant="secondary">{book.pageCount} pag.</Badge>}
                {book.language && (
                  <Badge variant="secondary" className="uppercase">
                    {book.language}
                  </Badge>
                )}
                {book.estimatedPrice && (
                  <Badge variant="outline">
                    {formatPrice(book.estimatedPrice.amount, book.estimatedPrice.currency)}
                  </Badge>
                )}
              </div>
              {saved?.status === "read" && (
                <div className="mt-3">
                  <RatingStars
                    value={saved.rating ?? 0}
                    onChange={(r) => {
                      rateBook(book.id, r);
                      toast.success(`Valutazione: ${r}/5`);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 overflow-y-auto flex-1">
          {shortDescription ? (
            <p className="text-sm text-muted-foreground leading-relaxed font-serif">
              {shortDescription}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nessuna descrizione disponibile.</p>
          )}
          {book.categories && book.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {book.categories.map((c) => (
                <Badge key={c} variant="outline" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Azioni rapide: aggiungi alle tre liste */}
        <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm grid grid-cols-3 gap-2 flex-shrink-0">
          <Button
            variant={saved?.status === "to-read" ? "default" : "outline"}
            onClick={() => handleAdd("to-read")}
            className="flex-col h-auto py-3"
          >
            <Bookmark className="w-4 h-4 mb-1" />
            <span className="text-xs">Da Leggere</span>
          </Button>
          <Button
            variant={saved?.status === "reading" ? "default" : "outline"}
            onClick={() => handleAdd("reading")}
            className="flex-col h-auto py-3"
          >
            <BookOpen className="w-4 h-4 mb-1" />
            <span className="text-xs">In Lettura</span>
          </Button>
          <Button
            variant={saved?.status === "read" ? "default" : "outline"}
            onClick={() => handleAdd("read")}
            className="flex-col h-auto py-3"
          >
            <CheckCheck className="w-4 h-4 mb-1" />
            <span className="text-xs">Letti</span>
          </Button>
        </div>
        {saved && (
          <div className="px-4 pb-4 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleRemove} className="w-full text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Rimuovi dalla libreria
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
