import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import type {
  PortfolioItemRow,
  ProfileRow,
  ShopperProfileRow,
} from "@/types/database";

export type ShopperDetail = ShopperProfileRow & {
  profile: Pick<ProfileRow, "prenom" | "nom" | "avatar_url" | "ville">;
  portfolio: PortfolioItemRow[];
};

/** Profil shopper de l'utilisateur connecté (toutes valeurs de statut), ou null. */
export const getMyShopperProfile = cache(async (): Promise<ShopperDetail | null> => {
  const me = await getCurrentProfile();
  if (!me || me.role !== "shopper") return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("shopper_profiles")
    .select(
      "*, profile:profiles!shopper_profiles_profile_id_fkey(prenom,nom,avatar_url,ville), portfolio:portfolio_items(*)",
    )
    .eq("profile_id", me.id)
    .maybeSingle();

  if (!data) return null;
  return normalize(data);
});

/**
 * Fiche publique par slug. Renvoie le shopper si `actif`, ou si c'est le
 * propriétaire qui consulte son propre profil (aperçu avant validation).
 */
export const getShopperBySlug = cache(
  async (slug: string): Promise<{ shopper: ShopperDetail; isOwner: boolean } | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("shopper_profiles")
      .select(
        "*, profile:profiles!shopper_profiles_profile_id_fkey(prenom,nom,avatar_url,ville), portfolio:portfolio_items(*)",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return null;

    const me = await getCurrentProfile();
    const isOwner = me?.id === data.profile_id;
    if (data.statut !== "actif" && !isOwner) return null;

    return { shopper: normalize(data), isOwner };
  },
);

type RawShopper = ShopperProfileRow & {
  profile: ShopperDetail["profile"] | ShopperDetail["profile"][] | null;
  portfolio: PortfolioItemRow[] | null;
};

function normalize(row: RawShopper): ShopperDetail {
  const profile = Array.isArray(row.profile) ? row.profile[0] : row.profile;
  return {
    ...row,
    profile: profile ?? { prenom: "", nom: "", avatar_url: null, ville: null },
    portfolio: [...(row.portfolio ?? [])].sort((a, b) => a.position - b.position),
  };
}
