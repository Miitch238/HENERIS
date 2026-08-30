"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview, type ReviewState } from "@/lib/reviews/actions";
import { FormError } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";
import { cn } from "@/lib/utils";

export function ReviewForm({
  shopperSlug,
  defaultNote = 0,
  defaultComment = "",
}: {
  shopperSlug: string;
  defaultNote?: number;
  defaultComment?: string;
}) {
  const [note, setNote] = useState(defaultNote);
  const [hover, setHover] = useState(0);
  const [state, formAction] = useActionState(submitReview, {} as ReviewState);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <input type="hidden" name="shopperSlug" value={shopperSlug} />
      <input type="hidden" name="note" value={note} />
      <FormError>{state.error}</FormError>

      <div>
        <span className="text-[0.8rem] font-medium text-ink">Votre note</span>
        <div
          className="mt-2 flex gap-1"
          onMouseLeave={() => setHover(0)}
          role="radiogroup"
          aria-label="Note sur 5"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={note === n}
              aria-label={`${n} sur 5`}
              onMouseEnter={() => setHover(n)}
              onClick={() => setNote(n)}
              className="p-0.5"
            >
              <Star
                size={26}
                className={cn(
                  "transition-colors",
                  (hover || note) >= n ? "fill-gold text-gold" : "text-hairline",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="commentaire" className="text-[0.8rem] font-medium text-ink">
          Commentaire <span className="text-ink-faint">(facultatif)</span>
        </label>
        <textarea
          id="commentaire"
          name="commentaire"
          rows={4}
          maxLength={1500}
          defaultValue={defaultComment}
          placeholder="Comment s'est passé votre échange ?"
          className="w-full border border-hairline bg-surface p-3 text-[0.95rem] text-ink outline-none focus-visible:border-gold-deep"
        />
      </div>

      <div>
        <SubmitButton className="w-auto px-6">
          {defaultNote ? "Mettre à jour mon avis" : "Publier mon avis"}
        </SubmitButton>
      </div>
    </form>
  );
}
