import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/queries/profile";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Votre compte</p>
      <h1 className="mt-4 text-3xl md:text-4xl">Mon profil</h1>
      <p className="mt-4 text-ink-soft">
        L&apos;édition du profil (informations, avatar
        {profile.role === "shopper"
          ? ", bio, spécialités, fourchette de prix, portfolio"
          : ""}
        ) arrive à l&apos;étape 3.
      </p>

      <div className="mt-8 grid gap-3 border border-hairline bg-surface p-5 text-sm">
        <Row label="Prénom" value={profile.prenom || "—"} />
        <Row label="Nom" value={profile.nom || "—"} />
        <Row label="Rôle" value={profile.role === "shopper" ? "Personal shopper" : "Client"} />
        <Row label="Ville" value={profile.ville ?? "—"} />
      </div>

      <p className="mt-8 border border-hairline bg-surface px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
        En cours de construction · Étape 3 · Profils & portfolio
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-faint">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
