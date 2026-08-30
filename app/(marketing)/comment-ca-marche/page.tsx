import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Le parcours Heneris côté client et côté personal shopper : recherche, mise en relation, messagerie, avis.",
};

export default function CommentCaMarchePage() {
  return (
    <ComingSoon
      eyebrow="La plateforme"
      title="Comment ça marche"
      description="Le détail du parcours, côté client et côté personal shopper, avec les questions fréquentes — bientôt disponible."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
