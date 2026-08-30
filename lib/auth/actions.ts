"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";

export type AuthState = {
  error?: string;
  /** Message de succès (ex. « vérifiez votre boîte mail »). */
  notice?: string;
};

async function siteUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

function firstError(issues: { message: string }[]) {
  return issues[0]?.message ?? "Formulaire invalide.";
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };

  const { role, prenom, nom, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, prenom, nom },
      emailRedirectTo: `${await siteUrl()}/auth/confirm`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.message.includes("already"))
      return { error: "Un compte existe déjà avec cette adresse." };
    return { error: "Impossible de créer le compte. Réessayez." };
  }

  // Confirmation d'e-mail désactivée → session immédiate.
  if (data.session) redirect("/tableau-de-bord");

  // Confirmation d'e-mail requise → pas de session tant que le lien n'est pas suivi.
  return {
    notice:
      "Compte créé. Vérifiez votre boîte mail et cliquez sur le lien de confirmation pour continuer.",
  };
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "email_not_confirmed")
      return { error: "Confirmez d'abord votre adresse via le lien reçu par mail." };
    return { error: "E-mail ou mot de passe incorrect." };
  }

  const suite = formData.get("suite");
  redirect(typeof suite === "string" && suite.startsWith("/") ? suite : "/tableau-de-bord");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error.issues) };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteUrl()}/auth/confirm?suite=/profil`,
  });

  // Réponse volontairement identique que le compte existe ou non.
  return {
    notice:
      "Si un compte est associé à cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
  };
}
