"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Library, Star, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/stats/bar-chart";
import { useBooksStore } from "@/store/books-store";
import type { SavedBook } from "@/lib/types";

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

// Pagina statistiche della libreria
export default function StatsPage() {
  const books = useBooksStore((s) => s.books);
  const hydrated = useBooksStore((s) => s.hydrated);

  const data = useMemo(() => computeStats(Object.values(books)), [books]);

  if (!hydrated) {
    return <div className="text-sm text-muted-foreground">Caricamento…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          Statistiche
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Un colpo d&apos;occhio sulle tue abitudini di lettura.
        </p>
      </div>

      {data.totalBooks === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Aggiungi qualche libro alla libreria per vedere le tue statistiche.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatCard icon={Library} label="Libri totali" value={data.totalBooks} />
          <StatCard icon={BookOpen} label="Letti" value={data.readCount} />
          <StatCard icon={TrendingUp} label="Pagine lette" value={data.totalPagesRead} />
          <StatCard
            icon={Star}
            label="Voto medio"
            value={data.avgRating ? `${data.avgRating.toFixed(1)} / 5` : "—"}
          />
          <StatCard icon={User} label="Autori unici" value={data.uniqueAuthors} />
          <StatCard icon={Library} label="Collezioni" value={data.uniqueTags} />
        </motion.div>
      )}

      {data.totalBooks > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Libri completati per anno</CardTitle>
            </CardHeader>
            <CardContent>
              {data.perYear.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nessun libro marcato come completato ancora.
                </p>
              ) : (
                <BarChart data={data.perYear} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Completati per mese · {new Date().getFullYear()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={data.perMonth} accentClass="bg-emerald-500" />
            </CardContent>
          </Card>

          {data.topAuthors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top autori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.topAuthors.map((a, i) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium truncate">{a.name}</span>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {a.count} {a.count === 1 ? "libro" : "libri"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {data.topTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Collezioni più popolate</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.topTags.map((t) => (
                  <Badge key={t.name} variant="outline" className="text-xs">
                    #{t.name} · {t.count}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Library;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums mt-1">{value}</p>
    </div>
  );
}

function computeStats(books: SavedBook[]) {
  const totalBooks = books.length;
  const readBooks = books.filter((b) => b.status === "read");
  const readCount = readBooks.length;
  const totalPagesRead = readBooks.reduce((acc, b) => acc + (b.pageCount ?? 0), 0);

  const rated = readBooks.filter((b) => typeof b.rating === "number" && b.rating > 0);
  const avgRating =
    rated.length > 0 ? rated.reduce((a, b) => a + (b.rating ?? 0), 0) / rated.length : 0;

  // Anni
  const years = new Map<number, number>();
  for (const b of readBooks) {
    const ts = b.finishedAt ?? b.updatedAt;
    const y = new Date(ts).getFullYear();
    years.set(y, (years.get(y) ?? 0) + 1);
  }
  const perYear = Array.from(years.entries())
    .sort(([a], [b]) => a - b)
    .map(([y, v]) => ({ label: String(y), value: v }));

  // Mesi (anno corrente)
  const currentYear = new Date().getFullYear();
  const monthsArr = new Array(12).fill(0);
  for (const b of readBooks) {
    const ts = b.finishedAt ?? b.updatedAt;
    const d = new Date(ts);
    if (d.getFullYear() === currentYear) monthsArr[d.getMonth()]++;
  }
  const perMonth = MONTHS.map((m, i) => ({ label: m, value: monthsArr[i] }));

  // Top autori
  const authors = new Map<string, number>();
  for (const b of books) {
    for (const a of b.authors) authors.set(a, (authors.get(a) ?? 0) + 1);
  }
  const topAuthors = Array.from(authors.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top tag
  const tags = new Map<string, number>();
  for (const b of books) {
    for (const t of b.tags ?? []) tags.set(t, (tags.get(t) ?? 0) + 1);
  }
  const topTags = Array.from(tags.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalBooks,
    readCount,
    totalPagesRead,
    avgRating,
    uniqueAuthors: authors.size,
    uniqueTags: tags.size,
    perYear,
    perMonth,
    topAuthors,
    topTags,
  };
}
