import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries/profile";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { GoogleButton } from "@/components/auth/google-button";
import { OrDivider } from "@/components/auth/or-divider";

export const metadata: Metadata = {
  title: "S'inscrire",
  description:
    "Créez votre compte Heneris — côté client ou côté personal shopper.",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  if (await getCurrentProfile()) redirect("/tableau-de-bord");

  const { role } = await searchParams;
  const defaultRole = role === "shopper" ? "shopper" : "client";

  return (
    <div>
      <p className="eyebrow">Rejoindre Heneris</p>
      <h1 className="mt-4 text-3xl">Créer un compte</h1>

      <div className="mt-8 grid gap-3">
        <GoogleButton label="S'inscrire avec Google" />
        <p className="text-xs text-ink-faint">
          Avec Google, vous créez un compte client. Personal shopper&nbsp;?
          Inscrivez-vous par e-mail ci-dessous.
        </p>
      </div>

      <div className="mt-6">
        <OrDivider />
      </div>

      <div className="mt-6">
        <SignUpForm defaultRole={defaultRole} />
      </div>

      <p className="mt-6 text-sm text-ink-soft">
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
