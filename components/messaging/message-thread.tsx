"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markConversationRead, type MsgState } from "@/lib/messaging/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { FormError } from "@/components/ui/field";
import type { MessageRow } from "@/types/database";
import { cn } from "@/lib/utils";

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}
function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function MessageThread({
  conversationId,
  myProfileId,
  initialMessages,
}: {
  conversationId: string;
  myProfileId: string;
  initialMessages: MessageRow[];
}) {
  // Messages reçus en direct, non encore reflétés par le rendu serveur.
  const [live, setLive] = useState<MessageRow[]>([]);
  const [state, formAction] = useActionState(sendMessage, {} as MsgState);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    const byId = new Map<string, MessageRow>();
    for (const m of initialMessages) byId.set(m.id, m);
    for (const m of live) if (!byId.has(m.id)) byId.set(m.id, m);
    return [...byId.values()].sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
    );
  }, [initialMessages, live]);

  // Realtime : nouveaux messages de la conversation.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as MessageRow;
          setLive((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          if (msg.sender_id !== myProfileId) void markConversationRead(conversationId);
        },
      )
      .subscribe();

    void markConversationRead(conversationId);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, myProfileId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const grouped = useMemo(() => {
    const out: { day: string; items: MessageRow[] }[] = [];
    for (const m of messages) {
      const day = dayLabel(m.created_at);
      const last = out.at(-1);
      if (last?.day === day) last.items.push(m);
      else out.push({ day, items: [m] });
    }
    return out;
  }, [messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-[0.9rem] text-ink-faint">
            Aucun message pour l&apos;instant. Écrivez le premier.
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.day}>
              <p className="my-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
                {group.day}
              </p>
              <ul className="grid gap-2">
                {group.items.map((m) => {
                  const mine = m.sender_id === myProfileId;
                  return (
                    <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[78%] px-3.5 py-2 text-[0.92rem] leading-relaxed",
                          mine ? "bg-ink text-ground" : "border border-hairline bg-surface text-ink",
                        )}
                      >
                        <p className="whitespace-pre-wrap">{m.contenu}</p>
                        <p
                          className={cn(
                            "mt-1 text-right text-[0.65rem]",
                            mine ? "text-ground/50" : "text-ink-faint",
                          )}
                        >
                          {timeLabel(m.created_at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        ref={formRef}
        action={(fd) => {
          formAction(fd);
          formRef.current?.reset();
        }}
        className="border-t border-hairline pt-3"
      >
        <input type="hidden" name="conversationId" value={conversationId} />
        <FormError>{state.error}</FormError>
        <div className="flex items-end gap-2">
          <textarea
            name="contenu"
            required
            rows={1}
            maxLength={4000}
            placeholder="Votre message…"
            aria-label="Votre message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            className="max-h-40 min-h-11 flex-1 resize-none border border-hairline bg-surface px-3 py-2.5 text-[0.95rem] text-ink transition-colors focus-visible:border-gold-deep"
          />
          <SubmitButton className="h-11 w-auto px-5" pendingLabel="…">
            Envoyer
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
