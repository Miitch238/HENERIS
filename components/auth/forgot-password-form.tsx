"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, FormError, FormNotice } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";

const INITIAL: AuthState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, INITIAL);

  if (state.notice) return <FormNotice>{state.notice}</FormNotice>;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormError>{state.error}</FormError>
      <Field
        label="Adresse e-mail"
        htmlFor="email"
        hint="Nous vous enverrons un lien pour choisir un nouveau mot de passe."
      >
        <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </Field>
      <SubmitButton pendingLabel="Envoi…">Envoyer le lien</SubmitButton>
    </form>
  );
}
