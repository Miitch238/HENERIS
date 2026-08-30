import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number | null;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (value === null || value === undefined) {
    return (
      <span className={cn("text-[0.8rem] text-ink-faint", className)}>
        Pas encore d&apos;avis
      </span>
    );
  }

  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= rounded ? "fill-gold text-gold" : "text-hairline"}
          />
        ))}
      </span>
      <span className="text-[0.8rem] text-ink-soft tabular-nums">
        {value.toFixed(1)}
        {count !== undefined ? ` · ${count} avis` : ""}
      </span>
    </span>
  );
}
