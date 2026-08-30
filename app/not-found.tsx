import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Logo href="/" />
      <p className="eyebrow mt-14">Erreur 404</p>
      <h1 className="mt-4 text-4xl md:text-5xl">Cette page n&apos;existe pas.</h1>
      <p className="mt-5 max-w-md text-ink-soft">
        Le lien est peut-être incorrect, ou la page a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center border border-ink px-7 text-[0.85rem] font-medium tracking-wide transition-colors hover:bg-ink hover:text-ground"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
