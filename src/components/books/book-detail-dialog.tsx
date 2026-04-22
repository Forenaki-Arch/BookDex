"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Bookmark, CheckCheck, Hash, NotebookPen, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/books/rating-stars";
import { useBooksStore } from "@/store/books-store";
import type { Book, BookStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { formatPrice, safeImageUrl, truncate } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  book: Book | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// Dialog di dettaglio libro con azioni, note personali e collezioni (tag)
export function BookDetailDialog({ book, open, onOpenChange }: Props) {
  const addBook = useBooksStore((s) => s.addBook);
  const removeBook = useBooksStore((s) => s.removeBook);
  const rateBook = useBooksStore((s) => s.rateBook);
  const setNotes = useBooksStore((s) => s.setNotes);
  const setTags = useBooksStore((s) => s.setTags);
  const saved = useBooksStore((s) => (book ? s.books[book.id] : undefined));

  const [notesDraft, setNotesDraft] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Sincronizza la bozza note con il libro selezionato
  useEffect(() => {
    setNotesDraft(saved?.notes ?? "");
  }, [saved?.id, saved?.notes]);

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

  const handleSaveNotes = () => {
    if (!saved) return;
    setNotes(book.id, notesDraft);
    toast.success("Note salvate");
  };

  const handleAddTag = () => {
    if (!saved) return;
    const t = tagInput.trim().toLowerCase();
    if (!t) return;
    const existing = saved.tags ?? [];
    if (existing.includes(t)) {
      setTagInput("");
      return;
    }
    setTags(book.id, [...existing, t]);
    setTagInput("");
  };

  const handleRemoveTag = (t: string) => {
    if (!saved) return;
    setTags(
      book.id,
      (saved.tags ?? []).filter((x) => x !== t)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative flex-shrink-0">
          {/* Sfondo sfocato con cover — URL validato per prevenire CSS injection */}
          {safeImageUrl(book.thumbnail) && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-125"
              style={{ backgroundImage: `url("${safeImageUrl(book.thumbnail)}")` }}
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

        <div className="px-6 pb-4 overflow-y-auto flex-1 space-y-4">
          {shortDescription ? (
            <p className="text-sm text-muted-foreground leading-relaxed font-serif">
              {shortDescription}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nessuna descrizione disponibile.</p>
          )}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.map((c) => (
                <Badge key={c} variant="outline" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          )}

          {/* Collezioni e note sono disponibili solo per libri già in libreria */}
          {saved && (
            <>
              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Hash className="w-3.5 h-3.5" /> Collezioni
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(saved.tags ?? []).map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1 pr-1">
                      #{t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="ml-0.5 rounded hover:bg-background/60 p-0.5"
                        aria-label={`Rimuovi ${t}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nuova collezione..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddTag} className="h-8">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <NotebookPen className="w-3.5 h-3.5" /> Note personali
                </div>
                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Appunta qui le tue impressioni, citazioni preferite..."
                  className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveNotes}
                    disabled={notesDraft === (saved.notes ?? "")}
                    className="h-8 text-xs"
                  >
                    Salva note
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

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
