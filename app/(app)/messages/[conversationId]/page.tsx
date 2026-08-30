import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getConversationThread } from "@/lib/queries/conversations";
import { MessageThread } from "@/components/messaging/message-thread";
import { BriefPanel } from "@/components/messaging/brief-panel";

export const metadata: Metadata = { title: "Conversation" };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const me = await getCurrentProfile();
  const thread = await getConversationThread(conversationId);
  if (!me || !thread) notFound();

  // Le marquage « lu » est déclenché côté client par <MessageThread> au montage
  // (revalidatePath n'est pas autorisé pendant le rendu).

  const name = `${thread.other.prenom} ${thread.other.nom}`.trim() || "Conversation";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col">
      <div className="flex items-center gap-3 border-b border-hairline pb-4">
        <Link href="/messages" className="text-[0.8rem] text-ink-faint hover:text-ink md:hidden">
          ←
        </Link>
        {thread.other.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thread.other.avatar_url} alt="" className="size-9 border border-hairline object-cover" />
        ) : (
          <span className="grid size-9 place-items-center border border-hairline bg-sunk font-serif text-[0.75rem] text-ink-faint">
            {thread.other.prenom.charAt(0)}
            {thread.other.nom.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] font-medium text-ink">{name}</p>
          {thread.role === "client" && thread.other.slug && (
            <span className="flex gap-3 text-[0.75rem]">
              <Link
                href={`/shoppers/${thread.other.slug}`}
                className="text-gold-deep underline underline-offset-2"
              >
                Voir la fiche
              </Link>
              <Link
                href={`/avis/nouveau?shopper=${thread.other.slug}`}
                className="text-gold-deep underline underline-offset-2"
              >
                Laisser un avis
              </Link>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <BriefPanel
          conversationId={conversationId}
          brief={thread.brief}
          canEdit={thread.role === "client"}
        />
      </div>

      <MessageThread
        conversationId={conversationId}
        myProfileId={me.id}
        initialMessages={thread.messages}
      />
    </div>
  );
}
