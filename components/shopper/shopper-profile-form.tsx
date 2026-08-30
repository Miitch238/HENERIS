"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/shopper/actions";
import { Field, Input, FormError, FormNotice } from "@/components/ui/field";
import { TagInput } from "@/components/ui/tag-input";
import { ImageInput } from "@/components/ui/image-input";
import { SubmitButton } from "@/components/auth/submit-button";
import type { ShopperDetail } from "@/lib/queries/shopper";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

const DISPO = [
  { value: "ouvert", label: "Ouvert aux demandes" },
  { value: "complet", label: "Complet" },
  { value: "pause", label: "En pause" },
] as const;

export function ShopperProfileForm({
  action,
  mode,
  initial,
  submitLabel,
}: {
  action: Action;
  mode: "create" | "edit";
  initial?: ShopperDetail;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {} as FormState);

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <FormError>{state.error}</FormError>
      <FormNotice>{state.notice}</FormNotice>

      <ImageInput
        name="avatar"
        label="Photo de profil"
        hint="JPEG, PNG ou WebP — 2 Mo max."
        currentUrl={initial?.profile.avatar_url}
      />

      <Field
        label="Titre"
        htmlFor="titre"
        hint="Ce qui apparaît en premier sur votre fiche."
      >
        <Input
          id="titre"
          name="titre"
          required
          maxLength={80}
          defaultValue={initial?.titre}
          placeholder="Personal shopper mode & seconde main"
        />
      </Field>

      <Field label="Bio" htmlFor="bio" hint="Votre approche, votre expérience, ce que vous aimez chercher.">
        <textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={1500}
          defaultValue={initial?.bio}
          className="w-full border border-hairline bg-surface p-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-faint focus-visible:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold/25"
        />
      </Field>

      <TagInput
        name="specialites"
        label="Spécialités"
        hint="Ex. maroquinerie, sneakers, vintage, déco. 8 max."
        defaultValue={initial?.specialites}
      />

      <TagInput
        name="styles"
        label="Styles"
        hint="Ex. minimaliste, streetwear, chic, bohème. 8 max."
        defaultValue={initial?.styles}
      />

      <Field label="Ville" htmlFor="ville">
        <Input id="ville" name="ville" maxLength={80} defaultValue={initial?.profile.ville ?? ""} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Budget minimum (€)" htmlFor="budget_min">
          <Input
            id="budget_min"
            name="budget_min"
            inputMode="numeric"
            defaultValue={initial?.budget_min ?? ""}
            placeholder="30"
          />
        </Field>
        <Field label="Budget maximum (€)" htmlFor="budget_max">
          <Input
            id="budget_max"
            name="budget_max"
            inputMode="numeric"
            defaultValue={initial?.budget_max ?? ""}
            placeholder="500"
          />
        </Field>
      </div>

      <Field label="Disponibilité" htmlFor="disponibilite">
        <select
          id="disponibilite"
          name="disponibilite"
          defaultValue={initial?.disponibilite ?? "ouvert"}
          className="h-11 w-full border border-hairline bg-surface px-3 text-[0.95rem] text-ink outline-none focus-visible:border-gold-deep"
        >
          {DISPO.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>

      {mode === "create" && (
        <ImageInput
          name="portfolio"
          label="Portfolio"
          hint="Vos réalisations ou inspirations. Jusqu'à 12 images, 5 Mo chacune."
          multiple
          max={12}
        />
      )}

      <SubmitButton pendingLabel="Enregistrement…">{submitLabel}</SubmitButton>
    </form>
  );
}
