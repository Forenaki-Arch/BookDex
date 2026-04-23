"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoreVertical, BookOpen, Bookmark, CheckCheck, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RatingStars } from "@/components/books/rating-stars";
import { useBooksStore } from "@/store/books-store";
import type { SavedBook, BookStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  book: SavedBook;
  index: number;
  onClick?: () => void;
}

export function BookListItem({ book, index, onClick }: Props) {
  const remove = useBooksStore((s) => s.removeBook);
  const move = useBooksStore((s) => s.moveBook);
  const setProgress = useBooksStore((s) => s.setProgress);
  const rate = useBooksStore((s) => s.rateBook);

  const showProgress = book.status === "reading";
  const showRating = book.status === "read";

  const handleMove = (status: BookStatus) => {
    move(book.id, status);
    toast.success(`Moved to "${STATUS_LABELS[status]}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.04, type: "spring", damping: 20 }}
      className="group flex gap-4 p-3 rounded-xl border border-border/60 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
    >
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 rounded-md overflow-hidden hover:scale-105 transition-transform"
        aria-label={`Details for ${book.title}`}
      >
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={60}
            height={90}
            className="rounded-md shadow object-cover"
          />
        ) : (
          <div className="w-[60px] h-[90px] rounded-md bg-muted flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <button type="button" onClick={onClick} className="text-left w-full">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {book.authors.join(", ")}
          </p>
        </button>

        {showProgress && (
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold tabular-nums">{book.progress ?? 0}%</span>
            </div>
            <Progress value={book.progress ?? 0} className="h-1.5" />
            <div className="flex gap-1 flex-wrap">
              {[10, 25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProgress(book.id, p);
                    if (p === 100) {
                      move(book.id, "read");
                      toast.success("Congrats! Book completed 🎉");
                    }
                  }}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-accent transition-colors"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        )}

        {showRating && (
          <div className="mt-2">
            <RatingStars
              value={book.rating ?? 0}
              size="sm"
              onChange={(r) => {
                rate(book.id, r);
                toast.success(`Rated ${r}/5`);
              }}
            />
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Options">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {book.status !== "to-read" && (
            <DropdownMenuItem onClick={() => handleMove("to-read")}>
              <Bookmark className="w-4 h-4 mr-2" /> Move to &quot;To Read&quot;
            </DropdownMenuItem>
          )}
          {book.status !== "reading" && (
            <DropdownMenuItem onClick={() => handleMove("reading")}>
              <BookOpen className="w-4 h-4 mr-2" /> Move to &quot;Reading&quot;
            </DropdownMenuItem>
          )}
          {book.status !== "read" && (
            <DropdownMenuItem onClick={() => handleMove("read")}>
              <CheckCheck className="w-4 h-4 mr-2" /> Move to &quot;Read&quot;
            </DropdownMenuItem>
          )}
          {book.status === "read" && (
            <DropdownMenuItem onClick={() => rate(book.id, 5)}>
              <Star className="w-4 h-4 mr-2" /> Favourite (5★)
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              remove(book.id);
              toast.info("Book removed");
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
