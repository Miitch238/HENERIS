import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte Heneris.",
};

export default function MotDePasseOubliePage() {
  return (
    <div>
      <p className="eyebrow">Votre compte</p>
      <h1 className="mt-4 text-3xl">Mot de passe oublié</h1>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        <Link href="/connexion" className="text-gold-deep underline underline-offset-4">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
