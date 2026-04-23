"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export function RatingStars({ value, onChange, size = "md", readOnly = false }: Props) {
  const [hover, setHover] = useState(0);
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };
  const displayValue = hover || value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHover(0)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => !readOnly && onChange?.(value === n ? 0 : n)}
          className={cn(
            "transition-all",
            !readOnly && "hover:scale-125 cursor-pointer",
            readOnly && "cursor-default"
          )}
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-colors",
              n <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}
