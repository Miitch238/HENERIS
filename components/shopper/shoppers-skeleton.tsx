/** Squelette de la grille de résultats de l'annuaire (pendant le chargement). */
export function ShoppersSkeleton() {
  return (
    <div aria-hidden>
      <div className="mt-6 h-3 w-40 bg-sunk" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="border border-hairline bg-surface p-5">
            <div className="flex gap-4">
              <div className="size-16 shrink-0 bg-sunk" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-24 bg-sunk" />
                <div className="h-4 w-32 bg-sunk" />
                <div className="h-3 w-40 bg-sunk" />
              </div>
            </div>
            <div className="mt-5 space-y-2 border-t border-hairline-soft pt-4">
              <div className="h-3 w-full bg-sunk" />
              <div className="h-3 w-2/3 bg-sunk" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
