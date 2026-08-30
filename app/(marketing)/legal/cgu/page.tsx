import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Les règles d'utilisation de la plateforme Heneris.",
};

export default function CguPage() {
  return (
    <ComingSoon
      eyebrow="Légal"
      title="Conditions générales d'utilisation"
      description="Ce document sera rédigé et publié à l'étape 7. Une relecture juridique est prévue avant la mise en ligne."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
