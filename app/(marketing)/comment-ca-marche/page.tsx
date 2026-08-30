import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Le parcours Heneris, côté client et côté personal shopper : recherche, mise en relation, messagerie, avis. Et les questions fréquentes.",
};

const PARCOURS_CLIENT = [
  {
    n: "01",
    title: "Explorez l'annuaire",
    body: "Parcourez les profils de personal shoppers et filtrez par budget, spécialité, style et disponibilité. Chaque fiche présente l'approche de la personne et ses réalisations passées.",
  },
  {
    n: "02",
    title: "Contactez la bonne personne",
    body: "Un profil vous parle ? Ouvrez une conversation depuis sa fiche. C'est gratuit et sans engagement.",
  },
  {
    n: "03",
    title: "Décrivez votre besoin",
    body: "Dans la messagerie, expliquez ce que vous cherchez. Vous pouvez joindre un « besoin » structuré — catégorie, budget, délai — ou simplement discuter librement.",
  },
  {
    n: "04",
    title: "Échangez à votre rythme",
    body: "Le shopper vous conseille, propose des pistes, affine avec vous. Vous gardez la main sur chaque décision et chaque achat.",
  },
  {
    n: "05",
    title: "Laissez un avis",
    body: "Une fois l'échange abouti, partagez votre expérience. Votre avis oriente les prochains clients et valorise le travail du shopper.",
  },
] as const;

const PARCOURS_SHOPPER = [
  {
    n: "01",
    title: "Créez votre profil",
    body: "Titre, présentation, spécialités, styles, fourchette de prix, ville, portfolio de vos réalisations. Quelques minutes suffisent.",
  },
  {
    n: "02",
    title: "Attendez la validation",
    body: "L'équipe Heneris relit chaque profil avant publication — c'est ce qui garantit la qualité de l'annuaire. Vous êtes prévenu dès qu'il est en ligne.",
  },
  {
    n: "03",
    title: "Recevez des demandes",
    body: "Les clients intéressés vous écrivent directement dans la messagerie. Vous réglez votre disponibilité — ouvert, complet, en pause — selon votre charge.",
  },
  {
    n: "04",
    title: "Accompagnez vos clients",
    body: "Échangez, conseillez, proposez. Vous fixez votre façon de travailler et vos tarifs avec chaque client.",
  },
  {
    n: "05",
    title: "Construisez votre réputation",
    body: "Les avis de vos clients s'affichent sur votre fiche et alimentent votre note moyenne. Un bon historique attire de nouvelles demandes.",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Heneris prend-il une commission ?",
    a: "Non. La plateforme est gratuite, côté client comme côté personal shopper. Heneris ne gère aucun paiement entre vous : la rémunération du shopper se règle directement entre vous, selon ce que vous convenez ensemble.",
  },
  {
    q: "Comment se passe le paiement d'un shopper ?",
    a: "En dehors de Heneris. La plateforme sert à vous trouver, échanger et vous mettre d'accord ; le règlement de la prestation et des achats se fait entre vous, par le moyen que vous choisissez.",
  },
  {
    q: "Les personal shoppers sont-ils vérifiés ?",
    a: "Chaque profil est relu manuellement par l'équipe avant d'apparaître dans l'annuaire. Un profil qui ne respecte pas nos règles peut être refusé ou retiré à tout moment.",
  },
  {
    q: "Faut-il un gros budget ?",
    a: "Non. Heneris couvre tous les budgets — d'une pièce à trouver pour quelques dizaines d'euros à un accompagnement plus large. Le filtre budget de l'annuaire vous aide à cibler.",
  },
  {
    q: "Dois-je créer un compte pour contacter un shopper ?",
    a: "Oui, un compte client gratuit suffit. Il vous permet de suivre vos conversations au même endroit et de laisser un avis ensuite.",
  },
  {
    q: "Puis-je être à la fois client et personal shopper ?",
    a: "Un compte a un seul rôle. Pour proposer vos services quand vous avez déjà un compte client, créez un compte shopper avec une autre adresse e-mail, ou écrivez-nous.",
  },
  {
    q: "Comment signaler un profil ou un avis problématique ?",
    a: "Via la page contact, en choisissant le sujet « Signaler un profil ou un avis ». Nous examinons chaque signalement.",
  },
] as const;

function Etapes({
  etapes,
}: {
  etapes: ReadonlyArray<{ n: string; title: string; body: string }>;
}) {
  return (
    <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
      {etapes.map((e) => (
        <li key={e.n}>
          <span className="font-serif text-4xl text-hairline">{e.n}</span>
          <h3 className="mt-2 text-xl">{e.title}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {e.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function CommentCaMarchePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <Container className="max-w-4xl py-20 md:py-28">
          <p className="eyebrow">Comment ça marche</p>
          <h1 className="mt-6 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
            De la recherche à la décision, sans intermédiaire compliqué.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Heneris met en relation des personal shoppers et des clients de tous
            budgets. On vous aide à trouver la bonne personne et à échanger —
            l&apos;accompagnement et le règlement se font ensuite entre vous.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#client" variant="outline" size="sm">
              Côté client
            </Button>
            <Button href="#shopper" variant="outline" size="sm">
              Côté personal shopper
            </Button>
          </div>
        </Container>
      </section>

      {/* ── Côté client ───────────────────────────────────────── */}
      <section id="client" className="scroll-mt-24 border-b border-hairline py-20 md:py-28">
        <Container className="max-w-4xl">
          <p className="eyebrow">Côté client</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            Vous cherchez quelqu&apos;un pour vous aider à acheter.
          </h2>
          <Etapes etapes={PARCOURS_CLIENT} />
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button href="/shoppers" variant="primary">
              Trouver un shopper
            </Button>
            <Button href="/inscription" variant="ghost">
              Créer un compte
            </Button>
          </div>
        </Container>
      </section>

      {/* ── Côté personal shopper ─────────────────────────────── */}
      <section
        id="shopper"
        className="scroll-mt-24 border-b border-hairline bg-sunk py-20 md:py-28"
      >
        <Container className="max-w-4xl">
          <p className="eyebrow">Côté personal shopper</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            Vous voulez proposer votre œil et votre temps.
          </h2>
          <Etapes etapes={PARCOURS_SHOPPER} />
          <div className="mt-12">
            <Button href="/devenir-shopper" variant="primary">
              Créer mon profil shopper
            </Button>
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 py-20 md:py-28">
        <Container className="max-w-2xl">
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-4 text-3xl md:text-4xl">Ce qu&apos;on nous demande souvent.</h2>
          <div className="mt-12">
            <Faq items={[...FAQ_ITEMS]} />
          </div>
          <p className="mt-10 text-[0.95rem] text-ink-soft">
            Une autre question&nbsp;?{" "}
            <a
              href="/contact"
              className="text-gold-deep underline underline-offset-4"
            >
              Écrivez-nous
            </a>
            .
          </p>
        </Container>
      </section>

      {/* ── CTA final ─────────────────────────────────────────── */}
      <section className="bg-ink py-20 text-ground md:py-28">
        <Container className="max-w-3xl text-center">
          <p className="eyebrow text-gold">Prêt à commencer</p>
          <h2 className="mt-5 text-3xl text-ground sm:text-4xl">
            Créez votre compte en quelques minutes.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/inscription" variant="gold">
              Créer un compte
            </Button>
            <Button
              href="/shoppers"
              variant="outline"
              className="border-[color-mix(in_oklab,var(--ground)_45%,transparent)] text-ground hover:bg-ground hover:text-ink"
            >
              Parcourir l&apos;annuaire
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
