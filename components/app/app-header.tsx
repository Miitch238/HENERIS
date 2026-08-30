import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { signOutAction } from "@/lib/auth/actions";
import type { ProfileRow } from "@/types/database";

const LINKS = [
  { href: "/tableau-de-bord", label: "Tableau de bord" },
  { href: "/messages", label: "Messages" },
  { href: "/profil", label: "Mon profil" },
] as const;

export function AppHeader({ profile }: { profile: ProfileRow }) {
  const initials =
    `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase() || "·";

  return (
    <header className="border-b border-hairline bg-ground">
      <Container className="flex h-16 items-center gap-6">
        <Logo priority />

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Navigation de l'espace"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.82rem] text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span
            className="grid size-8 place-items-center bg-ink text-[0.7rem] font-semibold text-gold"
            aria-hidden
          >
            {initials}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-[0.8rem] text-ink-faint transition-colors hover:text-ink"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </Container>

      <Container className="flex gap-5 overflow-x-auto border-t border-hairline-soft py-2 md:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 text-[0.8rem] text-ink-soft"
          >
            {l.label}
          </Link>
        ))}
      </Container>
    </header>
  );
}
