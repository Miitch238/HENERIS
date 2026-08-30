import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import type { BriefRow, MessageRow } from "@/types/database";

export type ConversationSummary = {
  id: string;
  last_message_at: string;
  other: { prenom: string; nom: string; avatar_url: string | null; slug: string | null };
  lastMessage: string | null;
  unread: number;
};

export type ConversationThread = {
  id: string;
  role: "client" | "shopper";
  other: {
    profileId: string;
    prenom: string;
    nom: string;
    avatar_url: string | null;
    slug: string | null;
  };
  messages: MessageRow[];
  brief: BriefRow | null;
};

/** Liste des conversations de l'utilisateur, triées par activité. */
export const listConversations = cache(async (): Promise<ConversationSummary[]> => {
  const me = await getCurrentProfile();
  if (!me) return [];
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select(
      `id, last_message_at, client_id, shopper_id,
       client:profiles!conversations_client_id_fkey(prenom,nom,avatar_url),
       shopper:profiles!conversations_shopper_id_fkey(prenom,nom,avatar_url, shopper_profiles(slug)),
       messages(contenu, created_at, sender_id, read_at)`,
    )
    .order("last_message_at", { ascending: false });

  return (data ?? []).map((c) => {
    const iAmClient = c.client_id === me.id;
    const otherRaw = (iAmClient ? c.shopper : c.client) as Record<string, unknown>;
    const other = Array.isArray(otherRaw) ? otherRaw[0] : otherRaw;
    const sp = other?.shopper_profiles;
    const slug = (Array.isArray(sp) ? sp[0]?.slug : sp?.slug) ?? null;

    const msgs = [...(c.messages ?? [])].sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
    );
    const last = msgs.at(-1);
    const unread = msgs.filter((m) => m.sender_id !== me.id && m.read_at === null).length;

    return {
      id: c.id,
      last_message_at: c.last_message_at,
      other: {
        prenom: (other?.prenom as string) ?? "",
        nom: (other?.nom as string) ?? "",
        avatar_url: (other?.avatar_url as string) ?? null,
        slug,
      },
      lastMessage: last?.contenu ?? null,
      unread,
    };
  });
});

/** Une conversation avec ses messages + brief. Renvoie null si non participant. */
export async function getConversationThread(id: string): Promise<ConversationThread | null> {
  const me = await getCurrentProfile();
  if (!me) return null;
  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, client_id, shopper_id")
    .eq("id", id)
    .maybeSingle();
  if (!conv || (conv.client_id !== me.id && conv.shopper_id !== me.id)) return null;

  const iAmClient = conv.client_id === me.id;
  const otherId = iAmClient ? conv.shopper_id : conv.client_id;

  const [{ data: otherProfile }, { data: messages }, { data: brief }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, prenom, nom, avatar_url, shopper_profiles(slug)")
      .eq("id", otherId)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("briefs").select("*").eq("conversation_id", id).maybeSingle(),
  ]);

  const sp = otherProfile?.shopper_profiles;
  const slug = (Array.isArray(sp) ? sp[0]?.slug : sp?.slug) ?? null;

  return {
    id,
    role: iAmClient ? "client" : "shopper",
    other: {
      profileId: otherId,
      prenom: otherProfile?.prenom ?? "",
      nom: otherProfile?.nom ?? "",
      avatar_url: otherProfile?.avatar_url ?? null,
      slug,
    },
    messages: (messages ?? []) as MessageRow[],
    brief: (brief as BriefRow) ?? null,
  };
}

/** Nombre total de messages non lus (pour le badge de navigation). */
export const countUnread = cache(async (): Promise<number> => {
  const me = await getCurrentProfile();
  if (!me) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .neq("sender_id", me.id);
  return count ?? 0;
});
