"use client";
import { useMemo } from "react";
import { Trash2, Download, Info, Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBooksStore } from "@/store/books-store";
import { toast } from "sonner";

// Pagina impostazioni: tema, backup, info
export default function SettingsPage() {
  const books = useBooksStore((s) => s.books);

  const total = useMemo(() => Object.keys(books).length, [books]);

  // Esporta la libreria in JSON
  const handleExport = () => {
    try {
      const data = JSON.stringify({ version: 1, exportedAt: Date.now(), books }, null, 2);
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

  // Cancella tutta la libreria
  const handleClear = () => {
    if (!confirm("Sei sicuro di voler cancellare tutta la tua libreria? Questa azione è irreversibile.")) return;
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
        <CardContent>
          <ThemeToggle />
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
            <Download className="w-4 h-4 mr-2" /> Esporta come JSON
          </Button>
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
          <CardDescription>BookDex v1.0</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            BookDex è una PWA mobile-first per tracciare i tuoi libri. Usa Google Books come sorgente
            dati e salva tutto localmente sul tuo dispositivo.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            Made with love — <Github className="w-3.5 h-3.5" /> Open source
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
