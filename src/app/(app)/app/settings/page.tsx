"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  Download,
  FileUp,
  Github,
  Heart,
  Info,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBooksStore } from "@/store/books-store";
import { parseGoodreadsCsv } from "@/lib/import/goodreads";
import type { SavedBook } from "@/lib/types";
import {
  DEFAULT_SCHEDULE,
  loadSchedule,
  saveSchedule,
  type AutoThemeConfig,
} from "@/hooks/use-auto-theme";
import { toast } from "sonner";
import Link from "next/link";
import { BookMarked } from "lucide-react";

export default function SettingsPage() {
  const books = useBooksStore((s) => s.books);
  const importBooks = useBooksStore((s) => s.importBooks);
  const fileRef = useRef<HTMLInputElement>(null);
  const total = useMemo(() => Object.keys(books).length, [books]);

  const [schedule, setSchedule] = useState<AutoThemeConfig>(DEFAULT_SCHEDULE);
  useEffect(() => {
    setSchedule(loadSchedule());
  }, []);

  const updateSchedule = (patch: Partial<AutoThemeConfig>) => {
    const next = { ...schedule, ...patch };
    setSchedule(next);
    saveSchedule(next);
    window.dispatchEvent(new Event("bookdex-auto-theme"));
  };

  const handleExport = () => {
    try {
      const data = JSON.stringify({ version: 2, exportedAt: Date.now(), books }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookdex-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded!");
    } catch {
      toast.error("Export error");
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      let items: SavedBook[] = [];
      if (file.name.toLowerCase().endsWith(".json")) {
        const parsed = JSON.parse(text);
        items = Object.values(parsed.books ?? {}) as SavedBook[];
      } else {
        items = parseGoodreadsCsv(text);
      }
      if (items.length === 0) {
        toast.error("No books found in the file");
        return;
      }
      const { added, skipped } = importBooks(items);
      toast.success(`Imported ${added} books`, {
        description: skipped > 0 ? `${skipped} already present, skipped.` : undefined,
      });
    } catch (err) {
      console.error(err);
      toast.error("Invalid file", {
        description: "Make sure it is a Goodreads CSV or a BookDex backup.",
      });
    }
  };

  const handleClear = () => {
    if (
      !confirm(
        "Are you sure you want to delete your entire library? This action is irreversible."
      )
    )
      return;
    useBooksStore.setState({ books: {} });
    toast.success("Library cleared");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize BookDex and manage your collection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeToggle />

          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Auto theme by time
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically switch between light and dark based on the time of day.
                </p>
              </div>
              <Switch
                checked={schedule.enabled}
                onCheckedChange={(v) => updateSchedule({ enabled: v })}
                aria-label="Enable auto theme"
              />
            </div>
            {schedule.enabled && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="space-y-1">
                  <span className="text-xs text-muted-foreground">Dark from</span>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.darkFrom}
                    onChange={(e) =>
                      updateSchedule({ darkFrom: clampHour(Number(e.target.value)) })
                    }
                    className="h-9"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-muted-foreground">Until (excluded)</span>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.darkTo}
                    onChange={(e) =>
                      updateSchedule({ darkTo: clampHour(Number(e.target.value)) })
                    }
                    className="h-9"
                  />
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data management</CardTitle>
          <CardDescription>
            Your books are saved locally on this device ({total}{" "}
            {total === 1 ? "item" : "items"}).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" onClick={handleExport} className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" /> Export JSON backup
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
            className="w-full justify-start"
          >
            <Upload className="w-4 h-4 mr-2" /> Import from Goodreads CSV / JSON backup
          </Button>
          <p className="text-[11px] text-muted-foreground px-1 pt-1">
            Export from Goodreads → <em>My Books</em> → <em>Import / Export</em> and upload the{" "}
            <code>.csv</code> file. Books already in your library will not be overwritten.
          </p>

          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear library
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" /> About
          </CardTitle>
          <CardDescription>BookDex v1.2</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            BookDex is a mobile-first PWA for tracking your books. It uses Google Books as a data
            source and saves everything locally on your device — no account, no server.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            Made with love — <Github className="w-3.5 h-3.5" /> Open source
          </div>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/about">
              <BookMarked className="w-4 h-4 mr-2" /> About BookDex
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileUp className="w-3.5 h-3.5" />
        All your data never leaves your browser.
      </div>
    </div>
  );
}

function clampHour(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(23, Math.floor(n)));
}
