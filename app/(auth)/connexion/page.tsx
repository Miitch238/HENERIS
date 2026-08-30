import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Se connecter",
  description: "Connectez-vous à votre compte Heneris.",
};

export default function ConnexionPage() {
  return (
    <div>
      <p className="eyebrow">Votre compte</p>
      <h1 className="mt-4 text-3xl">Se connecter</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        L&apos;authentification (e-mail + mot de passe, puis Google) est mise en
        place à l&apos;étape 2 du plan.
      </p>
      <p className="mt-8 border border-hairline bg-surface px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
        En cours de construction · Étape 2 · Auth
      </p>
      <p className="mt-8 text-sm text-ink-soft">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="text-gold-deep underline underline-offset-4"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
