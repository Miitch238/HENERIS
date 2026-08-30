"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/shoppers", label: "Trouver un shopper" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/devenir-shopper", label: "Devenir shopper" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Verrouille le scroll de la page quand le menu plein écran est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hairline bg-ground/85 backdrop-blur-sm">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo priority />

          <nav
            className="hidden items-center gap-9 md:flex"
            aria-label="Navigation principale"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[0.82rem] tracking-wide text-ink-soft transition-colors hover:text-ink",
                  pathname.startsWith(link.href) && "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button href="/connexion" variant="ghost" size="sm">
              Se connecter
            </Button>
            <Button href="/inscription" variant="primary" size="sm">
              S&apos;inscrire
            </Button>
          </div>

          <button
            type="button"
            className="-mr-2 inline-flex size-10 items-center justify-center text-ink md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Container>
      </header>

      {/* Menu plein écran — hors du <header> pour ne pas hériter du
          containing-block créé par backdrop-filter. */}
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-ground md:hidden">
          <nav
            className="flex flex-col px-5 pt-4"
            aria-label="Navigation mobile"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-hairline-soft py-5 font-serif text-2xl text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 p-5">
            <Button
              href="/inscription"
              variant="primary"
              className="w-full"
              onClick={close}
            >
              S&apos;inscrire
            </Button>
            <Button
              href="/connexion"
              variant="outline"
              className="w-full"
              onClick={close}
            >
              Se connecter
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
