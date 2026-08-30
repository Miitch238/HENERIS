"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ConversationSummary } from "@/lib/queries/conversations";
import { cn } from "@/lib/utils";

function relative(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const min = Math.round(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function ConversationList({
  conversations,
  activeId,
}: {
  conversations: ConversationSummary[];
  activeId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const refresh = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 300);
    };
    const channel = supabase
      .channel("messages-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, refresh)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" }, refresh)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, pathname]);

  if (conversations.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-[0.9rem] text-ink-faint">
        Aucune conversation pour l&apos;instant.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-hairline-soft">
      {conversations.map((c) => {
        const name = `${c.other.prenom} ${c.other.nom}`.trim() || "Conversation";
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <Link
              href={`/messages/${c.id}`}
              className={cn(
                "flex gap-3 px-4 py-4 transition-colors hover:bg-sunk",
                active && "bg-sunk",
              )}
            >
              {c.other.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.other.avatar_url} alt="" className="size-10 shrink-0 border border-hairline object-cover" />
              ) : (
                <span className="grid size-10 shrink-0 place-items-center border border-hairline bg-surface font-serif text-[0.8rem] text-ink-faint">
                  {c.other.prenom.charAt(0)}
                  {c.other.nom.charAt(0)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[0.9rem] font-medium text-ink">{name}</span>
                  <span className="shrink-0 text-[0.7rem] text-ink-faint">
                    {relative(c.last_message_at)}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-[0.82rem]",
                      c.unread > 0 ? "font-medium text-ink" : "text-ink-soft",
                    )}
                  >
                    {c.lastMessage ?? "Nouvelle conversation"}
                  </span>
                  {c.unread > 0 && (
                    <span className="grid size-5 shrink-0 place-items-center bg-gold text-[0.65rem] font-semibold text-ink">
                      {c.unread}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
