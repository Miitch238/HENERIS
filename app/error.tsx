"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">Une erreur est survenue</p>
      <h1 className="mt-4 text-4xl md:text-5xl">Quelque chose s&apos;est mal passé.</h1>
      <p className="mt-5 max-w-md text-ink-soft">
        Nous en sommes désolés. Réessayez, ou revenez un peu plus tard.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 inline-flex h-12 items-center border border-ink px-7 text-[0.85rem] font-medium tracking-wide transition-colors hover:bg-ink hover:text-ground"
      >
        Réessayer
      </button>
    </div>
  );
}
