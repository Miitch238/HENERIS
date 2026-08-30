import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries/profile";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Se connecter",
  description: "Connectez-vous à votre compte Heneris.",
};

export default async function ConnexionPage() {
  if (await getCurrentProfile()) redirect("/tableau-de-bord");

  return (
    <div>
      <p className="eyebrow">Votre compte</p>
      <h1 className="mt-4 text-3xl">Se connecter</h1>

      <div className="mt-8">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-col gap-1 text-sm text-ink-soft">
        <Link
          href="/mot-de-passe-oublie"
          className="text-gold-deep underline underline-offset-4"
        >
          Mot de passe oublié ?
        </Link>
        <span>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="text-gold-deep underline underline-offset-4"
          >
            S&apos;inscrire
          </Link>
        </span>
      </div>
    </div>
  );
}
