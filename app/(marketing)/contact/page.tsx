import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur Heneris ? Écrivez-nous.",
};

export default function ContactPage() {
  return (
    <ComingSoon
      eyebrow="Nous écrire"
      title="Contact"
      description="Le formulaire de contact arrive à l'étape 7. En attendant, l'adresse e-mail de l'équipe sera indiquée ici."
      phase="Étape 7 · Pages publiques & légales"
    />
  );
}
