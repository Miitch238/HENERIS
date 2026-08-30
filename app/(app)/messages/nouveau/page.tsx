import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";

/**
 * Crée (ou retrouve) la conversation entre le client connecté et le shopper
 * indiqué, puis redirige vers le fil.
 */
export default async function NouvelleConversation({
  searchParams,
}: {
  searchParams: Promise<{ shopper?: string }>;
}) {
  const { shopper: slug } = await searchParams;
  if (!slug) redirect("/shoppers");

  const me = await getCurrentProfile();
  if (!me) redirect(`/connexion?suite=/shoppers/${slug}`);
  if (me.role !== "client") redirect(`/shoppers/${slug}`);

  const supabase = await createClient();
  const { data: sp } = await supabase
    .from("shopper_profiles")
    .select("profile_id, statut")
    .eq("slug", slug)
    .maybeSingle();
  if (!sp || sp.statut !== "actif") redirect("/shoppers");

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("client_id", me.id)
    .eq("shopper_id", sp.profile_id)
    .maybeSingle();
  if (existing) redirect(`/messages/${existing.id}`);

  const { data: created } = await supabase
    .from("conversations")
    .insert({ client_id: me.id, shopper_id: sp.profile_id })
    .select("id")
    .single();

  redirect(created ? `/messages/${created.id}` : `/shoppers/${slug}`);
}
