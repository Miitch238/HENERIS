import Link from "next/link";
import { Container } from "@/components/ui/container";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Étape du plan de reconstruction où cette page sera livrée. */
  phase: string;
};

/**
 * Placeholder pour les pages dont le contenu réel arrive dans une étape
 * ultérieure du plan. Garde le site navigable de bout en bout pendant le dev.
 */
export function ComingSoon({ eyebrow, title, description, phase }: ComingSoonProps) {
  return (
    <Container className="max-w-2xl py-28 md:py-40">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 text-4xl md:text-5xl">{title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-10 inline-block border border-hairline bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
        En cours de construction · {phase}
      </p>
      <p className="mt-10 text-sm text-ink-soft">
        <Link href="/" className="text-gold-deep underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </p>
    </Container>
  );
}
