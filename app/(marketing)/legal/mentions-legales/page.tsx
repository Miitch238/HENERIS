import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales relatives à Heneris et à l'éditeur du site.",
};

export default function MentionsLegalesPage() {
  return (
    <ComingSoon
      eyebrow="Légal"
      title="Mentions légales"
      description="Ce document sera rédigé et publié à l'étape 7. Une relecture juridique est prévue avant la mise en ligne."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
