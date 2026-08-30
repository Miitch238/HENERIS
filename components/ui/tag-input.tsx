"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  name,
  label,
  hint,
  placeholder = "Ajouter, puis Entrée",
  defaultValue = [],
  max = 8,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string[];
  max?: number;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.length >= max) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) return;
    setTags([...tags, value.slice(0, 40)]);
    setDraft("");
  };

  return (
    <div className="grid gap-1.5">
      <span className="text-[0.8rem] font-medium text-ink">{label}</span>

      <div className="flex flex-wrap gap-1.5 border border-hairline bg-surface p-2 focus-within:border-gold-deep">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-sunk px-2 py-1 text-[0.8rem] text-ink"
          >
            {tag}
            <button
              type="button"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
              aria-label={`Retirer ${tag}`}
              className="text-ink-faint hover:text-danger"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {tags.length < max && (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add(draft);
              } else if (e.key === "Backspace" && !draft && tags.length) {
                setTags(tags.slice(0, -1));
              }
            }}
            onBlur={() => add(draft)}
            aria-label={label}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-[0.9rem] text-ink outline-none placeholder:text-ink-faint"
          />
        )}
      </div>

      <input type="hidden" name={name} value={tags.join(",")} />
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}
