import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

/**
 * Profil de l'utilisateur connecté (ligne `profiles`), ou null.
 * Mémoïsé pour la durée du rendu d'une requête.
 */
export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data ?? null;
});
