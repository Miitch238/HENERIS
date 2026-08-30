import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Personal shoppers",
  description:
    "Parcourez et filtrez les personal shoppers Heneris par budget, spécialité, style et disponibilité.",
};

export default function ShoppersPage() {
  return (
    <ComingSoon
      eyebrow="L'annuaire"
      title="Trouvez votre personal shopper"
      description="La recherche complète — filtres par budget, spécialité, style, disponibilité et note — arrive bientôt. Chaque profil affichera bio, réalisations et avis."
      phase="Étape 4 · Annuaire & recherche"
    />
  );
}
