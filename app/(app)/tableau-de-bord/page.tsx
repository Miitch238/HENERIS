import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getMyShopperProfile } from "@/lib/queries/shopper";
import { listConversations } from "@/lib/queries/conversations";
import { updateAvailability } from "@/lib/shopper/actions";
import { Rating } from "@/components/shopper/rating";

export const metadata: Metadata = { title: "Tableau de bord" };

const DISPO = [
  { value: "ouvert", label: "Ouvert aux demandes" },
  { value: "complet", label: "Complet" },
  { value: "pause", label: "En pause" },
] as const;

const STATUT: Record<string, string> = {
  en_revue: "En cours de validation",
  actif: "Publié",
  refuse: "Non retenu",
  suspendu: "Suspendu",
};

export default async function TableauDeBordPage({
  searchParams,
}: {
  searchParams: Promise<{ nouveau?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const isShopper = profile.role === "shopper";
  const [shopper, conversations] = await Promise.all([
    isShopper ? getMyShopperProfile() : Promise.resolve(null),
    listConversations(),
  ]);
  const { nouveau } = await searchParams;
  const recent = conversations.slice(0, 4);

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Votre espace</p>
      <h1 className="mt-4 text-3xl md:text-4xl">
        Bonjour {profile.prenom || "et bienvenue"}.
      </h1>

      {nouveau === "profil" && (
        <p className="mt-6 border-l-2 border-success bg-success/8 px-4 py-3 text-[0.9rem] text-success">
          Votre profil a été envoyé. Il apparaîtra dans l&apos;annuaire après
          validation par l&apos;équipe.
        </p>
      )}

      {!isShopper && (
        <div className="mt-8 grid gap-8">
          {recent.length > 0 ? (
            <section>
              <h2 className="text-lg">Conversations récentes</h2>
              <ul className="mt-4 divide-y divide-hairline-soft border border-hairline bg-surface">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/messages/${c.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-sunk"
                    >
                      <span className="min-w-0">
                        <span className="font-medium text-ink">
                          {`${c.other.prenom} ${c.other.nom}`.trim() || "Conversation"}
                        </span>
                        <span className="block truncate text-ink-soft">
                          {c.lastMessage ?? "Nouvelle conversation"}
                        </span>
                      </span>
                      {c.unread > 0 && (
                        <span className="grid size-5 shrink-0 place-items-center bg-gold text-[0.65rem] font-semibold text-ink">
                          {c.unread}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="text-ink-soft">
              Retrouvez ici vos conversations avec les personal shoppers que vous
              contactez.
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/shoppers"
              className="border border-ink px-5 py-2.5 font-medium transition-colors hover:bg-ink hover:text-ground"
            >
              Parcourir les shoppers
            </Link>
            {conversations.length > 4 && (
              <Link href="/messages" className="px-5 py-2.5 font-medium text-gold-deep underline underline-offset-4">
                Toutes les conversations
              </Link>
            )}
          </div>
        </div>
      )}

      {isShopper && !shopper && (
        <>
          <p className="mt-4 text-ink-soft">
            Votre profil de personal shopper n&apos;est pas encore créé.
          </p>
          <div className="mt-8">
            <Link
              href="/devenir-shopper"
              className="inline-flex border border-ink px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-ground"
            >
              Créer mon profil
            </Link>
          </div>
        </>
      )}

      {isShopper && shopper && (
        <div className="mt-8 grid gap-6">
          <div className="grid gap-3 border border-hairline bg-surface p-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-ink-faint">Statut du profil</span>
              <span className="font-medium text-ink">{STATUT[shopper.statut]}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-ink-faint">Note</span>
              <Rating value={shopper.note_moyenne} count={shopper.nb_avis || undefined} />
            </div>
            <form
              action={updateAvailability}
              className="flex items-center justify-between gap-4 border-t border-hairline-soft pt-3"
            >
              <label htmlFor="dispo" className="text-ink-faint">
                Disponibilité
              </label>
              <select
                id="dispo"
                name="disponibilite"
                defaultValue={shopper.disponibilite}
                className="border border-hairline bg-surface px-2 py-1 text-[0.85rem] text-ink"
              >
                {DISPO.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="text-[0.8rem] text-gold-deep underline underline-offset-4"
              >
                Mettre à jour
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/profil"
              className="border border-ink px-5 py-2.5 font-medium transition-colors hover:bg-ink hover:text-ground"
            >
              Modifier mon profil
            </Link>
            {shopper.statut === "actif" && (
              <Link
                href={`/shoppers/${shopper.slug}`}
                className="px-5 py-2.5 font-medium text-gold-deep underline underline-offset-4"
              >
                Voir ma fiche publique
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
