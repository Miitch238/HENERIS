import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/shopper/rating";
import { getShopperBySlug } from "@/lib/queries/shopper";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getReviewContext, getReviewsForShopper } from "@/lib/queries/reviews";
import { publicUrl } from "@/lib/storage";

const DISPO_LABEL: Record<string, string> = {
  ouvert: "Ouvert aux demandes",
  complet: "Complet",
  pause: "En pause",
};

function budgetLabel(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${min} – ${max} €`;
  if (min !== null) return `À partir de ${min} €`;
  if (max !== null) return `Jusqu'à ${max} €`;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopperBySlug(slug);
  if (!result) return { title: "Profil introuvable" };

  const { shopper } = result;
  const name = `${shopper.profile.prenom} ${shopper.profile.nom}`.trim();
  const title = `${name || "Personal shopper"} — ${shopper.titre}`;
  const description = shopper.bio.slice(0, 155) || `Personal shopper sur Heneris.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: shopper.profile.avatar_url ? [shopper.profile.avatar_url] : undefined,
    },
  };
}

export default async function ShopperPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ avis?: string }>;
}) {
  const { slug } = await params;
  const { avis } = await searchParams;
  const result = await getShopperBySlug(slug);
  if (!result) notFound();

  const { shopper, isOwner } = result;
  const me = await getCurrentProfile();
  const [reviews, reviewCtx] = await Promise.all([
    getReviewsForShopper(shopper.profile_id),
    getReviewContext(shopper.profile_id),
  ]);
  const name = `${shopper.profile.prenom} ${shopper.profile.nom}`.trim() || "Personal shopper";
  const budget = budgetLabel(shopper.budget_min, shopper.budget_max);
  const avatar = shopper.profile.avatar_url;

  const contactHref = !me
    ? `/connexion?suite=/shoppers/${slug}`
    : me.role === "client"
      ? `/messages/nouveau?shopper=${slug}`
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      description: shopper.bio || undefined,
      image: avatar || undefined,
      address: shopper.profile.ville
        ? { "@type": "PostalAddress", addressLocality: shopper.profile.ville }
        : undefined,
      knowsAbout: [...shopper.specialites, ...shopper.styles],
      ...(shopper.note_moyenne !== null && shopper.nb_avis > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: shopper.note_moyenne,
              reviewCount: shopper.nb_avis,
              bestRating: 5,
            },
          }
        : {}),
    },
  };

  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isOwner && shopper.statut !== "actif" && (
        <div className="mb-8 border-l-2 border-warning bg-warning/8 px-4 py-3 text-[0.9rem] text-ink-soft">
          Aperçu de votre fiche. Elle n&apos;est pas encore visible du public —
          statut&nbsp;: <strong>en cours de validation</strong>.
        </div>
      )}

      <Link
        href="/shoppers"
        className="text-[0.8rem] text-ink-faint hover:text-ink-soft"
      >
        ← Tous les personal shoppers
      </Link>

      <header className="mt-6 flex flex-col gap-6 border-b border-hairline pb-10 sm:flex-row sm:items-start">
        <Avatar url={avatar} name={name} px={112} />

        <div className="flex-1">
          <p className="eyebrow">{DISPO_LABEL[shopper.disponibilite]}</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{name}</h1>
          <p className="mt-1 font-serif text-lg italic text-ink-soft">{shopper.titre}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.85rem] text-ink-soft">
            {shopper.profile.ville && <span>{shopper.profile.ville}</span>}
            {budget && <span>{budget}</span>}
            <Rating value={shopper.note_moyenne} count={shopper.nb_avis || undefined} />
          </div>

          <div className="mt-6">
            {contactHref ? (
              <Button href={contactHref} variant="primary">
                Contacter {shopper.profile.prenom}
              </Button>
            ) : isOwner ? (
              <Button href="/profil" variant="outline">
                Modifier mon profil
              </Button>
            ) : (
              <p className="text-[0.85rem] text-ink-faint">
                Connectez-vous avec un compte client pour contacter ce shopper.
              </p>
            )}
          </div>
        </div>
      </header>

      {shopper.bio && (
        <section className="border-b border-hairline py-10">
          <h2 className="eyebrow">À propos</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">
            {shopper.bio}
          </p>
        </section>
      )}

      {(shopper.specialites.length > 0 || shopper.styles.length > 0) && (
        <section className="border-b border-hairline py-10">
          {shopper.specialites.length > 0 && (
            <div>
              <h2 className="eyebrow">Spécialités</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {shopper.specialites.map((s) => (
                  <li key={s} className="bg-sunk px-3 py-1 text-[0.85rem] text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {shopper.styles.length > 0 && (
            <div className="mt-6">
              <h2 className="eyebrow">Styles</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {shopper.styles.map((s) => (
                  <li key={s} className="bg-sunk px-3 py-1 text-[0.85rem] text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {shopper.portfolio.length > 0 && (
        <section className="border-b border-hairline py-10">
          <h2 className="eyebrow">Réalisations</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {shopper.portfolio.map((item) => (
              <li
                key={item.id}
                className="relative aspect-square border border-hairline"
              >
                <Image
                  src={publicUrl("portfolios", item.image_path) ?? ""}
                  alt={item.legende || `Réalisation de ${name}`}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="eyebrow">
            Avis{shopper.nb_avis > 0 ? ` · ${shopper.nb_avis}` : ""}
          </h2>
          {reviewCtx.canReview && (
            <Link
              href={`/avis/nouveau?shopper=${slug}`}
              className="text-[0.82rem] text-gold-deep underline underline-offset-4"
            >
              {reviewCtx.existing ? "Modifier mon avis" : "Laisser un avis"}
            </Link>
          )}
        </div>

        {avis === "merci" && (
          <p className="mt-4 border-l-2 border-success bg-success/8 px-4 py-3 text-[0.88rem] text-success">
            Merci, votre avis a été publié.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="mt-4 text-[0.9rem] text-ink-soft">
            Ce personal shopper n&apos;a pas encore reçu d&apos;avis.
          </p>
        ) : (
          <ul className="mt-6 grid gap-6">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-hairline-soft pb-6 last:border-0">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex"
                    role="img"
                    aria-label={`${r.note} sur 5`}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        aria-hidden
                        className={n <= r.note ? "fill-gold text-gold" : "text-hairline"}
                      />
                    ))}
                  </span>
                  <span className="text-[0.82rem] text-ink-soft">
                    {r.author.prenom} {r.author.nom.charAt(0)}.
                  </span>
                  <span className="text-[0.75rem] text-ink-faint">
                    {new Date(r.created_at).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {r.commentaire && (
                  <p className="mt-2 leading-relaxed text-ink-soft">{r.commentaire}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
