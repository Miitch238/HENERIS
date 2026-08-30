import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "La plateforme",
    links: [
      { href: "/shoppers", label: "Trouver un shopper" },
      { href: "/comment-ca-marche", label: "Comment ça marche" },
      { href: "/devenir-shopper", label: "Devenir personal shopper" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/comment-ca-marche", label: "Questions fréquentes" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/legal/mentions-legales", label: "Mentions légales" },
      { href: "/legal/cgu", label: "CGU" },
      { href: "/legal/confidentialite", label: "Confidentialité" },
      { href: "/legal/cookies", label: "Cookies" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-[color-mix(in_oklab,var(--ground)_78%,transparent)]">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-20">
        <div>
          <Logo tone="light" height={22} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[color-mix(in_oklab,var(--ground)_60%,transparent)]">
            La marketplace qui met en relation personal shoppers et clients,
            quel que soit le budget.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
              {col.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color-mix(in_oklab,var(--ground)_72%,transparent)] transition-colors hover:text-ground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-[color-mix(in_oklab,var(--ground)_14%,transparent)]">
        <Container className="flex flex-col gap-2 py-6 text-xs text-[color-mix(in_oklab,var(--ground)_45%,transparent)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Heneris. Tous droits réservés.</p>
          <p className="font-mono tracking-wide">heneris.com</p>
        </Container>
      </div>
    </footer>
  );
}
