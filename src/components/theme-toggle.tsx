"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Toggle dei tre temi: Light, Dark, Sepia/Paper
export function ThemeToggle({ variant = "outline" }: { variant?: "outline" | "ghost" }) {
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="w-full justify-start gap-2">
          <Palette className="w-4 h-4" />
          <span className="flex-1 text-left">Tema: {themeLabel(theme)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="w-4 h-4 mr-2" /> Chiaro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="w-4 h-4 mr-2" /> Scuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sepia")}>
          <BookOpen className="w-4 h-4 mr-2" /> Carta / Sepia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Palette className="w-4 h-4 mr-2" /> Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function themeLabel(t?: string) {
  switch (t) {
    case "dark": return "Scuro";
    case "sepia": return "Sepia";
    case "system": return "Sistema";
    default: return "Chiaro";
  }
}
