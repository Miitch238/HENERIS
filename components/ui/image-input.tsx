"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Reflète `files` dans le vrai <input type=file> pour la soumission du formulaire.
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    inputRef.current.files = dt.files;
  }, [files]);

  // URLs d'aperçu (révoquées au démontage).
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const onPick = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) =>
      multiple ? [...prev, ...incoming].slice(0, max) : incoming.slice(0, 1),
    );
  };

  const removeAt = (i: number) => setFiles((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="grid gap-1.5">
      <span className="text-[0.8rem] font-medium text-ink">{label}</span>

      <div className="flex flex-wrap gap-2">
        {currentUrl && previews.length === 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="size-20 border border-hairline object-cover" />
        )}
        {previews.map((url, i) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-20 border border-hairline object-cover" />
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

        {(multiple ? files.length < max : files.length === 0) && (
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
          onPick(e.target.files);
          e.target.value = ""; // permet de re-choisir le même fichier
        }}
        className="hidden"
      />
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}
