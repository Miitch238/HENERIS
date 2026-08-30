import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getMyShopperProfile } from "@/lib/queries/shopper";
import { ShopperProfileForm } from "@/components/shopper/shopper-profile-form";
import { createShopperProfile } from "@/lib/shopper/actions";

export const metadata: Metadata = {
  title: "Devenir personal shopper",
  description:
    "Créez votre profil de personal shopper sur Heneris : spécialités, style, fourchette de prix, portfolio.",
};

const ARGUMENTS = [
  "Vous choisissez vos missions et votre rythme.",
  "Vous fixez votre fourchette de prix et vos spécialités.",
  "Les échanges se font par la messagerie intégrée, au même endroit.",
  "Votre profil est relu par l'équipe avant d'apparaître dans l'annuaire.",
];

export default async function DevenirShopperPage() {
  const me = await getCurrentProfile();

  // Shopper avec profil déjà créé → édition
  if (me?.role === "shopper" && (await getMyShopperProfile())) redirect("/profil");

  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <p className="eyebrow">Côté personal shopper</p>
      <h1 className="mt-5 text-4xl md:text-5xl">
        Partagez votre œil, accompagnez des clients.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        Heneris met votre expertise en relation avec des clients qui cherchent la
        bonne personne — mode ou autre, tous budgets.
      </p>

      <ul className="mt-10 grid gap-3">
        {ARGUMENTS.map((a) => (
          <li key={a} className="flex gap-3 text-[0.95rem] text-ink-soft">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
            {a}
          </li>
        ))}
      </ul>

      <div className="mt-12 border-t border-hairline pt-12">
        {!me ? (
          <div>
            <h2 className="text-2xl">Créez d&apos;abord votre compte</h2>
            <p className="mt-3 text-ink-soft">
              Choisissez « Je suis personal shopper » à l&apos;inscription.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/inscription?role=shopper" variant="primary">
                Créer un compte shopper
              </Button>
              <Button href="/connexion?suite=/devenir-shopper" variant="ghost">
                J&apos;ai déjà un compte
              </Button>
            </div>
          </div>
        ) : me.role !== "shopper" ? (
          <div className="border-l-2 border-warning bg-warning/8 px-4 py-3 text-[0.9rem] text-ink-soft">
            Votre compte est un compte client. Pour proposer vos services,
            créez un compte personal shopper avec une autre adresse e-mail, ou
            contactez-nous via la{" "}
            <Link href="/contact" className="underline underline-offset-2">
              page contact
            </Link>
            .
          </div>
        ) : (
          <div>
            <h2 className="text-2xl">Votre profil</h2>
            <p className="mt-3 text-[0.9rem] text-ink-soft">
              Il sera relu avant d&apos;apparaître dans l&apos;annuaire. Vous
              pourrez le compléter ensuite.
            </p>
            <div className="mt-8">
              <ShopperProfileForm
                action={createShopperProfile}
                mode="create"
                submitLabel="Envoyer mon profil"
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
