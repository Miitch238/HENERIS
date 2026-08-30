import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/queries/profile";
import { getReviewContext } from "@/lib/queries/reviews";
import { ReviewForm } from "@/components/shopper/review-form";

export const metadata: Metadata = { title: "Laisser un avis" };

export default async function NouvelAvisPage({
  searchParams,
}: {
  searchParams: Promise<{ shopper?: string }>;
}) {
  const { shopper: slug } = await searchParams;
  if (!slug) redirect("/shoppers");

  const me = await getCurrentProfile();
  if (!me) redirect(`/connexion?suite=/avis/nouveau?shopper=${slug}`);
  if (me.role !== "client") redirect(`/shoppers/${slug}`);

  const supabase = await createClient();
  const { data: sp } = await supabase
    .from("shopper_profiles")
    .select("profile_id, slug, titre, profile:profiles!shopper_profiles_profile_id_fkey(prenom,nom)")
    .eq("slug", slug)
    .maybeSingle();
  if (!sp) notFound();

  const prof = Array.isArray(sp.profile) ? sp.profile[0] : sp.profile;
  const name = `${prof?.prenom ?? ""} ${prof?.nom ?? ""}`.trim() || "ce personal shopper";

  const { canReview, existing } = await getReviewContext(sp.profile_id);
  if (!canReview) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl">Laisser un avis</h1>
        <p className="mt-4 text-ink-soft">
          Vous pourrez noter {name} après avoir entamé une conversation.
        </p>
        <Link
          href={`/shoppers/${slug}`}
          className="mt-6 inline-flex text-[0.85rem] text-gold-deep underline underline-offset-4"
        >
          Voir la fiche
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="eyebrow">Votre avis</p>
      <h1 className="mt-4 text-2xl md:text-3xl">
        {existing ? "Modifier votre avis sur" : "Noter"} {name}
      </h1>
      <p className="mt-2 text-[0.9rem] text-ink-soft">{sp.titre}</p>

      <div className="mt-8">
        <ReviewForm
          shopperSlug={slug}
          defaultNote={existing?.note ?? 0}
          defaultComment={existing?.commentaire ?? ""}
        />
      </div>
    </div>
  );
}
