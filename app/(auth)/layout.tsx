import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-md items-center px-5">
          <Logo priority />
        </div>
      </header>
      <main
        id="contenu"
        tabIndex={-1}
        className="flex flex-1 items-start justify-center px-5 py-16 md:py-24"
      >
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-md px-5 py-6 text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink-soft">
            ← Retour au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
