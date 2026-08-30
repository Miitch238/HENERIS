import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photo de profil carrée, ou initiales en repli. `px` = côté en pixels
 * (= la classe Tailwind `size-N` × 4). Les images passent par next/image
 * (redimensionnées et servies en WebP depuis Supabase Storage).
 */
export function Avatar({
  url,
  name,
  px,
  className,
}: {
  url?: string | null;
  name: string;
  px: number;
  className?: string;
}) {
  const base = "shrink-0 border border-hairline object-cover";

  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={px}
        height={px}
        className={cn(base, className)}
        style={{ width: px, height: px }}
      />
    );
  }

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";

  return (
    <span
      aria-hidden
      className={cn(
        base,
        "grid place-items-center bg-sunk font-serif text-ink-faint",
        className,
      )}
      style={{ width: px, height: px, fontSize: Math.round(px * 0.34) }}
    >
      {initials}
    </span>
  );
}
