"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { file: File; url: string };

export function ImageInput({
  name,
  label,
  hint,
  multiple = false,
  max = 12,
  currentUrl,
}: {
  name: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  max?: number;
  /** Avatar déjà enregistré (mode édition). */
  currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);

  // Reflète la sélection dans le vrai <input type=file> pour la soumission.
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    items.forEach((it) => dt.items.add(it.file));
    inputRef.current.files = dt.files;
  }, [items]);

  // Révoque toutes les object-URLs au démontage.
  useEffect(() => {
    return () => items.forEach((it) => URL.revokeObjectURL(it.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setItems((prev) => {
      if (!multiple) {
        prev.forEach((it) => URL.revokeObjectURL(it.url));
        return incoming.slice(0, 1);
      }
      return [...prev, ...incoming].slice(0, max);
    });
  };

  const removeAt = (i: number) =>
    setItems((prev) => {
      URL.revokeObjectURL(prev[i]?.url);
      return prev.filter((_, j) => j !== i);
    });

  const canAdd = multiple ? items.length < max : items.length === 0;

  return (
    <div className="grid gap-1.5">
      <span className="text-[0.8rem] font-medium text-ink">{label}</span>

      <div className="flex flex-wrap gap-2">
        {currentUrl && items.length === 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="size-20 border border-hairline object-cover" />
        )}
        {items.map((it, i) => (
          <div key={it.url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.url} alt="" className="size-20 border border-hairline object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Retirer"
              className="absolute -right-2 -top-2 grid size-5 place-items-center bg-ink text-ground"
            >
              <X size={11} />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "grid size-20 place-items-center border border-dashed border-hairline text-ink-faint",
              "transition-colors hover:border-ink-faint hover:text-ink",
            )}
          >
            <ImagePlus size={18} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}
