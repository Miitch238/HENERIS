"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import { contactSchema } from "@/lib/validation/contact";

export type ContactState = { error?: string; notice?: string };

const SUCCESS =
  "Message bien reçu. Nous vous répondrons par e-mail sous quelques jours ouvrés.";

/** Délai minimal entre le rendu de la page et l'envoi (anti-bot, ms). */
const MIN_FILL_MS = 2500;
/** Fenêtre de re-soumission bloquée après un envoi réussi (s). */
const COOLDOWN_S = 90;
const COOLDOWN_COOKIE = "heneris_contact";

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1 · Honeypot : un bot remplit ce champ caché. On feint le succès.
  if (String(formData.get("entreprise") ?? "").trim()) return { notice: SUCCESS };

  // 2 · Piège temporel : timestamp posé côté serveur au rendu de la page.
  const renduA = Number(formData.get("rendu_a"));
  if (Number.isFinite(renduA) && Date.now() - renduA < MIN_FILL_MS) {
    return { notice: SUCCESS };
  }

  // 3 · Cooldown : une soumission récente est encore en fenêtre bloquée.
  const jar = await cookies();
  if (jar.get(COOLDOWN_COOKIE)) {
    return {
      error:
        "Vous venez de nous écrire. Laissez-nous un moment pour vous répondre avant de renvoyer un message.",
    };
  }

  // 4 · Validation.
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  // 5 · Auteur si connecté (facilite le suivi côté équipe).
  const me = await getCurrentProfile();

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    ...parsed.data,
    auteur_id: me?.id ?? null,
  });

  if (error) return { error: "Envoi impossible pour le moment. Réessayez." };

  jar.set(COOLDOWN_COOKIE, "1", {
    maxAge: COOLDOWN_S,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return { notice: SUCCESS };
}
