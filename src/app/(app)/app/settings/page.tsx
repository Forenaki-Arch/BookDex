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

// Pagina impostazioni: tema, auto-dark, import/export, info
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
    // Notifica l'AutoThemeMount di ricaricare
    window.dispatchEvent(new Event("bookdex-auto-theme"));
  };

  // Esporta la libreria in JSON
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
      toast.success("Backup scaricato!");
    } catch {
      toast.error("Errore durante l'export");
    }
  };

  // Import CSV Goodreads o JSON di backup
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
        toast.error("Nessun libro trovato nel file");
        return;
      }
      const { added, skipped } = importBooks(items);
      toast.success(`Importati ${added} libri`, {
        description: skipped > 0 ? `${skipped} già presenti, saltati.` : undefined,
      });
    } catch (err) {
      console.error(err);
      toast.error("File non valido", {
        description: "Assicurati che sia un CSV Goodreads o un backup BookDex.",
      });
    }
  };

  const handleClear = () => {
    if (
      !confirm(
        "Sei sicuro di voler cancellare tutta la tua libreria? Questa azione è irreversibile."
      )
    )
      return;
    useBooksStore.setState({ books: {} });
    toast.success("Libreria svuotata");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalizza BookDex e gestisci la tua collezione.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aspetto</CardTitle>
          <CardDescription>Scegli il tema che preferisci.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeToggle />

          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Tema automatico per ora
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Passa automaticamente tra chiaro e scuro in base all&apos;ora del giorno.
                </p>
              </div>
              <Switch
                checked={schedule.enabled}
                onCheckedChange={(v) => updateSchedule({ enabled: v })}
                aria-label="Abilita tema automatico"
              />
            </div>
            {schedule.enabled && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="space-y-1">
                  <span className="text-xs text-muted-foreground">Scuro dalle</span>
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
                  <span className="text-xs text-muted-foreground">Alle (non incluso)</span>
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
          <CardTitle>Gestione dati</CardTitle>
          <CardDescription>
            I tuoi libri sono salvati localmente sul dispositivo ({total}{" "}
            {total === 1 ? "elemento" : "elementi"}).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" onClick={handleExport} className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" /> Esporta backup JSON
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
            <Upload className="w-4 h-4 mr-2" /> Importa da Goodreads CSV / backup JSON
          </Button>
          <p className="text-[11px] text-muted-foreground px-1 pt-1">
            Esporta da Goodreads → <em>My Books</em> → <em>Import / Export</em> e carica il
            file <code>.csv</code>. I libri già presenti non vengono sovrascritti.
          </p>

          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Cancella libreria
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" /> Informazioni
          </CardTitle>
          <CardDescription>BookDex v1.1</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            BookDex è una PWA mobile-first per tracciare i tuoi libri. Usa Google Books come sorgente
            dati e salva tutto localmente sul tuo dispositivo — nessun account, nessun server.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            Made with love — <Github className="w-3.5 h-3.5" /> Open source
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileUp className="w-3.5 h-3.5" />
        Tutti i dati non lasciano mai il tuo browser.
      </div>
    </div>
  );
}

function clampHour(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(23, Math.floor(n)));
}
