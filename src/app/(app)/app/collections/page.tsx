"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Hash, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookListItem } from "@/components/books/book-list-item";
import { BookDetailDialog } from "@/components/books/book-detail-dialog";
import { useBooksStore } from "@/store/books-store";
import type { SavedBook } from "@/lib/types";

// Pagina Collezioni: raggruppa i libri per tag custom
export default function CollectionsPage() {
  const books = useBooksStore((s) => s.books);
  const hydrated = useBooksStore((s) => s.hydrated);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<SavedBook | null>(null);

  const { tags, untagged } = useMemo(() => {
    const map = new Map<string, number>();
    let noTagCount = 0;
    for (const b of Object.values(books)) {
      if (!b.tags || b.tags.length === 0) {
        noTagCount++;
        continue;
      }
      for (const t of b.tags) map.set(t, (map.get(t) ?? 0) + 1);
    }
    return {
      tags: Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      untagged: noTagCount,
    };
  }, [books]);

  const booksInActive = useMemo(() => {
    if (!activeTag) return [];
    return Object.values(books)
      .filter((b) => b.tags?.includes(activeTag))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [books, activeTag]);

  if (!hydrated) {
    return <div className="text-sm text-muted-foreground">Caricamento…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Folder className="w-7 h-7 text-primary" />
          Collezioni
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organizza i tuoi libri in tag personalizzati. Modificali dalla scheda dettaglio di ciascun libro.
        </p>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <Hash className="w-10 h-10 mx-auto opacity-40 mb-3" />
            <p>Nessuna collezione ancora. Apri un libro e aggiungi un tag dalla scheda dettaglio.</p>
            {untagged > 0 && (
              <p className="mt-2 text-xs">
                {untagged} {untagged === 1 ? "libro non è" : "libri non sono"} in nessuna collezione.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const active = activeTag === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setActiveTag(active ? null : t.name)}
                  className="group"
                >
                  <Badge
                    variant={active ? "default" : "outline"}
                    className="gap-1 px-3 py-1 cursor-pointer transition-transform group-hover:scale-105"
                  >
                    <Hash className="w-3 h-3" />
                    {t.name}
                    <span className="ml-1 text-[10px] opacity-70">{t.count}</span>
                  </Badge>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTag && (
              <motion.div
                key={activeTag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2.5"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  #{activeTag} · {booksInActive.length}{" "}
                  {booksInActive.length === 1 ? "libro" : "libri"}
                </h2>
                {booksInActive.map((b, i) => (
                  <BookListItem key={b.id} book={b} index={i} onClick={() => setSelected(b)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!activeTag && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Seleziona una collezione qui sopra per vedere i libri.
            </p>
          )}
        </>
      )}

      <BookDetailDialog
        book={selected}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      />
    </div>
  );
}
