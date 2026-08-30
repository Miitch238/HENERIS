import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ShopperCard } from "@/components/shopper/shopper-card";
import { ShopperFilters } from "@/components/shopper/shopper-filters";
import { ShoppersSkeleton } from "@/components/shopper/shoppers-skeleton";
import {
  getShoppers,
  getSpecialiteOptions,
  type ShopperFilters as Filters,
} from "@/lib/queries/shoppers-list";

export const metadata: Metadata = {
  title: "Personal shoppers",
  description:
    "Parcourez et filtrez les personal shoppers Heneris par budget, spécialité, style, disponibilité et note.",
};

type SearchParamsObj = Record<string, string | string[] | undefined>;
type SearchParams = Promise<SearchParamsObj>;

function parseFilters(sp: SearchParamsObj): Filters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const tri = one(sp.tri);
  return {
    q: one(sp.q) || undefined,
    ville: one(sp.ville) || undefined,
    specialites: one(sp.specialite)?.split(",").filter(Boolean),
    disponibilite:
      one(sp.dispo) === "ouvert" || one(sp.dispo) === "complet" || one(sp.dispo) === "pause"
        ? (one(sp.dispo) as Filters["disponibilite"])
        : undefined,
    budget: one(sp.budget) ? Number(one(sp.budget)) : undefined,
    noteMin: one(sp.note) ? Number(one(sp.note)) : undefined,
    tri: tri === "note" || tri === "recent" ? tri : "pertinence",
    page: one(sp.page) ? Number(one(sp.page)) : 1,
  };
}

export default async function ShoppersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const specialiteOptions = await getSpecialiteOptions();

  return (
    <Container className="py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="eyebrow">L&apos;annuaire</p>
        <h1 className="mt-4 text-4xl md:text-5xl">Trouvez votre personal shopper</h1>
        <p className="mt-5 text-lg text-ink-soft">
          Filtrez par budget, spécialité, style et disponibilité. Chaque profil
          est vérifié par l&apos;équipe Heneris.
        </p>
      </header>

      <div className="mt-10">
        <ShopperFilters specialiteOptions={specialiteOptions} />
      </div>

      <Suspense key={JSON.stringify(filters)} fallback={<ShoppersSkeleton />}>
        <ShopperResults filters={filters} sp={sp} />
      </Suspense>
    </Container>
  );
}

async function ShopperResults({
  filters,
  sp,
}: {
  filters: Filters;
  sp: SearchParamsObj;
}) {
  const { shoppers, total, page, pageCount } = await getShoppers(filters);
  const hasFilters = Boolean(
    filters.q ||
      filters.ville ||
      filters.specialites?.length ||
      filters.disponibilite ||
      filters.budget ||
      filters.noteMin,
  );

  const buildPageHref = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp))
      if (typeof v === "string" && k !== "page") next.set(k, v);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/shoppers?${qs}` : "/shoppers";
  };

  return (
    <>
      <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-faint">
        {total} personal shopper{total > 1 ? "s" : ""}
        {hasFilters ? " correspondant à votre recherche" : ""}
      </p>

      {shoppers.length === 0 ? (
        <div className="mt-8 border border-dashed border-hairline bg-surface px-6 py-16 text-center">
          {hasFilters ? (
            <>
              <p className="font-serif text-xl text-ink">Aucun profil ne correspond.</p>
              <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-ink-soft">
                Élargissez vos critères — le réseau s&apos;étoffe chaque semaine.
              </p>
              <Link
                href="/shoppers"
                className="mt-6 inline-flex text-[0.85rem] text-gold-deep underline underline-offset-4"
              >
                Réinitialiser les filtres
              </Link>
            </>
          ) : (
            <>
              <p className="font-serif text-xl text-ink">Notre réseau s&apos;étoffe.</p>
              <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-ink-soft">
                Les premiers personal shoppers arrivent très bientôt. Revenez
                dans quelques jours.
              </p>
              <Link
                href="/devenir-shopper"
                className="mt-6 inline-flex text-[0.85rem] text-gold-deep underline underline-offset-4"
              >
                Vous êtes personal shopper ? Rejoignez-nous
              </Link>
            </>
          )}
        </div>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shoppers.map((shopper) => (
            <li key={shopper.slug} className="flex">
              <div className="flex w-full">
                <ShopperCard shopper={shopper} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2 text-[0.85rem]"
          aria-label="Pagination"
        >
          {page > 1 && (
            <Link
              href={buildPageHref(page - 1)}
              className="border border-hairline px-3 py-2 hover:border-ink"
            >
              Précédent
            </Link>
          )}
          <span className="px-3 py-2 text-ink-faint tabular-nums">
            Page {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={buildPageHref(page + 1)}
              className="border border-hairline px-3 py-2 hover:border-ink"
            >
              Suivant
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
