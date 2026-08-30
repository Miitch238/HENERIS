import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: React.ReactNode };

/**
 * Liste de questions/réponses en `<details>` natif — aucun JS, l'ouverture est
 * gérée par le navigateur.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-hairline">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-hairline">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.05rem] text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              size={18}
              aria-hidden
              className="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="pb-6 text-[0.95rem] leading-relaxed text-ink-soft">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
