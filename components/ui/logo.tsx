import Link from "next/link";
import { cn } from "@/lib/utils";

const RATIO = 4782 / 832.85; // viewBox du wordmark ≈ 5.74:1

type LogoProps = {
  /** "dark" : wordmark noir (fonds clairs). "light" : wordmark ivoire (fonds sombres). */
  tone?: "dark" | "light";
  /** Hauteur du wordmark en px. */
  height?: number;
  /** Lien vers l'accueil (défaut) ou simple image si null. */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function Logo({
  tone = "dark",
  height = 24,
  href = "/",
  className,
  priority,
}: LogoProps) {
  const src = tone === "light" ? "/brand/logo-ivory.svg" : "/brand/logo-regular.svg";

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- SVG statique vectoriel, aucune optimisation à faire
    <img
      src={src}
      alt="Heneris"
      width={Math.round(height * RATIO)}
      height={height}
      className={cn("block w-auto", className)}
      style={{ height }}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );

  if (href === null) return img;

  return (
    <Link href={href} aria-label="Heneris — accueil" className="inline-flex shrink-0">
      {img}
    </Link>
  );
}
