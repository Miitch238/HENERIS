"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, FormError, FormNotice } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";

const INITIAL: AuthState = {};

export function SignInForm() {
  const params = useSearchParams();
  const suite = params.get("suite") ?? "";
  const erreur = params.get("erreur");

  const [state, formAction] = useActionState(signInAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {erreur === "lien_invalide" ? (
        <FormError>Ce lien est invalide ou a expiré. Connectez-vous à nouveau.</FormError>
      ) : null}
      {erreur === "oauth" ? (
        <FormError>La connexion Google a échoué. Réessayez.</FormError>
      ) : null}
      <FormError>{state.error}</FormError>
      <FormNotice>{state.notice}</FormNotice>

      <input type="hidden" name="suite" value={suite} />

      <Field label="Adresse e-mail" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <SubmitButton>Se connecter</SubmitButton>
    </form>
  );
}
