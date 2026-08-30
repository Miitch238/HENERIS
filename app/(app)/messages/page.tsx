import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries/profile";
import { listConversations } from "@/lib/queries/conversations";
import { ConversationList } from "@/components/messaging/conversation-list";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const me = await getCurrentProfile();
  const conversations = await listConversations();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl md:text-3xl">Messages</h1>

      {conversations.length === 0 ? (
        <div className="mt-8 border border-dashed border-hairline bg-surface px-6 py-14 text-center">
          {me?.role === "client" ? (
            <>
              <p className="font-serif text-lg text-ink">Vous n&apos;avez pas encore contacté de shopper.</p>
              <Link
                href="/shoppers"
                className="mt-4 inline-flex text-[0.85rem] text-gold-deep underline underline-offset-4"
              >
                Parcourir l&apos;annuaire
              </Link>
            </>
          ) : (
            <p className="font-serif text-lg text-ink">Aucune demande pour l&apos;instant.</p>
          )}
        </div>
      ) : (
        <div className="mt-6 border border-hairline bg-ground">
          <ConversationList conversations={conversations} />
        </div>
      )}
    </div>
  );
}
