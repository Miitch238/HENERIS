"use client";

import { useActionState, useState } from "react";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { Field, Input, FormError, FormNotice } from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";
import { cn } from "@/lib/utils";

const INITIAL: AuthState = {};

const ROLES = [
  {
    value: "client" as const,
    title: "Je cherche un shopper",
    sub: "Trouvez une personne pour vous aider à choisir et acheter.",
  },
  {
    value: "shopper" as const,
    title: "Je suis personal shopper",
    sub: "Créez votre profil et recevez des demandes de clients.",
  },
];

export function SignUpForm({
  defaultRole = "client",
}: {
  defaultRole?: "client" | "shopper";
}) {
  const [role, setRole] = useState<"client" | "shopper">(defaultRole);
  const [state, formAction] = useActionState(signUpAction, INITIAL);

  if (state.notice) {
    return <FormNotice>{state.notice}</FormNotice>;
  }

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormError>{state.error}</FormError>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-[0.8rem] font-medium text-ink">
          Vous êtes…
        </legend>
        {ROLES.map((r) => (
          <label
            key={r.value}
            className={cn(
              "flex cursor-pointer gap-3 border p-3 transition-colors",
              role === r.value
                ? "border-ink bg-sunk"
                : "border-hairline hover:border-ink-faint",
            )}
          >
            <input
              type="radio"
              name="role"
              value={r.value}
              checked={role === r.value}
              onChange={() => setRole(r.value)}
              className="mt-1 accent-ink"
            />
            <span>
              <span className="block text-[0.9rem] font-medium text-ink">
                {r.title}
              </span>
              <span className="block text-[0.8rem] text-ink-soft">{r.sub}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" htmlFor="prenom">
          <Input id="prenom" name="prenom" autoComplete="given-name" required />
        </Field>
        <Field label="Nom" htmlFor="nom">
          <Input id="nom" name="nom" autoComplete="family-name" required />
        </Field>
      </div>

      <Field label="Adresse e-mail" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field
        label="Mot de passe"
        htmlFor="password"
        hint="8 caractères minimum."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      <SubmitButton pendingLabel="Création…">Créer mon compte</SubmitButton>

      <p className="text-xs leading-relaxed text-ink-faint">
        En créant un compte, vous acceptez les{" "}
        <a href="/legal/cgu" className="underline underline-offset-2">
          conditions d&apos;utilisation
        </a>{" "}
        et la{" "}
        <a href="/legal/confidentialite" className="underline underline-offset-2">
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
