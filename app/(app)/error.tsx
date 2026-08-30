"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="eyebrow">Une erreur est survenue</p>
      <h1 className="mt-4 text-2xl md:text-3xl">
        Cette page n&apos;a pas pu s&apos;afficher.
      </h1>
      <p className="mt-4 text-[0.95rem] text-ink-soft">
        Réessayez dans un instant. Si le problème persiste, écrivez-nous.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-[0.85rem] font-medium tracking-wide transition-colors hover:bg-ink hover:text-ground"
      >
        Réessayer
      </button>
    </div>
  );
}
