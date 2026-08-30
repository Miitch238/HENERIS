import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/shopper/rating";
import type { ShopperCardData } from "@/lib/queries/shoppers-list";

const DISPO: Record<string, { label: string; className: string }> = {
  ouvert: { label: "Ouvert aux demandes", className: "text-success" },
  complet: { label: "Complet", className: "text-ink-faint" },
  pause: { label: "En pause", className: "text-ink-faint" },
};

function budgetLabel(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${min} – ${max} €`;
  if (min !== null) return `dès ${min} €`;
  if (max !== null) return `jusqu'à ${max} €`;
  return "Budget non précisé";
}

export function ShopperCard({ shopper }: { shopper: ShopperCardData }) {
  const name = `${shopper.profile.prenom} ${shopper.profile.nom}`.trim() || "Personal shopper";
  const dispo = DISPO[shopper.disponibilite];

  return (
    <Link
      href={`/shoppers/${shopper.slug}`}
      className="group flex flex-col border border-hairline bg-surface transition-colors hover:border-ink-faint"
    >
      <div className="flex gap-4 p-5">
        <Avatar url={shopper.profile.avatar_url} name={name} px={64} />
        <div className="min-w-0">
          <p className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] ${dispo.className}`}>
            {dispo.label}
          </p>
          <h3 className="mt-1 truncate font-serif text-lg text-ink">{name}</h3>
          <p className="truncate text-[0.85rem] text-ink-soft">{shopper.titre}</p>
        </div>
      </div>

      <div className="mt-auto grid gap-2 border-t border-hairline-soft px-5 py-4 text-[0.8rem] text-ink-soft">
        <div className="flex items-center justify-between gap-3">
          <span>{shopper.profile.ville ?? "—"}</span>
          <span className="tabular-nums">{budgetLabel(shopper.budget_min, shopper.budget_max)}</span>
        </div>
        <Rating value={shopper.note_moyenne} count={shopper.nb_avis || undefined} size={12} />
        {shopper.specialites.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {shopper.specialites.slice(0, 3).map((s) => (
              <li key={s} className="bg-sunk px-2 py-0.5 text-[0.72rem] text-ink">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
