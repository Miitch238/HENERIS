import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Heneris collecte, utilise et protège vos données personnelles (RGPD).",
};

export default function ConfidentialitePage() {
  return (
    <ComingSoon
      eyebrow="Légal"
      title="Politique de confidentialité"
      description="Ce document sera rédigé et publié à l'étape 7. Une relecture juridique est prévue avant la mise en ligne."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
