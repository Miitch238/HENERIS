"use client";

import { useActionState } from "react";
import { updateClientProfile, type FormState } from "@/lib/shopper/actions";
import { Field, Input, FormError, FormNotice } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";
import type { ProfileRow } from "@/types/database";

export function ClientProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction] = useActionState(updateClientProfile, {} as FormState);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormError>{state.error}</FormError>
      <FormNotice>{state.notice}</FormNotice>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" htmlFor="prenom">
          <Input id="prenom" name="prenom" required defaultValue={profile.prenom} />
        </Field>
        <Field label="Nom" htmlFor="nom">
          <Input id="nom" name="nom" required defaultValue={profile.nom} />
        </Field>
      </div>

      <Field label="Ville" htmlFor="ville">
        <Input id="ville" name="ville" defaultValue={profile.ville ?? ""} />
      </Field>

      <div>
        <SubmitButton className="w-auto px-6">Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
