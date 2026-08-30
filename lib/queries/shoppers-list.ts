import { createClient } from "@/lib/supabase/server";
import type { Availability, ShopperProfileRow } from "@/types/database";

export const PAGE_SIZE = 12;

export type ShopperFilters = {
  q?: string;
  specialites?: string[];
  disponibilite?: Availability;
  budget?: number;
  noteMin?: number;
  ville?: string;
  tri?: "pertinence" | "note" | "recent";
  page?: number;
};

export type ShopperCardData = Pick<
  ShopperProfileRow,
  | "slug"
  | "titre"
  | "specialites"
  | "styles"
  | "budget_min"
  | "budget_max"
  | "disponibilite"
  | "note_moyenne"
  | "nb_avis"
> & {
  profile: { prenom: string; nom: string; avatar_url: string | null; ville: string | null };
};

export type ShopperListResult = {
  shoppers: ShopperCardData[];
  total: number;
  page: number;
  pageCount: number;
};

/** Liste paginée + filtrée des personal shoppers actifs. */
export async function getShoppers(filters: ShopperFilters): Promise<ShopperListResult> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("shopper_profiles")
    .select(
      "slug, titre, specialites, styles, budget_min, budget_max, disponibilite, note_moyenne, nb_avis, created_at, profile:profiles!inner(prenom, nom, avatar_url, ville)",
      { count: "exact" },
    )
    .eq("statut", "actif");

  if (filters.q) query = query.or(`titre.ilike.%${filters.q}%,bio.ilike.%${filters.q}%`);
  if (filters.specialites?.length)
    query = query.overlaps("specialites", filters.specialites);
  if (filters.disponibilite) query = query.eq("disponibilite", filters.disponibilite);
  if (typeof filters.budget === "number")
    query = query.or(`budget_min.is.null,budget_min.lte.${filters.budget}`);
  if (typeof filters.noteMin === "number")
    query = query.gte("note_moyenne", filters.noteMin);
  if (filters.ville)
    query = query.ilike("profiles.ville", `%${filters.ville}%`);

  if (filters.tri === "note")
    query = query.order("note_moyenne", { ascending: false, nullsFirst: false });
  else if (filters.tri === "recent")
    query = query.order("created_at", { ascending: false });
  else
    query = query
      .order("nb_avis", { ascending: false })
      .order("created_at", { ascending: false });

  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  const total = count ?? 0;
  return {
    shoppers: (data ?? []).map((row) => ({
      ...row,
      profile: Array.isArray(row.profile) ? row.profile[0] : row.profile,
    })) as ShopperCardData[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Quelques shoppers pour la mise en avant sur la page d'accueil. */
export async function getFeaturedShoppers(limit = 3): Promise<ShopperCardData[]> {
  const { shoppers } = await getShoppers({ tri: "note", page: 1 });
  return shoppers.slice(0, limit);
}

/** Valeurs de spécialités présentes chez les shoppers actifs (pour les filtres). */
export async function getSpecialiteOptions(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shopper_profiles")
    .select("specialites")
    .eq("statut", "actif")
    .limit(200);

  const set = new Set<string>();
  for (const row of data ?? []) for (const s of row.specialites) set.add(s);
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}
