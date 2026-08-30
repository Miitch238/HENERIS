"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";

export type ReviewState = { error?: string; notice?: string };

const schema = z.object({
  shopperSlug: z.string().min(1),
  note: z.coerce.number().int().min(1, "Choisissez une note.").max(5),
  commentaire: z.string().trim().max(1500).default(""),
});

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const me = await getCurrentProfile();
  if (!me) redirect("/connexion");
  if (me.role !== "client") return { error: "Seuls les clients peuvent laisser un avis." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const { shopperSlug, note, commentaire } = parsed.data;

  const supabase = await createClient();

  const { data: sp } = await supabase
    .from("shopper_profiles")
    .select("profile_id, slug")
    .eq("slug", shopperSlug)
    .maybeSingle();
  if (!sp) return { error: "Personal shopper introuvable." };

  // La RLS exige déjà qu'une conversation existe ; on renvoie un message clair.
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("client_id", me.id)
    .eq("shopper_id", sp.profile_id)
    .maybeSingle();
  if (!conv)
    return { error: "Vous devez avoir échangé avec ce shopper pour laisser un avis." };

  const { error } = await supabase.from("reviews").upsert(
    { client_id: me.id, shopper_id: sp.profile_id, note, commentaire },
    { onConflict: "client_id,shopper_id" },
  );

  if (error) return { error: "Enregistrement impossible. Réessayez." };

  revalidatePath(`/shoppers/${sp.slug}`);
  redirect(`/shoppers/${sp.slug}?avis=merci`);
}
