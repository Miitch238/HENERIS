import { cn } from "@/lib/utils";

/** Conteneur centré à largeur maîtrisée, gouttières responsives. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10", className)}
      {...props}
    />
  );
}
