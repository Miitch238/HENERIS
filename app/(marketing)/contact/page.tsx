import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/marketing/contact-form";
import { getCurrentProfile } from "@/lib/queries/profile";
import { nowMs } from "@/lib/time";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur Heneris ? Écrivez-nous, nous vous répondrons par e-mail.",
};

// Le timestamp anti-spam doit être frais à chaque affichage.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const me = await getCurrentProfile();
  const defaultNom = me ? `${me.prenom} ${me.nom}`.trim() : "";

  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <p className="eyebrow">Nous écrire</p>
      <h1 className="mt-4 text-3xl md:text-4xl">Contact</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        Une question, un souci, une proposition&nbsp;? Écrivez-nous — nous
        répondons sous quelques jours ouvrés.
      </p>

      <div className="mt-10">
        <ContactForm renduA={nowMs()} defaultNom={defaultNom} />
      </div>

      <p className="mt-10 border-t border-hairline pt-6 text-[0.9rem] text-ink-soft">
        Vous pouvez aussi nous écrire directement à{" "}
        <a
          href="mailto:contact@heneris.com"
          className="text-gold-deep underline underline-offset-4"
        >
          contact@heneris.com
        </a>
        . Pour les questions courantes, voir d&apos;abord la{" "}
        <Link
          href="/comment-ca-marche#faq"
          className="text-gold-deep underline underline-offset-4"
        >
          foire aux questions
        </Link>
        .
      </p>
    </Container>
  );
}
