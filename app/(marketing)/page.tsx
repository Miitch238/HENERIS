import type { Metadata } from "next";
import { MessagesSquare, ShieldCheck, Wallet } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Heneris — Trouvez votre personal shopper",
  description:
    "Mode ou autre, petit budget ou budget conséquent : un personal shopper vous aide à choisir et acheter. Décrivez votre besoin, échangez, décidez.",
};

const STEPS = [
  {
    n: "01",
    title: "Trouvez la bonne personne",
    body: "Parcourez les profils, filtrez par budget, spécialité et style. Chaque personal shopper présente ses domaines, son approche et ses réalisations.",
  },
  {
    n: "02",
    title: "Échangez directement",
    body: "Contactez le shopper qui vous correspond et discutez avec lui via la messagerie. Précisez votre besoin, votre budget, vos envies.",
  },
  {
    n: "03",
    title: "Décidez à votre rythme",
    body: "Vous restez libre. Le shopper vous conseille et vous accompagne ; vous gardez la main sur chaque décision d'achat.",
  },
] as const;

const REASSURANCE = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    body: "Chaque personal shopper est validé par l'équipe Heneris avant d'apparaître dans l'annuaire.",
  },
  {
    icon: MessagesSquare,
    title: "Messagerie intégrée",
    body: "Toute la conversation se passe sur Heneris, au même endroit, du premier échange à la fin de la mission.",
  },
  {
    icon: Wallet,
    title: "Tous les budgets",
    body: "Une pièce à trouver pour trente euros ou un accompagnement plus ambitieux : il y a un shopper pour chaque demande.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <Container className="max-w-5xl py-24 md:py-36">
          <p className="eyebrow">La marketplace des personal shoppers</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            Trouvez la bonne personne pour vous accompagner dans vos achats.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            Mode ou autre, petit budget ou budget conséquent : un personal
            shopper vous aide à choisir et à acheter. Décrivez votre besoin,
            échangez par messagerie, décidez.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/shoppers" variant="primary">
              Trouver un shopper
            </Button>
            <Button href="/devenir-shopper" variant="outline">
              Devenir personal shopper
            </Button>
          </div>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
            Profils vérifiés &nbsp;·&nbsp; Messagerie intégrée &nbsp;·&nbsp; Sans engagement
          </p>
        </Container>
      </section>

      {/* ── Comment ça marche ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Container>
          <p className="eyebrow">Comment ça marche</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            De la recherche à la décision, en trois temps.
          </h2>
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span className="font-serif text-4xl text-hairline">{step.n}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Réassurance ───────────────────────────────────────── */}
      <section className="border-y border-hairline bg-sunk py-20 md:py-28">
        <Container>
          <p className="eyebrow">Pourquoi Heneris</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            La confiance, d&apos;abord.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {REASSURANCE.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon size={22} className="text-gold-deep" aria-hidden />
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA final ─────────────────────────────────────────── */}
      <section className="bg-ink py-24 text-ground md:py-32">
        <Container className="max-w-3xl text-center">
          <p className="eyebrow text-gold">Rejoignez Heneris</p>
          <h2 className="mt-5 text-3xl text-ground sm:text-4xl md:text-5xl">
            Votre prochain achat mérite un regard d&apos;expert.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[color-mix(in_oklab,var(--ground)_70%,transparent)]">
            Créez votre compte en quelques minutes, côté client ou côté personal
            shopper.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/inscription" variant="gold">
              Créer un compte
            </Button>
            <Button
              href="/comment-ca-marche"
              variant="outline"
              className="border-[color-mix(in_oklab,var(--ground)_45%,transparent)] text-ground hover:bg-ground hover:text-ink"
            >
              En savoir plus
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
