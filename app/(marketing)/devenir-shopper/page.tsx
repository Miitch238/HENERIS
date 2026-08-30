import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Devenir personal shopper",
  description:
    "Créez votre profil de personal shopper sur Heneris : spécialités, style, fourchette de prix, portfolio.",
};

export default function DevenirShopperPage() {
  return (
    <ComingSoon
      eyebrow="Côté personal shopper"
      title="Partagez votre œil, accompagnez des clients"
      description="Le formulaire de création de profil — spécialités, style, fourchette de prix, portfolio — arrive à l'étape 3. Chaque profil est validé avant publication."
      phase="Étape 3 · Profils shoppers & portfolio"
    />
  );
}
