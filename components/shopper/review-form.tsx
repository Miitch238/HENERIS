"use client";

import { useActionState, useRef, useState } from "react";
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
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sélectionne une note et déplace le focus sur l'étoile correspondante
  // (motif radiogroup : une seule étoile dans l'ordre de tabulation).
  const pick = (n: number) => {
    const v = Math.min(5, Math.max(1, n));
    setNote(v);
    starRefs.current[v - 1]?.focus();
  };

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
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              pick((note || 0) + 1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              pick((note || 1) - 1);
            } else if (e.key === "Home") {
              e.preventDefault();
              pick(1);
            } else if (e.key === "End") {
              e.preventDefault();
              pick(5);
            }
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              ref={(el) => {
                starRefs.current[n - 1] = el;
              }}
              type="button"
              role="radio"
              aria-checked={note === n}
              aria-label={`${n} sur 5`}
              tabIndex={note === n || (note === 0 && n === 1) ? 0 : -1}
              onMouseEnter={() => setHover(n)}
              onClick={() => pick(n)}
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
          className="w-full border border-hairline bg-surface p-3 text-[0.95rem] text-ink transition-colors focus-visible:border-gold-deep"
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
