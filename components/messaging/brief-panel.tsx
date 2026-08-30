"use client";

import { useActionState, useState } from "react";
import { saveBrief, type MsgState } from "@/lib/messaging/actions";
import { Field, Input, FormError } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";
import type { BriefRow } from "@/types/database";

function budget(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${min} – ${max} €`;
  if (min !== null) return `dès ${min} €`;
  if (max !== null) return `jusqu'à ${max} €`;
  return null;
}

export function BriefPanel({
  conversationId,
  brief,
  canEdit,
}: {
  conversationId: string;
  brief: BriefRow | null;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(
    async (prev: MsgState, fd: FormData) => {
      const res = await saveBrief(prev, fd);
      if (!res.error) setEditing(false);
      return res;
    },
    {} as MsgState,
  );

  if (editing || (canEdit && !brief)) {
    return (
      <form action={formAction} className="grid gap-3 border border-hairline bg-surface p-4">
        <input type="hidden" name="conversationId" value={conversationId} />
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">
          Votre besoin
        </p>
        <FormError>{state.error}</FormError>
        <Field label="Catégorie" htmlFor="categorie">
          <Input
            id="categorie"
            name="categorie"
            required
            defaultValue={brief?.categorie}
            placeholder="Sac à main, montre, déco…"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Budget min (€)" htmlFor="bmin">
            <Input id="bmin" name="budget_min" inputMode="numeric" defaultValue={brief?.budget_min ?? ""} />
          </Field>
          <Field label="Budget max (€)" htmlFor="bmax">
            <Input id="bmax" name="budget_max" inputMode="numeric" defaultValue={brief?.budget_max ?? ""} />
          </Field>
        </div>
        <Field label="Délai souhaité" htmlFor="delai">
          <Input id="delai" name="delai" defaultValue={brief?.delai ?? ""} placeholder="Sous 2 semaines…" />
        </Field>
        <Field label="Détails" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={brief?.description}
            className="w-full border border-hairline bg-surface p-2.5 text-[0.9rem] text-ink outline-none focus-visible:border-gold-deep"
          />
        </Field>
        <div className="flex gap-2">
          <SubmitButton className="w-auto px-5">Enregistrer</SubmitButton>
          {brief && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 text-[0.85rem] text-ink-faint hover:text-ink"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    );
  }

  if (!brief) return null;

  const b = budget(brief.budget_min, brief.budget_max);
  return (
    <div className="border border-hairline bg-surface p-4 text-[0.88rem]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">
          Le besoin
        </p>
        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[0.78rem] text-gold-deep underline underline-offset-4"
          >
            Modifier
          </button>
        )}
      </div>
      <dl className="mt-3 grid gap-1.5 text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-faint">Catégorie</dt>
          <dd className="text-right text-ink">{brief.categorie}</dd>
        </div>
        {b && (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Budget</dt>
            <dd className="text-right text-ink tabular-nums">{b}</dd>
          </div>
        )}
        {brief.delai && (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-faint">Délai</dt>
            <dd className="text-right text-ink">{brief.delai}</dd>
          </div>
        )}
      </dl>
      {brief.description && (
        <p className="mt-3 whitespace-pre-wrap border-t border-hairline-soft pt-3 text-ink-soft">
          {brief.description}
        </p>
      )}
    </div>
  );
}
