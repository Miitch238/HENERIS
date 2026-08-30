import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import type { ReviewRow } from "@/types/database";

export type ReviewWithAuthor = ReviewRow & {
  author: { prenom: string; nom: string };
};

/** Avis publics d'un shopper (par id de profil), du plus récent au plus ancien. */
export async function getReviewsForShopper(
  shopperProfileId: string,
): Promise<ReviewWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, author:profiles!reviews_client_id_fkey(prenom,nom)")
    .eq("shopper_id", shopperProfileId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => {
    const a = Array.isArray(r.author) ? r.author[0] : r.author;
    return { ...r, author: { prenom: a?.prenom ?? "", nom: a?.nom ?? "" } } as ReviewWithAuthor;
  });
}

/** Contexte de l'avis pour le client connecté vis-à-vis d'un shopper. */
export async function getReviewContext(shopperProfileId: string): Promise<{
  canReview: boolean;
  existing: ReviewRow | null;
}> {
  const me = await getCurrentProfile();
  if (!me || me.role !== "client") return { canReview: false, existing: null };

  const supabase = await createClient();
  const [{ data: conv }, { data: existing }] = await Promise.all([
    supabase
      .from("conversations")
      .select("id")
      .eq("client_id", me.id)
      .eq("shopper_id", shopperProfileId)
      .maybeSingle(),
    supabase
      .from("reviews")
      .select("*")
      .eq("client_id", me.id)
      .eq("shopper_id", shopperProfileId)
      .maybeSingle(),
  ]);

  return { canReview: Boolean(conv), existing: (existing as ReviewRow) ?? null };
}
