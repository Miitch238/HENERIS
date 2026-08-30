"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";

export type MsgState = { error?: string };

/* ------------------------------------------ envoyer un message */

const messageSchema = z.object({
  conversationId: z.string().uuid(),
  contenu: z.string().trim().min(1).max(4000),
});

export async function sendMessage(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const me = await getCurrentProfile();
  if (!me) return { error: "Session expirée." };

  const parsed = messageSchema.safeParse({
    conversationId: formData.get("conversationId"),
    contenu: formData.get("contenu"),
  });
  if (!parsed.success) return { error: "Message vide ou trop long." };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    conversation_id: parsed.data.conversationId,
    sender_id: me.id,
    contenu: parsed.data.contenu,
  });

  if (error) return { error: "Envoi impossible. Réessayez." };
  revalidatePath(`/messages/${parsed.data.conversationId}`);
  revalidatePath("/messages");
  return {};
}

/* ------------------------------------------ marquer comme lu */

export async function markConversationRead(conversationId: string) {
  const me = await getCurrentProfile();
  if (!me) return;
  const supabase = await createClient();
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", me.id)
    .is("read_at", null);
  revalidatePath("/messages");
  revalidatePath("/tableau-de-bord");
}

/* ------------------------------------------ brief structuré */

const briefSchema = z.object({
  conversationId: z.string().uuid(),
  categorie: z.string().trim().min(1, "La catégorie est requise.").max(80),
  description: z.string().trim().max(2000).default(""),
  delai: z.string().trim().max(120).optional().default(""),
  budget_min: z
    .string()
    .trim()
    .transform((s) => (s === "" ? null : Number(s.replace(",", "."))))
    .pipe(z.number().min(0).nullable()),
  budget_max: z
    .string()
    .trim()
    .transform((s) => (s === "" ? null : Number(s.replace(",", "."))))
    .pipe(z.number().min(0).nullable()),
});

export async function saveBrief(_prev: MsgState, formData: FormData): Promise<MsgState> {
  const me = await getCurrentProfile();
  if (!me || me.role !== "client") return { error: "Seul le client peut définir le besoin." };

  const parsed = briefSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("briefs").upsert(
    {
      conversation_id: v.conversationId,
      categorie: v.categorie,
      description: v.description,
      delai: v.delai || null,
      budget_min: v.budget_min,
      budget_max: v.budget_max,
    },
    { onConflict: "conversation_id" },
  );

  if (error) return { error: "Enregistrement impossible." };
  revalidatePath(`/messages/${v.conversationId}`);
  return {};
}
