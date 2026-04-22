"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Bookmark, CheckCheck, Library, Plus, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookListItem } from "@/components/books/book-list-item";
import { BookDetailDialog } from "@/components/books/book-detail-dialog";
import { useBooksStore } from "@/store/books-store";
import type { BookStatus, SavedBook } from "@/lib/types";

const TABS: { value: BookStatus; label: string; icon: typeof BookOpen; emptyMessage: string }[] = [
  {
    value: "reading",
    label: "In Lettura",
    icon: BookOpen,
    emptyMessage: "Nessun libro in lettura al momento. Inizia un nuovo viaggio!",
  },
  {
    value: "to-read",
    label: "Da Leggere",
    icon: Bookmark,
    emptyMessage: "La tua wishlist è vuota. Scopri il prossimo libro da divorare.",
  },
  {
    value: "read",
    label: "Letti",
    icon: CheckCheck,
    emptyMessage: "Nessun libro completato ancora. Il tuo primo traguardo ti aspetta.",
  },
];

// Dashboard principale con le tre liste
export default function DashboardPage() {
  const books = useBooksStore((s) => s.books);
  const hydrated = useBooksStore((s) => s.hydrated);
  const [selected, setSelected] = useState<SavedBook | null>(null);

  const stats = useMemo(() => {
    const all = Object.values(books);
    return {
      total: all.length,
      reading: all.filter((b) => b.status === "reading").length,
      toRead: all.filter((b) => b.status === "to-read").length,
      read: all.filter((b) => b.status === "read").length,
    };
  }, [books]);

  const getByStatus = (status: BookStatus) =>
    Object.values(books)
      .filter((b) => b.status === status)
      .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="space-y-6">
      {/* Header + stats */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Library className="w-7 h-7 text-primary" />
            La mia Libreria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total === 0
              ? "Inizia a costruire la tua collezione."
              : `${stats.total} ${stats.total === 1 ? "libro" : "libri"} in collezione`}
          </p>
        </div>
        <Button asChild size="sm" className="shadow-md">
          <Link href="/app/search">
            <Plus className="w-4 h-4 mr-1" /> Aggiungi
          </Link>
        </Button>
      </div>

      {/* Mini statistiche */}
      {hydrated && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          <StatCard icon={BookOpen} label="In Lettura" value={stats.reading} accent="text-blue-500" />
          <StatCard icon={Bookmark} label="Da Leggere" value={stats.toRead} accent="text-amber-500" />
          <StatCard icon={CheckCheck} label="Completati" value={stats.read} accent="text-emerald-500" />
        </motion.div>
      )}

      <Tabs defaultValue="reading" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-11">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => {
          const items = hydrated ? getByStatus(t.value) : [];
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6 space-y-2.5">
              {!hydrated ? (
                <div className="text-center py-12 text-sm text-muted-foreground">Caricamento…</div>
              ) : items.length === 0 ? (
                <EmptyState message={t.emptyMessage} />
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((book, i) => (
                    <BookListItem
                      key={book.id}
                      book={book}
                      index={i}
                      onClick={() => setSelected(book)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <BookDetailDialog
        book={selected}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${accent}`} />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums mt-1">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-muted/30"
    >
      <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground max-w-xs mx-auto text-balance">{message}</p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/app/search">
          <Plus className="w-4 h-4 mr-1" /> Cerca un libro
        </Link>
      </Button>
    </motion.div>
  );
}
