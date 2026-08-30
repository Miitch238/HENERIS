"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const DISPO = [
  { value: "", label: "Toute disponibilité" },
  { value: "ouvert", label: "Ouvert aux demandes" },
  { value: "complet", label: "Complet" },
  { value: "pause", label: "En pause" },
];

const NOTE = [
  { value: "", label: "Toute note" },
  { value: "4", label: "4 et plus" },
  { value: "4.5", label: "4,5 et plus" },
];

const TRI = [
  { value: "pertinence", label: "Pertinence" },
  { value: "note", label: "Mieux notés" },
  { value: "recent", label: "Plus récents" },
];

const selectClass =
  "h-10 border border-hairline bg-surface px-2 text-[0.82rem] text-ink transition-colors focus-visible:border-gold-deep";

export function ShopperFilters({ specialiteOptions }: { specialiteOptions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const current = {
    specialites: params.get("specialite")?.split(",").filter(Boolean) ?? [],
    disponibilite: params.get("dispo") ?? "",
    budget: params.get("budget") ?? "",
    note: params.get("note") ?? "",
    ville: params.get("ville") ?? "",
    tri: params.get("tri") ?? "pertinence",
  };

  const push = useCallback(
    (patch: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        const v = Array.isArray(value) ? value.join(",") : value;
        if (!v) next.delete(key);
        else next.set(key, v);
      }
      next.delete("page");
      startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [params, pathname, router],
  );

  const toggleSpecialite = (s: string) => {
    const set = new Set(current.specialites);
    if (set.has(s)) set.delete(s);
    else set.add(s);
    push({ specialite: [...set] });
  };

  const activeCount =
    current.specialites.length +
    [current.disponibilite, current.budget, current.note, current.ville].filter(Boolean).length;

  return (
    <div className={cn("border border-hairline bg-surface", pending && "opacity-60")}>
      <div className="flex items-center justify-between gap-3 p-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft"
        >
          Filtres{activeCount ? ` · ${activeCount}` : ""}
        </button>
        <select
          value={current.tri}
          onChange={(e) => push({ tri: e.target.value === "pertinence" ? null : e.target.value })}
          className={selectClass}
          aria-label="Trier"
        >
          {TRI.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className={cn("grid gap-3 p-3 md:flex md:flex-wrap md:items-center", !open && "hidden md:flex")}>
        <input
          type="search"
          placeholder="Ville"
          defaultValue={current.ville}
          onBlur={(e) => e.target.value !== current.ville && push({ ville: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") push({ ville: (e.target as HTMLInputElement).value });
          }}
          className="h-10 border border-hairline bg-surface px-2 text-[0.82rem] text-ink transition-colors focus-visible:border-gold-deep"
          aria-label="Filtrer par ville"
        />

        <select
          value={current.budget}
          onChange={(e) => push({ budget: e.target.value })}
          className={selectClass}
          aria-label="Budget"
        >
          <option value="">Tout budget</option>
          <option value="50">≤ 50 €</option>
          <option value="150">≤ 150 €</option>
          <option value="300">≤ 300 €</option>
          <option value="1000">≤ 1000 €</option>
        </select>

        <select
          value={current.disponibilite}
          onChange={(e) => push({ dispo: e.target.value })}
          className={selectClass}
          aria-label="Disponibilité"
        >
          {DISPO.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <select
          value={current.note}
          onChange={(e) => push({ note: e.target.value })}
          className={selectClass}
          aria-label="Note minimale"
        >
          {NOTE.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        <select
          value={current.tri}
          onChange={(e) => push({ tri: e.target.value === "pertinence" ? null : e.target.value })}
          className={cn(selectClass, "hidden md:block md:ml-auto")}
          aria-label="Trier"
        >
          {TRI.map((t) => (
            <option key={t.value} value={t.value}>
              Trier : {t.label}
            </option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-[0.78rem] text-gold-deep underline underline-offset-4"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {specialiteOptions.length > 0 && (
        <div className={cn("flex flex-wrap gap-1.5 border-t border-hairline-soft p-3", !open && "hidden md:flex")}>
          {specialiteOptions.map((s) => {
            const active = current.specialites.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecialite(s)}
                className={cn(
                  "px-2.5 py-1 text-[0.78rem] transition-colors",
                  active ? "bg-ink text-ground" : "bg-sunk text-ink-soft hover:text-ink",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
