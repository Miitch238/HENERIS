import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries/profile";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function TableauDeBordPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // le layout redirige déjà

  const isShopper = profile.role === "shopper";

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Votre espace</p>
      <h1 className="mt-4 text-3xl md:text-4xl">
        Bonjour {profile.prenom || "et bienvenue"}.
      </h1>
      <p className="mt-4 text-ink-soft">
        {isShopper
          ? "Votre espace personal shopper. Complétez votre profil pour apparaître dans l'annuaire, puis suivez vos conversations et vos avis ici."
          : "Votre espace client. Retrouvez ici vos conversations avec les personal shoppers que vous contactez."}
      </p>

      <div className="mt-10 grid gap-3 border border-hairline bg-surface p-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-ink-faint">Rôle</span>
          <span className="font-medium text-ink">
            {isShopper ? "Personal shopper" : "Client"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink-faint">Étapes à venir</span>
          <span className="text-right text-ink-soft">
            {isShopper
              ? "Création de profil (étape 3), messagerie (étape 5)"
              : "Annuaire (étape 4), messagerie (étape 5)"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        {isShopper ? (
          <Link
            href="/devenir-shopper"
            className="border border-ink px-5 py-2.5 font-medium transition-colors hover:bg-ink hover:text-ground"
          >
            Compléter mon profil
          </Link>
        ) : (
          <Link
            href="/shoppers"
            className="border border-ink px-5 py-2.5 font-medium transition-colors hover:bg-ink hover:text-ground"
          >
            Parcourir les shoppers
          </Link>
        )}
      </div>
    </div>
  );
}
