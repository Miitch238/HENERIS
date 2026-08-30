"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { PortfolioItemRow } from "@/types/database";
import type { FormState } from "@/lib/shopper/actions";
import { addPortfolioImages, removePortfolioItem } from "@/lib/shopper/actions";
import { publicUrl } from "@/lib/storage";
import { ImageInput } from "@/components/ui/image-input";
import { FormError, FormNotice } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";

export function PortfolioManager({ items }: { items: PortfolioItemRow[] }) {
  const [state, addAction] = useActionState(addPortfolioImages, {} as FormState);
  const slotsLeft = 12 - items.length;

  return (
    <div className="grid gap-5">
      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="relative aspect-square border border-hairline">
              <Image
                src={publicUrl("portfolios", item.image_path) ?? ""}
                alt={item.legende || "Réalisation"}
                fill
                sizes="(min-width: 640px) 25vw, 33vw"
                className="object-cover"
              />
              <form action={removePortfolioItem}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  aria-label="Supprimer cette image"
                  className="absolute right-1 top-1 grid size-6 place-items-center bg-ink/80 text-[0.65rem] text-ground hover:bg-ink"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {slotsLeft > 0 ? (
        <form action={addAction} className="grid gap-3">
          <FormError>{state.error}</FormError>
          <FormNotice>{state.notice}</FormNotice>
          <ImageInput
            name="portfolio"
            label={items.length ? "Ajouter des images" : "Portfolio"}
            hint={`${slotsLeft} emplacement${slotsLeft > 1 ? "s" : ""} restant${slotsLeft > 1 ? "s" : ""} — JPEG/PNG/WebP, 5 Mo max.`}
            multiple
            max={slotsLeft}
          />
          <div>
            <SubmitButton pendingLabel="Envoi…" className="w-auto px-6">
              Ajouter
            </SubmitButton>
          </div>
        </form>
      ) : (
        <p className="text-[0.85rem] text-ink-faint">
          Portfolio complet (12 images). Supprimez-en une pour en ajouter.
        </p>
      )}
    </div>
  );
}
