"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/lib/contact/actions";
import { CONTACT_SUJETS } from "@/lib/validation/contact";
import {
  Field,
  Input,
  Select,
  Textarea,
  FormError,
  FormNotice,
} from "@/components/ui/field";
import { SubmitButton } from "@/components/auth/submit-button";

const INITIAL: ContactState = {};

export function ContactForm({
  renduA,
  defaultNom = "",
}: {
  /** Timestamp posé côté serveur au rendu de la page (piège temporel anti-bot). */
  renduA: number;
  defaultNom?: string;
}) {
  const [state, formAction] = useActionState(sendContactMessage, INITIAL);

  if (state.notice) return <FormNotice>{state.notice}</FormNotice>;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormError>{state.error}</FormError>

      {/* Honeypot — masqué aux humains, rempli par les bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Entreprise
          <input
            type="text"
            name="entreprise"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <input type="hidden" name="rendu_a" value={renduA} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" htmlFor="nom">
          <Input
            id="nom"
            name="nom"
            autoComplete="name"
            defaultValue={defaultNom}
            required
          />
        </Field>
        <Field label="Adresse e-mail" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <Field label="Sujet" htmlFor="sujet">
        <Select id="sujet" name="sujet" defaultValue={CONTACT_SUJETS[0]}>
          {CONTACT_SUJETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" htmlFor="message">
        <Textarea id="message" name="message" rows={6} required />
      </Field>

      <SubmitButton pendingLabel="Envoi…">Envoyer</SubmitButton>
    </form>
  );
}
