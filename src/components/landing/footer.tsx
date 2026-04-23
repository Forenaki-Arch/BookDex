import Link from "next/link";
import { BookMarked, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 backdrop-blur-sm">
      <div className="container max-w-6xl py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-primary" />
          <span className="font-semibold">BookDex</span>
          <span className="text-muted-foreground">v1.2</span>
        </div>

        <div className="flex items-center gap-6 text-muted-foreground">
          <Link href="/app" className="hover:text-foreground transition-colors">
            App
          </Link>
          <a
            href="https://github.com/Forenaki-Arch/BookDex"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for readers
        </p>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Developed by Forenaki
      </div>
    </footer>
  );
}
