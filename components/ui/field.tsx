import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full border border-hairline bg-surface px-3 text-[0.95rem] text-ink",
        "outline-none transition-colors placeholder:text-ink-faint",
        "focus-visible:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold/25",
        className,
      )}
      {...props}
    />
  );
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="border-l-2 border-danger bg-danger/8 px-3 py-2 text-[0.85rem] text-danger"
    >
      {children}
    </p>
  );
}

export function FormNotice({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p
      role="status"
      className="border-l-2 border-success bg-success/8 px-3 py-2 text-[0.85rem] text-success"
    >
      {children}
    </p>
  );
}
