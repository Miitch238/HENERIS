import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "S'inscrire",
  description:
    "Créez votre compte Heneris — côté client ou côté personal shopper.",
};

export default function InscriptionPage() {
  return (
    <div>
      <p className="eyebrow">Rejoindre Heneris</p>
      <h1 className="mt-4 text-3xl">Créer un compte</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        L&apos;inscription avec choix du profil —{" "}
        <span className="text-ink">« Je cherche un shopper »</span> ou{" "}
        <span className="text-ink">« Je suis personal shopper »</span> — est mise
        en place à l&apos;étape 2 du plan.
      </p>
      <p className="mt-8 border border-hairline bg-surface px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
        En cours de construction · Étape 2 · Auth
      </p>
      <p className="mt-8 text-sm text-ink-soft">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="text-gold-deep underline underline-offset-4"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
