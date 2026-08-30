"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getMyShopperProfile } from "@/lib/queries/shopper";
import { shopperProfileSchema, clientProfileSchema } from "@/lib/validation/shopper";
import { uniqueSlug } from "@/lib/utils/slug";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_BYTES,
  MAX_PORTFOLIO_BYTES,
  extFor,
  publicUrl,
} from "@/lib/storage";

export type FormState = { error?: string; notice?: string };

const firstError = (issues: { message: string }[]) =>
  issues[0]?.message ?? "Formulaire invalide.";

/* ------------------------------------------------------------------ upload */

async function uploadImage(
  bucket: "avatars" | "portfolios",
  userId: string,
  file: File,
  maxBytes: number,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > maxBytes) return null;

  const supabase = await createClient();
  const path = `${userId}/${crypto.randomUUID()}.${extFor(file.type)}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  return error ? null : path;
}

/* ------------------------------------------------- créer un profil shopper */

export async function createShopperProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const me = await getCurrentProfile();
  if (!me) redirect("/connexion?suite=/devenir-shopper");
  if (me.role !== "shopper")
    return { error: "Votre compte n'est pas un compte personal shopper." };
  if (await getMyShopperProfile())
    return { error: "Vous avez déjà un profil de personal shopper." };

  const parsed = shopperProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const v = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Slug unique à partir du prénom + titre
  const slug = await uniqueSlug(`${me.prenom} ${v.titre}`, async (candidate) => {
    const { data } = await supabase
      .from("shopper_profiles")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    return data !== null;
  });

  const avatarFile = formData.get("avatar") as File | null;
  const avatarPath = avatarFile
    ? await uploadImage("avatars", user.id, avatarFile, MAX_AVATAR_BYTES)
    : null;
  if (avatarPath) {
    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl("avatars", avatarPath) })
      .eq("id", me.id);
  }

  const { data: created, error } = await supabase
    .from("shopper_profiles")
    .insert({
      profile_id: me.id,
      slug,
      titre: v.titre,
      bio: v.bio,
      specialites: v.specialites,
      styles: v.styles,
      budget_min: v.budget_min,
      budget_max: v.budget_max,
      disponibilite: v.disponibilite,
    })
    .select("id")
    .single();

  if (error || !created)
    return { error: "Impossible d'enregistrer le profil. Réessayez." };

  // Portfolio : jusqu'à 12 images
  const files = formData.getAll("portfolio").filter((f): f is File => f instanceof File && f.size > 0);
  let position = 0;
  for (const file of files.slice(0, 12)) {
    const path = await uploadImage("portfolios", user.id, file, MAX_PORTFOLIO_BYTES);
    if (path) {
      await supabase
        .from("portfolio_items")
        .insert({ shopper_id: created.id, image_path: path, position: position++ });
    }
  }

  if (v.ville) await supabase.from("profiles").update({ ville: v.ville }).eq("id", me.id);

  redirect("/tableau-de-bord?nouveau=profil");
}

/* --------------------------------------------- mettre à jour son profil */

export async function updateShopperProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const mine = await getMyShopperProfile();
  if (!mine) return { error: "Aucun profil shopper à modifier." };

  const parsed = shopperProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("shopper_profiles")
    .update({
      titre: v.titre,
      bio: v.bio,
      specialites: v.specialites,
      styles: v.styles,
      budget_min: v.budget_min,
      budget_max: v.budget_max,
      disponibilite: v.disponibilite,
    })
    .eq("id", mine.id);

  if (error) return { error: "Enregistrement impossible. Réessayez." };

  if (v.ville !== (mine.profile.ville ?? ""))
    await supabase.from("profiles").update({ ville: v.ville }).eq("id", mine.profile_id);

  revalidatePath("/profil");
  revalidatePath(`/shoppers/${mine.slug}`);
  return { notice: "Profil enregistré." };
}

export async function updateClientProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const me = await getCurrentProfile();
  if (!me) redirect("/connexion");

  const parsed = clientProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data })
    .eq("id", me.id);

  if (error) return { error: "Enregistrement impossible. Réessayez." };
  revalidatePath("/profil");
  return { notice: "Profil enregistré." };
}

/* -------------------------------------------------- disponibilité rapide */

export async function updateAvailability(formData: FormData) {
  const value = formData.get("disponibilite");
  if (value !== "ouvert" && value !== "complet" && value !== "pause") return;

  const mine = await getMyShopperProfile();
  if (!mine) return;

  const supabase = await createClient();
  await supabase
    .from("shopper_profiles")
    .update({ disponibilite: value })
    .eq("id", mine.id);
  revalidatePath("/tableau-de-bord");
  revalidatePath("/profil");
}

/* -------------------------------------------------------- portfolio */

export async function addPortfolioImages(_prev: FormState, formData: FormData): Promise<FormState> {
  const mine = await getMyShopperProfile();
  if (!mine) return { error: "Aucun profil shopper." };
  if (mine.portfolio.length >= 12)
    return { error: "Portfolio complet (12 images maximum)." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const files = formData
    .getAll("portfolio")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 12 - mine.portfolio.length);

  let position = mine.portfolio.length;
  let added = 0;
  for (const file of files) {
    const path = await uploadImage("portfolios", user.id, file, MAX_PORTFOLIO_BYTES);
    if (path) {
      await supabase
        .from("portfolio_items")
        .insert({ shopper_id: mine.id, image_path: path, position: position++ });
      added++;
    }
  }

  revalidatePath("/profil");
  revalidatePath(`/shoppers/${mine.slug}`);
  return added
    ? { notice: `${added} image${added > 1 ? "s" : ""} ajoutée${added > 1 ? "s" : ""}.` }
    : { error: "Aucune image valide (JPEG/PNG/WebP, 5 Mo max)." };
}

export async function removePortfolioItem(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const mine = await getMyShopperProfile();
  const item = mine?.portfolio.find((p) => p.id === id);
  if (!mine || !item) return;

  const supabase = await createClient();
  await supabase.storage.from("portfolios").remove([item.image_path]);
  await supabase.from("portfolio_items").delete().eq("id", id);
  revalidatePath("/profil");
  revalidatePath(`/shoppers/${mine.slug}`);
}
