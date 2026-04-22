"use client";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

// Copertina libro con fallback e lift-on-hover
export function BookCover({ src, alt, className, priority, sizes }: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-lg bg-muted shadow-md transition-all duration-300",
        "group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 45vw, 200px"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2 text-center flex-col gap-2">
          <BookOpen className="w-8 h-8 opacity-40" />
          <span className="line-clamp-3 font-serif">{alt}</span>
        </div>
      )}
      {/* Gloss overlay al hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
