import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getMyShopperProfile } from "@/lib/queries/shopper";
import { updateShopperProfile } from "@/lib/shopper/actions";
import { ShopperProfileForm } from "@/components/shopper/shopper-profile-form";
import { PortfolioManager } from "@/components/shopper/portfolio-manager";
import { ClientProfileForm } from "@/components/shopper/client-profile-form";

export const metadata: Metadata = { title: "Mon profil" };

const STATUT_LABEL: Record<string, { text: string; tone: string }> = {
  en_revue: { text: "En cours de validation", tone: "text-warning" },
  actif: { text: "Publié", tone: "text-success" },
  refuse: { text: "Non retenu", tone: "text-danger" },
  suspendu: { text: "Suspendu", tone: "text-danger" },
};

export default async function ProfilPage() {
  const me = await getCurrentProfile();
  if (!me) return null;

  if (me.role !== "shopper") {
    return (
      <div className="max-w-xl">
        <p className="eyebrow">Votre compte</p>
        <h1 className="mt-4 text-3xl md:text-4xl">Mon profil</h1>
        <div className="mt-8">
          <ClientProfileForm profile={me} />
        </div>
      </div>
    );
  }

  const shopper = await getMyShopperProfile();

  if (!shopper) {
    return (
      <div className="max-w-xl">
        <p className="eyebrow">Personal shopper</p>
        <h1 className="mt-4 text-3xl md:text-4xl">Créez votre profil</h1>
        <p className="mt-4 text-ink-soft">
          Vous n&apos;avez pas encore de profil visible.{" "}
          <Link href="/devenir-shopper" className="text-gold-deep underline underline-offset-4">
            Le créer maintenant
          </Link>
          .
        </p>
      </div>
    );
  }

  const statut = STATUT_LABEL[shopper.statut];

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Personal shopper</p>
      <h1 className="mt-4 text-3xl md:text-4xl">Mon profil</h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-hairline bg-surface p-4 text-sm">
        <span className="text-ink-faint">
          Statut&nbsp;: <span className={`font-medium ${statut.tone}`}>{statut.text}</span>
        </span>
        {shopper.statut === "actif" && (
          <Link
            href={`/shoppers/${shopper.slug}`}
            className="text-gold-deep underline underline-offset-4"
          >
            Voir ma fiche publique
          </Link>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl">Informations</h2>
        <div className="mt-5">
          <ShopperProfileForm
            action={updateShopperProfile}
            mode="edit"
            initial={shopper}
            submitLabel="Enregistrer"
          />
        </div>
      </section>

      <section className="mt-14 border-t border-hairline pt-12">
        <h2 className="text-xl">Portfolio</h2>
        <p className="mt-2 text-[0.9rem] text-ink-soft">
          Vos réalisations ou inspirations, affichées sur votre fiche.
        </p>
        <div className="mt-6">
          <PortfolioManager items={shopper.portfolio} />
        </div>
      </section>
    </div>
  );
}
