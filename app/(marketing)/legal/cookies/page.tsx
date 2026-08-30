import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Gestion des cookies",
  description: "Les cookies utilisés par Heneris et vos choix.",
};

export default function CookiesPage() {
  return (
    <ComingSoon
      eyebrow="Légal"
      title="Gestion des cookies"
      description="Ce document sera rédigé et publié à l'étape 7. Une relecture juridique est prévue avant la mise en ligne."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
